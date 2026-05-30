# 유치원 플레이스홀더

`k-parent-kindergarten-info`는 유치원 모집, 통학, 방과후, 급식, 비용 정보를 비교하는 데모 스킬이다.

## 현재 범위

- 지역과 아이 출생연도 기준으로 후보 조건 정리
- 처음학교로, 유치원알리미, 교육청, 기관 홈페이지를 우선 출처로 사용
- 모집 상태와 마감일을 분리

## 데이터 소스

- `packages/k-parent-source-childinfo` — `fetchChildcareCenters({ sidoCode, sigunguCode })`, `fetchKindergartens({ sidoCode, sggCode })`. 환경변수 `KSKILL_DATAGOKR_KEY` (data.go.kr 통합키). 서비스 활용신청·엔드포인트 확정은 `OWNER-TASKS.md` 참고.

## 다음 구현 후보

- 유치원알리미 공개 항목 매핑
- 처음학교로 모집 일정 추적
- 통학버스와 방과후 과정 비교 표준 필드 정의
