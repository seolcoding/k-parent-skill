# Feature Plans

Each feature plan follows the same shape: user promise, required inputs, primary sources, output contract, risks, and implementation phase.

## 1. Today Brief and Meal Planner

User promise:

- "오늘 아이에게 중요한 식단, 일정, 준비물을 한 번에 알려준다."

Inputs:

- child profile
- school or institution id
- date
- allergy notes
- calendar preference

Primary sources:

- NEIS school basic information
- NEIS meal service diet information
- NEIS school schedule
- school notices when supported later

Outputs:

- meal summary
- allergy and calorie note
- schedule items
- preparation checklist
- source freshness
- calendar/reminder candidates

Risks:

- school name ambiguity
- allergy parsing differences
- stale or missing meal data
- multiple children with different institutions

Phase:

- P0 official data MVP

## 2. School, Kindergarten, and Childcare Hub

User promise:

- "우리 가족 조건에 맞는 학교·유치원·어린이집 정보를 실용적인 비교 카드로 보여준다."

Inputs:

- region
- child age/stage
- commute radius
- care needs
- vehicle preference
- cost sensitivity

Primary sources:

- NEIS school information
- school disclosure where applicable
- kindergarten disclosure
- childcare information disclosure
- local government open data when needed

Outputs:

- institution card
- official codes
- address and contact
- hours and care options
- class and teacher summary
- cost and safety summary
- official links

Risks:

- licensing and change-prohibition constraints
- public data update cadence
- accidental ranking or prestige framing
- code mapping mismatch

Phase:

- P0 official data MVP

## 3. Weekend Outing, Play, Travel, and Festival Finder

User promise:

- "이번 주말 아이 나이, 날씨, 거리, 비용에 맞는 갈 곳을 추천한다."

Inputs:

- child age/stage
- home or temporary location
- date range
- indoor/outdoor preference
- budget
- transportation
- weather and fine-dust preference

Primary sources:

- Korea Tourism Organization TourAPI
- public playground and park data
- local festival data
- Seoul and local public reservation data
- libraries and lifelong education data

Outputs:

- event/place candidates
- official URL
- distance and travel hint
- cost
- reservation status
- age fit
- recommendation reason
- stale-data warning when needed

Risks:

- event cancellation not reflected in public data
- location freshness
- duplicate events across sources
- weather-sensitive recommendation quality

Phase:

- P1 public event layer

## 4. Application, Welfare, and Reservation Helper

User promise:

- "받을 수 있는 혜택과 신청해야 할 일을 놓치지 않게 체크리스트와 공식 링크로 안내한다."

Inputs:

- region
- child age/stage
- family situation disclosed by parent
- service category
- preferred reminder channel

Primary sources:

- Government24 public service information
- Bokjiro central and local welfare service information
- Seoul/public reservation data
- education office and local government guidance pages

Outputs:

- eligibility summary
- required documents
- application method
- deadline or period
- official deep link
- reminder candidate
- unsupported automation warning

Risks:

- overclaiming eligibility
- identity or certificate boundary
- policy changes
- incomplete local-government metadata

Phase:

- P1/P2 application guidance

## 5. School Document Capture and Schedule Manager

User promise:

- "가정통신문 사진이나 PDF에서 일정, 준비물, 비용, 마감일을 뽑아 캘린더 후보로 만든다."

Inputs:

- image, PDF, screenshot, or attachment
- child profile
- school/institution context
- parent confirmation

Primary sources:

- uploaded original document
- OCR engine
- optional school calendar for duplicate detection
- calendar integration after confirmation

Outputs:

- OCR text
- extracted event fields
- extracted checklist fields
- confidence and ambiguity markers
- calendar/reminder candidates
- original file reference

Risks:

- OCR errors in Korean documents
- ambiguous dates without year
- private child data in uploaded documents
- unintended calendar writes

Phase:

- P2 document capture

## 6. Academy Connector

User promise:

- "학원 일정, 숙제, 출결, 보강, 결제 알림을 부모 일정과 연결한다."

Inputs:

- academy provider
- parent account authorization when supported
- child schedule
- notification preference

Primary sources:

- academy APIs where available
- parent-provided exports
- screenshots or notices in early versions
- calendar and reminder system

Outputs:

- lesson schedule
- homework or material note
- attendance state
- make-up class candidate
- payment deadline note

Risks:

- private provider terms
- account credential handling
- fragmented academy apps
- sensitive child attendance data

Phase:

- P3 after official data and OCR prove value

## 7. Car-Friendly Content Recommender

User promise:

- "차 안에서 들을 만하고 교과와 연결되는 콘텐츠와 대화 주제를 추천한다."

Inputs:

- child age/stage
- curriculum topic
- travel duration
- screen tolerance
- parent preference

Primary sources:

- curated content catalog
- YouTube metadata where allowed
- curriculum mapping
- parent-approved channels

Outputs:

- content list
- duration
- curriculum link
- listening suitability
- parent-child conversation prompts
- follow-up activity

Risks:

- unsafe or low-quality content
- ads and recommendation drift
- copyright and embedding constraints
- screen-time mismatch

Phase:

- P2 content layer

## 8. Shopping and Affiliate Recommender

User promise:

- "준비물이나 교재 구매가 필요한 순간에만 후보를 비교하고, 어필리에이트는 투명하게 표시한다."

Inputs:

- explicit purchase intent
- item need from document, school notice, or parent request
- budget
- delivery urgency

Primary sources:

- Coupang affiliate/search where policy allows
- public product pages
- existing `k-skill` shopping-related patterns
- parent-provided preferred stores

Outputs:

- product candidates
- price and delivery hint
- reason for recommendation
- affiliate disclosure
- no automatic purchase

Risks:

- shopping-first product drift
- undisclosed monetization
- stale price/stock
- child-targeted product safety

Phase:

- P3 monetization add-on

## 9. Data Collector and Trend Layer

User promise:

- "공식 데이터가 놓치는 지역 행사, 평생교육, 트렌드 흐름을 보강한다."

Inputs:

- source catalog
- region
- collection schedule
- freshness policy
- kill switch configuration

Primary sources:

- official files and APIs
- local government pages
- public event pages
- limited private pages after review
- community/blog signals as separated metadata

Outputs:

- normalized source records
- freshness score
- source type
- crawl status
- deduped content items
- review queue items

Risks:

- terms and robots constraints
- layout changes
- database extraction concerns
- source freshness confusion

Phase:

- P1 for public data, P3 for private-source expansion
