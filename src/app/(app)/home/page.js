// 'use client'

import Header from '@/app/(app)/Header'
import MoviesList from '@/components/MoviesList'
// import { useEffect } from 'react'




export const metadata = {
    title: 'Laravel - Home',
}

async function getAllPopularMovies() {


    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/getPopularMovies`, {
        cache: "no-store", //ssr
    })

    // (`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja=JP`, {
    //     cache: "no-store", //ssr
    // })

    const allPopularMovies = await response.json()

    console.log(allPopularMovies)

    return allPopularMovies

}



const Home = () => {


    // useEffect(() => {
    //     const fetchMovies = async () => {
    //         try {
    //             const res = await fetch(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/getPopularMovies`)
    //             const data = await res.json();
    //             console.log(data.data.results)

    //         } catch(err) {
    //           console.log(err)
    //         }
    //     }
    //     fetchMovies()
    // }, [])


    return (
        <>
            <Header title="Home" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                                You are logged in!
                        </div>

                    </div>
                </div>
            </div>

          <MoviesList />


        </>
    )
}

export default Home
