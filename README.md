# Murban Engineering Client Portal

Production-ready client portal UI for Murban Engineering Limited. This repository implements a polished, brand-aligned frontend with search, client gates, and client hub embeds. Backend security (passkey hashing, sessions, rate limiting, admin CRUD) is wired to be enabled via Supabase integration in Lovable.

Note: This project uses React + Vite + Tailwind + shadcn/ui. To enable authentication, database, and APIs, connect Supabase in Lovable (recommended). Once connected, we’ll wire secure passkey auth, sessions, headers, rate limiting, and admin CRUD.

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui + lucide-react
- next-themes (light/dark)
- Zod (validation, ready for server endpoints)
- Fuse.js (client-side fuzzy search)
- Framer Motion (micro-animations)
- Supabase (recommended backend integration in Lovable)

## Quickstart
1) Node 18+ and pnpm recommended
2) Install: pnpm i
3) Start: pnpm dev

## Features
- Home with brand hero and Fuse-powered search
- Client page with passkey gate UI (backend-ready), client hub with sandboxed iframe + origin allowlist
- Admin page scaffold (to be secured with Supabase auth and env-based admin pass)
- Light/Dark theme, motion, accessible components

## Environments (.env.example)
Copy .env.example to .env and adjust:
- SESSION_SECRET=generate_32_bytes_random
- APP_ORIGIN_ALLOWLIST=https://swahili-beach.vercel.app,https://tank-volume-genesis.vercel.app
- ENABLE_CAPTCHA=false
- MURBAN_PORTAL_ADMIN_PASS=change-me
- DATABASE_URL=postgres://... (prod)
- REDIS_URL=redis://... (prod)
- VITE_SUPABASE_URL=auto (Lovable)
- VITE_SUPABASE_PUBLISHABLE_KEY=auto (Lovable)
- VITE_SUPABASE_PROJECT_ID=auto (Lovable)

## How to add/change clients & passkeys
- For now, clients are defined in src/data/clients.ts for the demo UI.
- After connecting Supabase, we will implement Admin CRUD and secure passkey hashing (argon2id) server-side. Passkeys will never be stored/plain on the client.

## Rotate SESSION_SECRET
- Update SESSION_SECRET in env and redeploy. Active sessions will be invalidated; inform users accordingly.

## Change the allowlist
- Update APP_ORIGIN_ALLOWLIST. Only these origins can load in the Client Hub iframe. This enforces a strict frame-src policy in production headers.

## Disable/enable captcha & rate limits
- Toggle ENABLE_CAPTCHA to enable Turnstile/CAPTCHA on repeated failures.
- Rate limits will run on Redis-backed sliding windows on server endpoints once Supabase edge functions are enabled.

## Move from SQLite (local) to Postgres (prod)
- Local dev can use mock data. Production should use managed Postgres (Supabase). Provide DATABASE_URL in env. Migrations will be handled once backend is connected.

## Run tests and CI locally
- Unit/Integration/E2E test scaffolds will be added alongside backend endpoints. Recommended: Vitest + Playwright.

## Deployment
- Vercel (recommended). This SPA can be deployed, but full security requires backend (Supabase in Lovable). Configure envs and headers (CSP, HSTS, etc.) once backend is active.

## License
MIT
