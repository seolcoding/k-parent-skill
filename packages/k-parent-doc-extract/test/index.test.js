const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  extractEvents,
  extractSupplies,
  extractDeadlines,
  extractAcademyNotice,
} = require("k-parent-doc-extract");

function fixture(name) {
  return fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8");
}

test("extractEvents finds Korean full-date with weekday", () => {
  const events = extractEvents(fixture("school-fieldtrip.txt"));
  const dates = events.map((e) => e.date);
  assert.ok(dates.includes("2026-06-15"));
  assert.ok(dates.includes("2026-06-10"));
  const trip = events.find((e) => e.date === "2026-06-15");
  assert.ok(trip.raw.includes("일시"));
  assert.ok(trip.title.length > 0);
});

test("extractEvents handles numeric MM/DD and YYYY.MM.DD forms", () => {
  const events = extractEvents(fixture("school-general-notice.txt"));
  const dates = events.map((e) => e.date);
  assert.ok(dates.includes("03-20")); // year unknown -> MM-DD
  assert.ok(dates.includes("2026-07-24"));
  // range 04.27 ~ 04.30 should yield both endpoints
  assert.ok(dates.includes("04-27"));
  assert.ok(dates.includes("04-30"));
});

test("extractSupplies pulls items after 준비물 marker", () => {
  const supplies = extractSupplies(fixture("school-fieldtrip.txt"));
  assert.deepEqual(supplies, ["도시락", "물", "돗자리", "우산"]);
});

test("extractSupplies works across multiple notices", () => {
  const kinder = extractSupplies(fixture("kinder-notice.txt"));
  assert.ok(kinder.includes("편한 복장"));
  assert.ok(kinder.includes("여벌 옷"));
  assert.ok(kinder.includes("모자"));
});

test("extractDeadlines finds dates near 마감/제출/신청/회신", () => {
  const deadlines = extractDeadlines(fixture("school-fieldtrip.txt"));
  const item = deadlines.find((d) => d.date === "2026-06-10");
  assert.ok(item, "expected a 2026-06-10 deadline");
  assert.match(item.label, /마감|제출|회신/);
});

test("extractDeadlines on general notice", () => {
  const deadlines = extractDeadlines(fixture("school-general-notice.txt"));
  const dates = deadlines.map((d) => d.date);
  assert.ok(dates.includes("03-13"));
});

test("extractAcademyNotice classifies by keyword", () => {
  const notices = extractAcademyNotice(fixture("academy-notice.txt"));
  const types = notices.map((n) => n.type);
  assert.ok(types.includes("class")); // 휴강
  assert.ok(types.includes("makeup")); // 보강
  assert.ok(types.includes("exam")); // 레벨 테스트
  assert.ok(types.includes("payment")); // 수강료 납부
  assert.ok(types.includes("shuttle")); // 차량/셔틀
  assert.ok(types.includes("homework")); // 숙제

  const makeup = notices.find((n) => n.type === "makeup");
  assert.equal(makeup.date, "06-13");
});

test("empty / null text yields empty arrays", () => {
  assert.deepEqual(extractEvents(""), []);
  assert.deepEqual(extractSupplies(null), []);
  assert.deepEqual(extractDeadlines(undefined), []);
  assert.deepEqual(extractAcademyNotice(""), []);
});
