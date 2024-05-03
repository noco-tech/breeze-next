// 'use client'

// import { useSearchParams } from 'next/navigation'
// import useSWR from 'swr'

import Header from '../Header'
import Layout from '@/components/Layouts/Layout'
import Sidebar from '@/components/Sidebar'
import MediaCard from '@/components/MediaCard'
import { Grid, Typography } from '@mui/material'
// import useMediaStore from '@/store/useMediaStore'
import StoreProvider, { useStoreInContext } from '@/store/context'


export const metadata = {
    title: 'Laravel - Search',
}

// const fetcher = (url: string): Promise<any> =>
//     fetch(url).then(res => res.json())

async function getSearchData(searchQuery: string): Promise<any> {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${
                process.env.TMDB_API_KEY
            }&query=${encodeURIComponent(searchQuery)}&language=ja-JP`,
        )
        if (!res) {
            return
        }
        return await res.json()
    } catch (error) {
        console.error('Failed to fetch data')
        throw error
    }
}

const search = async ({
    searchParams: { query },
}: {
    searchParams: { query: string }
}) => {
    const searchData = await getSearchData(query)

    // const search = await searchData //あれ？今回はいらない

    const searchResults = searchData.results
    // tv, movieだけ取得する
    const validResults = searchResults.filter(
        (item: any) => item.media_type == 'movie' || item.media_type == 'tv',
    )

    // const searchParams = useSearchParams()
    // const searchQuery = searchParams.get('query')
    // console.log(searchQuery)

    //    const { data, error } = useSWR(
    //        searchQuery
    //            ? `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&language=ja-JP`
    //            : null,
    //        fetcher,
    //    )

    //    if (error) return <div>Failed to load</div>
    //    if (!data) return <div>Loading...</div>



    return (
        <div>
            <Header title="Search" />

            <StoreProvider>
                <Layout sidebar={<Sidebar />}>
                    {/* <Suspense fallback={<Loading />}> */}
                        {validResults.length > 0 ? (
                            <Grid container spacing={3}>
                                {validResults.map(media => (
                                    <MediaCard key={media.id} item={media} />
                                ))}
                            </Grid>
                        ) : (
                            <Grid item textAlign={'center'} xs={12}>
                                <Typography>
                                    検索結果が見つかりませんでした
                                </Typography>
                            </Grid>
                        )}
                    {/* </Suspense> */}
                </Layout>
            </StoreProvider>
        </div>
    )
}

export default search
