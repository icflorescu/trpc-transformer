# ✨ tRPC-transformer

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Sponsor the author][sponsor-image]][sponsor-url]

A simple [tRPC](https://trpc.io) transformer combining [superjson](https://github.com/blitz-js/superjson) with [Decimal.js](https://mikemcl.github.io/decimal.js/).

## Installation

```bash
yarn add trpc-transformer
```

or

```bash
npm i trpc-transformer
```

## Usage

1. Add it to your `initTRPC`:

```ts
import { initTRPC } from '@trpc/server';
import transformer from 'trpc-transformer';

export const t = initTRPC.create({ transformer });
```

2. ...and to your tRPC client:

```ts
import transformer from 'trpc-transformer';

const client = trpc.createClient({
  links: [
    httpBatchLink({
      // ...
      transformer,
    }),
  ],
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
    })
  )
});

export type AppRouter = typeof appRouter;
```

...then, you'll have your data **correctly** serialized/deserialized on the client-side:

```tsx
import Decimal from 'decimal.js';
import { trpc } from '~/lib/client/trpc';

const usersQuery = trpc.users.useQuery();

console.log('Account createdAt is Date:', usersQuery.data?.[0].createdAt instanceof Date); // 👈 true
console.log('Account balance is Decimal.js:', usersQuery.data?.[0].accounts[0].balance instanceof Decimal); // 👈 true
```

> [NOTE]
> The above example assumes a [Next.js](https://nextjs.org) project with a `lib/client/trpc.ts` file like this:

```ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from 'swapp.ro.server';
export const trpc = createTRPCReact<AppRouter>();
```

...and a `layout.tsx` file like this:

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import transformer from 'trpc-transformer';
import { trpc } from '~/lib/client/trpc';

export default function DynamicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'your api url',
          transformer,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```


## Learn more

See [trpc.io/docs/data-transformers](https://trpc.io/docs/data-transformers) and [github.com/blitz-js/superjson](https://github.com/blitz-js/superjson).

## License

The [ISC License](https://github.com/icflorescu/trpc-transformer/blob/master/LICENSE).

[npm-image]: https://img.shields.io/npm/v/trpc-transformer.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trpc-transformer
[license-image]: http://img.shields.io/npm/l/trpc-transformer.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/trpc-transformer.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/trpc-transformer
[sponsor-image]: https://img.shields.io/badge/sponsor-violet?style=flat-square
[sponsor-url]: https://github.com/sponsors/icflorescu
