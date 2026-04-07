# Kova

Kova is a routed React/Vite app with a Node API, Supabase-backed persistence, agreement previews, audit logs, and a Gemini-powered assistant.

## What’s included

- Marketing pages for the product, pricing, mobile, and system views
- Auth flows backed by local storage or Supabase tables
- Legal consent gating with scroll-to-accept and audit logging
- In-app agreement viewer and review tools
- Live integration status page for Gemini and Supabase
- Supabase migrations for auth, audit events, and seeded product data

## Tech Stack

- React 19
- Vite
- Express
- Supabase
- Gemini API

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy your environment values into `.env.local`.

3. Run the app:

```bash
npm run dev
```

## Useful Scripts

- `npm run dev` starts the full local app
- `npm run dev:ui` starts the Vite frontend only
- `npm run dev:api` starts the API only
- `npm run build` creates a production build
- `npm run server` runs the API server
- `npm run supabase:link` links the local repo to your Supabase project
- `npm run supabase:push` pushes migrations to Supabase
- `npm run supabase:reset` resets the local Supabase database

## Environment Variables

Keep secrets in `.env.local`, not in source control.

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_SCHEMA`

## Supabase

The `supabase/` folder contains the schema, seed data, and migration files for:

- `kova_users`
- `kova_sessions`
- `kova_legal_events`
- `kova_ai_events`
- `kova_flow_events`
- the seeded Kova products, pricing, agreements, and app settings

Run the migrations with:

```bash
supabase login
npm run supabase:link
npm run supabase:push
```

## Notes

- Rotate any exposed API keys and service-role keys.
- The backend is wired for local development and Supabase-backed persistence, but production deployment still depends on the hosting target you choose.
