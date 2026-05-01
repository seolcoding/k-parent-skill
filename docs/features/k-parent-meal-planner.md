# 식단 플레이스홀더

`k-parent-meal-planner`는 대한민국 부모가 아이 식단을 확인하고 계획할 때 쓰는 데모 스킬이다.

## 현재 범위

- 학교 급식 또는 유치원 식단 확인 흐름 정의
- 알레르기와 선호 음식을 반영한 요약 형식 정의
- 확인된 식단과 추천 식단을 분리

## 다음 구현 후보

- `packages/k-parent-source-neis`의 학교 resolver, 급식 조회, 알레르기 파서 사용
- `packages/k-parent-brief`의 Today Brief composer로 부모용 요약 생성
- 유치원 식단 공개 페이지 패턴 수집
- 주간 식단 요약 템플릿 추가

## Today Brief P0 구현

구현 패키지가 설치된 환경에서는 아래 순서를 따른다.

1. 학교명과 지역을 `resolveSchool`로 NEIS 코드에 매핑한다.
2. `getMeals`로 해당 날짜의 `mealServiceDietInfo`를 조회한다.
3. `getSchedule`로 같은 날짜의 `SchoolSchedule`을 조회한다.
4. `composeTodayBrief`로 `summary`, `warnings`, `todayTasks`, `calendarCandidates`, `sources`를 만든다.

학교 후보가 여러 개면 자동 선택하지 않는다. 급식이 없거나 출처가 오래되었으면 부모에게 상태를 그대로 보여준다.
