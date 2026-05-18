# Data Model

## Stock

Core company identity:

- `ticker`
- `companyName`
- `exchange`
- `sector`
- `industry`
- `marketCap`

## PriceBar

Normalized price history:

- `ticker`
- `interval`
- `timestamp`
- `open`
- `high`
- `low`
- `close`
- `volume`

## FinancialSnapshot

Provider-normalized financial data:

- `ticker`
- `period`
- `revenue`
- `grossMargin`
- `operatingMargin`
- `netIncome`
- `eps`
- `freeCashFlow`
- `debt`
- `cash`
- `source`
- `sourceDate`

## CompanyAnalysis

Generated informational analysis with evidence:

- `ticker`
- `generatedAt`
- `dataAsOf`
- `sourceSnapshotIds`
- `summary`
- `thesis`
- `businessOverview`
- `businessModel`
- `financialAnalysis`
- `growthDrivers`
- `partners`
- `strengths`
- `risks`
- `peers`
- `watchMetrics`
- `missingData`
- `sourceEvidence`

## Watchlist

Per-user saved stock:

- `userId`
- `ticker`
- `createdAt`

