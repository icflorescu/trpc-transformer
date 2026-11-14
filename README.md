# ✨ tRPC-transformer

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Sponsor the author][sponsor-image]][sponsor-url]

A simple [tRPC](https://trpc.io) transformer combining [superjson](https://github.com/blitz-js/superjson) with [Decimal.js](https://mikemcl.github.io/decimal.js/).

## Installation

```bash
npm i trpc-transformer superjson decimal.js
```

`superjson` and `decimal.js` are peer dependencies, so your app and the transformer share the same `Decimal` class (and `instanceof Decimal` keeps working on the client).

## Usage

1. Add it to your `initTRPC`:

```ts
import { initTRPC } from '@trpc/server';
import transformer from 'trpc-transformer';

export const t = initTRPC.create({ transformer });
```

2. ...and to your tRPC client:

```ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import transformer from 'trpc-transformer';
import type { AppRouter } from '~/server/appRouter';

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: '/api/trpc', transformer })],
});
```

## Benefits

Assuming you have an `appRouter.ts` like this on the server-side:

```ts
import { initTRPC } from '@trpc/server';
import transformer from 'trpc-transformer';
import prisma from '~/lib/server/prisma';

const t = initTRPC.create({ transformer });

export const appRouter = t.router({
  users: t.procedure.query(() =>
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        accounts: {
          select: { iban: true, balance: true },
        },
      },
    }),
  ),
});

export type AppRouter = typeof appRouter;
```

...then, you'll have your data **correctly** serialized/deserialized on the client-side, with matching types:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { useTRPC } from '~/lib/client/trpc';

export function Users() {
  const trpc = useTRPC();
  const usersQuery = useQuery(trpc.users.queryOptions());

  console.log(usersQuery.data?.[0].createdAt instanceof Date); // 👈 true
  console.log(usersQuery.data?.[0].accounts[0].balance instanceof Decimal); // 👈 true

  // ...
}
```

> [!NOTE]
> The above example assumes a [Next.js](https://nextjs.org) project using [tRPC v11 with TanStack React Query](https://trpc.io/docs/client/tanstack-react-query/setup), with a `lib/client/trpc.ts` file like this:

```ts
import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '~/server/appRouter';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
```

...and a `Providers.tsx` component like this, wrapping your app in `layout.tsx`:

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import transformer from 'trpc-transformer';
import { TRPCProvider } from '~/lib/client/trpc';
import type { AppRouter } from '~/server/appRouter';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: '/api/trpc', transformer })],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

## Requirements

Node.js 22.12+ (or any modern bundler). `superjson` is ESM-only, so the CommonJS build relies on Node's `require(esm)` support.

> [!WARNING]
> Importing `trpc-transformer` registers Decimal.js support on superjson's shared default instance. If a single process loads **both** the ESM and the CommonJS builds (e.g. a mix of `import` and `require` in a Node.js server), the last one loaded wins, and deserialized values will be instances of _its_ copy of `Decimal` — so `instanceof Decimal` may fail in code using the other copy. Stick to one module format per process to avoid this.

## Learn more

See [trpc.io/docs/data-transformers](https://trpc.io/docs/data-transformers) and [github.com/blitz-js/superjson](https://github.com/blitz-js/superjson).

## License

The [ISC License](https://github.com/icflorescu/trpc-transformer/blob/main/LICENSE).

[npm-image]: https://img.shields.io/npm/v/trpc-transformer.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/trpc-transformer
[license-image]: https://img.shields.io/npm/l/trpc-transformer.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/trpc-transformer.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/trpc-transformer
[sponsor-image]: https://img.shields.io/badge/sponsor-violet?style=flat-square
[sponsor-url]: https://github.com/sponsors/icflorescu
