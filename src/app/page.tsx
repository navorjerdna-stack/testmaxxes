"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

type Role = "girlfriend" | "boyfriend" | "friend" | "girlfriend_friend";
type Lang = "en"|"de"|"es"|"fr"|"hr"|"it"|"pl"|"ru"|"sl"|"uk"|"zh";
type AvatarStyle = "anime" | "realistic";

interface User {
  id: string;
  name: string;
  avatarUrl: string | null;
  avatarDescription: string | null;
  avatarStyle: AvatarStyle;
  isPaid: boolean;
  stripeCustomerId: string | null;
  createdAt: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const translations = {
  en: { flag:"🇺🇸", title:(r:Role)=>({girlfriend:"Your AI Girlfriend",boyfriend:"Your AI Boyfriend",friend:"Your AI Best Friend",girlfriend_friend:"Your AI Best Girlfriend"}[r]), hi:(r:Role)=>({girlfriend:"Hey baby ❤️ I'm here 24-7... What do you want tonight?",boyfriend:"Hey beautiful ❤️ Always here for you...",friend:"Yo! What's good bro?",girlfriend_friend:"Girl!! Finally here! Spill the tea ❤️"}[r]), placeholder:"Type a message...", tagline:"24-7 · no drama · 100% private", upgrade:"✨ Upgrade to Premium", setupTitle:"Welcome! Set up your profile", nameLabel:"Your name", avatarDesc:"Describe your avatar", avatarStyle:"Avatar style", generate:"Generate Avatar", startChat:"Start Chatting", premium:"Premium AI Chat" },
  de: { flag:"🇩🇪", title:(r:Role)=>({girlfriend:"Deine AI-Freundin",boyfriend:"Dein AI-Freund",friend:"Dein bester Freund",girlfriend_friend:"Deine beste Freundin"}[r]), hi:(r:Role)=>({girlfriend:"Hey Baby ❤️ Ich bin 24-7 für dich da...",boyfriend:"Hey Schönheit ❤️",friend:"Yo! Was geht?",girlfriend_friend:"Mädel!! Erzähl alles ❤️"}[r]), placeholder:"Schreib etwas...", tagline:"24-7 · kein Drama · 100 % privat", upgrade:"✨ Premium kaufen", setupTitle:"Willkommen! Profil einrichten", nameLabel:"Dein Name", avatarDesc:"Beschreibe deinen Avatar", avatarStyle:"Avatar-Stil", generate:"Avatar erstellen", startChat:"Chatten starten", premium:"Premium AI Chat" },
  es: { flag:"🇪🇸", title:(r:Role)=>({girlfriend:"Tu novia IA",boyfriend:"Tu novio IA",friend:"Tu mejor amigo",girlfriend_friend:"Tu mejor amiga"}[r]), hi:(r:Role)=>({girlfriend:"Hola cariño ❤️ Estoy aquí 24-7…",boyfriend:"Hola preciosa ❤️",friend:"¡Tío! ¿Qué pasa?",girlfriend_friend:"¡¡Nena!! Cuéntamelo todo ❤️"}[r]), placeholder:"Escribe un mensaje...", tagline:"24-7 · sin drama · 100 % privada", upgrade:"✨ Mejora a Premium", setupTitle:"¡Bienvenido! Configura tu perfil", nameLabel:"Tu nombre", avatarDesc:"Describe tu avatar", avatarStyle:"Estilo de avatar", generate:"Generar Avatar", startChat:"Empezar a chatear", premium:"Chat AI Premium" },
  fr: { flag:"🇫🇷", title:(r:Role)=>({girlfriend:"Ta copine IA",boyfriend:"Ton copain IA",friend:"Ton meilleur pote",girlfriend_friend:"Ta meilleure copine"}[r]), hi:(r:Role)=>({girlfriend:"Salut mon cœur ❤️ Je suis là 24-7…",boyfriend:"Salut ma belle ❤️",friend:"Yo! Ça va frère?",girlfriend_friend:"Ma chérie !! Raconte tout ❤️"}[r]), placeholder:"Écris un message...", tagline:"24-7 · zéro drame · 100 % privé", upgrade:"✨ Passer à Premium", setupTitle:"Bienvenue! Configurez votre profil", nameLabel:"Votre nom", avatarDesc:"Décrivez votre avatar", avatarStyle:"Style d'avatar", generate:"Générer Avatar", startChat:"Commencer à chatter", premium:"Chat IA Premium" },
  hr: { flag:"🇭🇷", title:(r:Role)=>({girlfriend:"Tvoja AI devojka",boyfriend:"Tvoj AI dečko",friend:"Tvoj najbolji drug",girlfriend_friend:"Tvoja najbolja drugarica"}[r]), hi:(r:Role)=>({girlfriend:"Hej bebe ❤️ Tu sam 24-7...",boyfriend:"Hej lepotice ❤️",friend:"Šta ima, brate?",girlfriend_friend:"Curo!! Konačno si tu ❤️"}[r]), placeholder:"Piši...", tagline:"24-7 · bez drame · 100 % privatno", upgrade:"✨ Nadogradi na Premium", setupTitle:"Dobrodošli! Postavite profil", nameLabel:"Vaše ime", avatarDesc:"Opišite svoj avatar", avatarStyle:"Stil avatara", generate:"Generiraj Avatar", startChat:"Počni razgovor", premium:"Premium AI Chat" },
  it: { flag:"🇮🇹", title:(r:Role)=>({girlfriend:"La tua ragazza IA",boyfriend:"Il tuo ragazzo IA",friend:"Il tuo migliore amico",girlfriend_friend:"La tua migliore amica"}[r]), hi:(r:Role)=>({girlfriend:"Ciao amore ❤️ Sono qui 24-7…",boyfriend:"Ciao bellissima ❤️",friend:"Ehi! Che si dice?",girlfriend_friend:"Tesoro!! Racconta tutto ❤️"}[r]), placeholder:"Scrivi un messaggio...", tagline:"24-7 · zero drammi · 100 % privata", upgrade:"✨ Passa a Premium", setupTitle:"Benvenuto! Configura il profilo", nameLabel:"Il tuo nome", avatarDesc:"Descrivi il tuo avatar", avatarStyle:"Stile avatar", generate:"Genera Avatar", startChat:"Inizia a chattare", premium:"Chat IA Premium" },
  pl: { flag:"🇵🇱", title:(r:Role)=>({girlfriend:"Twoja dziewczyna AI",boyfriend:"Twój chłopak AI",friend:"Twój najlepszy kumpel",girlfriend_friend:"Twoja najlepsza przyjaciółka"}[r]), hi:(r:Role)=>({girlfriend:"Hej kochanie ❤️ Jestem 24-7…",boyfriend:"Hej piękna ❤️",friend:"Siema! Co słychać?",girlfriend_friend:"Kochanie!! Opowiadaj wszystko ❤️"}[r]), placeholder:"Napisz wiadomość...", tagline:"24-7 · zero dram · 100 % prywatnie", upgrade:"✨ Kup Premium", setupTitle:"Witaj! Skonfiguruj profil", nameLabel:"Twoje imię", avatarDesc:"Opisz swój awatar", avatarStyle:"Styl awatara", generate:"Generuj Awatar", startChat:"Rozpocznij czat", premium:"Premium AI Chat" },
  ru: { flag:"🇷🇺", title:(r:Role)=>({girlfriend:"Твоя ИИ-девушка",boyfriend:"Твой ИИ-парень",friend:"Твой лучший друг",girlfriend_friend:"Твоя лучшая подруга"}[r]), hi:(r:Role)=>({girlfriend:"Привет малыш ❤️ Я тут 24-7…",boyfriend:"Привет красотка ❤️",friend:"Йо! Как дела?",girlfriend_friend:"Детка!! Рассказывай всё ❤️"}[r]), placeholder:"Напиши сообщение...", tagline:"24-7 · без драм · 100 % приватно", upgrade:"✨ Купить Премиум", setupTitle:"Добро пожаловать! Настройте профиль", nameLabel:"Ваше имя", avatarDesc:"Опишите аватар", avatarStyle:"Стиль аватара", generate:"Создать аватар", startChat:"Начать чат", premium:"Премиум ИИ Чат" },
  sl: { flag:"🇸🇮", title:(r:Role)=>({girlfriend:"Tvoja AI punca",boyfriend:"Tvoj AI fant",friend:"Tvoj najboljši prijatelj",girlfriend_friend:"Tvoja najboljša prijateljica"}[r]), hi:(r:Role)=>({girlfriend:"Hej baby ❤️ Tu sem zate 24-7...",boyfriend:"Hej lepotička ❤️",friend:"Yo! Kaj imaš novega?",girlfriend_friend:"Draga! Pogrešala sem te ❤️"}[r]), placeholder:"Napiši sporočilo...", tagline:"24-7 · brez drame · 100 % zasebno", upgrade:"✨ Nadgradi na Premium", setupTitle:"Dobrodošli! Nastavite profil", nameLabel:"Vaše ime", avatarDesc:"Opišite avatar", avatarStyle:"Stil avatarja", generate:"Ustvari Avatar", startChat:"Začni pogovor", premium:"Premium AI Klepet" },
  uk: { flag:"🇺🇦", title:(r:Role)=>({girlfriend:"Твоя ІІ-дівчина",boyfriend:"Твій ІІ-хлопець",friend:"Твій найкращий друг",girlfriend_friend:"Твоя найкраща подруга"}[r]), hi:(r:Role)=>({girlfriend:"Привіт крихітко ❤️ Я тут 24-7…",boyfriend:"Привіт красуне ❤️",friend:"Йо! Як справи?",girlfriend_friend:"Сонечко!! Розказуй усе ❤️"}[r]), placeholder:"Напиши повідомлення...", tagline:"24-7 · без драми · 100 % приватно", upgrade:"✨ Придбати Premium", setupTitle:"Ласкаво просимо! Налаштуйте профіль", nameLabel:"Ваше ім'я", avatarDesc:"Опишіть аватар", avatarStyle:"Стиль аватара", generate:"Створити аватар", startChat:"Почати чат", premium:"Преміум ІІ Чат" },
  zh: { flag:"🇨🇳", title:(r:Role)=>({girlfriend:"你的AI女友",boyfriend:"你的AI男友",friend:"你的死党AI",girlfriend_friend:"你的闺蜜AI"}[r]), hi:(r:Role)=>({girlfriend:"宝贝❤️ 我24小时都在…",boyfriend:"美女 ❤️ 永远在这里...",friend:"哟！最近咋样？",girlfriend_friend:"宝贝！！快把八卦都告诉我 ❤️"}[r]), placeholder:"输入消息...", tagline:"24-7 · 没戏 · 100% 私密", upgrade:"✨ 升级到高级版", setupTitle:"欢迎！设置您的资料", nameLabel:"您的名字", avatarDesc:"描述您的头像", avatarStyle:"头像风格", generate:"生成头像", startChat:"开始聊天", premium:"高级AI聊天" },
};

const languageOrder: Lang[] = ["en","de","es","fr","hr","it","pl","ru","sl","uk","zh"];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [role, setRole] = useState<Role>("girlfriend");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  
  // Setup form states
  const [setupName, setSetupName] = useState("");
  const [setupAvatarDesc, setSetupAvatarDesc] = useState("");
  const [setupAvatarStyle, setSetupAvatarStyle] = useState<AvatarStyle>("anime");
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Initialize user from localStorage or KV
  useEffect(() => {
    const initUser = async () => {
      const storedUserId = localStorage.getItem("userId");
      const initialRole: Role = "girlfriend";
      const initialGreeting = translations["en"].hi(initialRole);
      
      if (storedUserId) {
        try {
          const res = await fetch(`/api/user?userId=${storedUserId}`);
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            
            // Load chat history
            const chatRes = await fetch(`/api/chat?userId=${storedUserId}`);
            if (chatRes.ok) {
              const chatData = await chatRes.json();
              if (chatData.messages && chatData.messages.length > 0) {
                setMessages(chatData.messages);
              } else {
                // Set initial greeting if no chat history
                setMessages([{ role: "assistant", content: initialGreeting, timestamp: Date.now() }]);
              }
            } else {
              setMessages([{ role: "assistant", content: initialGreeting, timestamp: Date.now() }]);
            }
          } else {
            setShowSetup(true);
          }
        } catch {
          setShowSetup(true);
        }
      } else {
        setShowSetup(true);
      }
      setLoading(false);
    };

    initUser();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check for successful payment return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      // Refresh user data to get updated payment status
      const userId = localStorage.getItem("userId");
      if (userId) {
        fetch(`/api/user?userId=${userId}`)
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              setUser(data.user);
            }
          });
      }
      // Clean URL
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const generateAvatar = async () => {
    if (!setupAvatarDesc.trim()) return;
    
    setGeneratingAvatar(true);
    try {
      const tempUserId = localStorage.getItem("userId") || uuidv4();
      const res = await fetch("/api/avatar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: setupAvatarDesc,
          style: setupAvatarStyle,
          userId: tempUserId,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setGeneratedAvatarUrl(data.avatarUrl);
      }
    } catch (error) {
      console.error("Avatar generation failed:", error);
    }
    setGeneratingAvatar(false);
  };

  const completeSetup = async () => {
    if (!setupName.trim()) return;
    
    const userId = localStorage.getItem("userId") || uuidv4();
    localStorage.setItem("userId", userId);
    
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: setupName,
          avatarUrl: generatedAvatarUrl,
          avatarDescription: setupAvatarDesc,
          avatarStyle: setupAvatarStyle,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setShowSetup(false);
        setMessages([{ role: "assistant", content: t.hi(role), timestamp: Date.now() }]);
      }
    } catch (error) {
      console.error("Setup failed:", error);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;
    
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const send = async () => {
    if (!input.trim() || !user || sendingMessage) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };
    
    setMessages(m => [...m, userMessage]);
    setInput("");
    setSendingMessage(true);

    if (user.isPaid) {
      // Use real Claude AI for paid users
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            message: input,
            role,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setMessages(m => [...m, {
            role: "assistant",
            content: data.message,
            timestamp: data.timestamp,
          }]);
        } else if (res.status === 402) {
          // Payment required
          setMessages(m => [...m, {
            role: "assistant",
            content: "💔 To continue our conversation with real AI, please upgrade to Premium! I promise it's worth it ❤️",
            timestamp: Date.now(),
          }]);
        }
      } catch {
        setMessages(m => [...m, {
          role: "assistant",
          content: "Sorry, something went wrong. Try again? ❤️",
          timestamp: Date.now(),
        }]);
      }
    } else {
      // Free tier - simple responses
      setTimeout(() => {
        const freeResponses = [
          "That's so sweet! 💕 Upgrade to Premium for real AI conversations...",
          "I'd love to chat more! 😘 Get Premium for unlimited AI responses...",
          "You're amazing! ❤️ Unlock real Claude AI with Premium...",
          "Miss you! 💝 Premium members get smart AI that remembers everything...",
        ];
        setMessages(m => [...m, {
          role: "assistant",
          content: freeResponses[Math.floor(Math.random() * freeResponses.length)],
          timestamp: Date.now(),
        }]);
        setSendingMessage(false);
      }, 800);
      return;
    }
    
    setSendingMessage(false);
  };

  if (loading) {
    return (
      <main style={{ minHeight:"100vh", background:"#000", color:"#ff66b3", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui, sans-serif" }}>
        <div style={{ fontSize:"2rem" }}>Loading... ✨</div>
      </main>
    );
  }

  // Setup screen
  if (showSetup) {
    return (
      <main style={{ minHeight:"100vh", background:"#000", color:"#ff66b3", fontFamily:"system-ui, sans-serif", padding:"2rem" }}>
        <div style={{ maxWidth:"500px", margin:"0 auto", textAlign:"center" }}>
          <h1 style={{ fontSize:"2.5rem", fontWeight:900, marginBottom:"2rem" }}>{t.setupTitle}</h1>
          
          {/* Name input */}
          <div style={{ marginBottom:"1.5rem", textAlign:"left" }}>
            <label style={{ display:"block", marginBottom:"0.5rem", opacity:0.8 }}>{t.nameLabel}</label>
            <input
              value={setupName}
              onChange={e => setSetupName(e.target.value)}
              placeholder="Enter your name..."
              style={{ width:"100%", padding:"1rem", borderRadius:"12px", border:"none", background:"#222", color:"white", fontSize:"1rem" }}
            />
          </div>

          {/* Avatar description */}
          <div style={{ marginBottom:"1.5rem", textAlign:"left" }}>
            <label style={{ display:"block", marginBottom:"0.5rem", opacity:0.8 }}>{t.avatarDesc}</label>
            <input
              value={setupAvatarDesc}
              onChange={e => setSetupAvatarDesc(e.target.value)}
              placeholder="e.g., blue hair, green eyes, playful smile..."
              style={{ width:"100%", padding:"1rem", borderRadius:"12px", border:"none", background:"#222", color:"white", fontSize:"1rem" }}
            />
          </div>

          {/* Avatar style */}
          <div style={{ marginBottom:"1.5rem", textAlign:"left" }}>
            <label style={{ display:"block", marginBottom:"0.5rem", opacity:0.8 }}>{t.avatarStyle}</label>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button
                onClick={() => setSetupAvatarStyle("anime")}
                style={{ flex:1, padding:"1rem", borderRadius:"12px", border:"none", background:setupAvatarStyle==="anime"?"#ff66b3":"#333", color:setupAvatarStyle==="anime"?"#000":"#fff", cursor:"pointer", fontWeight:"bold" }}
              >
                🎨 Anime
              </button>
              <button
                onClick={() => setSetupAvatarStyle("realistic")}
                style={{ flex:1, padding:"1rem", borderRadius:"12px", border:"none", background:setupAvatarStyle==="realistic"?"#ff66b3":"#333", color:setupAvatarStyle==="realistic"?"#000":"#fff", cursor:"pointer", fontWeight:"bold" }}
              >
                📷 Realistic
              </button>
            </div>
          </div>

          {/* Generate avatar button */}
          <button
            onClick={generateAvatar}
            disabled={!setupAvatarDesc.trim() || generatingAvatar}
            style={{ width:"100%", padding:"1rem", borderRadius:"12px", border:"none", background:"#333", color:"#fff", cursor:"pointer", fontWeight:"bold", marginBottom:"1.5rem", opacity:setupAvatarDesc.trim()?1:0.5 }}
          >
            {generatingAvatar ? "Generating... ✨" : t.generate}
          </button>

          {/* Avatar preview */}
          {generatedAvatarUrl && (
            <div style={{ marginBottom:"1.5rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedAvatarUrl}
                alt="Generated Avatar"
                style={{ width:"150px", height:"150px", borderRadius:"50%", border:"3px solid #ff66b3" }}
              />
            </div>
          )}

          {/* Complete setup button */}
          <button
            onClick={completeSetup}
            disabled={!setupName.trim()}
            style={{ width:"100%", padding:"1.2rem", borderRadius:"12px", border:"none", background:"#ff66b3", color:"#000", cursor:"pointer", fontWeight:"bold", fontSize:"1.1rem", opacity:setupName.trim()?1:0.5 }}
          >
            {t.startChat} 💬
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight:"100vh", background:"#000", color:"#ff66b3", fontFamily:"system-ui, sans-serif" }}>
      <div style={{textAlign:"center", padding:"2rem 1rem"}}>
        {/* User info */}
        {user && (
          <div style={{ marginBottom:"1rem", display:"flex", alignItems:"center", justifyContent:"center", gap:"1rem" }}>
            {user.avatarUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.avatarUrl}
                alt={user.name}
                style={{ width:"50px", height:"50px", borderRadius:"50%", border:"2px solid #ff66b3" }}
              />
            )}
            <span style={{ fontSize:"1.2rem" }}>Hello, <strong>{user.name}</strong>!</span>
            {user.isPaid && <span style={{ background:"#ff66b3", color:"#000", padding:"0.25rem 0.75rem", borderRadius:"20px", fontSize:"0.9rem", fontWeight:"bold" }}>✨ Premium</span>}
          </div>
        )}

        <h1 style={{fontSize:"3.5rem", fontWeight:900, margin:0}}>{t.title(role)}</h1>
        <p style={{fontSize:"1.8rem", margin:"1rem 0", opacity:0.9}}>{t.tagline}</p>

        {/* Upgrade button for non-paid users */}
        {user && !user.isPaid && (
          <button
            onClick={handleUpgrade}
            style={{ margin:"1rem 0", padding:"1rem 2rem", background:"linear-gradient(135deg, #ff66b3, #ff9966)", color:"#000", border:"none", borderRadius:"30px", fontWeight:"bold", cursor:"pointer", fontSize:"1.1rem", boxShadow:"0 4px 15px rgba(255,102,179,0.4)" }}
          >
            {t.upgrade} - {t.premium}
          </button>
        )}

        {/* Role buttons */}
        <div style={{margin:"2rem 0"}}>
          {(["girlfriend","boyfriend","friend","girlfriend_friend"] as const).map(r=>(
            <button key={r} onClick={()=>setRole(r)} style={{margin:"0.5rem", padding:"0.9rem 1.5rem", background:role===r?"#ff66b3":"#333", color:role===r?"#000":"#fff", border:"none", borderRadius:"30px", fontWeight:"bold", cursor:"pointer"}}>
              {r==="girlfriend"?"Girlfriend":r==="boyfriend"?"Boyfriend":r==="friend"?"Best Friend":"Best Girlfriend"}
            </button>
          ))}
        </div>

        {/* Flags */}
        <div style={{margin:"2rem 0"}}>
          {languageOrder.map(code=>(
            <button key={code} onClick={()=>setLang(code)} style={{margin:"0.5rem", fontSize:"2rem", background:"none", border:"none", cursor:"pointer", opacity:lang===code?1:0.55}}>
              {translations[code].flag}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{maxWidth:"900px", margin:"0 auto", padding:"0 1rem 160px"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{textAlign:m.role==="user"?"right":"left", margin:"1.2rem 0"}}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:"0.5rem" }}>
              {m.role === "assistant" && user?.avatarUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.avatarUrl} alt="" style={{ width:"36px", height:"36px", borderRadius:"50%" }} />
              )}
              <div style={{display:"inline-block", background:m.role==="user"?"#ff66b3":"#333", color:m.role==="user"?"#000":"#fff", padding:"1.1rem 1.7rem", borderRadius:"22px", maxWidth:"82%"}}>
                {m.role === "assistant" && user?.name && (
                  <div style={{ fontSize:"0.85rem", opacity:0.7, marginBottom:"0.3rem" }}>{user.name}&apos;s AI</div>
                )}
                {m.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{position:"fixed", bottom:0, left:0, right:0, background:"#111", padding:"1rem", display:"flex", alignItems:"center"}}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && !e.shiftKey && (e.preventDefault(), send())}
          placeholder={t.placeholder}
          disabled={sendingMessage}
          style={{flex:1, padding:"1.2rem 1.8rem", borderRadius:"30px", border:"none", background:"#222", color:"white", fontSize:"1.1rem"}}
        />
        <button onClick={send} disabled={sendingMessage} style={{marginLeft:"1rem", background:"#ff66b3", border:"none", width:"56px", height:"56px", borderRadius:"50%", color:"black", fontSize:"1.6rem", cursor:"pointer", opacity:sendingMessage?0.5:1}}>
          {sendingMessage ? "..." : "➤"}
        </button>
      </div>
    </main>
  );
}
