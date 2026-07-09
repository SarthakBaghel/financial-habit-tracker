# Phase 9: Basic Admin Dashboard

This document records the implemented admin monitoring module.

## Backend API

All routes require:

- Valid JWT authentication.
- `role: admin`.

### `GET /api/admin/summary`

Returns platform-level monitoring metrics:

- Total users.
- Active users in the last 30 days.
- User account count.
- Admin account count.
- Transaction count.
- Asset count.
- Savings goal count.
- Savings goal completion rate.
- Active habit count.
- Habit log count.
- Completed habit log count.
- Habit completion rate.
- Open feedback count.
- In-review feedback count.
- Total feedback count.
- Basic platform usage object.

### `GET /api/admin/users`

Returns user list with:

- Name.
- Email.
- Role.
- Currency preference.
- Joined date.
- Latest activity date.
- Counts for transactions, habits, goals, assets, and feedback.

### `GET /api/admin/feedback`

Returns feedback/issues list, populated with user name and email.

Optional query params:

- `status`: `open | in_review | resolved | closed`.

### `PATCH /api/admin/feedback/:id`

Updates feedback status.

Request body:

- `status`: `open | in_review | resolved | closed`.

## Frontend Page

Route:

- `/admin`

Implemented views:

- Overview tab.
- Users tab.
- Feedback tab.

Admin UI includes:

- Summary metric cards.
- Platform usage analytics.
- Habit completion statistics.
- Savings goal completion rate.
- Users list.
- Feedback/issues list.
- Feedback status updates.
- Loading and empty states.

## Active Users Definition

Active users are users with activity in the last 30 days across:

- Transactions.
- Habits.
- Habit logs.
- Savings goals.
- Assets.
- Feedback.
