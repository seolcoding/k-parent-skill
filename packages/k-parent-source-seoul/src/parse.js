"use strict";

const {
  normalizeInstitution,
  normalizeSourceMetadata,
} = require("k-parent-core");

function extractEnvelope(payload, service) {
  if (!payload || !service) return { rows: [], resultCode: null };
  const envelope = payload[service];
  if (!envelope) return { rows: [], resultCode: null };
  const result = envelope.RESULT || {};
  const rows = Array.isArray(envelope.row) ? envelope.row : [];
  return { rows, resultCode: result.CODE || null };
}

function parseReservations(payload, options = {}) {
  const service = options.service;
  const { rows, resultCode } = extractEnvelope(payload, service);

  const items = rows.map((row) => {
    const institution = normalizeInstitution({
      name: row.PLACENM,
      region: row.AREANM,
    });
    return {
      institution,
      svcId: row.SVCID || null,
      svcName: row.SVCNM || null,
      place: row.PLACENM || null,
      areaName: row.AREANM || null,
      useTarget: row.USETGTINFO || null,
      svcStatus: row.SVCSTATNM || null,
      rcptBgnDt: row.RCPTBGNDT || null,
      rcptEndDt: row.RCPTENDDT || null,
      svcUrl: row.SVCURL || null,
      x: row.X || null,
      y: row.Y || null,
    };
  });

  const metadata = normalizeSourceMetadata({
    source: options.source || "SeoulOpenData",
    fetched_at: options.fetchedAt,
    license: options.license,
    url: options.url,
  });

  return { items, metadata, resultCode };
}

module.exports = {
  parseReservations,
};
