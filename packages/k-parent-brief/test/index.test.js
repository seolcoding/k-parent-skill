const test = require("node:test");
const assert = require("node:assert/strict");

const {
  SOURCE_FRESHNESS,
  normalizeSourceMetadata,
} = require("k-parent-core");
const { composeTodayBrief } = require("../src/index");

test("composeTodayBrief creates parent-facing sections with source freshness", () => {
  const source = normalizeSourceMetadata({
    sourceName: "NEIS mealServiceDietInfo",
    sourceUrl: "https://open.neis.go.kr/hub/mealServiceDietInfo",
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  const brief = composeTodayBrief({
    date: "2026-05-01",
    childProfile: {
      stage: "lower_elementary",
      allergies: ["돼지고기"],
    },
    school: {
      name: "서울미래초등학교",
      source,
    },
    meals: [
      {
        date: "2026-05-01",
        mealType: "중식",
        menuItems: ["현미밥", "돈육김치찌개(5.9.10)"],
        allergens: ["대두", "새우", "돼지고기"],
        allergyNumbers: [5, 9, 10],
        source,
      },
    ],
    scheduleItems: [
      {
        id: "event-1",
        title: "현장체험학습",
        description: "1학년 현장체험학습",
        date: "2026-05-01",
        startsAt: "2026-05-01",
        source,
      },
    ],
  });

  assert.equal(brief.ok, true);
  assert.equal(brief.summary.includes("급식 1건"), true);
  assert.equal(brief.warnings.some((warning) => warning.type === "allergy"), true);
  assert.equal(brief.todayTasks.length, 2);
  assert.equal(brief.calendarCandidates.length, 1);
  assert.equal(brief.calendarCandidates[0].requiresConfirmation, true);
  assert.equal(brief.calendarCandidates[0].executable, false);
  assert.equal(brief.sources[0].freshness.status, SOURCE_FRESHNESS.FRESH);
});

test("composeTodayBrief works with only child stage and no meal data", () => {
  const brief = composeTodayBrief({
    date: "2026-05-01",
    childProfile: { stage: "preschool" },
    meals: [],
    scheduleItems: [],
  });

  assert.equal(brief.ok, true);
  assert.equal(brief.child.stage, "preschool");
  assert.equal(brief.todayTasks.length, 0);
  assert.equal(brief.summary.includes("확인된 급식이 없습니다"), true);
});

test("composeTodayBrief warns on stale sources", () => {
  const source = normalizeSourceMetadata({
    sourceName: "NEIS SchoolSchedule",
    sourceUrl: "https://open.neis.go.kr/hub/SchoolSchedule",
    fetchedAt: "2026-04-29T00:00:00.000Z",
    now: "2026-05-01T12:00:00.000Z",
    maxAgeHours: 24,
  });

  const brief = composeTodayBrief({
    childProfile: { stage: "lower_elementary" },
    scheduleItems: [
      {
        title: "재량휴업일",
        date: "2026-05-01",
        source,
      },
    ],
  });

  assert.equal(brief.sources[0].freshness.status, SOURCE_FRESHNESS.STALE);
  assert.equal(brief.warnings.some((warning) => warning.type === "source_freshness"), true);
});

test("composeTodayBrief surfaces timetable, deadlines, and outings", () => {
  const source = normalizeSourceMetadata({
    sourceName: "NEIS elsTimetable",
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  const brief = composeTodayBrief({
    date: "2026-05-01",
    childProfile: { stage: "lower_elementary" },
    timetable: [
      { date: "2026-05-01", period: 1, subject: "국어", title: "1교시 국어", source },
      { date: "2026-05-01", period: 2, subject: "수학", title: "2교시 수학", source },
    ],
    applications: [
      { id: "app-near", title: "방과후 신청", dueAt: "2026-05-03", source },
      { id: "app-far", title: "돌봄교실 신청", dueAt: "2026-05-10", source },
      { id: "app-past", title: "지난 신청", dueAt: "2026-04-20", source },
    ],
    outings: [
      { id: "outing-1", title: "어린이대공원", location: "서울 광진구", source },
    ],
  });

  assert.equal(brief.ok, true);
  assert.equal(brief.timetable.length, 2);
  assert.equal(brief.upcomingDeadlines.length, 2);
  assert.equal(brief.upcomingDeadlines[0].id, "app-near");
  assert.equal(brief.upcomingDeadlines[0].daysLeft, 2);
  assert.equal(brief.suggestedOutings.length, 1);
  assert.equal(brief.summary.includes("시간표"), true);
  assert.equal(brief.summary.includes("다가오는 마감"), true);
  assert.equal(brief.summary.includes("추천 나들이"), true);
  assert.equal(brief.todayTasks.some((task) => task.type === "timetable_check"), true);
  assert.equal(brief.todayTasks.some((task) => task.type === "deadline_check"), true);
  assert.equal(brief.todayTasks.some((task) => task.type === "outing_suggestion"), true);
  assert.equal(brief.calendarCandidates.length, 2);
  assert.equal(brief.calendarCandidates.every((candidate) => candidate.requiresConfirmation), true);
});

test("composeTodayBrief can warn from child allergy numbers", () => {
  const source = normalizeSourceMetadata({
    sourceName: "NEIS mealServiceDietInfo",
    fetchedAt: "2026-05-01T00:00:00.000Z",
  });

  const brief = composeTodayBrief({
    childProfile: {
      stage: "lower_elementary",
      allergyNumbers: [10],
    },
    meals: [
      {
        date: "2026-05-01",
        mealType: "중식",
        menuItems: ["돈육김치찌개(5.9.10)"],
        allergens: ["대두", "새우", "돼지고기"],
        allergyNumbers: [5, 9, 10],
        source,
      },
    ],
  });

  assert.equal(brief.warnings.some((warning) => warning.type === "allergy"), true);
});
