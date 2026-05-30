const crypto = require("node:crypto");
const { normalizeSourceMetadata } = require("k-parent-core");

const COUPANG_BASE_URL = "https://api-gateway.coupang.com";
const ALGORITHM = "HmacSHA256";

const AFFILIATE_DISCLOSURE = "쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 받을 수 있음";

/**
 * Format a Date into Coupang's signed-date format: YYMMDDTHHMMSSZ (UTC).
 */
function formatSignedDate(date) {
  const iso = date.toISOString(); // 2026-05-30T01:02:03.456Z
  return `${iso.slice(2, 4)}${iso.slice(5, 7)}${iso.slice(8, 10)}T${iso.slice(11, 13)}${iso.slice(14, 16)}${iso.slice(17, 19)}Z`;
}

/**
 * Pure, deterministic Coupang Partners CEA HMAC-SHA256 signer.
 *
 * Given a fixed { method, path, query, accessKey, secretKey, signedDate } it
 * always produces the same Authorization header — so it is unit-testable with a
 * fixed clock/key. The message is `signed-date + method + path + query`.
 *
 * @returns {{ authorization: string, signedDate: string, signature: string, message: string }}
 */
function signRequest({ method, path: requestPath, query = "", accessKey, secretKey, signedDate, date }) {
  if (!accessKey || !secretKey) {
    throw new Error("accessKey and secretKey are required to sign Coupang requests.");
  }

  const stamp = signedDate || formatSignedDate(date || new Date());
  const upperMethod = String(method || "GET").toUpperCase();
  const message = `${stamp}${upperMethod}${requestPath}${query}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex");

  const authorization = `CEA algorithm=${ALGORITHM}, access-key=${accessKey}, signed-date=${stamp}, signature=${signature}`;

  return { authorization, signedDate: stamp, signature, message };
}

function makeCoupangSource(options = {}) {
  return normalizeSourceMetadata({
    sourceName: "Coupang Partners",
    sourceType: "affiliate",
    sourceUrl: options.sourceUrl || COUPANG_BASE_URL,
    fetchedAt: options.fetchedAt || new Date(),
    now: options.now,
    maxAgeHours: options.maxAgeHours == null ? 6 : options.maxAgeHours,
  });
}

function normalizeProducts(payload, options = {}) {
  const data = payload?.data;
  const rows = Array.isArray(data)
    ? data
    : (Array.isArray(data?.productData) ? data.productData : []);
  const source = makeCoupangSource(options);

  return rows.map((row) => ({
    productName: row.productName || null,
    productPrice: row.productPrice ?? null,
    productImage: row.productImage || null,
    productUrl: row.productUrl || null,
    isRocket: Boolean(row.isRocket),
    categoryName: row.categoryName || null,
    productId: row.productId ?? null,
    disclosure: AFFILIATE_DISCLOSURE,
    source,
    raw: row,
  }));
}

module.exports = {
  COUPANG_BASE_URL,
  ALGORITHM,
  AFFILIATE_DISCLOSURE,
  formatSignedDate,
  signRequest,
  makeCoupangSource,
  normalizeProducts,
};
