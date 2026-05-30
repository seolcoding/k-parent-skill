// Pure Korean notice parsing. OCR / image-to-text is performed by the model
// elsewhere; these functions only operate on already-extracted plain text.

function pad(num) {
  return String(num).padStart(2, "0");
}

function normalizeYmd(year, month, day) {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  if (!Number.isFinite(m) || !Number.isFinite(d) || m < 1 || m > 12 || d < 1 || d > 31) {
    return null;
  }
  if (Number.isFinite(y)) {
    return `${y}-${pad(m)}-${pad(d)}`;
  }
  return `${pad(m)}-${pad(d)}`; // year unknown
}

// Date patterns are built fresh per call so the stateful `lastIndex` of global
// regexes is never shared across calls (avoids order-dependent flakiness).
// Korean: 2026년 6월 10일, 2026년6월10일, 6월 10일, optional (요일)
const KOREAN_DATE_SRC = "(?:(\\d{4})\\s*년\\s*)?(\\d{1,2})\\s*월\\s*(\\d{1,2})\\s*일(?:\\s*\\(?[월화수목금토일]\\)?)?";
// Numeric: 2026.06.10, 06.10, 2026/06/10, 06/10, 2026-06-10
const NUMERIC_DATE_SRC = "(?:(\\d{4})[./-])?(\\d{1,2})[./-](\\d{1,2})(?:\\s*\\(?[월화수목금토일]\\)?)?";

function extractDatesFromLine(line) {
  const found = [];
  let match;

  const koreanDate = new RegExp(KOREAN_DATE_SRC, "g");
  while ((match = koreanDate.exec(line)) !== null) {
    const date = normalizeYmd(match[1], match[2], match[3]);
    if (date) {
      found.push({ date, index: match.index, length: match[0].length, text: match[0] });
    }
  }

  const numericDate = new RegExp(NUMERIC_DATE_SRC, "g");
  while ((match = numericDate.exec(line)) !== null) {
    // Skip ratios / non-dates like times "09:00" (handled by separator) and
    // pure numbers; require at least one date-like separator already in regex.
    const date = normalizeYmd(match[1], match[2], match[3]);
    if (date) {
      found.push({ date, index: match.index, length: match[0].length, text: match[0] });
    }
  }

  // De-duplicate overlapping matches (Korean form wins by lower index already).
  found.sort((a, b) => a.index - b.index);
  const result = [];
  let lastEnd = -1;
  for (const item of found) {
    if (item.index >= lastEnd) {
      result.push(item);
      lastEnd = item.index + item.length;
    }
  }
  return result;
}

function lines(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function extractEvents(text) {
  const events = [];
  for (const line of lines(text)) {
    const dates = extractDatesFromLine(line);
    if (!dates.length) {
      continue;
    }
    for (const found of dates) {
      const title = line.replace(found.text, "").replace(/[-–~:()]/g, " ").trim() || line;
      events.push({ date: found.date, title, raw: line });
    }
  }
  return events;
}

const SUPPLY_MARKERS = /(?:준비물|지참(?:물|할\s*것)?|챙겨[\s]*올?\s*것|가져올\s*것|준비\s*사항)\s*[:：\-]?\s*(.+)/;

function splitItems(segment) {
  return String(segment)
    .split(/[,，、/·]|\s{2,}/)
    .map((item) => item.replace(/[.。]$/, "").trim())
    .filter(Boolean);
}

function extractSupplies(text) {
  const items = [];
  for (const line of lines(text)) {
    const match = line.match(SUPPLY_MARKERS);
    if (match && match[1]) {
      for (const item of splitItems(match[1])) {
        if (!items.includes(item)) {
          items.push(item);
        }
      }
    }
  }
  return items;
}

// Any of these words signals a deadline line. Order matters for labeling:
// stronger deadline words (마감/제출/회신/...) win over the weaker 신청 so that
// "신청서 회신 마감" is labeled as a 마감, not 신청.
const DEADLINE_WORDS = ["마감", "제출", "회신", "접수", "납부", "반납", "신청"];
const DEADLINE_MARKER = new RegExp(`(${DEADLINE_WORDS.join("|")})`);

function deadlineLabel(line) {
  for (const word of DEADLINE_WORDS) {
    if (line.includes(word)) {
      return word;
    }
  }
  return "마감";
}

function extractDeadlines(text) {
  const deadlines = [];
  for (const line of lines(text)) {
    if (!DEADLINE_MARKER.test(line)) {
      continue;
    }
    const dates = extractDatesFromLine(line);
    if (!dates.length) {
      continue;
    }
    const label = deadlineLabel(line);
    for (const found of dates) {
      deadlines.push({
        label,
        date: found.date,
        raw: line,
      });
    }
  }
  return deadlines;
}

const ACADEMY_KEYWORDS = [
  { type: "makeup", re: /보강|보충/ },
  { type: "absence", re: /결석|결강|불참/ },
  { type: "homework", re: /숙제|과제/ },
  { type: "exam", re: /시험|테스트|평가|레벨\s*테스트/ },
  { type: "payment", re: /수강료|교습비|납부|결제|학원비/ },
  { type: "shuttle", re: /차량|셔틀|버스|등하원/ },
  { type: "class", re: /수업|개강|휴강|보충\s*수업|특강|시간표|반\s*편성/ },
];

function classifyAcademy(line) {
  for (const { type, re } of ACADEMY_KEYWORDS) {
    if (re.test(line)) {
      return type;
    }
  }
  return null;
}

function extractAcademyNotice(text) {
  const notices = [];
  for (const line of lines(text)) {
    const type = classifyAcademy(line);
    if (!type) {
      continue;
    }
    const dates = extractDatesFromLine(line);
    const date = dates.length ? dates[0].date : null;
    notices.push({ type, date, detail: line });
  }
  return notices;
}

module.exports = {
  extractEvents,
  extractSupplies,
  extractDeadlines,
  extractAcademyNotice,
};
