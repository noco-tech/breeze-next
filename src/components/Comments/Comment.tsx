import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Grid,
    Rating,
    TextareaAutosize,
    Typography,
} from '@mui/material'
import React from 'react'

const Comment = ({
    comment,
    handleDelete,
    handleEdit,
    editMode,
    editedContent,
    setEditedContent,
    handleConfirmEdit,
}) => {
    return (
        <Card sx={{ minHeight: '200px' }}>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    {/* ユーザー名 */}
                    {comment.user.name}
                </Typography>
                {editMode === comment.id ? (
                    //   編集中のコメント
                    <TextareaAutosize
                        minRows={3}
                        style={{ width: '100%' }}
                        value={editedContent}
                        onChange={e => {
                            setEditedContent(e.target.value)
                        }}
                    />
                ) : (
                    <div>
                        {/* <Rating name="read-only" value={review.rating} readOnly /> */}

                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p">
                            {/* コメント内容 */}
                            <div>{comment.content}</div> 
                        </Typography>
                    </div>
                )}

                <Grid container justifyContent="flex-end">
                    {editMode === comment.id ? (
                        <Button onClick={() => handleConfirmEdit(comment.id)}>
                            編集確定
                        </Button>
                    ) : (
                        <ButtonGroup>
                            <Button onClick={() => handleEdit(comment)}>
                                編集
                            </Button>
                            <Button
                                color="error"
                                onClick={() => handleDelete(comment.id)}>
                                削除
                            </Button>
                        </ButtonGroup>
                    )}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default Comment
