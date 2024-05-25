import { Grid } from '@mui/material'
import React, { useState } from 'react'
import Comment from './Comment'
import laravelAxios from '@/lib/laravelAxios'

const CommentList = ({ comments, setComments }) => {

    const [editMode, setEditMode] = useState(null)
    const [editedContent, setEditedContent] = useState('')

    const handleDelete = async commentId => {
        try {
            const res = await laravelAxios.delete(`api/comments/${commentId}`)
            // console.log(res.data)

            const filteredComments = comments.filter(
                comment => comment.id !== commentId,
            )
            setComments(filteredComments)
        } catch (err) {
            console.log(err)
        }
    }

    const handleEdit = async (comment) => {
        setEditMode(comment.id)
        setEditedContent(comment.content)
    }

    // 編集確定ボタン押した時の処理
    const handleConfirmEdit = async (commentId) => {
        try {
            const res = await laravelAxios.put(`api/comments/${commentId}`, {
                content: editedContent,

            })
            // console.log(res.data)

            const updatedComment = res.data.content
            const updatedComments = comments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment, content: updatedComment
                    }
                }
                return comment
            })
            // console.log(updatedComments)
            setComments(updatedComments)
            setEditMode(null)

        } catch (err) {
            console.log(err)
       }
    }

    return (
        <Grid container spacing={3} sx={{ mt: 2 }}>
            {comments.map(comment => (
                <Grid item xs={12} key={comment.id}>
                    <Comment
                        comment={comment}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        editMode={editMode}
                        editedContent={editedContent}
                        setEditedContent={setEditedContent}
                        handleConfirmEdit={handleConfirmEdit}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default CommentList
