# Analysis Policy

The service is an informational stock analysis product, not an investment adviser.

## Required Behavior

- Every generated section must be grounded in stored source data.
- Every analysis record must store the data date and evidence list.
- Missing or weak source data must be shown as insufficient data.
- Outputs must avoid personalized or directional advice.

## Blocked Language

Generation and validation should block language that can be read as a recommendation:

- buy
- sell
- hold
- target price
- undervalued
- overvalued
- should invest
- personalized recommendation

## Missing Data Rule

If a section cannot be supported by current source data, show:

```text
Confirmable data is insufficient for <section>.
```

