# gstack Development and Productization Plan

`k-parent-skill` starts as a skill repository, but the product direction should move toward tested parent workflows. gstack is the operating loop for turning each department into a usable product surface, not just a document set.

## Product Thesis

The first commercial wedge is:

1. Parent captures a school or academy document.
2. OCR extracts dates, supplies, application deadlines, and event details.
3. The system proposes calendar events, reminders, and checklists.
4. Shopping needs become purchase candidates.
5. Coupang affiliate links are offered with clear disclosure when the parent asks for purchase links.

This wedge connects the strongest departments: `school`, `academy`, `life`, `shopping`, and `nutrition`.

## gstack Operating Loop

Use this loop for every product surface.

1. **Implement the smallest real flow**
   - Start with one parent task, not a generic dashboard.
   - Example: upload school notice photo, review OCR, create calendar candidates, generate shopping candidates.

2. **Dogfood with gstack browser QA**
   - Run the local or preview URL.
   - Exercise the flow as a parent on desktop and mobile widths.
   - Capture screenshots for upload, review, confirmation, and result states.

3. **Design review**
   - Check visual trust: no hidden ad behavior, no confusing purchase pressure, no unclear child-data handling.
   - Check density: parents should see date, deadline, materials, cost, and next action without hunting.
   - Check mobile: photo upload, OCR review, and candidate confirmation must fit without overlap.

4. **Benchmark**
   - Track first load, upload response, OCR extraction time, candidate generation time, and shopping lookup time.
   - Keep a baseline before adding integrations or heavier UI.

5. **Canary after deploy**
   - Verify the deployed URL loads.
   - Run one smoke path per live department.
   - Watch for console errors, broken forms, missing disclosure text, failed uploads, and blank states.

6. **Document release**
   - Update `SKILL.md`, `docs/features/*`, department docs, and roadmap with the shipped behavior.
   - Do not let product behavior drift from the skill instructions.

## MVP Phases

### Phase 0: Skill OS

- Maintain root skill folders and department docs.
- Define shared schemas for document capture, calendar candidates, shopping candidates, and affiliate disclosure.
- Keep CI limited to skill/document validation until real deploy surfaces exist.

### Phase 1: School Document Capture MVP

- Local web surface for image/PDF upload.
- OCR text review screen.
- Extracted fields: date, time, place, materials, cost, deadline, target grade, issuer.
- Calendar candidate export or manual copy.
- gstack checks: mobile upload, review screen, no overlapping text, empty/error states.

### Phase 2: Calendar and Reminder Workflow

- Confirm-before-write calendar integration.
- Duplicate document detection.
- Reminder checklist for supplies, applications, and payment deadlines.
- gstack checks: calendar permission path, confirmation modal, cancellation path.

### Phase 3: Shopping and Affiliate Workflow

- Convert materials/checklist items into shopping candidates.
- Add Coupang Partners link generation.
- Show affiliate disclosure before links.
- Provide non-affiliate decision signals: price, delivery date, alternatives, offline/used option.
- gstack checks: disclosure visibility, no auto-cart/auto-buy path, mobile product comparison layout.

### Phase 4: Academy Connector

- Ingest academy messages, screenshots, or API data.
- Normalize classes, homework, attendance, makeup classes, counseling, billing, shuttle.
- Add read/write permission separation.
- gstack checks: account/login boundaries, child switching, schedule conflict states.

### Phase 5: Department Expansion

- `play`: event and culture center discovery.
- `nutrition`: meal planning from school/kindergarten menus plus allergy constraints.
- `trend`: parent trend summaries with source/date transparency.
- `shopping`: broader inventory/price comparison beyond Coupang.

## Commercialization Model

Primary revenue:

- Coupang Partners affiliate links from purchase-intent moments.

Potential later revenue:

- Premium calendar/document automation for families with multiple children.
- Local academy/center lead generation, only with clear sponsorship labeling.
- B2B school/academy document-to-calendar tools.

Non-negotiables:

- Always disclose affiliate relationships.
- Do not rank unsafe or unsuitable products for commission.
- Do not auto-purchase, add to cart, submit applications, or expose child data without explicit approval.
- Keep source documents and OCR outputs in user-controlled storage by default.

## gstack Quality Gates

Before a product surface ships:

- `npm run ci` passes.
- gstack dogfood confirms the core flow works on desktop and mobile.
- Screenshots show no broken layout, hidden disclosure, or confusing child-data handling.
- Upload/OCR/calendar/shopping error states are visible and recoverable.
- Deployed canary passes on the production URL.

## First Build Candidate

Build this first:

`k-parent-school-doc-capture` product surface:

1. Upload notice image/PDF.
2. OCR and show editable extracted text.
3. Extract calendar/checklist candidates.
4. Ask for confirmation.
5. Generate shopping candidates from materials.
6. Show Coupang affiliate disclosure before links.

This path is narrow, repeatable, monetizable, and naturally expands into school, academy, life, shopping, and nutrition departments.
