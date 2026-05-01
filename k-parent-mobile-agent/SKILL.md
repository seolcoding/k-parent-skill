---
name: k-parent-mobile-agent
description: Use when designing or operating a server-deployed mobile parent agent that normal users can access from a phone for child schedules, school data, recommendations, reminders, and agentic parent workflows.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Mobile Agent

## What this skill does

일반 사용자가 모바일에서 접속해 자녀 일정, 학교/학원 정보, 추천, 리마인더를 에이전틱하게 사용할 수 있는 서버 배포형 제품 표면을 정의한다.

## When to use

- "모바일에서 부모가 바로 쓰게 하고 싶어"
- "일반 사용자도 에이전트처럼 쓸 수 있게 해줘"
- "오늘 자녀 일정과 챙길 것을 보여줘"
- "주말 갈 곳 추천하고 캘린더에 넣어줘"

## Workflow

### 1. Model the parent session

- 보호자 계정
- 자녀 프로필
- 학교, 학년, 학원, 지역
- 가족 캘린더 연결 여부
- 알림 선호

### 2. Show the mobile home

첫 화면은 설명보다 실행 가능한 정보를 보여준다.

- 오늘 자녀 일정
- 학교 시간표와 공지
- 학원 일정/숙제
- 마감 임박 신청/준비물
- 지역 행사/체험 추천
- 에이전틱 명령 입력창

### 3. Keep actions confirm-first

캘린더 쓰기, 신청, 예약, 메시지 전송, 구매는 후보를 먼저 만들고 사용자 확인 후 실행한다.

## Done when

- 모바일 사용자가 오늘 할 일을 이해할 수 있다.
- 데이터 출처와 갱신 시각이 보인다.
- 에이전트가 제안한 쓰기 작업은 확인 전 실행되지 않는다.

## Notes

- 서버 배포와 일반 사용자 접근성을 제품 코어로 둔다.
- 로컬 개발자 스킬만으로 끝내지 않는다.
