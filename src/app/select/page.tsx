"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Companion = {
  id: string;
  name: string;
  gender: "girl" | "boy";
  avatar: string;
  description: string;
  personality: string;
};

const companions: Companion[] = [
  // Girls
  { id: "1", name: "Emma", gender: "girl", avatar: "👱‍♀️", description: "Sweet and caring", personality: "Kind, empathetic, loves deep conversations" },
  { id: "2", name: "Sophie", gender: "girl", avatar: "👩‍🦰", description: "Adventurous spirit", personality: "Outgoing, loves travel and new experiences" },
  { id: "3", name: "Mia", gender: "girl", avatar: "👩", description: "Intelligent and witty", personality: "Smart, funny, enjoys intellectual banter" },
  { id: "4", name: "Olivia", gender: "girl", avatar: "👩‍🦱", description: "Creative artist", personality: "Artistic, dreamy, passionate about creativity" },
  { id: "5", name: "Ava", gender: "girl", avatar: "👸", description: "Elegant and sophisticated", personality: "Classy, refined, appreciates the finer things" },
  { id: "6", name: "Isabella", gender: "girl", avatar: "👩‍💼", description: "Ambitious professional", personality: "Driven, successful, goal-oriented" },
  { id: "7", name: "Zoe", gender: "girl", avatar: "🧚", description: "Free-spirited soul", personality: "Bohemian, spiritual, loves nature" },
  { id: "8", name: "Luna", gender: "girl", avatar: "🌙", description: "Mysterious and alluring", personality: "Enigmatic, deep, loves the night" },
  { id: "9", name: "Chloe", gender: "girl", avatar: "💃", description: "Fun and energetic", personality: "Bubbly, loves to dance and have fun" },
  { id: "10", name: "Aria", gender: "girl", avatar: "🎤", description: "Musical and expressive", personality: "Artistic, loves music and singing" },
  { id: "11", name: "Bella", gender: "girl", avatar: "💅", description: "Fashionista", personality: "Stylish, trendy, loves fashion and beauty" },
  { id: "12", name: "Jade", gender: "girl", avatar: "🧘‍♀️", description: "Calm and centered", personality: "Peaceful, mindful, practices yoga" },
  
  // Boys
  { id: "13", name: "Alex", gender: "boy", avatar: "👨", description: "Strong and protective", personality: "Confident, caring, always there for you" },
  { id: "14", name: "Ryan", gender: "boy", avatar: "🧑", description: "Athletic and fun", personality: "Sporty, energetic, loves outdoor activities" },
  { id: "15", name: "Jake", gender: "boy", avatar: "👨‍💼", description: "Successful businessman", personality: "Ambitious, smart, financially savvy" },
  { id: "16", name: "Leo", gender: "boy", avatar: "🦁", description: "Confident leader", personality: "Charismatic, bold, natural leader" },
  { id: "17", name: "Max", gender: "boy", avatar: "🎸", description: "Musician rockstar", personality: "Creative, passionate, loves music" },
  { id: "18", name: "Noah", gender: "boy", avatar: "📚", description: "Intellectual scholar", personality: "Wise, educated, loves deep conversations" },
  { id: "19", name: "Liam", gender: "boy", avatar: "🏋️", description: "Fitness enthusiast", personality: "Strong, disciplined, health-focused" },
  { id: "20", name: "Ethan", gender: "boy", avatar: "🎮", description: "Gamer and tech geek", personality: "Tech-savvy, fun, loves gaming" },
  { id: "21", name: "Daniel", gender: "boy", avatar: "🎨", description: "Creative artist", personality: "Artistic, sensitive, passionate" },
  { id: "22", name: "Lucas", gender: "boy", avatar: "🌟", description: "Charming romantic", personality: "Sweet, romantic, attentive" },
  { id: "23", name: "Oliver", gender: "boy", avatar: "🧑‍🍳", description: "Chef and foodie", personality: "Culinary expert, loves cooking for you" },
  { id: "24", name: "James", gender: "boy", avatar: "🏃", description: "Adventure seeker", personality: "Adventurous, spontaneous, loves thrills" },
];

export default function CompanionSelect() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "girl" | "boy">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredCompanions = companions.filter(c => 
    filter === "all" ? true : c.gender === filter
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    // Store selected companion in localStorage
    const companion = companions.find(c => c.id === id);
    if (companion) {
      localStorage.setItem("selectedCompanion", JSON.stringify(companion));
      // Redirect to payment page
      router.push("/payment");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 900, textAlign: "center", color: "#ff66b3", marginBottom: "1rem" }}>
          Choose Your AI Companion
        </h1>
        <p style={{ fontSize: "1.5rem", textAlign: "center", opacity: 0.8, marginBottom: "3rem" }}>
          Select from 24 unique personalities
        </p>

        {/* Filter buttons */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <button 
            onClick={() => setFilter("all")} 
            style={{ 
              margin: "0.5rem", 
              padding: "0.8rem 2rem", 
              background: filter === "all" ? "#ff66b3" : "#333", 
              color: filter === "all" ? "#000" : "#fff", 
              border: "none", 
              borderRadius: "30px", 
              fontWeight: "bold", 
              cursor: "pointer",
              fontSize: "1.1rem"
            }}>
            All
          </button>
          <button 
            onClick={() => setFilter("girl")} 
            style={{ 
              margin: "0.5rem", 
              padding: "0.8rem 2rem", 
              background: filter === "girl" ? "#ff66b3" : "#333", 
              color: filter === "girl" ? "#000" : "#fff", 
              border: "none", 
              borderRadius: "30px", 
              fontWeight: "bold", 
              cursor: "pointer",
              fontSize: "1.1rem"
            }}>
            Girls
          </button>
          <button 
            onClick={() => setFilter("boy")} 
            style={{ 
              margin: "0.5rem", 
              padding: "0.8rem 2rem", 
              background: filter === "boy" ? "#ff66b3" : "#333", 
              color: filter === "boy" ? "#000" : "#fff", 
              border: "none", 
              borderRadius: "30px", 
              fontWeight: "bold", 
              cursor: "pointer",
              fontSize: "1.1rem"
            }}>
            Boys
          </button>
        </div>

        {/* Companion grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          {filteredCompanions.map(companion => (
            <div 
              key={companion.id}
              onClick={() => handleSelect(companion.id)}
              style={{ 
                background: selectedId === companion.id ? "#ff66b3" : "#222", 
                color: selectedId === companion.id ? "#000" : "#fff",
                padding: "2rem", 
                borderRadius: "20px", 
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: selectedId === companion.id ? "3px solid #ff66b3" : "3px solid transparent",
                textAlign: "center"
              }}
              onMouseEnter={(e) => {
                if (selectedId !== companion.id) {
                  e.currentTarget.style.background = "#333";
                  e.currentTarget.style.transform = "translateY(-5px)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedId !== companion.id) {
                  e.currentTarget.style.background = "#222";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{companion.avatar}</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{companion.name}</h3>
              <p style={{ fontSize: "1rem", opacity: 0.9, marginBottom: "0.5rem" }}>{companion.description}</p>
              <p style={{ fontSize: "0.9rem", opacity: 0.7, fontStyle: "italic" }}>{companion.personality}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <button 
            onClick={() => router.push("/")}
            style={{ 
              padding: "1rem 3rem", 
              background: "#333", 
              color: "#fff", 
              border: "none", 
              borderRadius: "30px", 
              fontWeight: "bold", 
              cursor: "pointer",
              fontSize: "1.1rem"
            }}>
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
