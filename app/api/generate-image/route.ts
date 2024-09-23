import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const text = searchParams.get('text')

  const width = 512
  const height = 512
  const imageUrl = `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text || '')}`

  return NextResponse.json({ imageUrl })
}