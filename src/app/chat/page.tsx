"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function ChatPage() {
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [companion, setCompanion] = useState<any>(null);

  // Load saved avatar and companion from localStorage on client-side mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
    
    const savedCompanion = localStorage.getItem("selectedCompanion");
    if (savedCompanion) {
      setCompanion(JSON.parse(savedCompanion));
      // Add welcome message
      setMessages([{
        role: "assistant",
        content: `Hey! I'm ${JSON.parse(savedCompanion).name}. ${JSON.parse(savedCompanion).personality} Let's chat! 💕`
      }]);
    }
  }, []);

  const save = useCallback((imageUrl: string) => {
    if (imageUrl) {
      localStorage.setItem("avatar", imageUrl);
    }
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "user", content: input }]);
    setTimeout(() => {
      const responses = [
        "That's so sweet! Tell me more... ❤️",
        "I love talking to you! 💕",
        "You're amazing! What else is on your mind?",
        "Aww, you make me smile! 😊",
        "I'm all ears, babe! Keep going...",
      ];
      setMessages(m => [...m, { 
        role: "assistant", 
        content: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 800);
    setInput("");
  };

  const startVideoCall = async () => {
    setShowVideo(true);
    // In production, this would call the D-ID API to generate talking video
    // For now, just show a placeholder
  };

  return (
    <div style={{minHeight:"100vh",background:"#111827",color:"white",display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"system-ui,sans-serif",padding:"2rem"}}>
      <h1 style={{fontSize:"3rem",fontWeight:"bold",marginBottom:"1rem"}}>
        {companion ? `Chat with ${companion.name}` : "Chat with your AI Companion"}
      </h1>
      
      {companion && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{ fontSize: "3rem" }}>{companion.avatar}</div>
          <p style={{ opacity: 0.8 }}>{companion.description}</p>
        </div>
      )}
      
      {/* Video Call Section */}
      {showVideo && (
        <div style={{
          width: "100%",
          maxWidth: "600px",
          marginBottom: "2rem",
          background: "#222",
          borderRadius: "20px",
          padding: "2rem",
          textAlign: "center"
        }}>
          <div style={{
            width: "100%",
            height: "400px",
            background: "#000",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem"
          }}>
            {avatar ? (
              <Image src={avatar} alt="Companion" width={300} height={400} style={{ borderRadius: "15px" }} unoptimized />
            ) : (
              <div style={{ fontSize: "8rem" }}>{companion?.avatar || "👤"}</div>
            )}
          </div>
          <p style={{ color: "#ff66b3", marginBottom: "1rem" }}>🎥 Live Video Call Active</p>
          <button 
            onClick={() => setShowVideo(false)}
            style={{ 
              padding: "0.8rem 2rem", 
              background: "#dc2626", 
              color: "white", 
              border: "none", 
              borderRadius: "30px", 
              fontWeight: "bold", 
              cursor: "pointer" 
            }}>
            End Call
          </button>
        </div>
      )}
      
      {!showVideo && (
        <button 
          onClick={startVideoCall}
          style={{ 
            padding: "1rem 2.5rem", 
            background: "#ff66b3", 
            color: "#000", 
            border: "none", 
            borderRadius: "30px", 
            fontWeight: "bold", 
            cursor: "pointer",
            fontSize: "1.2rem",
            marginBottom: "2rem"
          }}>
          🎥 Start Video Call
        </button>
      )}

      {/* Avatar Generation */}
      {!avatar && (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <input
            placeholder="Describe your dream companion (hair, eyes, style, NSFW/SFW...)"
            onChange={(e) => setAvatarPrompt(e.target.value)}
            style={{ padding: "0.8rem 1.5rem", borderRadius: "30px", background: "#222", color: "white", margin: "1rem", width: "400px" }}
          />
          <button 
            disabled={isLoading}
            onClick={async () => {
              if (!avatarPrompt.trim()) return;
              setIsLoading(true);
              try {
                const res = await fetch("/api/generate-avatar", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ prompt: avatarPrompt, style: "realistic", nsfw: avatarPrompt.includes("NSFW") }),
                });
                if (!res.ok) {
                  console.error("Failed to generate avatar:", res.statusText);
                  return;
                }
                const data = await res.json();
                if (data.image_url) {
                  setAvatar(data.image_url);
                  save(data.image_url);
                }
              } catch (error) {
                console.error("Error generating avatar:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            style={{ padding: "0.8rem 1.5rem", background: "#ec4899", color: "white", border: "none", borderRadius: "30px", fontWeight: "bold", cursor: "pointer" }}>
            {isLoading ? "Generating..." : "Generate Avatar"}
          </button>
        </div>
      )}
      
      {/* Messages */}
      <div style={{ 
        width: "100%", 
        maxWidth: "800px", 
        flex: 1, 
        overflowY: "auto", 
        marginBottom: "1rem",
        padding: "1rem"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === "user" ? "right" : "left",
            margin: "1rem 0"
          }}>
            <div style={{
              display: "inline-block",
              background: m.role === "user" ? "#ff66b3" : "#333",
              color: m.role === "user" ? "#000" : "#fff",
              padding: "1rem 1.5rem",
              borderRadius: "20px",
              maxWidth: "70%"
            }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input */}
      <div style={{ 
        width: "100%", 
        maxWidth: "800px", 
        display: "flex", 
        gap: "1rem",
        padding: "1rem",
        background: "#222",
        borderRadius: "30px"
      }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..." 
          style={{
            flex: 1,
            padding: "1rem",
            borderRadius: "20px",
            border: "none",
            background: "#333",
            color: "white"
          }} 
        />
        <button 
          onClick={sendMessage}
          style={{
            padding: "1rem 2.5rem",
            background: "#ec4899",
            color: "white",
            border: "none",
            borderRadius: "20px",
            fontWeight: "bold",
            cursor: "pointer"
          }}>
          Send
        </button>
      </div>
    </div>
  );
}
