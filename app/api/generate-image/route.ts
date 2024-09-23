import { NextResponse } from 'next/server'
import Replicate from 'replicate'

export async function GET(request: Request) {
  const replicate = new Replicate()
  const { searchParams } = new URL(request.url)
  const prompt = searchParams.get('text')

  const model = "black-forest-labs/flux-schnell"
  const input = {
    prompt,
    go_fast: true,
    num_outputs: 1,
    aspect_ratio: "1:1",
    output_format: "webp",
    output_quality: 80
  };
  
  const output = await replicate.run(model, { input }) as string[]

  if (output.length === 0) {
    return NextResponse.json({ error: 'No image generated' }, { status: 500 })
  }

  return NextResponse.json({ imageUrl: output[0] })
}