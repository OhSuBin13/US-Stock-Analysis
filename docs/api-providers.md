# API Providers

## Polygon

Primary use:

- Stock search.
- Price bars for charts.
- Optional WebSocket or flat-file ingestion later.

Server-only environment variable:

```text
POLYGON_API_KEY
```

## Financial Modeling Prep

Primary use:

- Company profile.
- Financial statements.
- Peer candidates.
- News and ratios in later phases.

Server-only environment variable:

```text
FMP_API_KEY
```

## Finnhub

Optional fallback provider for:

- Company profile.
- Financial data.
- News.

Server-only environment variable:

```text
FINNHUB_API_KEY
```

## Provider Rules

- Never pass provider responses directly to UI components.
- Normalize all data through internal TypeScript types.
- Cache search and chart responses.
- Persist source dates for analysis traceability.

