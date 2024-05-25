'use client'

import { useAverage } from '@/context/AverageContext'
import { useAuth } from '@/hooks/auth'
import laravelAxios from '@/lib/laravelAxios'
import { useStoreInContext } from '@/store/average'
import AverageContext from '@/store/average'

import AddIcon from '@mui/icons-material/Add'
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Container,
    Fab,
    Grid,
    Modal,
    Rating,
    TextareaAutosize,
    Tooltip,
    Typography,
} from '@mui/material'
import Link from 'next/link'

import { useParams } from 'next/navigation'
import { useContext, useState } from 'react'
import useSWR from 'swr'

// laravelからuseSWRとaxiosでデータ取得
// const fetcher = url => laravelAxios.get(url).then(res => res.data)

const fetcher = (...args) => {
    const requests = args.map(axiosConfig => laravelAxios(axiosConfig))
    return Promise.all(requests)
}

const LaravelFetch = ({ average, setAverage, setIsFavorited }) => {
    const params = useParams()
    const { media_type, media_id } = params
    // console.log(media_id, media_type)
    const [open, setOpen] = useState(false)
    // レビューの星
    const [rating, setRating] = useState(4)

    // 打ち込んだ文字列が入るstate
    const [review, setReview] = useState('')
    // 投稿したときの内容と、DBからfetchした時の内容が入るstate
    const [reviews, setReviews] = useState([])

    // 投稿を編集
    const [editMode, setEditMode] = useState(null)
    const [editedRating, setEditedRating] = useState(null)
    // 編集した文字列が入るstate
    const [editedContent, setEditedContent] = useState('')

    // user情報を取得
    const { user } = useAuth({ middleware: 'guest' })

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const handleReviewChange = e => {
        setReview(e.target.value)
    }
    const handleRatingChange = (e, newValue) => {
        setRating(newValue)
    }

    // 星の平均値のグローバルステート 上手くいかなかった
    // const { average, setAverage } = useStoreInContext(state => ({
    //     average: state.average,
    //     setAverage: state.setAverage,
    // }))
    // const [average, setAverage] = useAverage()

    const handleReviewAdd = async () => {
        handleClose()
        try {
            const res = await laravelAxios.post(`api/reviews`, {
                content: review,
                rating: rating,
                media_type: media_type,
                media_id: media_id,
            })
            const newReview = res.data
            setReviews(prevReviews => [...prevReviews, newReview])
            // console.log(newReview)
            setReview('')
            setRating(4)

            const updateReviews = [...reviews, newReview]
            // console.log(updateReviews)
            updateAverageRating(updateReviews)
            // console.log(average)
        } catch (err) {
            console.error(err)
        }
    }

    // 星の平均を求める
    const updateAverageRating = updateReviews => {
        if (updateReviews.length > 0) {
            // 星の合計値
            const totalRating = updateReviews.reduce(
                (acc, review) => acc + review.rating,
                0,
            )

            // 平均
            const avg = (totalRating / updateReviews.length).toFixed(1) // toFixed(1)で小数第一位まで表示
            setAverage(avg)
        } else {
            setAverage(null)
        }
    }

    // レビュー投稿削除ボタン
    const handleDelete = async id => {
        if (window.confirm('レビューを削除してもよろしいですか？')) {
            try {
                const res = await laravelAxios.delete(`api/reviews/${id}`)
                console.log(res)
                // ボタンが押されたら、それ以外を取得する
                const filteredReviews = reviews.filter(
                    review => review.id !== id,
                )
                setReviews(filteredReviews)
                updateAverageRating(filteredReviews)
            } catch (err) {
                console.log(err)
            }
        }
    }

    // 投稿を編集ボタンを押した時の処理
    const handleEdit = review => {
        setEditMode(review.id)
        setEditedRating(review.rating)
        setEditedContent(review.content)
    }

    // 編集確定ボタンを押した時の処理 dbへ送信
    const handleConfirmEdit = async reviewId => {
        try {
            const res = await laravelAxios.put(`api/review/${reviewId}`, {
                content: editedContent,
                rating: editedRating,
            })
            // console.log(res)
            const updatedReview = res.data

            const updatedReviews = reviews.map(review => {
                if (review.id === reviewId) {
                    return {
                        ...review,
                        content: updatedReview.content,
                        rating: updatedReview.rating,
                    }
                }
                return review
            })
            setReviews(updatedReviews)
            setEditMode(null)
        } catch (err) {
            console.log(err)
        }
    }

    // laravelからuseSWRとaxiosでデータ取得
    const { data, error } = useSWR(
        [
            `api/reviews/${media_type}/${media_id}`,
            {
                url: 'api/favorites/status',
                params: {
                    media_type: media_type,
                    media_id: media_id,
                },
            },
        ],
        fetcher,
        {
            // onSuccess: data => {
            //     setReviews(data)
            //     updateAverageRating(data)
            // },
            onSuccess: ([reviewResponse, favoriteResponse]) => {
                const fetchReviews = reviewResponse.data
                const fetchFavorites = favoriteResponse.data

                setReviews(fetchReviews)
                updateAverageRating(fetchReviews)

                // console.log(fetchFavorites)
                setIsFavorited(fetchFavorites)
            },
            onError: err => {
                console.error('Error:', err)
            },
        },
    )

    if (error) return <div className="text-center">Loading Failed</div>
    if (!data) return <div className="text-center">読み込み中...</div>

    // 投稿ボタン　空白投稿禁止
    const isButtonDisabled = (rating, content) => {
        return !rating || !content.trim()
    }
    // 投稿ボタン
    const isReviewButtonDisabled = isButtonDisabled(rating, review)
    // 編集確定ボタン
    const isEditButtonDisabled = isButtonDisabled(editedRating, editedContent)

    // const reviews = [
    //     {
    //         id: 1,
    //         content: 'おもろい',
    //         rating: 4,

    //         user: {
    //             name: '山田花子',
    //         },
    //     },
    //     {
    //         id: 2,
    //         content: 'tyo-おもろい',
    //         rating: 5,

    //         user: {
    //             name: '山田taro',
    //         },
    //     },
    //     {
    //         id: 3,
    //         content: 'おもろい',
    //         rating: 2,

    //         user: {
    //             name: '山田man',
    //         },
    //     },
    // ]

    return (
        <div>
            {/* レビュー内容表示 */}
            <Container sx={{ py: 4 }}>
                <Typography
                    component={'h1'}
                    variant="h4"
                    align="center"
                    gutterBottom>
                    レビュー一覧
                </Typography>

                <Grid container spacing={3}>
                    {reviews?.map(review => (
                        <Grid item xs={12} key={review.id}>
                            <Card>
                                <CardContent>
                                    {/* ユーザー名 */}
                                    <Typography
                                        component={'div'}
                                        variant="h6"
                                        gutterBottom>
                                        {review.user.name}
                                    </Typography>
                                    {editMode === review.id ? (
                                        <div>
                                            {/* 編集ボタンを押下後 */}
                                            <Rating
                                                value={editedRating}
                                                onChange={(e, newValue) =>
                                                    setEditedRating(newValue)
                                                }
                                            />
                                            <TextareaAutosize
                                                minRows={3}
                                                style={{ width: '100%' }}
                                                value={editedContent}
                                                onChange={e =>
                                                    setEditedContent(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            {/* 星 */}
                                            <Rating
                                                value={review.rating}
                                                readOnly
                                            />
                                            {/* レビュー内容 */}
                                            <Link
                                                href={`/Detail/${media_type}/${media_id}/review/${review.id}`}>
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    paragraph>
                                                    {review.content}
                                                </Typography>
                                            </Link>
                                        </div>
                                    )}

                                    {/* loginしているuserだけ削除ボタン表示 */}
                                    {user?.id === review.user.id && (
                                        <Grid
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}>
                                            {editMode === review.id ? (
                                                // 編集中の表示 編集確定ボタン
                                                <Button
                                                    onClick={() =>
                                                        handleConfirmEdit(
                                                            review.id,
                                                        )
                                                    }
                                                    disabled={
                                                        isEditButtonDisabled
                                                    }>
                                                    投稿する
                                                </Button>
                                            ) : (
                                                <ButtonGroup>
                                                    <Button
                                                        onClick={() =>
                                                            handleEdit(review)
                                                        }>
                                                        編集
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                review.id,
                                                            )
                                                        }>
                                                        削除
                                                    </Button>
                                                </ButtonGroup>
                                            )}
                                        </Grid>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* 投稿機能 追加ボタン */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    zIndex: 4,
                }}>
                {/* レビュー追加ボタン */}
                <Tooltip title="レビュー追加">
                    <Fab
                        style={{ background: '#1976d2', color: 'white' }}
                        onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>

            {/* モーダル */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px, solid, #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                    <Typography variant="h6" component={'h2'}>
                        レビューを書く
                    </Typography>

                    <Rating
                        required
                        onChange={handleRatingChange}
                        value={rating}
                    />

                    <TextareaAutosize
                        required
                        minRows={5}
                        placeholder="レビュー内容"
                        style={{ width: '100%', marginTop: '10px' }}
                        onChange={handleReviewChange}
                        value={review}
                    />
                    {/* レビュー送信ボタン */}
                    <Button
                        variant="outlined"
                        disabled={isReviewButtonDisabled}
                        onClick={handleReviewAdd}>
                        送信
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default LaravelFetch
