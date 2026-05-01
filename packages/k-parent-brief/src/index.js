const {
  SOURCE_FRESHNESS,
  guardActionCandidate,
  normalizeChildProfile,
} = require("k-parent-core");

function composeTodayBrief(input = {}) {
  const childProfile = normalizeChildProfile(input.childProfile || input.child || { stage: input.childStage || "unknown" });
  const date = input.date || inferDate(input.meals, input.scheduleItems);
  const meals = normalizeList(input.meals);
  const scheduleItems = normalizeList(input.scheduleItems);
  const sources = collectSources([input.school, ...meals, ...scheduleItems]);
  const warnings = buildWarnings({
    childProfile,
    meals,
    scheduleItems,
    sources,
    upstreamWarnings: input.warnings,
  });
  const todayTasks = buildTodayTasks({
    meals,
    scheduleItems,
    date,
  });
  const calendarCandidates = buildCalendarCandidates(scheduleItems);

  return {
    ok: true,
    kind: "today_brief",
    date,
    child: childProfile,
    school: input.school || null,
    summary: buildSummary({
      date,
      meals,
      scheduleItems,
      warnings,
    }),
    warnings,
    todayTasks,
    calendarCandidates,
    sources,
  };
}

function buildSummary({ date, meals, scheduleItems, warnings }) {
  const mealCount = meals.length;
  const scheduleCount = scheduleItems.length;
  const warningCount = warnings.length;

  const parts = [`${date || "오늘"} 기준 브리핑입니다.`];
  parts.push(mealCount ? `급식 ${mealCount}건을 확인했습니다.` : "확인된 급식이 없습니다.");
  parts.push(scheduleCount ? `학사일정 ${scheduleCount}건이 있습니다.` : "확인된 학사일정은 없습니다.");
  if (warningCount) {
    parts.push(`주의 항목 ${warningCount}건을 확인하세요.`);
  }

  return parts.join(" ");
}

function buildWarnings({ childProfile, meals, sources, upstreamWarnings }) {
  const warnings = normalizeList(upstreamWarnings).map((warning) => ({
    type: warning.type || "notice",
    message: warning.message || String(warning),
    source: warning.source || null,
  }));
  const allergyHints = new Set((childProfile.allergies || []).map(normalizeToken).filter(Boolean));
  const allergyNumbers = new Set((childProfile.allergyNumbers || []).map(Number).filter(Number.isFinite));

  for (const meal of meals) {
    const matchedLabels = (meal.allergens || []).filter((label) => allergyHints.has(normalizeToken(label)));
    const matchedNumbers = (meal.allergyNumbers || []).filter((number) => allergyNumbers.has(Number(number)));

    if (matchedLabels.length || matchedNumbers.length) {
      warnings.push({
        type: "allergy",
        message: `급식에 주의 알레르기 항목이 포함되어 있습니다: ${[...matchedLabels, ...matchedNumbers.map(String)].join(", ")}`,
        source: meal.source || null,
        meal,
      });
    }
  }

  for (const source of sources) {
    if (source?.freshness?.status === SOURCE_FRESHNESS.STALE || source?.freshness?.status === SOURCE_FRESHNESS.UNKNOWN) {
      warnings.push({
        type: "source_freshness",
        message: `${source.sourceName || "출처"}의 최신성을 확인해야 합니다.`,
        source,
      });
    }
  }

  return warnings;
}

function buildTodayTasks({ meals, scheduleItems, date }) {
  const tasks = [];

  for (const meal of meals) {
    tasks.push({
      type: "meal_check",
      title: `${meal.mealType || "급식"} 확인`,
      description: meal.menuItems?.length ? meal.menuItems.join(", ") : "급식 메뉴를 확인했습니다.",
      date: meal.date || date,
      source: meal.source || null,
    });
  }

  for (const item of scheduleItems) {
    tasks.push({
      type: "schedule_check",
      title: item.title,
      description: item.description || null,
      date: item.date || date,
      source: item.source || null,
    });
  }

  return tasks;
}

function buildCalendarCandidates(scheduleItems) {
  return scheduleItems.map((item) => guardActionCandidate({
    id: item.id,
    type: "calendar_write",
    title: item.title,
    description: item.description,
    dueAt: item.startsAt || item.date,
    source: item.source || null,
    metadata: {
      scheduleItem: item,
    },
  }));
}

function collectSources(items) {
  const byKey = new Map();

  for (const item of items.flat()) {
    const source = item?.source;
    if (!source) {
      continue;
    }
    const key = [source.sourceName, source.sourceUrl, source.fetchedAt].join("|");
    byKey.set(key, source);
  }

  return Array.from(byKey.values());
}

function inferDate(meals = [], scheduleItems = []) {
  return meals[0]?.date || scheduleItems[0]?.date || null;
}

function normalizeList(value) {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function normalizeToken(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

module.exports = {
  composeTodayBrief,
};
