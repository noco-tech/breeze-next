'use client'
import { Box, Rating, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'

import { useStoreInContext } from '@/store/average'
import { useAverage } from '@/context/AverageContext'




const AvgRating = ({average}) => {
    // 星の平均値のグローバルステート
//     const { average } = useStoreInContext(state => ({
//         average: state.average,
//   }))




    return (
        <Box
            gap={2}
            sx={{
                mt: -2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
            }}>
            <Rating
                readOnly
                precision={0.5}
                emptyIcon={<StarIcon style={{ color: 'white' }} />}
                value={parseFloat(average)}
            />
            <Typography
                sx={{
                    ml: 1,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                }}>
                {average}
            </Typography>
        </Box>
    )
}

export default AvgRating

