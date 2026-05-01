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
│   └── features/<skill-name>.md
├── packages/
│   └── <skill-name>/
├── scripts/
└── python-packages/
```

## Skill-first pattern

- Treat a root skill directory as the public unit of capability.
- Keep `SKILL.md` concise and procedural. Put deeper explanation in `docs/features/<skill-name>.md`.
- Use `SKILL.md`-only placeholders for concept validation.
- Add implementation code only when repeated usage proves that deterministic parsing, normalization, or API access is needed.

## Implementation promotion path

1. `SKILL.md` placeholder: instructions, examples, failure modes, and safety rules.
2. Feature doc: source surfaces, output format, and known limitations.
3. Script helper: small one-off deterministic task.
4. Package helper: reusable Node package under `packages/*`.
5. Proxy route: free/public API aggregation via `packages/k-skill-proxy`.

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

## Safety and privacy

- Do not store child names, birth dates, school identifiers, contact information, or application credentials in the repository.
- Do not submit applications, make reservations, cancel, pay, or enter child-personal-data without explicit user approval.
- Separate confirmed official information from recommendations, guesses, reviews, or stale search snippets.
- Schedules, admissions, events, and applications are time-sensitive. Verify current sources before answering.

## Agent context surfaces

Future agents should use these files as the standing repository context:

- `AGENTS.md`: operational rules for coding agents
- `CLAUDE.md`: compact Claude Code context
- `docs/architecture.md`: architecture and promotion conventions
- `docs/adding-a-skill.md`: new skill workflow
- `docs/roadmap.md`: concept and implementation priorities

When changing the architecture or conventions, update these surfaces together.
