"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Companion, CompanionRole } from "@/types/companion";
import { companionStorage } from "@/lib/companionStorage";
import Image from "next/image";

export default function CreateCompanionPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState<CompanionRole>("girlfriend");
  const [personality, setPersonality] = useState("");
  const [bio, setBio] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [newTrait, setNewTrait] = useState("");
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const availableTraits = [
    "caring", "romantic", "playful", "mysterious", "intelligent",
    "funny", "supportive", "adventurous", "confident", "shy",
    "energetic", "calm", "witty", "loyal", "protective"
  ];

  const toggleTrait = (trait: string) => {
    if (traits.includes(trait)) {
      setTraits(traits.filter(t => t !== trait));
    } else {
      setTraits([...traits, trait]);
    }
  };

  const addCustomTrait = () => {
    if (newTrait.trim() && !traits.includes(newTrait.trim())) {
      setTraits([...traits, newTrait.trim()]);
      setNewTrait("");
    }
  };

  const generateAvatar = async () => {
    if (!avatarPrompt.trim()) {
      alert("Please describe your companion's appearance");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: avatarPrompt,
          style: "realistic",
          nsfw: avatarPrompt.toLowerCase().includes("nsfw")
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate avatar");
      }

      const data = await res.json();
      if (data.image_url) {
        setAvatarUrl(data.image_url);
      } else {
        alert("Failed to generate avatar. Please try again.");
      }
    } catch (error) {
      console.error("Error generating avatar:", error);
      alert("Error generating avatar. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      alert("Please enter a name for your companion");
      return;
    }
    if (!personality.trim()) {
      alert("Please describe your companion's personality");
      return;
    }
    if (traits.length === 0) {
      alert("Please select at least one trait");
      return;
    }

    const newCompanion: Companion = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      role,
      personality: personality.trim(),
      avatarUrl: avatarUrl || undefined,
      bio: bio.trim() || undefined,
      traits,
      createdAt: new Date().toISOString(),
      isCustom: true,
    };

    companionStorage.saveCompanion(newCompanion);
    companionStorage.setActiveCompanion(newCompanion.id);
    router.push("/chat");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "2rem",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", textAlign: "center", marginBottom: "2rem" }}>
          Create Your Perfect AI Companion
        </h1>

        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "2rem"
        }}>
          {/* Name */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Luna, Alex, Sophie..."
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "none",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontSize: "1rem"
              }}
            />
          </div>

          {/* Role */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Role *
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(["girlfriend", "boyfriend", "friend", "girlfriend_friend"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: role === r ? "#ff66b3" : "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                  {r === "girlfriend_friend" ? "Best Friend (Girl)" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Personality */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Personality Description *
            </label>
            <textarea
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Describe how your companion acts, talks, and behaves..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "none",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontSize: "1rem",
                resize: "vertical"
              }}
            />
          </div>

          {/* Bio */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Short Bio (Optional)
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short tagline about your companion..."
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "none",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontSize: "1rem"
              }}
            />
          </div>

          {/* Traits */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Personality Traits * (Select at least one)
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {availableTraits.map(trait => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: traits.includes(trait) ? "#4ade80" : "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  {trait}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTrait()}
                placeholder="Add custom trait..."
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontSize: "0.9rem"
                }}
              />
              <button
                onClick={addCustomTrait}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#4ade80",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Avatar Generation */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Generate Avatar (Optional)
            </label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="text"
                value={avatarPrompt}
                onChange={(e) => setAvatarPrompt(e.target.value)}
                placeholder="Describe appearance: hair color, eyes, style, outfit..."
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontSize: "1rem"
                }}
              />
              <button
                onClick={generateAvatar}
                disabled={isGenerating}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: isGenerating ? "#666" : "#ff66b3",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  whiteSpace: "nowrap"
                }}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
            {avatarUrl && (
              <div style={{ textAlign: "center" }}>
                <Image
                  src={avatarUrl}
                  alt="Generated avatar"
                  width={200}
                  height={200}
                  style={{
                    borderRadius: "50%",
                    border: "4px solid rgba(255, 255, 255, 0.3)"
                  }}
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
            <button
              onClick={() => router.push("/companions")}
              style={{
                padding: "1rem 2rem",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              style={{
                padding: "1rem 2rem",
                background: "#4ade80",
                color: "black",
                border: "none",
                borderRadius: "30px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              Create & Start Chatting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
