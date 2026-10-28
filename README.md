# KPESH Website

Full-stack website and admin panel for Kashmiri Power Engineering Solution Hub (KPESH).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (the only styling system; no component CSS files)
- Motion (Framer Motion) with reduced-motion support
- MongoDB (local in development, Atlas in production) + Mongoose
- ImageKit for media (planned)
- Auth.js with Admin / Editor / Author roles (planned)
- Netlify for production, localhost for development (Vercel is not used)

## Requirements

- Node.js 22 LTS (see `.nvmrc`)
- npm

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run db:seed
npm run dev
```

Open http://localhost:3000.

Local development uses MongoDB at `mongodb://127.0.0.1:27017/kpesh`.
For production, create a free MongoDB Atlas cluster and put its connection string in
`MONGODB_URI` on Netlify. Allow Netlify to connect from Atlas network access
(`0.0.0.0/0` is the simplest option for serverless).

## Scripts

```bash
npm run dev          # start development server
npm run build        # production build
npm run start        # run production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run format       # format with Prettier
npm run format:check # verify formatting
npm run db:seed      # seed MongoDB with initial content
npm run db:sync      # sync Mongoose indexes
```

## Project structure

```text
src/
  app/          Next.js routes, layouts and global styles
  components/   shared, public and admin UI
  db/           Mongoose connection, models and seed scripts
  i18n/         Bangla/English routing and messages (planned)
  lib/          helpers, auth and integrations (planned)
  types/        shared TypeScript types
legacy-demo/    original static HTML/CSS/JS demo (reference only)
plan.md         phase-by-phase project plan and progress tracking
```

## Environment

Copy `.env.example` to `.env.local` and fill in the values. Never commit `.env.local`.

The seed script creates the first admin from `SEED_ADMIN_EMAIL` and
`SEED_ADMIN_PASSWORD`. Change that password before going to production.

## Deployment

Production hosting is Netlify. Development and preview run on `localhost`.
Vercel is not used because its free Hobby plan does not permit commercial production sites.

## Plan

See `plan.md` for phases, checklists and progress.
