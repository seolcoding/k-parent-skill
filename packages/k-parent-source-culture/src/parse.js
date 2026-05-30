"use strict";

const {
  normalizeInstitution,
  normalizeSourceMetadata,
} = require("k-parent-core");

function extractRows(payload) {
  if (!payload) return [];
  const body =
    payload.response &&
    payload.response.msgBody &&
    payload.response.msgBody.perforList;
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") return [body];
  return [];
}

function parseCultureEvents(payload, options = {}) {
  const rows = extractRows(payload);

  const items = rows.map((row) => {
    const institution = normalizeInstitution({
      name: row.place,
      region: row.area,
    });
    return {
      institution,
      title: row.title || null,
      place: row.place || null,
      startDate: row.startDate || null,
      endDate: row.endDate || null,
      area: row.area || null,
      genre: row.realmName || row.genre || null,
      url: row.url || null,
      image: row.thumbnail || row.imgUrl || null,
      charge: row.charge || null,
    };
  });

  const metadata = normalizeSourceMetadata({
    sourceName: options.sourceName || "문화포털 공연전시정보",
    sourceType: "official",
    sourceUrl:
      options.sourceUrl ||
      "http://www.culture.go.kr/openapi/rest/publicperformancedisplays",
    fetchedAt: options.fetchedAt,
    now: options.now,
    maxAgeHours: options.maxAgeHours,
  });

  return { items, metadata };
}

module.exports = {
  parseCultureEvents,
};
