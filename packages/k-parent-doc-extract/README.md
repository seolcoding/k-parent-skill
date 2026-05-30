# k-parent-doc-extract

Pure Korean school/academy notice parsing for K-Parent Skill.

OCR (image to text) is done by the model elsewhere. These functions operate
only on already-extracted plain text.

- `extractEvents(text)` -> `[{ date, title, raw }]` via Korean and numeric date
  regex (`YYYY년MM월DD일`, `MM/DD`, `MM.DD`, optional `(요일)`).
- `extractSupplies(text)` -> string list after 준비물 / 지참 / 준비 markers.
- `extractDeadlines(text)` -> `[{ label, date, raw }]` near 마감 / 제출 / 신청 / 회신.
- `extractAcademyNotice(text)` -> `[{ type, date, detail }]` where type is one of
  class / makeup / absence / homework / exam / payment / shuttle.

Offline / pure logic. No network, no API keys.
