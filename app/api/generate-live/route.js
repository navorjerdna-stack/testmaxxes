import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.FAL_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    const { face_image_url, driving_audio_text } = body;

    // Validate required fields
    if (!face_image_url || typeof face_image_url !== 'string') {
      return Response.json({ error: 'Invalid face_image_url' }, { status: 400 });
    }
    if (!driving_audio_text || typeof driving_audio_text !== 'string') {
      return Response.json({ error: 'Invalid driving_audio_text' }, { status: 400 });
    }

    const result = await fal.subscribe("fal-ai/live-portrait", {
      input: { face_image_url, driving_audio_text }
    });

    return Response.json(result);
  } catch (error) {
    console.error('Live video generation error:', error);
    return Response.json({ error: 'Failed to generate live video' }, { status: 500 });
  }
}
