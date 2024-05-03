'use client'

import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from '@mui/material'

import { useStoreInContext } from '@/store/context'
import Link from 'next/link'

// type Props = {
//     searchResults: any
//     tvData: any
//     movieData: any
// }

const MediaCard = ({ item }) => {
    // const category = useMediaStore(state => state.category)

    const { category } = useStoreInContext(state => ({
        category: state.category,
    }))

    // const filteredResults = (item.filter(result => {
    //     if (category == 'all') {
    //         return true
    //     }
    //     return result.media_type === category
    // }))
    // console.log(filteredResults)



    if (category !== 'all' && item.media_type !== category) {
        return null
    }

    console.log(item)

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card>
                <CardActionArea>
                    <Link href={`/Detail/${item.media_type}/${item.id}`}>
                    <CardMedia
                        component={'img'}
                        sx={{ aspectRatio: '2/3' }}
                        image={
                            item.poster_path
                                ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                                : 'media_poster_img/NO_IMAGE.jpg'
                        }
                    />
                    <CardContent>
                        <Typography variant="h6" component={'div'} noWrap>
                            {item.title || item.name}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            component={'div'}
                            color="textSecondary">
                            公開日:{item.release_date ||
                                item.first_air_date}
                        </Typography>
                        </CardContent>
                        </Link>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default MediaCard
