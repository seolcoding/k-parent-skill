# Data Contracts

## Source priority

Use sources in this order unless a feature doc says otherwise:

1. Official API or official disclosure.
2. Public data file download.
3. Map or local-search API for geocoding and freshness.
4. Limited scraping for public fields missing from official sources.
5. Community, blog, or review signal as secondary context only.

Every answer should preserve source type so official facts, crawled facts, user documents, recommendations, and affiliate links do not blur together.

## Shared entities

### `parent_profile`

Parent is the account owner.

| Field | Meaning |
| --- | --- |
| `id` | internal parent account id |
| `provider` | login provider such as Kakao, Naver, email, or future provider |
| `locale` | answer language preference |
| `home_region` | coarse default region |
| `notification_prefs` | selected reminders and quiet hours |

### `child_profile`

Store the minimum child context needed for decisions.

| Field | Meaning |
| --- | --- |
| `id` | internal child profile id |
| `parent_id` | parent owner |
| `birth_ym` | month-level birth date when needed; avoid exact birthday by default |
| `stage` | infant, preschool, lower elementary, upper elementary, etc. |
| `school_code` | NEIS school code when applicable |
| `institution_id` | kindergarten, childcare, or other institution id |
| `interests` | parent-provided interests for recommendations |

### `region_code_map`

Central bridge for education, tourism, local government, and public-service codes.

| Field | Meaning |
| --- | --- |
| `sido_code` | province/city code |
| `sigungu_code` | city/county/district code |
| `atpt_ofcdc_sc_code` | NEIS education office code |
| `lDongRegnCd` | TourAPI legal-dong region code |
| `lDongSignguCd` | TourAPI legal-dong district code |
| `source` | source of this mapping |
| `updated_at` | last verification time |

### `institution`

Shared table for schools, kindergartens, childcare centers, culture centers, libraries, and civic facilities.

| Field | Meaning |
| --- | --- |
| `id` | internal id |
| `type` | school, kindergarten, childcare, academy, culture_center, library, civic_facility |
| `official_code` | official institution code where available |
| `name` | institution name |
| `addr` | official address |
| `lat`, `lng` | coordinates when available |
| `source` | official source or crawler name |
| `updated_at` | last collected time |

### `content_item`

Unified object for outings, festivals, events, classes, and culture programs.

| Field | Meaning |
| --- | --- |
| `id` | internal id |
| `kind` | festival, event, class, place, travel, content |
| `source_key` | stable upstream key or URL hash |
| `title` | display title |
| `summary` | short parent-facing summary |
| `age_band` | target child age/stage |
| `start_at`, `end_at` | event or program dates |
| `fee` | free/paid/unknown plus amount when available |
| `booking_url` | official deep link |
| `source_freshness` | fresh, stale, lag-prone, unknown |

### `application_service`

Guidance metadata for benefits, care, reservation, education, and public services.

| Field | Meaning |
| --- | --- |
| `id` | internal id |
| `provider` | Government24, Bokjiro, Seoul reservation, education office, local government |
| `title` | service title |
| `eligibility` | target and criteria summary |
| `apply_method` | online, visit, phone, mixed, unknown |
| `required_docs` | document checklist |
| `official_url` | official detail or application URL |
| `deadline` | deadline or application period |

### `consent_log`

Audit trail for parent consent and withdrawal.

| Field | Meaning |
| --- | --- |
| `id` | internal consent log id |
| `parent_id` | parent owner |
| `purpose` | location, notifications, personalization, calendar write, document processing |
| `granted_at` | grant time |
| `revoked_at` | revoke time if any |
| `retention_policy` | how long related data is retained |

## Common output fields

Parent-facing skills should normalize to these fields whenever possible:

- child age or stage
- region and travel distance
- date range and deadline
- target age or eligibility
- cost, materials, documents, and login requirements
- reservation/application status
- official source URL
- source type
- source freshness
- confirmation date
- confidence
- review-needed flag
- next action for the parent

## Resolver contracts

### School resolver

Input:

- school name
- region
- school level if known

Output:

- `school_code`
- `atpt_ofcdc_sc_code`
- official school name
- address
- ambiguity candidates

### Institution resolver

Input:

- institution name
- region
- type

Output:

- `institution_id`
- official code
- source system
- address
- ambiguity candidates

### Region resolver

Input:

- user region text
- optional coordinates

Output:

- administrative codes
- education office code
- TourAPI legal-dong codes
- display name
- ambiguity candidates

### Application resolver

Input:

- service name or parent intent
- child stage
- region

Output:

- `application_service` candidates
- official URL
- required login or identity level
- reminder candidate

## Privacy constraints

- Do not commit child documents, OCR outputs, screenshots, or profile data.
- Do not store exact child birth date unless a workflow requires it.
- Do not store public-service credentials, certificate credentials, resident registration numbers, or payment credentials.
- Use coarse region by default. Use fine GPS only for request-scoped nearby search.
- Keep parent-facing delete/export/notification withdrawal as a product requirement.

## Sensitive action boundary

The system may prepare:

- checklist
- calendar candidate
- reminder candidate
- official deep link
- draft message

The system must require confirmation before:

- calendar writes
- messages
- reservations
- applications
- cancellations
- purchases
- payments

The system must hand off to official sites for:

- Government24 final submission
- Bokjiro final submission
- certificate or NPKI login
- identity verification
- childcare waitlist final application
- paid public reservation
