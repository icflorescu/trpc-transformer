import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

const makePayload = (Decimal) => ({
  id: 1,
  name: 'Ada',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  tags: new Set(['a', 'b']),
  meta: new Map([['k', 1n]]),
  accounts: [{ iban: 'RO49AAAA1B31007593840000', balance: new Decimal('1234.5678901234567890123') }],
  nothing: undefined,
});

export function runSuite(format, transformer, Decimal) {
  const payload = makePayload(Decimal);

  describe(`${format} build`, () => {
    test('round-trips Decimal.js values without losing precision', () => {
      const out = transformer.parse(transformer.stringify(payload));
      const balance = out.accounts[0].balance;
      assert.ok(Decimal.isDecimal(balance));
      assert.equal(balance.toString(), '1234.5678901234567890123');
    });

    test("deserializes to the consumer's Decimal class (instanceof works)", () => {
      const out = transformer.deserialize(transformer.serialize(payload));
      assert.ok(out.accounts[0].balance instanceof Decimal);
    });

    test('keeps the rest of superjson behaviour', () => {
      const out = transformer.parse(transformer.stringify(payload));
      assert.ok(out.createdAt instanceof Date);
      assert.equal(out.createdAt.toISOString(), payload.createdAt.toISOString());
      assert.deepEqual(out.tags, payload.tags);
      assert.deepEqual(out.meta, payload.meta);
      assert.ok('nothing' in out);
    });

    test('exposes the tRPC transformer shape', () => {
      assert.equal(typeof transformer.serialize, 'function');
      assert.equal(typeof transformer.deserialize, 'function');
    });
  });
}
