import test from 'node:test';
import assert from 'node:assert/strict';
import { suggestEmail } from '../src/lib/email-suggest.ts';
import { acceptOf, describeFileRule, fileProblem } from '../src/lib/file-rule.ts';
import { guessRegion } from '../src/lib/phone-region.ts';

test('a mistyped webmail domain is suggested', () => {
  assert.equal(suggestEmail('ada@gmial.com'), 'ada@gmail.com');
  assert.equal(suggestEmail('ada@gmail.co'), 'ada@gmail.com');
  assert.equal(suggestEmail(' ada@hotmial.com '), 'ada@hotmail.com');
  assert.equal(suggestEmail('ada@outlok.com'), 'ada@outlook.com');
  assert.equal(suggestEmail('ada@yahooo.com'), 'ada@yahoo.com');
  assert.equal(suggestEmail('ada@protonmial.con'), 'ada@protonmail.com');
  assert.equal(suggestEmail('Ada.Lovelace@GMAIL.CMO'), 'Ada.Lovelace@gmail.com');
});

test('a TLD that is never real is fixed on any domain', () => {
  assert.equal(suggestEmail('ada@acme.con'), 'ada@acme.com');
  assert.equal(suggestEmail('ada@acme.co.uk'), undefined);
  assert.equal(suggestEmail('ada@acme.nte'), 'ada@acme.net');
});

test('real and work addresses are left alone', () => {
  for (const value of ['ada@gmail.com', 'ada@acme.com', 'ada@ge.com', 'ada@aon.com', 'ada@mail.com', 'ada@ymail.com', 'ada@live.com', 'ada@email.com', 'ada@gmx.de', 'ada@acme.io', 'ada@tcules.com', 'ada@yahoo.co.in', 'ada@acme.co', 'ada', 'ada@', '@gmail.com', 'ada@localhost'])
    assert.equal(suggestEmail(value), undefined, value);
});

test('the file rule is said before upload and checked on send', () => {
  const rule = { types: ['pdf', 'doc', 'docx'], maxBytes: 10 * 1024 * 1024 };
  assert.equal(describeFileRule(rule), 'PDF or Word, up to 10 MB');
  assert.equal(acceptOf(rule), '.pdf,.doc,.docx');
  assert.equal(fileProblem({ name: 'cv.PDF', size: 1_000 }, rule), '');
  assert.equal(fileProblem({ name: 'cv.pages', size: 1_000 }, rule), 'Choose a PDF or Word file');
  assert.equal(fileProblem({ name: 'cv.pdf', size: 11 * 1024 * 1024 }, rule), 'Choose a file up to 10 MB');
  assert.equal(describeFileRule({ types: ['png'], maxBytes: 512 * 1024 }), 'PNG, up to 512 KB');
});

test('the region comes from the browser languages, then the time zone', () => {
  assert.equal(guessRegion(['en-GB', 'en']), 'GB');
  assert.equal(guessRegion(['en', 'hi-IN']), 'IN');
  assert.equal(guessRegion(['zh-Hant-TW']), 'TW');
  assert.equal(guessRegion(['en'], 'Asia/Kolkata'), 'IN');
  assert.equal(guessRegion(['en'], 'Pacific/Fiji'), undefined);
  assert.equal(guessRegion([]), undefined);
});
