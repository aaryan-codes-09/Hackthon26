# RepoNav — Repository Architecture Navigator

> PS3 · DevClash 2026 · MERN Stack + Claude AI

Paste a GitHub URL → get an interactive dependency graph, AI-generated file summaries, and a recommended developer onboarding path. Powered by Claude Sonnet.

## Features

- **Interactive architecture graph** — drag, zoom, click any node
- **AI summaries** — every file explained in plain English by Claude
- **Module classification** — entry points, core logic, utilities, externals, orphans
- **Onboarding path** — ordered reading list for new developers
- **Ask AI** — natural language questions answered with file references
- **Analysis history** — saved in MongoDB, revisit anytime
- **Authentication** — JWT-based register/login + demo mode

## Quick Start

### 1. Clone & install

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

`.env` contents:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/reponav
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=your_random_secret_here
NODE_ENV=development
```

### 3. Run

```bash
# Terminal 1 — backend (port 5000)
cd server && npm run dev

# Terminal 2 — frontend (port 3000)
cd client && npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Without MongoDB

The app works without MongoDB — just set `MONGO_URI` to anything, the server warns but continues. Analysis results are returned without being saved. Use demo login (demo@reponav.dev / demo123) to skip auth.

## Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18, React Router v6     |
| UI         | Framer Motion, Lucide React   |
| Backend    | Express.js, Node.js           |
| Database   | MongoDB + Mongoose            |
| Auth       | JWT + bcryptjs                |
| AI         | Anthropic Claude Sonnet       |
| Graph      | HTML5 Canvas                  |

## API Endpoints

| Method | Path                  | Description              |
|--------|-----------------------|--------------------------|
| POST   | /api/auth/register    | Create account           |
| POST   | /api/auth/login       | Login                    |
| GET    | /api/auth/me          | Get current user         |
| POST   | /api/analyze          | Analyze a GitHub repo    |
| GET    | /api/history          | Get analysis history     |
| GET    | /api/history/:id      | Get single analysis      |
| DELETE | /api/history/:id      | Delete analysis          |
| POST   | /api/query            | Ask AI about a repo      |
| GET    | /api/health           | Server health check      |

## Fix for "Network Error"

The network error was caused by axios using CRA's proxy (`/api`) which fails when servers start in the wrong order. Fixed by pointing axios directly at `http://localhost:5000/api` with a 2-minute timeout.
