# SurgeAid

**Real-time emergency response platform — coordinators report incidents, volunteers get push-notified on their phones in under 5 seconds.**

[![CI](https://github.com/Kush1601/SurgeAid/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Kush1601/SurgeAid/actions/workflows/ci.yml)
&nbsp;**Live:** [surge-aid.vercel.app](https://surge-aid.vercel.app)

---

## What it does

1. A coordinator submits an emergency at `/report`
2. Claude AI (Haiku) classifies severity (CRITICAL / HIGH / MEDIUM / LOW) and recommends volunteer skill sets — P50 latency ~420ms
3. All volunteers receive a **push notification on their phone within seconds** — even with the browser closed — via Web Push + Service Worker
4. Open-browser volunteers also get a live toast alert via Supabase Realtime WebSocket
5. The coordinator dashboard tracks incident trends, resolution rates, and AI latency metrics

---

## Features

| Feature | Detail |
|---|---|
| **AI triage** | Claude Haiku classifies severity + recommends volunteer skills; classify latency tracked (P50/P95) on dashboard |
| **Web Push** | VAPID-signed push notifications delivered to phones even when browser is closed; expired subscriptions auto-pruned |
| **Realtime WebSocket** | Supabase broadcast sends toasts to open browser tabs in <1s |
| **Incident lifecycle** | ACTIVE → RESOLVED / FALSE_ALARM; live status on feed and map |
| **Full-text search** | GIN index on PostgreSQL; paginated history at `/history` |
| **Coordinator dashboard** | Severity distribution, status breakdown, 14-day trends, hour-of-day heatmap, AI latency KPI |
| **Interactive map** | Leaflet with USGS earthquake overlay + community incidents |
| **Auth** | Clerk protects the coordinator write path; volunteer alert-receive path is auth-free |
| **CI** | GitHub Actions runs `npm run build` + 3 Playwright E2E specs on every push |

---

## Tech Stack

| Layer | Technology | Signal |
|---|---|---|
| Framework | Next.js 16 (App Router), TypeScript | Current meta-framework conventions |
| Styling | Tailwind CSS v4 | — |
| Database | Supabase (PostgreSQL + RLS + GIN index) | Schema design, indexing, row-level security |
| Real-time | Supabase Realtime WebSocket broadcast | Pub/sub beyond polling |
| Push notifications | Web Push API + Service Worker + VAPID | Background delivery to phones |
| AI classification | Anthropic Claude Haiku (structured JSON output + fallback) | LLM integration with validation |
| Auth | Clerk (Google + email) | Production-grade identity, not DIY |
| Maps | Leaflet + React-Leaflet | — |
| External data | USGS Earthquake GeoJSON API | — |
| Testing | Playwright E2E | Right abstraction level for a frontend-heavy app |
| CI/CD | GitHub Actions → Vercel | End-to-end ownership |

---

## Alert delivery architecture

```
Coordinator submits incident at /report
  → POST /api/classify          Claude: severity + action + recommended skills (~420ms P50)
  → Supabase INSERT             disasters table, status = ACTIVE
  → POST /api/trigger-alert
      ├── Supabase Realtime broadcast  → AlertToast on open browser tabs  (<1s)
      └── Web Push (VAPID)             → Phone notification, browser closed OK (<5s)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Supabase](https://supabase.com) project
- [Clerk](https://clerk.com) application
- Anthropic API key
- VAPID key pair (generate below)

### Install

```bash
git clone https://github.com/Kush1601/SurgeAid.git
cd SurgeAid
npm install
cp .env.example .env.local
```

### Generate VAPID keys

```bash
npx web-push generate-vapid-keys
```

Paste the output into `.env.local`.

### Environment variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/report

# Web Push (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:you@example.com
```

### Database setup

Run all migrations in the Supabase SQL Editor in order:

```
supabase/migrations/20260602000000_initial_schema.sql
supabase/migrations/20260602000001_add_status_and_skills.sql
supabase/migrations/20260602000002_usgs_unique_constraint.sql
supabase/migrations/20260603000000_dashboard_rpc_functions.sql
supabase/migrations/20260603000001_push_subscriptions.sql
supabase/migrations/20260603000002_classify_ms.sql
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
SurgeAid/
├── app/
│   ├── api/
│   │   ├── classify/         # POST — AI severity + skill classification (Anthropic)
│   │   ├── dashboard/        # GET  — Analytics: GROUP BY severity/status pushed to DB
│   │   ├── disasters/        # GET  — USGS earthquake feed proxy
│   │   ├── search/           # GET  — Full-text search (GIN index, paginated)
│   │   ├── stats/            # GET  — Live volunteer + incident counts
│   │   ├── subscribe/        # POST — Save Web Push subscription
│   │   ├── unsubscribe/      # DELETE — Remove push subscription
│   │   ├── trigger-alert/    # POST — Realtime broadcast + Web Push delivery
│   │   └── seed-usgs/        # POST — Admin: upsert 24h USGS earthquakes
│   ├── components/
│   │   ├── AlertToast.tsx    # Severity-coded realtime toast overlay
│   │   ├── MapDisasters.tsx  # Leaflet map (USGS + Supabase markers)
│   │   └── NavBar.tsx
│   ├── hooks/
│   │   └── useSupabaseAlerts.ts  # Supabase Realtime broadcast subscription
│   ├── dashboard/            # /dashboard — Coordinator analytics (auth required)
│   ├── history/              # /history   — Incident search
│   ├── map/                  # /map       — Live response map
│   ├── report/               # /report    — Submit emergency + live feed (auth required)
│   ├── sign-in/              # /sign-in   — Clerk auth
│   ├── volunteer/            # /volunteer — Signup + push subscription
│   └── page.tsx              # Homepage with live stats
├── public/
│   └── sw.js                 # Service worker — handles push events
├── lib/
│   ├── supabase.ts
│   └── types.ts
├── supabase/migrations/      # 6 SQL migration files
├── tests/e2e/                # 3 Playwright specs
├── .github/workflows/ci.yml  # GitHub Actions CI
└── Dockerfile                # Multi-stage Next.js build
```

---

## Database schema

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
classify_ms integer,     -- Claude API latency in ms (P50/P95 shown on dashboard)
status text,             -- ACTIVE | RESOLVED | FALSE_ALARM
created_at timestamptz
```

**push_subscriptions**
```sql
id uuid, endpoint text (unique), p256dh text, auth text, created_at timestamptz
```

Full-text search: GIN index on `to_tsvector('english', title || ' ' || description)`

---

## API reference

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/stats` | Live volunteer + incident counts |
| `GET` | `/api/disasters` | USGS earthquake GeoJSON proxy (24h) |
| `GET` | `/api/search?q=&page=0` | Full-text incident search, paginated |
| `GET` | `/api/dashboard` | Analytics: severity/status GROUP BY, 14-day trends, AI latency |
| `POST` | `/api/classify` | Claude severity + action + skills; stores classify_ms |
| `POST` | `/api/trigger-alert` | Realtime broadcast + Web Push to all subscriptions |
| `POST` | `/api/subscribe` | Save push subscription from browser |
| `DELETE` | `/api/unsubscribe` | Remove push subscription |

---

## Testing & CI

```bash
npx playwright install chromium   # first time only
npm run test:e2e                  # runs 3 E2E specs
```

CI runs on every push via GitHub Actions: `npm run build` → Playwright (Chromium).

---

## Design tokens

| Token | Value | Usage |
|---|---|---|
| Primary Red | `#c1121f` | CRITICAL severity, alerts, CTAs |
| Deep Navy | `#003049` | Volunteer actions |
| Warning Amber | `#fbbf24` | ACTIVE status, MEDIUM severity |
| Success Green | `#22c55e` | RESOLVED status, LOW severity |
| Blue | `#3b82f6` | Skill badges, volunteer charts |
| Warm Cream | `#fefbf3` | Page background |

---

## License

MIT
