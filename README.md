# CardIQ — AI-Powered Credit Card Benefits Platform

## Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **File-based storage** (JSON files in `.data/` — no database needed)
- **JWT auth** via `jose` + `bcryptjs` (no external auth service)
- **Anthropic Claude API** for AI insights
- Mock Plaid data (realistic hardcoded transactions)

**No external services required** — only the Anthropic API key is needed.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Edit `.env.local` and fill in your Anthropic key:
```env
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=some-long-random-string
```

Get your Anthropic API key at [console.anthropic.com](https://console.anthropic.com/settings/keys)

No database setup needed — user data is stored automatically in `.data/` (gitignored).

### 3. Run the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

### Benefits Dashboard (`/dashboard`)
- Portfolio summary: total fees, captured value, missed value, capture rate
- Per-card benefit tracking with status (unused/partial/used/expired)
- Click any benefit → AI explanation powered by Claude + mark as used
- Benefits sorted by expiration urgency

### Purchase Optimizer (`/optimizer`)
- 90 days of mock transactions annotated with optimal vs. actual card used
- Shows missed rewards per transaction
- Category spending breakdown
- AI chat: ask "which card should I use for X?"

### Notifications (`/notifications`)
- Expiring credit alerts (semi-annual Resy credits, monthly Uber Cash, etc.)
- Card recommendation nudges
- Weekly digest summaries
- Category activation reminders (Chase Freedom Flex quarterly categories)
- Filter by notification type, mark as read

### Portfolio Strategy (`/portfolio`)
- Per-card ROI analysis: fees paid vs. value captured
- Keep / Evaluate / Consider Downgrade recommendation
- AI portfolio analysis button: Claude reviews your full portfolio and gives personalized advice

---

## Project Structure
```
app/
├── (app)/              ← authenticated pages (sidebar layout)
│   ├── dashboard/      ← Benefits Dashboard
│   ├── optimizer/      ← Purchase Optimizer
│   ├── notifications/  ← Notification Center
│   └── portfolio/      ← Portfolio Strategy
├── login/              ← Auth pages
├── signup/
└── api/                ← Next.js API routes
    ├── cards/
    ├── benefits/
    ├── transactions/
    ├── notifications/
    └── ai/             ← Claude-powered endpoints

components/
├── dashboard/          ← Dashboard-specific components
├── layout/             ← Sidebar
└── ui/                 ← Shared UI primitives

lib/
├── supabase/           ← Browser + server clients
├── claude.ts           ← Anthropic SDK wrapper
├── mock-data/          ← Cards catalog, transactions, notifications
└── utils.ts
```
