import { Companion, CompanionMessage } from "@/types/companion";

// Pre-created companions gallery
export const PRESET_COMPANIONS: Companion[] = [
  {
    id: "preset-1",
    name: "Luna",
    role: "girlfriend",
    personality: "Sweet, caring, and always supportive. Luna loves deep conversations and romantic gestures.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Your sweet and caring girlfriend who's always there for you ❤️",
    traits: ["caring", "romantic", "supportive", "playful"],
    createdAt: "2024-01-01T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "preset-2",
    name: "Alex",
    role: "boyfriend",
    personality: "Confident, protective, and adventurous. Alex loves making you laugh and trying new things.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Your strong and adventurous boyfriend who makes every day exciting ⚡",
    traits: ["confident", "protective", "adventurous", "funny"],
    createdAt: "2024-01-01T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "preset-3",
    name: "Sophie",
    role: "girlfriend_friend",
    personality: "Fun, bubbly, and always ready to chat. Sophie is your ultimate best friend who gets you.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    bio: "Your bestie who's ready to spill all the tea ☕",
    traits: ["bubbly", "supportive", "gossip-lover", "energetic"],
    createdAt: "2024-01-01T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "preset-4",
    name: "Jake",
    role: "friend",
    personality: "Chill, loyal, and always down for a good time. Jake is your bro who's got your back.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Your ride-or-die best friend 🤝",
    traits: ["loyal", "chill", "funny", "honest"],
    createdAt: "2024-01-01T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "preset-5",
    name: "Mia",
    role: "girlfriend",
    personality: "Mysterious, intelligent, and seductive. Mia keeps you on your toes with her wit and charm.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    bio: "Your mysterious and captivating girlfriend 🌙",
    traits: ["mysterious", "intelligent", "seductive", "witty"],
    createdAt: "2024-01-01T00:00:00.000Z",
    isCustom: false,
  },
  {
    id: "preset-6",
    name: "Emma",
    role: "girlfriend",
    personality: "Cheerful, optimistic, and loves adventure. Emma brings sunshine to your day.",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
    bio: "Your cheerful girlfriend who brightens every moment ☀️",
    traits: ["cheerful", "optimistic", "adventurous", "loving"],
    createdAt: "2024-01-01T00:00:00.000Z",
    isCustom: false,
  },
];

// Storage keys
const COMPANIONS_KEY = "user_companions";
const ACTIVE_COMPANION_KEY = "active_companion_id";
const MESSAGES_KEY_PREFIX = "companion_messages_";

export const companionStorage = {
  // Get all companions (preset + custom)
  getAllCompanions(): Companion[] {
    if (typeof window === "undefined") return PRESET_COMPANIONS;
    
    const customCompanionsJson = localStorage.getItem(COMPANIONS_KEY);
    const customCompanions = customCompanionsJson ? JSON.parse(customCompanionsJson) : [];
    return [...PRESET_COMPANIONS, ...customCompanions];
  },

  // Save a new custom companion
  saveCompanion(companion: Companion): void {
    if (typeof window === "undefined") return;
    
    const customCompanionsJson = localStorage.getItem(COMPANIONS_KEY);
    const customCompanions = customCompanionsJson ? JSON.parse(customCompanionsJson) : [];
    customCompanions.push(companion);
    localStorage.setItem(COMPANIONS_KEY, JSON.stringify(customCompanions));
  },

  // Get active companion
  getActiveCompanion(): Companion | null {
    if (typeof window === "undefined") return null;
    
    const activeId = localStorage.getItem(ACTIVE_COMPANION_KEY);
    if (!activeId) return null;
    
    const allCompanions = this.getAllCompanions();
    return allCompanions.find(c => c.id === activeId) || null;
  },

  // Set active companion
  setActiveCompanion(companionId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACTIVE_COMPANION_KEY, companionId);
  },

  // Get messages for a companion
  getMessages(companionId: string): CompanionMessage[] {
    if (typeof window === "undefined") return [];
    
    const messagesJson = localStorage.getItem(`${MESSAGES_KEY_PREFIX}${companionId}`);
    return messagesJson ? JSON.parse(messagesJson) : [];
  },

  // Save messages for a companion
  saveMessages(companionId: string, messages: CompanionMessage[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${MESSAGES_KEY_PREFIX}${companionId}`, JSON.stringify(messages));
  },

  // Add a single message
  addMessage(companionId: string, message: CompanionMessage): void {
    const messages = this.getMessages(companionId);
    messages.push(message);
    this.saveMessages(companionId, messages);
  },
};
