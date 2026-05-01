const SOURCE_FRESHNESS = Object.freeze({
  FRESH: "fresh",
  STALE: "stale",
  LAG_PRONE: "lag-prone",
  UNKNOWN: "unknown",
});

function toDate(value, label = "date") {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${label} must be a valid date.`);
  }

  return date;
}

function assessSourceFreshness(options = {}) {
  const now = toDate(options.now || new Date(), "now");
  const checkedAt = toDate(options.fetchedAt || options.confirmedAt || options.updatedAt, "checkedAt");
  const maxAgeHours = options.maxAgeHours == null ? 24 : Number(options.maxAgeHours);

  if (!checkedAt) {
    return {
      status: SOURCE_FRESHNESS.UNKNOWN,
      checkedAt: null,
      ageHours: null,
      maxAgeHours,
    };
  }

  if (!Number.isFinite(maxAgeHours) || maxAgeHours < 0) {
    throw new Error("maxAgeHours must be a non-negative number.");
  }

  const ageHours = Math.max(0, (now.getTime() - checkedAt.getTime()) / 36e5);

  return {
    status: ageHours <= maxAgeHours ? SOURCE_FRESHNESS.FRESH : SOURCE_FRESHNESS.STALE,
    checkedAt: checkedAt.toISOString(),
    ageHours: Math.round(ageHours * 100) / 100,
    maxAgeHours,
  };
}

function createSourceMetadata(options = {}) {
  if (!options.sourceName) {
    throw new Error("sourceName is required.");
  }

  const fetchedAt = toDate(options.fetchedAt || options.confirmedAt || options.updatedAt || new Date(), "fetchedAt");
  const freshness = options.freshness || assessSourceFreshness({
    fetchedAt,
    now: options.now,
    maxAgeHours: options.maxAgeHours,
  });

  return {
    sourceType: options.sourceType || "official",
    sourceName: options.sourceName,
    sourceUrl: options.sourceUrl || null,
    fetchedAt: fetchedAt.toISOString(),
    confirmedAt: options.confirmedAt ? toDate(options.confirmedAt, "confirmedAt").toISOString() : fetchedAt.toISOString(),
    updatedAt: options.updatedAt ? toDate(options.updatedAt, "updatedAt").toISOString() : null,
    freshness,
  };
}

module.exports = {
  SOURCE_FRESHNESS,
  assessSourceFreshness,
  createSourceMetadata,
  toDate,
};
