const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { SOURCE_FRESHNESS, ERROR_STATUS } = require("k-parent-core");
const {
  BASE,
  searchFestival,
  areaBasedList,
  locationBasedList,
  requestTourapiJson,
  extractItems,
  normalizeFestivals,
  normalizeSpots,
} = require("../src/index");

const fixturesDir = path.join(__dirname, "fixtures");
const festivalPayload = readFixture("festival.json");
const areaPayload = readFixture("area-based.json");
const locationPayload = readFixture("location-based.json");

test("extractItems handles array and single-object envelopes", () => {
  assert.equal(extractItems(festivalPayload).length, 2);
  assert.equal(extractItems(locationPayload).length, 1);
  assert.equal(extractItems({}).length, 0);
  assert.equal(extractItems({ response: { body: { items: "" } } }).length, 0);
});

test("searchFestival normalizes festival fields and source freshness (offline)", async () => {
  const result = await searchFestival({
    eventStartDate: "20260601",
    areaCode: 1,
    payload: festivalPayload,
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.equal(result.festivals.length, 2);
  const first = result.festivals[0];
  assert.equal(first.contentId, "2733967");
  assert.equal(first.title, "서울숲 가족 봄 축제");
  assert.equal(first.startDate, "2026-06-01");
  assert.equal(first.endDate, "2026-06-05");
  assert.equal(first.mapx, 127.0411);
  assert.equal(first.mapy, 37.5446);
  assert.ok(first.addr.includes("성동구"));
  assert.equal(first.image, "http://tong.visitkorea.or.kr/cms/festival1.jpg");
  assert.equal(first.source.freshness.status, SOURCE_FRESHNESS.FRESH);
});

test("searchFestival requires eventStartDate", async () => {
  await assert.rejects(() => searchFestival({ areaCode: 1, payload: festivalPayload }), /eventStartDate/);
});

test("areaBasedList normalizes spots with institution shape (offline)", async () => {
  const result = await areaBasedList({
    areaCode: 1,
    contentTypeId: 12,
    payload: areaPayload,
    fetchedAt: "2026-05-01T00:00:00.000Z",
    now: "2026-05-01T01:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.equal(result.spots.length, 1);
  const spot = result.spots[0];
  assert.equal(spot.name, "서울어린이대공원");
  assert.equal(spot.contentTypeId, "12");
  assert.equal(spot.latitude, 37.5497);
  assert.equal(spot.longitude, 127.0813);
  assert.ok(spot.address.includes("광진구"));
  assert.equal(spot.tel, "02-450-9311");
});

test("locationBasedList handles single-object item and distance (offline)", async () => {
  const result = await locationBasedList({
    mapX: 126.9970,
    mapY: 37.5772,
    radius: 2000,
    payload: locationPayload,
  });

  assert.equal(result.ok, true);
  assert.equal(result.spots.length, 1);
  assert.equal(result.spots[0].name, "국립어린이과학관");
  assert.equal(result.spots[0].dist, 842.5);
});

test("locationBasedList requires coordinates", async () => {
  await assert.rejects(() => locationBasedList({ payload: locationPayload, mapX: 1 }), /mapX and mapY/);
});

test("normalize helpers work on raw payloads directly", () => {
  assert.equal(normalizeFestivals(festivalPayload, { operation: "searchFestival2" }).length, 2);
  assert.equal(normalizeSpots(areaPayload, { operation: "areaBasedList2" }).length, 1);
});

test("live TourAPI request requires API key by default", async () => {
  await assert.rejects(
    () => requestTourapiJson("searchFestival2", {}, { apiKey: "" }),
    /KSKILL_TOURAPI_KEY/,
  );
});

test("live TourAPI request builds URL with serviceKey and common params", async () => {
  let fetchedUrl = "";
  const result = await requestTourapiJson("searchFestival2", {
    eventStartDate: "20260601",
    areaCode: 1,
  }, {
    apiKey: "test-key",
    fetchImpl: async (url, opts = {}) => {
      fetchedUrl = String(url);
      assert.ok(opts.headers["accept-language"].includes("ko-KR"));
      return new Response(JSON.stringify(festivalPayload), { status: 200 });
    },
  });

  assert.deepEqual(result, festivalPayload);
  assert.ok(fetchedUrl.startsWith(BASE));
  assert.ok(fetchedUrl.includes("searchFestival2"));
  assert.ok(fetchedUrl.includes("serviceKey=test-key"));
  assert.ok(fetchedUrl.includes("MobileOS=ETC"));
  assert.ok(fetchedUrl.includes("MobileApp=k-parent"));
  assert.ok(fetchedUrl.includes("_type=json"));
  assert.ok(fetchedUrl.includes("eventStartDate=20260601"));
});

test("upstream failure surfaces UPSTREAM_ERROR status", async () => {
  await assert.rejects(
    () => requestTourapiJson("searchFestival2", {}, {
      apiKey: "test-key",
      fetchImpl: async () => new Response("err", { status: 500 }),
    }),
    (err) => err.status === ERROR_STATUS.UPSTREAM_ERROR,
  );
});

function readFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, fileName), "utf8"));
}
