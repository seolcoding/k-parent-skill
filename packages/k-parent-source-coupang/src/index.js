const { ERROR_STATUS } = require("k-parent-core");
const {
  COUPANG_BASE_URL,
  AFFILIATE_DISCLOSURE,
  signRequest,
  normalizeProducts,
} = require("./parse");

function resolveCredentials(options = {}) {
  const accessKey = options.accessKey || process.env.KSKILL_COUPANG_ACCESS_KEY;
  const secretKey = options.secretKey || process.env.KSKILL_COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) {
    const error = new Error(
      "KSKILL_COUPANG_ACCESS_KEY and KSKILL_COUPANG_SECRET_KEY (or options.accessKey/secretKey) are required for live Coupang requests.",
    );
    error.status = ERROR_STATUS.MISSING_CONFIG;
    throw error;
  }

  return { accessKey, secretKey };
}

async function fetchProducts(options = {}) {
  if (!options.keyword && !options.payload) {
    throw new Error("keyword is required.");
  }

  let payload = options.payload;

  if (!payload) {
    const { accessKey, secretKey } = resolveCredentials(options);
    const fetchImpl = options.fetchImpl || global.fetch;
    if (typeof fetchImpl !== "function") {
      throw new Error("A fetch implementation is required.");
    }

    const requestPath = "/v2/providers/affiliate_open_api/apis/openapi/v1/products/search";
    const params = new URLSearchParams();
    params.set("keyword", options.keyword);
    params.set("limit", String(options.limit || 10));
    const query = params.toString();

    const { authorization } = signRequest({
      method: "GET",
      path: requestPath,
      query,
      accessKey,
      secretKey,
      date: options.date,
      signedDate: options.signedDate,
    });

    const response = await fetchImpl(`${COUPANG_BASE_URL}${requestPath}?${query}`, {
      method: "GET",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json;charset=UTF-8",
        ...(options.headers || {}),
      },
      signal: options.signal,
    });

    if (!response.ok) {
      const error = new Error(`Coupang products search failed with ${response.status}.`);
      error.status = ERROR_STATUS.UPSTREAM_ERROR;
      throw error;
    }

    payload = await response.json();
  }

  return {
    ok: true,
    status: "ok",
    keyword: options.keyword || null,
    disclosure: AFFILIATE_DISCLOSURE,
    items: normalizeProducts(payload, {
      fetchedAt: options.fetchedAt,
      now: options.now,
    }),
  };
}

module.exports = {
  fetchProducts,
  resolveCredentials,
  ...require("./parse"),
};
