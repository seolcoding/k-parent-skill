# K-Parent Skill PRD

## Summary

K-Parent Skill is a Korea-focused parent assistant built on the `k-skill` repository pattern. It turns official school, childcare, public event, welfare, and schedule data into mobile, messenger, and voice-friendly decisions for parents.

The product should help a parent answer:

- What does my child need today?
- What decision should I make this week?
- What can we do this weekend?
- What application, reservation, or benefit deadline should I not miss?

The first product is not a replacement for Government24, Bokjiro, school apps, academy apps, or public reservation systems. It is a trusted assistant that reads, normalizes, summarizes, reminds, and links out to official action surfaces.

## Target Users

Primary users:

- Parents in Korea with infants, preschoolers, or elementary-school children.
- Parents using multiple disconnected apps: school, childcare, academy, public reservation, welfare, maps, shopping, and calendar.
- Parents who need fast answers while commuting, driving, working, or planning weekends.

Secondary users:

- Grandparents or caregivers who need simpler summaries.
- Multicultural families that need translated summaries while preserving official Korean source text.
- Parents managing multiple children with different school, academy, and activity schedules.

## Problem

Parent information is fragmented across official portals, private apps, PDFs, images, notices, calendars, blog posts, map results, and shopping pages. Most services push information vertically, but parents make decisions horizontally:

- meal plus allergy plus dinner planning
- school notice plus calendar plus supplies
- weekend weather plus age-fit place plus reservation status
- benefit eligibility plus documents plus deadline
- curriculum topic plus car-friendly content plus conversation prompt

The product must reduce this cross-source coordination burden.

## Product Principles

1. Official sources first.
   Use NEIS, public disclosure systems, TourAPI, Government24, Bokjiro, Seoul/public reservation, and local government data before community or private signals.

2. Safe handoff over unsafe automation.
   Applications, payments, bookings, government identity, and certificate-based actions should be checklist plus official deep link, not automated submission.

3. Parent decision unit.
   Every answer should expose date, age fit, location, cost, source freshness, deadline, and next action when relevant.

4. Minimal child profile.
   Store only what is necessary: age band, school or institution id, region, allergies, interests, and notification preferences.

5. No ranking UX for sensitive institutions.
   School, kindergarten, and childcare comparison should support practical decision-making, not public leaderboards or prestige ranking.

6. Shopping is secondary.
   Coupang affiliate or product links are allowed only when purchase intent exists, and disclosure is required.

## MVP Scope

### P0: Today Brief

Required:

- NEIS school resolver.
- Meal lookup by school and date.
- Allergy extraction from meal strings.
- Calorie and nutrition summary when available.
- School schedule and reminder candidates.
- Source freshness and official source links.

Example request:

> 오늘 아이 학교 급식이랑 준비물 알려줘.

### P0: School, Kindergarten, and Childcare Lookup

Required:

- School basic information and schedule lookup.
- Kindergarten and childcare public disclosure summary.
- Practical comparison fields: distance, hours, care options, vehicle, cost, class size, teacher ratio, meal/safety indicators, official URL.
- Conservative presentation of sensitive public data.

Example request:

> 우리 동네에서 6세 아이가 다닐 만한 유치원 비교해줘.

### P1: Weekend Outing and Event Recommendation

Required:

- TourAPI event/place ingestion.
- Public playground, park, library, lifelong education, and reservation data.
- Filters for age, distance, weather, indoor/outdoor, cost, schedule conflict, and reservation status.
- Official links and stale-data warnings.

Example request:

> 이번 주말 비 오면 5세랑 갈 만한 무료 실내 장소 3곳만 추천해줘.

### P1: Benefit and Application Guidance

Required:

- Government24 and Bokjiro service metadata.
- Eligibility summary.
- Required documents.
- Application period or deadline.
- Reminder candidate.
- Official deep link.

Example request:

> 이번 달에 우리 가족이 신청할 수 있는 지원사업 있어?

### P2: School Document Capture

Required:

- Photo/PDF/screenshot ingestion.
- OCR text extraction.
- Date, time, place, deadline, cost, materials, target grade, issuer extraction.
- User confirmation before calendar or reminder writes.
- Original file reference.

Example request:

> 이 안내문 사진에서 일정이랑 준비물만 뽑아줘.

### P2: Car-Friendly Content Recommendation

Required:

- Age and curriculum linked content taxonomy.
- Screen-light or audio-friendly YouTube/video/audio suggestions.
- Conversation prompts for parent and child.
- Safety and quality metadata.

Example request:

> 차 타고 가면서 들을 만한 초등 과학 관련 영상 추천해줘.

## Non-Goals

- No automatic Government24, Bokjiro, childcare, public reservation, or academy application submission in early versions.
- No storage of resident registration numbers, certificate credentials, public-service passwords, or payment credentials.
- No full private-site mirroring.
- No hidden affiliate recommendation.
- No school or childcare ranking leaderboard.
- No unreviewed scraping of login-only or terms-sensitive surfaces.

## Product Surfaces

Initial:

- Mobile web app.
- Messenger-style command box.
- Voice-friendly short-answer formatter.
- Static docs and skill install flow for agent users.

Later:

- Calendar integration.
- Share target for school documents and screenshots.
- Family dashboard.
- Academy connector hub.
- Multilingual summary layer for caregivers and multicultural families.

## Success Metrics

Product value:

- Daily brief completion rate.
- Confirmed calendar/reminder candidate count.
- Weekend recommendation open/save rate.
- Application reminder save rate.
- Document OCR correction rate.
- Parent correction rate for institution and schedule matching.

Trust:

- Source-visible answer rate.
- Source freshness warning rate.
- Sensitive-action handoff clarity.
- Affiliate disclosure visibility.
- Unsupported-action refusal clarity.

Reliability:

- Official API success rate.
- Cache freshness.
- Resolver match confidence.
- Stale-source fallback rate.
- Mobile interaction success in QA.

## Release Criteria

Before the first product MVP:

- PRD, data contracts, and planning docs are committed.
- Source inventory lists official APIs, required keys, license constraints, and refresh cadence.
- NEIS meal and school resolver fixture tests exist.
- Child data minimization policy is documented.
- Sensitive-action guardrails are represented in skill docs and UI copy.
- Mobile layout and voice-answer format are tested.
