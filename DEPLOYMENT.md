# AI Developer Toolbox — Production Deployment

## Architecture

User
↓
Vercel React Frontend
↓
Render Express Backend
↓
Gemini API
↓
MongoDB Atlas

Ollama/Qwen is NOT required in production.

---

# 1. Deploy Backend to Render

Create a Render Web Service from this repository.

Root Directory:

backend

Build Command:

npm ci

Start Command:

npm start

Health Check:

/health

---

# 2. Render Environment Variables

Set these in Render:

NODE_ENV=production

AI_PROVIDER=gemini

GEMINI_MODEL=gemini-3.8-flash

GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>

MONGO_URI=<YOUR_MONGODB_ATLAS_URI>

JWT_SECRET=<YOUR_STRONG_RANDOM_SECRET>

GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>

FRONTEND_ORIGIN=https://YOUR-VERCEL-DOMAIN.vercel.app

Do NOT add Ollama variables.

---

# 3. Deploy Frontend to Vercel

Framework:

Vite

Root Directory:

frontend

Build Command:

npm run build

Output Directory:

dist

Environment Variable:

VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com

---

# 4. After Vercel Deployment

Copy the Vercel production URL.

Update Render:

FRONTEND_ORIGIN=https://YOUR-VERCEL-DOMAIN.vercel.app

Redeploy Render.

---

# 5. Google OAuth

Add the production Vercel origin/redirect configuration to the Google OAuth application.

---

# 6. Important

Never commit:

.env
.env.local
API keys
MongoDB credentials
JWT secrets

The production AI provider is Gemini.

Users do not need Ollama installed.
