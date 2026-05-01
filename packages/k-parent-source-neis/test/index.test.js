const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  ERROR_STATUS,
  SOURCE_FRESHNESS,
} = require("k-parent-core");
const {
  getMeals,
  getSchedule,
  normalizeDateInput,
  normalizeMealRows,
  normalizeSchoolRows,
  parseDishName,
  requestNeisJson,
  resolveEducationOffice,
  resolveSchool,
} = require("../src/index");

const fixturesDir = path.join(__dirname, "fixtures");
const schoolPayload = readFixture("school-info.json");
const mealPayload = readFixture("meal.json");
const schedulePayload = readFixture("schedule.json");

test("normalizeDateInput accepts NEIS compact and dashed dates", () => {
  assert.equal(normalizeDateInput("20260501").isoDate, "2026-05-01");
  assert.equal(normalizeDateInput("2026-05-01").compactDate, "20260501");
  assert.throws(() => normalizeDateInput("2026-13-40"), /date must be a valid/);
});

test("resolveEducationOffice maps Korean region text and reports ambiguity", () => {
  assert.equal(resolveEducationOffice("서울특별시교육청").code, "B10");
  assert.equal(resolveEducationOffice("B10").code, "B10");
  const ambiguous = resolveEducationOffice("경상");
  assert.equal(ambiguous.ok, false);
  assert.equal(ambiguous.status, ERROR_STATUS.AMBIGUOUS);
});

test("school rows normalize official school fields with source freshness", () => {
  const schools = normalizeSchoolRows(schoolPayload, {
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  assert.equal(schools.length, 2);
  assert.equal(schools[0].schoolCode, "7010123");
  assert.equal(schools[0].atptOfcdcScCode, "B10");
  assert.equal(schools[0].source.freshness.status, SOURCE_FRESHNESS.FRESH);
});

test("resolveSchool does not auto-pick ambiguous school names", async () => {
  const result = await resolveSchool({
    schoolName: "서울미래",
    region: "서울",
    payload: schoolPayload,
    fetchedAt: "2026-05-01T00:00:00.000Z",
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, ERROR_STATUS.AMBIGUOUS);
  assert.equal(result.candidates.length, 2);
});

test("resolveSchool resolves unique name and level", async () => {
  const result = await resolveSchool({
    schoolName: "서울미래초등학교",
    schoolLevel: "초등학교",
    region: "서울",
    payload: schoolPayload,
  });

  assert.equal(result.ok, true);
  assert.equal(result.school.schoolCode, "7010123");
});

test("parseDishName extracts menu items and allergen numbers", () => {
  const parsed = parseDishName("돈육김치찌개(5.9.10)<br/>계란말이(1)<br/>깍두기(9)");

  assert.deepEqual(parsed.allergyNumbers, [1, 5, 9, 10]);
  assert.equal(parsed.menuItems.length, 3);
});

test("meal rows normalize allergy labels, calories, nutrition, and source", () => {
  const meals = normalizeMealRows(mealPayload, {
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  assert.equal(meals.length, 1);
  assert.equal(meals[0].date, "2026-05-01");
  assert.deepEqual(meals[0].allergyNumbers, [1, 5, 9, 10]);
  assert.ok(meals[0].allergens.includes("돼지고기"));
  assert.equal(meals[0].calories, "650.4 Kcal");
  assert.equal(meals[0].source.freshness.status, SOURCE_FRESHNESS.FRESH);
});

test("getMeals distinguishes no meal data", async () => {
  const result = await getMeals({
    schoolCode: "7010123",
    educationOfficeCode: "B10",
    date: "2026-05-01",
    payload: { mealServiceDietInfo: [{ head: [{ LIST_TOTAL_COUNT: 0 }] }] },
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, ERROR_STATUS.NOT_FOUND);
});

test("schedule rows normalize academic calendar items", async () => {
  const result = await getSchedule({
    schoolCode: "7010123",
    educationOfficeCode: "B10",
    startDate: "2026-05-01",
    endDate: "2026-05-02",
    payload: schedulePayload,
  });

  assert.equal(result.ok, true);
  assert.equal(result.scheduleItems.length, 2);
  assert.equal(result.scheduleItems[0].title, "현장체험학습");
  assert.equal(result.scheduleItems[0].date, "2026-05-01");
});

test("live NEIS request requires API key by default", async () => {
  await assert.rejects(
    () => requestNeisJson("schoolInfo", {}, { apiKey: "" }),
    /KEDU_INFO_KEY/,
  );
});

test("live NEIS request builds official URL with key and Korean headers", async () => {
  let fetchedUrl = "";
  const payload = { schoolInfo: [{ head: [{ LIST_TOTAL_COUNT: 0 }] }] };

  const result = await requestNeisJson("schoolInfo", {
    ATPT_OFCDC_SC_CODE: "B10",
    SCHUL_NM: "미래초",
  }, {
    apiKey: "test-key",
    fetchImpl: async (url, options = {}) => {
      fetchedUrl = String(url);
      assert.ok(options.headers["accept-language"].includes("ko-KR"));
      return new Response(JSON.stringify(payload), { status: 200 });
    },
  });

  assert.deepEqual(result, payload);
  assert.ok(fetchedUrl.includes("open.neis.go.kr/hub/schoolInfo"));
  assert.ok(fetchedUrl.includes("KEY=test-key"));
  assert.ok(fetchedUrl.includes("ATPT_OFCDC_SC_CODE=B10"));
  assert.ok(decodeURIComponent(fetchedUrl).includes("SCHUL_NM=미래초"));
});

function readFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, fileName), "utf8"));
}
