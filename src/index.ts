import Decimal from 'decimal.js';
import { default as SuperJSON } from 'superjson';

SuperJSON.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  'decimal.js'
);

export default SuperJSON;
