# AI Developer Toolbox

AI Developer Toolbox is a full-stack AI engineering platform for
developers. It combines a general-purpose AI workspace with
repository-grounded engineering intelligence so developers can
understand, analyze, review, debug, search, and reason about real GitHub
codebases.

## Live Demo

-   **Frontend:** https://ai-developer-toolbox-c3ud.vercel.app
-   **Backend:** https://ai-developer-toolbox-6.onrender.com
-   **GitHub:** https://github.com/utkarsh-0106/ai-developer-toolbox

------------------------------------------------------------------------

## What It Does

AI Developer Toolbox is designed around two complementary workflows:

### 1. General AI Engineering Workspace

Ask general software-engineering questions, debugging questions, or
coding problems and receive an AI-generated response through the backend
AI provider abstraction.

### 2. Repository Intelligence

Connect a public GitHub repository and turn it into a
repository-grounded knowledge base.

The platform can:

-   Inspect repository structure
-   Index repository source files
-   Split source code into chunks
-   Persist repository metadata and chunks
-   Ask questions grounded in the indexed repository
-   Return source citations for repository-grounded answers
-   Explore repository trees and individual files
-   Generate repository-level analysis
-   Run an engineering agent against repository context
-   Perform code reviews
-   Analyze debugging problems
-   Run security-oriented analysis
-   Generate tests
-   Review diffs
-   Search repository content
-   Inspect retrieval/telemetry information
-   Evaluate retrieval quality

The goal is to make AI useful as an **engineering assistant that
understands a real codebase**, rather than only as a generic chatbot.

------------------------------------------------------------------------

# Architecture

``` text
                         ┌──────────────────────────┐
                         │          User            │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │   React + Vite Frontend  │
                         │        Vercel            │
                         └────────────┬─────────────┘
                                      │ HTTPS / JSON
                                      ▼
                         ┌──────────────────────────┐
                         │   Node.js + Express API  │
                         │         Render           │
                         └────────────┬─────────────┘
                                      │
             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
             ▼                        ▼                        ▼
     ┌───────────────┐       ┌────────────────┐       ┌────────────────┐
     │ Authentication│       │ Repository     │       │ AI Provider    │
     │ Google + JWT  │       │ Intelligence   │       │ Abstraction    │
     └───────────────┘       └───────┬────────┘       └───────┬────────┘
                                     │                        │
                                     ▼                        ▼
                              ┌──────────────┐        ┌─────────────────┐
                              │  MongoDB     │        │ Gemini / Groq   │
                              │  Atlas       │        │ / other enabled │
                              └──────────────┘        │ providers       │
                                                      └─────────────────┘
```

### Production AI flow

``` text
React
  │
  ▼
Render API
  │
  ▼
AIService
  │
  ├── Gemini (primary in production)
  │
  └── Groq (configured fallback)
```

### Local development

The backend also supports a local Ollama provider for development when
configured through environment variables.

``` text
React
  │
  ▼
Local Express API
  │
  ▼
AIService
  │
  └── Ollama
```

------------------------------------------------------------------------

# Repository Intelligence Pipeline

The repository workflow is the core engineering feature of the platform.

``` text
GitHub Repository URL
        │
        ▼
Repository Metadata
        │
        ▼
Repository Ingestion
        │
        ▼
Download / Read Repository Archive
        │
        ▼
Filter Relevant Files
        │
        ▼
Chunk Source Files
        │
        ▼
Persist Repository + RepositoryChunk documents
        │
        ▼
Repository becomes ready
        │
        ▼
User asks a repository question
        │
        ▼
Search / rank relevant chunks
        │
        ▼
Build repository-grounded prompt
        │
        ▼
AI provider
        │
        ▼
Grounded answer + citations
```

Repository Q&A explicitly instructs the model to answer using the
retrieved repository context and to cite source blocks such as `[1]`,
`[2]`, etc. If the available context is insufficient, the system is
designed to say so rather than invent repository behavior.

------------------------------------------------------------------------

# Repository Intelligence Capabilities

Authenticated repository intelligence routes include:

  ---------------------------------------------------------------------------------------------------
  Capability                          Endpoint
  ----------------------------------- ---------------------------------------------------------------
  Repository tree                     `GET /api/repository-intelligence/:repositoryId/tree`

  Repository file                     `GET /api/repository-intelligence/:repositoryId/file`

  Repository analysis                 `POST /api/repository-intelligence/:repositoryId/analyze`

  Repository agent                    `POST /api/repository-intelligence/:repositoryId/agent`

  Code review                         `POST /api/repository-intelligence/:repositoryId/review`

  Debugging                           `POST /api/repository-intelligence/:repositoryId/debug`

  Security scan                       `POST /api/repository-intelligence/:repositoryId/security`

  Test generation                     `POST /api/repository-intelligence/:repositoryId/tests`

  Diff review                         `POST /api/repository-intelligence/:repositoryId/diff-review`

  Repository search                   `POST /api/repository-intelligence/:repositoryId/search`

  Telemetry                           `GET /api/repository-intelligence/:repositoryId/telemetry`

  Retrieval evaluation                `POST /api/repository-intelligence/:repositoryId/evaluate`
  ---------------------------------------------------------------------------------------------------

The repository Q&A workflow is exposed separately through:

``` text
POST /api/repository/qa
```

and requires an authenticated user plus a repository ID.

------------------------------------------------------------------------

# Retrieval Approach

Repository Q&A currently uses a lightweight lexical/hybrid retrieval
approach rather than requiring a vector database.

The retrieval pipeline includes:

1.  Normalize the user's question.
2.  Remove common stop words.
3.  Extract a bounded set of search terms.
4.  Search repository chunks using repository/user/commit constraints.
5.  Match terms against chunk content and file paths.
6.  Score matching chunks.
7.  Give additional weight to useful repository paths such as
    configuration, authentication, controllers, services, routes,
    models, and server files.
8.  Rank the candidates.
9.  Limit the number of chunks supplied to the model.
10. Build a repository-grounded prompt.
11. Ask the configured AI provider for the final response.
12. Return the answer with source references.

This design keeps the initial system relatively simple while still
providing useful repository-grounded answers.

------------------------------------------------------------------------

# Authentication

Google authentication is used at the frontend, with the backend
responsible for verifying the Google credential and issuing the
application's JWT.

High-level flow:

``` text
Google Sign-In
     │
     ▼
Frontend receives Google credential
     │
     ▼
POST /api/auth/google
     │
     ▼
Backend verifies credential
     │
     ▼
User created / loaded
     │
     ▼
JWT issued
     │
     ▼
Frontend stores auth token
     │
     ▼
Protected API requests use:
Authorization: Bearer <token>
```

Repository indexing and repository intelligence endpoints are protected
by authentication middleware.

------------------------------------------------------------------------

# Data Model

The repository intelligence system uses MongoDB/Mongoose models
including:

### User

Stores application user information associated with authentication.

### Repository

Stores repository-level metadata such as:

-   User ownership
-   GitHub repository identity
-   Owner/name/full name
-   Repository URL
-   Default branch
-   Description/language metadata
-   Last indexed commit SHA
-   Last indexed timestamp
-   Indexing status
-   Indexing error information

### RepositoryChunk

Stores individual indexed source chunks, including information such as:

-   User ID
-   Repository ID
-   GitHub repository ID
-   Commit SHA
-   Owner/repository
-   Branch
-   File path
-   File SHA
-   Chunk index
-   Start/end information
-   Chunk size
-   Chunk content

The user/repository/commit constraints are important for keeping
repository context isolated and tied to the indexed version of the
codebase.

------------------------------------------------------------------------

# Project Structure

The project is organized into separate frontend and backend
applications.

``` text
ai-developer-toolbox/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── package-lock.json
│
├── REPOSITORY_QA.md
├── DEPLOYMENT.md
├── render.yaml
└── README.md
```

------------------------------------------------------------------------

# Backend Architecture

The backend follows a layered Express architecture:

``` text
HTTP Request
     │
     ▼
Route
     │
     ▼
Controller
     │
     ▼
Service
     │
     ├── MongoDB models
     └── AI provider services
```

Important backend responsibilities include:

-   HTTP server and CORS configuration
-   Environment configuration
-   Authentication
-   AI request handling
-   GitHub repository metadata and ingestion
-   Repository persistence
-   Repository Q&A
-   Repository intelligence
-   AI provider selection and fallback
-   Error handling

Representative services include:

``` text
backend/src/services/
├── aiService.js
├── authService.js
├── githubService.js
├── githubArchiveService.js
├── githubArchiveReader.js
├── githubChunker.js
├── githubFileFilter.js
├── repositoryService.js
├── repositoryQaService.js
├── repositoryIntelligenceService.js
├── geminiService.js
├── groqService.js
└── openaiService.js
```

------------------------------------------------------------------------

# Frontend Architecture

The frontend is a React/Vite application.

The API layer centralizes backend communication so pages/components do
not need to duplicate HTTP configuration.

Production API configuration uses:

``` text
VITE_API_BASE_URL
```

Local development falls back to the local backend:

``` text
http://localhost:5000
```

Authenticated repository requests send the application's JWT using:

``` http
Authorization: Bearer <token>
```

------------------------------------------------------------------------

# AI Provider Architecture

The backend uses an AI provider abstraction rather than coupling
application logic directly to a single model provider.

Conceptually:

``` text
Application
     │
     ▼
  AIService
     │
     ├── Ollama
     ├── Gemini
     ├── Groq
     └── OpenAI
```

The provider configuration is environment-driven.

### Production

``` env
AI_PROVIDER=gemini
AI_FALLBACK_PROVIDERS=groq
GEMINI_MODEL=gemini-3.8-flash
```

### Local Ollama example

``` env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:8b
```

Provider-specific API keys remain on the backend and must never be
exposed to frontend JavaScript.

------------------------------------------------------------------------

# Environment Variables

## Frontend

``` env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=
```

For production, `VITE_API_BASE_URL` should point to the Render backend.

## Backend

Example production configuration:

``` env
NODE_ENV=production
PORT=5000

AI_PROVIDER=gemini
AI_FALLBACK_PROVIDERS=groq

GEMINI_MODEL=gemini-3.8-flash
GEMINI_API_KEY=

GROQ_MODEL=
GROQ_API_KEY=

MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=

FRONTEND_ORIGIN=http://localhost:5173
```

For production, set `FRONTEND_ORIGIN` to the deployed Vercel domain.

**Never commit `.env` files or API keys to Git.**

------------------------------------------------------------------------

# Local Development

## Prerequisites

-   Node.js
-   npm
-   MongoDB Atlas or another MongoDB deployment
-   Google OAuth credentials if using Google authentication
-   At least one configured AI provider

## Backend

``` bash
cd backend
npm install
npm start
```

The backend runs on port `5000` by default unless `PORT` is configured.

Health check:

``` text
GET /health
```

## Frontend

In another terminal:

``` bash
cd frontend
npm install
npm run dev
```

The Vite development server normally runs on:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# Production Deployment

The project uses:

-   **Vercel** for the React frontend
-   **Render** for the Node.js/Express backend
-   **MongoDB Atlas** for persistent data
-   External AI providers for production inference

Production flow:

``` text
Internet
   │
   ▼
Vercel
   │
   ▼
Render
   │
   ├── MongoDB Atlas
   └── Gemini / Groq
```

The backend exposes:

``` text
GET /health
```

for deployment health checks.

The repository also contains:

``` text
render.yaml
DEPLOYMENT.md
```

for deployment configuration and instructions.

------------------------------------------------------------------------

# Security Considerations

The current architecture includes several important protections:

-   JWT-based protected API requests
-   Google authentication
-   Backend-only AI API keys
-   Environment-based secret configuration
-   CORS restrictions
-   Authenticated repository intelligence routes
-   User/repository scoping during repository operations
-   Repository-grounded prompts that instruct the model not to invent
    unsupported codebase details

For larger production deployments, additional controls such as rate
limiting, stronger database indexing/search infrastructure, centralized
logging, background job processing, and more granular authorization can
be added as scale requires.

------------------------------------------------------------------------

# Current Architecture Trade-offs

The current system intentionally favors a relatively simple
architecture.

Repository retrieval is primarily lexical rather than dependent on a
separate vector database. This reduces infrastructure complexity and
makes the system easier to run, but large repositories and high
concurrency can increase database and memory pressure.

Potential future improvements include:

-   MongoDB text/search indexes or a dedicated search engine
-   Better hybrid/vector retrieval
-   Background repository indexing jobs
-   Redis caching
-   Queue-based AI workloads
-   Horizontal backend scaling
-   Pagination for large repository trees
-   More granular repository permissions
-   Rate limiting and usage quotas
-   Observability and distributed tracing

These are future scalability improvements, not components that should be
assumed to already exist.

------------------------------------------------------------------------

# Example Repository Questions

Once a repository is indexed, useful questions include:

``` text
Give me a complete architecture overview of this repository.

Trace the complete Google authentication flow.

How does repository indexing work from GitHub URL to stored chunks?

How does repository-grounded Q&A retrieve relevant code?

What are the biggest scalability bottlenecks in the current implementation?

Find security weaknesses in the current implementation.

Review the authentication architecture.

Trace one repository question from the browser to the final AI response.

What would break first if this system had 1,000 concurrent users?

Show me the most important production improvements and explain why.
```

The strongest questions are those that ask the system to cite the actual
files and functions responsible for each conclusion.

------------------------------------------------------------------------

# Engineering Philosophy

The project is built around a simple idea:

> **AI should understand the software it is helping you build.**

Instead of treating an LLM as an isolated chatbot, AI Developer Toolbox
connects AI reasoning to:

-   Real source code
-   Repository structure
-   Repository versions/commits
-   Database-backed code chunks
-   Authentication context
-   Engineering workflows
-   Code review and debugging tasks

This makes the platform useful for both day-to-day development and
deeper software-engineering analysis.

------------------------------------------------------------------------

# Author

**Utkarsh Maheshwari**

B.Tech Computer Science Engineering

GitHub: https://github.com/utkarsh-0106

------------------------------------------------------------------------

# License

Add the project's chosen license here before publishing the repository
if the project is intended for public reuse.
