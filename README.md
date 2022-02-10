# ✨ tRPC-transformer

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

A simple, quick and reliable transformer for [tRPC](https://trpc.io) based on:

- [superjson](https://github.com/blitz-js/superjson) for uploading data;
- eval/[devalue](https://github.com/Rich-Harris/devalue) for downloading data.

## How to use

1. Install

`yarn add trpc-transformer`

2. Add it to your `AppRouter`

```ts
import transformer from 'trpc-transformer';

const appRouter = trpc.router().transformer(transformer);
// .query(...)
```

3. Add it to your tRPC client:

```ts
import transformer from 'trpc-transformer';

const client = createTRPCClient<AppRouter>({
  // [...]
  transformer,
});
```

## Why this exists

So you don't have to do this every time:

```ts
import devalue from 'devalue';
import superjson from 'superjson';

const transformer = {
  input: superjson,
  output: {
    serialize: (object: unknown) => devalue(object),
    deserialize: (object: unknown) => eval(`(${object})`),
  },
};
```

## Learn more

See [trpc.io/docs/data-transformers](https://trpc.io/docs/data-transformers).

## License

The [ISC License](https://github.com/icflorescu/trpc-transformer/blob/master/LICENSE).

[npm-image]: https://img.shields.io/npm/v/trpc-transformer.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trpc-transformer
[license-image]: http://img.shields.io/npm/l/trpc-transformer.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/trpc-transformer.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/trpc-transformer
