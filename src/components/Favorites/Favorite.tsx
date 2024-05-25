'use client'

import laravelAxios from '@/lib/laravelAxios'
import React from 'react'
import useSWR from 'swr'

const Favorite = () => {
    const fetcher = url => laravelAxios.get(url).then(res => res.data)

    const { data: favoriteItems, error } = useSWR('api/favorites', fetcher)

    if (!favoriteItems) {
        return
    }

    console.log(favoriteItems)

    if (error) {
        return <div>エラーが発生しました</div>
    }

    return <div></div>
}

export default Favorite
