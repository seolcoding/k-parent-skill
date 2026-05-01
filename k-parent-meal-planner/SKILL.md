---
name: k-parent-meal-planner
description: Use when Korean parents ask for child meal planning, school lunch lookup, kindergarten meal checks, allergy-aware menu summaries, or weekly meal ideas.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Meal Planner

## What this skill does

대한민국 부모가 아이의 식단을 확인하거나 계획할 때 쓴다. 현재는 데모 플레이스홀더이며, 학교 급식·유치원 식단·가정 식단 후보를 한 화면에서 판단하기 좋게 정리하는 워크플로우를 정의한다.

## When to use

- "이번 주 아이 식단 정리해줘"
- "오늘 급식 뭐야?"
- "알레르기 피해서 저녁 메뉴 추천해줘"
- "유치원 식단이랑 집밥 겹치지 않게 짜줘"

## Workflow

### 1. Collect inputs

확인할 값을 짧게 모은다.

- 아이 나이 또는 학년
- 지역, 학교명 또는 유치원명
- 날짜 범위
- 알레르기, 못 먹는 음식, 선호 음식
- 집밥 추천까지 필요한지 여부

### 2. Resolve school and fetch official data

Today Brief P0에서는 구현 패키지가 있으면 아래 순서로 처리한다.

- `k-parent-source-neis.resolveSchool`로 학교명, 지역, 학교급을 NEIS 코드로 확정한다.
- `k-parent-source-neis.getMeals`로 날짜별 급식 데이터를 조회한다.
- `k-parent-source-neis.getSchedule`로 같은 날짜의 학사일정을 조회한다.
- `k-parent-brief.composeTodayBrief`로 급식, 알레르기, 일정, 출처를 부모용 JSON으로 합친다.

실제 답변에서는 현재 날짜 기준으로 공식/공개 출처를 확인한다.

- 학교 급식은 NEIS 흐름을 우선 검토한다.
- 유치원 식단은 기관 공지, 알림장, 홈페이지, 지역 교육청 공개 자료를 확인한다.
- 출처가 불명확하면 "확인된 식단"과 "추천 식단"을 분리한다.

### 3. Handle missing, ambiguous, and stale data

- 학교 후보가 여러 개면 임의 선택하지 말고 후보 이름, 주소, 교육청을 제시해 확인을 요청한다.
- 방학, 공휴일, 재량휴업일, 미등록 데이터로 급식이 없으면 `not_found` 상태와 함께 "확인된 급식 없음"으로 답한다.
- API 키가 없거나 상류가 실패하면 `missing_config` 또는 `upstream_error`를 숨기지 말고 대체 확인 경로를 안내한다.
- 출처 freshness가 `stale` 또는 `unknown`이면 최신 확인 필요 경고를 함께 출력한다.

### 4. Summarize for parents

부모가 바로 쓸 수 있게 아래 형식으로 정리한다.

- 날짜별 메뉴
- 알레르기·주의 재료
- 집에서 보완하면 좋은 음식
- 준비물 또는 도시락 필요 여부

## Done when

- 날짜 범위와 대상 아이 조건을 반영했다.
- 확인된 식단과 추천 식단을 구분했다.
- 출처와 확인 기준일을 함께 적었다.

## Failure modes

- 기관 식단표가 비공개이거나 로그인 뒤에 있음
- 학교·유치원명이 중복됨
- 급식 데이터가 방학, 재량휴업일, 공휴일로 비어 있음

## Notes

- 아이 알레르기 정보는 저장하지 않는다.
- 건강·의학 판단처럼 말하지 말고, 필요하면 보호자와 의료진 확인을 권한다.
- 캘린더 등록, 신청, 구매, 결제는 `k-parent-core` guardrail에 따라 부모 확인 전 실행하지 않는다.
