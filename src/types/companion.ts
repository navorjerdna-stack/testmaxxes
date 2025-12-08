export type CompanionRole = "girlfriend" | "boyfriend" | "friend" | "girlfriend_friend";

export interface Companion {
  id: string;
  name: string;
  role: CompanionRole;
  personality: string;
  avatarUrl?: string;
  bio?: string;
  traits: string[];
  createdAt: string;
  isCustom: boolean;
}

export interface CompanionMessage {
  id: string;
  companionId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
