# AI Developer Toolbox

An AI-powered developer workspace for exploring GitHub repositories, understanding codebases, and asking questions about source code.

## Overview

AI Developer Toolbox helps developers understand unfamiliar repositories without manually searching through every file. Connect a repository, ingest its relevant source files, and use AI-powered question answering to explore implementation details and code behavior.

## Features

- **GitHub Repository Q&A** — Ask natural-language questions about a repository's source code.
- **Repository ingestion** — Retrieve and process relevant repository files for code understanding.
- **AI-powered code analysis** — Use a configured AI provider to generate answers grounded in repository content.
- **Web application** — Access the developer tools through a React-based interface.
- **Backend API** — Handle application requests, repository processing, and AI workflows through an Express server.
- **Authentication and integrations** — Configure supported authentication providers and integrations using environment variables.

> WhatsApp integration is not included in this version.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript / TypeScript, as used by individual modules
- CSS and component-based UI

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- GitHub API integration
- Configurable AI provider integration

## Project Structure

```text
ai-developer-toolbox/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── scripts/
├── render.yaml
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js and npm
- A MongoDB database
- GitHub credentials for features that require authenticated GitHub access
- API credentials for the AI provider you configure

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/utkarsh-0106/ai-developer-toolbox.git
cd ai-developer-toolbox
```

### 2. Configure the backend

Create `backend/.env` using the environment variables required by the backend code.

At minimum, configure the MongoDB connection and any authentication, GitHub, and AI provider credentials required by the features you use.

Never commit `.env` files or expose private API keys.

### 3. Install and start the backend

```bash
cd backend
npm install
npm run dev
```

Use `npm start` to start the backend without the development watcher.

### 4. Install and start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, commonly:

http://localhost:5173

The frontend must be configured to call the correct backend URL.

## Environment Configuration

Environment variable names and required values depend on the application's current code and enabled features.

Common configuration categories include:

| Category | Purpose |
|---|---|
| Database | MongoDB connection |
| Authentication | JWT and OAuth configuration |
| GitHub | Repository access and OAuth |
| AI provider | API key and provider selection |
| Frontend API | Public backend URL for the deployed frontend |
| CORS | Allowed frontend origin |

Set backend secrets in your backend hosting provider and frontend public configuration in your frontend hosting provider. Never expose private credentials through browser-side variables.

## Deployment

The project includes a `render.yaml` configuration for deployment workflows. Verify the Render service settings, build/start commands, environment variables, and health checks before deploying.

For a split deployment:
- **Backend:** Deploy the Node.js service to Render.
- **Frontend:** Deploy the Vite application to Vercel.
- **Database:** Configure an accessible MongoDB deployment.
- **Frontend API URL:** Point the frontend to the deployed backend.

After changing frontend environment variables, rebuild and redeploy the frontend.

## Security

- Keep `.env` files out of Git.
- Never commit API keys, OAuth client secrets, database credentials, or signing keys.
- Use HTTPS for production services.
- Restrict CORS to trusted frontend origins.
- Apply appropriate authorization and rate limits to protected API endpoints.

## Testing

Run the backend test suite:

```bash
cd backend
npm test
```

Test the frontend build before deployment using the scripts available in `frontend/package.json`.

## Current Scope

This version focuses on the web-based developer toolbox and GitHub repository question-answering workflow. WhatsApp pairing, messaging, and webhook integration are excluded.

## Author

**Utkarsh Maheshwari**

GitHub: [@utkarsh-0106](https://github.com/utkarsh-0106)

Project: [AI Developer Toolbox](https://github.com/utkarsh-0106/ai-developer-toolbox)
