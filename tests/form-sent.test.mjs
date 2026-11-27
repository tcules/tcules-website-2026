import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSent, sentRecord, sentUntil } from '../src/lib/form-sent.ts';

/* Local-time dates, as the visitor's browser reads them. 27 Nov 2026 is a Friday. */
const at = (y, m, d, h = 10) => new Date(y, m - 1, d, h).getTime();
const endOf = (y, m, d) => new Date(y, m - 1, d, 23, 59, 59, 999).getTime();

test('sales runs to the end of the next business day', () => {
  assert.equal(sentUntil('sales', at(2026, 11, 23)), endOf(2026, 11, 24)); // Mon → Tue
  assert.equal(sentUntil('sales', at(2026, 11, 26, 23)), endOf(2026, 11, 27)); // Thu night → Fri
  assert.equal(sentUntil('sales', at(2026, 11, 27)), endOf(2026, 11, 30)); // Fri → Mon
  assert.equal(sentUntil('sales', at(2026, 11, 28)), endOf(2026, 11, 30)); // Sat → Mon
  assert.equal(sentUntil('sales', at(2026, 11, 29)), endOf(2026, 11, 30)); // Sun → Mon
  assert.equal(sentUntil('sales', at(2026, 12, 31)), endOf(2027, 1, 1)); // across the year
});

test('careers runs for 30 days', () => {
  const sent = at(2026, 11, 27);
  assert.equal(sentUntil('careers', sent), sent + 30 * 24 * 60 * 60 * 1000);
});

test('stored state keeps live records apart and drops what has run out', () => {
  const now = at(2026, 11, 27);
  const raw = JSON.stringify({
    sales: sentRecord('sales', at(2026, 11, 25)), // ran out at the end of Thu 26
    careers: sentRecord('careers', at(2026, 11, 20)),
  });
  const state = parseSent(raw, now);
  assert.equal(state.sales, undefined);
  assert.equal(state.careers?.sentAt, at(2026, 11, 20));
});

test('anything this module did not write reads as nothing sent', () => {
  const now = at(2026, 11, 27);
  for (const raw of [null, '', 'not json', '[]', '7', '{"sales":{"sentAt":"x","until":1}}'])
    assert.deepEqual(parseSent(raw, now), {});
  /* A record from the future (a wrong clock) does not count. */
  const future = JSON.stringify({ sales: { sentAt: now + 60_000, until: now + 120_000 } });
  assert.deepEqual(parseSent(future, now), {});
});
