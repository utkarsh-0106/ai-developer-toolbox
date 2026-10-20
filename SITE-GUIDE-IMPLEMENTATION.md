# Floating AI Site Guide

## What changed

- Added a reusable, app-level floating guide that remains available across the existing React Router routes.
- Added a black-and-gold holographic board and compact floating launcher, with responsive sizing, keyboard-accessible buttons, focus indicators, and reduced-motion support.
- Added a six-step tour tied to real project sections and pages: home, GitHub repository intelligence, AI workspace, prompt history, Privacy Policy, and Terms of Service.
- The tour highlights existing targets, scrolls them into view, tracks progress, and supports previous/next, skip, finish, restart, minimize, close, reopen, and resume.
- Stores only non-sensitive onboarding preferences in browser localStorage. Storage failures are handled without breaking the application.
- Existing application routes, API code, authentication, and AI workflows were not intentionally changed.

## Run locally

From the project root, install and start the backend in one terminal:

```bash
cd backend
npm install
npm run dev
```

In a second terminal, install and start the frontend:

```bash
cd frontend
npm ci
npm run dev
```

Use the Vite URL printed in the terminal. Configure the project's existing environment variables locally when needed; environment files are intentionally not included in the ZIP.

## Test the guide

1. Open the app in a fresh browser profile or clear the `adt_guide_*` localStorage keys to see the initial welcome board.
2. Start the full tour and move through all six steps, including the transitions to History, Privacy, and Terms.
3. Test Back, Next, Skip, Finish, Restart, Resume, Minimize, Close, and the floating launcher.
4. Refresh the page to verify dismissal and tour progress persistence.
5. Resize to a narrow mobile viewport and enable the operating system's reduced-motion setting.
6. Confirm that repository analysis, sign-in, prompt history, and AI workspace controls still behave as before.

## Files changed

- `frontend/src/App.jsx` — mount the guide once inside the router.
- `frontend/src/components/SiteGuide.jsx` — guide UI, route-aware tour, target handling, and persistence.
- `frontend/src/components/site-guide.css` — scoped holographic gold/black styling and responsive/reduced-motion rules.
- `frontend/src/components/History.jsx` — stable tour target marker on the history heading.
- `frontend/src/pages/Privacy.jsx` — stable tour target marker on the privacy heading.
- `frontend/src/pages/Terms.jsx` — stable tour target marker on the terms heading.
- `SITE-GUIDE-IMPLEMENTATION.md` — implementation notes and test checklist.

## Validation status

- JSX/JavaScript syntax transpilation check for all five changed source files: passed.
- Production build and ESLint: not run successfully in this environment. Dependency installation could not complete because the package registry dependency `zod-validation-error@4.0.2` was unavailable in the local npm cache and online installation timed out. Run `npm ci`, `npm run build`, and `npm run lint` from `frontend/` in an environment with registry access.
- Browser interaction tests were not run in this environment.
