import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.FAL_KEY });

export async function POST(req) {
  const { message, history, nsfw, companion } = await req.json();

  const system = `Si ${companion}. ${nsfw ? "Lahko si zelo ekspliciten in NSFW." : "Bodi prijazen in varen."}
  Odgovarjaj v slovenščini.`;

  const result = await fal.subscribe("fal-ai/any-llm", {
    input: {
      model: "anthropic/claude-3.5-sonnet",
      prompt: `${system}\nZgodovina: ${JSON.stringify(history)}\nUporabnik: ${message}\nTi:`,
      temperature: nsfw ? 0.9 : 0.7,
    },
  });

  return Response.json({ reply: result.data });
}
