# Phase 8: Wealth Growth & Analytics

This document records the implemented wealth analytics module.

## Backend APIs

All routes require `Authorization: Bearer <token>`.

### `GET /api/analytics/wealth`

Returns a combined wealth analytics view using transactions, assets, savings goals, habits, and habit logs.

Response includes:

- `summary.totalSavings`
- `summary.totalSavingsAssets`
- `summary.investmentValue`
- `summary.otherAssetValue`
- `summary.totalAssetValue`
- `summary.netWorth`
- `summary.savingsRate`
- `summary.totalIncome`
- `summary.totalExpenses`
- `summary.activeHabits`
- `summary.habitCompletionRate`
- `summary.averageGoalProgress`
- `charts.netWorthTrend`
- `charts.monthlyActivity`
- `charts.savingsRateTrend`
- `charts.goalProgress`
- `charts.habitCompletion`
- `assets`
- `insights`

### `GET /api/assets`

Lists manually tracked savings, investments, and assets.

Optional query params:

- `type`: `savings | investment | asset`.

### `POST /api/assets`

Creates an asset entry.

Request body:

- `name`: required string.
- `type`: `savings | investment | asset`.
- `value`: required non-negative number.
- `date`: optional date.

### `PUT /api/assets/:id`

Updates a user-owned asset entry.

### `DELETE /api/assets/:id`

Deletes a user-owned asset entry.

## Analytics Sources

- Net worth: net savings plus latest manually tracked asset values.
- Total savings: income minus expenses from `transactions`.
- Investment/assets value: latest values from `assets`.
- Monthly financial activity: income and expense totals grouped by month.
- Savings rate over time: monthly net savings divided by monthly income.
- Savings goal progress: current amount divided by target amount from `savingsGoals`.
- Habit completion chart: completed habit logs divided by total habit logs per month.
- Insights: generated from savings rate, net worth, habit completion rate, and savings goal progress.

## Frontend Page

Route:

- `/dashboard/analytics`

Implemented UI:

- Manual asset/investment form.
- Asset edit/delete controls.
- Tracked assets table.
- Net worth line/area chart.
- Income vs expense bar chart.
- Savings rate trend chart.
- Savings goal progress chart.
- Habit completion chart.
- Summary cards.
- Simple insights panel.

## Phase Notes

- Asset and investment values are manually tracked.
- Investment trading and automatic bank sync remain out of scope.
- Build currently includes Recharts in the main bundle; code-splitting can be handled during final optimization.
