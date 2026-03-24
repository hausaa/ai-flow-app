# ◈ AIFlow — Visual AI Prompt Builder

A full-stack MERN application that visualizes AI prompt/response flows using React Flow. Type a prompt, run it through an AI model, see the response — all connected by a live animated edge on a canvas.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-6c63ff?style=flat-square) ![React Flow](https://img.shields.io/badge/React%20Flow-v12-43e97b?style=flat-square) ![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-ff6584?style=flat-square)

---

## ✦ Features

- **React Flow canvas** with two connected nodes — Input & Output
- **AI responses** via OpenRouter (Gemini 2.0 Flash Lite — free tier)
- **MongoDB persistence** — save prompt/response pairs
- **History panel** — view all saved flows
- **Dark industrial UI** — Space Mono + Syne typography, animated edges

---

## ✦ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, React Flow (@xyflow/react) |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (Mongoose ODM)              |
| AI        | OpenRouter API (Gemini Flash Lite)  |
| Deploy    | Render.com                          |

---

## ✦ Prerequisites

- Node.js v18+
- npm v9+
- MongoDB (local install **or** [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)
- [OpenRouter API key](https://openrouter.ai/) (free)

---

## ✦ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ai-flow-app.git
cd ai-flow-app
```

### 2. Install all dependencies

```bash
npm run install:all
# Or manually:
# cd backend && npm install
# cd ../frontend && npm install
```

### 3. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
MONGODB_URI=mongodb://localhost:27017/aiflow
SITE_URL=http://localhost:3000
PORT=5000
```

**Getting your OpenRouter key:**
1. Sign up at [openrouter.ai](https://openrouter.ai/)
2. Go to **Keys** → **Create Key**
3. Paste the key into `.env`

**MongoDB options:**
- **Local:** Install [MongoDB Community](https://www.mongodb.com/try/download/community) and use `mongodb://localhost:27017/aiflow`
- **Atlas (cloud, free):** Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas), get the connection string, and paste it in

### 4. Run the app

```bash
# From root — runs both backend and frontend concurrently
npm run dev
```

Or start them separately:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm start
```

The app opens at **http://localhost:3000**  
The API runs at **http://localhost:5000**

---

## ✦ How to Use

1. **Type** a prompt in the purple **Prompt Input** node on the left
2. Click **▶ Run Flow** in the toolbar
3. Watch the edge animate as the AI thinks
4. See the response in the green **AI Response** node on the right
5. Click **↓ Save** to persist the pair to MongoDB
6. Click **≡ History** to view all saved flows

---

## ✦ API Endpoints

| Method | Route            | Description                     |
|--------|------------------|---------------------------------|
| GET    | `/api/health`    | Health check                    |
| POST   | `/api/ask-ai`    | Send prompt → get AI response   |
| POST   | `/api/save-flow` | Save prompt + response to DB    |
| GET    | `/api/flows`     | Retrieve last 20 saved flows    |

### POST `/api/ask-ai`

```json
// Request
{ "prompt": "What is the capital of France?" }

// Response
{ "response": "The capital of France is Paris." }
```

### POST `/api/save-flow`

```json
// Request
{ "prompt": "...", "response": "..." }

// Response
{ "success": true, "message": "Flow saved!", "id": "..." }
```

---

## ✦ Deploy to Render.com

This repo includes a `render.yaml` for one-click deployment.

### Steps

1. Push the repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
3. Connect your GitHub repo
4. Render detects `render.yaml` automatically
5. Set environment variables in the Render dashboard:
   - **Backend service:** `OPENROUTER_API_KEY`, `MONGODB_URI`, `SITE_URL` (your frontend URL)
   - **Frontend service:** `REACT_APP_API_URL` (your backend URL, e.g. `https://ai-flow-backend.onrender.com`)

### Manual deploy (alternative)

**Backend:**
- New Web Service → Root: `backend` → Build: `npm install` → Start: `npm start`
- Add env vars

**Frontend:**
- New Static Site → Root: `frontend` → Build: `npm install && npm run build` → Publish: `./build`
- Add `REACT_APP_API_URL` env var pointing to your backend URL
- Add rewrite rule: `/*` → `/index.html`

---

## ✦ Project Structure

```
ai-flow-app/
├── backend/
│   ├── server.js          # Express server, routes, MongoDB, OpenRouter
│   ├── package.json
│   ├── .env.example       # Template — copy to .env
│   └── .env               # Your secrets (gitignored)
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── InputNode.jsx   # React Flow node — prompt textarea
│       │   ├── ResultNode.jsx  # React Flow node — AI response display
│       │   └── Toolbar.jsx     # Run/Save/History controls
│       ├── App.jsx             # Main flow canvas + state logic
│       ├── index.js
│       └── index.css           # Global styles, CSS variables, animations
│
├── render.yaml            # Render.com deploy config
├── package.json           # Root scripts (dev, install:all)
├── .gitignore
└── README.md
```

---

## ✦ Environment Variables Reference

### Backend (`backend/.env`)

| Variable            | Required | Description                              |
|---------------------|----------|------------------------------------------|
| `OPENROUTER_API_KEY`| ✅        | Your OpenRouter API key                  |
| `MONGODB_URI`       | ✅        | MongoDB connection string                |
| `SITE_URL`          | ⚪        | Your site URL (sent to OpenRouter)       |
| `PORT`              | ⚪        | Server port (default: 5000)              |

### Frontend (`frontend/.env` — production only)

| Variable            | Required | Description                              |
|---------------------|----------|------------------------------------------|
| `REACT_APP_API_URL` | ⚪        | Backend URL (empty = uses proxy in dev)  |

---

## ✦ License

MIT
