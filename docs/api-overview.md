# API Overview

Base URL: `https://<your-render-service>.onrender.com/api`

Protected routes require:

```http
Authorization: Bearer <JWT>
```

## Public API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Service health check for deployment monitoring. |
| `POST` | `/auth/register` | Create a user and default profile. |
| `POST` | `/auth/login` | Return a JWT session for valid credentials. |

## Authenticated API

| Area | Endpoints |
| --- | --- |
| Session and profile | `GET /auth/me`, `PUT /profile` |
| Dashboard | `GET /dashboard/overview` |
| Transactions | `GET/POST /transactions`, `GET /transactions/summary`, `PUT/DELETE /transactions/:id` |
| Habits | `GET/POST /habits`, `GET /habits/summary`, `PUT/DELETE /habits/:id`, `POST /habits/:id/log` |
| Savings goals | `GET/POST /savings-goals`, `PUT/DELETE /savings-goals/:id`, `PATCH /savings-goals/:id/progress` |
| Assets | `GET/POST /assets`, `PUT/DELETE /assets/:id` |
| Analytics | `GET /analytics/wealth` |

## Admin API

Admin routes additionally require `role: admin`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/admin/summary` | Platform counts and engagement metrics. |
| `GET` | `/admin/users` | User list. |
| `GET` | `/admin/feedback` | Feedback and issues. |
| `PATCH` | `/admin/feedback/:id` | Update feedback status. |

All responses are JSON. Validation failures return a `message` field with an appropriate `4xx` status. Full request contracts are documented in the module notes under `docs/`.
