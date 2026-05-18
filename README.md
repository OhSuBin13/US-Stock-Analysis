# US Stock Analysis Web Service

Initial project scaffold based on `Plan to build a US stock analysis web service.docx`.

## Product Scope

This service provides an informational analysis workflow for US stocks:

- Search by ticker or company name.
- View a stock dashboard with price history, company context, financial snapshots, peer comparison, risks, and watch metrics.
- Save watchlist entries after authentication is added.
- Generate AI-assisted summaries only from stored source data and source dates.
- Avoid investment advice language such as buy, sell, target price, or personalized recommendations.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives.
- Backend: Next.js Route Handlers.
- Database: PostgreSQL through Prisma.
- Cache and jobs: Redis plus scheduled/background refresh jobs.
- Market data: Polygon for price/chart data, Financial Modeling Prep for profiles, financials, news, and peer data. Finnhub can be added as a fallback provider.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run dev
```

The app falls back to mock market data when API keys are not configured.

## Key Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run prisma:migrate
npm run jobs:refresh-analysis
```

## Directory Map

```text
src/app/                 Next.js pages and route handlers
src/components/          UI and feature components
src/lib/market-data/     Provider abstraction and API adapters
src/lib/ai/              Analysis input, policy, and generation helpers
src/server/jobs/         Background refresh job entry points
prisma/                  PostgreSQL schema
docs/                    Architecture notes and operating policies
tests/                   Focused unit tests
```

