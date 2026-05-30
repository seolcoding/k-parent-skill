"use strict";

const { ERROR_STATUS } = require("./core");
const parse = require("./parse");

const ENV_KEY = "KSKILL_YOUTUBE_KEY";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

function configError(message) {
  const err = new Error(message);
  err.status = ERROR_STATUS.MISSING_CONFIG;
  return err;
}

function upstreamError(message, statusCode) {
  const err = new Error(message);
  err.status = ERROR_STATUS.UPSTREAM_ERROR;
  if (statusCode != null) {
    err.statusCode = statusCode;
  }
  return err;
}

/**
 * Search YouTube videos via the Data API v3 `search.list` endpoint.
 *
 * @param {object} options
 * @param {string} options.q                Search query (required).
 * @param {string} [options.apiKey]         API key; falls back to KSKILL_YOUTUBE_KEY.
 * @param {string} [options.safeSearch="strict"]  YouTube safeSearch filter.
 * @param {number} [options.maxResults=10]  Number of results (1-50).
 * @param {string} [options.regionCode="KR"]
 * @param {string} [options.relevanceLanguage="ko"]
 * @param {string} [options.order]          e.g. "relevance" | "date" | "viewCount".
 * @param {string} [options.publishedAfter] RFC 3339 timestamp.
 * @param {function} [options.fetchImpl]    Injectable fetch (defaults to global.fetch).
 * @param {object} [options.payload]        Pre-fetched payload; bypasses HTTP (tests/fixtures).
 * @returns {Promise<Array<object>>} Normalized video content items.
 */
async function searchVideos(options = {}) {
  const {
    q,
    safeSearch = "strict",
    maxResults = 10,
    regionCode = "KR",
    relevanceLanguage = "ko",
    order,
    publishedAfter,
    payload,
    fetchImpl,
  } = options;

  if (payload) {
    return parse.parseSearch(payload);
  }

  if (!q || typeof q !== "string") {
    throw configError("searchVideos requires a non-empty `q` string");
  }

  const apiKey = options.apiKey || process.env[ENV_KEY];
  if (!apiKey) {
    throw configError(
      `Missing YouTube API key: set options.apiKey or the ${ENV_KEY} env var`
    );
  }

  const doFetch = fetchImpl || global.fetch;
  if (typeof doFetch !== "function") {
    throw configError(
      "No fetch implementation available: pass options.fetchImpl or run on Node 18+"
    );
  }

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    q,
    safeSearch,
    maxResults: String(maxResults),
    regionCode,
    relevanceLanguage,
    key: apiKey,
  });
  if (order) {
    params.set("order", order);
  }
  if (publishedAfter) {
    params.set("publishedAfter", publishedAfter);
  }

  const url = `${BASE_URL}/search?${params.toString()}`;
  const res = await doFetch(url);
  if (!res || !res.ok) {
    const code = res ? res.status : undefined;
    throw upstreamError(`YouTube search request failed (status ${code})`, code);
  }

  const body = await res.json();
  return parse.parseSearch(body);
}

module.exports = {
  searchVideos,
  ENV_KEY,
  BASE_URL,
  ...parse,
};
