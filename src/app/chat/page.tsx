"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Companion, CompanionMessage } from "@/types/companion";
import { companionStorage } from "@/lib/companionStorage";

export default function ChatPage() {
  const router = useRouter();
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeCompanion = companionStorage.getActiveCompanion();
    if (!activeCompanion) {
      router.push("/companions");
      return;
    }
    
    setCompanion(activeCompanion);
    const savedMessages = companionStorage.getMessages(activeCompanion.id);
    
    if (savedMessages.length === 0) {
      // Create initial greeting message
      const greeting = getGreeting(activeCompanion);
      const initialMessage: CompanionMessage = {
        id: `msg-${Date.now()}`,
        companionId: activeCompanion.id,
        role: "assistant",
        content: greeting,
        timestamp: new Date().toISOString(),
      };
      setMessages([initialMessage]);
      companionStorage.addMessage(activeCompanion.id, initialMessage);
    } else {
      setMessages(savedMessages);
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getGreeting = (comp: Companion): string => {
    const greetings: Record<string, string[]> = {
      girlfriend: [
        `Hey baby ❤️ I'm ${comp.name}, your ${comp.role}. I've been waiting for you! What do you want to talk about tonight?`,
        `Hi love! ❤️ It's ${comp.name}... I missed you so much! Tell me everything...`,
      ],
      boyfriend: [
        `Hey beautiful ❤️ I'm ${comp.name}, your ${comp.role}. Always here for you. What's on your mind?`,
        `Hi gorgeous! I'm ${comp.name}. Ready to make your day better. What's up?`,
      ],
      friend: [
        `Yo! I'm ${comp.name}, your best bro. What's good man?`,
        `Hey dude! ${comp.name} here. Ready to hang? What's happening?`,
      ],
      girlfriend_friend: [
        `OMG girl!! I'm ${comp.name} ❤️ Finally we can chat! Spill the tea!`,
        `Hey bestie!! ${comp.name} here! I've got so much to tell you! You first though!`,
      ],
    };

    const roleGreetings = greetings[comp.role] || greetings.girlfriend;
    return roleGreetings[Math.floor(Math.random() * roleGreetings.length)];
  };

  const sendMessage = async () => {
    if (!input.trim() || !companion || isSending) return;

    const userMessage: CompanionMessage = {
      id: `msg-${Date.now()}`,
      companionId: companion.id,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    companionStorage.addMessage(companion.id, userMessage);
    setInput("");
    setIsSending(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          companion,
          conversationHistory,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      const assistantMessage: CompanionMessage = {
        id: `msg-${Date.now()}-assistant`,
        companionId: companion.id,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      companionStorage.addMessage(companion.id, assistantMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      // Fallback response
      const fallbackMessage: CompanionMessage = {
        id: `msg-${Date.now()}-fallback`,
        companionId: companion.id,
        role: "assistant",
        content: "Sorry babe, I'm having trouble right now... Can you say that again? ❤️",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
      companionStorage.addMessage(companion.id, fallbackMessage);
    } finally {
      setIsSending(false);
    }
  };

  if (!companion) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif"
      }}>
        <p style={{ fontSize: "1.5rem" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily: "system-ui, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {companion.avatarUrl && (
            <Image
              src={companion.avatarUrl}
              alt={companion.name}
              width={50}
              height={50}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ff66b3"
              }}
              unoptimized
            />
          )}
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
              {companion.name}
            </h2>
            <p style={{ fontSize: "0.9rem", opacity: 0.7, margin: 0, textTransform: "capitalize" }}>
              {companion.role.replace("_", " ")} • Online
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/companions")}
          style={{
            padding: "0.5rem 1rem",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Change Companion
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "2rem",
        maxWidth: "900px",
        width: "100%",
        margin: "0 auto"
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "1rem"
            }}
          >
            <div style={{
              background: msg.role === "user" 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "rgba(255, 255, 255, 0.1)",
              color: "white",
              padding: "1rem 1.5rem",
              borderRadius: "20px",
              maxWidth: "70%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        padding: "1.5rem 2rem",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          gap: "1rem",
          alignItems: "center"
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Message ${companion.name}...`}
            disabled={isSending}
            style={{
              flex: 1,
              padding: "1rem 1.5rem",
              borderRadius: "30px",
              border: "none",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isSending || !input.trim()}
            style={{
              padding: "1rem 2rem",
              background: isSending || !input.trim() 
                ? "rgba(255, 102, 179, 0.5)" 
                : "#ff66b3",
              color: "white",
              border: "none",
              borderRadius: "30px",
              cursor: isSending || !input.trim() ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(255, 102, 179, 0.3)"
            }}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
