# k-parent-source-youtube

YouTube Data API v3 source connector for `k-parent-skill`. Provides
parent-friendly video search used by the content-recommender skill.

## Configuration

Set an API key from the Google Cloud Console (enable **YouTube Data API v3**):

```
export KSKILL_YOUTUBE_KEY="your-api-key"
```

## Usage

```js
const { searchVideos } = require("k-parent-source-youtube");

const videos = await searchVideos({
  q: "초등 4학년 과학 물의 상태 변화",
  safeSearch: "strict", // default
  maxResults: 10,
});
// -> [{ videoId, title, channelTitle, publishedAt, description, thumbnail, url, source, source_id, fetched_at }, ...]
```

Each result includes `url: https://youtu.be/<videoId>`.

### Options

| option | default | notes |
| --- | --- | --- |
| `q` | (required) | search query |
| `apiKey` | `process.env.KSKILL_YOUTUBE_KEY` | API key |
| `safeSearch` | `"strict"` | `none` \| `moderate` \| `strict` |
| `maxResults` | `10` | 1-50 |
| `regionCode` | `"KR"` | |
| `relevanceLanguage` | `"ko"` | |
| `order` | (api default) | `relevance` \| `date` \| `viewCount` ... |
| `publishedAfter` | — | RFC 3339 timestamp |
| `fetchImpl` | `global.fetch` | inject for tests |
| `payload` | — | pre-fetched payload; bypasses HTTP |

## Testing

```
node --test packages/k-parent-source-youtube/test/
```

Tests run fully offline using the fixture in `test/fixtures/search.json`.

## Refreshing fixtures

```
KSKILL_YOUTUBE_KEY=... node packages/k-parent-source-youtube/scripts/refresh-fixtures.mjs "검색어"
```
