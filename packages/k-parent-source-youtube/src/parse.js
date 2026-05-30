"use strict";

const { normalizeSourceMetadata } = require("./core");

const SOURCE_NAME = "youtube";
const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

function pickThumbnail(thumbnails) {
  if (!thumbnails || typeof thumbnails !== "object") {
    return null;
  }
  // Prefer the highest reasonable resolution that is present.
  const order = ["high", "medium", "default", "standard", "maxres"];
  for (const key of order) {
    const t = thumbnails[key];
    if (t && t.url) {
      return t.url;
    }
  }
  // Fall back to any thumbnail with a url.
  for (const key of Object.keys(thumbnails)) {
    const t = thumbnails[key];
    if (t && t.url) {
      return t.url;
    }
  }
  return null;
}

function normalizeSearchItem(item, options = {}) {
  if (!item || typeof item !== "object") {
    return null;
  }
  const id = item.id || {};
  const videoId = id.videoId || null;
  if (!videoId) {
    return null;
  }
  const snippet = item.snippet || {};
  return {
    videoId,
    title: snippet.title || null,
    channelTitle: snippet.channelTitle || null,
    publishedAt: snippet.publishedAt || null,
    description: snippet.description || null,
    thumbnail: pickThumbnail(snippet.thumbnails),
    url: `https://youtu.be/${videoId}`,
    // Provenance metadata as a nested object, matching the k-parent source
    // convention. normalizeSourceMetadata (from k-parent-core) requires a
    // sourceName and returns { name, type, url, fetchedAt, freshness }.
    source: normalizeSourceMetadata({
      sourceName: `YouTube Data API v3 ${SOURCE_NAME}`,
      sourceType: "official",
      sourceUrl: SEARCH_URL,
      fetchedAt: options.fetchedAt,
      now: options.now,
    }),
  };
}

function parseSearch(payload, options = {}) {
  const items = payload && Array.isArray(payload.items) ? payload.items : [];
  return items
    .map((item) => normalizeSearchItem(item, options))
    .filter(Boolean);
}

module.exports = { parseSearch, normalizeSearchItem, SOURCE_NAME, SEARCH_URL };
