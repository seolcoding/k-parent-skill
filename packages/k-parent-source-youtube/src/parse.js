"use strict";

const { normalizeSourceMetadata } = require("./core");

const SOURCE_NAME = "youtube";

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

function normalizeSearchItem(item) {
  if (!item || typeof item !== "object") {
    return null;
  }
  const id = item.id || {};
  const videoId = id.videoId || null;
  if (!videoId) {
    return null;
  }
  const snippet = item.snippet || {};
  const base = {
    videoId,
    title: snippet.title || null,
    channelTitle: snippet.channelTitle || null,
    publishedAt: snippet.publishedAt || null,
    description: snippet.description || null,
    thumbnail: pickThumbnail(snippet.thumbnails),
    url: `https://youtu.be/${videoId}`,
  };
  return Object.assign(base, {
    ...normalizeSourceMetadata({
      source: SOURCE_NAME,
      source_id: videoId,
    }),
  });
}

function parseSearch(payload) {
  const items = payload && Array.isArray(payload.items) ? payload.items : [];
  return items.map(normalizeSearchItem).filter(Boolean);
}

module.exports = { parseSearch, normalizeSearchItem, SOURCE_NAME };
