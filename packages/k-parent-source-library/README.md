# k-parent-source-library

도서관정보나루(data4library.kr) source adapter for k-parent-skill.

## Usage

```js
const { fetchLibraries, parseLibraries } = require("k-parent-source-library");
```

`fetchLibraries({ region, dtlRegion })` calls
`https://data4library.kr/api/libSrch?authKey=...&format=json`.

## Environment

- `KSKILL_LIBRARY_KEY` — 도서관정보나루 인증키
  (https://data4library.kr/apiUtilization).

## Refresh fixtures

```
npm run refresh:fixtures
```
