# 학교 정보 플레이스홀더

`k-parent-school-info`는 학교 공지, 일정, 방과후, 급식, 통학 정보를 부모 관점으로 정리하는 데모 스킬이다.

## 현재 범위

- 학교명·지역으로 학교를 식별
- 공지, 일정, 신청 마감, 준비물을 부모 실행 단위로 요약
- 공식 출처와 확인일을 표시

## 다음 구현 후보

- `packages/k-parent-source-neis`의 NEIS 학교 기본정보 resolver
- 학교 홈페이지 공지 PDF/이미지 추출
- 방과후·돌봄 신청 마감일 구조화

## Today Brief P0 구현

첫 공식 데이터 구현은 NEIS 기반이다.

- 학교 검색: `resolveSchool`
- 급식 조회: `getMeals`
- 학사일정 조회: `getSchedule`
- 부모 요약: `composeTodayBrief`

응답은 학교 후보, 급식, 일정, 캘린더 후보, 출처 freshness를 분리해서 보여준다. 캘린더 쓰기, 신청, 예약, 결제는 사용자 확인 전 실행하지 않는다.
