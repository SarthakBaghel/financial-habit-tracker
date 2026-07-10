# Deployment Guide

This repository is configured for a Vercel frontend, Render API, and MongoDB Atlas database.

## 1. MongoDB Atlas

1. Create an Atlas project and free/shared cluster.
2. Create a database user with a strong password.
3. Add Render's outbound IP range, or temporarily allow `0.0.0.0/0` while developing. Tighten the rule before production use.
4. Copy the driver connection string and replace the database name with `wealthtrack`.

The result should look like:

```text
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/wealthtrack?retryWrites=true&w=majority
```

## 2. Render API

1. Push this project to GitHub.
2. In Render, choose **New > Blueprint** and select the repository. Render reads [`render.yaml`](../render.yaml).
3. Enter the following values when prompted:
   - `MONGODB_URI`: Atlas connection string.
   - `CLIENT_ORIGIN`: Vercel production URL, for example `https://wealthtrack.vercel.app`.
   - `JWT_SECRET`: generated automatically by the blueprint; replace it only if rotating secrets.
4. Deploy and confirm `https://<service>.onrender.com/api/health` returns status `ok`.

## 3. Vercel Frontend

1. In Vercel, import the same GitHub repository.
2. Use the repository root as the project root. [`vercel.json`](../vercel.json) builds `client/` and preserves React client-side routes.
3. Add this environment variable:

```text
VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api
```

4. Deploy, then copy the generated Vercel URL into Render's `CLIENT_ORIGIN` setting and redeploy the API.
5. Verify registration, login, dashboard loading, and a refresh on `/dashboard/analytics`.

## 4. Seed Demo Data

After setting `server/.env` to the Atlas connection string, run this once from a trusted machine:

```bash
npm run seed:demo --workspace server
```

It resets only the account identified by `DEMO_EMAIL` and creates realistic INR transactions, habits, goals, and assets. Defaults:

```text
Email: demo@wealthtrack.app
Password: WealthTrackDemo123!
```

Set `DEMO_EMAIL` and `DEMO_PASSWORD` in the shell or `server/.env` before seeding if you want different public credentials. Do not use a real user's email as the demo email.

## Release Checklist

- [ ] `npm test` passes with the Atlas connection string.
- [ ] `/api/health` returns `200` from Render.
- [ ] Vercel has `VITE_API_BASE_URL` set to the Render API URL.
- [ ] Render `CLIENT_ORIGIN` exactly matches the Vercel production URL.
- [ ] Demo account has been seeded and login tested.
- [ ] No `.env` files or connection strings were committed.
- [ ] Live frontend and backend URLs are added to the README before submission.
