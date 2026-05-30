---
name: k-parent-culture-center-events
description: 문화센터/도서관/지자체 문화 강좌와 체험 프로그램을 지역·연령·기간으로 찾아 안내합니다. 예약·결제는 사용자 승인 전에는 실행하지 않습니다.
---

# 문화센터 이벤트 도우미

## 개요

부모가 자녀와 함께 갈 수 있는 문화 강좌·체험·공연/전시를 한 번에 찾아 줍니다.
서울 공공서비스예약(강좌/체험/시설예약), 도서관 정보, 문화포털 공연전시정보를
모아 지역·연령·기간으로 필터링하고 비용/대상연령/접수기간/예약상태/예약링크를
정리해 안내합니다.

## 사용하는 패키지

- `k-parent-source-seoul` — `fetchReservations(options)`, `parseReservations(payload, options)`,
  `RESERVATION_SERVICES` (`ListPublicReservationCulture` / `ListPublicReservationEducation` /
  `ListPublicReservationSport`). 강좌·체험·시설예약 정보.
- `k-parent-source-library` — `fetchLibraries(options)`, `parseLibraries(payload)`.
  지역(`region`, `dtl_region`) 도서관 위치·연락처·홈페이지.
- `k-parent-source-culture` — `fetchCultureEvents(options)`, `parseCultureEvents(payload)`.
  공연/전시 정보.

## 환경 변수

- `KSKILL_SEOUL_KEY` — 서울 열린데이터광장 인증키
- `KSKILL_LIBRARY_KEY` — 도서관정보나루 인증키
- `KSKILL_CULTURE_KEY` — 문화포털 서비스키

## 흐름

1. 사용자에게 지역, 자녀 연령, 원하는 기간을 확인한다.
2. `fetchReservations`를 세 reservation service에 대해 호출하고
   `fetchCultureEvents`, `fetchLibraries`로 보조 정보를 수집한다.
3. 각 `parse*` 함수로 정규화한다.
4. 지역(`areaName`/`area`), 대상연령(`useTarget`), 기간(`rcptBgnDt`/`rcptEndDt`,
   `startDate`/`endDate`)으로 필터링한다.
5. 비용·대상연령·접수기간·예약상태·예약링크를 표로 정리해 안내한다.

## 데이터 계약 (data contract)

서울 예약(envelope: `payload[SERVICE].row`, `RESULT.CODE`)는 다음 형태로 정규화됩니다.

```json
{
  "items": [
    {
      "institution": { "name": "서울시립미술관", "region": "중구" },
      "svcId": "S240101",
      "svcName": "어린이 도자기 체험",
      "place": "서울시립미술관",
      "areaName": "중구",
      "useTarget": "만 5세 이상",
      "svcStatus": "접수중",
      "rcptBgnDt": "2026-05-01 09:00:00.0",
      "rcptEndDt": "2026-06-30 18:00:00.0",
      "svcUrl": "https://yeyak.seoul.go.kr/...",
      "x": "126.9779",
      "y": "37.5663"
    }
  ],
  "metadata": { "source": "SeoulOpenData", "fetched_at": null },
  "resultCode": "INFO-000"
}
```

공연/전시(envelope: `response.msgBody.perforList`)는 `title`, `place`, `startDate`,
`endDate`, `area`, `genre`, `url`, `image`, `charge`로 정규화됩니다.
도서관(envelope: `response.libs[].lib`)은 `libCode`, `libName`, `address`, `tel`,
`homepage`, `latitude`, `longitude`로 정규화됩니다.

## 신선도 (freshness)

`metadata.fetched_at`을 `k-parent-core`의 `isFresh`로 검사해 오래된 결과는 갱신 후
안내합니다. 접수기간이 지난 항목은 `svcStatus`(예: 접수마감)와 함께 표시합니다.

## 가드레일

예약·결제·로그인·취소는 승인이 필요한 작업입니다. 정보 조회·정리까지만 자동으로
수행하고, 예약 진행/결제는 `k-parent-core`의 `assertApproved`로 사용자 승인을 확인하기
전에는 실행하지 않습니다. 예약링크(`svcUrl`/`url`)는 안내만 합니다.
