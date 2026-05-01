# k-parent-skill

대한민국 부모가 매주 반복해서 확인하는 아이 관련 생활 정보를 AI 에이전트에게 맡기기 위한 스킬 모음입니다.

원본 [`NomaDamas/k-skill`](https://github.com/NomaDamas/k-skill)의 컬렉션형 구조를 그대로 승계합니다. 루트에는 각 스킬 디렉토리가 있고, 필요해지면 `packages/`, `scripts/`, `docs/features/`로 구현과 문서를 확장합니다.

Claude Code, Codex, OpenCode, OpenClaw/ClawHub 등 각종 코딩 에이전트에서 사용할 수 있는 `SKILL.md` 중심 구조입니다.

## 데모 플레이스홀더

아래 스킬은 아직 실제 API·크롤러를 붙이기 전의 데모 컨셉입니다. 현재 단계에서는 사용자의 지역, 아이 나이, 날짜, 선호 조건을 받아 공식/공개 출처를 확인하고 부모가 바로 판단할 수 있게 요약하는 워크플로우를 정의합니다.

| 할 수 있는 일 | 스킬 이름 | 설명 | 사용자 로그인 | 문서 |
| --- | --- | --- | --- | --- |
| 식단 | `k-parent-meal-planner` | 학교 급식, 유치원 식단, 가정 식단 후보를 아이 기준으로 정리 | 불필요 | [식단 플레이스홀더](docs/features/k-parent-meal-planner.md) |
| 학교 정보 | `k-parent-school-info` | 학교 기본정보, 학사일정, 공지, 방과후 정보를 확인 | 불필요 | [학교 정보 플레이스홀더](docs/features/k-parent-school-info.md) |
| 유치원 | `k-parent-kindergarten-info` | 유치원 기본정보, 모집, 방과후, 통학 조건을 비교 | 불필요 | [유치원 플레이스홀더](docs/features/k-parent-kindergarten-info.md) |
| 놀것 | `k-parent-play-finder` | 아이와 갈 실내외 놀이, 체험, 키즈 공간 후보를 추천 | 불필요 | [놀것 플레이스홀더](docs/features/k-parent-play-finder.md) |
| 축제 | `k-parent-festival-finder` | 지역 축제와 가족 동반 행사를 날짜·연령 기준으로 정리 | 불필요 | [축제 플레이스홀더](docs/features/k-parent-festival-finder.md) |
| 문화센터, 행사 | `k-parent-culture-center-events` | 백화점·마트·도서관·공공기관 문화센터 강좌와 행사를 탐색 | 불필요 | [문화센터/행사 플레이스홀더](docs/features/k-parent-culture-center-events.md) |
| 각종 신청 | `k-parent-application-helper` | 돌봄, 방과후, 바우처, 체험 신청의 준비물과 마감일을 정리 | 필요할 수 있음 | [각종 신청 플레이스홀더](docs/features/k-parent-application-helper.md) |

## 구조

```text
k-parent-skill/
├── k-parent-meal-planner/
│   └── SKILL.md
├── k-parent-school-info/
│   └── SKILL.md
├── docs/features/
│   └── k-parent-*.md
├── packages/
│   └── 실제 API/파서가 필요할 때 추가
└── scripts/
    └── 단일 실행 스크립트가 필요할 때 추가
```

## 처음 시작하는 순서

1. 필요한 데모 스킬의 `SKILL.md`를 에이전트 스킬 경로에 설치합니다.
2. 사용자가 지역, 아이 나이, 날짜, 예산, 이동수단 같은 조건을 말하면 스킬 워크플로우를 따릅니다.
3. 실제 조회가 필요한 정보는 현재 날짜 기준으로 공식/공개 출처를 확인하고, 출처와 마감일을 함께 답합니다.
4. 반복 수요가 확인된 스킬부터 `packages/` 또는 `scripts/` 구현으로 승격합니다.

## 구현 원칙

- 부모에게 필요한 판단 단위로 요약합니다: 날짜, 위치, 대상 연령, 비용, 준비물, 신청 링크, 마감일.
- 아이 관련 정보는 오래된 결과를 그대로 쓰지 않고 현재 출처를 확인합니다.
- 로그인, 결제, 신청서 제출은 사용자의 명시적 승인 없이는 실행하지 않습니다.
- 개인정보와 아동 정보는 로컬 입력값으로만 취급하고 저장하지 않습니다.

## 문서

| 문서 | 설명 |
| --- | --- |
| [아키텍처 컨벤션](docs/architecture.md) | 원본 k-skill 구조 승계, 스킬 승격 경로, 에이전트 컨텍스트 |
| [새 스킬 추가 가이드](docs/adding-a-skill.md) | 원본 k-skill 방식의 스킬 추가 규칙 |
| [로드맵](docs/roadmap.md) | 부모용 스킬 확장 후보 |
| [설치 방법](docs/install.md) | 원본 구조에서 승계한 설치/테스트 안내 |
