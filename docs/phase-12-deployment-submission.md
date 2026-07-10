# Phase 12: Deployment & Submission

Status: **Deployment-ready**

## Completed in the Repository

- Added a Render Blueprint at [`render.yaml`](../render.yaml) for the Express API, including a health-check path and production environment variable declarations.
- Added [`vercel.json`](../vercel.json) to build the Vite client from the monorepo root and preserve React client-side routing.
- Rewrote the root README with setup instructions, feature list, tech stack, demo data process, live-link placeholders, and documentation links.
- Added deployment guidance for MongoDB Atlas, Render, Vercel, CORS configuration, release checks, and demo account provisioning.
- Added an API overview and project report/PRD.
- Added a screenshot capture checklist for the final submission pack.
- Added `npm run seed:demo --workspace server`, which resets only the selected demo account and creates realistic INR financial data.
- Updated older module documentation to use the current protected `/dashboard/...` application routes.

## Verification

On 2026-07-10, the complete local quality gate passed:

```text
19 API validation checks passed
Client lint passed
Client production build passed
```

## External Release Steps

These require the project owner's accounts and must be completed after pushing the repository to GitHub:

1. Create the Atlas database and add its connection string to Render as `MONGODB_URI`.
2. Deploy the API with Render using the repository Blueprint.
3. Deploy the frontend on Vercel with `VITE_API_BASE_URL` set to the Render API URL.
4. Set Render `CLIENT_ORIGIN` to the final Vercel URL and redeploy the API.
5. Run the demo seed command once against the Atlas database and test the demo login.
6. Add the final Vercel and Render URLs to the root README.
7. Capture and add the eight submission screenshots listed in [`docs/screenshots/README.md`](screenshots/README.md).

No production URLs, database credentials, or account-specific configuration have been committed to this repository.
