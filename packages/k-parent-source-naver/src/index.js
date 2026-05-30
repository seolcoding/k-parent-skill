const { ERROR_STATUS } = require("k-parent-core");
const {
  buildNaverHeaders,
  fetchNaverJson,
  normalizeShoppingItems,
  normalizeBlogItems,
} = require("./parse");

function resolveCredentials(options = {}) {
  const clientId = options.clientId || process.env.KSKILL_NAVER_CLIENT_ID;
  const clientSecret = options.clientSecret || process.env.KSKILL_NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const error = new Error(
      "KSKILL_NAVER_CLIENT_ID and KSKILL_NAVER_CLIENT_SECRET (or options.clientId/clientSecret) are required for live Naver requests.",
    );
    error.status = ERROR_STATUS.MISSING_CONFIG;
    throw error;
  }

  return { clientId, clientSecret };
}

async function requestNaver(endpoint, params, options = {}) {
  if (options.payload) {
    return options.payload;
  }

  const { clientId, clientSecret } = resolveCredentials(options);
  const fetchImpl = options.fetchImpl || global.fetch;
  const headers = buildNaverHeaders(clientId, clientSecret, options.headers);

  const response = await fetchNaverJson(endpoint, params, {
    fetchImpl,
    headers,
    signal: options.signal,
  });

  if (!response.ok) {
    const error = new Error(`Naver ${endpoint} request failed with ${response.status}.`);
    error.status = ERROR_STATUS.UPSTREAM_ERROR;
    throw error;
  }

  return response.json();
}

async function fetchShopping(options = {}) {
  if (!options.query && !options.q && !options.payload) {
    throw new Error("query is required.");
  }

  const payload = await requestNaver("shop.json", {
    query: options.query || options.q,
    display: options.display || 10,
    start: options.start,
    sort: options.sort,
  }, options);

  return {
    ok: true,
    status: "ok",
    query: options.query || options.q || null,
    total: payload?.total ?? null,
    items: normalizeShoppingItems(payload, {
      fetchedAt: options.fetchedAt,
      now: options.now,
    }),
  };
}

async function fetchBlog(options = {}) {
  if (!options.query && !options.q && !options.payload) {
    throw new Error("query is required.");
  }

  const payload = await requestNaver("blog.json", {
    query: options.query || options.q,
    display: options.display || 10,
    start: options.start,
    sort: options.sort,
  }, options);

  return {
    ok: true,
    status: "ok",
    query: options.query || options.q || null,
    total: payload?.total ?? null,
    items: normalizeBlogItems(payload, {
      fetchedAt: options.fetchedAt,
      now: options.now,
    }),
  };
}

module.exports = {
  requestNaver,
  fetchShopping,
  fetchBlog,
  ...require("./parse"),
  ...require("./collector"),
};
