# 학교 정보 (P0)

`k-parent-school-info`는 학교 기본정보, 학사일정, 시간표, 급식을 NEIS 공개 데이터로 확정해 부모 관점으로 정리하는 스킬이다.

## 현재 범위

- 학교명·지역으로 교육청 코드(`ATPT_OFCDC_SC_CODE`)와 학교 코드(`SD_SCHUL_CODE`)를 확정
- 급식, 학사일정, 시간표를 조회하고 출처 freshness를 표시
- 공지, 일정, 신청 마감, 준비물을 부모 실행 단위로 요약
- 신청 마감과 추천 나들이를 Today Brief에 합성

## 결정형 구현 (deterministic)

NEIS 기반 흐름은 `packages/k-parent-source-neis`와 `packages/k-parent-brief`로 구현되어 있다.

1. `resolveSchool` — 교육청 + 학교 코드 확정 (동명 학교는 `ambiguous`로 후보 반환, 자동 선택 금지)
2. `getMeals` — 날짜별 급식 (`mealServiceDietInfo`)
3. `getSchedule` — 기간 학사일정 (`SchoolSchedule`)
4. `getTimetable` — 시간표 (`schoolLevel`/`dataset`으로 `elsTimetable`/`misTimetable`/`hisTimetable` 선택)
5. `composeTodayBrief` — `summary`, `warnings`, `todayTasks`, `timetable`, `upcomingDeadlines`, `suggestedOutings`, `calendarCandidates`, `sources` 생성

## 데이터 계약

- 성공 `{ ok: true, status: "ok", ... }`, 실패 `{ ok: false, status, message }`
- `status` 값: `ambiguous` / `not_found` / `stale` / `upstream_error` / `missing_config`
- 정규화 항목에는 항상 `source`(`sourceName`, `sourceUrl`, `fetchedAt`, `freshness.status`)가 붙는다

## 환경 변수

- `KEDU_INFO_KEY` — NEIS open API 인증키. 미설정 시 `missing_config`.

## 가드레일

캘린더 쓰기, 신청 제출, 예약, 결제, 로그인, 아이 개인정보 입력은 사용자 확인 전 실행하지 않는다. `calendarCandidates`는 `requiresConfirmation: true`, `executable: false`로 표시된다.

## 다음 구현 후보

- 학교 홈페이지 공지 PDF/이미지 추출
- 방과후·돌봄 신청 마감일 구조화 수집
