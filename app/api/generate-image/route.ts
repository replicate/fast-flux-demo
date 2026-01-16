import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("text");
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse("API token is required", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const replicate = new Replicate({
    auth: token,
  });

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

  try {
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
  } catch (error) {
    console.error("Error generating image:", error);
    return new NextResponse("Failed to generate image. Please check your API token.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
