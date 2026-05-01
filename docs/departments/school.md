# School Department

학교 디파트먼트는 학교, 유치원, 방과후, 가정통신문, 안내문, 학교 신청 마감을 다룬다.

## Skills

- `k-parent-school-info`
- `k-parent-kindergarten-info`
- `k-parent-school-doc-capture`
- `k-parent-data-collector`
- `k-parent-content-recommender`

## Shared patterns

- 학교/기관명은 지역과 교육청으로 disambiguation한다.
- 날짜, 대상 학년, 준비물, 비용, 제출/신청 마감, 공식 출처를 항상 분리한다.
- 안내문 사진/PDF는 원본, OCR 텍스트, 구조화 JSON, 캘린더 후보를 연결해 저장한다.
- 학교데이터와 시간표는 출처, 수집 시각, freshness를 함께 노출한다.
- 교과 연계 콘텐츠는 학년·단원·학교 활동과 연결해 추천한다.

## Next candidates

- NEIS school resolver
- 유치원알리미/처음학교로 공개 정보 resolver
- 학교 안내문 OCR 저장소와 중복 감지
- 방과후/돌봄 신청 마감 추출
- 학교 시간표와 실제 학교데이터 수집
