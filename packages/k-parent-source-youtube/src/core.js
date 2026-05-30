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

const FALLBACK_ERROR_STATUS = Object.freeze({
  MISSING_CONFIG: "MISSING_CONFIG",
  UPSTREAM_ERROR: "UPSTREAM_ERROR",
});

const ERROR_STATUS =
  core.ERROR_STATUS && typeof core.ERROR_STATUS === "object"
    ? core.ERROR_STATUS
    : FALLBACK_ERROR_STATUS;

function fallbackNormalizeSourceMetadata(input = {}) {
  return {
    source: input.source || null,
    source_id: input.source_id != null ? String(input.source_id) : null,
    fetched_at: input.fetched_at || new Date().toISOString(),
  };
}

const normalizeSourceMetadata =
  typeof core.normalizeSourceMetadata === "function"
    ? core.normalizeSourceMetadata
    : fallbackNormalizeSourceMetadata;

module.exports = { ERROR_STATUS, normalizeSourceMetadata };
