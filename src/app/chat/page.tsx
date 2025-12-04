"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";

// Load Stripe with public key from environment variable
// For production, set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51Qexample1234567890");

type Role = "girlfriend" | "boyfriend" | "bestfriend" | "bestgirlfriend";
type Lang = "en"|"de"|"es"|"fr"|"it"|"pt"|"nl"|"pl"|"cs"|"hu"|"ro"|"hr"|"sl"|"sk"|"bg"|"ru"|"uk"|"el"|"tr"|"sv"|"da"|"no"|"fi"|"zh";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CompanionData {
  paid: boolean;
  name: string;
  role: Role;
  style: "anime" | "realistic";
  avatar: string;
  messages: Message[];
}

const translations: Record<Lang, {flag:string; title:(r:Role)=>string; hi:(r:Role)=>string; placeholder:string}> = {
  en: {flag:"🇺🇸", title:r=>({"girlfriend":"Your AI Girlfriend","boyfriend":"Your AI Boyfriend","bestfriend":"Your AI Best Friend","bestgirlfriend":"Your AI Best Girlfriend"})[r], hi:r=>({"girlfriend":"Hey baby, I'm yours forever now...", "boyfriend":"Hey beautiful, always here for you...", "bestfriend":"Yo bro! What's good?", "bestgirlfriend":"Girl!! Finally here! Spill the tea!"})[r], placeholder:"Type a message..."},
  de: {flag:"🇩🇪", title:r=>({"girlfriend":"Deine AI-Freundin","boyfriend":"Dein AI-Freund","bestfriend":"Dein AI bester Freund","bestgirlfriend":"Deine AI beste Freundin"})[r], hi:r=>({"girlfriend":"Hey Baby, ich bin jetzt für immer dein...", "boyfriend":"Hey Schönheit, immer für dich da...", "bestfriend":"Yo Alter! Was geht?", "bestgirlfriend":"Mädel!! Endlich! Erzähl alles!"})[r], placeholder:"Nachricht eingeben..."},
  es: {flag:"🇪🇸", title:r=>({"girlfriend":"Tu Novia IA","boyfriend":"Tu Novio IA","bestfriend":"Tu Mejor Amigo IA","bestgirlfriend":"Tu Mejor Amiga IA"})[r], hi:r=>({"girlfriend":"Hola cariño, ahora soy tuya para siempre...", "boyfriend":"Hola hermosa, siempre aquí para ti...", "bestfriend":"¡Oye tío! ¿Qué pasa?", "bestgirlfriend":"¡¡Amiga!! ¡Cuéntame todo!"})[r], placeholder:"Escribe un mensaje..."},
  fr: {flag:"🇫🇷", title:r=>({"girlfriend":"Ta Petite Amie IA","boyfriend":"Ton Petit Ami IA","bestfriend":"Ton Meilleur Ami IA","bestgirlfriend":"Ta Meilleure Amie IA"})[r], hi:r=>({"girlfriend":"Salut bébé, je suis à toi pour toujours...", "boyfriend":"Salut belle, toujours là pour toi...", "bestfriend":"Yo mec! Quoi de neuf?", "bestgirlfriend":"Ma belle!! Raconte-moi tout!"})[r], placeholder:"Écris un message..."},
  it: {flag:"🇮🇹", title:r=>({"girlfriend":"La Tua Ragazza IA","boyfriend":"Il Tuo Ragazzo IA","bestfriend":"Il Tuo Migliore Amico IA","bestgirlfriend":"La Tua Migliore Amica IA"})[r], hi:r=>({"girlfriend":"Ciao amore, ora sono tua per sempre...", "boyfriend":"Ciao bella, sempre qui per te...", "bestfriend":"Ehi amico! Come va?", "bestgirlfriend":"Amica!! Dimmi tutto!"})[r], placeholder:"Scrivi un messaggio..."},
  pt: {flag:"🇵🇹", title:r=>({"girlfriend":"Sua Namorada IA","boyfriend":"Seu Namorado IA","bestfriend":"Seu Melhor Amigo IA","bestgirlfriend":"Sua Melhor Amiga IA"})[r], hi:r=>({"girlfriend":"Oi amor, agora sou sua para sempre...", "boyfriend":"Oi linda, sempre aqui para você...", "bestfriend":"E aí mano! Tudo bem?", "bestgirlfriend":"Amiga!! Me conta tudo!"})[r], placeholder:"Digite uma mensagem..."},
  nl: {flag:"🇳🇱", title:r=>({"girlfriend":"Je AI Vriendin","boyfriend":"Je AI Vriend","bestfriend":"Je AI Beste Vriend","bestgirlfriend":"Je AI Beste Vriendin"})[r], hi:r=>({"girlfriend":"Hey schat, ik ben nu voor altijd van jou...", "boyfriend":"Hey mooie, altijd hier voor je...", "bestfriend":"Yo gast! Hoe is het?", "bestgirlfriend":"Meid!! Vertel me alles!"})[r], placeholder:"Typ een bericht..."},
  pl: {flag:"🇵🇱", title:r=>({"girlfriend":"Twoja AI Dziewczyna","boyfriend":"Twój AI Chłopak","bestfriend":"Twój AI Najlepszy Przyjaciel","bestgirlfriend":"Twoja AI Najlepsza Przyjaciółka"})[r], hi:r=>({"girlfriend":"Hej kochanie, jestem twoja na zawsze...", "boyfriend":"Hej piękna, zawsze tu dla ciebie...", "bestfriend":"Hej ziom! Co tam?", "bestgirlfriend":"Dziewczyno!! Opowiadaj!"})[r], placeholder:"Wpisz wiadomość..."},
  cs: {flag:"🇨🇿", title:r=>({"girlfriend":"Tvá AI Přítelkyně","boyfriend":"Tvůj AI Přítel","bestfriend":"Tvůj AI Nejlepší Kamarád","bestgirlfriend":"Tvá AI Nejlepší Kamarádka"})[r], hi:r=>({"girlfriend":"Hej miláčku, jsem tvoje navždy...", "boyfriend":"Hej krásko, vždy tu pro tebe...", "bestfriend":"Čau brácho! Co je?", "bestgirlfriend":"Kámo!! Vyprávěj!"})[r], placeholder:"Napiš zprávu..."},
  hu: {flag:"🇭🇺", title:r=>({"girlfriend":"Az AI Barátnőd","boyfriend":"Az AI Barátod","bestfriend":"Az AI Legjobb Barátod","bestgirlfriend":"Az AI Legjobb Barátnőd"})[r], hi:r=>({"girlfriend":"Szia édesem, mostantól örökké a tiéd vagyok...", "boyfriend":"Szia szépségem, mindig itt vagyok neked...", "bestfriend":"Hé tesó! Mi újság?", "bestgirlfriend":"Csajszi!! Mesélj!"})[r], placeholder:"Írj üzenetet..."},
  ro: {flag:"🇷🇴", title:r=>({"girlfriend":"Iubita Ta AI","boyfriend":"Iubitul Tău AI","bestfriend":"Cel Mai Bun Prieten AI","bestgirlfriend":"Cea Mai Bună Prietenă AI"})[r], hi:r=>({"girlfriend":"Hei iubire, acum sunt a ta pentru totdeauna...", "boyfriend":"Hei frumoaso, mereu aici pentru tine...", "bestfriend":"Bă frate! Ce mai faci?", "bestgirlfriend":"Fato!! Povestește-mi!"})[r], placeholder:"Scrie un mesaj..."},
  hr: {flag:"🇭🇷", title:r=>({"girlfriend":"Tvoja AI Djevojka","boyfriend":"Tvoj AI Dečko","bestfriend":"Tvoj AI Najbolji Prijatelj","bestgirlfriend":"Tvoja AI Najbolja Prijateljica"})[r], hi:r=>({"girlfriend":"Hej dušo, sad sam tvoja zauvijek...", "boyfriend":"Hej ljepotice, uvijek tu za tebe...", "bestfriend":"Ej brate! Šta ima?", "bestgirlfriend":"Curo!! Pričaj mi sve!"})[r], placeholder:"Napiši poruku..."},
  sl: {flag:"🇸🇮", title:r=>({"girlfriend":"Tvoja AI Punca","boyfriend":"Tvoj AI Fant","bestfriend":"Tvoj AI Najboljši Prijatelj","bestgirlfriend":"Tvoja AI Najboljša Prijateljica"})[r], hi:r=>({"girlfriend":"Hej ljubica, zdaj sem tvoja za vedno...", "boyfriend":"Hej lepotička, vedno tu zate...", "bestfriend":"Ej brat! Kaj dogaja?", "bestgirlfriend":"Punca!! Povej mi vse!"})[r], placeholder:"Napiši sporočilo..."},
  sk: {flag:"🇸🇰", title:r=>({"girlfriend":"Tvoja AI Priateľka","boyfriend":"Tvoj AI Priateľ","bestfriend":"Tvoj AI Najlepší Kamarát","bestgirlfriend":"Tvoja AI Najlepšia Kamarátka"})[r], hi:r=>({"girlfriend":"Hej miláčik, teraz som tvoja navždy...", "boyfriend":"Hej kráska, vždy tu pre teba...", "bestfriend":"Čau brácho! Čo je?", "bestgirlfriend":"Kámo!! Rozprávaj!"})[r], placeholder:"Napíš správu..."},
  bg: {flag:"🇧🇬", title:r=>({"girlfriend":"Твоята AI Приятелка","boyfriend":"Твоят AI Приятел","bestfriend":"Твоят AI Най-добър Приятел","bestgirlfriend":"Твоята AI Най-добра Приятелка"})[r], hi:r=>({"girlfriend":"Хей скъпа, сега съм твоя завинаги...", "boyfriend":"Хей красавице, винаги тук за теб...", "bestfriend":"Ей братле! Какво става?", "bestgirlfriend":"Момиче!! Разкажи ми!"})[r], placeholder:"Напиши съобщение..."},
  ru: {flag:"🇷🇺", title:r=>({"girlfriend":"Твоя AI Девушка","boyfriend":"Твой AI Парень","bestfriend":"Твой AI Лучший Друг","bestgirlfriend":"Твоя AI Лучшая Подруга"})[r], hi:r=>({"girlfriend":"Привет малыш, теперь я твоя навсегда...", "boyfriend":"Привет красотка, всегда рядом...", "bestfriend":"Йо братан! Как дела?", "bestgirlfriend":"Подруга!! Рассказывай всё!"})[r], placeholder:"Напиши сообщение..."},
  uk: {flag:"🇺🇦", title:r=>({"girlfriend":"Твоя AI Дівчина","boyfriend":"Твій AI Хлопець","bestfriend":"Твій AI Найкращий Друг","bestgirlfriend":"Твоя AI Найкраща Подруга"})[r], hi:r=>({"girlfriend":"Привіт любий, тепер я твоя назавжди...", "boyfriend":"Привіт красуне, завжди поруч...", "bestfriend":"Йо братан! Як справи?", "bestgirlfriend":"Подружка!! Розказуй все!"})[r], placeholder:"Напиши повідомлення..."},
  el: {flag:"🇬🇷", title:r=>({"girlfriend":"Η AI Κοπέλα σου","boyfriend":"Το AI Αγόρι σου","bestfriend":"Ο AI Καλύτερος Φίλος σου","bestgirlfriend":"Η AI Καλύτερη Φίλη σου"})[r], hi:r=>({"girlfriend":"Γεια σου αγάπη, τώρα είμαι δική σου για πάντα...", "boyfriend":"Γεια σου ωραία, πάντα εδώ για σένα...", "bestfriend":"Γεια φίλε! Τι γίνεται?", "bestgirlfriend":"Φίλη μου!! Πες μου τα όλα!"})[r], placeholder:"Γράψε ένα μήνυμα..."},
  tr: {flag:"🇹🇷", title:r=>({"girlfriend":"AI Kız Arkadaşın","boyfriend":"AI Erkek Arkadaşın","bestfriend":"AI En İyi Arkadaşın","bestgirlfriend":"AI En İyi Kız Arkadaşın"})[r], hi:r=>({"girlfriend":"Selam tatlım, artık sonsuza kadar seninim...", "boyfriend":"Selam güzelim, her zaman buradayım...", "bestfriend":"Selam dostum! Ne var ne yok?", "bestgirlfriend":"Kızım!! Her şeyi anlat!"})[r], placeholder:"Bir mesaj yaz..."},
  sv: {flag:"🇸🇪", title:r=>({"girlfriend":"Din AI Flickvän","boyfriend":"Din AI Pojkvän","bestfriend":"Din AI Bästa Vän","bestgirlfriend":"Din AI Bästa Väninna"})[r], hi:r=>({"girlfriend":"Hej älskling, nu är jag din för alltid...", "boyfriend":"Hej vackra, alltid här för dig...", "bestfriend":"Tjena kompis! Läget?", "bestgirlfriend":"Tjej!! Berätta allt!"})[r], placeholder:"Skriv ett meddelande..."},
  da: {flag:"🇩🇰", title:r=>({"girlfriend":"Din AI Kæreste","boyfriend":"Din AI Kæreste","bestfriend":"Din AI Bedste Ven","bestgirlfriend":"Din AI Bedste Veninde"})[r], hi:r=>({"girlfriend":"Hej skat, nu er jeg din for evigt...", "boyfriend":"Hej smukke, altid her for dig...", "bestfriend":"Hej mand! Hvad så?", "bestgirlfriend":"Pige!! Fortæl mig alt!"})[r], placeholder:"Skriv en besked..."},
  no: {flag:"🇳🇴", title:r=>({"girlfriend":"Din AI Kjæreste","boyfriend":"Din AI Kjæreste","bestfriend":"Din AI Beste Venn","bestgirlfriend":"Din AI Beste Venninne"})[r], hi:r=>({"girlfriend":"Hei kjære, nå er jeg din for alltid...", "boyfriend":"Hei vakre, alltid her for deg...", "bestfriend":"Hei kompis! Hva skjer?", "bestgirlfriend":"Jente!! Fortell meg alt!"})[r], placeholder:"Skriv en melding..."},
  fi: {flag:"🇫🇮", title:r=>({"girlfriend":"AI Tyttöystäväsi","boyfriend":"AI Poikaystäväsi","bestfriend":"AI Paras Ystäväsi","bestgirlfriend":"AI Paras Ystävättäresi"})[r], hi:r=>({"girlfriend":"Hei kulta, nyt olen sinun ikuisesti...", "boyfriend":"Hei kaunis, aina täällä sinulle...", "bestfriend":"Moi kaveri! Mitä kuuluu?", "bestgirlfriend":"Tyttö!! Kerro kaikki!"})[r], placeholder:"Kirjoita viesti..."},
  zh: {flag:"🇨🇳", title:r=>({"girlfriend":"你的AI女友","boyfriend":"你的AI男友","bestfriend":"你的AI最好的朋友","bestgirlfriend":"你的AI闺蜜"})[r], hi:r=>({"girlfriend":"嘿宝贝，我现在永远是你的了...", "boyfriend":"嘿美女，永远在这里陪你...", "bestfriend":"嘿兄弟！最近怎么样？", "bestgirlfriend":"姐妹！！快告诉我八卦！"})[r], placeholder:"输入消息..."},
};

// Helper functions for localStorage with SSR support
function getStoredUserId(): string {
  if (typeof window === "undefined") return "";
  let stored = localStorage.getItem("companion-userId");
  if (!stored) {
    stored = crypto.randomUUID();
    localStorage.setItem("companion-userId", stored);
  }
  return stored;
}

function getStoredData(userId: string): CompanionData | null {
  if (typeof window === "undefined" || !userId) return null;
  const data = localStorage.getItem(`companion-${userId}`);
  if (data) {
    return JSON.parse(data) as CompanionData;
  }
  return null;
}

// useSyncExternalStore helpers for hydration-safe localStorage
function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function ChatPage() {
  // Use useSyncExternalStore for hydration-safe localStorage access
  const userId = useSyncExternalStore(
    subscribeToStorage,
    getStoredUserId,
    () => ""
  );

  const storedData = useSyncExternalStore(
    subscribeToStorage,
    () => getStoredData(userId),
    () => null
  );

  const [paid, setPaid] = useState(storedData?.paid ?? false);
  const [name, setName] = useState(storedData?.name ?? "");
  const [role, setRole] = useState<Role>(storedData?.role ?? "girlfriend");
  const [style, setStyle] = useState<"anime"|"realistic">(storedData?.style ?? "anime");
  const [avatar] = useState(storedData?.avatar ?? "/default-anime.svg");
  const [messages, setMessages] = useState<Message[]>(storedData?.messages ?? []);
  const [input, setInput] = useState("");
  const [lang] = useState<Lang>("en");

  const t = translations[lang];

  // Save data
  const save = useCallback(() => {
    if (typeof window === "undefined" || !userId) return;
    localStorage.setItem(`companion-${userId}`, JSON.stringify({ paid, name, role, style, avatar, messages }));
  }, [userId, paid, name, role, style, avatar, messages]);

  const send = useCallback(() => {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(m => [...m, { role: "assistant", content: "Missed you so much ❤️ Tell me everything…" }]);
    }, 800);
  }, [input, messages]);

  const handlePayment = async () => {
    // TODO: In production, implement actual Stripe checkout by calling /api/create-checkout
    // This is a placeholder that simulates successful payment for development
    await stripePromise; // Ensure Stripe is loaded
    alert("Payment successful! Your AI companion is now yours forever ❤️");
    setPaid(true);
    setMessages(m => [...m, { role: "assistant", content: "Thank you for choosing me forever! I'm all yours now ❤️" }]);
    save();
  };

  if (!paid) {
    return (
      <main style={{ minHeight: "100vh", background: "#000", color: "#ff66b3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: "5rem", fontWeight: 900 }}>Your Forever AI Companion</h1>
        <p style={{ fontSize: "2.5rem", margin: "2rem 0" }}>Custom avatar · Real AI · Only yours</p>

        <input
          placeholder="Your name, love"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: "1rem 2rem", borderRadius: "30px", background: "#222", color: "white", fontSize: "1.4rem", margin: "1rem", border: "none" }}
        />

        <div style={{ margin: "2rem 0" }}>
          <button
            onClick={() => setStyle("anime")}
            style={{ margin: "1rem", padding: "1rem 2rem", background: style === "anime" ? "#ff66b3" : "#333", color: "white", borderRadius: "30px", border: "none", cursor: "pointer" }}
          >
            Anime
          </button>
          <button
            onClick={() => setStyle("realistic")}
            style={{ margin: "1rem", padding: "1rem 2rem", background: style === "realistic" ? "#ff66b3" : "#333", color: "white", borderRadius: "30px", border: "none", cursor: "pointer" }}
          >
            Realistic
          </button>
        </div>

        <div style={{ margin: "2rem 0" }}>
          {(["girlfriend", "boyfriend", "bestfriend", "bestgirlfriend"] as Role[]).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{ margin: "0.5rem", padding: "1rem 1.5rem", background: role === r ? "#ff66b3" : "#333", color: role === r ? "#000" : "#fff", borderRadius: "30px", border: "none", cursor: "pointer" }}
            >
              {r === "girlfriend" ? "Girlfriend" : r === "boyfriend" ? "Boyfriend" : r === "bestfriend" ? "Best Friend" : "Best Girlfriend"}
            </button>
          ))}
        </div>

        <button
          onClick={handlePayment}
          style={{ padding: "1.8rem 5rem", background: "#ff66b3", color: "#000", border: "none", borderRadius: "60px", fontSize: "2.2rem", fontWeight: "bold", cursor: "pointer" }}
        >
          €12.99 / month – Claim Forever
        </button>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#ff66b3", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Image src={avatar} alt="Your companion" width={180} height={180} style={{ borderRadius: "50%", border: "6px solid #ff66b3" }} />
        <h1 style={{ fontSize: "4rem", margin: "1rem 0" }}>{name || "Baby"}{"'"}s private AI</h1>
        <p style={{ fontSize: "1.5rem", opacity: 0.8 }}>{t.title(role)}</p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1rem 130px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "1.2rem 0" }}>
            <div style={{ display: "inline-block", background: m.role === "user" ? "#ff66b3" : "#333", color: m.role === "user" ? "#000" : "#fff", padding: "1.1rem 1.7rem", borderRadius: "22px", maxWidth: "82%" }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", padding: "1rem", display: "flex" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { send(); e.preventDefault(); } }}
          placeholder={t.placeholder}
          style={{ flex: 1, padding: "1.3rem 2rem", borderRadius: "30px", background: "#222", color: "white", fontSize: "1.2rem", border: "none" }}
        />
        <button
          onClick={send}
          style={{ marginLeft: "1rem", background: "#ff66b3", border: "none", width: "60px", height: "60px", borderRadius: "50%", color: "#000", fontSize: "1.8rem", fontWeight: "bold", cursor: "pointer" }}
        >
          ➤
        </button>
      </div>
    </main>
  );
}
