# Vercel Deployment Requirements

Deploy the frontend and backend as two separate Vercel projects.

## 1) Backend project (server folder)

- Root Directory: `server`
- Framework Preset: `Other`
- Install Command: `npm install`
- Build Command: leave empty (or default)
- Output Directory: leave empty
- Node version: 18+

### Required environment variables (server)

- `MONGO_URI` (optional, but required if you want persistent DB instead of in-memory fallback)
- `CLIENT_URL` (set to your deployed frontend URL)
- `ADMIN_ACCESS_KEY` (recommended for admin endpoints)
- `PORT` is optional on Vercel

### Config used

- `server/vercel.json`
- File-based serverless handlers in `server/api/**/*.js`

### API route mapping

- `GET /api/health` -> `server/api/health.js`
- `GET /api/diet` -> `server/api/diet/index.js`
- `GET /api/diet/suggestions` -> `server/api/diet/suggestions.js`
- `GET|POST /api/recipes` -> `server/api/recipes/index.js`
- `GET /api/recipes/:name` -> `server/api/recipes/[name].js`
- `GET /api/recipes/admin/pending` -> `server/api/recipes/admin/pending.js`
- `PATCH /api/recipes/admin/:id/approve` -> `server/api/recipes/admin/[id]/approve.js`
- `DELETE /api/recipes/admin/:id` -> `server/api/recipes/admin/[id].js`
- `GET|POST /api/subscriptions` -> `server/api/subscriptions/index.js`
- `PATCH|DELETE /api/subscriptions/:id` -> `server/api/subscriptions/[id].js`
- `POST /api/admin/login` -> `server/api/admin/login.js`

## 2) Frontend project (client folder)

- Root Directory: `client`
- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node version: 18+

### Required environment variables (client)

- `VITE_API_BASE_URL` = your backend URL + `/api`
  - Example: `https://your-api-project.vercel.app/api`

### Config used

- `client/vercel.json`

## 3) Deployment order

1. Deploy backend project first.
2. Copy backend URL and set `VITE_API_BASE_URL` in frontend project.
3. Deploy frontend project.
4. Set backend `CLIENT_URL` to frontend URL and redeploy backend once.

## 4) Quick test URLs

- Backend health: `https://<backend-domain>/api/health`
- Frontend app: `https://<frontend-domain>/`
