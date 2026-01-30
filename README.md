# Flipr Placement - Assignment MVP

This repository contains a minimal full-stack implementation (MVP) for the Flipr placement task.

Structure:

- `backend/` — Express API (saves data to `backend/data/*.json`, serves uploaded images from `backend/uploads`)
- `frontend/` — Vite + React app (Landing + Admin UI)

Run locally

1. Install backend dependencies and start server:

```powershell
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000` by default. You can override the port with `PORT` env var.

2. Install frontend dependencies and start dev server:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend dev URL shown by Vite (usually `http://localhost:5173`).

Notes

- The backend supports an optional MongoDB integration: if you provide `MONGODB_URI` as an environment variable, the server will store data in MongoDB collections instead of local JSON files.
- To use MongoDB Atlas, set `MONGODB_URI` before starting the backend (example below).
- Image uploads are stored in `backend/uploads/` and served statically.
- Admin panel allows adding projects and clients (image upload), and viewing contacts/subscribers.

Next steps you can ask me to implement:

- Additional enhancements already implemented in this branch:
- `MONGODB_URI` optional support (use Atlas or other MongoDB)
- Client-side image cropping in admin via `react-cropper` (crops to 450x350 before upload)
- UI and form validation improvements
- Authentication for admin routes
- UI polish to match reference images

Example `MONGODB_URI` usage (PowerShell):

```powershell
cd backend
$env:MONGODB_URI='your-mongodb-connection-string'
npm install
npm run dev
```
