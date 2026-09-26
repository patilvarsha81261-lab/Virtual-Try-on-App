# Live Virtual Try-On

A full-stack virtual try-on app with **two modes**:

- 🟢 **Live overlay** — real-time webcam body tracking (MediaPipe Pose, runs
  entirely client-side) with a garment image scaled and rotated onto your
  torso every frame. Free, fast, no external API needed.
- 🤖 **AI photo try-on** — take or upload one photo, pick a garment, and a
  diffusion model (IDM-VTON, run server-side via the Replicate API) generates
  a photorealistic image of you wearing it. ~10-20s per render, a few cents
  per call, **non-commercial use only** per the model's license.

![tech](https://img.shields.io/badge/node-18%2B-339933?logo=node.js&logoColor=white)
![tech](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=black)
![tech](https://img.shields.io/badge/vite-5-646CFF?logo=vite&logoColor=white)
![tech](https://img.shields.io/badge/express-4-000000?logo=express&logoColor=white)

## Demo

_Add a screenshot or GIF here once you've deployed it — e.g._
`![demo](docs/demo.gif)`

## Tech stack

| Layer     | Tech                                                         |
|-----------|---------------------------------------------------------------|
| Frontend  | React 18, Vite, `@mediapipe/tasks-vision` (pose detection)   |
| Backend   | Node.js, Express, Multer (uploads), Replicate SDK             |
| AI model  | [IDM-VTON](https://replicate.com/cuuupid/idm-vton) via Replicate |
| Storage   | Flat JSON file for the garment catalog (swap for a DB later)  |

## Project structure

```
virtual-tryon-app/
├── backend/
│   ├── server.js               Express entry point
│   ├── routes/
│   │   ├── garments.routes.js  Garment catalog CRUD
│   │   └── tryon.routes.js     POST /api/tryon -> Replicate
│   ├── services/replicate.service.js
│   ├── middleware/upload.js    Multer config for garment uploads
│   ├── data/garments.json      Seed catalog
│   └── uploads/                Garment PNG/JPG assets (git-ignored)
├── frontend/
│   └── src/
│       ├── App.jsx             Mode toggle (live / photo)
│       ├── config.js           API_BASE for dev vs. deployed
│       ├── components/
│       │   ├── WebcamView.jsx  Live overlay canvas + draw loop
│       │   ├── PhotoTryOn.jsx  Capture/upload + AI render
│       │   └── GarmentPicker.jsx
│       └── hooks/usePoseDetection.js
└── README.md
```

## Getting started (local development)

**Prerequisites:** Node.js 18+, a webcam, a Chromium-based browser recommended.

```bash
# Backend
cd backend
npm install
cp .env.example .env
# open .env and add your Replicate token (only needed for AI photo try-on):
#   REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
npm start        # runs on http://localhost:4000

# Frontend (in a second terminal)
cd frontend
npm install
npm run dev       # runs on http://localhost:5173, proxies /api to :4000
```

Add at least one transparent-background garment image into `backend/uploads/`
(e.g. `tshirt-black.png`) matching the entries in `backend/data/garments.json`,
or use `POST /api/garments` to add your own.

Get a free Replicate token at https://replicate.com/account/api-tokens — note
that running the model itself requires adding billing/credit on Replicate
(~$0.024 per render); Live overlay mode needs no token at all.

## API reference

| Method | Endpoint            | Description                                              |
|--------|----------------------|------------------------------------------------------------|
| GET    | `/api/health`         | Health check                                              |
| GET    | `/api/garments`       | List garments (optional `?category=top`)                  |
| GET    | `/api/garments/:id`   | Get one garment                                            |
| POST   | `/api/garments`       | Add a garment (`multipart/form-data`: `image`, `name`, `category`, ratios) |
| DELETE | `/api/garments/:id`   | Remove a garment                                            |
| POST   | `/api/tryon`          | AI photo try-on (`multipart/form-data`: `humanImage` + `garmentId` or `garmentImage`) → `{ resultUrl }` |

## Deployment

Deploy the backend and frontend as two separate services, both free-tier:

1. **Push to GitHub** — `.gitignore` already excludes `.env` and `node_modules`.
2. **Backend → [Render](https://render.com)**: New Web Service → pick your repo
   → Root Directory `backend` → Build Command `npm install` → Start Command
   `npm start` → add env var `REPLICATE_API_TOKEN`. Render gives you a URL
   like `https://your-app.onrender.com`.
3. **Frontend → [Vercel](https://vercel.com)**: New Project → pick your repo →
   Root Directory `frontend` → add env var `VITE_API_BASE_URL` set to your
   Render URL (no trailing slash) → Deploy.
4. Open your Vercel URL — HTTPS is automatic there, which browsers require
   for camera access outside `localhost`.

Render's free tier sleeps after inactivity (~30-50s cold start on first
request); fine for demos, not for production traffic.

## Known limitations

- Live overlay tracks torso landmarks only — sleeves/arms don't bend with
  movement.
- AI photo try-on is non-commercial-use only (IDM-VTON's license) and isn't
  real-time.
- No auth, saved history, or checkout flow yet.
- Garment assets must be pre-cut PNGs/JPGs; no background-removal pipeline
  included.

## License

This project's own code has no license restriction stated — add one (MIT is
a common default) if you plan to share it publicly. The **IDM-VTON model**
itself is CC BY-NC-SA 4.0 (non-commercial only) — see
https://replicate.com/cuuupid/idm-vton for details.
