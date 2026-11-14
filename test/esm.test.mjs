import Decimal from 'decimal.js';
import transformer from '../dist/index.js';
import { runSuite } from './suite.mjs';

runSuite('esm', transformer, Decimal);
