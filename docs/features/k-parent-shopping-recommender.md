# k-parent-shopping-recommender

부모를 위한 자녀 준비물/교재/육아용품 쇼핑 추천 스킬이다. 데모 플레이스홀더에서
`k-parent-source-naver` + `k-parent-source-coupang` 어댑터 기반 구현으로 승격되었다.

## 개요

네이버 쇼핑 가격 비교를 핵심으로 두고, 구매 의도가 있을 때 쿠팡 파트너스 제휴 데이터를 보조로
결합한다. 가격/배송/리뷰/재고/대체품을 신뢰 가능한 출처·수집 시각과 함께 정리한다.

## 데이터 소스 / 함수

- `k-parent-source-naver`
  - `fetchShopping({ query, display })` → `title`, `link`, `image`, `lprice`, `hprice`, `mallName`, `productId`, `brand`, `category`
  - `fetchBlog({ query })` → 리뷰/후기 참고 (`title`, `link`, `bloggername`, `postdate`)
  - 환경변수: `KSKILL_NAVER_CLIENT_ID`, `KSKILL_NAVER_CLIENT_SECRET`
- `k-parent-source-coupang`
  - `fetchProducts({ keyword, limit })` → `productName`, `productPrice`, `productImage`, `productUrl`, `isRocket`, `categoryName`, `disclosure`
  - 환경변수: `KSKILL_COUPANG_ACCESS_KEY`, `KSKILL_COUPANG_SECRET_KEY`

## 제휴 고지 (필수)

쿠팡 파트너스 상품/링크를 노출할 때는 반드시 다음 문구를 표시한다:

> 쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 받을 수 있음

이 문구는 `fetchProducts` 결과의 모든 항목 및 상단 `disclosure` 필드에 자동 포함되어 누락을 방지한다.

## 가드레일

- 결제/주문/장바구니/예약/로그인/취소/자녀 개인정보 입력은 사용자 승인 후에만 진행한다.
- 행동 후보는 `k-parent-core`의 `guardActionCandidate({ type })`로 검사하며,
  `purchase`/`payment`/`application` 등 민감 행동은 `executable: false`, `requiresConfirmation: true`로 반환된다.

## 출력 형식

품목별: 가격(최저가/판매처/범위), 배송(로켓배송/배송비/도착 가능성), 리뷰(요약+링크),
재고(확인 가능 시), 대체품(1~2개, 비제휴/오프라인/중고 포함), 출처/수집 시각, 쿠팡 제휴 고지.

## 테스트 / 픽스처

- `node --test packages/k-parent-source-naver/test/` (오프라인)
- `node --test packages/k-parent-source-coupang/test/` (오프라인)
- 픽스처 경로: `packages/k-parent-source-naver/test/fixtures/{shop,blog}.json`,
  `packages/k-parent-source-coupang/test/fixtures/products.json`
- 픽스처 갱신:
  - `KSKILL_NAVER_CLIENT_ID=... KSKILL_NAVER_CLIENT_SECRET=... node packages/k-parent-source-naver/scripts/refresh-fixtures.mjs`
  - `KSKILL_COUPANG_ACCESS_KEY=... KSKILL_COUPANG_SECRET_KEY=... node packages/k-parent-source-coupang/scripts/refresh-fixtures.mjs`

## 상태

`k-parent-source-naver`, `k-parent-source-coupang` 어댑터 기반으로 구현되었다.
