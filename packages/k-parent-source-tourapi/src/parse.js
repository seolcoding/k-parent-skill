const { normalizeInstitution, normalizeSourceMetadata } = require("k-parent-core");

// TourAPI envelope: response.body.items.item — can be an array OR a single object.
function extractItems(payload) {
  const items = payload?.response?.body?.items?.item;
  if (Array.isArray(items)) {
    return items;
  }
  if (items && typeof items === "object") {
    return [items];
  }
  return [];
}

function makeTourapiSource(operation, options = {}) {
  return normalizeSourceMetadata({
    sourceName: `TourAPI ${operation}`,
    sourceType: "official",
    sourceUrl: options.sourceUrl || `http://apis.data.go.kr/B551011/KorService2/${operation}`,
    fetchedAt: options.fetchedAt || new Date(),
    now: options.now,
    maxAgeHours: options.maxAgeHours == null ? 24 : options.maxAgeHours,
  });
}

function compactToIso(value) {
  const match = String(value || "").match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!match) {
    return null;
  }
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeFestivals(payload, options = {}) {
  const source = makeTourapiSource(options.operation || "searchFestival2", options);
  return extractItems(payload).map((row) => ({
    contentId: row.contentid || null,
    contentTypeId: row.contenttypeid || null,
    title: row.title || null,
    addr: [row.addr1, row.addr2].filter(Boolean).join(" ").trim() || null,
    startDate: compactToIso(row.eventstartdate),
    endDate: compactToIso(row.eventenddate),
    image: row.firstimage || row.firstimage2 || null,
    mapx: toNumberOrNull(row.mapx),
    mapy: toNumberOrNull(row.mapy),
    tel: row.tel || null,
    areaCode: row.areacode || null,
    sigunguCode: row.sigungucode || null,
    source,
    raw: row,
  }));
}

function normalizeSpots(payload, options = {}) {
  const source = makeTourapiSource(options.operation || "areaBasedList2", options);
  return extractItems(payload).map((row) => {
    const institution = normalizeInstitution({
      id: row.contentid,
      type: "tourist_spot",
      officialCode: row.contentid,
      name: row.title || "관광지",
      address: [row.addr1, row.addr2].filter(Boolean).join(" ").trim() || null,
      latitude: toNumberOrNull(row.mapy),
      longitude: toNumberOrNull(row.mapx),
      source,
      updatedAt: row.modifiedtime || null,
    });

    return {
      ...institution,
      contentId: row.contentid || null,
      contentTypeId: row.contenttypeid || null,
      image: row.firstimage || row.firstimage2 || null,
      mapx: toNumberOrNull(row.mapx),
      mapy: toNumberOrNull(row.mapy),
      tel: row.tel || null,
      dist: toNumberOrNull(row.dist),
      areaCode: row.areacode || null,
      sigunguCode: row.sigungucode || null,
      cat1: row.cat1 || null,
      cat2: row.cat2 || null,
      cat3: row.cat3 || null,
      raw: row,
    };
  });
}

module.exports = {
  extractItems,
  compactToIso,
  normalizeFestivals,
  normalizeSpots,
};
