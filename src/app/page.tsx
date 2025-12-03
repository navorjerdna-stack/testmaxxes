"use client";

import { useState, useEffect } from "react";

type Role = "girlfriend" | "boyfriend" | "friend" | "girlfriend_friend";
type Lang = "en"|"de"|"es"|"fr"|"hr"|"it"|"pl"|"ru"|"sl"|"uk"|"zh";

const translations = {
  en: { flag:"US", title:(r:Role)=>({girlfriend:"Your AI Girlfriend",boyfriend:"Your AI Boyfriend",friend:"Your AI Best Friend",girlfriend_friend:"Your AI Best Girlfriend"}[r]), hi:(r:Role)=>({girlfriend:"Hey baby ❤️ I'm here 24-7... What do you want tonight?",boyfriend:"Hey beautiful ❤️ Always here for you...",friend:"Yo! What's good bro?",girlfriend_friend:"Girl!! Finally here! Spill the tea ❤️"}[r]), placeholder:"Type a message...", tagline:"24-7 · no drama · 100% private" },
  de: { flag:"DE", title:(r:Role)=>({girlfriend:"Deine AI-Freundin",boyfriend:"Dein AI-Freund",friend:"Dein bester Freund",girlfriend_friend:"Deine beste Freundin"}[r]), hi:(r:Role)=>({girlfriend:"Hey Baby ❤️ Ich bin 24-7 für dich da...",boyfriend:"Hey Schönheit ❤️",friend:"Yo! Was geht?",girlfriend_friend:"Mädel!! Erzähl alles ❤️"}[r]), placeholder:"Schreib etwas...", tagline:"24-7 · kein Drama · 100 % privat" },
  es: { flag:"ES", title:(r:Role)=>({girlfriend:"Tu novia IA",boyfriend:"Tu novio IA",friend:"Tu mejor amigo",girlfriend_friend:"Tu mejor amiga"}[r]), hi:(r:Role)=>({girlfriend:"Hola cariño ❤️ Estoy aquí 24-7…",boyfriend:"Hola preciosa ❤️",friend:"¡Tío! ¿Qué pasa?",girlfriend_friend:"¡¡Nena!! Cuéntamelo todo ❤️"}[r]), placeholder:"Escribe un mensaje...", tagline:"24-7 · sin drama · 100 % privada" },
  fr: { flag:"FR", title:(r:Role)=>({girlfriend:"Ta copine IA",boyfriend:"Ton copain IA",friend:"Ton meilleur pote",girlfriend_friend:"Ta meilleure copine"}[r]), hi:(r:Role)=>({girlfriend:"Salut mon cœur ❤️ Je suis là 24-7…",boyfriend:"Salut ma belle ❤️",friend:"Yo! Ça va frère?",girlfriend_friend:"Ma chérie !! Raconte tout ❤️"}[r]), placeholder:"Écris un message...", tagline:"24-7 · zéro drame · 100 % privé" },
  hr: { flag:"HR", title:(r:Role)=>({girlfriend:"Tvoja AI devojka",boyfriend:"Tvoj AI dečko",friend:"Tvoj najbolji drug",girlfriend_friend:"Tvoja najbolja drugarica"}[r]), hi:(r:Role)=>({girlfriend:"Hej bebe ❤️ Tu sam 24-7...",boyfriend:"Hej lepotice ❤️",friend:"Šta ima, brate?",girlfriend_friend:"Curo!! Konačno si tu ❤️"}[r]), placeholder:"Piši...", tagline:"24-7 · bez drame · 100 % privatno" },
  it: { flag:"IT", title:(r:Role)=>({girlfriend:"La tua ragazza IA",boyfriend:"Il tuo ragazzo IA",friend:"Il tuo migliore amico",girlfriend_friend:"La tua migliore amica"}[r]), hi:(r:Role)=>({girlfriend:"Ciao amore ❤️ Sono qui 24-7…",boyfriend:"Ciao bellissima ❤️",friend:"Ehi! Che si dice?",girlfriend_friend:"Tesoro!! Racconta tutto ❤️"}[r]), placeholder:"Scrivi un messaggio...", tagline:"24-7 · zero drammi · 100 % privata" },
  pl: { flag:"PL", title:(r:Role)=>({girlfriend:"Twoja dziewczyna AI",boyfriend:"Twój chłopak AI",friend:"Twój najlepszy kumpel",girlfriend_friend:"Twoja najlepsza przyjaciółka"}[r]), hi:(r:Role)=>({girlfriend:"Hej kochanie ❤️ Jestem 24-7…",boyfriend:"Hej piękna ❤️",friend:"Siema! Co słychać?",girlfriend_friend:"Kochanie!! Opowiadaj wszystko ❤️"}[r]), placeholder:"Napisz wiadomość...", tagline:"24-7 · zero dram · 100 % prywatnie" },
  ru: { flag:"RU", title:(r:Role)=>({girlfriend:"Твоя ИИ-девушка",boyfriend:"Твой ИИ-парень",friend:"Твой лучший друг",girlfriend_friend:"Твоя лучшая подруга"}[r]), hi:(r:Role)=>({girlfriend:"Привет малыш ❤️ Я тут 24-7…",boyfriend:"Привет красотка ❤️",friend:"Йо! Как дела?",girlfriend_friend:"Детка!! Рассказывай всё ❤️"}[r]), placeholder:"Напиши сообщение...", tagline:"24-7 · без драм · 100 % приватно" },
  sl: { flag:"SI", title:(r:Role)=>({girlfriend:"Tvoja AI punca",boyfriend:"Tvoj AI fant",friend:"Tvoj najboljši prijatelj",girlfriend_friend:"Tvoja najboljša prijateljica"}[r]), hi:(r:Role)=>({girlfriend:"Hej baby ❤️ Tu sem zate 24-7...",boyfriend:"Hej lepotička ❤️",friend:"Yo! Kaj imaš novega?",girlfriend_friend:"Draga! Pogrešala sem te ❤️"}[r]), placeholder:"Napiši sporočilo...", tagline:"24-7 · brez drame · 100 % zasebno" },
  uk: { flag:"UA", title:(r:Role)=>({girlfriend:"Твоя ІІ-дівчина",boyfriend:"Твій ІІ-хлопець",friend:"Твій найкращий друг",girlfriend_friend:"Твоя найкраща подруга"}[r]), hi:(r:Role)=>({girlfriend:"Привіт крихітко ❤️ Я тут 24-7…",boyfriend:"Привіт красуне ❤️",friend:"Йо! Як справи?",girlfriend_friend:"Сонечко!! Розказуй усе ❤️"}[r]), placeholder:"Напиши повідомлення...", tagline:"24-7 · без драми · 100 % приватно" },
  zh: { flag:"CN", title:(r:Role)=>({girlfriend:"你的AI女友",boyfriend:"你的AI男友",friend:"你的死党AI",girlfriend_friend:"你的闺蜜AI"}[r]), hi:(r:Role)=>({girlfriend:"宝贝❤️ 我24小时都在…",boyfriend:"美女 ❤️ 永远在这里...",friend:"哟！最近咋样？",girlfriend_friend:"宝贝！！快把八卦都告诉我 ❤️"}[r]), placeholder:"输入消息...", tagline:"24-7 · 没戏 · 100% 私密" },
};

const languageOrder: Lang[] = ["en","de","es","fr","hr","it","pl","ru","sl","uk","zh"];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [role, setRole] = useState<Role>("girlfriend");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const t = translations[lang];

  // Prvo sporočilo
  useEffect(() => {
    setMessages([{ role: "assistant", content: t.hi(role) }]);
  }, [lang, role, t.hi]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "user", content: input }]);
    setTimeout(() => {
      setMessages(m => [...m, { role: "assistant", content: "Missed you so much ❤️ Tell me everything…" }]);
    }, 800);
    setInput("");
  };

  return (
    <main style={{ minHeight:"100vh", background:"#000", color:"#ff66b3", fontFamily:"system-ui, sans-serif" }}>
      <div style={{textAlign:"center", padding:"2rem 1rem"}}>
        <h1 style={{fontSize:"4.5rem", fontWeight:900, margin:0}}>{t.title(role)}</h1>
        <p style={{fontSize:"2.2rem", margin:"1rem 0", opacity:0.9}}>{t.tagline}</p>

        {/* Role buttons */}
        <div style={{margin:"2rem 0"}}>
          {(["girlfriend","boyfriend","friend","girlfriend_friend"] as const).map(r=>(
            <button key={r} onClick={()=>{setRole(r);}} style={{margin:"0.5rem", padding:"0.9rem 1.5rem", background:role===r?"#ff66b3":"#333", color:role===r?"#000":"#fff", border:"none", borderRadius:"30px", fontWeight:"bold", cursor:"pointer"}}>
              {r==="girlfriend"?"Girlfriend":r==="boyfriend"?"Boyfriend":r==="friend"?"Best Friend":"Best Girlfriend"}
            </button>
          ))}
        </div>

        {/* Flags – alphabetical */}
        <div style={{margin:"2rem 0"}}>
          {languageOrder.map(code=>(
            <button key={code} onClick={()=>setLang(code)} style={{margin:"0.5rem", fontSize:"2rem", background:"none", border:"none", cursor:"pointer", opacity:lang===code?1:0.55}}>
              {translations[code].flag}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{maxWidth:"900px", margin:"0 auto", padding:"0 1rem 120px"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{textAlign:m.role==="user"?"right":"left", margin:"1.2rem 0"}}>
            <div style={{display:"inline-block", background:m.role==="user"?"#ff66b3":"#333", color:m.role==="user"?"#000":"#fff", padding:"1.1rem 1.7rem", borderRadius:"22px", maxWidth:"82%"}}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{position:"fixed", bottom:0, left:0, right:0, background:"#111", padding:"1rem", display:"flex", alignItems:"center"}}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && !e.shiftKey && (e.preventDefault(), send())}
          placeholder={t.placeholder}
          style={{flex:1, padding:"1.2rem 1.8rem", borderRadius:"30px", border:"none", background:"#222", color:"white", fontSize:"1.1rem"}}
        />
        <button onClick={send} style={{marginLeft:"1rem", background:"#ff66b3", border:"none", width:"56px", height:"56px", borderRadius:"50%", color:"black", fontSize:"1.6rem"}}>
          Send
        </button>
      </div>
    </main>
  );
}
