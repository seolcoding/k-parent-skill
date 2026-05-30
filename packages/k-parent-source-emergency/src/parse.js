const {
  normalizeInstitution,
  normalizeSourceMetadata,
} = require("k-parent-core");

function pickRows(payload) {
  // data.go.kr 공통 응답: response.body.items.item (배열 또는 단일 객체)
  const items = payload?.response?.body?.items?.item;
  if (!items) {
    return [];
  }
  return Array.isArray(items) ? items : [items];
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

// e-gen 운영시간은 요일별 시작/종료(dutyTime1s/dutyTime1c ... dutyTime8s/dutyTime8c)로 제공됨.
function collectHours(row) {
  const days = ["월", "화", "수", "목", "금", "토", "일", "공휴일"];
  const hours = {};
  for (let i = 1; i <= 8; i += 1) {
    const start = row[`dutyTime${i}s`];
    const close = row[`dutyTime${i}c`];
    if (start || close) {
      hours[days[i - 1]] = { start: start || null, close: close || null };
    }
  }
  return Object.keys(hours).length ? hours : null;
}

function normalizeFacilityRows(payload, options = {}) {
  const source = normalizeSourceMetadata({
    sourceName: `data.go.kr ${options.label || "e-gen"}`,
    sourceType: "official",
    sourceUrl: options.sourceUrl || "https://www.e-gen.or.kr",
    fetchedAt: options.fetchedAt || new Date(),
    now: options.now,
    maxAgeHours: options.maxAgeHours == null ? 6 : options.maxAgeHours,
  });

  return pickRows(payload).map((row) => {
    const id = row.hpid || row.dutyName || row.id;
    const inst = normalizeInstitution({
      id,
      type: options.type || "facility",
      name: row.dutyName || row.name,
      address: row.dutyAddr || row.address,
      source,
    });
    return {
      ...inst,
      tel: row.dutyTel1 || row.tel || null,
      latitude: toNumber(row.wgs84Lat ?? row.latitude),
      longitude: toNumber(row.wgs84Lon ?? row.longitude),
      hours: collectHours(row),
      raw: row,
    };
  });
}

module.exports = {
  pickRows,
  collectHours,
  normalizeFacilityRows,
};
