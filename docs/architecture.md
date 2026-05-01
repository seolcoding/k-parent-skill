# Architecture Conventions

`k-parent-skill` keeps the repository architecture of `NomaDamas/k-skill` and changes the domain concept to 대한민국 부모 생활정보.

## Repository shape

```text
k-parent-skill/
├── <skill-name>/
│   └── SKILL.md
├── docs/
│   ├── architecture.md
│   ├── adding-a-skill.md
│   ├── departments/<department>.md
│   └── features/<skill-name>.md
├── packages/
│   └── <skill-name>/
├── scripts/
└── python-packages/
```

## Skill-first pattern

- Treat a root skill directory as the public unit of capability.
- Treat departments as the product taxonomy, not as nested install paths. Do not move skill folders under department folders.
- Keep `SKILL.md` concise and procedural. Put deeper explanation in `docs/features/<skill-name>.md`.
- Put department strategy, shared schemas, and skill maps in `docs/departments/<department>.md`.
- Use `SKILL.md`-only placeholders for concept validation.
- Add implementation code only when repeated usage proves that deterministic parsing, normalization, or API access is needed.

## Department taxonomy

K-Parent Skills uses these top-level departments:

| Department | Korean label | Scope |
| --- | --- | --- |
| `school` | 학교 | school notices, meals, kindergarten, after-school, documents, applications |
| `academy` | 학원 | hagwon apps/APIs, classes, homework, attendance, makeup lessons, billing |
| `play` | 놀이 | places to go, indoor/outdoor play, festivals, culture centers, events |
| `life` | 생활 | childcare, benefits, healthcare, public applications, family logistics |
| `trend` | 트렌드 | parenting trends, local buzz, seasonal topics, popular programs |
| `shopping` | 쇼핑 | supplies, books, toys, price comparison, inventory, affiliate recommendations, purchase planning |
| `nutrition` | 영양 | school meals, kindergarten meals, allergies, home meal planning |

Department membership is metadata and documentation. A skill may belong to one primary department and optional secondary departments, but the root folder name stays stable.

## Implementation promotion path

1. `SKILL.md` placeholder: instructions, examples, failure modes, and safety rules.
2. Feature doc: source surfaces, output format, and known limitations.
3. Script helper: small one-off deterministic task.
4. Package helper: reusable Node package under `packages/*`.
5. Proxy route: free/public API aggregation via `packages/k-skill-proxy`.

## Document ingestion pattern

School, academy, and institution documents should follow an ingest-normalize-confirm flow:

1. Capture original: photo, PDF, app screenshot, message, or downloaded attachment.
2. Extract text: OCR or structured parser, keeping confidence and source page/region when available.
3. Normalize entities: date, time, place, child/grade target, cost, materials, deadline, application URL, contact, and issuer.
4. Store linkable records: keep original path, extracted text, normalized JSON, source date, and confirmation state together.
5. Propose actions: calendar events, reminders, checklist items, or application tasks.
6. Confirm before side effects: write to calendar, send messages, submit applications, or pay only after explicit user approval.

## Commerce and affiliate pattern

Shopping recommendations may monetize through Coupang Partners or other affiliate links, but recommendations must preserve parent trust:

1. Start from a concrete parent need: school supply list, academy book, event material, nutrition item, toy, or household repeat purchase.
2. Normalize the need before recommending products: item name, quantity, deadline, required/optional status, age/grade fit, budget, delivery deadline, and source document.
3. Present non-affiliate decision information first: product type, constraints, price range, delivery estimate, alternatives, and whether offline/used purchase is reasonable.
4. Disclose affiliate status before showing affiliate links. Use clear wording that purchase through the link may generate commission.
5. Provide affiliate links only after the user asks to buy, compare purchase candidates, or requests product links.
6. Do not auto-purchase, add to cart, or steer around safety/age suitability for commission.
7. Keep commercial ranking explainable: relevance, deadline fit, price, reviews, delivery, and stock should be visible signals.

## gstack development loop

Use gstack as the development and commercialization quality loop once this repo grows beyond pure skill documents:

1. Product surface: build the smallest usable web/app surface for one department workflow.
2. Dogfood: use gstack browser QA to run the real parent flow end to end.
3. Design review: inspect screenshots for clarity, trust, disclosure, mobile usability, and parent decision load.
4. Benchmark: record load, interaction, and OCR/import latency baselines before larger changes.
5. Canary: after deploy, verify the live app has no blocking console errors and that key flows still work.
6. Ship discipline: keep skill docs, schemas, tests, and product screens aligned in each PR.

## Parent-domain output schema

Parent-facing skills should normalize information into practical decision fields:

- child age or grade
- region and travel distance
- date range and deadline
- target age or eligibility
- cost, materials, documents, and login requirements
- reservation/application status
- official source URL
- confirmation date
- next action for the parent
- original document path or capture source when the information came from OCR/PDF/app screenshots
- confidence and review-needed flag for OCR-derived fields
- commerce disclosure and affiliate link status when the next action is purchase-related

## Safety and privacy

- Do not store child names, birth dates, school identifiers, contact information, or application credentials in the repository.
- Store OCR outputs and document metadata in user-controlled local storage by default; do not commit captured school or academy documents.
- Do not submit applications, make reservations, cancel, pay, or enter child-personal-data without explicit user approval.
- Do not hide affiliate relationships or present paid links as neutral recommendations.
- Separate confirmed official information from recommendations, guesses, reviews, or stale search snippets.
- Schedules, admissions, events, and applications are time-sensitive. Verify current sources before answering.

## Agent context surfaces

Future agents should use these files as the standing repository context:

- `AGENTS.md`: operational rules for coding agents
- `CLAUDE.md`: compact Claude Code context
- `docs/architecture.md`: architecture and promotion conventions
- `docs/adding-a-skill.md`: new skill workflow
- `docs/departments/README.md`: department taxonomy and skill map
- `docs/productization-gstack.md`: gstack-based development and commercialization plan
- `docs/roadmap.md`: concept and implementation priorities

When changing the architecture or conventions, update these surfaces together.
