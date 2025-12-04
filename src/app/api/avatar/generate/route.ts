import { NextRequest, NextResponse } from 'next/server';

// Avatar generation using placeholder API (DiceBear for anime, UI Avatars for realistic)
// In production, you could integrate with DALL-E, Stable Diffusion, etc.

export async function POST(request: NextRequest) {
  try {
    const { description, style, userId } = await request.json();

    if (!description || !style || !userId) {
      return NextResponse.json(
        { error: 'Description, style, and userId are required' },
        { status: 400 }
      );
    }

    // Generate a unique seed from description for consistent results
    const seed = hashString(description + userId);

    let avatarUrl: string;

    if (style === 'anime') {
      // DiceBear Avatars - anime style (bottts, adventurer, lorelei)
      // Using adventurer-neutral for anime-like style
      avatarUrl = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${seed}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede&backgroundType=gradientLinear`;
    } else {
      // DiceBear - realistic style (avataaars, big-smile, personas)
      avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear`;
    }

    return NextResponse.json({
      avatarUrl,
      description,
      style,
    });
  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate avatar' },
      { status: 500 }
    );
  }
}

// Simple hash function to generate consistent seed
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
