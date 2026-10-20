# Holographic AI companion update

The site guide now includes a custom inline SVG robot character with a gold/amber holographic treatment, orbital rings, glow, and a slow viewport-spanning float animation. The bot remains visible when the guide panel is closed and acts as the launcher for the existing guided-tour board. Movement stops on hover and is disabled for users who prefer reduced motion. The existing tour logic and routes remain in place.

## Local verification

From `frontend/`, run `npm ci`, `npm run dev`, `npm run build`, and `npm run lint`. Dependency installation could not be completed in the packaging environment because a required package was missing from its npm cache; production build, lint, and browser interaction tests therefore remain unverified.
