# AirWise — Apne Parivaar Ka Smog Saathi

Frontend aur backend **alag folders** mein hain:

```
hackthoan/
  frontend/   # Vite + React + Tailwind (:5173)
  backend/    # Express + Gemini + Open-Meteo (:3001)
```

## Setup

```bash
# root se
cp backend/.env.example backend/.env
# backend/.env mein GEMINI_API_KEY=... set karo

npm run install:all
```

## Run (alag-alag)

**Terminal 1 — backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```

Ya root se dono ek saath:
```bash
npm run dev
```

- UI: http://localhost:5173 (Vite proxies `/api` → `:3001`)
- API: http://localhost:3001/api/health

## Demo flow (~1 min)

1. Profile → **Load Delhi family**
2. Home → AQI check
3. Generate today’s plan (Gemini)
4. Impact → metro / windows / purifier toggles
5. Community → Green Park Society score
