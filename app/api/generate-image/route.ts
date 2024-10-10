import { NextResponse } from "next/server";
import Replicate from "replicate";

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

  const output = await replicate.run(model, { input }) as string[];
  const headers = new Headers();
  headers.set("Content-Type", "image/*");
  headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  return new NextResponse(output[0], {
    status: 200,
    statusText: "OK",
    headers,
  });
}
