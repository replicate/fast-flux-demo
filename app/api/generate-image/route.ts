import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const text = searchParams.get('text')

  // Mock image generation by using placeholder.com
  const width = 300
  const height = 300
  const imageUrl = `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text || '')}`

  return NextResponse.json({ imageUrl })
}