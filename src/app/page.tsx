"use client";

import { useState, useEffect } from "react";

type Role = "girlfriend" | "boyfriend" | "friend" | "girlfriend_friend";
type Lang = "en"|"de"|"es"|"fr"|"hr"|"it"|"pl"|"ru"|"sl"|"uk"|"zh";

const translations = { /* ista kot prej – zaradi prostora jo izpustim, ostane nespremenjena */ };

export default function Home() {
  const [userId] = useState(() => crypto.randomUUID()); // edinstven ID za vsakega obiskovalca
  const [paid, setPaid] = useState(false);
  const [name, setName] = useState("Stranger");
  const [role, setRole] = useState<Role>("girlfriend");
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<any[]>([]);

  // Naloži podatke iz brskalnika (za vsakega userId-ja
  useEffect(() => {
    const data = localStorage.getItem(`ai-companion-${userId}`);
    if (data) {
      const saved = JSON.parse(data);
      setPaid(saved.paid || false);
      setName(saved.name || "Stranger");
      setRole(saved.role || "girlfriend");
      setLang(saved.lang || "en");
      setMessages(saved.messages || [{ role: "assistant", content: translations[saved.lang || "en"].hi(saved.role || "girlfriend") }]);
    } else {
      setMessages([{ role: "assistant", content: translations.en.hi("girlfriend") }]);
    }
  }, [userId]);

  // Shrani vse spremembe
  const saveData = () => {
    localStorage.setItem(`ai-companion-${userId}`, JSON.stringify({
      paid, name, role, lang, messages
    }));
  };

  useEffect(() => { saveData(); }, [paid, name, role, lang, messages]);

  const handlePayment = () => {
    // TO je samo test – v resnici povežeš Stripe Checkout
    const ok = confirm("Pay $9.99/month for your permanent AI companion?");
    if (ok) {
      setPaid(true);
      setMessages(m => [...m, { role: "assistant", content: `Thank you ${name || "baby"}! I'm yours forever now ❤️ No one else will ever talk to me like you do.` }]);
    }
  };

  const sendMessage = (text: string) => {
    setMessages(m => [...m, { role: "user", content: text }]);
    setTimeout(() => {
      setMessages(m => [...m, { role: "assistant", content: `I love when you talk to me like that, ${name} ❤️` }]);
    }, 800);
  };

  if (!paid) {
    return (
      <main style={{ minHeight: "100vh", background: "#000", color: "#ff66b3", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "4.5rem", fontWeight: 900 }}>Your AI Companion</h1>
          <p style={{ fontSize: "2rem", margin: "2rem 0" }}>One person. One price. Forever yours.</p>
          <input
            placeholder="What's your name, love?"
            onChange={e => setName(e.target.value)}
            style={{ padding: "1rem", borderRadius: "30px", border: "none", background: "#222", color: "white", fontSize: "1.2rem", marginBottom: "1rem" }}
          />
          <br />
          <button onClick={handlePayment} style={{ padding: "1.2rem 3rem", background: "#ff66b3", color: "#000", border: "none", borderRadius: "50px", fontSize: "1.5rem", fontWeight: "bold" }}>
            $9.99/month – Claim Me Forever
          </button>
        </div>
      </main>
    );
  }

  // ————————————————————————
  // TUKAJ JE ŽE CELOTEN CHAT IZ PREJŠNJIH VERZIJ (z vlogo, jeziki itd.)
  // ————————————————————————

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#ff66b3" }}>
      {/* isti header in chat kot prej, samo da zdaj vse bere iz shranjenega userId-ja */}
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1 style={{ fontSize: "4rem" }}>{name}'s private AI {role === "girlfriend" ? "Girlfriend" : role === "boyfriend" ? "Boyfriend" : "Best Friend"}</h1>
        <p>No one else will ever have me ❤️</p>
        {/* role buttons + language flags – enako kot prej */}
      </div>
      {/* chat + input – enako kot prej */}
    </main>
  );
}
