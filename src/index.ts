import devalue from 'devalue';
import superjson from 'superjson';

export default {
  input: superjson,
  output: {
    serialize: (object: unknown) => devalue(object),
    deserialize: (object: unknown) => eval(`(${object})`),
  },
};
