# 데이터 수집 플레이스홀더

`k-parent-data-collector`는 학교데이터, 시간표, 교육청, 평생교육, 축제, 행사, 문화센터, 트렌드 데이터를 수집하는 데모 스킬이다.

## 현재 범위

- 실제 데이터 소스 등록
- API/HTML/PDF/RSS/스크린샷 수집
- normalized record 생성
- 출처 URL, 수집 시각, freshness, parse warning 관리

## 다음 구현 후보

- NEIS/교육청/학교 홈페이지 source registry
- 평생교육/축제/행사 크롤러
- 지역 트렌드 수집 파이프라인
- dedupe와 freshness scoring
