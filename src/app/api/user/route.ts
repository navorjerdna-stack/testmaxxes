import { NextRequest, NextResponse } from 'next/server';
import { getUser, setUser, updateUser, User } from '@/lib/kv';
import { v4 as uuidv4 } from 'uuid';

// Create or get user
export async function POST(request: NextRequest) {
  try {
    const { userId, name, avatarUrl, avatarDescription, avatarStyle } = await request.json();

    // If userId provided, try to get existing user
    if (userId) {
      const existingUser = await getUser(userId);
      if (existingUser) {
        // Update existing user
        const updatedUser = await updateUser(userId, {
          name: name || existingUser.name,
          avatarUrl: avatarUrl ?? existingUser.avatarUrl,
          avatarDescription: avatarDescription ?? existingUser.avatarDescription,
          avatarStyle: avatarStyle || existingUser.avatarStyle,
        });
        return NextResponse.json({ user: updatedUser });
      }
    }

    // Create new user
    const newUserId = userId || uuidv4();
    const newUser: User = {
      id: newUserId,
      name: name || 'Friend',
      avatarUrl: avatarUrl || null,
      avatarDescription: avatarDescription || null,
      avatarStyle: avatarStyle || 'anime',
      isPaid: false,
      stripeCustomerId: null,
      createdAt: Date.now(),
    };

    await setUser(newUserId, newUser);
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
}

// Get user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    );
  }

  const user = await getUser(userId);
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}
