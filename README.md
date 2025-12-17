# AI Companion Platform

A Next.js-based AI companion platform with multi-language support, payment integration, and live video features.

## Features

- 🌍 **Multi-language Support**: English, German, Spanish, French, Croatian, Serbian, Macedonian, Albanian, Romanian, Bulgarian, Italian, Polish, Russian, Slovenian, Ukrainian, Chinese
- 👥 **20+ Companions**: Choose from a diverse grid of AI companions with unique personalities
- 💳 **Payment Integration**: Stripe and PayPal support with flexible pricing (€5/week or €12/month)
- 🎥 **Live Video Calls**: Video chat with your AI companion (D-ID integration ready)
- 🔗 **Payment Links**: Generate shareable payment links
- 🎨 **Avatar Generation**: Create custom companion avatars using FAL AI
- 🔒 **Privacy Focused**: 100% private conversations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API Keys:
  - FAL AI API key for avatar generation
  - Stripe API keys for payments
  - PayPal Client ID for PayPal payments
  - (Optional) D-ID API key for video generation

### Installation

1. Clone the repository:
```bash
git clone https://github.com/navorjerdna-stack/testmaxxes.git
cd testmaxxes
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
# FAL API Key for image generation
FAL_KEY=032977a9-fc5a-49a3-9d98-3419d8fd28d8:966be010c3942abecd4f4f5f7223438b

# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
STRIPE_SECRET_KEY=sk_live_your_key_here

# PayPal Keys
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# D-ID API Key (Optional - for video generation)
DID_API_KEY=your_did_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### Step 1: Prepare Your Domain

1. Register domain (e.g., aipunca.si) - use anonymous registration if needed
2. Configure Cloudflare for DNS and protection:
   - Add your domain to Cloudflare
   - Update nameservers at your registrar
   - Enable Cloudflare proxy (orange cloud)
   - Enable SSL/TLS encryption (Full or Full Strict)
   - Enable DDoS protection

### Step 2: Deploy to Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and import your repository

3. Configure environment variables in Vercel dashboard:
   - `FAL_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `DID_API_KEY` (optional)

4. Deploy the project

### Step 3: Connect Custom Domain

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain (e.g., aipunca.si)
3. Add the DNS records provided by Vercel to Cloudflare:
   - Type: `CNAME`
   - Name: `@` (or `www`)
   - Value: `cname.vercel-dns.com`
   - Proxy status: Proxied (orange cloud)

4. Wait for DNS propagation (usually a few minutes with Cloudflare)

### Step 4: Configure Cloudflare Protection

In Cloudflare dashboard:

1. **SSL/TLS**: Set to "Full" or "Full (strict)"
2. **Firewall**: 
   - Enable Bot Fight Mode
   - Add rate limiting rules
3. **Security**:
   - Enable "I'm Under Attack Mode" if needed
   - Configure Security Level (Medium or High)
4. **Page Rules**: 
   - Cache Everything for static assets
   - Browser Cache TTL optimization

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── create-checkout-session/   # Stripe checkout
│   │   ├── generate-avatar/           # FAL AI avatar generation
│   │   └── generate-video/            # D-ID video generation
│   ├── chat/                          # Chat interface
│   ├── payment/                       # Payment page
│   ├── select/                        # Companion selection grid
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Home page with demo
```

## Payment Configuration

### Stripe

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Dashboard
3. Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Configure products for €5/week and €12/month subscriptions

### PayPal

1. Create a PayPal Business account
2. Go to https://developer.paypal.com
3. Create an app and get your Client ID
4. Configure sandbox for testing, then switch to live mode

## Languages Supported

- 🇺🇸 English (en)
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇭🇷 Croatian (hr)
- 🇷🇸 Serbian (sr)
- 🇲🇰 Macedonian (mk)
- 🇦🇱 Albanian (sq)
- 🇷🇴 Romanian (ro)
- 🇧🇬 Bulgarian (bg)
- 🇮🇹 Italian (it)
- 🇵🇱 Polish (pl)
- 🇷🇺 Russian (ru)
- 🇸🇮 Slovenian (sl)
- 🇺🇦 Ukrainian (uk)
- 🇨🇳 Chinese (zh)

## API Integration

### FAL AI (Avatar Generation)

The platform uses FAL AI's Flux Pro model for generating realistic companion avatars. The API key is already configured in the `.env.local` file.

### D-ID (Video Generation)

For live talking pictures, integrate D-ID API:
1. Sign up at https://www.d-id.com
2. Get your API key
3. Add to `.env.local` as `DID_API_KEY`
4. The integration is ready in `/api/generate-video`

## Learn More

To learn more about Next.js and the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Developer](https://developer.paypal.com)
- [FAL AI Documentation](https://fal.ai/docs)
- [D-ID Documentation](https://docs.d-id.com)

## License

Private - All rights reserved
