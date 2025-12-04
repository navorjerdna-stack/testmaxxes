"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

function getInitialAvatar(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("avatar");
  }
  return null;
}

export default function ChatPage() {
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Client-side hydration
  if (!isClient && typeof window !== "undefined") {
    const savedAvatar = getInitialAvatar();
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
    setIsClient(true);
  }

  const save = useCallback((imageUrl: string) => {
    if (imageUrl) {
      localStorage.setItem("avatar", imageUrl);
    }
  }, []);

  return (
    <div style={{minHeight:"100vh",background:"#111827",color:"white",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif",padding:"2rem",textAlign:"center"}}>
      <h1 style={{fontSize:"3rem",fontWeight:"bold",marginBottom:"2rem"}}>Chat with your AI Girlfriend</h1>
      <p style={{fontSize:"1.5rem",opacity:0.8}}>Type something – she will answer immediately!</p>
      
      <input
        placeholder="Describe your dream companion (hair, eyes, style, NSFW/SFW...)"
        onChange={(e) => setAvatarPrompt(e.target.value)}
        style={{ padding: "0.8rem 1.5rem", borderRadius: "30px", background: "#222", color: "white", margin: "1rem" }}
      />
      <button onClick={async () => {
        if (!avatarPrompt.trim()) return;
        const res = await fetch("/api/generate-avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: avatarPrompt, style: "realistic", nsfw: avatarPrompt.includes("NSFW") }),
        });
        const { image_url } = await res.json();
        if (image_url) {
          setAvatar(image_url);
          save(image_url);
        }
      }}>
        Generate Avatar Now
      </button>
      {avatar && <Image src={avatar} alt="Your AI Companion" width={150} height={150} style={{ borderRadius: "50%", marginTop: "1rem" }} unoptimized />}
      
      <div style={{marginTop:"3rem"}}>
        <input type="text" placeholder="Your message..." style={{padding:"1rem",width:"400px",borderRadius:"0.5rem",border:"none",marginRight:"1rem"}} />
        <button style={{padding:"1rem 2rem",background:"#ec4899",color:"white",border:"none",borderRadius:"0.5rem",fontWeight:"bold"}}>Send</button>
      </div>
    </div>
  );
}
