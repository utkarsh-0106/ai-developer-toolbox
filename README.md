# AI Developer Toolbox

AI Developer Toolbox is a full-stack AI-powered debugging assistant built using React, Vite, Tailwind CSS, Node.js, and Express.

The application allows developers to submit coding problems, bugs, or software engineering questions and receive AI-generated assistance through a clean and responsive interface.

---

# Features

* AI-powered developer assistant
* React + Vite frontend
* Node.js + Express backend
* OpenAI API integration
* Mock AI fallback responses
* Responsive UI
* Dark mode support
* Loading states
* Error handling
* Copy response button
* Clean scalable architecture

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS

## Backend

* Node.js
* Express.js

## AI

* OpenAI API

---

# Project Architecture

The project follows a production-style full-stack architecture.

## Frontend Structure

```bash
frontend/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── services/
 │   ├── assets/
 │   ├── App.jsx
 │   ├── main.jsx
 │   └── index.css
```

### Frontend Responsibilities

* UI rendering
* State management
* API communication
* Loading states
* Error handling
* Responsive layout

---

## Backend Structure

```bash
backend/
 ├── src/
 │   ├── controllers/
 │   ├── routes/
 │   ├── services/
 │   ├── app.js
 │   └── server.js
```

### Backend Responsibilities

* API routing
* Request validation
* AI service communication
* Error handling
* Environment variable management

---

# Engineering Practices Used

* Separation of concerns
* Reusable components
* Service layer architecture
* Async/await
* Environment variables
* API abstraction
* Responsive UI design
* Clean folder structure
* Error handling
* Scalable architecture

---

# Data Flow

1. User enters a coding question.
2. Frontend sends POST request to backend.
3. Express route receives request.
4. Controller validates request.
5. Service layer processes AI request.
6. OpenAI API or mock response returns output.
7. Frontend displays AI response.

---

# Environment Variables

## Backend `.env`

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
```

## Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/utkarsh-0106/ai-developer-toolbox.git
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

# Running the Project

## Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Endpoint

## Generate AI Response

```http
POST /api/ai
```

### Request Body

```json
{
  "prompt": "How do I debug React rendering issues?"
}
```

### Response

```json
{
  "response": "AI generated response"
}
```

---

# Mock AI Fallback System

If the OpenAI API quota is unavailable, the backend automatically returns a mock AI response.

This ensures:

* development continuity
* stable frontend testing
* reliable API contract
* better debugging experience

---

# Deployment

## Frontend Deployment

* Vercel

## Backend Deployment

* Render

---

# Future Improvements

* Syntax highlighting
* Chat history
* Authentication
* Streaming AI responses
* Markdown rendering
* Code block formatting
* Better AI context handling

---

# What I Learned

Through this project, I learned:

* Full-stack application architecture
* React component design
* Express backend structuring
* API integration
* Environment variable management
* Service layer abstraction
* Frontend/backend separation
* Responsive UI development
* Debugging workflows
* Production-style engineering practices

---

# Author

Utkarsh Maheshwari

GitHub:

[https://github.com/utkarsh-0106](https://github.com/utkarsh-0106)
