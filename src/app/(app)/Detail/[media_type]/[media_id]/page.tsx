// import { useParams } from 'next/navigation'
// import useSWR from 'swr'

import Header from '@/app/(app)/Header'

import LaravelFetch from '@/components/Reviews/LaravelFetch'

import AvgRating from '@/components/AvgRating'
import DetailPage from '@/components/Detail/DetailPage'
// import AverageProvider from '@/store/average'
// import AverageProvider from '@/context/AverageContext'

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

            <DetailPage
                detail={detail}
                combinedData={combinedData}
                media_type={media_type}
                media_id={media_id}
            />
        </div>
    )
}

export default Detail
