# Phase 3: Authentication & User Module

This document records the implemented authentication flow and user module contracts.

## Backend API

### `POST /api/auth/register`

Creates a user, hashes the password, creates a default profile, and returns a JWT session.

Request body:

- `name`: required string.
- `email`: required valid email.
- `password`: required string, minimum 8 characters.
- `currencyPreference`: optional enum `INR | USD`, default `INR`.

Response:

- `token`
- `user`
- `profile`

### `POST /api/auth/login`

Validates credentials and returns a JWT session.

Request body:

- `email`
- `password`

Response:

- `token`
- `user`
- `profile`

### `GET /api/auth/me`

Protected route. Returns the current authenticated user and profile.

Headers:

- `Authorization: Bearer <token>`

### `PUT /api/profile`

Protected route. Updates onboarding/profile setup values.

Allowed fields:

- `monthlyIncomeTarget`
- `savingsTarget`
- `riskPreference`
- `financialGoals`

### `GET /api/admin/summary`

Admin-only route. Returns basic platform counts for the admin dashboard.

Access:

- Requires valid JWT.
- Requires `role: admin`.

## Security Decisions

- Passwords are hashed with `bcryptjs`.
- JWTs are signed with `JWT_SECRET`.
- Protected API routes use `Authorization: Bearer <token>`.
- Role-based access is implemented with `requireRole("admin")`.
- Password hashes are excluded from normal user queries with `select: false`.

## Frontend Flow

Pages added:

- `/login`
- `/register`
- `/dashboard/profile-setup`
- `/dashboard/admin`

Frontend auth behavior:

- Auth state is managed in `AuthContext`.
- Token is persisted in `localStorage` for this student MVP.
- Axios attaches the token as a bearer token after login/register/session restore.
- Private routes redirect unauthenticated users to `/login`.
- Admin route redirects non-admin users to `/dashboard`.
- Logout clears the token and session state.

## Phase Notes

- For production-grade security, an HTTP-only secure cookie session would be preferable to localStorage.
- The current approach keeps the implementation simple and appropriate for the project submission scope.
