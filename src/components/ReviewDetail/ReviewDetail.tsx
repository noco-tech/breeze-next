'use client'

import laravelAxios from '@/lib/laravelAxios'
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Rating,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import useSWR from 'swr'
import CommentList from '../Comments/CommentList'

const fetcher = url => laravelAxios.get(url).then(res => res.data)

const ReviewDetail = ({ reviewId }) => {
    const [review, setReview] = useState(null)
    const [comments, setComments] = useState([])
    const [content, setContent] = useState('')

    const { data, error } = useSWR(`api/review/${reviewId}`, fetcher, {
        onSuccess: data => {
            setReview(data)
            setComments(data.comments)
        },
        onError: err => {
            console.error(err)
        },
    })

    if (!data) return
    console.log(data)

    if (error) return <div className="text-center">Loading Failed</div>
    if (!data) return <div className="text-center">読み込み中...</div>

    const handleChange = e => {
        setContent(e.target.value)
    }

    // コメント返信フォーム
    const handleCommentAdd = async e => {
        e.preventDefault()
        const trimmedContent = content.trim()
        if (!trimmedContent) {
            return
        }

        try {
            const res = await laravelAxios.post(`api/comments`, {
                content: trimmedContent,
                review_id: reviewId,
            })
            // console.log(res.data)
            const newComment = res.data
            setComments([...comments, newComment])
            setContent('')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Container sx={{ py: 2 }}>
            {/* レビュー内容 */}
            <Card sx={{ minHeight: '200px' }}>
                <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                        {/* ユーザー名 */}
                        {review.user.name}
                    </Typography>

                    <Rating name="read-only" value={review.rating} readOnly />

                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p">
                        {/* レビュー内容 */}
                        {review.content}
                    </Typography>
                </CardContent>
            </Card>

            {/* コメント編集用のフォーム */}
            <Box
                onSubmit={handleCommentAdd}
                component="form"
                noValidate
                autoComplete="off"
                p={2}
                sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    bgcolor: 'black',
                }}>
                <TextField
                    sx={{ backgroundColor: 'white' }}
                    inputProps={{ maxLength: 200 }}
                    error={content.length > 200}
                    helperText={
                        content.length > 200 ? '200文字を超えています' : ''
                    }
                    fullWidth
                    label="comment"
                    variant="outlined"
                    value={content}
                    sx={{ mr: 1, flexGrow: 1 }}
                    onChange={handleChange}
                />
                <Button
                    variant="contained"
                    type="submit"
                    style={{
                        backgroundColor: '#1976d2',
                        color: '#fff',
                    }}>
                    送信
                </Button>
            </Box>

            {/* コメント */}
            <CommentList comments={comments} setComments={setComments} />
        </Container>
    )
}

export default ReviewDetail
