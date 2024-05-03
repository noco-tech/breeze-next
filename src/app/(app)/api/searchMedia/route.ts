import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const searchQuery = searchParams.get('query')

    const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&language=ja-JP`

    const res = await fetch(url)
    const data = await res.json()

    return Response.json({ data })
}

