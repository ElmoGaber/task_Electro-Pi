# TaskFlow — MERN SaaS with Kanban, AI Assistant & i18n

A production-grade task management SaaS built with **MongoDB, Express.js 5, React 19, and Node.js** — deployable on **Vercel** from a single GitHub repository. Features a kanban board with drag & drop, real-time collaboration, AI-powered suggestions, RTL/LTR i18n (Arabic/English), and 10+ unique dashboard pages.

---

## Architecture

```
taskflow/
├── api/
│   └── index.js              # Vercel serverless entry (imports backend/dist/app)
├── backend/
│   └── src/
│       ├── config/db.ts       # MongoDB connection (cached singleton for serverless)
│       ├── controllers/       # Auth, Task, Upload, Assistant
│       ├── errors/            # AppError, ValidationError, UnauthorizedError, NotFoundError
│       ├── middleware/        # Auth (JWT), CSRF, Rate limiters, Error handler, Validation
│       ├── models/            # User, Task (Mongoose schemas)
│       ├── routes/            # /api/auth, /api/tasks, /api/upload, /api/assistant
│       ├── utils/             # Constants (task statuses/priorities), Seed data
│       ├── validators/        # express-validator chains
│       ├── app.ts             # Express application setup
│       └── server.ts          # Local development server (Socket.IO + DB connect)
├── frontend/
│   └── src/
│       ├── api/client.ts      # Axios instance (baseURL from VITE_API_URL)
│       ├── components/        # 25+ reusable components
│       ├── context/           # AuthContext, ThemeContext
│       ├── hooks/             # React Query hooks, useSocket, useDebounce, useAssistant
│       ├── i18n/              # en.json, ar.json, i18n configuration
│       ├── lib/               # Constants, fakeData.ts (500+ mock entries)
│       ├── pages/             # 13 pages (Overview, Projects, Tasks, Kanban, etc.)
│       ├── types/             # TypeScript interfaces
│       ├── App.tsx            # Router with AnimatePresence transitions
│       └── index.css          # Full design system (dark/light, responsive)
├── vercel.json                # Vercel deployment configuration
├── package.json               # Root scripts
└── .env.example               # Environment variable template
```

---

## Features

### Core
- **Kanban Board** — 4 columns (To Do, In Progress, Editing, Done) with drag & drop via @dnd-kit
- **Task CRUD** — Full create/read/update/delete with image upload and voice recording
- **Authentication** — JWT-based with bcrypt password hashing, protected routes
- **Real-time** — Socket.IO presence, typing indicators (development only)
- **AI Assistant** — Rule-based suggestions (overdue tasks, completion %, backlog tips)

### Dashboard Pages (10+)
| Page | Description |
|------|-------------|
| **Overview** | Stats grid, project timeline, activity feed, today's tasks, team, events |
| **Projects** | Grid/kanban/table views, filters, search, sort, pagination, create modal |
| **Tasks** | Original CRUD grid with kanban, drag & drop, filters, export (CSV/JSON/PDF) |
| **Kanban** | Full drag & drop board with 4 status columns |
| **Activity** | Grouped timeline (This Hour/Today/Older), type filters, JSON export |
| **Messages** | Full chat UI with conversation sidebar and send input |
| **Members** | Grid/list views, role filters, department summary, invite modal |
| **Calendar** | Month grid with dot indicators, date selection, event side panel, create modal |
| **Analytics** | Recharts bar + pie charts with stat cards |
| **Settings** | 6 tabs — General, Notifications, Security, Appearance (i18n, font size, compact), Billing, API |
| **Notifications** | Type filters, bulk selection, mark read/unread, batch delete |

### UX
- AnimatePresence page transitions
- ⌘K global search overlay
- Responsive sidebar with hamburger toggle (<900px)
- Loading skeletons, empty states, error states
- Dark/light theme with max-contrast accessibility
- RTL/LTR i18n (Arabic/English)

### Security
- Helmet security headers
- CORS with allow-list
- Rate limiting (login + API)
- CSRF double-submit cookie pattern
- Request validation (express-validator)

---

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd taskflow

# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### Environment Variables

**`backend/.env`:**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=your-secure-secret
CLIENT_URL=http://localhost:5173
```

**`frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Start

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && npm run dev
```

The backend auto-seeds a demo user and admin on first run:
- **Demo**: `demo@taskflow.dev` / `demo123456`
- **Admin**: `admin@taskflow.dev` / `admin123456`

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 2. Import into Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| Framework | **Other** |
| Root Directory | Repository root |
| Build Command | (auto from vercel.json) |
| Output Directory | (auto from vercel.json) |

### 3. Add Environment Variables

| Variable | Value |
|----------|-------|
| `MONGO_URI` | `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskmanager` |
| `JWT_SECRET` | Your secure random secret |
| `CLIENT_URL` | `https://your-app.vercel.app` |
| `NODE_ENV` | `production` |
| `VITE_API_URL` | `/api` |

### 4. Deploy

Click **Deploy**. No manual code edits after deployment.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No (rate-limited) | Login |
| GET | `/api/tasks` | JWT | List tasks (filters: search, status, priority) |
| POST | `/api/tasks` | JWT | Create task |
| PUT | `/api/tasks/:id` | JWT | Update task |
| DELETE | `/api/tasks/:id` | JWT | Delete task |
| GET | `/api/tasks/all` | Admin | List all tasks |
| POST | `/api/upload` | JWT | Upload file |
| GET | `/api/assistant/suggestions` | JWT | AI suggestions |

---

## Production Notes

- **Socket.IO** is disabled in production (serverless doesn't support persistent WebSocket connections). The app works fully without it — all state is managed via React Query.
- **File uploads** use `/tmp` in production. Files are transient and will be lost on function cold starts. For production, integrate with S3/Cloudinary.
- **Rate limiting** is in-memory and resets on function cold starts. For production, use an external store (Redis) with `express-rate-limit`.
- **MongoDB connection** is cached globally across serverless warm starts via a singleton pattern.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Production | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `CLIENT_URL` | Yes | Frontend origin for CORS |
| `NODE_ENV` | Yes | `development` or `production` |
| `VITE_API_URL` | Frontend | API base URL (use `/api` in production) |
| `PORT` | No | Backend port (default 5000) |

---

## AI Disclosure

- **AI Assistance**: AI tooling was used during development for scaffolding, boilerplate generation, and code completion.
- **Libraries**: All libraries used are open-source and used as per their licenses.
- **Human Review**: Every line of code has been reviewed and tested by a human developer.
