'use client'

import laravelAxios from '@/lib/laravelAxios'
import AddIcon from '@mui/icons-material/Add'
import {
    Box,
    Button,
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
import { useParams } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = url => laravelAxios.get(url).then(res => res.data)

const LaravelFetch = () => {
    const params = useParams()
    const { media_type, media_id } = params
    // console.log(media_id, media_type)
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(4)
    const [review, setReview] = useState('')

    const { data, error } = useSWR(
        `api/reviews/${media_type}/${media_id}`,
        fetcher,
    )

    if (!data) {
        return
    }
    console.log(data)

    if (error) return <div className="text-center">Loading Failed</div>
    if (!data) return <div className="text-center">読み込み中...</div>

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

    const handleReviewAdd = async () => {
        try {
            const res = await laravelAxios.post(`api/reviews`, {
                content: review,
                rating: rating,
                media_type: media_type,
                media_id: media_id,
          })
        } catch(err) {
          console.log(err)
        }
    }

    const isDisabled = !rating || !review.trim()

    const reviews = [
        {
            id: 1,
            content: 'おもろい',
            rating: 4,

            user: {
                name: '山田花子',
            },
        },
        {
            id: 2,
            content: 'tyo-おもろい',
            rating: 5,

            user: {
                name: '山田taro',
            },
        },
        {
            id: 3,
            content: 'おもろい',
            rating: 2,

            user: {
                name: '山田man',
            },
        },
    ]

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
                    {reviews.map(review => (
                        <Grid item xs={12} key={review.id}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        component={'div'}
                                        variant="h6"
                                        gutterBottom>
                                        {review.user.name}
                                    </Typography>

                                    <Rating value={review.rating} readOnly />

                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        paragraph>
                                        {review.content}
                                    </Typography>
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
                        bgcolor: 'background-paper',
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
                        disabled={isDisabled}
                        onClick={handleReviewAdd}>
                        送信
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default LaravelFetch
