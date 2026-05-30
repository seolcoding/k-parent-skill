# k-parent-skill

This repository keeps the architecture pattern of `NomaDamas/k-skill`, but the product concept is a 대한민국 부모 생활정보 skill collection.

## Agent context

- Read `AGENTS.md` and `docs/architecture.md` before broad repository changes.
- Preserve the root skill folder pattern: `<skill-name>/SKILL.md` is the unit of installation and triggering.
- Keep parent-specific skill work scoped to independent skills first. Add `packages/*` or `scripts/*` only when the workflow needs deterministic implementation.
- For each new skill or major skill change, keep `SKILL.md`, `docs/features/<skill-name>.md`, `README.md`, and `docs/roadmap.md` aligned.
- Do not execute login, application submission, payment, cancellation, or child-personal-data entry without explicit user approval.

## SKILL.md authoring (context engineering)

frontmatter `description`는 에이전트 라우팅의 1차 신호다. 아래를 지킨다.

- `description`은 **한국어**로 쓴다(부모 질의가 한국어이므로). 영어 설명 금지.
- 실제 사용자 발화 **트리거 예시 2~3개**를 큰따옴표로 넣는다. 예: `"이번 주 급식 뭐야", "유치원 식단표 확인해줘" 같은 요청에 사용.`
- 의미가 겹치는 형제 스킬이 있으면 **경계 문장**으로 어느 쪽인지 구분한다. 예: `날짜가 박힌 축제는 k-parent-festival-finder, 1박 이상 코스는 k-parent-travel-recommender.`
- 동작 패키지가 있으면 본문에 `## 데이터 소스 (deterministic packages)` 섹션을 두고 패키지·함수·env 변수를 명시한다.
- 긴 코드표·필드맵·정책표는 본문에 붓지 말고 `<skill>/references/*.md`로 분리해 백틱 경로로 링크한다(progressive disclosure stage 3).
- 질의→스킬 매핑과 겹침 해소 규칙은 `docs/skill-routing.md`에 모은다. 스킬을 추가/변경하면 같이 갱신한다.
- 위 규칙은 `scripts/skill-docs.test.js`의 k-parent 블록이 CI에서 강제한다.

## Testing anti-patterns

- **Never write tests that assert `.changeset/*.md` files exist.** Changesets are consumed (deleted) by `changeset version` during the release flow. Any test guarding changeset file presence will break CI on the version-bump commit and block the release pipeline.

## Release automation

- Release workflows are intentionally disabled until this repo has a real package publishing target.
- Do not re-add push-triggered npm/Python release workflows as scaffolding only; GitHub Actions can fail when all jobs are skipped.
- Keep CI focused on skill/document validation unless the user explicitly asks to operationalize package publishing.

## gstack productization

- Use `docs/productization-gstack.md` as the standing plan for turning skill concepts into product surfaces.
- When a web/app surface exists, use gstack-style dogfooding before claiming the flow works: upload/import, OCR review, calendar candidate creation, shopping disclosure, and mobile layout.
- Keep product screens, skill docs, schemas, and roadmap changes aligned in the same PR.

## Proxy server development

- 개발 repo: 현재 `k-parent-skill` checkout
- 프로덕션 배포본: 환경별 설정을 확인한다. 원본 k-skill 패턴을 쓸 경우 main 브랜치 단독 clone + cron/pm2 자동 갱신 구조다.
- 따라서 proxy route 변경은 **main에 merge되어야 프로덕션에 반영**된다. dev에서 코드를 바꿔도 프로덕션 proxy에는 영향 없음.
- 로컬 테스트는 `node packages/k-skill-proxy/src/server.js` 로 직접 실행하거나 `node --test packages/k-skill-proxy/test/server.test.js` 로 확인.
