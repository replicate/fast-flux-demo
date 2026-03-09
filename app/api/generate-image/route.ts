import Replicate from "replicate";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const replicate = new Replicate();
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("text");

  const model = "black-forest-labs/flux-schnell";
  const input = {
    prompt,
    go_fast: true,
    num_outputs: 1,
    aspect_ratio: "1:1",
    output_format: "webp",
    output_quality: 80,
    megapixels: "0.25",
    num_inference_steps: 2,
  };

  const output = await replicate.run(model, { input });
  const first = Array.isArray(output) ? output[0] : null;
  if (!first || typeof first !== "object" || typeof (first as { url?: unknown }).url !== "function") {
    return NextResponse.json({ error: "Unexpected output from model" }, { status: 500 });
  }
  const imageUrl = (first as { url: () => URL }).url().href;
  return Response.redirect(imageUrl, 307);
}
