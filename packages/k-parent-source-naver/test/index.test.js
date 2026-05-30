const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { ERROR_STATUS, SOURCE_FRESHNESS } = require("k-parent-core");
const {
  fetchShopping,
  fetchBlog,
  requestNaver,
  stripBoldTags,
  normalizeShoppingItems,
  normalizeBlogItems,
  buildNaverHeaders,
} = require("../src/index");

const fixturesDir = path.join(__dirname, "fixtures");
const shopPayload = readFixture("shop.json");
const blogPayload = readFixture("blog.json");

test("stripBoldTags removes <b> markup and decodes entities", () => {
  assert.equal(stripBoldTags("유아 <b>물티슈</b> &amp; 기저귀"), "유아 물티슈 & 기저귀");
});

test("normalizeShoppingItems maps the documented shopping fields", () => {
  const items = normalizeShoppingItems(shopPayload, {
    fetchedAt: "2026-05-30T00:00:00.000Z",
    now: "2026-05-30T01:00:00.000Z",
  });

  assert.equal(items.length, 2);
  assert.equal(items[0].title, "유아 물티슈 캡형 100매 10팩");
  assert.equal(items[0].link, "https://search.shopping.naver.com/gate.nhn?id=11111111");
  assert.equal(items[0].lprice, "12900");
  assert.equal(items[0].mallName, "베베몰");
  assert.equal(items[0].productId, "11111111");
  assert.equal(items[0].brand, "베베앙");
  assert.equal(items[0].category, "출산/육아 > 물티슈 > 캡형물티슈");
  assert.equal(items[0].source.freshness.status, SOURCE_FRESHNESS.FRESH);
});

test("normalizeBlogItems maps blog fields", () => {
  const items = normalizeBlogItems(blogPayload, {
    fetchedAt: "2026-05-30T00:00:00.000Z",
  });

  assert.equal(items.length, 2);
  assert.equal(items[0].title, "신생아 물티슈 추천 비교 후기");
  assert.equal(items[0].bloggername, "육아맘일기");
  assert.equal(items[0].postdate, "20260520");
});

test("fetchShopping works fully offline from a payload", async () => {
  const result = await fetchShopping({ query: "물티슈", payload: shopPayload });
  assert.equal(result.ok, true);
  assert.equal(result.items.length, 2);
  assert.equal(result.total, 215345);
});

test("fetchBlog works fully offline from a payload", async () => {
  const result = await fetchBlog({ query: "물티슈", payload: blogPayload });
  assert.equal(result.ok, true);
  assert.equal(result.items.length, 2);
});

test("buildNaverHeaders sets the Naver auth headers", () => {
  const headers = buildNaverHeaders("id123", "secret456");
  assert.equal(headers["X-Naver-Client-Id"], "id123");
  assert.equal(headers["X-Naver-Client-Secret"], "secret456");
  assert.ok(headers["accept-language"].includes("ko-KR"));
});

test("live request requires credentials by default", async () => {
  await assert.rejects(
    () => requestNaver("shop.json", { query: "x" }, { clientId: "", clientSecret: "" }),
    (error) => error.status === ERROR_STATUS.MISSING_CONFIG,
  );
});

test("live request builds the shop URL with auth headers via injected fetch", async () => {
  let fetchedUrl = "";
  let sentHeaders = {};

  const result = await fetchShopping({
    query: "물티슈",
    display: 5,
    clientId: "id123",
    clientSecret: "secret456",
    fetchImpl: async (url, opts = {}) => {
      fetchedUrl = String(url);
      sentHeaders = opts.headers || {};
      return new Response(JSON.stringify(shopPayload), { status: 200 });
    },
  });

  assert.equal(result.ok, true);
  assert.ok(fetchedUrl.includes("openapi.naver.com/v1/search/shop.json"));
  assert.ok(decodeURIComponent(fetchedUrl).includes("query=물티슈"));
  assert.ok(fetchedUrl.includes("display=5"));
  assert.equal(sentHeaders["X-Naver-Client-Id"], "id123");
  assert.equal(sentHeaders["X-Naver-Client-Secret"], "secret456");
});

test("upstream errors surface as UPSTREAM_ERROR", async () => {
  await assert.rejects(
    () => fetchShopping({
      query: "x",
      clientId: "id",
      clientSecret: "secret",
      fetchImpl: async () => new Response("nope", { status: 429 }),
    }),
    (error) => error.status === ERROR_STATUS.UPSTREAM_ERROR,
  );
});

function readFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, fileName), "utf8"));
}
