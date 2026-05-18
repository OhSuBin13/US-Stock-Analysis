`src/`를 수동 리뷰했습니다. `npm run typecheck`와 직접 `tsc --noEmit --incremental false` 실행은 현재 읽기 전용 정책에서 차단되어, 실제 컴파일러 출력은 확인하지 못했습니다.

**발견 사항**
- High: [src/lib/market-data/index.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/market-data/index.ts:55), [src/lib/market-data/mock-provider.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/market-data/mock-provider.ts:59)  
  실제 provider가 빈 값/null을 주면 mock provider로 fallback됩니다. 이 때문에 존재하지 않는 티커도 mock 가격/재무/peer 데이터를 받을 수 있고, FMP 일부 데이터 + mock 가격처럼 데이터가 섞일 수 있습니다.

- High: [src/lib/market-data/http.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/market-data/http.ts:19), [src/lib/market-data/fmp-provider.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/market-data/fmp-provider.ts:59)  
  외부 API 응답을 `as T`로 바로 캐스팅합니다. FMP/Polygon이 에러 객체나 예상과 다른 shape을 반환하면 `.map`, 배열 destructuring, 필드 접근에서 런타임 오류가 날 수 있습니다.

- Medium: [src/lib/cache.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/cache.ts:28), [src/app/api/search/route.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/app/api/search/route.ts:14)  
  Redis 장애나 깨진 JSON 캐시가 있으면 검색 API가 500으로 실패할 수 있습니다. 캐시는 best-effort로 실패를 삼키는 처리가 필요해 보입니다.

- Medium: [src/components/search/stock-search.tsx](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/components/search/stock-search.tsx:26)  
  `response.ok`와 응답 shape 검증 없이 `payload.results`를 사용합니다. API 오류 응답이면 `results`가 `undefined`로 들어가 다음 렌더에서 `results.length`가 터질 수 있습니다.

- Medium: [src/lib/ai/analysis-policy.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/ai/analysis-policy.ts:1), [src/lib/ai/generate-analysis.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/ai/generate-analysis.ts:106)  
  금지어 필터가 회사명/프로필 원문까지 검사합니다. 예를 들어 “Best Buy” 같은 정상 회사명이 `buy`에 걸려 페이지/API가 실패할 수 있습니다.

- Medium: [src/lib/ai/generate-analysis.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/ai/generate-analysis.ts:68)  
  `latestClose && revenue`, `revenue || operatingMargin || freeCashFlow`처럼 truthy 체크를 써서 `0` 값이 “데이터 없음”으로 처리됩니다. `value != null` 계열 체크가 더 안전합니다.

- Medium: [src/lib/ai/generate-analysis.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/ai/generate-analysis.ts:118), [src/app/stocks/[ticker]/page.tsx](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/app/stocks/[ticker]/page.tsx:52)  
  외부 source date가 잘못된 문자열이면 `new Date(...)`가 Invalid Date가 되고, 이후 `toISOString()`에서 RangeError가 날 수 있습니다.

- Low/Medium: [src/components/search/stock-search.tsx](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/components/search/stock-search.tsx:35), [src/lib/market-data/fmp-provider.ts](C:/Users/subin/stock-service/us-stock-analysis-web-service/src/lib/market-data/fmp-provider.ts:69)  
  티커를 URL path에 넣을 때 validation/encoding이 없습니다. 특수문자 티커나 비정상 입력이 라우팅/API URL을 깨뜨릴 수 있습니다. 티커 regex 검증과 `encodeURIComponent` 적용이 안전합니다.
