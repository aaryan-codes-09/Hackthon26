<<<<<<< HEAD
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
=======
# 🗺 RepoNav — Repository Architecture Navigator
> **PS3 · DevClash 2026 · MERN Stack**

An AI-powered developer tool that ingests a GitHub repository URL and generates an interactive architecture graph, AI file summaries, module classification, and a recommended onboarding path — all in seconds.

---

## 🛠 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 18, Framer Motion, Lucide React |
| Backend   | Node.js, Express 4            |
| Database  | MongoDB + Mongoose            |
| AI        | Anthropic Claude (Sonnet)     |
| Fonts     | Outfit + JetBrains Mono       |

---

## ⚡ Quick Setup in VS Code

### Prerequisites
Make sure these are installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (Community) → https://www.mongodb.com/try/download/community
- **VS Code** → https://code.visualstudio.com
- **Anthropic API Key** → https://console.anthropic.com

---

### Step 1 — Open project in VS Code
```bash
# Unzip the downloaded file, then:
cd reponav
code .
```

---

### Step 2 — Install dependencies

Open the **VS Code Terminal** (`Ctrl+`` ` or Terminal → New Terminal):

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

Or run all at once:
```bash
npm run install:all
```

---

### Step 3 — Configure environment variables

```bash
# In the server/ folder, copy the example file:
cp server/.env.example server/.env
```

Now open `server/.env` in VS Code and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/reponav
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx   ← your key here
GITHUB_TOKEN=                                ← optional, for higher rate limits
NODE_ENV=development
```

> **Get your Anthropic API key:** https://console.anthropic.com/settings/keys

---

### Step 4 — Start MongoDB

**On macOS/Linux:**
```bash
mongod --dbpath /usr/local/var/mongodb
# or if installed as a service:
brew services start mongodb-community
```

**On Windows:**
```bash
# Start as a service (run as Administrator):
net start MongoDB
# or directly:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

---

### Step 5 — Run the app

**Option A: Run both with one command (recommended)**
```bash
# From the root reponav/ folder:
npm run dev
```
This starts:
- ✅ Express server → http://localhost:5000
- ✅ React app     → http://localhost:3000

**Option B: Run in separate terminals**

Terminal 1 (server):
```bash
cd server
npm run dev
```

Terminal 2 (client):
```bash
cd client
npm start
```

---

### Step 6 — Open in browser

Navigate to **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
reponav/
├── package.json          ← root scripts (dev, install:all)
│
├── server/
│   ├── index.js          ← Express app entry point
│   ├── .env.example      ← copy to .env and fill keys
│   ├── models/
│   │   └── Analysis.js   ← Mongoose schema
│   └── routes/
│       ├── analyze.js    ← POST /api/analyze (calls Claude AI)
│       ├── history.js    ← GET/DELETE /api/history
│       └── query.js      ← POST /api/query (NL questions)
│
└── client/
    ├── public/
    │   └── index.html    ← HTML shell with Google Fonts
    └── src/
        ├── index.js      ← React entry + Toaster
        ├── App.jsx        ← Router + layout
        ├── index.css      ← CSS variables + global styles
        ├── context/
        │   └── AnalysisContext.jsx  ← Global state
        ├── utils/
        │   └── api.js     ← Axios API calls
        ├── pages/
        │   ├── HomePage.jsx      ← URL input + loading
        │   ├── AnalysisPage.jsx  ← Graph + tabs
        │   └── HistoryPage.jsx   ← MongoDB history list
        └── components/
            ├── Navbar.jsx        ← Top navigation
            ├── DetailPanel.jsx   ← Slide-out file details
            ├── OnboardingTab.jsx ← Ordered reading path
            ├── ModulesTab.jsx    ← Module classification grid
            └── QueryTab.jsx      ← Chat-style AI queries
```

---

## 🔌 API Endpoints

| Method | Path               | Description                        |
|--------|--------------------|------------------------------------|
| GET    | /api/health        | Server health check                |
| POST   | /api/analyze       | Analyze a GitHub repo with AI      |
| GET    | /api/history       | Get last 20 analyses from MongoDB  |
| GET    | /api/history/:id   | Get one full analysis by ID        |
| DELETE | /api/history/:id   | Delete an analysis                 |
| POST   | /api/query         | Ask a natural-language question    |

---

## 🎨 Color Palette

| Token        | Hex       | Role                      |
|--------------|-----------|---------------------------|
| `--cyan`     | `#00d9ff` | Entry points, primary CTAs |
| `--violet`   | `#8b5cf6` | Core logic, AI queries     |
| `--amber`    | `#f59e0b` | High-impact ⚡, utilities  |
| `--red`      | `#f43f5e` | External integrations      |
| `--green`    | `#10d9a0` | Config, success states     |
| `--bg`       | `#060a0f` | Deep dark background       |

---

## ✅ PS3 Feature Checklist

- [x] GitHub URL input → full architecture analysis
- [x] Interactive dependency graph (drag, zoom, click)
- [x] AI-generated summary per file + overall architecture
- [x] Module classification: Entry / Core / Utility / External / Config
- [x] ⚡ High-impact file detection & highlighting
- [x] Recommended onboarding path (ordered reading list)
- [x] Natural-language queries ("Where is auth handled?")
- [x] MongoDB persistence + history page
- [x] Slide-out detail panel (imports, used-by, category)
- [x] Fully responsive UI

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED 5000` | Start the Express server first |
| `MongoServerError` | Start MongoDB, check MONGO_URI |
| `401 Unauthorized` | Check ANTHROPIC_API_KEY in .env |
| Port 3000 in use | Kill the process or set `PORT=3001` in client |
| Blank graph | Try a well-known repo like `facebook/react` |

---

## 📝 License
MIT — DevClash 2026
>>>>>>> a2c609e4af4958d5b5a932a796def4d23dd2d36e
