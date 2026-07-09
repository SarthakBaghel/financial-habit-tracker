# Phase 4: Main User Dashboard

This document records the implemented Mint-style overview dashboard.

## Backend API

### `GET /api/dashboard/overview`

Protected route. Requires `Authorization: Bearer <token>`.

The endpoint aggregates actual database records for the authenticated user.

Response shape:

- `currency`: user currency preference.
- `summary.totalIncome`: total income from `transactions`.
- `summary.totalExpenses`: total expenses from `transactions`.
- `summary.netSavings`: income minus expenses.
- `summary.savingsRate`: net savings as a percentage of income.
- `summary.activeHabits`: count of active `habits`.
- `summary.averageGoalProgress`: average progress across savings goals.
- `summary.currentAssetValue`: current manually tracked asset value.
- `charts.wealthTrend`: six-month wealth trend.
- `charts.monthlyExpenses`: six-month expense totals.
- `charts.categorySpending`: category-wise expense totals.
- `goals`: top savings goals with progress percentages.
- `recentTransactions`: latest six transactions.

## Metric Sources

- Total income: all `transactions` where `type = income`.
- Total expenses: all `transactions` where `type = expense`.
- Net savings: total income minus total expenses.
- Savings rate: net savings divided by total income.
- Active habits: all `habits` where `status = active`.
- Goal progress: `currentAmount / targetAmount` from `savingsGoals`.
- Wealth growth trend: monthly net savings plus manual `assets` values.
- Monthly expense chart: expense transaction totals grouped by month.
- Category chart: expense transaction totals grouped by category.
- Recent activity: latest transaction records by date.

## Frontend Components

Dashboard page:

- `DashboardPage`

Dashboard components:

- `SummaryCard`
- `ChartPanel`
- `EmptyState`
- `GoalProgressList`
- `RecentTransactionsTable`

Charts:

- Wealth growth trend: Recharts area chart.
- Monthly expenses: Recharts bar chart.
- Category-wise spending: Recharts pie chart.

## Empty-State Behavior

If a user has no records yet, the dashboard still loads successfully and displays empty states for charts, goals, and transactions. The dashboard does not use fake financial numbers.

## Phase Notes

- Quick action buttons are present, but transaction creation is disabled until Phase 5.
- The dashboard is ready to become richer as Phase 5 through Phase 8 add transactions, habits, savings goals, and assets.
