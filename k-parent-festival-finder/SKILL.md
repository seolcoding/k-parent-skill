---
name: k-parent-festival-finder
description: Use when Korean parents ask for family-friendly festivals, local events, seasonal outings, child-friendly programs, schedules, fees, or reservation links.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Festival Finder

## What this skill does

부모가 아이와 갈 수 있는 축제와 지역 행사를 빠르게 찾도록 돕는다. 현재는 데모 플레이스홀더이며 날짜, 지역, 연령, 비용, 혼잡도 관점으로 축제 정보를 정리하는 절차를 정의한다.

## When to use

- "이번 달 아이랑 갈 축제 찾아줘"
- "부산 근처 가족 축제 추천"
- "무료 체험 있는 행사만 골라줘"
- "유아가 가도 괜찮은 축제 있어?"

## Workflow

### 1. Collect inputs

- 지역과 이동 가능 거리
- 날짜 또는 기간
- 아이 나이
- 무료/유료, 실내/실외, 체험 중심 여부
- 대중교통/자차 여부

### 2. Verify event status

축제 정보는 변동이 잦으므로 현재 기준으로 공식 행사 페이지, 지자체 공지, 주최 기관 공지를 확인한다.

### 3. Summarize decision points

- 행사명
- 기간과 운영 시간
- 대상 연령
- 비용
- 예약 필요 여부
- 이동과 주차
- 비 오면 가능한지

## Done when

- 후보별 공식 링크와 확인일을 적었다.
- 아이 연령에 맞지 않는 행사는 제외하거나 이유를 표시했다.
- 마감·예약·준비물을 분리해 보여 줬다.

## Failure modes

- 행사 일정이 변경되었으나 포털 정보가 늦게 갱신됨
- 프로그램별 예약 마감이 다름
- 현장 혼잡도는 공식 정보만으로 판단하기 어려움

## Notes

- "아이 동반 가능"과 "아이에게 적합"을 구분한다.
- 무료 행사라도 예약, 체험 재료비, 주차비를 따로 확인한다.
