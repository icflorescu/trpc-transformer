#### 4.0.0

- **Breaking:** `superjson` and `decimal.js` are now peer dependencies only (no longer bundled as dependencies), so `instanceof Decimal` works reliably on the client;
- **Breaking:** peer dependency minimums raised to the tested versions (`decimal.js` ^10.6.0, `superjson` ^2.2.6);
- **Breaking:** require Node.js 22.12+ (`superjson` is ESM-only, so the CJS build relies on `require(esm)`);
- Fix build on Node.js 22+;
- Tooling: tsdown (build), Biome (lint/format), TypeScript 7; ESM output is now `dist/index.js`;
- Ship separate `.d.cts` types for CommonJS consumers;
- Unminified build output;
- README examples updated for tRPC v11 + TanStack React Query;
- Add runtime tests for both ESM and CJS builds, and CI.

#### 3.2.0

- Add exports to package.json.

#### 2.2.0

- Switch to esbuild.

#### 2.0.x

- Drop `devalue` support;
- Add `Decimal.js` support.

#### 1.0.x

- Initial release.
