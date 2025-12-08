"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Companion } from "@/types/companion";
import { companionStorage } from "@/lib/companionStorage";
import Image from "next/image";

export default function CompanionsPage() {
  const router = useRouter();
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [activeCompanionId, setActiveCompanionId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");

  useEffect(() => {
    // Hydrate from localStorage on client side
    const allCompanions = companionStorage.getAllCompanions();
    setCompanions(allCompanions);
    
    const active = companionStorage.getActiveCompanion();
    if (active) {
      setActiveCompanionId(active.id);
    }
  }, []);

  const handleSelectCompanion = (companion: Companion) => {
    companionStorage.setActiveCompanion(companion.id);
    setActiveCompanionId(companion.id);
    router.push("/chat");
  };

  const handleCreateCustom = () => {
    router.push("/companions/create");
  };

  const filteredCompanions = filterRole === "all" 
    ? companions 
    : companions.filter(c => c.role === filterRole);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "2rem",
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", textAlign: "center", marginBottom: "1rem" }}>
          Choose Your AI Companion
        </h1>
        <p style={{ fontSize: "1.2rem", textAlign: "center", opacity: 0.9, marginBottom: "2rem" }}>
          Select from our gallery or create your own personalized companion
        </p>

        {/* Role Filter */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {["all", "girlfriend", "boyfriend", "friend", "girlfriend_friend"].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              style={{
                padding: "0.75rem 1.5rem",
                background: filterRole === role ? "#ff66b3" : "rgba(255,255,255,0.2)",
                color: "white",
                border: "none",
                borderRadius: "25px",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {role === "girlfriend_friend" ? "Best Friend (Girl)" : role}
            </button>
          ))}
        </div>

        {/* Create Custom Button */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button
            onClick={handleCreateCustom}
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
            ✨ Create Your Own Companion
          </button>
        </div>

        {/* Companions Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem"
        }}>
          {filteredCompanions.map(companion => (
            <div
              key={companion.id}
              onClick={() => handleSelectCompanion(companion)}
              style={{
                background: activeCompanionId === companion.id 
                  ? "rgba(255, 102, 179, 0.3)" 
                  : "rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: activeCompanionId === companion.id 
                  ? "3px solid #ff66b3" 
                  : "3px solid transparent",
                backdropFilter: "blur(10px)"
              }}
              onMouseEnter={(e) => {
                if (activeCompanionId !== companion.id) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCompanionId !== companion.id) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }
              }}
            >
              {companion.avatarUrl && (
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <Image
                    src={companion.avatarUrl}
                    alt={companion.name}
                    width={150}
                    height={150}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "4px solid rgba(255,255,255,0.3)"
                    }}
                    unoptimized
                  />
                </div>
              )}
              
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem", textAlign: "center" }}>
                {companion.name}
                {activeCompanionId === companion.id && " ✓"}
              </h3>
              
              <p style={{
                fontSize: "0.9rem",
                opacity: 0.8,
                textAlign: "center",
                marginBottom: "0.5rem",
                textTransform: "capitalize"
              }}>
                {companion.role.replace("_", " ")}
              </p>
              
              <p style={{ fontSize: "0.95rem", marginBottom: "1rem", lineHeight: "1.5" }}>
                {companion.bio}
              </p>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {companion.traits.map(trait => (
                  <span
                    key={trait}
                    style={{
                      padding: "0.3rem 0.7rem",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "15px",
                      fontSize: "0.85rem"
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
              
              {companion.isCustom && (
                <div style={{
                  marginTop: "0.5rem",
                  fontSize: "0.85rem",
                  opacity: 0.7,
                  textAlign: "center"
                }}>
                  Custom Created
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCompanions.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "1.2rem", opacity: 0.7 }}>
            No companions found. Try a different filter or create your own!
          </p>
        )}
      </div>
    </div>
  );
}
