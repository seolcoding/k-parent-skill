"use strict";

// Resolve k-parent-core by name. k-parent-core is a workspace dependency that
// provides shared metadata normalization and error status codes. During the
// parallel scaffolding phase the core package may not yet expose these symbols,
// so we fall back to a minimal local implementation that matches the documented
// contract (see docs/architecture.md). Once k-parent-core ships its real
// exports, those take precedence automatically.

let core = {};
try {
  // eslint-disable-next-line global-require
  core = require("k-parent-core") || {};
} catch (err) {
  if (err && err.code !== "MODULE_NOT_FOUND") {
    throw err;
  }
  core = {};
}

// Mirror k-parent-core/src/guardrails.js ERROR_STATUS values exactly so callers
// see the same status codes whether or not k-parent-core resolves at runtime.
const FALLBACK_ERROR_STATUS = Object.freeze({
  MISSING_CONFIG: "missing_config",
  AMBIGUOUS: "ambiguous",
  NOT_FOUND: "not_found",
  UPSTREAM_ERROR: "upstream_error",
  RATE_LIMITED: "rate_limited",
  PARSE_ERROR: "parse_error",
});

const ERROR_STATUS =
  core.ERROR_STATUS && typeof core.ERROR_STATUS === "object"
    ? core.ERROR_STATUS
    : FALLBACK_ERROR_STATUS;

// Mirror k-parent-core/src/freshness.js normalizeSourceMetadata return shape
// ({ name, type, url, fetchedAt, freshness }). sourceName is required.
function fallbackNormalizeSourceMetadata({
  sourceName = null,
  sourceType = "unknown",
  sourceUrl = null,
  fetchedAt = new Date(),
  now = new Date(),
  maxAgeHours = null,
} = {}) {
  if (!sourceName) {
    throw new Error("sourceName is required.");
  }
  const fetchedDate = fetchedAt ? new Date(fetchedAt) : null;
  const nowDate = now ? new Date(now) : null;
  const ageMs =
    fetchedDate &&
    nowDate &&
    !Number.isNaN(fetchedDate.getTime()) &&
    !Number.isNaN(nowDate.getTime())
      ? nowDate - fetchedDate
      : null;
  const ageHours = ageMs == null ? null : ageMs / (1000 * 60 * 60);
  let status = "unknown";
  if (ageHours != null && maxAgeHours != null) {
    status = ageHours <= maxAgeHours ? "fresh" : "stale";
  }
  return {
    name: sourceName,
    type: sourceType,
    url: sourceUrl,
    fetchedAt:
      fetchedDate && !Number.isNaN(fetchedDate.getTime())
        ? fetchedDate.toISOString()
        : null,
    freshness: { status, ageHours, maxAgeHours },
  };
}

const normalizeSourceMetadata =
  typeof core.normalizeSourceMetadata === "function"
    ? core.normalizeSourceMetadata
    : fallbackNormalizeSourceMetadata;

module.exports = { ERROR_STATUS, normalizeSourceMetadata };
