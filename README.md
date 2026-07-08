# Financial Habit Builder & Wealth Growth Tracker

Full-stack personal finance application inspired by Mint-style dashboards and YNAB-style habit building.

## Confirmed Project Direction

- Reference style: Balanced Mint + YNAB experience
- Project type: Full-stack app with real database
- Frontend: React + Vite
- Styling: Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT email/password, planned for Phase 3
- Charts: Recharts, planned for dashboard and analytics phases
- Admin: Basic admin dashboard
- Deployment target: Vercel frontend, Render backend, MongoDB Atlas database

## Project Structure

```text
.
├── client/   # React + Vite + Tailwind frontend
└── server/   # Express + MongoDB backend API
```

## Local Development

Install dependencies:

```bash
npm install
```

Run both apps:

```bash
npm run dev
```

Run only the frontend:

```bash
npm run dev:client
```

Run only the backend:

```bash
npm run dev:server
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend health API: `http://localhost:5001/api/health`

## Phase Progress

### Phase 1: Project Setup & Architecture

Status: Complete

Goal: Create the foundation cleanly.

Completed:

- Created monorepo-style workspace with `client/` and `server/`.
- Added root npm workspaces and shared scripts.
- Prepared React + Vite frontend configuration.
- Prepared Tailwind CSS configuration.
- Prepared Express backend server.
- Added MongoDB connection setup.
- Added environment files for frontend and backend.
- Prepared backend folders for routes, controllers, models, middleware, config, and utilities.
- Prepared frontend folders for pages, components, layouts, services, hooks, utilities, styles, and assets.
- Installed dependencies with `npm install`.
- Confirmed frontend production build succeeds with `npm run build --workspace client`.
- Confirmed frontend lint succeeds with `npm run lint --workspace client`.
- Confirmed backend starts successfully with `npm run start --workspace server`.
- Confirmed frontend dev server starts successfully with `npm run dev --workspace client`.
- Confirmed health check API returns `200 OK` at `http://localhost:5001/api/health`.
- Confirmed frontend returns `200 OK` at `http://localhost:5173/`.

Notes:

- Local server verification required elevated localhost permissions in the Codex sandbox.
- MongoDB connected successfully during backend verification.
- Recharts v2 installed with a deprecation warning; chart implementation is planned for later phases, where we can upgrade to Recharts v3 before building analytics.

### Phase 2: Requirement Breakdown & Data Modeling

Status: Complete

Goal: Convert the project statement into database models and app modules.

Completed:

- Added Mongoose models for `users`, `profiles`, `transactions`, `habits`, `habitLogs`, `savingsGoals`, `assets`, and `feedback`.
- Added validation rules for required fields, enum values, positive financial amounts, and basic text limits.
- Added user-scoped indexes for dashboard, history, analytics, and admin queries.
- Added relationship references between user-owned records and their parent user.
- Added a model export file at `server/src/models/index.js`.
- Documented application modules, collection fields, relationships, indexes, and page-to-collection mapping in `docs/data-model.md`.

Verification:

- Confirmed all models import successfully with a Node ESM import check.
- Confirmed frontend production build still succeeds with `npm run build --workspace client`.

## Environment Variables

Frontend variables live in `client/.env`.

Backend variables live in `server/.env`.

For deployment, create matching variables in Vercel, Render, and MongoDB Atlas as needed.
