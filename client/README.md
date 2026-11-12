# Book Exchange Client

Next.js (App Router) frontend for the Book Exchange API.

```bash
cp .env.example .env.local
npm install
npm run dev
```

The app runs on http://localhost:3000 and expects the API at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`). The API must allow the client origin through its `CORS_ORIGIN` setting.

The JWT is stored in the `access_token` cookie so `middleware.ts` can redirect unauthenticated visitors away from `/me/*` and `/admin/*` before any page renders.

