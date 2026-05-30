const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const { ERROR_STATUS, SOURCE_FRESHNESS } = require("k-parent-core");
const {
  fetchProducts,
  signRequest,
  formatSignedDate,
  normalizeProducts,
  AFFILIATE_DISCLOSURE,
} = require("../src/index");

const fixturesDir = path.join(__dirname, "fixtures");
const productsPayload = readFixture("products.json");

test("formatSignedDate produces YYMMDDTHHMMSSZ in UTC", () => {
  assert.equal(formatSignedDate(new Date("2026-05-30T01:02:03.456Z")), "260530T010203Z");
});

test("signRequest is deterministic for a fixed date + key", () => {
  const fixed = {
    method: "GET",
    path: "/v2/providers/affiliate_open_api/apis/openapi/v1/products/search",
    query: "keyword=mom&limit=10",
    accessKey: "ACCESS123",
    secretKey: "SECRET456",
    signedDate: "260530T010203Z",
  };

  const first = signRequest(fixed);
  const second = signRequest(fixed);

  // Independently compute the expected signature to lock the algorithm.
  const expected = crypto
    .createHmac("sha256", fixed.secretKey)
    .update(`${fixed.signedDate}GET${fixed.path}${fixed.query}`)
    .digest("hex");

  assert.equal(first.signature, second.signature);
  assert.equal(first.signature, expected);
  assert.equal(first.signedDate, "260530T010203Z");
  assert.ok(first.authorization.startsWith("CEA algorithm=HmacSHA256, access-key=ACCESS123, signed-date=260530T010203Z, signature="));
});

test("signRequest requires both keys", () => {
  assert.throws(() => signRequest({ method: "GET", path: "/x", accessKey: "", secretKey: "y" }), /required/);
});

test("normalizeProducts maps fields and always attaches the affiliate disclosure", () => {
  const items = normalizeProducts(productsPayload, {
    fetchedAt: "2026-05-30T00:00:00.000Z",
    now: "2026-05-30T01:00:00.000Z",
  });

  assert.equal(items.length, 2);
  assert.equal(items[0].productName, "베베앙 캡형 물티슈 100매 10팩");
  assert.equal(items[0].productPrice, 12900);
  assert.equal(items[0].productImage, "https://image.coupang.com/products/1000111.jpg");
  assert.equal(items[0].productUrl, "https://link.coupang.com/a/aaaa");
  assert.equal(items[0].isRocket, true);
  assert.equal(items[1].isRocket, false);
  assert.equal(items[0].categoryName, "출산/유아동");
  assert.equal(items[0].disclosure, AFFILIATE_DISCLOSURE);
  assert.equal(items[0].source.freshness.status, SOURCE_FRESHNESS.FRESH);
});

test("fetchProducts works fully offline from a fixture payload", async () => {
  const result = await fetchProducts({ keyword: "물티슈", payload: productsPayload });
  assert.equal(result.ok, true);
  assert.equal(result.items.length, 2);
  assert.equal(result.disclosure, AFFILIATE_DISCLOSURE);
  assert.ok(result.items.every((item) => item.disclosure === AFFILIATE_DISCLOSURE));
});

test("fetchProducts requires credentials when actually calling out", async () => {
  await assert.rejects(
    () => fetchProducts({ keyword: "물티슈", accessKey: "", secretKey: "" }),
    (error) => error.status === ERROR_STATUS.MISSING_CONFIG,
  );
});

test("fetchProducts signs the live request and surfaces upstream errors", async () => {
  let sentAuth = "";
  await assert.rejects(
    () => fetchProducts({
      keyword: "물티슈",
      accessKey: "ACCESS123",
      secretKey: "SECRET456",
      signedDate: "260530T010203Z",
      fetchImpl: async (url, opts = {}) => {
        sentAuth = opts.headers.Authorization;
        return new Response("rate limited", { status: 429 });
      },
    }),
    (error) => error.status === ERROR_STATUS.UPSTREAM_ERROR,
  );
  assert.ok(sentAuth.startsWith("CEA algorithm=HmacSHA256, access-key=ACCESS123"));
});

function readFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, fileName), "utf8"));
}
