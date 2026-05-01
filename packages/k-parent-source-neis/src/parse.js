const {
  ERROR_STATUS,
  createErrorResult,
  normalizeInstitution,
  normalizeMeal,
  normalizeScheduleItem,
  normalizeSourceMetadata,
} = require("k-parent-core");

const ALLERGEN_LABELS = Object.freeze({
  1: "난류",
  2: "우유",
  3: "메밀",
  4: "땅콩",
  5: "대두",
  6: "밀",
  7: "고등어",
  8: "게",
  9: "새우",
  10: "돼지고기",
  11: "복숭아",
  12: "토마토",
  13: "아황산류",
  14: "호두",
  15: "닭고기",
  16: "쇠고기",
  17: "오징어",
  18: "조개류",
  19: "잣",
});

const EDUCATION_OFFICES = Object.freeze([
  { code: "B10", name: "서울특별시교육청", aliases: ["서울", "서울시", "서울특별시"] },
  { code: "C10", name: "부산광역시교육청", aliases: ["부산", "부산시", "부산광역시"] },
  { code: "D10", name: "대구광역시교육청", aliases: ["대구", "대구시", "대구광역시"] },
  { code: "E10", name: "인천광역시교육청", aliases: ["인천", "인천시", "인천광역시"] },
  { code: "F10", name: "광주광역시교육청", aliases: ["광주", "광주시", "광주광역시"] },
  { code: "G10", name: "대전광역시교육청", aliases: ["대전", "대전시", "대전광역시"] },
  { code: "H10", name: "울산광역시교육청", aliases: ["울산", "울산시", "울산광역시"] },
  { code: "I10", name: "세종특별자치시교육청", aliases: ["세종", "세종시", "세종특별자치시"] },
  { code: "J10", name: "경기도교육청", aliases: ["경기", "경기도"] },
  { code: "K10", name: "강원특별자치도교육청", aliases: ["강원", "강원도", "강원특별자치도"] },
  { code: "M10", name: "충청북도교육청", aliases: ["충북", "충청북도"] },
  { code: "N10", name: "충청남도교육청", aliases: ["충남", "충청남도"] },
  { code: "P10", name: "전라북도교육청", aliases: ["전북", "전라북도"] },
  { code: "Q10", name: "전라남도교육청", aliases: ["전남", "전라남도"] },
  { code: "R10", name: "경상북도교육청", aliases: ["경북", "경상북도"] },
  { code: "S10", name: "경상남도교육청", aliases: ["경남", "경상남도"] },
  { code: "T10", name: "제주특별자치도교육청", aliases: ["제주", "제주도", "제주특별자치도"] },
]);

function normalizeDateInput(value) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error("date must be a valid Date or YYYY-MM-DD string.");
    }

    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.formatToParts(value).reduce((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});
    return buildDateParts(parts.year, parts.month, parts.day);
  }

  const match = String(value || "").trim().match(/^(\d{4})[-.]?(\d{2})[-.]?(\d{2})$/);
  if (!match || !isValidCalendarDate(match[1], match[2], match[3])) {
    throw new Error("date must be a valid Date or YYYY-MM-DD string.");
  }

  return buildDateParts(match[1], match[2], match[3]);
}

function normalizeDateRange(startDate, endDate = startDate) {
  const start = normalizeDateInput(startDate);
  const end = normalizeDateInput(endDate);

  if (start.compactDate > end.compactDate) {
    throw new Error("startDate must be before or equal to endDate.");
  }

  return { start, end };
}

function resolveEducationOffice(input) {
  const text = normalizeToken(input);
  if (!text) {
    return { ok: false, status: ERROR_STATUS.NOT_FOUND, candidates: [] };
  }

  const exact = EDUCATION_OFFICES.find((office) => office.code === String(input).trim().toUpperCase());
  if (exact) {
    return { ok: true, ...exact, input };
  }

  const matches = EDUCATION_OFFICES.filter((office) => {
    const tokens = [office.name, ...office.aliases].map(normalizeToken);
    return tokens.some((token) => token.includes(text) || text.includes(token));
  });

  if (matches.length === 1) {
    return { ok: true, ...matches[0], input };
  }

  return {
    ok: false,
    status: matches.length ? ERROR_STATUS.AMBIGUOUS : ERROR_STATUS.NOT_FOUND,
    input,
    candidates: matches,
  };
}

function extractRows(payload, datasetName) {
  const block = payload?.[datasetName];
  if (!Array.isArray(block)) {
    return [];
  }

  const rowBlock = block.find((item) => Array.isArray(item?.row));
  return rowBlock?.row || [];
}

function normalizeSchoolRows(payload, options = {}) {
  const source = makeNeisSource("schoolInfo", options);
  return extractRows(payload, "schoolInfo").map((row) => {
    const school = normalizeInstitution({
      id: row.SD_SCHUL_CODE,
      type: "school",
      officialCode: row.SD_SCHUL_CODE,
      educationOfficeCode: row.ATPT_OFCDC_SC_CODE,
      name: row.SCHUL_NM,
      address: row.ORG_RDNMA || row.ORG_RDNDA || row.ORG_RDNMA,
      source,
      updatedAt: row.LOAD_DTM || null,
    });

    return {
      ...school,
      schoolCode: row.SD_SCHUL_CODE,
      atptOfcdcScCode: row.ATPT_OFCDC_SC_CODE,
      educationOfficeName: row.ATPT_OFCDC_SC_NM || null,
      schoolLevel: row.SCHUL_KND_SC_NM || null,
      homepage: row.HMPG_ADRES || null,
      telephone: row.ORG_TELNO || null,
      raw: row,
    };
  });
}

function resolveSchoolFromRows(payload, options = {}) {
  const candidates = normalizeSchoolRows(payload, options)
    .filter((school) => {
      if (!options.schoolName) {
        return true;
      }
      return normalizeToken(school.name).includes(normalizeToken(options.schoolName));
    })
    .filter((school) => {
      if (!options.schoolLevel) {
        return true;
      }
      return normalizeToken(school.schoolLevel).includes(normalizeToken(options.schoolLevel));
    });

  if (candidates.length === 1) {
    return {
      ok: true,
      status: "resolved",
      school: candidates[0],
      candidates,
    };
  }

  if (candidates.length > 1) {
    return createErrorResult(ERROR_STATUS.AMBIGUOUS, "학교명이 여러 후보와 일치합니다.", { candidates });
  }

  return createErrorResult(ERROR_STATUS.NOT_FOUND, "일치하는 학교를 찾지 못했습니다.", { candidates: [] });
}

function normalizeMealRows(payload, options = {}) {
  const source = makeNeisSource("mealServiceDietInfo", options);
  return extractRows(payload, "mealServiceDietInfo").map((row) => {
    const parsedMenu = parseDishName(row.DDISH_NM);
    return {
      ...normalizeMeal({
        date: compactDateToIso(row.MLSV_YMD),
        mealType: row.MMEAL_SC_NM || row.MMEAL_SC_CODE || null,
        institution: {
          schoolCode: row.SD_SCHUL_CODE,
          atptOfcdcScCode: row.ATPT_OFCDC_SC_CODE,
          name: row.SCHUL_NM || null,
        },
        menuItems: parsedMenu.menuItems,
        allergens: parsedMenu.allergyNumbers.map((number) => ALLERGEN_LABELS[number]).filter(Boolean),
        allergyNumbers: parsedMenu.allergyNumbers,
        origin: row.ORPLC_INFO || null,
        calories: row.CAL_INFO || null,
        nutrition: row.NTR_INFO || null,
        source,
      }),
      raw: row,
    };
  });
}

function normalizeScheduleRows(payload, options = {}) {
  const source = makeNeisSource("SchoolSchedule", options);
  return extractRows(payload, "SchoolSchedule").map((row) => normalizeScheduleItem({
    id: [row.SD_SCHUL_CODE, row.AA_YMD, row.EVENT_NM].filter(Boolean).join(":") || null,
    title: row.EVENT_NM || row.EVENT_CNTNT || "학사일정",
    description: row.EVENT_CNTNT || null,
    date: compactDateToIso(row.AA_YMD),
    startsAt: compactDateToIso(row.AA_YMD),
    endsAt: compactDateToIso(row.AA_YMD),
    institution: {
      schoolCode: row.SD_SCHUL_CODE,
      atptOfcdcScCode: row.ATPT_OFCDC_SC_CODE,
      name: row.SCHUL_NM || null,
    },
    source,
  }));
}

function parseDishName(value) {
  const menuItems = String(value || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/\s+/g, " "));

  const allergyNumbers = Array.from(new Set(
    menuItems.flatMap((item) => {
      const matches = Array.from(item.matchAll(/\(([\d.]+)\)/g));
      return matches.flatMap((match) => match[1].split(".").map(Number).filter((number) => Number.isInteger(number) && number >= 1 && number <= 19));
    }),
  )).sort((left, right) => left - right);

  return {
    menuItems,
    allergyNumbers,
  };
}

function makeNeisSource(dataset, options = {}) {
  const endpoint = options.sourceUrl || `https://open.neis.go.kr/hub/${dataset}`;
  return normalizeSourceMetadata({
    sourceName: `NEIS ${dataset}`,
    sourceType: "official",
    sourceUrl: endpoint,
    fetchedAt: options.fetchedAt || new Date(),
    now: options.now,
    maxAgeHours: options.maxAgeHours == null ? 24 : options.maxAgeHours,
  });
}

function compactDateToIso(value) {
  const match = String(value || "").match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!match) {
    return null;
  }
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function buildDateParts(year, month, day) {
  return {
    isoDate: `${year}-${month}-${day}`,
    compactDate: `${year}${month}${day}`,
  };
}

function isValidCalendarDate(year, month, day) {
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  return date.getUTCFullYear() === Number(year)
    && date.getUTCMonth() + 1 === Number(month)
    && date.getUTCDate() === Number(day);
}

function normalizeToken(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

module.exports = {
  ALLERGEN_LABELS,
  EDUCATION_OFFICES,
  compactDateToIso,
  extractRows,
  normalizeDateInput,
  normalizeDateRange,
  normalizeMealRows,
  normalizeScheduleRows,
  normalizeSchoolRows,
  parseDishName,
  resolveEducationOffice,
  resolveSchoolFromRows,
};
