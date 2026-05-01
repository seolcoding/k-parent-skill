---
name: k-parent-application-helper
description: Use when Korean parents ask for help with child-related applications, childcare, after-school, vouchers, experience programs, public benefits, deadlines, or required documents.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Application Helper

## What this skill does

아이 관련 각종 신청을 놓치지 않게 돕는 부모용 스킬이다. 현재는 데모 플레이스홀더이며 돌봄, 방과후, 체험, 바우처, 지자체 지원사업의 대상 조건, 준비물, 마감일을 정리하는 절차를 정의한다.

## When to use

- "초등 돌봄 신청 준비물 알려줘"
- "방과후 신청 마감 언제야?"
- "아이 체험 프로그램 신청 도와줘"
- "우리 지역 양육 지원 신청할 거 정리해줘"

## Workflow

### 1. Collect inputs

- 신청 종류
- 지역과 기관
- 아이 나이 또는 학년
- 보호자 자격 조건
- 신청 마감일을 이미 알고 있는지 여부

### 2. Verify official application page

현재 기준으로 공식 접수처를 확인한다. 정부24, 복지로, 교육청, 학교, 지자체, 기관 접수 페이지를 우선한다.

### 3. Build application checklist

- 대상 조건
- 신청 기간
- 필요 서류
- 본인인증/로그인 필요 여부
- 제출 방식
- 결과 발표일
- 문의처

### 4. Stop before irreversible action

로그인, 개인정보 입력, 제출, 결제, 취소는 사용자에게 명시적으로 확인받기 전 진행하지 않는다.

## Done when

- 공식 접수처와 확인일을 적었다.
- 준비물과 마감일을 체크리스트로 정리했다.
- 사용자가 다음에 누를 버튼이나 준비할 서류를 알 수 있다.

## Failure modes

- 접수 페이지가 로그인 뒤에 있음
- 지역별 조건이 다름
- 마감일이 공지 본문, 첨부 PDF, 신청 페이지에 다르게 표시됨

## Notes

- 신청 단계에서는 개인정보 최소 입력 원칙을 따른다.
- 불확실한 자격 조건은 단정하지 않고 문의처 확인 항목으로 남긴다.
