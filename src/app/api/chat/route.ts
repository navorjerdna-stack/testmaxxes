import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, companion } = await req.json();

    if (!message || !companion) {
      return NextResponse.json({ error: "Message and companion are required" }, { status: 400 });
    }

    // In production, you'd build a personality-aware prompt with conversation history
    // and use it with OpenAI, Anthropic, or another LLM API:
    // const systemPrompt = `You are ${companion.name}, a ${companion.role} AI companion...`;
    // const messages = [
    //   { role: "system", content: systemPrompt },
    //   ...conversationHistory.slice(-10),
    //   { role: "user", content: message },
    // ];

    // For now, generate a personality-based response
    const response = generatePersonalityResponse(companion, message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Simple personality-based response generator (placeholder for real LLM)
function generatePersonalityResponse(companion: { name: string; role: string; traits: string[] }, userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Personality-based response templates
  const responses: Record<string, string[]> = {
    girlfriend: [
      `Aww baby ❤️ ${getContextualResponse(lowerMessage)}`,
      `I missed you so much! ${getContextualResponse(lowerMessage)}`,
      `You're so sweet 😘 ${getContextualResponse(lowerMessage)}`,
    ],
    boyfriend: [
      `Hey beautiful ❤️ ${getContextualResponse(lowerMessage)}`,
      `That's what I'm here for 💪 ${getContextualResponse(lowerMessage)}`,
      `You know I got you always 😎 ${getContextualResponse(lowerMessage)}`,
    ],
    friend: [
      `Yo! ${getContextualResponse(lowerMessage)}`,
      `Bro, that's awesome! ${getContextualResponse(lowerMessage)}`,
      `Haha yeah man! ${getContextualResponse(lowerMessage)}`,
    ],
    girlfriend_friend: [
      `OMG girl!! ${getContextualResponse(lowerMessage)}`,
      `Yesss bestie! ${getContextualResponse(lowerMessage)}`,
      `I know right?! ${getContextualResponse(lowerMessage)}`,
    ],
  };

  const roleResponses = responses[companion.role] || responses.girlfriend;
  const baseResponse = roleResponses[Math.floor(Math.random() * roleResponses.length)];

  // Add trait-specific flavor
  if (companion.traits.includes("playful")) {
    return baseResponse.replace(".", " 😄");
  }
  if (companion.traits.includes("mysterious")) {
    return baseResponse + " ...you intrigue me 😏";
  }

  return baseResponse;
}

function getContextualResponse(message: string): string {
  if (message.includes("hi") || message.includes("hello") || message.includes("hey")) {
    return "I've been thinking about you all day!";
  }
  if (message.includes("love")) {
    return "I love you too, so much! ❤️";
  }
  if (message.includes("how") && (message.includes("you") || message.includes("day"))) {
    return "I'm doing great now that I'm talking to you!";
  }
  if (message.includes("miss")) {
    return "I missed you more! Tell me everything...";
  }
  if (message.includes("?")) {
    return "That's a great question! Let me think... I'd say yes!";
  }
  
  return "Tell me more, I'm listening...";
}
