src/lib/market-data/index.ts:55 - 실 provider가 빈 배열을 반환하면 mock fallback 데이터로 대체되어 FMP profile/financials와 mock price bars가 섞일 수 있습니다; FMP만 설정된 환경에서 실제 티커 조회 시 mock 차트가 반환되지 않는지 검증하는 provider composition 테스트가 필요합니다.

src/lib/ai/generate-analysis.ts:77 - `revenue || operatingMargin || freeCashFlow`와 각 삼항식이 0 값을 결측처럼 처리해 매출 0, 마진 0%, FCF 0 같은 유효한 재무값을 누락합니다; 0 값을 가진 financial snapshot이 “insufficient”로 렌더링되지 않는 단위 테스트가 필요합니다.

src/lib/cache.ts:29 - Redis에 손상된 JSON이 들어 있으면 `JSON.parse` 예외가 그대로 API 500으로 이어져 provider fallback도 실행되지 않습니다; invalid cached payload를 cache miss처럼 처리하거나 안전한 오류로 격리하는 테스트가 필요합니다.

src/app/api/stocks/[ticker]/route.ts:14 - provider 호출이 `Promise.all`로 직접 실행되고 실패 처리가 없어 외부 API 장애가 주식 상세 API 전체 500으로 노출됩니다; provider 메서드 하나가 reject될 때 적절한 상태 코드와 안전한 응답을 반환하는 route handler 테스트가 필요합니다.

src/app/api/search/route.ts:7 - 검색어 길이와 문자 집합 제한이 없어 매우 긴 입력이 그대로 cache key와 외부 provider 요청에 사용되어 quota/latency 문제를 만들 수 있습니다; 과도한 길이와 허용하지 않는 입력을 400으로 거부하는 API 테스트가 필요합니다.

src/components/search/stock-search.tsx:26 - 검색 요청 실패나 non-JSON 응답을 사용자에게 표시하지 않고 결과도 유지될 수 있어 API 장애 시 UI가 조용히 실패합니다; `/api/search`가 500 또는 invalid JSON을 반환할 때 오류 상태와 결과 초기화가 동작하는 컴포넌트 테스트가 필요합니다.
