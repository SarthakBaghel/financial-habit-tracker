# Phase 7: Savings Goals

This document records the implemented savings goals module.

## Backend API

All routes require `Authorization: Bearer <token>`.

### `GET /api/savings-goals`

Returns user-owned savings goals and summary totals.

Optional query params:

- `status`: `active | paused | completed`.

Response includes computed fields:

- `progress`: percentage completion.
- `remainingAmount`: amount left to reach target.
- `displayStatus`: `On track | Behind | Completed | Paused`.

### `POST /api/savings-goals`

Creates a savings goal.

Request body:

- `title`: required string.
- `targetAmount`: required number greater than zero.
- `currentAmount`: optional number, default `0`.
- `deadline`: optional date.
- `category`: optional string, default `General`.
- `status`: optional `active | paused | completed`, default `active`.

### `PUT /api/savings-goals/:id`

Updates goal details.

### `PATCH /api/savings-goals/:id/progress`

Updates the saved amount for a goal.

Request body:

- `currentAmount`: non-negative number.

If the saved amount reaches or exceeds the target amount, the goal lifecycle status becomes `completed`.

### `DELETE /api/savings-goals/:id`

Deletes a user-owned savings goal.

## Status Logic

Stored lifecycle status:

- `active`
- `paused`
- `completed`

Computed display status:

- `Completed`: saved amount reached target or lifecycle status is completed.
- `Paused`: lifecycle status is paused.
- `Behind`: active goal is behind expected progress based on created date and deadline, or deadline has passed.
- `On track`: active goal is not behind expected progress.

## Frontend Page

Route:

- `/dashboard/savings-goals`

Implemented UI:

- Create savings goal.
- Edit savings goal.
- Delete savings goal.
- Update saved amount.
- Show percentage completion.
- Show remaining amount.
- Show goal status.
- Goal list with progress bars.
- Goal details/progress view.
- Summary cards for total goals, completed goals, total saved, and remaining amount.

## Dashboard Integration

The main dashboard continues to show top savings goals from the dashboard overview API. The dashboard empty state now links to `/dashboard/savings-goals`.
