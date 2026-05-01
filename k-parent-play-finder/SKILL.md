---
name: k-parent-play-finder
description: Use when Korean parents ask for child-friendly places to play, indoor activities, outdoor outings, kids cafes, museums, libraries, parks, or weekend family plans.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Play Finder

## What this skill does

아이와 갈 만한 놀거리와 체험 장소를 찾는 부모용 스킬이다. 현재는 데모 플레이스홀더이며 실내외 놀이, 키즈카페, 박물관, 도서관, 공원, 체험 공간을 조건별로 정리하는 절차를 정의한다.

## When to use

- "이번 주말 아이랑 갈 곳 찾아줘"
- "비 오는 날 실내 놀거리 추천해줘"
- "초등 저학년 체험할 만한 곳"
- "유모차로 갈 수 있는 곳만 골라줘"

## Workflow

### 1. Collect inputs

- 출발 지역
- 아이 나이
- 날짜와 시간대
- 실내/실외, 예산, 이동수단
- 예약 필요 여부, 주차, 유모차, 식사 가능 여부

### 2. Check current availability

현재 기준으로 영업시간, 휴무, 예약 필요 여부를 확인한다. 날씨 영향을 받는 장소는 한국 기상 상황도 함께 고려한다.

### 3. Rank candidates

부모 판단 기준으로 후보를 정렬한다.

- 이동 난이도
- 아이 연령 적합성
- 비용
- 예약 필요성
- 비상 시 대체 후보

## Done when

- 3개 안팎의 후보와 대체 후보를 제시했다.
- 영업시간, 비용, 예약 링크, 주차/교통을 적었다.
- 확인 기준일을 포함했다.

## Failure modes

- 장소 정보가 블로그 후기 중심이라 최신성이 낮음
- 예약 가능 여부가 실시간으로 바뀜
- 날씨나 행사로 운영이 변동됨

## Notes

- 아이 동선은 과하게 빡빡하게 짜지 않는다.
- 후기는 참고로만 쓰고 공식 운영정보와 분리한다.
