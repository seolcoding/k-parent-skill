# Academy Department

학원 디파트먼트는 학원 앱/API, 문자, 카카오 알림, 수업 일정, 숙제, 출결, 보강, 상담, 결제 마감을 다룬다.

## Skills

- `k-parent-academy-connector`

## Shared patterns

- 읽기와 쓰기 권한을 분리한다.
- 결제, 상담 신청, 결석/보강 신청, 메시지 전송은 사용자 승인 전 실행하지 않는다.
- 학원 알림은 `academy_notice` 형태로 수업, 숙제, 출결, 결제, 상담, 셔틀 정보를 분리한다.

## Next candidates

- 학원 앱/API 표면 조사
- 문자·카카오 알림 텍스트 파서
- 학원별 일정/숙제 캘린더 후보 생성
