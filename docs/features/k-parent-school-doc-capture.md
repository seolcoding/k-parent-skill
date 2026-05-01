# 학교문서 스캔 플레이스홀더

`k-parent-school-doc-capture`는 학교 안내문 사진·PDF·앱 캡처를 OCR로 저장하고 일정/준비물/신청 마감을 관리하기 위한 데모 스킬이다.

## 현재 범위

- 원본 문서와 OCR 텍스트를 함께 보존
- 날짜, 시간, 장소, 대상, 준비물, 비용, 신청 마감을 구조화
- 캘린더/리마인더 후보를 만들고 사용자 확인 뒤에만 등록

## 저장 레코드 후보

```json
{
  "document_id": "local-generated-id",
  "source_type": "photo|pdf|screenshot|message|manual",
  "original_path": "/local/path/school_notice.jpg",
  "ocr_text_path": "/local/path/school_notice.ocr.txt",
  "issuer": "예시초등학교",
  "child_or_grade": "3학년",
  "extracted_items": [
    {
      "type": "calendar_event",
      "title": "현장체험학습",
      "starts_at": "2026-05-10T09:00:00+09:00",
      "ends_at": "2026-05-10T14:00:00+09:00",
      "place": "부산시민공원",
      "materials": ["물", "모자"],
      "needs_confirmation": true
    }
  ],
  "review_needed": true
}
```

## 다음 구현 후보

- 로컬 문서 저장 디렉토리 규칙
- OCR 엔진 선택과 confidence 저장
- 중복 문서 감지
- Google/Apple/Outlook Calendar 후보 export
- QR 코드와 첨부 PDF 추출
