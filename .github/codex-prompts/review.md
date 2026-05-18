Please reviewing this repository. Please do not modify the code, and only check it from the perspective below.

## Scope Discovery

1. First check whether a `git diff` exists.
2. If a diff exists, review the changed files first and identify their impact radius before inspecting surrounding code.
3. If no diff exists, review the main project areas in this order:
   - `src/app/`
   - `src/app/api/`
   - `src/components/`
   - `src/lib/`
   - `src/server/jobs/`
   - `prisma/schema.prisma`
   - `docs/analysis-policy.md`
   - `tests/`

## Required Review Checklist

- App Router boundaries: Server Components remain the default, and `"use client"` is only used where necessary.
- Database access: DB calls are not made outside `src/app/api/`; shared DB access still goes through `src/lib/db.ts`.
- API behavior: route handlers validate input, return appropriate status codes, avoid leaking sensitive details, and handle provider or database failures.
- Market data and caching: cache keys, TTLs, fallback behavior, stale data handling, and provider error paths are correct.
- AI analysis policy: summaries stay informational and avoid advice terms such as buy, sell, hold, target price, or personalized recommendations.
- Data correctness: ticker handling, numeric conversions, dates, currency, null values, and financial calculations are safe.
- Prisma and persistence: schema changes have compatible usage, migrations are considered when needed, and query patterns avoid avoidable load.
- React UI behavior: loading, empty, error, and responsive states are covered without hydration or accessibility regressions.
- Security: secrets are not exposed, user-controlled input is sanitized or validated, and authentication or authorization assumptions are explicit.
- Tests: changed behavior has focused tests, important edge cases are covered, and existing tests still match the intended contract.
- Build risk: TypeScript, lint, test, and production build risks introduced by the reviewed change are identified.

## Result Format

List only actionable findings. Each finding must use this exact format:

```text
파일경로:줄번호 - 문제 설명
```

The problem description must explain why this is a real risk and what test is needed to catch or prevent it.

If there are no findings, output only:

```text
이상 없음
```
