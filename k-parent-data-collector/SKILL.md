---
name: k-parent-data-collector
description: Use when collecting or crawling real Korean parent data sources including school data, timetables, education offices, lifelong education, festivals, events, culture centers, trends, and public local pages.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Data Collector

## What this skill does

학교데이터, 시간표, 교육청, 평생교육, 축제, 행사, 문화센터, 지역 트렌드 같은 실제 데이터 소스를 수집하고 provenance와 freshness를 관리하는 절차를 정의한다.

## When to use

- "실제 학교데이터가 필요해"
- "시간표 수집해야 해"
- "축제, 행사, 평생교육 크롤링하자"
- "지역 트렌드 데이터 모아줘"

## Workflow

### 1. Register source

- source name
- source type: API, HTML, PDF, RSS, calendar, app screenshot
- region and department
- crawl frequency
- legal/robots/terms notes

### 2. Collect and normalize

- raw payload
- normalized records
- source URL
- fetched_at
- valid_from/valid_until when available
- confidence and parse warnings

### 3. Expose freshness

사용자 답변과 제품 UI에 데이터 갱신 시각과 오래됨 여부를 표시한다.

## Done when

- 수집 출처와 수집 시각이 남아 있다.
- 중복과 stale 상태를 판단할 수 있다.
- 모바일 에이전트가 신뢰 가능한 최신성 상태를 보여줄 수 있다.

## Notes

- 크롤링 실패를 숨기지 않는다.
- 불안정한 비공식 페이지는 fallback과 수동 확인 경로를 둔다.
