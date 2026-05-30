---
name: k-parent-knowledge-helper
description: 대한민국 부모의 일반 지식·생활 판단 질문에 출처 기반으로 답하는 스킬. 더 구체적인 k-parent 스킬이 다루지 않는 영역을 보조한다. "예방접종 일정 일반적으로 어떻게 돼", "초등 입학 전에 뭘 준비해야 해", 특정 스킬로 분류되지 않는 부모 생활 질문에 사용. 학교·유치원·신청·식단 등 구체 조회는 해당 전용 스킬로 라우팅한다.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent Knowledge Helper

## What this skill does

부모가 묻는 일반적인 지식, 생활 판단, 학교/학원/육아 관련 설명을 출처와 현재성에 유의해 답하는 절차를 정의한다.

## When to use

- "이게 무슨 뜻이야?"
- "초등학교 준비물 기준 알려줘"
- "아이랑 이런 상황이면 어떻게 판단하지?"
- "요즘 부모들이 많이 챙기는 게 뭐야?"

## Workflow

### 1. Classify question risk

- 일반 생활 지식
- 학교/행정 절차
- 건강/의료/심리 고위험
- 법/금융/개인정보 고위험

### 2. Answer with source awareness

현재성이 중요한 내용은 출처와 날짜를 확인한다. 추정, 후기, 공식정보를 분리한다.

### 3. Keep parent action clear

답변은 다음 행동, 확인할 곳, 주의할 점으로 정리한다.

## Done when

- 고위험 영역을 구분했다.
- 현재성이 필요한 정보는 확인 기준을 표시했다.
- 부모가 다음 행동을 알 수 있다.
