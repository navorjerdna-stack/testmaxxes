# Contributing to TestMaxxes

This guide explains how to add more content to the TestMaxxes project - an AI companion chat application.

## Project Structure

```
testmaxxes/
├── src/app/               # Next.js App Router pages
│   ├── page.tsx           # Main homepage with chat functionality
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── chat/              # Chat route
│       └── page.tsx       # Chat page component
├── public/                # Static assets (SVGs, images)
├── package.json           # Dependencies and scripts
└── next.config.ts         # Next.js configuration
```

## How to Add More Content

### 1. Adding New Languages

To add a new language translation, edit `src/app/page.tsx`:

1. Add your language code to the `Lang` type:
   ```typescript
   type Lang = "en"|"de"|"es"|"fr"|"hr"|"it"|"pl"|"ru"|"sl"|"uk"|"zh"|"pt"; // Added Portuguese
   ```

2. Add translations to the `translations` object:
   ```typescript
   pt: { 
     flag: "🇧🇷", 
     title: (r: Role) => ({
       girlfriend: "Sua Namorada IA",
       boyfriend: "Seu Namorado IA",
       friend: "Seu Melhor Amigo",
       girlfriend_friend: "Sua Melhor Amiga"
     }[r]),
     hi: (r: Role) => ({
       girlfriend: "Oi amor ❤️ Estou aqui 24-7...",
       boyfriend: "Oi linda ❤️",
       friend: "E aí! Tudo bem?",
       girlfriend_friend: "Amiga!! Conta tudo ❤️"
     }[r]),
     placeholder: "Digite uma mensagem...",
     tagline: "24-7 · sem drama · 100% privado"
   },
   ```

3. Add the language code to `languageOrder` array:
   ```typescript
   const languageOrder: Lang[] = ["en","de","es","fr","hr","it","pl","pt","ru","sl","uk","zh"];
   ```

### 2. Adding New Companion Roles

To add a new AI companion role:

1. Update the `Role` type:
   ```typescript
   type Role = "girlfriend" | "boyfriend" | "friend" | "girlfriend_friend" | "mentor";
   ```

2. Add translations for the new role in each language's `title` and `hi` functions.

3. Add a new button in the role selection section of `page.tsx`.

### 3. Adding New Pages/Routes

Next.js App Router uses file-system routing. To create new pages:

1. **Create a new route**: Add a folder in `src/app/` with a `page.tsx`:
   ```
   src/app/about/page.tsx    → /about
   src/app/settings/page.tsx → /settings
   ```

2. **Example new page** (`src/app/about/page.tsx`):
   ```tsx
   export default function AboutPage() {
     return (
       <div style={{ minHeight: "100vh", background: "#000", color: "#ff66b3", padding: "2rem" }}>
         <h1>About TestMaxxes</h1>
         <p>Your AI companion, always here for you.</p>
       </div>
     );
   }
   ```

### 4. Adding Components

Create reusable components in a `components` folder:

```
src/
├── app/
└── components/
    ├── ChatBubble.tsx
    ├── RoleSelector.tsx
    └── LanguageSelector.tsx
```

Example component:
```tsx
// src/components/ChatBubble.tsx
interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <div style={{
      textAlign: isUser ? "right" : "left",
      margin: "1.2rem 0"
    }}>
      <div style={{
        display: "inline-block",
        background: isUser ? "#ff66b3" : "#333",
        color: isUser ? "#000" : "#fff",
        padding: "1.1rem 1.7rem",
        borderRadius: "22px",
        maxWidth: "82%"
      }}>
        {message}
      </div>
    </div>
  );
}
```

### 5. Adding Static Assets

Place images, icons, and other static files in the `public/` folder:

```
public/
├── avatar.png      → accessible at /avatar.png
├── sounds/
│   └── message.mp3 → accessible at /sounds/message.mp3
└── images/
    └── logo.svg    → accessible at /images/logo.svg
```

### 6. Adding API Routes

Create API endpoints in `src/app/api/`:

```
src/app/api/chat/route.ts → POST /api/chat
```

Example API route:
```typescript
// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message } = await request.json();
  
  // Process the message (e.g., call OpenAI API)
  const response = "AI response here";
  
  return NextResponse.json({ response });
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Start production server
npm run start
```

## Styling

The project uses Tailwind CSS. You can:

1. Use Tailwind utility classes in JSX
2. Add custom styles in `src/app/globals.css`
3. Use inline styles (as currently implemented)

## Tips

- Always run `npm run lint` before committing
- Test your changes with `npm run build` to catch TypeScript errors
- The app uses React 19 and Next.js 16
- Mobile responsiveness is important - test on various screen sizes
