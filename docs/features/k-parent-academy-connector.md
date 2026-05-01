# 학원 API 플레이스홀더

`k-parent-academy-connector`는 학원 앱/API/알림을 부모 일정 관리에 연결하기 위한 데모 스킬이다.

## 현재 범위

- 학원 앱, API, 문자, 카카오 알림, PDF, 사진 안내문을 입력 표면으로 분류
- 수업 일정, 숙제, 출결, 보강, 시험, 상담, 결제 마감을 공통 필드로 정리
- 읽기와 쓰기 권한을 분리하고, 쓰기 작업은 사용자 승인 뒤에만 진행

## 정규화 후보

```json
{
  "academy_name": "예시학원",
  "class_name": "초3 수학 A반",
  "child_or_grade": "초3",
  "event_type": "homework|class|makeup|exam|counseling|billing|notice",
  "starts_at": "2026-05-01T16:00:00+09:00",
  "ends_at": "2026-05-01T17:30:00+09:00",
  "deadline": "2026-05-03T23:59:00+09:00",
  "materials": ["교재", "오답노트"],
  "source": "academy_app|sms|kakao|pdf|photo|manual",
  "source_reference": "local path or URL",
  "needs_confirmation": true
}
```

## 다음 구현 후보

- 학원별 API/앱 표면 조사
- 문자·카카오 알림 텍스트 파서
- 캘린더 후보 생성 스키마
- 결제/신청 side-effect 승인 게이트
