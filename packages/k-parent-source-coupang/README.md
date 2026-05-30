# k-parent-source-coupang

Coupang Partners affiliate API adapter for K-Parent Skill.

## Functions

- `fetchProducts({ keyword, limit })` — product search rows
  (`productName`, `productPrice`, `productImage`, `productUrl`, `isRocket`, `categoryName`).
  Every row and the top-level result carry the mandatory affiliate disclosure
  `쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 받을 수 있음`.
- `signRequest({ method, path, query, accessKey, secretKey, signedDate|date })` — pure,
  deterministic CEA HMAC-SHA256 signer (`Authorization: CEA algorithm=HmacSHA256, access-key=..., signed-date=..., signature=...`).
- `formatSignedDate(date)` — UTC `YYMMDDTHHMMSSZ` signed-date stamp.

## Credentials

Set `KSKILL_COUPANG_ACCESS_KEY` and `KSKILL_COUPANG_SECRET_KEY`. Sign up for
Coupang Partners and issue an API access key / secret key.

## Disclosure (required)

Any user-facing surface that shows Coupang Partners links MUST display the
disclosure text above. It is attached to every normalized item so it cannot be
dropped accidentally.

## Tests / fixtures

`node --test` runs fully offline from `test/fixtures/products.json`. To refresh:

```
KSKILL_COUPANG_ACCESS_KEY=... KSKILL_COUPANG_SECRET_KEY=... \
  node packages/k-parent-source-coupang/scripts/refresh-fixtures.mjs
```
