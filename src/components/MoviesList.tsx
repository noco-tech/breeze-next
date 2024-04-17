'use client'

// import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'



// async function fetcher(key: string) {
//    return fetch(key).then((res) => res.json())
// }
const fetcher = (url: string): Promise<any> =>
    fetch(url).then(res => res.json())


const MoviesList = () => {
    // const [movies, setMovies] = useState([])

    const {data, error} = useSWR(
        `${process.env.NEXT_PUBLIC_FRONT_URL}/api/getPopularMovies`, fetcher
    )
    // console.log(data)

    if (error) return <div className='text-center'>Loading Failed</div>
    if (!data) return <div className='text-center'>読み込み中...</div>

    // useEffect(() => {
    //     const fetchMovies = async () => {
    //         try {
    //             const res = await fetch(
    //                 `${process.env.NEXT_PUBLIC_FRONT_URL}/api/getPopularMovies`,
    //             )
    //             const fetchMovie = await res.json()
    //             // console.log(fetchMovie.data.results)

    //             setMovies(fetchMovie.data.results)
    //             // console.log(movies)
    //         } catch (err) {
    //             console.log(err)
    //         }
    //     }
    //     fetchMovies()
    // }, [])


    return (
        <div>
            <Swiper
                spaceBetween={30}
                slidesPerView={3}
                onSlideChange={() => console.log('slide change')}
                onSwiper={swiper => console.log(swiper)}
                breakpoints={{
                    // 320以上
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    // 480以上
                    480: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                    640: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 5,
                        spaceBetween: 40,
                    },
                }}>
                {/* dataが取得できていとmapでエラー出る為、data && をつける*/}
                {data && data.data.results.map(movie => (
                    <SwiperSlide key={movie.id}>
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default MoviesList
