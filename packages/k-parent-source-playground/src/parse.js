const { normalizeInstitution, normalizeSourceMetadata, normalizeStringArray } = require("k-parent-core");

// data.go.kr datasets ship in a few envelope shapes. Standard-data APIs usually
// return { response: { body: { items: [...] } } } where items is already an array,
// while some provider APIs nest items.item (array OR single object). Handle all.
function extractItems(payload) {
  const body = payload?.response?.body ?? payload?.body ?? payload;
  let items = body?.items;

  if (items && !Array.isArray(items) && items.item !== undefined) {
    items = items.item;
  }
  if (Array.isArray(items)) {
    return items;
  }
  if (items && typeof items === "object") {
    return [items];
  }
  // Some standard-data APIs return a top-level `data` array.
  if (Array.isArray(body?.data)) {
    return body.data;
  }
  return [];
}

function makeSource(name, options = {}) {
  return normalizeSourceMetadata({
    sourceName: name,
    sourceType: "official",
    sourceUrl: options.sourceUrl || (options.sourcePath ? `http://apis.data.go.kr${options.sourcePath}` : null),
    fetchedAt: options.fetchedAt || new Date(),
    now: options.now,
    maxAgeHours: options.maxAgeHours == null ? 24 : options.maxAgeHours,
  });
}

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

// pick first defined field from a list of candidate keys (param names vary by version)
function pick(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key];
    }
  }
  return null;
}

function normalizePlaygrounds(payload, options = {}) {
  const source = makeSource("행안부 어린이놀이시설", options);
  return extractItems(payload).map((row) => {
    const name = pick(row, ["pfctNm", "facltNm", "plagrndNm", "instlPlnmNm", "name"]) || "어린이놀이시설";
    const address = pick(row, ["ronaAddr", "rdnmadr", "lnmadr", "address", "addr"]);
    const facilities = normalizeStringArray(pick(row, ["instlMtrlCn", "plygmtrlCn", "facilities", "instlFcltyCn"]));
    const institution = normalizeInstitution({
      id: pick(row, ["pfctSn", "facltSn", "mngNo", "id"]),
      type: "playground",
      name,
      address,
      latitude: toNumberOrNull(pick(row, ["latitude", "la", "lat", "yCrdnt"])),
      longitude: toNumberOrNull(pick(row, ["longitude", "lo", "lng", "xCrdnt"])),
      source,
      updatedAt: pick(row, ["referenceDate", "lastUpdtDt", "crtrYmd"]),
    });
    return {
      ...institution,
      facilities,
      installPlaceType: pick(row, ["instlPlaceCdNm", "instlPlace", "lclasNm"]),
      raw: row,
    };
  });
}

function normalizeUrbanParks(payload, options = {}) {
  const source = makeSource("전국도시공원표준데이터", options);
  return extractItems(payload).map((row) => {
    const name = pick(row, ["parkNm", "prkNm", "name"]) || "도시공원";
    const address = pick(row, ["rdnmadr", "lnmadr", "address", "addr"]);
    const facilities = normalizeStringArray([
      pick(row, ["cnvnncFcltyCo", "convenienceFacility", "cnvnncFclty"]),
      pick(row, ["plgrndFcltyCo", "playgroundFacility"]),
      pick(row, ["amsmtFcltyCo", "amusementFacility"]),
    ].filter(Boolean));
    const institution = normalizeInstitution({
      id: pick(row, ["mngNo", "id", "prkSn"]),
      type: "urban_park",
      name,
      address,
      latitude: toNumberOrNull(pick(row, ["latitude", "la", "lat"])),
      longitude: toNumberOrNull(pick(row, ["longitude", "lo", "lng"])),
      source,
      updatedAt: pick(row, ["referenceDate", "crtrYmd"]),
    });
    return {
      ...institution,
      parkType: pick(row, ["parkSe", "prkSe", "lclasNm"]),
      facilities,
      raw: row,
    };
  });
}

module.exports = {
  extractItems,
  normalizePlaygrounds,
  normalizeUrbanParks,
};
