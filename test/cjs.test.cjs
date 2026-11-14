// node --test runs each file in its own process, so the CJS build registers its own Decimal
const Decimal = require('decimal.js');
const transformer = require('../dist/index.cjs').default;
const { runSuite } = require('./suite.mjs');

runSuite('cjs', transformer, Decimal);
