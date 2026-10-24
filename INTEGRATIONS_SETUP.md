# GitHub integration setup

This guide covers the optional GitHub OAuth integration in AI Developer Toolbox. Public-repository ingestion and website Q&A remain usable without GitHub OAuth credentials.

## 1. Prerequisites

- Node.js 20+ (use a currently supported LTS release), npm, and MongoDB.
- Existing Google sign-in and an AI provider configured for the repository Q&A engine.
- For private repositories: a GitHub OAuth App.

Install dependencies from the project root:

```bash
cd backend && npm ci
cd ../frontend && npm ci
```

Copy `backend/.env.example` to `backend/.env` and fill in the core variables. Never commit `.env`.

Generate secrets:

```bash
openssl rand -hex 32 # INTEGRATION_ENCRYPTION_KEY (32-byte AES-256 key, hex)
openssl rand -hex 32 # JWT_SECRET (use a separate value)
```

## 2. GitHub OAuth

1. In GitHub Developer Settings, create an OAuth App.
2. Set the callback URL to `http://localhost:5000/api/integrations/github/callback` for local development, or the exact public HTTPS callback in production.
3. Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `GITHUB_CALLBACK_URL`.
4. Keep `INTEGRATION_ENCRYPTION_KEY` stable and private. Existing connected credentials cannot be decrypted if this key is lost or changed.
5. Sign in to the website, choose **Connect GitHub**, authorize, then use **Browse repositories** and **Index**. Private repository indexing uses the connected account's authorization and stores the token encrypted with AES-256-GCM.
6. Disconnecting deletes the stored token. Revoking the OAuth App in GitHub is also recommended if access should be fully withdrawn.

The app requests `read:user repo` because the classic OAuth scope `repo` is needed to read private repository contents. Review this scope before production use; a GitHub App with narrowly scoped repository permissions is preferable for a production multi-tenant deployment.

## 3. Local development

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Set `VITE_API_BASE_URL` in `frontend/.env.local` only if the API is not running at the development default (`http://localhost:5000`).

## 4. Repository Q&A behavior

Website Q&A uses the repository Q&A service. Retrieval is scoped to the signed-in user and selected repository. Private repository indexing verifies access through the connected GitHub account before downloading repository contents.

## 5. Troubleshooting

- `GitHub OAuth is not configured`: set all GitHub OAuth variables and restart the backend.
- Callback state expired: restart the Connect GitHub flow; states are short-lived and single-use.
- Repository list fails: reconnect GitHub or review app permissions and GitHub API rate limits.
- Private index fails: confirm the connected GitHub account has access and the OAuth grant includes repository read permissions.
- AI answers fail: confirm the configured AI provider is available and repository indexing status is `ready`.

## 6. Production checklist and limitations

- Use HTTPS for the frontend and OAuth callback; configure CORS to exact frontend origins.
- Use a managed MongoDB with authentication, backups, and network restrictions.
- Store secrets in the hosting provider's secret manager. Rotate leaked or compromised secrets immediately.
- Use a GitHub App with least-privilege repository permissions for a production release.
- Add distributed rate limiting and queue-based processing before scaling horizontally.
- Token encryption uses a single environment key; use a managed KMS and rotation strategy for enterprise deployment.
- Repository index access is user-scoped. Index refresh/stale commit detection is not automatic; re-index when needed.
- Automated tests mock external services; live GitHub OAuth flows require your credentials and registered app configuration and have not been exercised here.
