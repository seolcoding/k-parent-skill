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
  const timetable = normalizeList(input.timetable);
  const applications = normalizeList(input.applications);
  const outings = normalizeList(input.outings);
  const upcomingDeadlines = buildUpcomingDeadlines({ applications, date });
  const suggestedOutings = buildSuggestedOutings({ outings, date });
  const sources = collectSources([
    input.school,
    ...meals,
    ...scheduleItems,
    ...timetable,
    ...applications,
    ...outings,
  ]);
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
    timetable,
    upcomingDeadlines,
    suggestedOutings,
    date,
  });
  const calendarCandidates = buildCalendarCandidates(scheduleItems, applications);

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
      timetable,
      upcomingDeadlines,
      suggestedOutings,
      warnings,
    }),
    warnings,
    todayTasks,
    timetable,
    upcomingDeadlines,
    suggestedOutings,
    calendarCandidates,
    sources,
  };
}

function buildSummary({ date, meals, scheduleItems, timetable, upcomingDeadlines, suggestedOutings, warnings }) {
  const mealCount = meals.length;
  const scheduleCount = scheduleItems.length;
  const warningCount = warnings.length;
  const timetableCount = normalizeList(timetable).length;
  const deadlineCount = normalizeList(upcomingDeadlines).length;
  const outingCount = normalizeList(suggestedOutings).length;

  const parts = [`${date || "오늘"} 기준 브리핑입니다.`];
  parts.push(mealCount ? `급식 ${mealCount}건을 확인했습니다.` : "확인된 급식이 없습니다.");
  parts.push(scheduleCount ? `학사일정 ${scheduleCount}건이 있습니다.` : "확인된 학사일정은 없습니다.");
  if (timetableCount) {
    parts.push(`시간표 ${timetableCount}교시를 확인했습니다.`);
  }
  if (deadlineCount) {
    parts.push(`다가오는 마감 ${deadlineCount}건이 있습니다.`);
  }
  if (outingCount) {
    parts.push(`추천 나들이 ${outingCount}건을 제안했습니다.`);
  }
  if (warningCount) {
    parts.push(`주의 항목 ${warningCount}건을 확인하세요.`);
  }

  return parts.join(" ");
}

function buildUpcomingDeadlines({ applications, date }) {
  const today = toComparableDate(date);

  return normalizeList(applications)
    .map((application) => {
      const dueAt = application.dueAt || application.deadline || application.endDate || application.date || null;
      return {
        id: application.id || null,
        title: application.title || application.name || application.label || "신청 마감",
        description: application.description || null,
        dueAt,
        daysLeft: today != null && dueAt ? diffDays(today, toComparableDate(dueAt)) : null,
        officialUrl: application.officialUrl || application.url || null,
        source: application.source || null,
        application,
      };
    })
    .filter((deadline) => deadline.daysLeft == null || deadline.daysLeft >= 0)
    .sort((left, right) => {
      if (left.daysLeft == null) {
        return 1;
      }
      if (right.daysLeft == null) {
        return -1;
      }
      return left.daysLeft - right.daysLeft;
    });
}

function buildSuggestedOutings({ outings, date }) {
  return normalizeList(outings).map((outing) => ({
    id: outing.id || null,
    title: outing.title || outing.name || "추천 나들이",
    description: outing.description || null,
    location: outing.location || outing.place || outing.address || null,
    date: outing.date || date || null,
    officialUrl: outing.officialUrl || outing.url || null,
    source: outing.source || null,
    outing,
  }));
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

function buildTodayTasks({ meals, scheduleItems, timetable, upcomingDeadlines, suggestedOutings, date }) {
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

  const timetableItems = normalizeList(timetable);
  if (timetableItems.length) {
    const subjects = timetableItems
      .map((entry) => entry.subject || entry.title)
      .filter(Boolean);
    tasks.push({
      type: "timetable_check",
      title: "오늘 시간표 확인",
      description: subjects.length ? subjects.join(", ") : "시간표를 확인했습니다.",
      date: timetableItems[0]?.date || date,
      source: timetableItems[0]?.source || null,
    });
  }

  for (const deadline of normalizeList(upcomingDeadlines)) {
    tasks.push({
      type: "deadline_check",
      title: `${deadline.title} 마감 확인`,
      description: deadline.daysLeft != null
        ? `마감까지 ${deadline.daysLeft}일 남았습니다.`
        : (deadline.description || "마감일을 확인하세요."),
      date: deadline.dueAt || date,
      officialUrl: deadline.officialUrl || null,
      source: deadline.source || null,
    });
  }

  for (const outing of normalizeList(suggestedOutings)) {
    tasks.push({
      type: "outing_suggestion",
      title: outing.title,
      description: outing.description || outing.location || "추천 나들이입니다.",
      date: outing.date || date,
      officialUrl: outing.officialUrl || null,
      source: outing.source || null,
    });
  }

  return tasks;
}

function buildCalendarCandidates(scheduleItems, applications = []) {
  const scheduleCandidates = normalizeList(scheduleItems).map((item) => guardActionCandidate({
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

  const applicationCandidates = normalizeList(applications).map((application) => guardActionCandidate({
    id: application.id || null,
    type: "calendar_write",
    title: application.title || application.name || application.label || "신청 마감",
    description: application.description || null,
    dueAt: application.dueAt || application.deadline || application.endDate || application.date || null,
    source: application.source || null,
    metadata: {
      application,
    },
  }));

  return [...scheduleCandidates, ...applicationCandidates];
}

function toComparableDate(value) {
  const match = String(value || "").match(/^(\d{4})-?(\d{2})-?(\d{2})/);
  if (!match) {
    return null;
  }
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function diffDays(fromMs, toMs) {
  if (fromMs == null || toMs == null) {
    return null;
  }
  return Math.round((toMs - fromMs) / 86400000);
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
