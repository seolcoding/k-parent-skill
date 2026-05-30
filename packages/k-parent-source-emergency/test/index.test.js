const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  ERROR_STATUS,
  SOURCE_FRESHNESS,
} = require("k-parent-core");
const {
  fetchNightHolidayPharmacies,
  fetchEmergencyRooms,
  normalizeFacilityRows,
  requestEgen,
} = require("../src/index");

const fixturesDir = path.join(__dirname, "fixtures");
const pharmacyPayload = readFixture("pharmacy.json");
const erPayload = readFixture("emergency-room.json");

test("normalizeFacilityRows maps name/address/tel/coords/hours with freshness", () => {
  const items = normalizeFacilityRows(pharmacyPayload, {
    label: "e-gen 약국",
    type: "facility",
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  assert.equal(items.length, 1);
  assert.equal(items[0].name, "종로 야간약국");
  assert.equal(items[0].address, "서울특별시 종로구 종로 1");
  assert.equal(items[0].tel, "02-300-0001");
  assert.equal(items[0].latitude, 37.5704);
  assert.equal(items[0].longitude, 126.9826);
  assert.ok(items[0].hours["토"]);
  assert.equal(items[0].source.freshness.status, SOURCE_FRESHNESS.FRESH);
});

test("fetchNightHolidayPharmacies returns ok envelope (offline payload)", async () => {
  const result = await fetchNightHolidayPharmacies({ payload: pharmacyPayload });
  assert.equal(result.ok, true);
  assert.equal(result.status, "ok");
  assert.equal(result.items.length, 1);
});

test("fetchEmergencyRooms returns ok envelope with clinic type (offline payload)", async () => {
  const result = await fetchEmergencyRooms({ payload: erPayload });
  assert.equal(result.ok, true);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].type, "clinic");
  assert.equal(result.items[0].name, "서울중앙병원 응급실");
});

test("requestEgen throws MISSING_CONFIG without api key", async () => {
  await assert.rejects(
    () => requestEgen("/x", {}, { apiKey: "" }),
    (error) => {
      assert.match(error.message, /KSKILL_DATAGOKR_KEY/);
      assert.equal(error.status, ERROR_STATUS.MISSING_CONFIG);
      return true;
    },
  );
});

test("requestEgen builds url with serviceKey, json, and Q0/Q1 params", async () => {
  let captured = "";
  const result = await requestEgen("/svc/getList", { Q0: "서울특별시", Q1: "종로구" }, {
    apiKey: "test-key",
    fetchImpl: async (url) => {
      captured = String(url);
      return new Response(JSON.stringify(pharmacyPayload), { status: 200 });
    },
  });

  assert.ok(captured.includes("serviceKey=test-key"));
  assert.ok(captured.includes("_type=json"));
  assert.ok(decodeURIComponent(captured).includes("Q0=서울특별시"));
  assert.deepEqual(result, pharmacyPayload);
});

test("requestEgen throws UPSTREAM_ERROR on non-ok response", async () => {
  await assert.rejects(
    () => requestEgen("/x", {}, {
      apiKey: "test-key",
      fetchImpl: async () => new Response("err", { status: 503 }),
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
