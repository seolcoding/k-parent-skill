"use strict";

const { ERROR_STATUS } = require("k-parent-core");
const parse = require("./parse");

const BASE_URL = "https://data4library.kr/api";

async function fetchLibraries(options = {}) {
  const apiKey = options.apiKey || process.env.KSKILL_LIBRARY_KEY;
  if (!apiKey) {
    const err = new Error(
      "data4library API key is required (set KSKILL_LIBRARY_KEY or pass options.apiKey)"
    );
    err.status = ERROR_STATUS.MISSING_CONFIG;
    throw err;
  }

  if (options.payload) {
    return options.payload;
  }

  const fetchImpl = options.fetchImpl || global.fetch;
  const params = new URLSearchParams({
    authKey: apiKey,
    format: "json",
  });
  if (options.region) {
    params.set("region", options.region);
  }
  if (options.dtlRegion) {
    params.set("dtl_region", options.dtlRegion);
  }

  const url = `${BASE_URL}/libSrch?${params.toString()}`;
  const response = await fetchImpl(url);
  if (!response.ok) {
    const err = new Error(`data4library API request failed with status ${response.status}`);
    err.status = ERROR_STATUS.UPSTREAM_ERROR;
    throw err;
  }
  return response.json();
}

module.exports = {
  fetchLibraries,
  ...parse,
};
