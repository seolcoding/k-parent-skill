# k-parent-source-culture

문화포털(culture.go.kr) 공연전시정보 source adapter for k-parent-skill.

## Usage

```js
const { fetchCultureEvents, parseCultureEvents } = require("k-parent-source-culture");
```

`fetchCultureEvents({ from, to, area, rows })` calls the culture portal
공연전시정보 endpoint and returns `response.msgBody.perforList`.

## Environment

- `KSKILL_CULTURE_KEY` — 문화포털 서비스키 (https://www.culture.go.kr).

## Refresh fixtures

```
npm run refresh:fixtures
```
