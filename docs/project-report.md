# Project Report / PRD

## Product

**WealthTrack** is a financial habit builder and wealth growth tracker for students and young professionals. It combines manual INR-first financial tracking with habit streaks, savings goals, wealth analytics, and basic administrative monitoring.

## Problem

People often record spending inconsistently and lose sight of long-term progress. Traditional budgeting tools focus on transactions, while this project also supports disciplined behaviour through financial habits and visible goal progress.

## Objectives

- Track income and expenses accurately.
- Encourage recurring saving, budgeting, and investing habits.
- Make savings goals and wealth growth easy to understand.
- Provide secure authentication and a basic admin monitoring view.

## Scope Delivered

- JWT email/password registration, login, logout, profile setup, and role-based admin access.
- Manual income and expense CRUD with categories, filters, and monthly summaries.
- Daily, weekly, and monthly financial habit tracking with logs, streaks, and completion metrics.
- Savings goals with deadlines, completion progress, and status indicators.
- Manual savings, investment, and asset entries with wealth analytics.
- Dashboard charts for financial position, spending, goals, and recent activity.
- Admin metrics, users list, and feedback status handling.
- Responsive public landing page and authenticated dashboard experience.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Recharts, Lucide |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB / MongoDB Atlas |
| Security | bcrypt password hashing, JWT bearer authentication, Helmet, CORS |
| Hosting | Vercel frontend, Render backend |
| Validation | Automated API flow, ESLint, Vite production build |

## Non-Goals

Bank synchronisation, automatic transaction import, real investment trading, push notifications, and AI financial advice are deliberately outside this student-project release.

## Success Criteria

- A new user can register, complete onboarding, and access a protected dashboard.
- A user can add, edit, and delete financial records and see changed dashboard totals.
- Goal, habit, and analytics views provide meaningful visual feedback from database records.
- Admin users can inspect platform activity.
- The deployed application works on mobile and desktop.

## Validation Evidence

`npm test` runs the backend validation flow, frontend linting, and a production client build. See [testing-validation.md](testing-validation.md) for the complete test record.
