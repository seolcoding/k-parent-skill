const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  ERROR_STATUS,
  SOURCE_FRESHNESS,
} = require("k-parent-core");
const {
  fetchChildcareCenters,
  fetchKindergartens,
  normalizeChildcareRows,
  normalizeKindergartenRows,
  requestDataGoKr,
} = require("../src/index");

const fixturesDir = path.join(__dirname, "fixtures");
const childcarePayload = readFixture("childcare.json");
const kindergartenPayload = readFixture("kindergarten.json");

test("normalizeChildcareRows maps centers with kind, capacity, cctv, freshness", () => {
  const centers = normalizeChildcareRows(childcarePayload, {
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  assert.equal(centers.length, 2);
  assert.equal(centers[0].centerId, "11110000001");
  assert.equal(centers[0].type, "childcare");
  assert.equal(centers[0].kind, "국공립");
  assert.equal(centers[0].capacity, 60);
  assert.equal(centers[0].currentCount, 52);
  assert.equal(centers[0].hasVehicle, true);
  assert.equal(centers[0].hasCctv, true);
  assert.equal(centers[0].operatingHours, "07:30~19:30");
  assert.equal(centers[1].kind, "가정");
  assert.equal(centers[1].hasVehicle, false);
  assert.equal(centers[0].source.freshness.status, SOURCE_FRESHNESS.FRESH);
});

test("normalizeKindergartenRows maps kindergartens with establish, counts, bus", () => {
  const list = normalizeKindergartenRows(kindergartenPayload, {
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  assert.equal(list.length, 2);
  assert.equal(list[0].kdgId, "K100000001");
  assert.equal(list[0].type, "kindergarten");
  assert.equal(list[0].establish, "공립");
  assert.equal(list[0].classCount, 8);
  assert.equal(list[0].pupilCount, 160);
  assert.equal(list[0].busOperate, true);
  assert.equal(list[1].establish, "사립");
  assert.equal(list[1].busOperate, false);
});

test("fetchChildcareCenters returns ok envelope with items (offline payload)", async () => {
  const result = await fetchChildcareCenters({ payload: childcarePayload });
  assert.equal(result.ok, true);
  assert.equal(result.status, "ok");
  assert.equal(result.items.length, 2);
});

test("fetchKindergartens returns ok envelope with items (offline payload)", async () => {
  const result = await fetchKindergartens({ payload: kindergartenPayload });
  assert.equal(result.ok, true);
  assert.equal(result.items.length, 2);
});

test("requestDataGoKr throws MISSING_CONFIG without api key", async () => {
  await assert.rejects(
    () => requestDataGoKr("/x", {}, { apiKey: "" }),
    (error) => {
      assert.match(error.message, /KSKILL_DATAGOKR_KEY/);
      assert.equal(error.status, ERROR_STATUS.MISSING_CONFIG);
      return true;
    },
  );
});

test("requestDataGoKr builds url with serviceKey and json type", async () => {
  let captured = "";
  const result = await requestDataGoKr("/x/getList", { arcode: "11" }, {
    apiKey: "test-key",
    fetchImpl: async (url) => {
      captured = String(url);
      return new Response(JSON.stringify(childcarePayload), { status: 200 });
    },
  });

  assert.ok(captured.includes("serviceKey=test-key"));
  assert.ok(captured.includes("_type=json"));
  assert.ok(captured.includes("arcode=11"));
  assert.deepEqual(result, childcarePayload);
});

test("requestDataGoKr throws UPSTREAM_ERROR on non-ok response", async () => {
  await assert.rejects(
    () => requestDataGoKr("/x", {}, {
      apiKey: "test-key",
      fetchImpl: async () => new Response("nope", { status: 500 }),
    }),
    (error) => {
      assert.equal(error.status, ERROR_STATUS.UPSTREAM_ERROR);
      return true;
    },
  );
});

function readFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, fileName), "utf8"));
}
