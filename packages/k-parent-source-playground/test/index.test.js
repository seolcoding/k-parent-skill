const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { SOURCE_FRESHNESS, ERROR_STATUS } = require("k-parent-core");
const {
  BASE,
  PLAYGROUND_PATH,
  fetchPlaygrounds,
  fetchUrbanParks,
  requestDatagokrJson,
  extractItems,
  normalizePlaygrounds,
  normalizeUrbanParks,
} = require("../src/index");

const fixturesDir = path.join(__dirname, "fixtures");
const playgroundPayload = readFixture("playgrounds.json");
const parkPayload = readFixture("urban-parks.json");

test("extractItems handles items.item array, single object, and empty", () => {
  assert.equal(extractItems(playgroundPayload).length, 2);
  assert.equal(extractItems(parkPayload).length, 1);
  assert.equal(extractItems({}).length, 0);
  assert.equal(extractItems({ body: { data: [{ a: 1 }] } }).length, 1);
});

test("fetchPlaygrounds normalizes name/address/coords/facilities (offline)", async () => {
  const result = await fetchPlaygrounds({
    payload: playgroundPayload,
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.equal(result.playgrounds.length, 2);
  const first = result.playgrounds[0];
  assert.equal(first.name, "행복어린이집 놀이터");
  assert.ok(first.address.includes("성동구"));
  assert.equal(first.latitude, 37.5573);
  assert.equal(first.longitude, 127.0294);
  assert.deepEqual(first.facilities, ["미끄럼틀,그네,모래놀이"]);
  assert.equal(first.source.freshness.status, SOURCE_FRESHNESS.FRESH);
});

test("fetchUrbanParks normalizes single-object park and facilities (offline)", async () => {
  const result = await fetchUrbanParks({
    payload: parkPayload,
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.equal(result.parks.length, 1);
  const park = result.parks[0];
  assert.equal(park.name, "서울숲");
  assert.equal(park.parkType, "근린공원");
  assert.equal(park.latitude, 37.5446);
  assert.equal(park.longitude, 127.0374);
  assert.ok(park.facilities.length >= 2);
});

test("normalize helpers work on raw payloads", () => {
  assert.equal(normalizePlaygrounds(playgroundPayload).length, 2);
  assert.equal(normalizeUrbanParks(parkPayload).length, 1);
});

test("live request requires API key by default", async () => {
  await assert.rejects(
    () => requestDatagokrJson(PLAYGROUND_PATH, {}, { apiKey: "" }),
    /KSKILL_DATAGOKR_KEY/,
  );
});

test("live request builds URL with serviceKey under data.go.kr base", async () => {
  let fetchedUrl = "";
  const result = await requestDatagokrJson(PLAYGROUND_PATH, { ctprvnNm: "서울특별시" }, {
    apiKey: "test-key",
    fetchImpl: async (url, opts = {}) => {
      fetchedUrl = String(url);
      assert.ok(opts.headers["accept-language"].includes("ko-KR"));
      return new Response(JSON.stringify(playgroundPayload), { status: 200 });
    },
  });

  assert.deepEqual(result, playgroundPayload);
  assert.ok(fetchedUrl.startsWith(BASE));
  assert.ok(fetchedUrl.includes("serviceKey=test-key"));
  assert.ok(decodeURIComponent(fetchedUrl).includes("ctprvnNm=서울특별시"));
});

test("upstream failure surfaces UPSTREAM_ERROR status", async () => {
  await assert.rejects(
    () => requestDatagokrJson(PLAYGROUND_PATH, {}, {
      apiKey: "test-key",
      fetchImpl: async () => new Response("err", { status: 503 }),
    }),
    (err) => err.status === ERROR_STATUS.UPSTREAM_ERROR,
  );
});

function readFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, fileName), "utf8"));
}
