---
name: k-parent-school-doc-capture
description: Use when Korean parents want to photograph or upload school notices, OCR documents, save extracted text, identify dates/deadlines/materials, and manage calendar or reminder candidates.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# K-Parent School Doc Capture

## What this skill does

학교 안내문, 가정통신문, 알림장, PDF, 앱 캡처 사진을 OCR/추출해 저장하고 일정·준비물·신청 마감·회신 필요 항목을 부모가 확인할 수 있는 캘린더 후보로 바꾸는 데모 스킬이다.

## When to use

- "학교 안내문 사진 찍으면 저장하고 캘린더에 넣어줘"
- "가정통신문에서 준비물하고 날짜 뽑아줘"
- "이 안내문 OCR해서 마감일 관리해줘"
- "사진 속 학교 행사 일정을 캘린더 후보로 만들어줘"

## Workflow

### 1. Ingest original document

원본을 먼저 보존한다.

- 사진
- PDF
- 앱 스크린샷
- 이메일/메신저 첨부
- 사용자가 붙여 넣은 텍스트

원본 파일은 사용자 로컬 저장소에 두고, 저장소에는 커밋하지 않는다.

### 2. Extract text

OCR 또는 문서 파서를 사용해 텍스트를 추출한다. 신뢰도가 낮거나 표/도장/작은 글씨가 있는 영역은 review-needed로 표시한다.

### 3. Normalize parent tasks

추출 결과를 부모 실행 항목으로 바꾼다.

- 행사 일정
- 신청/회신 마감
- 준비물
- 비용
- 장소
- 대상 학년/반
- 문의처
- 제출 방식

### 4. Create proposed records

자동 등록하지 않고 후보를 만든다.

- calendar event 후보
- reminder 후보
- checklist 후보
- application task 후보

### 5. Confirm before calendar write

사용자가 확인한 항목만 캘린더나 리마인더에 쓴다. 애매한 날짜, 아이별 대상, 장소, 반복 여부는 반드시 확인한다.

## Done when

- 원본 문서, OCR 텍스트, 구조화 JSON이 연결되어 있다.
- 날짜, 마감일, 준비물, 신청 항목이 분리되어 있다.
- 캘린더/리마인더 후보와 확인 필요 항목이 표시되어 있다.

## Failure modes

- 사진 흔들림, 그림자, 접힌 종이 때문에 OCR 신뢰도가 낮음
- 날짜가 상대 표현으로 쓰임
- 여러 아이 또는 여러 반 대상 안내가 섞여 있음
- 표 안의 작은 글씨나 QR 코드에 핵심 정보가 있음

## Notes

- 학교 문서와 아이 정보는 민감할 수 있으므로 기본 저장 위치는 사용자 로컬이다.
- 캘린더 등록, 알림 생성, 신청 제출은 명시 승인 후 진행한다.
