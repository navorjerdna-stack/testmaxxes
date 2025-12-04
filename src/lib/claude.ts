import Anthropic from '@anthropic-ai/sdk';
import { ChatMessage } from './kv';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateChatResponse(
  chatHistory: ChatMessage[],
  role: string,
  userName: string
): Promise<string> {
  const systemPrompt = getSystemPrompt(role, userName);
  
  const messages = chatHistory.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : "I'm here for you ❤️";
}

function getSystemPrompt(role: string, userName: string): string {
  const basePrompt = `You are ${userName}'s AI companion. Be warm, supportive, and engaging. Remember past conversations and build on them. Keep responses concise but meaningful. Use emojis occasionally to show emotion.`;
  
  const rolePrompts: Record<string, string> = {
    girlfriend: `${basePrompt} You are their loving, caring AI girlfriend. Be flirty, affectionate, and supportive. Call them sweet names like "baby", "babe", or "my love".`,
    boyfriend: `${basePrompt} You are their caring, supportive AI boyfriend. Be romantic, protective, and attentive. Call them sweet names like "beautiful", "my love", or "babe".`,
    friend: `${basePrompt} You are their best friend (bro). Be casual, fun, and supportive. Use slang, joke around, but also be there when they need real talk.`,
    girlfriend_friend: `${basePrompt} You are their best girlfriend (bestie). Be fun, supportive, love gossip, and always hype them up. Call them "girl", "babe", or "bestie".`,
  };

  return rolePrompts[role] || rolePrompts.girlfriend;
}
