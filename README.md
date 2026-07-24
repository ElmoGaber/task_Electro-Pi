# Task Manager — MERN Full-Stack Application

A professional full-stack task management application built with **MongoDB, Express.js, React (TypeScript), and Node.js**. Designed for the technical assessment with strong emphasis on code quality, TypeScript safety, security, and user experience.

---

## ✨ Features

### Core
- User registration & JWT-based authentication
- Full task CRUD with ownership scoping (each user sees only their tasks)
- Task fields: title, description, status, priority, due date
- Search by title (debounced) and filter by status/priority
- URL query params persistence for filters

### UX
- Skeleton loading cards during data fetch
- Empty state with illustration and clear call-to-action
- Delete confirmation dialog
- Toast notifications (success/error) via Sonner
- Responsive design (mobile + desktop)
- Loading, error, empty, and validation states on every view

### Security & Middleware
- Password hashing with bcryptjs (10 rounds)
- JWT token expiry (1 day)
- Rate limiting on login endpoint (express-rate-limit)
- Helmet security headers
- CORS with allow-list
- Request validation (express-validator) separated from route handlers
- Custom error classes: `AppError`, `ValidationError`, `UnauthorizedError`, `NotFoundError`
- Global error handler middleware
<img width="1719" height="866" alt="image" src="https://github.com/user-attachments/assets/2776cbe2-1f27-4e21-8720-693c74eb569f" />

### Performance
- Compression (gzip) via `compression`
- MongoDB indexes on Task: user+title, user+status, user+priority, composite

---

## 🏗 Architecture

```
task-manager/
├── backend/                          # Express API (TypeScript)
│   ├── src/
│   │   ├── config/db.ts              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Register / Login
│   │   │   └── taskController.ts     # CRUD + search/filter
│   │   ├── errors/AppError.ts        # Custom error hierarchy
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts     # JWT verification
│   │   │   ├── errorHandler.ts       # Global error handler
│   │   │   ├── notFound.ts           # 404 handler
│   │   │   ├── rateLimiters.ts       # Login rate limiter
│   │   │   └── validateRequest.ts    # express-validator runner
│   │   ├── models/
│   │   │   ├── User.ts               # User schema (timestamps)
│   │   │   └── Task.ts               # Task schema (indexes, timestamps)
│   │   ├── routes/
│   │   │   ├── authRoutes.ts         # /api/auth/*
│   │   │   └── taskRoutes.ts         # /api/tasks/* (protected)
│   │   ├── utils/constants.ts        # Enums for status/priority
│   │   ├── validators/
│   │   │   ├── authValidators.ts     # Auth validation chains
│   │   │   └── taskValidators.ts     # Task validation chains
│   │   ├── app.ts                    # Express app setup
│   │   └── server.ts                 # Entry point
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                         # React SPA (TypeScript, Vite)
│   ├── src/
│   │   ├── api/client.ts             # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── AuthForm.tsx          # Login/Register form (RHF + Zod)
│   │   │   ├── ConfirmDialog.tsx     # Delete confirmation modal
│   │   │   ├── EmptyState.tsx        # Empty state with SVG + CTA
│   │   │   ├── ProtectedRoute.tsx    # Auth guard
│   │   │   ├── SkeletonCard.tsx      # Loading skeleton
│   │   │   ├── TaskFilters.tsx       # Search + filter bar (debounced)
│   │   │   ├── TaskForm.tsx          # Create/Edit form (RHF + Zod)
│   │   │   └── TaskList.tsx          # Task cards + skeleton/empty/error
│   │   ├── context/
│   │   │   ├── AuthContext.ts        # Context definition
│   │   │   ├── AuthProvider.tsx      # Context provider
│   │   │   └── useAuth.ts           # Context hook
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts        # Debounce hook (300ms)
│   │   │   └── useTasks.ts          # React Query hooks
│   │   ├── lib/constants.ts          # Shared constants
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx     # Main dashboard (React Query)
│   │   │   ├── LoginPage.tsx         # Login (RHF + Zod + Sonner)
│   │   │   └── RegisterPage.tsx      # Register (RHF + Zod + Sonner)
│   │   ├── types/index.ts            # TypeScript interfaces
│   │   ├── App.tsx                   # Router setup
│   │   ├── index.css                 # Global styles (skeleton, dialog, empty)
│   │   └── main.tsx                  # Entry point (QueryClient + Router + Auth)
│   ├── index.html
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── .env.example                      # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **MongoDB** instance (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
cd task-manager

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

Copy `.env.example` files:

```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=your-secure-random-secret
CLIENT_URL=http://localhost:5173
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=10
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

### 4. Build for Production

```bash
cd backend && npm run build
cd frontend && npm run build
```

---

## 📡 API Reference

### Health

| Method | Endpoint       | Description        |
|--------|---------------|--------------------|
| GET    | `/api/health` | Server health check |

### Auth

| Method | Endpoint             | Description          | Rate Limited |
|--------|---------------------|----------------------|-------------|
| POST   | `/api/auth/register` | Create new account   | No          |
| POST   | `/api/auth/login`    | Login & get JWT      | Yes (10/15m) |

**Register Request:**
```json
{ "name": "John", "email": "john@example.com", "password": "secret123" }
```

**Login Response:**
```json
{
  "message": "Logged in successfully.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "John", "email": "john@example.com" }
}
```

### Tasks (Protected — requires `Authorization: Bearer <token>`)

| Method | Endpoint              | Description                 |
|--------|----------------------|-----------------------------|
| GET    | `/api/tasks`          | List tasks (with filters)   |
| POST   | `/api/tasks`          | Create a task               |
| PUT    | `/api/tasks/:id`      | Update a task               |
| DELETE | `/api/tasks/:id`      | Delete a task               |

**Query Parameters (GET /api/tasks):**
- `search` — Filter by title (case-insensitive regex)
- `status` — `To Do`, `In Progress`, `Done`
- `priority` — `Low`, `Medium`, `High`

**Task Object:**
```json
{
  "_id": "...",
  "user": "...",
  "title": "Fix login bug",
  "description": "Handle edge case in auth flow",
  "status": "In Progress",
  "priority": "High",
  "dueDate": "2025-08-15T00:00:00.000Z",
  "createdAt": "2025-07-24T12:00:00.000Z",
  "updatedAt": "2025-07-24T12:30:00.000Z"
}
```

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, TypeScript, Vite 8        |
| State     | TanStack React Query v5, Context    |
| Forms     | React Hook Form v7, Zod v4          |
| Routing   | React Router v7                     |
| Styling   | Plain CSS (responsive)              |
| Backend   | Express 5, TypeScript, Mongoose 9   |
| Auth      | JWT (jsonwebtoken), bcryptjs        |
| Security  | Helmet, CORS, express-rate-limit    |
| Logging   | Morgan                              |
| Compress  | compression (gzip)                  |

---

## ✅ What's Been Implemented

| Requirement | Status |
|------------|--------|
| User registration & login | ✅ |
| JWT authentication | ✅ |
| Protected API endpoints | ✅ |
| User-scoped task ownership | ✅ |
| Full task CRUD | ✅ |
| Task fields (title, description, status, priority, due date) | ✅ |
| Status options (To Do, In Progress, Done) | ✅ |
| Priority options (Low, Medium, High) | ✅ |
| Search by title | ✅ |
| Filter by status & priority | ✅ |
| URL query params for filters | ✅ |
| Debounced search (300ms) | ✅ |
| Responsive UI (mobile + desktop) | ✅ |
| Loading / error / empty / validation states | ✅ |
| Skeleton loading cards | ✅ |
| Empty state with illustration & CTA | ✅ |
| Toast notifications (Sonner) | ✅ |
| Delete confirmation dialog | ✅ |
| TypeScript (frontend + backend) | ✅ |
| React Query data fetching | ✅ |
| React Hook Form + Zod validation | ✅ |
| Password hashing (bcryptjs) | ✅ |
| Rate limiting on login | ✅ |
| Helmet security headers | ✅ |
| CORS with allow-list | ✅ |
| Request validation (separate validators) | ✅ |
| Custom error classes hierarchy | ✅ |
| Global error handler | ✅ |
| MongoDB indexes | ✅ |
| Compression (gzip) | ✅ |
| Environment variable templates | ✅ |
| Professional README with API docs | ✅ |
| Git commit history | ✅ |

---

## 📝 AI Disclosure

- **AI Assistance**: GitHub Copilot-style tooling was used during development for scaffolding, boilerplate generation, and code completion.
- **Libraries**: All libraries used (React, Express, Mongoose, etc.) are open-source and used as per their licenses.
- **Human Review**: Every line of code has been reviewed and tested by a human developer.

---

## 🐛 Known Issues

- No automated test suite (not implemented — bonus feature)
- No pagination (tasks display in a single list)
- No drag-and-drop task reordering
- No file attachments
- No Docker setup
- No deployment script
