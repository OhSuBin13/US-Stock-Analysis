# MVP 작업 보드: US Stock Analysis Web Service

## Summary

현재 저장소 기준으로 MVP 완성을 목표로 작업을 이슈 단위로 나눕니다. 상태 판단은 코드/문서 정적 확인 기준이며, 테스트
실행 결과 기준은 아닙니다.

## Complete

- Next.js App Router 기본 구조 구성: 홈, 종목 상세, watchlist, API route 골격.
- Tailwind/shadcn 스타일 UI primitive 구성: button, input, card, badge, cn() 유틸.
- Prisma 데이터 모델 초안 작성: User, Stock, PriceBar, FinancialSnapshot, CompanyAnalysis, Watchlist.
- 시장 데이터 provider 인터페이스 작성: 검색, 프로필, 가격봉, 재무 스냅샷, peer 후보.
- Mock provider 구현: API 키 없이 AAPL/MSFT/NVDA 대시보드 확인 가능.
- Polygon/FMP provider 1차 구현: 검색, 프로필, 가격봉 또는 재무 일부 정규화.
- AI 분석 정책 기본 구현: 조언성 표현 차단, missing data 메시지.
- 기본 분석 생성 로직 작성: 저장 데이터 기반 deterministic summary 생성.
- 검색 API 캐시 1차 구현: Redis가 있으면 /api/search 결과 캐시.
- 분석 정책 단위 테스트 작성.

## In Progress

- 시장 데이터 통합 완성: Polygon/FMP 역할이 분리되어 있고 일부 메서드는 빈 결과 fallback 상태.
- 종목 상세 대시보드: 차트/요약/분석 섹션은 있으나 peer 비교, 재무 표, source evidence 노출은 부족.
- 분석 생성 파이프라인: 정책 검증은 있으나 DB 저장, JSON schema 검증, source evidence persistence는 미완성.
- background job: refresh entrypoint는 있으나 DB upsert 없이 콘솔 출력 중심.
- watchlist: 페이지와 API placeholder는 있으나 인증/저장/조회는 미구현.
- 캐시 전략: 검색 캐시는 있으나 차트/상세 데이터 캐시와 invalidation 기준은 미완성.

## To Do

- DB persistence MVP: API route에서만 db를 사용해 Stock, PriceBar, FinancialSnapshot, CompanyAnalysis를 upsert하도록
  구현.
- 종목 상세 API 정리: provider 호출 결과를 DB에 저장하고, 화면/API가 저장된 normalized data와 최신 fetch 결과를 일관
  되게 반환하도록 정리.
- 가격/상세 캐시 추가: chart와 stock detail 응답에 TTL 캐시를 적용하고 provider 장애 시 mock 또는 저장 데이터
  fallback 기준을 고정.
- 분석 저장 기능: generateInformationAnalysis() 결과를 CompanyAnalysis에 저장하고 dataAsOf, missingData,
  sourceEvidence를 화면에 표시.
- 분석 정책 강화: forbidden wording 테스트를 늘리고 생성된 모든 문자열 섹션을 저장 전 검증.
- Provider 완성도 개선: Polygon은 가격/검색 중심, FMP는 프로필/재무/peer 중심으로 역할을 명확히 하고 빈 결과
  fallback을 테스트.
- Watchlist MVP: 임시 사용자 또는 인증 도입 전 mock user 정책을 정한 뒤 GET/POST /api/watchlist를 DB 기반으로 연결.
- Watchlist UI 연결: 저장 종목, 현재가, 일일 변화, 최신 분석일, 주요 risk note 표시.
- UX 보강: 종목 상세에 peer comparison, financial snapshot, source date/evidence, insufficient data 상태를 명확히 표
  시.
- Job persistence: jobs:refresh-analysis가 대상 ticker를 갱신하고 DB 저장까지 수행하도록 변경.
- 문서 업데이트: 실제 MVP 동작 방식, provider fallback, Redis/Postgres 필요 조건, 운영 명령을 README/docs에 반영.
- 최종 검증: 코드 변경 후 npm run typecheck, npm run lint, npm run test, npm run build 순서로 통과 확인.

- API 응답은 기존 /api/search, /api/stocks/[ticker], /api/watchlist 경로를 유지합니다.
- CompanyAnalysisDraft는 DB 저장에 필요한 dataAsOf, missingData, sourceEvidence 필드를 계속 포함해야 합니다.
- MarketDataProvider 인터페이스는 유지하고, provider별 빈 결과는 composite fallback 정책으로 처리합니다.
- Watchlist API는 MVP에서 { items, authRequired } placeholder 대신 저장된 item 목록과 생성/삭제 결과를 반환하도록 확
  장합니다.

## Test Plan

- Unit: AI 금지어, missing data 메시지, provider 정규화, fallback 순서.
- API: search cache hit/miss, stock detail 정상/부분 데이터/없는 ticker, watchlist validation.
- DB: stock/price/financial/analysis upsert 중복 방지.
- UI: mock 데이터만 있어도 홈 검색, AAPL 상세, watchlist empty/filled 상태가 렌더링되는지 확인.
- Completion: 모든 코드 변경 후 지정된 4개 명령을 순서대로 실행.

## Assumptions

- MVP 범위는 “실제 저장소 기반 검색/종목 상세/분석 저장/watchlist 기본 동작”까지로 둡니다.
- 인증은 MVP에서 최소 구현 또는 임시 사용자 정책으로 시작할 수 있지만, DB schema는 현재 User/Watchlist 모델을 유지합
  니다.
- .env와 .env.local은 읽거나 수정하지 않습니다.
