# Phase 11: Testing & Validation

This phase adds a repeatable validation flow for the full financial tracking journey.

## Automated API Validation

Run the end-to-end backend validation with:

```bash
npm run test:validation --workspace server
```

The script loads `server/.env`, opens the Express app on a temporary local port, creates a uniquely named test user and realistic INR financial records, then removes every record it created. It never modifies existing user data.

The automated flow validates:

- Health endpoint and protected-route access control.
- Register, duplicate-register handling, valid login, invalid login, and current-user session loading.
- Profile setup persistence.
- Invalid transaction validation plus income and expense create/edit/delete flows.
- Monthly transaction filtering and summary calculations.
- Savings-goal creation, progress updates, completion state, edit, and deletion.
- Habit creation, completion logging, streak statistics, update, summary, and deletion.
- Asset creation, update, and deletion.
- Dashboard totals and the data returned for the wealth, expense, and category charts.
- Wealth analytics totals, insights, and all chart data series.
- Standard-user admin denial plus admin dashboard, user list, feedback list, and feedback-status update behavior.

## Project Quality Gate

Run the whole project validation with:

```bash
npm test
```

This runs the API validation first, then client linting and the production build.

## Browser Validation Checklist

Browser checks are run against the local Vite app using realistic data. Confirm these before submission:

- Registration leads to profile setup; login restores the user session; logout returns the user to login.
- Visiting protected pages while logged out redirects to login.
- Transaction, habit, savings-goal, analytics, and dashboard pages show saved data without console errors.
- Chart containers render visible chart SVG/canvas content once financial records exist.
- Admin users can open the Admin page; standard users are redirected to the dashboard.
- Required, number-range, email, and minimum-password constraints prevent invalid form submission; API errors show as in-page validation messages.
- At 390px mobile width, navigation opens as a drawer, forms stack correctly, and finance/admin tables remain horizontally scrollable.
- At desktop width, the persistent sidebar, cards, charts, and tables remain readable without overlapping content.

## Phase 11 Verification Result

Completed on the local development database:

- `npm test` passed with 19 API checks, client linting, and a production client build.
- Browser validation confirmed that a protected route redirects unauthenticated visitors to login.
- Browser registration reached the authenticated profile-setup route using a clean temporary backend/frontend pair.
- At a `390px` viewport, the dashboard rendered its mobile menu control and the page had no horizontal overflow.
- The browser test accounts and all their related records were removed after validation.

The pre-existing process on port `5001` did not restore an authentication session consistently during browser testing, so the visual pass used the current workspace code on temporary ports `5010` and `5175`. Those temporary processes were stopped after the checks finished.

## Test Data

The automated script uses a unique email beginning with `phase11-`, then deletes its user, profile, transactions, habits, habit logs, goals, assets, and feedback records during cleanup. If a test process is interrupted, rerunning it with the same completed process is safe because every run uses a new identifier.
