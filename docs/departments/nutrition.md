# Nutrition Department

영양 디파트먼트는 학교 급식, 유치원 식단, 알레르기, 집밥 보완, 도시락 준비를 다룬다.

## Skills

- `k-parent-meal-planner`
- `k-parent-knowledge-helper`

## Shared patterns

- 확인된 급식/식단과 추천 식단을 분리한다.
- 알레르기와 못 먹는 음식은 우선 필터로 다룬다.
- NEIS 급식 메뉴의 괄호 속 알레르기 번호는 deterministic parser로 분리하고 공식 알레르기 코드표와 매핑한다.
- 칼로리, 원산지, 영양정보는 추천 근거로 쓰되 의학적 판단으로 단정하지 않는다.
- 건강·의학 판단처럼 단정하지 않고 보호자 확인 항목으로 남긴다.

## Next candidates

- NEIS 급식 재사용
- NEIS 급식 알레르기/칼로리/영양정보 parser
- 유치원 식단 공개 페이지 패턴 수집
- 주간 식단 보완 추천
