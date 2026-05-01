# Project Structure and Future Plan

## Current rule

Keep the inherited `NomaDamas/k-skill` structure:

```text
k-parent-skill/
├── <skill-name>/
│   └── SKILL.md
├── docs/
│   ├── architecture.md
│   ├── departments/
│   ├── features/
│   ├── research/
│   └── specs/
├── packages/
├── scripts/
└── python-packages/
```

Root-level skill directories remain the installable unit. Departments are product taxonomy, not nested folders.

## Documentation structure

Use documentation layers intentionally:

| Layer | Path | Role |
| --- | --- | --- |
| Agent entry | `AGENTS.md`, `CLAUDE.md` | Standing agent context and operational rules |
| Architecture | `docs/architecture.md` | Repository conventions, source priorities, safety boundaries |
| Product plan | `docs/productization-gstack.md` | Commercialization path and gstack QA loop |
| Roadmap | `docs/roadmap.md` | Priority sequence and implementation candidates |
| Departments | `docs/departments/*.md` | Domain ownership and shared patterns |
| Features | `docs/features/<skill>.md` | Skill-specific source surfaces and behavior |
| Research | `docs/research/*.md` | Input analysis and source claims requiring verification |
| Specs | `docs/specs/*.md` | Implementation-ready product, data, and structure decisions |

## Future runtime structure

Add code only after a skill's repeated use proves deterministic implementation is needed.

Suggested future layout:

```text
packages/
├── k-parent-core/                 # shared schemas, resolvers, validation helpers
├── k-parent-source-neis/          # NEIS school, schedule, meal adapters
├── k-parent-source-childcare/     # kindergarten and childcare disclosure adapters
├── k-parent-source-events/        # TourAPI, public reservation, festival/event adapters
├── k-parent-source-benefits/      # Government24/Bokjiro guidance adapters
├── k-parent-recommender/          # ranking/explanation logic
└── k-parent-proxy/                # thin parent-domain proxy if needed

scripts/
├── sync-region-codes.*
├── sync-public-events.*
├── sync-childcare-disclosures.*
└── validate-parent-fixtures.*

python-packages/
└── k-parent-etl/                  # optional ETL, scoring, and data quality jobs
```

This is a future structure, not current code. Do not create these packages until implementation starts.

## Milestone plan

### M0: Specs and source inventory

Goal:

- turn research into stable planning documents
- list official sources, license risks, and required API keys
- define shared data contracts

Deliverables:

- `docs/specs/product-spec.md`
- `docs/specs/data-contracts.md`
- `docs/specs/project-structure.md`
- source inventory under future docs or issue tracker

### M1: Official data MVP

Goal:

- prove high-trust daily parent value without private scraping

Scope:

- NEIS school resolver
- NEIS meal lookup and allergy parsing
- school schedule lookup
- kindergarten/childcare comparison from public disclosure

Expected user flows:

- "오늘 급식 뭐야?"
- "내일 알레르기 있는 메뉴 있어?"
- "우리 동네 유치원 비교해줘."

### M2: Weekend and public event layer

Goal:

- prove family outing recommendations from official and public sources

Scope:

- TourAPI events and places
- public playground and park data
- Seoul/public reservation links
- library and lifelong education programs

Expected user flows:

- "이번 주말 6세랑 갈 실내 무료 장소 추천해줘."
- "비 오면 갈 만한 곳만 보여줘."

### M3: Application guidance

Goal:

- reduce missed benefits and application deadlines without crossing identity boundaries

Scope:

- Government24/Bokjiro service metadata
- eligibility summaries
- document checklists
- deadline reminders
- official deep links

Expected user flows:

- "이번 달 신청 마감인 지원 알려줘."
- "이건 어디서 신청하고 서류가 뭐야?"

### M4: Document capture and calendar

Goal:

- turn school and academy documents into confirmed calendar/reminder candidates

Scope:

- OCR review flow
- extracted event fields
- duplicate detection
- confirm-before-write calendar actions

Expected user flows:

- "이 안내문 사진 저장하고 일정 뽑아줘."
- "준비물과 마감일만 캘린더 후보로 만들어줘."

### M5: Private-source expansion

Goal:

- add limited private culture-center and commercial source coverage only where official data is insufficient

Scope:

- culture-center public class pages
- registration-open monitoring
- manual review tools
- kill switches and conservative polling

Expected user flows:

- "이번 달 백화점 문화센터 5세 미술 강좌 열리면 알려줘."

## Ownership lanes

When implementation begins, split work by ownership:

- Data lane: source adapters, schemas, fixtures, crawlers, freshness.
- Product lane: mobile flows, voice/messenger responses, confirmation UI.
- Agent lane: skill routing, prompts, recommendation explanations.
- Safety lane: consent, child data minimization, side-effect boundaries.
- QA lane: gstack browser QA, benchmark, canary, stale-source tests.

## Decision log

Current durable decisions:

- Official sources first.
- Deep-link applications instead of automatic submission.
- Minimal child profile.
- Coarse location by default.
- No ranking UX for schools, kindergarten, or childcare.
- Shopping and affiliate are secondary.
- Private scraping comes after official-data MVP.
- Root skill folders stay flat.
- Departments stay documentation/product taxonomy.
