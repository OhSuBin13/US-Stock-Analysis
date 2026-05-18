# Implementation Plan

## Phase 1: Scaffold

- Create the Next.js App Router structure.
- Add shared UI primitives and routing.
- Add PostgreSQL schema with Prisma.
- Add environment variable structure.
- Keep API keys server-side only.

## Phase 2: Market Data Layer

- Implement a `MarketDataProvider` interface.
- Keep external API payloads out of the UI.
- Normalize prices, profiles, financials, and peer candidates into internal models.
- Cache stock search and chart data.
- Refresh financial and analysis data through scheduled jobs.

## Phase 3: Analysis Generation

- Build an analysis input packet from normalized source data.
- Validate generated JSON before storage.
- Store data date, evidence, missing-data list, and section output.
- Block advice-like language before publishing.

## Phase 4: User Experience

- Put chart and informational summary at the top of the stock page.
- Use lower sections for company analysis, peer context, and watch metrics.
- Prefer same sector/industry and market-cap range for peer candidates.

## Phase 5: Accounts and Watchlist

- Add email or OAuth authentication.
- Save watchlist entries per user.
- Show current price, daily change, latest analysis time, and risk summary.

