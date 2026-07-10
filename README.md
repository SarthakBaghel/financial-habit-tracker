# WealthTrack: Financial Habit Builder & Wealth Growth Tracker

WealthTrack is a full-stack personal finance app that combines manual income and expense tracking with financial habits, savings goals, wealth analytics, and a basic admin dashboard. It is designed around an INR-first experience for students and young professionals.

## Live Links

| Service | URL |
| --- | --- |
| Frontend | Add Vercel URL after deployment |
| API health | Add Render `/api/health` URL after deployment |

## Features

- Public landing page with a dashboard-first product preview.
- JWT registration, login, logout, profile setup, and protected routes.
- Income and expense CRUD, categories, filters, and monthly summaries.
- Daily, weekly, and monthly financial habits with logs, streaks, and completion metrics.
- Savings goals with progress, deadlines, and on-track/behind/completed states.
- Manual savings, investment, and asset tracking with net-worth and activity charts.
- Financial dashboard with summaries, growth trend, category spending, and recent activity.
- Admin analytics, users, and feedback/issue management.
- Responsive UI and INR currency formatting by default.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Recharts, Lucide |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB / MongoDB Atlas |
| Authentication | bcryptjs and JWT bearer tokens |
| Hosting | Vercel (frontend), Render (backend) |

## Project Structure

```text
.
├── client/                  # React application
├── server/                  # Express API and Mongoose models
├── docs/                    # Module, API, testing, deployment, and report docs
├── render.yaml              # Render Blueprint
└── vercel.json              # Vercel build and SPA routing config
```

## Run Locally

Install dependencies:

```bash
npm install
```

Create local environment files from the templates:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Update `server/.env` with a local MongoDB connection string or MongoDB Atlas URI, and use a long random `JWT_SECRET`.

Start both applications:

```bash
npm run dev
```

Default URLs:

- Landing page: `http://localhost:5173/`
- Protected app: `http://localhost:5173/dashboard`
- API health: `http://localhost:5001/api/health`

## Quality Checks

```bash
npm test
```

This runs backend API validation, frontend linting, and a production client build.

## Demo Credentials

The repository includes an idempotent demo-data seeder. After configuring a target database, run:

```bash
npm run seed:demo --workspace server
```

Default credentials:

```text
Email: demo@wealthtrack.app
Password: WealthTrackDemo123!
```

The command resets only this demo account and generates realistic INR financial data. Override the defaults with `DEMO_EMAIL` and `DEMO_PASSWORD` before running it.

## Documentation

- [Deployment guide](docs/deployment.md)
- [Phase 12 deployment and submission tracker](docs/phase-12-deployment-submission.md)
- [API overview](docs/api-overview.md)
- [Project report / PRD](docs/project-report.md)
- [Data model](docs/data-model.md)
- [Testing and validation](docs/testing-validation.md)
- [Screenshot checklist](docs/screenshots/README.md)

Module documentation is also available for authentication, dashboard, transactions, habits, savings goals, wealth analytics, admin, and UI polish in `docs/`.

## Deployment

Follow the [deployment guide](docs/deployment.md) to connect MongoDB Atlas, deploy the Express API with Render, deploy the React client with Vercel, seed the demo account, and add the final URLs above.

## Project Scope

This MVP intentionally uses manual financial tracking. Bank account sync, investment trading, automated reports, push notifications, and AI financial advice are future enhancements rather than claims of the current release.
