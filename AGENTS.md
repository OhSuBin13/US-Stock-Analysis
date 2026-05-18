# Project
Next.js 15 App Router (TypeScript). Main Stack: React, Tailwind CSS, Prisma, PostgresSQL, Redis.

## Project Structure & Module Organization
- src/app/: Pages, layout and route handlers.
- src/app/stocks/[ticker]/: Stock pages.
- src/app/api/: API.
- src/components/: Components.
- src/components/ui/: Components with shadcn-style primitives
- src/lib/: Shared logic.
- src/lib/market-data/: Market data provider.
- src/lib/ai/: AI policy helpers.
- src/lib/db.ts, src/lib/cache.ts, src/lib/env.ts: Infrastructure helpers.
- src/server/jobs/: Batch job that runs on the server..
- prisma/schema.prisma: Prisma schema and managing DB model.
- docs/: Documents, especially analysis policy documents.
- test/: Tets by Vitest.

# Rule
- Do not call the DB directly from anywhere other than src/app/api/. DB access is possible through src/lib/db.ts.
- Do not read or modify .env or .env.local files.
- Attach `user client` only to necessary components. The default is Server Component.
- Do not edit `package-lock.json` directly. Update it only with `npm install`.

# Build and Test (Completion Criteria)
After modifying the code, execute the following in order before saying it is complete:
1. npm run typecheck  # Check TypeScript type errors 
2. npm run lint # Check ESLint warnings
3. npm run test # Check tests
3. npm run build # Check if the production build was successful

## Coding Style & Naming Conventions

Use TypeScript, React function components, and App Router conventions. Match the existing two-space indentation, double quotes, semicolons, and trailing commas. Prefer named exports for shared helpers and components. Use kebab-case filenames, for example `stock-search.tsx` and `analysis-policy.test.ts`. Use PascalCase for React components and camelCase for functions and variables. Use `cn()` from `src/lib/utils.ts` when composing class names.

## Configuration Tips

Keep AI summaries informational and aligned with `docs/analysis-policy.md`; avoid advice terms such as buy, sell, hold, target price, or personalized recommendations.
