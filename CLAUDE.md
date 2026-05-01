# k-parent-skill

This repository keeps the architecture pattern of `NomaDamas/k-skill`, but the product concept is a 대한민국 부모 생활정보 skill collection.

## Agent context

- Read `AGENTS.md` and `docs/architecture.md` before broad repository changes.
- Preserve the root skill folder pattern: `<skill-name>/SKILL.md` is the unit of installation and triggering.
- Keep parent-specific skill work scoped to independent skills first. Add `packages/*` or `scripts/*` only when the workflow needs deterministic implementation.
- For each new skill or major skill change, keep `SKILL.md`, `docs/features/<skill-name>.md`, `README.md`, and `docs/roadmap.md` aligned.
- Do not execute login, application submission, payment, cancellation, or child-personal-data entry without explicit user approval.

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
