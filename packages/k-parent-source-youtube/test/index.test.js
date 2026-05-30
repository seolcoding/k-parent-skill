"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const youtube = require("../src/index.js");

function readFixture(name) {
  const file = path.join(__dirname, "fixtures", name);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function makeFetch(payload, { status = 200 } = {}) {
  return async () =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { "content-type": "application/json" },
    });
}

test("searchVideos normalizes the search fixture (injected fetchImpl)", async () => {
  const payload = readFixture("search.json");
  const results = await youtube.searchVideos({
    q: "초등 과학",
    apiKey: "test-key",
    fetchImpl: makeFetch(payload),
  });

  assert.equal(results.length, 2);

  const first = results[0];
  assert.equal(first.videoId, "abc123XYZ_0");
  assert.equal(first.title, "초등 4학년 과학 - 물의 상태 변화 쉽게 이해하기");
  assert.equal(first.channelTitle, "함께하는 과학교실");
  assert.equal(first.publishedAt, "2025-09-01T09:00:00Z");
  assert.equal(first.url, "https://youtu.be/abc123XYZ_0");
  assert.equal(
    first.thumbnail,
    "https://i.ytimg.com/vi/abc123XYZ_0/hqdefault.jpg"
  );
  assert.ok(typeof first.description === "string");
});

test("searchVideos accepts a pre-fetched payload and bypasses HTTP", async () => {
  const payload = readFixture("search.json");
  let called = false;
  const results = await youtube.searchVideos({
    payload,
    fetchImpl: async () => {
      called = true;
      throw new Error("network should not be hit when payload is supplied");
    },
  });
  assert.equal(called, false);
  assert.equal(results.length, 2);
  assert.equal(results[1].videoId, "def456UVW_1");
});

test("searchVideos throws MISSING_CONFIG when api key absent", async () => {
  const saved = process.env.KSKILL_YOUTUBE_KEY;
  delete process.env.KSKILL_YOUTUBE_KEY;
  try {
    await assert.rejects(
      () => youtube.searchVideos({ q: "test", fetchImpl: makeFetch({}) }),
      (err) => {
        assert.equal(err.status, "MISSING_CONFIG");
        return true;
      }
    );
  } finally {
    if (saved !== undefined) {
      process.env.KSKILL_YOUTUBE_KEY = saved;
    }
  }
});

test("searchVideos throws MISSING_CONFIG when q absent", async () => {
  await assert.rejects(
    () => youtube.searchVideos({ apiKey: "k", fetchImpl: makeFetch({}) }),
    (err) => {
      assert.equal(err.status, "MISSING_CONFIG");
      return true;
    }
  );
});

test("searchVideos throws UPSTREAM_ERROR on non-ok response", async () => {
  await assert.rejects(
    () =>
      youtube.searchVideos({
        q: "test",
        apiKey: "k",
        fetchImpl: makeFetch({ error: "forbidden" }, { status: 403 }),
      }),
    (err) => {
      assert.equal(err.status, "UPSTREAM_ERROR");
      assert.equal(err.statusCode, 403);
      return true;
    }
  );
});

test("parseSearch skips items without a videoId", () => {
  const results = youtube.parseSearch({
    items: [
      { id: { kind: "youtube#channel" }, snippet: { title: "no video" } },
      {
        id: { videoId: "keep1" },
        snippet: { title: "kept", thumbnails: {} },
      },
    ],
  });
  assert.equal(results.length, 1);
  assert.equal(results[0].videoId, "keep1");
  assert.equal(results[0].url, "https://youtu.be/keep1");
});
