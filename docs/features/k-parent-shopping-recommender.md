# 쇼핑 추천 플레이스홀더

`k-parent-shopping-recommender`는 학교 준비물, 학원 교재, 체험 준비물, 육아용품, 영양 보완 상품을 구매 후보로 정리하고 쿠팡 어필리에이트 링크를 선택적으로 제공하는 데모 스킬이다.

## 현재 범위

- 학교문서 OCR, 학원 알림, 놀이/행사 준비물, 영양 메모에서 구매 필요 항목을 추출
- 상품 후보를 가격, 배송일, 재고, 리뷰, 대체품 기준으로 정리
- 쿠팡 어필리에이트 링크를 제공할 때 제휴/광고 고지를 표시
- 자동 구매, 장바구니 담기, 결제는 하지 않음

## 추천 레코드 후보

```json
{
  "need_source": "school_doc|academy_notice|play_event|nutrition|manual",
  "item_name": "색연필 12색",
  "required": true,
  "quantity": 1,
  "needed_by": "2026-05-08",
  "constraints": ["초등 저학년 사용", "KC 인증 확인"],
  "candidates": [
    {
      "title": "예시 색연필 12색",
      "price": 5900,
      "delivery_estimate": "2026-05-03",
      "affiliate": true,
      "affiliate_network": "coupang_partners",
      "needs_disclosure": true
    }
  ],
  "needs_confirmation": true
}
```

## 수익모델 원칙

- 쿠팡 파트너스 링크를 기본 제휴 모델로 둔다.
- 링크 제공 전 제휴/광고 고지를 명확히 한다.
- 구매 링크는 사용자가 구매 후보나 링크를 요청한 뒤 제공한다.
- 추천 근거는 상품 적합성, 배송, 가격, 안전/연령 적합성 중심으로 설명한다.
- 비제휴 대안, 오프라인 구매, 중고 구매가 합리적이면 함께 제시한다.

## 다음 구현 후보

- 쿠팡 파트너스 링크 생성 설정
- 준비물 리스트 → 상품 검색어 normalization
- 상품 후보 비교 스키마
- 가격/배송/재고 캐시
