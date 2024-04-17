import { NextResponse } from "next/server"

export async function GET(req: Response) {
    // const allPopularMovies = await req.json()
    // return NextResponse.json(allPopularMovies)

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja=JP`

    const res = await fetch(url)
    const data = await res.json()

    // console.log(data)

    return Response.json({ data })
}


// export const GET = async () => {
//     const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja=JP`

//     const res = await fetch(url)
//     const data = await res.json()

//     console.log(data)
//     return data
// }
