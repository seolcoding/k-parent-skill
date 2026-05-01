---
name: k-parent-academy-connector
description: Use when Korean parents ask to connect academy or hagwon apps, APIs, messages, schedules, homework, attendance, makeup classes, billing notices, or academy announcements.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Academy Connector

## What this skill does

학원 관련 정보를 부모 일정 관리에 연결하는 데모 스킬이다. 학원 앱/API, 문자, 카카오 알림, PDF 안내문, 사진 캡처에서 일정·숙제·출결·보강·상담·결제 마감 정보를 읽어 공통 형식으로 정리한다.

## When to use

- "학원 일정도 같이 관리되면 좋겠어"
- "학원 앱 알림을 캘린더로 정리해줘"
- "보강 일정이랑 숙제 마감 모아줘"
- "학원 결제일, 상담일, 시험일을 놓치지 않게 해줘"

## Workflow

### 1. Collect integration surface

먼저 어떤 경로로 학원 정보가 들어오는지 확인한다.

- 학원 전용 앱 또는 웹
- 공개 API 또는 제휴 API
- 문자, 카카오 알림, 이메일
- PDF/사진 안내문
- 사용자가 직접 붙여 넣은 텍스트

### 2. Keep read and write separate

읽기 작업과 쓰기 작업을 분리한다.

- 읽기: 일정, 숙제, 출결, 공지, 결제 예정, 셔틀 정보 확인
- 쓰기: 상담 신청, 결석 신청, 보강 신청, 결제, 메시지 전송

쓰기 작업은 사용자 승인 전 실행하지 않는다.

### 3. Normalize academy notice

학원 정보를 같은 필드로 맞춘다.

- 학원명
- 과목 또는 반
- 아이 또는 학년 대상
- 일정 시작/종료
- 숙제/준비물
- 출결 또는 보강 상태
- 결제/신청 마감
- 원문 출처
- 캘린더 후보 여부

### 4. Propose calendar and reminders

캘린더에 바로 쓰지 말고 후보를 만든다.

- 수업/보강/시험/상담은 calendar event 후보
- 숙제/준비물/결제는 reminder 또는 checklist 후보
- 불확실한 날짜는 review-needed로 표시

## Done when

- 학원 정보 출처와 권한 범위를 구분했다.
- 일정, 숙제, 출결, 결제, 상담 정보를 같은 형식으로 정리했다.
- 캘린더/리마인더 후보와 사용자 확인 필요 항목을 분리했다.

## Failure modes

- 학원 앱이 로그인과 2FA를 요구함
- 공식 API가 없고 화면 캡처/OCR만 가능함
- 날짜가 "다음 주", "이번 금요일"처럼 상대 표현으로 제공됨
- 형제자매 일정이 섞여 아이별 분리가 필요함

## Notes

- 학원 계정 정보와 아이 개인정보를 저장소에 저장하지 않는다.
- 결제, 상담 신청, 결석/보강 신청은 side effect이므로 명시 승인 전 실행하지 않는다.
