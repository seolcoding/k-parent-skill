const { normalizeSourceMetadata } = require("k-parent-core");

const DEDUPE_NOTE = "중복 제거는 호출자가 source/productId/link 기준으로 수행하세요. 수집기는 출처별 원본 행을 보존합니다.";

/**
 * Generic, dependency-injected data-collector runner.
 *
 * It does NOT require any sibling source package. Each task supplies its own
 * `fetch()` function (which may wrap a Naver/Coupang/NEIS adapter, a proxy, a
 * cache, etc.). The runner executes every task, stamps freshness/source
 * metadata, and surfaces failures explicitly — blocked or stale upstreams are
 * never silently hidden.
 *
 * @param {Array<{name:string, source:{name:string,url:string,type?:string}, fetch:()=>Promise<Array>, maxAgeHours?:number}>} tasks
 * @param {{now?:string|Date, fetchedAt?:string|Date}} options
 */
async function runCollector(tasks = [], options = {}) {
  if (!Array.isArray(tasks)) {
    throw new Error("tasks must be an array of collector definitions.");
  }

  const collectedAt = options.fetchedAt ? new Date(options.fetchedAt) : new Date();
  const now = options.now ? new Date(options.now) : collectedAt;

  const results = await Promise.all(tasks.map((task) => runTask(task, { collectedAt, now })));

  const failures = results.filter((result) => !result.ok);

  return {
    collectedAt: collectedAt.toISOString(),
    dedupeNote: DEDUPE_NOTE,
    okCount: results.length - failures.length,
    failureCount: failures.length,
    hasFailures: failures.length > 0,
    results,
    failures,
  };
}

async function runTask(task = {}, { collectedAt, now }) {
  const name = task.name || task?.source?.name || "unnamed-source";
  const source = normalizeSourceMetadata({
    sourceName: task?.source?.name || name,
    sourceType: task?.source?.type || "aggregated",
    sourceUrl: task?.source?.url || null,
    fetchedAt: collectedAt,
    now,
    maxAgeHours: task.maxAgeHours == null ? 24 : task.maxAgeHours,
  });

  if (typeof task.fetch !== "function") {
    return {
      ok: false,
      name,
      source,
      collectedAt: collectedAt.toISOString(),
      error: "task.fetch must be a function.",
      blocked: true,
      rows: [],
      count: 0,
    };
  }

  try {
    const rows = await task.fetch();
    const rowArray = Array.isArray(rows) ? rows : (rows == null ? [] : [rows]);
    return {
      ok: true,
      name,
      source,
      collectedAt: collectedAt.toISOString(),
      count: rowArray.length,
      rows: rowArray,
      dedupeNote: DEDUPE_NOTE,
    };
  } catch (error) {
    return {
      ok: false,
      name,
      source,
      collectedAt: collectedAt.toISOString(),
      error: error && error.message ? error.message : String(error),
      status: error && error.status ? error.status : null,
      blocked: true,
      rows: [],
      count: 0,
    };
  }
}

module.exports = {
  DEDUPE_NOTE,
  runCollector,
};
