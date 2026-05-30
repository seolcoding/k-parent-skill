---
name: k-parent-school-doc-capture
description: 가정통신문·알림장 사진을 읽어 일정·준비물·마감을 뽑아 캘린더 후보로 만들고 사용자 검토를 받는다. OCR은 모델이 수행하고 파싱은 doc-extract가 담당한다. "가정통신문 정리", "알림장 사진 읽어줘", "안내문에서 일정 뽑아줘" 같은 요청에 사용.
license: MIT
metadata:
  category: parenting
  locale: ko-KR
  phase: demo
---

# k-parent-school-doc-capture

가정통신문/알림장 사진을 일정·준비물·마감 목록으로 바꾸는 도우미.

## 핵심 동작

- **OCR은 모델이 수행한다.** 이미지에서 텍스트를 읽어내는 일은 이 스킬을
  실행하는 모델의 비전 능력으로 처리하고, 그 결과 텍스트를 파서에 넘긴다.
- `k-parent-doc-extract` 패키지로 파싱한다.
  - `extractEvents(text)` -> `[{ date, title, raw }]`
  - `extractSupplies(text)` -> 준비물 목록
  - `extractDeadlines(text)` -> `[{ label, date }]`
- 추출된 일정을 `k-parent-calendar`의 `calendarCandidate`로 변환하고
  `dedupeCandidates`로 중복 제거한다.

## 중복 사진 처리

- 같은 안내문을 여러 장 찍거나 같은 일정이 여러 번 나오는 경우,
  `calendarCandidate`의 `id = sha256(title|date|location)` 기준으로
  `dedupeCandidates`가 자동으로 합친다. 사진 단위가 아니라 후보 해시 단위로
  중복을 제거한다.

## 가드레일

- 생성되는 캘린더 후보는 모두 `requiresConfirmation: true`, `executable: false`
  (`calendar_write`). 자동으로 캘린더에 쓰지 않는다.
- 추출 결과는 항상 사용자 검토 단계를 거친다(날짜/장소/준비물 오인식 가능성).
- 아동 개인정보를 후보나 로그에 저장하지 않는다.

## 전형적 흐름

1. 사용자가 안내문 사진 제공 -> 모델이 텍스트로 변환.
2. `extractEvents` / `extractSupplies` / `extractDeadlines`로 파싱.
3. 일정을 `calendarCandidate`로 변환, `dedupeCandidates`로 정리.
4. 사용자에게 후보 + 준비물/마감 요약을 보여주고 확인.
5. 확인 후 `toICS` 내보내기 또는 사용자가 직접 등록.

## Done when

- 핵심 정보가 일정/준비물/마감으로 구조화되었다.
- 중복 사진/일정이 후보 해시 기준으로 합쳐졌다.
- 쓰기 작업은 사용자 확인 전 실행되지 않았다.
