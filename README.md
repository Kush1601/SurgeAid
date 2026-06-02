# SurgeAid

**Real-time community emergency response platform**

SurgeAid lets coordinators report emergencies, auto-classifies severity and recommends volunteer skill sets with AI, and instantly broadcasts live alerts to all connected volunteers via WebSocket — no app install required.

---

## Features

- **AI triage** — Anthropic Claude classifies each incident (CRITICAL / HIGH / MEDIUM / LOW), surfaces a recommended first-responder action, and recommends volunteer skill sets needed
- **Incident lifecycle** — Coordinators can mark incidents RESOLVED or FALSE_ALARM; status is reflected live on the feed and map
- **Real-time alerts** — Supabase Realtime broadcasts incidents to all connected volunteer browsers in under a second
- **Live incident feed** — Postgres change listeners keep the report page updated without polling
- **Incident history & search** — Full-text search over all incidents via a PostgreSQL GIN index; paginated results with severity, status, and skills badges
- **Coordinator dashboard** — Severity distribution, status breakdown, 14-day incident and volunteer signup trends, and hour-of-day heatmap
- **Interactive map** — Leaflet renders both USGS earthquake data and community-reported incidents; resolved incidents shown in green
- **Live stats** — Homepage and map show real volunteer/incident counts from the database

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Real-time | Supabase Realtime (WebSocket broadcast + Postgres changes) |
| AI classification | Anthropic Claude (`claude-haiku-4-5`) |
| Auth | Clerk (Google + email; protects `/report` and `/dashboard`) |
| Maps | Leaflet + React-Leaflet |
| External data | USGS Earthquake GeoJSON API |
| Testing | Playwright (E2E) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) project
- [Clerk](https://clerk.com) application
- Anthropic API key

### Installation

```bash
git clone https://github.com/your-username/surgeaid.git
cd surgeaid
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

```env
# Supabase — get these from your project's API settings at supabase.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic — server-side only
ANTHROPIC_API_KEY=

# Clerk — get these from clerk.com dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/report
```

### Database Setup

Run both migrations in your Supabase SQL editor (or via `supabase db push`):

```bash
supabase/migrations/20260602000000_initial_schema.sql
supabase/migrations/20260602000001_add_status_and_skills.sql
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
surgeaid/
├── app/
│   ├── api/
│   │   ├── classify/         # POST — AI severity + skill set classification (Anthropic)
│   │   ├── dashboard/        # GET  — Aggregated analytics data
│   │   ├── disasters/        # GET  — USGS earthquake feed proxy
│   │   ├── search/           # GET  — Full-text incident search (GIN index)
│   │   ├── stats/            # GET  — Live volunteer + incident counts
│   │   └── trigger-alert/    # POST — Broadcast incident via Supabase Realtime
│   ├── components/
│   │   ├── AlertToast.tsx    # Severity-coded real-time toast overlay
│   │   ├── MapDisasters.tsx  # Leaflet map with USGS + Supabase markers
│   │   └── NavBar.tsx        # Top navigation (Dashboard link shown when signed in)
│   ├── hooks/
│   │   └── useSupabaseAlerts.ts  # Supabase Realtime broadcast subscription
│   ├── dashboard/            # /dashboard — Coordinator analytics (auth required)
│   ├── history/              # /history   — Incident search and history
│   ├── map/                  # /map       — Live response map
│   ├── report/               # /report    — Submit emergency + live feed (auth required)
│   ├── sign-in/              # /sign-in   — Clerk sign-in page
│   ├── volunteer/            # /volunteer — Volunteer signup
│   ├── layout.tsx
│   └── page.tsx              # Homepage with live stats
├── lib/
│   ├── supabase.ts           # Supabase client init
│   └── types.ts              # Shared TypeScript interfaces
├── supabase/
│   └── migrations/           # SQL migration files
├── tests/
│   └── e2e/                  # Playwright E2E tests
├── middleware.ts              # Clerk auth — protects /report and /dashboard
└── .env.example
```

---

## Core Flow

```
Coordinator submits incident at /report
  → POST /api/classify        — Claude returns severity + action brief + recommended skills
  → Supabase INSERT            — Incident saved with severity, action, skills, status=ACTIVE
  → POST /api/trigger-alert   — Supabase Realtime broadcasts to "surgeaid-alerts" channel
  → AlertToast on /volunteer and /map — Volunteers see severity-coded toast in <1s

Coordinator marks incident resolved at /report
  → Supabase UPDATE status    — Feed and map reflect RESOLVED state instantly via Realtime
```

---

## Database Schema

**volunteers**
```sql
id uuid, name text, phone text, skills text, subscribed boolean, created_at timestamptz
```

**disasters**
```sql
id uuid, title text, description text, lat float8, lng float8,
severity text,           -- CRITICAL | HIGH | MEDIUM | LOW | UNKNOWN
action text,             -- AI-generated first-responder action brief
recommended_skills text, -- AI-generated comma-separated skill sets
status text,             -- ACTIVE | RESOLVED | FALSE_ALARM
created_at timestamptz
```

Full-text search: GIN index on `to_tsvector('english', title || ' ' || description)`

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/stats` | — | Live volunteer + incident counts |
| `GET` | `/api/disasters` | — | USGS earthquake GeoJSON proxy (24h) |
| `GET` | `/api/search` | — | Full-text incident search with pagination |
| `GET` | `/api/dashboard` | Service key | Aggregated analytics (severity, status, trends) |
| `POST` | `/api/classify` | — | AI severity + action + skill set classification |
| `POST` | `/api/trigger-alert` | — | Broadcast incident to Supabase Realtime channel |

---

## Testing

```bash
# Install browsers (first time only)
npx playwright install chromium

# Run all E2E tests
npm run test:e2e
```

Tests cover: volunteer signup flow, coordinator route auth protection, history page search UI, and map render.

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Primary Red | `#c1121f` | Alerts, CTAs, CRITICAL severity |
| Deep Navy | `#003049` | Volunteer actions |
| Warning Amber | `#fbbf24` | ACTIVE status, MEDIUM severity |
| Success Green | `#22c55e` | RESOLVED status, LOW severity |
| Blue | `#3b82f6` | Skill set badges, volunteer charts |
| Warm Cream | `#fefbf3` | Page background |

---

## License

MIT
