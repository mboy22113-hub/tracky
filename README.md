# Trackey — Subscription Intelligence

A clean, high-performance subscription tracking and portfolio optimization application powered by a FastAPI/SQLite backend architecture, connected to a polished, pixel-perfect frontend interface.

## Architecture

```
trackey/
│
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── main.js
│   │   ├── screens/
│   │   │   ├── home.js
│   │   │   ├── subscriptions.js
│   │   │   ├── subscriptionDetail.js
│   │   │   ├── insights.js
│   │   │   ├── optimize.js
│   │   │   └── profile.js
│   │   ├── components/
│   │   │   ├── subscriptionCard.js
│   │   │   ├── modal.js
│   │   │   ├── bottomNav.js
│   │   │   ├── movieCard.js
│   │   │   ├── comparisonCard.js
│   │   │   └── aiAssistant.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── data/
│   │   │   └── mockData.js
│   │   └── styles/
│   │       ├── base.css
│   │       ├── components.css
│   │       ├── screens.css
│   │       └── responsive.css
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routers/
│   │   ├── users.py
│   │   ├── subscriptions.py
│   │   ├── insights.py
│   │   ├── optimizer.py
│   │   ├── recommendations.py
│   │   ├── movies.py
│   │   ├── wishlist.py
│   │   ├── comparisons.py
│   │   └── assistant.py
│   ├── services/
│   │   ├── optimizer_service.py
│   │   ├── recommendation_service.py
│   │   ├── comparison_service.py
│   │   ├── movie_service.py
│   │   └── ai_service.py
│   ├── requirements.txt
│   └── .env
│
└── server.ts
```

## REST API Endpoints

- `GET /api/profile` — Fetch active user profile and personalization settings
- `PUT /api/profile` — Update user preferences, budget, and notification rules
- `GET /api/subscriptions` — List all active subscriptions (supports `?category=movies|music|games|others`)
- `POST /api/subscriptions` — Create and track a new subscription
- `GET /api/subscriptions/:id` — Get detailed subscription metrics, usage days, and recommendations
- `PUT /api/subscriptions/:id` — Update subscription details (price, autopay, renewal date)
- `DELETE /api/subscriptions/:id` — Remove subscription from tracker
- `GET /api/insights` — Retrieve spending analytics, category breakdowns, and 6-month trends
- `POST /api/optimizer` — Compute Knapsack budget portfolio allocation and subscription reduction recommendations
- `GET /api/recommendations` — Smart future subscription recommendations and OTT content fit
- `GET /api/movies/upcoming` — Upcoming OTT releases matching user genre interests
- `GET /api/wishlist` — Fetch saved watchlist items
- `POST /api/wishlist` — Add upcoming release to wishlist
- `DELETE /api/wishlist/:id` — Remove release from wishlist
- `POST /api/comparison/ott` — Compare top OTT streaming platforms side-by-side
- `POST /api/comparison/services` — Universal comparison between two services
- `POST /api/assistant/chat` — Personal Subscription AI Advisor (Answer + Reason + Action)

## Deploying to Vercel

Trackey is pre-configured for 1-click zero-config deployment on Vercel:

1. **Push or Export to GitHub**:
   - Push this repository to your GitHub account (or use the export button in AI Studio).
2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"** → **"Import Git Repository"**.
   - Vercel will automatically detect `vercel.json`, build the frontend with `vite build` into `dist`, and route all `/api/*` endpoints to the serverless function in `api/index.ts`.
3. **Set Environment Variables (Optional)**:
   - In your Vercel project settings, under **Environment Variables**, add:
     - `OPENAI_API_KEY` (if you want live OpenAI completions for the Assistant & Optimizer; fallback heuristic responses are already bundled).
4. **Deploy**:
   - Click **Deploy**!
