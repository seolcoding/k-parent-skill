---
name: k-parent-schedule-manager
description: Use when managing child schedules, family calendars, reminders, school events, academy classes, deadlines, travel plans, and confirm-before-write calendar workflows for Korean parents.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Schedule Manager

## What this skill does

자녀 스케줄, 가족 캘린더, 학교/학원 일정, 행사, 여행 계획, 준비물 리마인더를 통합 관리하는 절차를 정의한다.

## When to use

- "자녀 스케줄 관리해줘"
- "이번 주 일정 정리해줘"
- "캘린더에 넣을 후보 만들어줘"
- "준비물 리마인더 잡아줘"

## Workflow

### 1. Normalize schedule item

- child
- title
- starts_at/ends_at
- place
- source
- required materials
- deadline
- confidence
- needs_confirmation

### 2. Detect conflicts

학교, 학원, 가족 일정, 여행, 신청 마감이 겹치는지 확인한다.

### 3. Confirm before write

캘린더와 알림은 후보를 먼저 만들고 사용자 승인 뒤에 쓴다.

## Done when

- 일정 후보가 자녀별로 분리되어 있다.
- 출처와 신뢰도가 표시된다.
- 쓰기 작업은 확인 전 실행되지 않았다.
