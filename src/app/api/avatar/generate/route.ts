import { NextRequest, NextResponse } from 'next/server';

// DiceBear API Configuration
// Update this version when DiceBear releases new API versions
const DICEBEAR_BASE_URL = 'https://api.dicebear.com';
const DICEBEAR_VERSION = '7.x';

// Avatar style configurations
const AVATAR_STYLES = {
  anime: {
    style: 'adventurer-neutral',
    backgroundColor: 'ffdfbf,ffd5dc,d1d4f9,c0aede',
    backgroundType: 'gradientLinear',
  },
  realistic: {
    style: 'personas',
    backgroundColor: 'b6e3f4,c0aede,d1d4f9',
    backgroundType: 'gradientLinear',
  },
};

// Avatar generation using DiceBear API
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

    // Validate style
    if (style !== 'anime' && style !== 'realistic') {
      return NextResponse.json(
        { error: 'Style must be either "anime" or "realistic"' },
        { status: 400 }
      );
    }

    // Generate a unique seed from description for consistent results
    const seed = hashString(description + userId);

    // Get style configuration
    const styleConfig = AVATAR_STYLES[style as keyof typeof AVATAR_STYLES];
    
    // Build avatar URL
    const avatarUrl = `${DICEBEAR_BASE_URL}/${DICEBEAR_VERSION}/${styleConfig.style}/svg?seed=${seed}&backgroundColor=${styleConfig.backgroundColor}&backgroundType=${styleConfig.backgroundType}`;

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
