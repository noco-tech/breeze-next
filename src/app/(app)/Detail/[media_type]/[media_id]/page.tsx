// import { useParams } from 'next/navigation'
// import useSWR from 'swr'

import Header from '@/app/(app)/Header'
import { Box, Container, Grid, Typography } from '@mui/material'

import laravelAxios from '@/lib/laravelAxios'
import LaravelFetch from '@/components/LaravelFetch'

// const fetcher = (url: string): Promise<any> =>
//   fetch(url).then(res => res.json())

export const metadata = {
    title: 'Laravel - Detail',
}

async function getDetailData(media_type: string, media_id: string) {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`,
        )

        let combinedData = { ...res }

        if (combinedData.overview) {
            const enRes = await fetch(
                `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
            )
            combinedData.overview = enRes.overview

            if (!enRes.ok) {
                throw new Error('Failed to fetch data')
            }
        }

        if (!res.ok) {
            const errorBody = await res.json()
            throw new Error(
                `API error: ${res.status} ${errorBody.status_message}`,
            )
        }

        return await res.json()
    } catch (error) {
        console.error('Failed to fetch data')
        throw error
    }
}

async function getDetailUSData(media_type: string, media_id: string) {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
        )

        if (!res.ok) {
            const errorBody = await res.json()
            throw new Error(
                `API error: ${res.status} ${errorBody.status_message}`,
            )
        }
        return await res.json()
    } catch (error) {
        console.error('Failed to fetch data', error)
        throw error
    }
}

// laravelのaxiosからデータを取得
async function fetchReviews(media_type: string, media_id: string) {
    try {
        const res = await laravelAxios.get(
            `api/reviews/${media_type}/${media_id}`,
        )
        await laravelAxios.get('/sanctum/csrf-cookie')

        if (!res) {
            return
        }

        return await res
    } catch (error) {
        console.error('Failed to fetch data', error)
        throw error
    }
}

const Detail = async ({
    params,
}: {
    params: { media_type: string; media_id: string }
}) => {
    // const params = useParams<{ media_type: string; media_id: string }>()
    const { media_type, media_id } = params
    const detailData = await getDetailData(media_type, media_id)

    const detail = await detailData
    // const [detail] = await Promise.all([detailData])

    // overviewが空の場合はUSのoverviewを表示
    const detailUSData = await getDetailUSData(media_type, media_id)
    const usDetail = await detailUSData

    let combinedData = { ...detail }

    if (!detail.overview) {
        combinedData.overview = usDetail.overview
    }

    // laravelからデータ取得
    // const fetchReviewsData = await fetchReviews(media_type, media_id)

    // const reviews = await fetchReviewsData


    return (
        <div>
            <Header title="Detail" />

            <Box
                sx={{
                    height: { xs: 'auto', md: '70vh' },
                    bgcolor: 'red',
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
                            md={4}>
                            <img
                                src={`https://image.tmdb.org/t/p/original${detail.poster_path}`}
                                alt=""
                                width={'70%'}
                            />
                        </Grid>
                        <Grid sx={{}} item md={8}>
                            <Typography variant="h4" paragraph>
                                {detail.title || detail.name}
                            </Typography>

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
            <LaravelFetch />
            {/* 投稿機能 */}
            
        </div>
    )
}

export default Detail
