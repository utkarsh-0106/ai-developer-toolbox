# Hologram companion and History theme update

## Changes
- Reworked the site-guide companion into a larger, angular gold-armored holographic robot with helmet visor, illuminated eyes, shoulder plates, chest reactor, projection aura, and orbital rings.
- Changed movement to slow, gentle drifting with long pauses at viewport positions. Hovering or keyboard focus pauses movement; reduced-motion preferences disable the animation.
- Rebuilt the History page in the application's black-and-gold visual language while retaining the existing history API and delete action.
- Added client-side search across saved prompts and responses, response expand/collapse, empty/loading/error states, and responsive layouts.

## Run locally
```bash
cd frontend
npm ci
npm run dev
```

## Validation
The archive and changed source files were reviewed. A production build could not be run in this environment because `npm ci --offline` failed: the npm cache does not contain the `zod-validation-error@4.0.2` package. Run `npm ci`, then `npm run build` and `npm run lint` in an environment with registry access.
