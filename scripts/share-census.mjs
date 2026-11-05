#!/usr/bin/env node
/**
 * Which picture every page's share card carries — after an illustration pass, the one command that
 * says which pages picked up their own drawing and which are still on their hub's.
 *
 *   npm run share:census                              this checkout's running `next dev`
 *   npm run share:census -- --base=http://localhost:3000
 *   npm run share:census -- --source=hub              list only one source (own, hub, banner, cover, none)
 *
 * It reads /design/share-cards, where every card is tagged with its page, kind and source
 * (`src/app/_og/resolve.ts` decides the source). Sources:
 *   own     the page's own hero drawing (HERO_ILLUSTRATIONS in src/lib/service-illustrations.ts)
 *   hub     its family hub's drawing, standing in until its own is registered there
 *   banner  a case study's banner from Strapi
 *   cover   an article's cover from Strapi
 *   video   a video's YouTube thumbnail
 *   none    no picture: the title alone
 * A drawing reaches a card only through HERO_ILLUSTRATIONS — a file in public/illustrations/heroes/
 * that is not registered there is invisible to the card, and this census shows the page as `hub`
 * or `none`.
 *
 * The server is found as `npm run shots` finds it: --base, else this checkout's own `next dev` lock.
 * It never starts a server.
 */
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const baseArg = args.find((a) => a.startsWith('--base='));
const sourceArg = args.find((a) => a.startsWith('--source='))?.slice('--source='.length);

/** This directory's own running `next dev`, from the lockfile Next 16 writes — or null. */
function ownDevServer() {
  try {
    const lock = JSON.parse(readFileSync('.next/dev/lock', 'utf8'));
    process.kill(lock.pid, 0);
    return lock.appUrl ?? `http://localhost:${lock.port}`;
  } catch {
    return null;
  }
}

const base = baseArg ? baseArg.slice('--base='.length) : ownDevServer();
if (!base) {
  console.error('share:census — no server. Run `npm run dev` in this checkout, or pass --base=<url>.');
  process.exit(1);
}

const response = await fetch(`${base}/design/share-cards`);
if (!response.ok) {
  console.error(`share:census — ${base}/design/share-cards answered ${response.status}`);
  process.exit(1);
}
const html = await response.text();

const cards = [...html.matchAll(/<div[^>]*data-share-path="([^"]+)"[^>]*>/g)].map(([tag, path]) => ({
  path,
  source: /data-share-source="([^"]+)"/.exec(tag)?.[1] ?? '?',
  kind: /data-share-kind="([^"]+)"/.exec(tag)?.[1] ?? '?',
}));
if (cards.length === 0) {
  console.error('share:census — no tagged cards on /design/share-cards.');
  process.exit(1);
}

const ORDER = ['own', 'hub', 'banner', 'cover', 'video', 'none'];
const counts = Object.fromEntries(ORDER.map((source) => [source, 0]));
for (const card of cards) counts[card.source] = (counts[card.source] ?? 0) + 1;

console.log(
  `share:census — ${cards.length} pages · ` +
    ORDER.map((source) => `${source} ${counts[source] ?? 0}`).join(' · '),
);

const shown = sourceArg ? [sourceArg] : ['hub', 'none'];
for (const source of shown) {
  const set = cards.filter((card) => card.source === source).sort((a, b) => a.path.localeCompare(b.path));
  if (set.length === 0) continue;
  console.log(`\n${source} · ${set.length}`);
  for (const card of set) console.log(`  ${card.kind.padEnd(10)} ${card.path}`);
}
