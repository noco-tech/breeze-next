
import { NextResponse, NextRequest } from 'next/server'

interface Params {
    media_type: string
    media_id: string
}

export async function GET(
    request: NextRequest,
    { params }: { params: { media_type: string; media_id: string } },
): NextResponse {
    const { media_type, media_id } = params

    const url = `
      https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`

    const res = await fetch(url)

    if (!res.ok) {
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 },
        )
    }

    const data = await res.json()
    // console.log(data)

    return new NextResponse(data)
}
