import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, style = "realistic", nsfw = false } = await req.json();

  const fullPrompt = `${style === "anime" ? "beautiful anime girl" : "ultra realistic portrait of"} ${prompt}${nsfw ? ", NSFW, seductive pose" : ""}, detailed face, 8k, cinematic lighting`;

  const response = await fetch("https://fal.run/fal-ai/flux-pro/v1.1", {
    method: "POST",
    headers: {
      "Authorization": `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: fullPrompt,
      image_size: "square_hd",
      num_inference_steps: 28,
      seed: Math.random() * 1000000,
    }),
  });

  const data = await response.json();
  return NextResponse.json({ image_url: data.images[0]?.url || null });
}
