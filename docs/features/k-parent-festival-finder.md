# k-parent-festival-finder

날짜·지역 기준으로 축제/행사를 찾아 아이 동반 가족 관점에서 정리해 추천하는 스킬.

## 목적

- 한국관광공사 TourAPI `searchFestival`로 진행 중/예정 축제를 검색하고 가족 적합도를 정리한다.
- 조회·추천만 수행하고 예매/구매는 승인 후 공식 사이트로 핸드오프한다.

## 사용 패키지

| 패키지 | 함수 | 출력 |
| --- | --- | --- |
| `k-parent-source-tourapi` | `searchFestival({ eventStartDate, eventEndDate, areaCode, sigunguCode })` | `{ contentId, title, addr, startDate, endDate, image, mapx, mapy, tel, areaCode }` |

`/searchFestival2` 엔드포인트. `eventStartDate`는 `YYYYMMDD` 필수.

## 환경변수

- `KSKILL_TOURAPI_KEY` — data.go.kr serviceKey. 누락 시 `status: missing_config`.

## 데이터 계약

- 봉투 `response.body.items.item` — 배열/단일 객체 모두 처리(`extractItems`).
- 날짜 `YYYYMMDD` → `YYYY-MM-DD`(`startDate`/`endDate`).
- `areaCode`는 TourAPI 지역코드(예: 1=서울), 시군구는 `sigunguCode`.
- 각 결과는 `source.freshness` 포함(기본 maxAge 24h).

## 가족 적합도 로직 (스킬 레이어)

- 제목/주소/카테고리의 "어린이/가족/체험" 키워드로 적합도 **추정**(단정 금지).
- 현재 날짜와 기간 비교 → 진행중/예정/종료 표시.
- 비용/입장료는 데이터에 없으면 "확인 필요(공식)".

## 출력 항목

- 축제명, 기간(정규화), 주소, 좌표/지도, 연락처, 대표 이미지, 가족 적합도(추정), freshness.

## 가드레일

- 조회·추천 전용. 예매/티켓 구매/신청은 `normalizeActionCandidate` 후보로만 제시 후 명시적 승인 → 공식 사이트 핸드오프.
- 아동 개인정보 입력·저장 금지.

## 픽스처 갱신

```
KSKILL_TOURAPI_KEY=... node packages/k-parent-source-tourapi/scripts/refresh-fixtures.mjs
```
