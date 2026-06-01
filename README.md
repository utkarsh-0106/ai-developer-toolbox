# AI Developer Toolbox

AI Developer Toolbox is a full-stack AI-powered debugging assistant built using React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and OpenAI.

The application allows developers to submit coding problems, bugs, and software engineering questions and receive AI-generated debugging assistance. Every prompt and response is automatically stored in MongoDB and can be viewed or deleted through the History page.

---

# Live Demo

### Frontend

https://ai-developer-toolbox-c3ud.vercel.app

### Backend API

https://ai-developer-toolbox-6.onrender.com

---

# Features

### AI-Powered Debugging Assistant

* Submit coding questions
* Receive AI-generated debugging guidance
* OpenAI integration
* Mock AI fallback responses

### Prompt History System

* Automatically stores prompts
* Automatically stores AI responses
* View previous conversations
* Delete history entries
* MongoDB persistence

### User Experience

* Responsive UI
* Dark mode support
* Loading states
* Error handling
* Copy response functionality
* Clean developer-focused interface

### Backend Features

* RESTful API architecture
* Request validation
* MongoDB integration
* Mongoose models
* Service layer architecture
* Environment variable management

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## AI

* OpenAI API

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# Project Architecture

## Frontend Structure

```bash
frontend/
├── src/
│   ├── components/
│   │   ├── PromptForm.jsx
│   │   ├── ResponseCard.jsx
│   │   └── History.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
```

### Frontend Responsibilities

* UI rendering
* State management
* API communication
* Routing
* History display
* History deletion
* Loading states
* Error handling

---

## Backend Structure

```bash
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── aiController.js
│   │
│   ├── models/
│   │   ├── Prompt.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   └── aiRoutes.js
│   │
│   ├── services/
│   │   └── openaiService.js
│   │
│   └── server.js
```

### Backend Responsibilities

* API routing
* Request validation
* AI service communication
* MongoDB operations
* Prompt storage
* History retrieval
* History deletion
* Error handling

---

# Database Schema

## Prompt Model

```js
{
  question: String,
  response: String
}
```

Automatically includes:

```js
createdAt
updatedAt
```

using Mongoose timestamps.

---

# Data Flow

1. User enters a coding question.
2. Frontend sends POST request.
3. Backend validates request.
4. OpenAI service generates response.
5. Prompt and response are saved to MongoDB.
6. Response is returned to frontend.
7. User can view saved history.
8. User can delete history entries.

---

# API Endpoints

## Generate AI Response

```http
POST /api/ai/ask
```

### Request

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

## Get Prompt History

```http
GET /api/ai/history
```

### Response

```json
[
  {
    "_id": "...",
    "question": "...",
    "response": "...",
    "createdAt": "..."
  }
]
```

---

## Delete History Item

```http
DELETE /api/ai/history/:id
```

### Response

```json
{
  "message": "History item deleted"
}
```

---

# Environment Variables

## Backend

```env
PORT=5000

OPENAI_API_KEY=your_openai_key

MONGO_URI=your_mongodb_connection_string
```

## Frontend

### Local Development

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Production

```env
VITE_API_BASE_URL=https://ai-developer-toolbox-6.onrender.com
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/utkarsh-0106/ai-developer-toolbox.git
```

---

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Install Frontend Dependencies

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

Runs on:

```bash
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Runs on:

```bash
http://localhost:5173
```

---

# Engineering Practices Used

* Separation of concerns
* MVC-inspired architecture
* Service layer abstraction
* Reusable React components
* Async/Await
* REST API design
* Environment variable management
* MongoDB data persistence
* Error handling
* Responsive UI design
* Scalable folder structure

---

# Current Features Completed

✅ OpenAI Integration

✅ MongoDB Integration

✅ Prompt Storage

✅ History Page

✅ Delete History

✅ Responsive UI

✅ Dark Mode

✅ Production Deployment

---

# Planned Features

* Google Authentication
* User Accounts
* User-Specific History
* Markdown Rendering
* Syntax Highlighting
* Streaming AI Responses
* Export History
* AI Conversation Threads

---

# What I Learned

Through this project, I learned:

* Full-stack application architecture
* React development with Vite
* Express backend design
* OpenAI API integration
* MongoDB Atlas integration
* Mongoose data modeling
* REST API development
* Frontend/Backend deployment
* State management
* Production debugging
* Environment variable management

---

# Author

Utkarsh Maheshwari

GitHub:

https://github.com/utkarsh-0106
