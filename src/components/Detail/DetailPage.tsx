'use client'

import React, { useState } from 'react'

import { Box, Container, Grid, IconButton, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'

import AvgRating from '../AvgRating'
import laravelAxios from '@/lib/laravelAxios'
import LaravelFetch from '../Reviews/LaravelFetch'

const DetailPage = ({ detail, combinedData, media_type, media_id }) => {
    const [average, setAverage] = useState(null)
    const [isFavorited, setIsFavorited] = useState(false)

    // お気に入りボタン押下時
    const handleToggleFavorite = async () => {
        try {
            const res = await laravelAxios.post(`api/favorites`, {
                media_type: media_type,
                media_id: media_id,
            })
            // console.log(res.data)
            setIsFavorited(res.data.status === 'added')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <Box
                sx={{
                    height: { xs: 'auto', md: '70vh' },
                    //   bgcolor: 'red',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${detail.backdrop_path})`,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',

                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)',
                        },
                    }}
                />

                <Container sx={{ zIndex: 1 }}>
                    <Grid
                        sx={{ color: 'white' }}
                        container
                        alignItems={'center'}>
                        <Grid
                            sx={{ display: 'flex', justifyContent: 'center' }}
                            item
                            md={3}>
                            <img
                                src={`https://image.tmdb.org/t/p/original${detail.poster_path}`}
                                alt=""
                                width={'70%'}
                            />
                        </Grid>
                        <Grid sx={{}} item md={8}>
                            {/* 作品名 */}
                            <Typography variant="h4" paragraph>
                                {detail.title || detail.name}
                            </Typography>

                            {/* お気に入りボタン */}
                            <IconButton
                                style={{
                                    color: isFavorited ? 'red' : 'white',
                                    background: '#0d253f',
                                    marginBottom: '10px',
                                }}
                                onClick={handleToggleFavorite}>
                                <FavoriteIcon />
                            </IconButton>

                            {/* 作品の評価 平均 */}
                            <AvgRating average={average} />

                            <Typography paragraph>
                                {combinedData.overview}
                            </Typography>
                            <Typography>
                                {media_type == 'movie'
                                    ? `公開日: ${detail.release_date}`
                                    : `初回放送日: ${detail.first_air_date}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* レビュー内容を表示 */}
            <LaravelFetch
                average={average}
                setAverage={setAverage}
                setIsFavorited={setIsFavorited}
            />
        </div>
    )
}

export default DetailPage
