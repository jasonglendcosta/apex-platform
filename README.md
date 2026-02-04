# APEX Platform

**Property Sales Intelligence Platform** for modern property developers.

Built with Next.js 14, Supabase, and Tailwind CSS.

![APEX Platform](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-green)

## Features

- 🏢 **Real-Time Inventory** — Live unit availability with instant sync
- 🔒 **Smart Reservations** — One-click unit locking with automatic expiry
- 📝 **Offer Generation** — Branded PDF offers with AI-enhanced cover letters
- 👥 **Customer Management** — Lead tracking with AI-powered scoring
- 📊 **Sales Analytics** — Live dashboards, forecasting, and performance tracking
- 🎨 **Strategy Theme** — Dark mode with pink accent (#D86DCB)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| State | Zustand |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth (Magic Link) |
| Real-time | Supabase Realtime |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/apex-platform.git
cd apex-platform
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/schema.sql`
3. Run `supabase/seed.sql` for sample data
4. Copy your project URL and anon key

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
apex-platform/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                   # Utilities & clients
│   └── supabase/         # Supabase clients
├── types/                 # TypeScript types
├── hooks/                 # Custom React hooks
└── supabase/             # Database files
    ├── schema.sql        # Full schema
    ├── seed.sql          # Seed data
    └── seed-data.json    # Seed data (JSON)
```

## Database Schema

Key tables:
- `organizations` — Property developers
- `projects` — Buildings/developments
- `units` — Individual properties
- `customers` — Leads and buyers
- `reservations` — Deal tracking
- `offers` — Generated offer documents
- `payments` — Payment milestones

See `supabase/schema.sql` for full schema.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

```bash
npm run build
```

## Roadmap

- [x] Phase 1: Database & Auth
- [ ] Phase 2: Inventory Management
- [ ] Phase 3: Offer Generation
- [ ] Phase 4: Real-time Reservations
- [ ] Phase 5: Analytics Dashboard
- [ ] Phase 6: Customer Portal

## Contributing

This is a private project for One Development.

## License

Proprietary - All rights reserved.

---

Built with 💜 for One Development
