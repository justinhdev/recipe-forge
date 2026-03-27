# Recipe Forge

<p align="center">
  AI-powered recipe generator built with <strong>React</strong>, <strong>TypeScript</strong>, <strong>Node.js/Express</strong>, <strong>PostgreSQL</strong>, and <strong>Prisma</strong>.
</p>

<p align="center">
  Generate structured recipes from selected ingredients, customize recipe preferences, and save recipes to your account.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Full--Stack-3178C6?logo=typescript&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white" />
  <img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-LLM%20Integration-412991" />
</p>

---

## Overview

Recipe Forge is a full-stack web application that generates recipes from user-selected ingredients using the OpenAI API. Users can customize recipe output with options like servings, diet, cuisine, meal type, macro preference, and creativity level, then save generated recipes to their account.

This project was built to strengthen hands-on experience with modern full-stack development, especially:
- TypeScript across frontend and backend
- API design with Express
- PostgreSQL data modeling with Prisma
- JWT authentication and protected routes
- integrating structured LLM outputs into an app workflow

---

## Features

- Generate recipes from selected ingredients
- Customize recipe output with:
  - servings
  - diet
  - cuisine
  - meal type
  - macro preference
  - creativity level
- JWT-based authentication
- Save generated recipes to a user account
- Retrieve and delete saved recipes through authenticated API endpoints
- Responsive frontend with loading and error states
- Full-stack architecture with separate client and server applications

---

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- OpenAI API

---

## Architecture

Recipe Forge is split into two applications:

```text
recipe-forge/
├── client/   # React frontend
└── server/   # Express API + Prisma + PostgreSQL
```

### Frontend responsibilities
- ingredient selection and recipe options UI
- sending recipe-generation requests
- displaying generated recipe results
- saving recipes for authenticated users

### Backend responsibilities
- user registration and login
- JWT authentication and protected routes
- OpenAI-powered recipe generation
- recipe persistence with Prisma and PostgreSQL

---

## How It Works

1. A user selects ingredients and optional recipe preferences.
2. The frontend sends a request to the Express API.
3. The backend builds a prompt and sends it to the OpenAI API.
4. The response is parsed into structured JSON.
5. The generated recipe is returned to the frontend.
6. Authenticated users can save recipes and manage them later.

---

## API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### AI
- `POST /api/ai/generate`

### Recipes
- `GET /api/recipes`
- `POST /api/recipes`
- `DELETE /api/recipes/:id`

---

## Screenshots

<h3 align="center">Recipe Generation Workflow</h3>
<p align="center">
  <img src="./assets/Generate.png" alt="Recipe Generation Workflow" width="900" />
</p>

<h3 align="center">Saved Recipes Dashboard</h3>
<p align="center">
  <img src="./assets/Saved.png" alt="Saved Recipes Dashboard" width="900" />
</p>

<h3 align="center">Recipe Detail Modal with Macro Breakdown</h3>
<p align="center">
  <img src="./assets/SavedModal.png" alt="Recipe Detail Modal with Macro Breakdown" width="900" />
</p>

---

## Getting Started

### Prerequisites

Make sure you have installed:
- Node.js
- npm
- PostgreSQL
- an OpenAI API key

---

## Environment Variables

Create a `.env` file inside the `server/` directory:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=3000
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/justinhdev/recipe-forge.git
cd recipe-forge
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

### 3. Set up the database

From the `server/` directory:

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start the backend server

```bash
npm run dev
```

### 5. Start the frontend app

In a second terminal:

```bash
cd client
npm run dev
```

---

## Future Improvements

- deploy the app for public demo access
- add recipe update/edit functionality
- add schema validation for API requests and responses
- add automated tests
- improve error handling
- add rate limiting and caching
- strengthen prompt/output validation

---
