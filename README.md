# ✨ tRPC-transformer

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Sponsor the author][sponsor-image]][sponsor-url]

A simple [tRPC](https://trpc.io) transformer based on [superjson](https://github.com/blitz-js/superjson) with [Decimal.js](https://mikemcl.github.io/decimal.js/) support.

## Installation

```bash
yarn add trpc-transformer
```

or

```bash
npm i trpc-transformer
```

## Usage

1. Add it to your `AppRouter`:

```ts
import transformer from 'trpc-transformer';

const appRouter = trpc.router().transformer(transformer);
// .query(...)
```

2. ...and to your tRPC client:

```ts
import transformer from 'trpc-transformer';

const client = createTRPCClient<AppRouter>({
  // [...]
  transformer,
});
```

## Benefits

Assuming you have `appRouter.ts` on the server-side:

```ts
import * as trpc from '@trpc/server';
import transformer from 'trpc-transformer';
import * as yup from 'yup';
import DB from '../lib/your-persistence-layer';

export const appRouter = trpc
  .router()
  .transformer(transformer)
  .mutation('createUser', {
    input: yup
      .object({
        name: yup.string().min(5).required(),
        birthDate: yup.date().required(),
      })
      .required(),
    async resolve({ input: { name } }) {
      const user: {
        id: number;
        name: string;
        createdAt: Date;
      } = await DB.users.create({ name });
      return user;
    },
  });

export type AppRouter = typeof appRouter;
```

...then, on the client you'll have your data **correctly** serialized/deserialized:

```ts
import * as trpc from '@trpc/client';
import transformer from 'trpc-transformer';
import type { Router } from '../appRouter.ts';

const client = trpc.createTRPCClient<Router>({ url: '/trpc', transformer });
// ...
const user = await client.mutation('createUser', {
  name: 'John Doe',
  birthDate: new Date('1980-06-25'),
});
console.log(user.createdAt instanceof Date); // true
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
