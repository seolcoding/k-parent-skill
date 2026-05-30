"use strict";

const {
  normalizeInstitution,
  normalizeSourceMetadata,
} = require("k-parent-core");

function parseLibraries(payload, options = {}) {
  const libs =
    payload &&
    payload.response &&
    Array.isArray(payload.response.libs)
      ? payload.response.libs
      : [];

  const items = libs
    .map((entry) => entry && entry.lib)
    .filter(Boolean)
    .map((lib) => {
      const institution = normalizeInstitution({
        name: lib.libName,
        code: lib.libCode,
        address: lib.address,
        phone: lib.tel,
      });
      return {
        institution,
        libCode: lib.libCode || null,
        libName: lib.libName || null,
        address: lib.address || null,
        tel: lib.tel || null,
        homepage: lib.homepage || null,
        latitude: lib.latitude || null,
        longitude: lib.longitude || null,
      };
    });

  const metadata = normalizeSourceMetadata({
    sourceName: options.sourceName || "도서관정보나루 data4library",
    sourceType: "official",
    sourceUrl: options.sourceUrl || "https://data4library.kr/api",
    fetchedAt: options.fetchedAt,
    now: options.now,
    maxAgeHours: options.maxAgeHours,
  });

  return { items, metadata };
}

module.exports = {
  parseLibraries,
};
