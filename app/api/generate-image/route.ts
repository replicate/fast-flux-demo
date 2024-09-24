import { NextResponse } from 'next/server'
import Replicate, { Prediction } from 'replicate'


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
  
  let prediction
  const onProgress = (predictionData) => {
    prediction = predictionData;
    console.log({ prediction });
  };

  await replicate.run(model, { input }, onProgress)

  if (prediction === null) {
    // Handle the case where prediction is still null
    return NextResponse.json({ error: "Prediction not available" });
  }

  return NextResponse.json({ prediction })
}