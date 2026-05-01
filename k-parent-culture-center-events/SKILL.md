---
name: k-parent-culture-center-events
description: Use when Korean parents ask for culture center classes, library programs, department store classes, mart events, public lectures, or child activity registrations.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Culture Center Events

## What this skill does

문화센터, 도서관, 마트, 백화점, 공공기관의 아이 대상 강좌와 행사를 찾는 부모용 스킬이다. 현재는 데모 플레이스홀더이며 모집 상태와 신청 마감 중심으로 정리하는 절차를 정의한다.

## When to use

- "근처 문화센터 아이 강좌 찾아줘"
- "도서관 어린이 행사 신청할 만한 거 있어?"
- "주말 원데이 클래스 찾아줘"
- "6세 미술 수업 모집 중인 곳"

## Workflow

### 1. Collect inputs

- 지역
- 아이 나이
- 원하는 분야: 미술, 과학, 체육, 독서, 음악, 요리 등
- 요일과 시간대
- 예산과 이동수단

### 2. Search current programs

현재 모집 중인지 확인한다. 우선순위는 공식 접수 페이지, 기관 공지, 지자체 교육 포털 순서다.

### 3. Normalize programs

각 후보를 같은 형식으로 맞춘다.

- 기관명
- 강좌명
- 대상 연령
- 일정
- 수강료와 재료비
- 접수 기간
- 신청 링크
- 대기/마감 상태

## Done when

- 모집 중, 예정, 마감 상태를 구분했다.
- 신청 링크와 마감일을 표시했다.
- 조건에 맞는 후보가 없으면 대체 검색 조건을 제안했다.

## Failure modes

- 백화점/마트 문화센터가 로그인 뒤에 상세를 숨김
- 접수 상태가 실시간으로 바뀜
- 연령 기준이 만 나이/학년 기준으로 섞여 있음

## Notes

- 아이 이름, 생년월일, 연락처 입력은 사용자 승인 전 진행하지 않는다.
- 대기 신청과 결제 단계는 명확히 분리한다.
