import test from 'node:test';
import assert from 'node:assert/strict';
import { distinctLabels, labelKey } from '../src/lib/labels.ts';

test('the same label in another spelling is one label, the first spelling kept', () => {
  assert.deepEqual(distinctLabels(['UX & Design', 'ux and design', 'UX  and   Design.']), [
    'UX & Design',
  ]);
  assert.deepEqual(distinctLabels(['Product-led growth', 'product led growth']), [
    'Product-led growth',
  ]);
  assert.equal(labelKey('  Design   Systems '), 'design systems');
});

test('order is kept and the limit counts distinct labels only', () => {
  assert.deepEqual(
    distinctLabels(['SaaS', 'saas', 'Fintech', 'FinTech', 'Healthcare', 'AI'], 3),
    ['SaaS', 'Fintech', 'Healthcare'],
  );
});

test('blank and punctuation-only labels are dropped', () => {
  assert.deepEqual(distinctLabels([' ', '—', '  B2B ']), ['B2B']);
});
