import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/claude';
import { getUser, getChatHistory, addChatMessage } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const { userId, message, role } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'userId and message are required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is paid
    if (!user.isPaid) {
      return NextResponse.json(
        { error: 'Premium subscription required', requiresPayment: true },
        { status: 402 }
      );
    }

    // Get chat history
    const chatHistory = await getChatHistory(userId);

    // Add user message to history
    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: Date.now(),
    };
    await addChatMessage(userId, userMessage);

    // Generate response using Claude
    const response = await generateChatResponse(
      [...chatHistory, userMessage],
      role || 'girlfriend',
      user.name
    );

    // Add assistant response to history
    const assistantMessage = {
      role: 'assistant' as const,
      content: response,
      timestamp: Date.now(),
    };
    await addChatMessage(userId, assistantMessage);

    return NextResponse.json({
      message: response,
      timestamp: assistantMessage.timestamp,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    );
  }

  const chatHistory = await getChatHistory(userId);
  return NextResponse.json({ messages: chatHistory });
}
