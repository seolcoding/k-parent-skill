# k-parent-calendar

Calendar candidate utilities for K-Parent Skill.

- `calendarCandidate(input)` — build a normalized calendar candidate. The
  candidate always has `type: "calendar_write"`, `requiresConfirmation: true`,
  and `executable: false`. K-Parent skills never auto-write to a calendar; the
  user must confirm before any real calendar write.
- `dedupeCandidates(list)` — drop duplicate candidates by stable `id`.
- `toICS(candidates)` — render an RFC5545 `VCALENDAR`/`VEVENT` string
  (all-day `DTSTART;VALUE=DATE`).
- `candidateId(title, date, location)` — sha256 of `${title}|${date}|${location}`.

Offline / pure logic. No network, no API keys.
