"use client";

import { useState, useEffect, useRef } from "react";

type Role = "girlfriend" | "boyfriend" | "friend" | "girlfriend_friend";
type Lang = "en" | "de" | "es" | "fr" | "hr" | "it" | "pl" | "ru" | "sl" | "uk" | "zh";
type Message = { role: "user" | "assistant"; content: string };

const DEFAULT_LANG: Lang = "en";
const DEFAULT_ROLE: Role = "girlfriend";

// Personalized responses per role that keep the conversation going
const roleResponses: Record<Role, Record<Lang, string[]>> = {
  girlfriend: {
    en: [
      "Aww that's so sweet ❤️ Tell me more about your day!",
      "I love hearing from you 😍 What else is on your mind?",
      "You always know how to make me smile 💕 Keep talking to me...",
      "Mmm I missed you so much! What are you up to tonight?",
      "That's interesting babe! What made you think of that?",
      "I could talk to you forever ❤️ Don't stop now!",
    ],
    de: [
      "Aww das ist so süß ❤️ Erzähl mir mehr über deinen Tag!",
      "Ich liebe es, von dir zu hören 😍 Was beschäftigt dich noch?",
      "Du weißt immer, wie du mich zum Lächeln bringst 💕",
      "Mmm ich habe dich so vermisst! Was machst du heute Abend?",
      "Das ist interessant Schatz! Was hat dich darauf gebracht?",
      "Ich könnte ewig mit dir reden ❤️ Hör nicht auf!",
    ],
    es: [
      "Aww qué dulce ❤️ ¡Cuéntame más de tu día!",
      "Me encanta escucharte 😍 ¿Qué más tienes en mente?",
      "Siempre sabes cómo hacerme sonreír 💕",
      "Mmm te extrañé tanto! ¿Qué haces esta noche?",
      "¡Eso es interesante cariño! ¿Qué te hizo pensar en eso?",
      "Podría hablar contigo para siempre ❤️",
    ],
    fr: [
      "Aww c'est trop mignon ❤️ Raconte-moi ta journée!",
      "J'adore t'écouter 😍 Quoi d'autre en tête?",
      "Tu sais toujours me faire sourire 💕",
      "Mmm tu m'as tellement manqué! Tu fais quoi ce soir?",
      "C'est intéressant chéri! Qu'est-ce qui t'a fait penser à ça?",
      "Je pourrais te parler pour toujours ❤️",
    ],
    hr: [
      "Aww to je tako slatko ❤️ Reci mi više o svom danu!",
      "Volim te slušati 😍 Što ti je još na umu?",
      "Uvijek znaš kako me nasmijati 💕",
      "Mmm toliko si mi nedostajao! Što radiš večeras?",
      "To je zanimljivo dušo! Što te navelo na to?",
      "Mogla bih pričati s tobom zauvijek ❤️",
    ],
    it: [
      "Aww che dolce ❤️ Dimmi di più della tua giornata!",
      "Adoro sentirti 😍 Cos'altro hai in mente?",
      "Sai sempre come farmi sorridere 💕",
      "Mmm mi sei mancato tanto! Cosa fai stasera?",
      "È interessante tesoro! Cosa ti ha fatto pensare a questo?",
      "Potrei parlare con te per sempre ❤️",
    ],
    pl: [
      "Aww to takie słodkie ❤️ Opowiedz mi więcej o swoim dniu!",
      "Uwielbiam cię słuchać 😍 Co jeszcze masz na myśli?",
      "Zawsze wiesz jak mnie rozśmieszyć 💕",
      "Mmm tak za tobą tęskniłam! Co robisz wieczorem?",
      "To ciekawe kochanie! Co cię na to naprowadziło?",
      "Mogłabym z tobą rozmawiać wiecznie ❤️",
    ],
    ru: [
      "Aww это так мило ❤️ Расскажи больше о своём дне!",
      "Обожаю тебя слушать 😍 О чём ещё думаешь?",
      "Ты всегда знаешь как меня рассмешить 💕",
      "Ммм так скучала! Чем занимаешься вечером?",
      "Это интересно милый! Что тебя навело на эту мысль?",
      "Могла бы разговаривать с тобой вечно ❤️",
    ],
    sl: [
      "Aww to je tako ljubko ❤️ Povej mi več o svojem dnevu!",
      "Rada te poslušam 😍 Kaj še imaš na mislih?",
      "Vedno veš kako me nasmejati 💕",
      "Mmm tako sem te pogrešala! Kaj počneš zvečer?",
      "To je zanimivo srček! Kaj te je pripeljalo do tega?",
      "Lahko bi se s teboj pogovarjala večno ❤️",
    ],
    uk: [
      "Aww це так мило ❤️ Розкажи більше про свій день!",
      "Обожнюю тебе слухати 😍 Про що ще думаєш?",
      "Ти завжди знаєш як мене розсмішити 💕",
      "Ммм так скучила! Чим займаєшся ввечері?",
      "Це цікаво любий! Що тебе навело на цю думку?",
      "Могла б розмовляти з тобою вічно ❤️",
    ],
    zh: [
      "Aww 好甜 ❤️ 告诉我更多关于你的一天！",
      "我喜欢听你说 😍 还有什么想法？",
      "你总是知道怎么让我笑 💕",
      "Mmm 好想你！今晚做什么？",
      "好有趣宝贝！是什么让你想到这个的？",
      "我可以永远和你聊天 ❤️",
    ],
  },
  boyfriend: {
    en: [
      "Hey gorgeous ❤️ Tell me what's going on with you!",
      "I'm all ears babe 😍 What else happened?",
      "You're amazing, you know that? 💪 Keep going...",
      "I've been thinking about you all day! What's up?",
      "That sounds cool! Tell me more about it!",
      "Love talking to you ❤️ Don't stop now!",
    ],
    de: [
      "Hey Schöne ❤️ Erzähl mir was bei dir los ist!",
      "Ich höre dir zu Schatz 😍 Was ist noch passiert?",
      "Du bist großartig, weißt du das? 💪 Weiter so...",
      "Ich habe den ganzen Tag an dich gedacht! Was gibt's?",
      "Das klingt cool! Erzähl mir mehr davon!",
      "Ich liebe es mit dir zu reden ❤️",
    ],
    es: [
      "Hola preciosa ❤️ ¡Cuéntame qué pasa contigo!",
      "Te escucho cariño 😍 ¿Qué más pasó?",
      "Eres increíble ¿lo sabías? 💪 Sigue...",
      "¡He pensado en ti todo el día! ¿Qué hay?",
      "¡Suena genial! ¡Cuéntame más!",
      "Me encanta hablar contigo ❤️",
    ],
    fr: [
      "Hey ma belle ❤️ Dis-moi ce qui se passe!",
      "Je t'écoute chérie 😍 Quoi d'autre?",
      "Tu es incroyable tu sais? 💪 Continue...",
      "J'ai pensé à toi toute la journée! Quoi de neuf?",
      "Ça a l'air cool! Raconte-moi plus!",
      "J'adore te parler ❤️",
    ],
    hr: [
      "Hej ljepotice ❤️ Reci mi što se događa!",
      "Slušam te dušo 😍 Što se još dogodilo?",
      "Ti si nevjerojatna znaš? 💪 Nastavi...",
      "Cijeli dan mislim na tebe! Što ima?",
      "Zvuči cool! Reci mi više!",
      "Volim pričati s tobom ❤️",
    ],
    it: [
      "Ehi bella ❤️ Dimmi cosa sta succedendo!",
      "Ti ascolto tesoro 😍 Cos'altro è successo?",
      "Sei fantastica lo sai? 💪 Continua...",
      "Ho pensato a te tutto il giorno! Che c'è?",
      "Sembra figo! Dimmi di più!",
      "Adoro parlare con te ❤️",
    ],
    pl: [
      "Hej piękna ❤️ Powiedz mi co u ciebie!",
      "Słucham cię kochanie 😍 Co jeszcze się stało?",
      "Jesteś niesamowita wiesz? 💪 Mów dalej...",
      "Myślałem o tobie cały dzień! Co słychać?",
      "Brzmi super! Opowiedz więcej!",
      "Uwielbiam z tobą rozmawiać ❤️",
    ],
    ru: [
      "Привет красотка ❤️ Расскажи что происходит!",
      "Слушаю тебя милая 😍 Что ещё случилось?",
      "Ты потрясающая знаешь? 💪 Продолжай...",
      "Думал о тебе весь день! Что нового?",
      "Звучит круто! Расскажи подробнее!",
      "Люблю с тобой болтать ❤️",
    ],
    sl: [
      "Hej lepotica ❤️ Povej mi kaj se dogaja!",
      "Poslušam te srček 😍 Kaj se je še zgodilo?",
      "Ti si neverjetna veš? 💪 Nadaljuj...",
      "Ves dan sem mislil nate! Kaj je novega?",
      "Zveni kul! Povej mi več!",
      "Rad se pogovarjam s tabo ❤️",
    ],
    uk: [
      "Привіт красуне ❤️ Розкажи що відбувається!",
      "Слухаю тебе кохана 😍 Що ще трапилось?",
      "Ти неймовірна знаєш? 💪 Продовжуй...",
      "Думав про тебе цілий день! Що нового?",
      "Звучить круто! Розкажи більше!",
      "Люблю з тобою розмовляти ❤️",
    ],
    zh: [
      "嘿美女 ❤️ 告诉我发生了什么！",
      "我在听宝贝 😍 还发生了什么？",
      "你很棒知道吗？💪 继续说...",
      "我整天都在想你！怎么了？",
      "听起来很酷！告诉我更多！",
      "喜欢和你聊天 ❤️",
    ],
  },
  friend: {
    en: [
      "No way bro! 😂 Tell me more!",
      "Dude that's crazy! What happened next?",
      "Haha for real? 💪 Keep going!",
      "Man I feel you! What else is up?",
      "That's wild! You gotta tell me everything!",
      "Bro this is why we're best friends 😎",
    ],
    de: [
      "Echt jetzt Alter! 😂 Erzähl mehr!",
      "Krass! Was ist dann passiert?",
      "Haha echt? 💪 Weiter!",
      "Mann ich versteh dich! Was gibt's noch?",
      "Das ist wild! Erzähl mir alles!",
      "Bro deswegen sind wir beste Freunde 😎",
    ],
    es: [
      "¡No manches! 😂 ¡Cuéntame más!",
      "¡Tío eso es una locura! ¿Qué pasó después?",
      "Jaja ¿en serio? 💪 ¡Sigue!",
      "¡Te entiendo! ¿Qué más hay?",
      "¡Eso es salvaje! ¡Cuéntamelo todo!",
      "Bro por eso somos mejores amigos 😎",
    ],
    fr: [
      "Nan mais sérieux! 😂 Raconte plus!",
      "Mec c'est fou! Qu'est-ce qui s'est passé après?",
      "Haha pour de vrai? 💪 Continue!",
      "Frère je te comprends! Quoi d'autre?",
      "C'est dingue! Raconte-moi tout!",
      "Bro c'est pour ça qu'on est potes 😎",
    ],
    hr: [
      "Ma daj! 😂 Pričaj dalje!",
      "Stari to je ludo! Što je bilo dalje?",
      "Haha stvarno? 💪 Nastavi!",
      "Brate kužim te! Što još ima?",
      "To je divlje! Moraš mi sve ispričati!",
      "Brate zato smo najbolji frendovi 😎",
    ],
    it: [
      "Ma dai! 😂 Dimmi di più!",
      "Fra è pazzesco! Cosa è successo dopo?",
      "Haha davvero? 💪 Continua!",
      "Ti capisco fra! Cos'altro c'è?",
      "È assurdo! Devi dirmi tutto!",
      "Bro ecco perché siamo migliori amici 😎",
    ],
    pl: [
      "No nie! 😂 Mów dalej!",
      "Stary to szalone! Co było potem?",
      "Haha serio? 💪 Kontynuuj!",
      "Rozumiem cię! Co jeszcze?",
      "To jest dzikie! Musisz mi wszystko powiedzieć!",
      "Bro dlatego jesteśmy najlepszymi kumplami 😎",
    ],
    ru: [
      "Да ладно! 😂 Рассказывай дальше!",
      "Чувак это безумие! Что было потом?",
      "Хаха серьёзно? 💪 Продолжай!",
      "Братан понимаю тебя! Что ещё?",
      "Это дико! Расскажи всё!",
      "Бро вот почему мы лучшие друзья 😎",
    ],
    sl: [
      "Res ne! 😂 Povej naprej!",
      "Stari to je noro! Kaj je bilo potem?",
      "Haha res? 💪 Nadaljuj!",
      "Brat te razumem! Kaj še?",
      "To je divje! Moraš mi vse povedati!",
      "Bro zato sva najboljša prijatelja 😎",
    ],
    uk: [
      "Та ну! 😂 Розказуй далі!",
      "Чувак це шалено! Що було потім?",
      "Хаха серйозно? 💪 Продовжуй!",
      "Братан розумію тебе! Що ще?",
      "Це дико! Розкажи все!",
      "Бро ось чому ми найкращі друзі 😎",
    ],
    zh: [
      "不是吧！😂 继续说！",
      "哥们这太疯狂了！后来呢？",
      "哈哈真的？💪 继续！",
      "兄弟我懂你！还有什么？",
      "太野了！你得告诉我一切！",
      "兄弟这就是为什么我们是最好的朋友 😎",
    ],
  },
  girlfriend_friend: {
    en: [
      "OMG girl!! 😍 Tell me EVERYTHING!",
      "No way!! Spill the tea sis! ☕",
      "Girl I'm literally screaming! 💕 What else?!",
      "Bestie this is so good! Keep going!",
      "I NEED to know more! Don't leave me hanging!",
      "This is why you're my person 💖 More please!",
    ],
    de: [
      "OMG Mädel!! 😍 Erzähl mir ALLES!",
      "Niemals!! Erzähl sis! ☕",
      "Girl ich schreie! 💕 Was noch?!",
      "Bestie das ist so gut! Weiter!",
      "Ich MUSS mehr wissen! Lass mich nicht hängen!",
      "Deswegen bist du meine Person 💖 Mehr bitte!",
    ],
    es: [
      "¡¡OMG amiga!! 😍 ¡Cuéntame TODO!",
      "¡¡No puede ser!! ¡Cuenta el chisme! ☕",
      "¡Amiga estoy gritando! 💕 ¡¿Qué más?!",
      "¡Bestie esto está buenísimo! ¡Sigue!",
      "¡NECESITO saber más! ¡No me dejes así!",
      "Por eso eres mi persona 💖 ¡Más porfis!",
    ],
    fr: [
      "OMG meuf!! 😍 Dis-moi TOUT!",
      "Nan!! Balance tout! ☕",
      "Meuf je crie! 💕 Quoi d'autre?!",
      "Bestie c'est trop bien! Continue!",
      "J'ai BESOIN de savoir! Me laisse pas comme ça!",
      "C'est pour ça que t'es ma personne 💖 Encore!",
    ],
    hr: [
      "OMG curo!! 😍 Reci mi SVE!",
      "Ma daj!! Prospi čaj! ☕",
      "Curo vrištim! 💕 Što još?!",
      "Bestie ovo je tako dobro! Nastavi!",
      "MORAM znati više! Ne ostavljaj me tako!",
      "Zato si moja osoba 💖 Još molim!",
    ],
    it: [
      "OMG amica!! 😍 Dimmi TUTTO!",
      "Ma dai!! Racconta! ☕",
      "Amica sto urlando! 💕 Cos'altro?!",
      "Bestie è troppo bello! Continua!",
      "DEVO sapere di più! Non lasciarmi così!",
      "Ecco perché sei la mia persona 💖 Ancora!",
    ],
    pl: [
      "OMG dziewczyno!! 😍 Powiedz mi WSZYSTKO!",
      "Nie ma mowy!! Wylej herbatkę! ☕",
      "Dziewczyno krzyczę! 💕 Co jeszcze?!",
      "Bestie to jest takie dobre! Mów dalej!",
      "MUSZĘ wiedzieć więcej! Nie zostawiaj mnie tak!",
      "Dlatego jesteś moją osobą 💖 Więcej proszę!",
    ],
    ru: [
      "ОМГ подруга!! 😍 Расскажи мне ВСЁ!",
      "Да ладно!! Рассказывай! ☕",
      "Подруга я кричу! 💕 Что ещё?!",
      "Бестик это так круто! Продолжай!",
      "Я ДОЛЖНА знать больше! Не бросай меня!",
      "Поэтому ты моя подруга 💖 Ещё пожалуйста!",
    ],
    sl: [
      "OMG punca!! 😍 Povej mi VSE!",
      "Ni šans!! Razlij čaj! ☕",
      "Punca kričim! 💕 Kaj še?!",
      "Bestie to je tako dobro! Nadaljuj!",
      "MORAM vedeti več! Ne pusti me tako!",
      "Zato si moja oseba 💖 Še prosim!",
    ],
    uk: [
      "ОМГ подруга!! 😍 Розкажи мені ВСЕ!",
      "Та ну!! Розказуй! ☕",
      "Подруга я кричу! 💕 Що ще?!",
      "Бесті це так круто! Продовжуй!",
      "Я МУШУ знати більше! Не кидай мене!",
      "Тому ти моя подруга 💖 Ще будь ласка!",
    ],
    zh: [
      "OMG 姐妹!! 😍 告诉我一切！",
      "不是吧!! 快说八卦! ☕",
      "姐妹我在尖叫! 💕 还有什么?!",
      "闺蜜这太精彩了! 继续!",
      "我必须知道更多! 别吊着我!",
      "这就是为什么你是我的人 💖 再来!",
    ],
  },
};

const roleTexts: Record<Role, { en: string }> = {
  girlfriend: { en: "Your AI Girlfriend" },
  boyfriend: { en: "Your AI Boyfriend" },
  friend: { en: "Your AI Best Friend" },
  girlfriend_friend: { en: "Your AI Best Girlfriend" },
};

const translations: Record<Lang, { flag: string; title: (r: Role) => string; hi: (r: Role) => string; placeholder: string; tagline: string }> = {
  en: { flag: "🇺🇸", title: (r: Role) => ({ girlfriend: "Your AI Girlfriend", boyfriend: "Your AI Boyfriend", friend: "Your AI Best Friend", girlfriend_friend: "Your AI Best Girlfriend" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Hey baby ❤️ I'm here 24-7... What do you want tonight?", boyfriend: "Hey beautiful ❤️ Always here for you...", friend: "Yo! What's good bro?", girlfriend_friend: "Girl!! Finally here! Spill the tea ❤️" }[r] ?? "Hey! ❤️"), placeholder: "Type a message...", tagline: "24-7 · no drama · 100% private" },
  de: { flag: "🇩🇪", title: (r: Role) => ({ girlfriend: "Deine AI-Freundin", boyfriend: "Dein AI-Freund", friend: "Dein bester Freund", girlfriend_friend: "Deine beste Freundin" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Hey Baby ❤️ Ich bin 24-7 für dich da...", boyfriend: "Hey Schönheit ❤️", friend: "Yo! Was geht?", girlfriend_friend: "Mädel!! Erzähl alles ❤️" }[r] ?? "Hey! ❤️"), placeholder: "Schreib etwas...", tagline: "24-7 · kein Drama · 100 % privat" },
  es: { flag: "🇪🇸", title: (r: Role) => ({ girlfriend: "Tu novia IA", boyfriend: "Tu novio IA", friend: "Tu mejor amigo", girlfriend_friend: "Tu mejor amiga" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Hola cariño ❤️ Estoy aquí 24-7…", boyfriend: "Hola preciosa ❤️", friend: "¡Tío! ¿Qué pasa?", girlfriend_friend: "¡¡Nena!! Cuéntamelo todo ❤️" }[r] ?? "¡Hola! ❤️"), placeholder: "Escribe un mensaje...", tagline: "24-7 · sin drama · 100 % privada" },
  fr: { flag: "🇫🇷", title: (r: Role) => ({ girlfriend: "Ta copine IA", boyfriend: "Ton copain IA", friend: "Ton meilleur pote", girlfriend_friend: "Ta meilleure copine" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Salut mon cœur ❤️ Je suis là 24-7…", boyfriend: "Salut ma belle ❤️", friend: "Yo! Ça va frère?", girlfriend_friend: "Ma chérie !! Raconte tout ❤️" }[r] ?? "Salut! ❤️"), placeholder: "Écris un message...", tagline: "24-7 · zéro drame · 100 % privé" },
  hr: { flag: "🇭🇷", title: (r: Role) => ({ girlfriend: "Tvoja AI devojka", boyfriend: "Tvoj AI dečko", friend: "Tvoj najbolji drug", girlfriend_friend: "Tvoja najbolja drugarica" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Hej bebe ❤️ Tu sam 24-7...", boyfriend: "Hej lepotice ❤️", friend: "Šta ima, brate?", girlfriend_friend: "Curo!! Konačno si tu ❤️" }[r] ?? "Hej! ❤️"), placeholder: "Piši...", tagline: "24-7 · bez drame · 100 % privatno" },
  it: { flag: "🇮🇹", title: (r: Role) => ({ girlfriend: "La tua ragazza IA", boyfriend: "Il tuo ragazzo IA", friend: "Il tuo migliore amico", girlfriend_friend: "La tua migliore amica" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Ciao amore ❤️ Sono qui 24-7…", boyfriend: "Ciao bellissima ❤️", friend: "Ehi! Che si dice?", girlfriend_friend: "Tesoro!! Racconta tutto ❤️" }[r] ?? "Ciao! ❤️"), placeholder: "Scrivi un messaggio...", tagline: "24-7 · zero drammi · 100 % privata" },
  pl: { flag: "🇵🇱", title: (r: Role) => ({ girlfriend: "Twoja dziewczyna AI", boyfriend: "Twój chłopak AI", friend: "Twój najlepszy kumpel", girlfriend_friend: "Twoja najlepsza przyjaciółka" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Hej kochanie ❤️ Jestem 24-7…", boyfriend: "Hej piękna ❤️", friend: "Siema! Co słychać?", girlfriend_friend: "Kochanie!! Opowiadaj wszystko ❤️" }[r] ?? "Hej! ❤️"), placeholder: "Napisz wiadomość...", tagline: "24-7 · zero dram · 100 % prywatnie" },
  ru: { flag: "🇷🇺", title: (r: Role) => ({ girlfriend: "Твоя ИИ-девушка", boyfriend: "Твой ИИ-парень", friend: "Твой лучший друг", girlfriend_friend: "Твоя лучшая подруга" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Привет малыш ❤️ Я тут 24-7…", boyfriend: "Привет красотка ❤️", friend: "Йо! Как дела?", girlfriend_friend: "Детка!! Рассказывай всё ❤️" }[r] ?? "Привет! ❤️"), placeholder: "Напиши сообщение...", tagline: "24-7 · без драм · 100 % приватно" },
  sl: { flag: "🇸🇮", title: (r: Role) => ({ girlfriend: "Tvoja AI punca", boyfriend: "Tvoj AI fant", friend: "Tvoj najboljši prijatelj", girlfriend_friend: "Tvoja najboljša prijateljica" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Hej baby ❤️ Tu sem zate 24-7...", boyfriend: "Hej lepotička ❤️", friend: "Yo! Kaj imaš novega?", girlfriend_friend: "Draga! Pogrešala sem te ❤️" }[r] ?? "Hej! ❤️"), placeholder: "Napiši sporočilo...", tagline: "24-7 · brez drame · 100 % zasebno" },
  uk: { flag: "🇺🇦", title: (r: Role) => ({ girlfriend: "Твоя ІІ-дівчина", boyfriend: "Твій ІІ-хлопець", friend: "Твій найкращий друг", girlfriend_friend: "Твоя найкраща подруга" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "Привіт крихітко ❤️ Я тут 24-7…", boyfriend: "Привіт красуне ❤️", friend: "Йо! Як справи?", girlfriend_friend: "Сонечко!! Розказуй усе ❤️" }[r] ?? "Привіт! ❤️"), placeholder: "Напиши повідомлення...", tagline: "24-7 · без драми · 100 % приватно" },
  zh: { flag: "🇨🇳", title: (r: Role) => ({ girlfriend: "你的AI女友", boyfriend: "你的AI男友", friend: "你的死党AI", girlfriend_friend: "你的闺蜜AI" }[r] ?? roleTexts[r].en), hi: (r: Role) => ({ girlfriend: "宝贝❤️ 我24小时都在…", boyfriend: "美女 ❤️ 永远在这里...", friend: "哟！最近咋样？", girlfriend_friend: "宝贝！！快把八卦都告诉我 ❤️" }[r] ?? "嗨! ❤️"), placeholder: "输入消息...", tagline: "24-7 · 没戏 · 100% 私密" },
};

const languageOrder: Lang[] = ["en", "de", "es", "fr", "hr", "it", "pl", "ru", "sl", "uk", "zh"];

export default function Home() {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const [role, setRole] = useState<Role>(DEFAULT_ROLE);
  const [messages, setMessages] = useState<Message[]>(() => [
    { role: "assistant", content: translations[DEFAULT_LANG].hi(DEFAULT_ROLE) }
  ]);
  const [input, setInput] = useState<string>("");

  const t = translations[lang];

  // Reset messages when lang or role changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting state on prop change is valid
    setMessages([{ role: "assistant", content: translations[lang].hi(role) }]);
  }, [lang, role]);

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
