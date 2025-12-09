import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.FAL_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, history, nsfw, companion } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Invalid message' }, { status: 400 });
    }
    if (!companion || typeof companion !== 'string') {
      return Response.json({ error: 'Invalid companion' }, { status: 400 });
    }
    if (nsfw !== undefined && typeof nsfw !== 'boolean') {
      return Response.json({ error: 'Invalid nsfw value' }, { status: 400 });
    }
    if (!Array.isArray(history)) {
      return Response.json({ error: 'Invalid history' }, { status: 400 });
    }

    const system = `Si ${companion}. ${nsfw ? "Lahko si zelo ekspliciten in NSFW." : "Bodi prijazen in varen."}
  Odgovarjaj v slovenščini.`;

    const result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: "anthropic/claude-3.5-sonnet",
        prompt: `${system}\nZgodovina: ${JSON.stringify(history)}\nUporabnik: ${message}\nTi:`,
        temperature: nsfw ? 0.9 : 0.7,
      },
    });

    const reply = result.data?.output || result.data?.text || "Oprostite, nisem mogel odgovoriti.";
    return Response.json({ reply });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
