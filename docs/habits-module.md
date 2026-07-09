# Phase 6: Financial Habit Tracker

This document records the implemented financial habit tracking module.

## Backend API

All routes require `Authorization: Bearer <token>`.

### `GET /api/habits`

Returns user habits and habit summary statistics.

Optional query params:

- `status`: `active | paused | completed`.
- `frequency`: `daily | weekly | monthly`.

### `POST /api/habits`

Creates a financial habit.

Request body:

- `habitName`: required string.
- `frequency`: `daily | weekly | monthly`.
- `target`: number, minimum `1`.
- `status`: optional `active | paused | completed`.

### `PUT /api/habits/:id`

Updates a user-owned habit.

### `DELETE /api/habits/:id`

Deletes a user-owned habit and its logs.

### `POST /api/habits/:id/log`

Marks a habit period as complete or missed.

Request body:

- `date`: optional date. Defaults to today.
- `completed`: optional boolean. Defaults to `true`.

Habit log dates are normalized by frequency:

- Daily: start of day.
- Weekly: start of week.
- Monthly: start of month.

### `GET /api/habits/summary`

Returns aggregate habit statistics.

## Frontend Page

Route:

- `/habits`

Implemented UI:

- Habit creation form.
- Daily/weekly/monthly frequency selector.
- Starter habit suggestions.
- Complete and missed actions.
- Habit progress cards.
- Completion rate.
- Missed habit count.
- Streak display.
- Simple reminder panel.

## Example Habits

- Save money today.
- Log expenses.
- Review budget.
- Avoid unnecessary spending.
- Invest monthly.
- Check savings goal progress.
