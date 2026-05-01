---
name: k-parent-shopping-recommender
description: Use when Korean parents ask for product recommendations, school supplies, academy books, toys, childcare items, nutrition-related purchases, price comparison, stock checks, or Coupang affiliate purchase links.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Shopping Recommender

## What this skill does

부모가 학교·학원·놀이·영양 문맥에서 필요한 물건을 구매 후보로 정리하도록 돕는다. 쿠팡 어필리에이트를 수익모델로 사용할 수 있지만, 제휴/광고 고지와 사용자 선택을 먼저 둔다.

## When to use

- "이 준비물 어디서 사면 돼?"
- "학교 안내문 준비물 쿠팡 링크로 찾아줘"
- "학원 교재 구매 후보 정리해줘"
- "아이 장난감 추천해줘"
- "알레르기 없는 간식 후보 찾아줘"

## Workflow

### 1. Confirm purchase context

먼저 구매 필요가 실제로 있는지 확인한다.

- 출처: 학교문서, 학원 알림, 행사 준비물, 식단/영양 보완, 사용자의 직접 요청
- 필요한 수량
- 마감일 또는 필요한 날짜
- 아이 나이/학년
- 예산
- 배송 가능 기한
- 피해야 할 성분/재질/브랜드

### 2. Normalize item requirements

상품명만 바로 검색하지 말고 요구사항을 구조화한다.

- required/optional
- size/spec
- age suitability
- safety constraints
- deadline fit
- reusable/used/offline alternative

### 3. Present non-affiliate recommendation first

상품 후보를 보여줄 때는 구매 판단 신호를 먼저 설명한다.

- 관련성
- 가격대
- 배송 가능성
- 리뷰/평점
- 재고
- 대체품
- 오프라인 또는 중고 가능성

### 4. Disclose affiliate status

쿠팡 어필리에이트 링크를 제공하기 전, 제휴 링크임을 명확히 알린다.

예시 문구:

> 아래 쿠팡 링크를 통해 구매하면 운영자가 일정 수수료를 받을 수 있습니다. 상품 가격에는 영향이 없을 수 있지만, 최종 가격과 배송 조건은 쿠팡에서 다시 확인하세요.

### 5. Provide purchase links only after user intent

사용자가 구매 링크, 쿠팡 링크, 상품 후보 비교를 원할 때만 링크를 제공한다. 자동 구매, 장바구니 담기, 결제는 하지 않는다.

## Done when

- 구매 필요와 출처를 확인했다.
- 상품 후보를 요구사항 기준으로 설명했다.
- 제휴 링크가 있으면 광고/제휴 고지를 표시했다.
- 결제나 장바구니 같은 side effect를 실행하지 않았다.

## Failure modes

- 학교 준비물이 구체적이지 않음
- 교재 ISBN/판본이 불명확함
- 배송일이 마감일보다 늦을 수 있음
- 건강/영양/알레르기 관련 상품이 의학적 판단처럼 보일 수 있음

## Notes

- 제휴 수익보다 부모에게 맞는 상품 적합성을 우선한다.
- 아이 안전, 연령 적합성, 알레르기 정보는 단정하지 말고 보호자 확인 항목으로 남긴다.
