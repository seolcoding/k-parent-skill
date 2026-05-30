const test = require("node:test");
const assert = require("node:assert/strict");

const { SOURCE_FRESHNESS } = require("k-parent-core");
const { runCollector, DEDUPE_NOTE } = require("../src/collector");

const baseOptions = {
  fetchedAt: "2026-05-30T00:00:00.000Z",
  now: "2026-05-30T01:00:00.000Z",
};

test("runCollector runs injected fetchers and stamps source + freshness", async () => {
  const report = await runCollector([
    {
      name: "naver-shop",
      source: { name: "Naver Shopping", url: "https://openapi.naver.com/v1/search/shop.json", type: "commercial" },
      fetch: async () => [{ title: "a" }, { title: "b" }],
    },
    {
      name: "coupang",
      source: { name: "Coupang Partners", url: "https://api-gateway.coupang.com" },
      fetch: async () => ({ title: "single" }),
    },
  ], baseOptions);

  assert.equal(report.okCount, 2);
  assert.equal(report.failureCount, 0);
  assert.equal(report.hasFailures, false);
  assert.equal(report.dedupeNote, DEDUPE_NOTE);
  assert.equal(report.results[0].count, 2);
  assert.equal(report.results[1].count, 1, "non-array result is wrapped to a single row");
  assert.equal(report.results[0].source.freshness.status, SOURCE_FRESHNESS.FRESH);
  assert.equal(report.results[0].source.sourceName, "Naver Shopping");
});

test("runCollector surfaces failures instead of hiding blocked/stale sources", async () => {
  const report = await runCollector([
    {
      name: "ok-source",
      source: { name: "OK", url: "https://example.com" },
      fetch: async () => [{ id: 1 }],
    },
    {
      name: "blocked-source",
      source: { name: "Blocked", url: "https://blocked.example.com" },
      fetch: async () => {
        const error = new Error("403 blocked by upstream");
        error.status = "upstream_error";
        throw error;
      },
    },
  ], baseOptions);

  assert.equal(report.okCount, 1);
  assert.equal(report.failureCount, 1);
  assert.equal(report.hasFailures, true);
  assert.equal(report.failures.length, 1);
  assert.equal(report.failures[0].name, "blocked-source");
  assert.equal(report.failures[0].blocked, true);
  assert.equal(report.failures[0].status, "upstream_error");
  assert.match(report.failures[0].error, /403 blocked/);
});

test("runCollector reports stale freshness when fetchedAt is old", async () => {
  const report = await runCollector([
    {
      name: "stale-source",
      source: { name: "Stale", url: "https://stale.example.com" },
      maxAgeHours: 1,
      fetch: async () => [{ id: 1 }],
    },
  ], {
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-30T00:00:00.000Z",
  });

  assert.equal(report.results[0].source.freshness.status, SOURCE_FRESHNESS.STALE);
});

test("runCollector flags missing fetch function as a failure", async () => {
  const report = await runCollector([
    { name: "no-fetch", source: { name: "x", url: "y" } },
  ], baseOptions);

  assert.equal(report.failureCount, 1);
  assert.equal(report.failures[0].blocked, true);
  assert.match(report.failures[0].error, /must be a function/);
});

test("runCollector rejects non-array tasks input", async () => {
  await assert.rejects(() => runCollector("nope"), /must be an array/);
});
