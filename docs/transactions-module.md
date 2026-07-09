# Phase 5: Income & Expense Tracking

This document records the implemented manual transaction tracking module.

## Backend API

All routes require `Authorization: Bearer <token>`.

### `GET /api/transactions`

Returns transaction history, filters, supported expense categories, and a summary.

Query params:

- `month`: optional `YYYY-MM`.
- `type`: optional `income | expense`.
- `category`: optional category string.

### `POST /api/transactions`

Creates an income or expense record.

Request body:

- `type`: `income | expense`.
- `category`: required string.
- `amount`: required number, minimum `0`.
- `date`: required date.
- `note`: optional string.

Expense categories:

- Food
- Rent
- Transport
- Shopping
- Bills
- Health
- Education
- Entertainment
- Other

### `PUT /api/transactions/:id`

Updates a user-owned transaction.

### `DELETE /api/transactions/:id`

Deletes a user-owned transaction.

### `GET /api/transactions/summary`

Returns summary totals for the same filters.

## Frontend Page

Route:

- `/transactions`

Implemented UI:

- Income/expense form.
- Edit transaction.
- Delete transaction.
- Month/type/category filters.
- Monthly summary cards.
- Transaction history table.

## Summary Metrics

- Total income.
- Total expenses.
- Net savings.
- Savings rate.
- Transaction count.
- Category totals.
