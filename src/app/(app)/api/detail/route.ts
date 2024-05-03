// 使用していないページです

import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _req: NextRequest,
    {
        params,
    }: {
        params: { media_type: string; media_id: string }
    },
) {
    const url = `
      https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`

    const res = await fetch(url)
    const data = await res.json()

    // console.log(data)

    return new NextResponse(data)
}
