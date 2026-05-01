---
name: k-parent-school-info
description: Use when Korean parents ask for school information, notices, academic calendars, after-school programs, school meals, commute details, or parent-facing school summaries.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent School Info

## What this skill does

대한민국 초·중·고 학부모가 학교 정보를 빠르게 확인하도록 돕는다. 현재는 데모 플레이스홀더이며 학교 기본정보, 공지사항, 학사일정, 방과후, 급식, 통학 관련 확인 절차를 정의한다.

## When to use

- "우리 아이 학교 이번 달 일정 정리해줘"
- "○○초 공지사항 확인해줘"
- "방과후 신청 언제까지야?"
- "전학 전에 학교 정보 비교해줘"

## Workflow

### 1. Collect inputs

- 학교명과 지역
- 아이 학년
- 확인할 정보 유형: 공지, 일정, 방과후, 급식, 통학, 시설, 돌봄
- 날짜 범위

### 2. Resolve the school

학교명이 중복되면 지역, 주소, 교육청, 학교급으로 후보를 좁힌다. 임의로 하나를 고르지 않는다.

### 3. Check current sources

현재 날짜 기준으로 공식/공개 출처를 우선한다.

- 학교 홈페이지 공지사항
- 교육청 학교 정보
- NEIS 공개 데이터
- 방과후·돌봄 신청 안내문

### 4. Produce parent summary

- 핵심 일정
- 마감일
- 준비물
- 신청/문의 링크
- 부모가 확인해야 할 리스크

## Done when

- 학교를 명확히 식별했다.
- 현재 기준으로 확인 가능한 출처를 적었다.
- 일정과 신청 항목을 부모 실행 단위로 정리했다.

## Failure modes

- 같은 이름의 학교가 여러 개 있음
- 공지가 이미지/PDF로만 제공됨
- 가정통신문이 로그인 또는 앱 안에만 있음

## Notes

- 학교 생활기록, 성적, 학생 개인정보는 사용자가 직접 제공한 범위 안에서만 다룬다.
- 신청·취소·결제는 사용자 승인 전 실행하지 않는다.
