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

### Phase 3: Authentication & User Module

Status: Complete

Goal: Make login/register secure and functional.

Completed:

- Added registration API with bcrypt password hashing.
- Added login API with password verification.
- Added JWT generation and bearer-token authentication.
- Added protected route middleware for private backend APIs.
- Added role-based middleware for admin-only APIs.
- Added current-user API at `GET /api/auth/me`.
- Added profile setup API at `PUT /api/profile`.
- Added basic admin summary API at `GET /api/admin/summary`.
- Added frontend authentication context and token handling.
- Added protected frontend routes.
- Added `/login`, `/register`, `/profile-setup`, and `/admin` pages.
- Added logout flow in the app layout.
- Documented the auth module in `docs/auth-module.md`.

Verification:

- Confirmed frontend lint succeeds with `npm run lint --workspace client`.
- Confirmed frontend production build succeeds with `npm run build --workspace client`.
- Confirmed server modules import successfully with a Node ESM import check.
- Confirmed `POST /api/auth/register` returns `201` and creates a JWT session.
- Confirmed `POST /api/auth/login` returns `200` and creates a JWT session.
- Confirmed `GET /api/auth/me` returns `200` with a bearer token.
- Confirmed `PUT /api/profile` returns `200` with a bearer token.
- Confirmed `GET /api/admin/summary` returns `403` for a non-admin user.
- Confirmed frontend `/login` route returns `200 OK` in the Vite dev server.

### Phase 4: Main User Dashboard

Status: Complete

Goal: Build the Mint-style overview dashboard using actual database data.

Completed:

- Added protected dashboard API at `GET /api/dashboard/overview`.
- Aggregated total income, total expenses, net savings, and savings rate from `transactions`.
- Aggregated active habit count from `habits`.
- Aggregated savings goal progress from `savingsGoals`.
- Aggregated current asset value and wealth growth trend from `assets` and net savings.
- Added recent transaction feed from latest transaction records.
- Added monthly expense data for a bar chart.
- Added category-wise expense data for a pie chart.
- Replaced sample dashboard values with live API data.
- Added summary cards, wealth trend chart, monthly expense chart, category spending chart, goal progress list, recent transactions table, and quick action buttons.
- Added dashboard empty states for users with no financial records yet.
- Documented the dashboard module in `docs/dashboard-module.md`.

Verification:

- Confirmed frontend lint succeeds with `npm run lint --workspace client`.
- Confirmed frontend production build succeeds with `npm run build --workspace client`.
- Confirmed dashboard server modules import successfully with a Node ESM import check.
- Confirmed `GET /api/dashboard/overview` returns `200` for an authenticated user.
- Smoke-tested dashboard aggregation with realistic MongoDB records:
  - Total income: `98000`
  - Total expenses: `37700`
  - Net savings: `60300`
  - Savings rate: `62`
  - Active habits: `2`
  - Average goal progress: `40`
  - Current asset value: `110000`
- Confirmed recent transactions and category spending are returned from database records.
- Confirmed frontend root route returns `200 OK` in the Vite dev server.

Notes:

- Production build currently warns that the chart bundle is larger than 500 kB after adding Recharts. This does not block functionality; code-splitting can be added during final optimization.

### Phase 5: Income & Expense Tracking

Status: Complete

Goal: Allow users to manually track income and expenses with summaries.

Completed:

- Added protected transaction API routes under `GET/POST/PUT/DELETE /api/transactions`.
- Added transaction filtering by month, category, and type.
- Added supported expense categories: Food, Rent, Transport, Shopping, Bills, Health, Education, Entertainment, Other.
- Added monthly summary calculations for total income, total expenses, net savings, savings rate, transaction count, and category totals.
- Added `/transactions` frontend page.
- Added income/expense form.
- Added transaction edit/delete controls.
- Added transaction history table.
- Added transaction summary cards.
- Wired dashboard quick action and sidebar navigation to the transaction page.
- Documented the module in `docs/transactions-module.md`.

Verification:

- Confirmed frontend lint succeeds with `npm run lint --workspace client`.
- Confirmed frontend production build succeeds with `npm run build --workspace client`.
- Confirmed server modules import successfully with a Node ESM import check.
- Confirmed `POST /api/transactions` creates income and expense records with `201`.
- Confirmed `PUT /api/transactions/:id` updates a user-owned transaction with `200`.
- Confirmed `DELETE /api/transactions/:id` deletes a user-owned transaction with `200`.
- Confirmed `GET /api/transactions?month=YYYY-MM` returns filtered history and summary totals with `200`.
- Confirmed frontend `/transactions` route returns `200 OK` in the Vite dev server.

### Phase 6: Financial Habit Tracker

Status: Complete

Goal: Add the YNAB-style habit-building layer.

Completed:

- Added protected habit API routes under `GET/POST/PUT/DELETE /api/habits`.
- Added habit creation with daily, weekly, and monthly frequency.
- Added habit completion logging at `POST /api/habits/:id/log`.
- Added period-normalized habit logs for daily, weekly, and monthly habits.
- Added streak recalculation after each habit log.
- Added completion rate, completed count, expected count, and missed count.
- Added aggregate habit summary API.
- Added `/habits` frontend page.
- Added habit creation form, starter suggestions, complete/missed actions, progress bars, streak display, and simple reminders UI.
- Wired sidebar navigation to the habit tracker page.
- Documented the module in `docs/habits-module.md`.

Verification:

- Confirmed frontend lint succeeds with `npm run lint --workspace client`.
- Confirmed frontend production build succeeds with `npm run build --workspace client`.
- Confirmed server modules import successfully with a Node ESM import check.
- Confirmed `POST /api/habits` creates a financial habit with `201`.
- Confirmed `POST /api/habits/:id/log` marks habit completion/missed periods with `200`.
- Confirmed `GET /api/habits` returns habit summary with `200`.
- Confirmed frontend `/habits` route returns `200 OK` in the Vite dev server.

Notes:

- Phase 5/6 smoke tests created one temporary test user with sample transactions and habits in local MongoDB.

## Environment Variables

Frontend variables live in `client/.env`.

Backend variables live in `server/.env`.

For deployment, create matching variables in Vercel, Render, and MongoDB Atlas as needed.
