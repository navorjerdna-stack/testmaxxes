import { kv } from '@vercel/kv';

export interface User {
  id: string;
  name: string;
  avatarUrl: string | null;
  avatarDescription: string | null;
  avatarStyle: 'anime' | 'realistic';
  isPaid: boolean;
  stripeCustomerId: string | null;
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Check if KV is configured
const isKVConfigured = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// In-memory fallback for local development
const memoryStore: Map<string, unknown> = new Map();

// User functions
export async function getUser(userId: string): Promise<User | null> {
  if (!isKVConfigured()) {
    return memoryStore.get(`user:${userId}`) as User | null;
  }
  return await kv.get<User>(`user:${userId}`);
}

export async function setUser(userId: string, user: User): Promise<void> {
  if (!isKVConfigured()) {
    memoryStore.set(`user:${userId}`, user);
    return;
  }
  await kv.set(`user:${userId}`, user);
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  const user = await getUser(userId);
  if (!user) return null;
  const updatedUser = { ...user, ...updates };
  await setUser(userId, updatedUser);
  return updatedUser;
}

// Chat history functions
export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  if (!isKVConfigured()) {
    return (memoryStore.get(`chat:${userId}`) as ChatMessage[]) || [];
  }
  const history = await kv.get<ChatMessage[]>(`chat:${userId}`);
  return history || [];
}

export async function addChatMessage(userId: string, message: ChatMessage): Promise<void> {
  const history = await getChatHistory(userId);
  history.push(message);
  // Keep last 100 messages to avoid hitting memory limits
  const trimmedHistory = history.slice(-100);
  if (!isKVConfigured()) {
    memoryStore.set(`chat:${userId}`, trimmedHistory);
    return;
  }
  await kv.set(`chat:${userId}`, trimmedHistory);
}

export async function clearChatHistory(userId: string): Promise<void> {
  if (!isKVConfigured()) {
    memoryStore.delete(`chat:${userId}`);
    return;
  }
  await kv.del(`chat:${userId}`);
}
