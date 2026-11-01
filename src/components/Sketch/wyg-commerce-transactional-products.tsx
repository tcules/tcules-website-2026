import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowLeft, ArrowRight, Copy, Cursor, Hop, Lens, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** The support inbox and the search box, read under the lens: the one complaint that keeps coming back. */
function Research() {
  return (
    <>
      <Rect x={98} y={38} w={140} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={94} y={42} w={140} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={90} y={46} w={140} h={100} rx={8} className={styles.frame} />
      <Chip x={102} y={58} glyph="chat-round-dots" />
      <Rect x={124} y={58} w={72} h={16} rx={8} className={styles.tile} />
      <Copy x={134} y={66} w={32} quiet />
      <Copy x={102} y={88} w={96} />
      <Rect x={102} y={100} w={116} h={16} className={styles.region} />
      <path className={styles.regionCopy} d="M134,108 L196,108" />
      <Copy x={146} y={130} w={64} quiet />
      <Lens x={130} y={108} r={16} />
    </>
  );
}

/** The product page: beside the price, the answers to fit, variant, delivery and warranty, together. */
function ProductPage() {
  const answers: IconName[] = ['ruler-pen', 'layers', 'clock-circle', 'shield-check'];
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      <Rect x={66} y={46} w={80} h={88} className={styles.tile} />
      <Copy x={162} y={52} w={64} quiet />
      <Copy x={162} y={66} w={36} />
      <Rect x={158} y={80} w={94} h={28} rx={10} className={styles.halo} />
      {answers.map((glyph, i) => (
        <C key={glyph} cx={172 + i * 22} cy={94} glyph={glyph} />
      ))}
      <Rect x={162} y={120} w={48} h={14} rx={7} className={styles.tile} />
    </>
  );
}

/** The checkout: measured, approved, then the payment it was waiting for. */
function Checkout() {
  return (
    <>
      <Rect x={90} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <C cx={110} cy={50} glyph="ruler-pen" />
      <Copy x={126} y={50} w={56} />
      <Glyph name="check-circle" cx={210} cy={50} size={12} className={styles.glyph} />
      <C cx={110} cy={90} glyph="clipboard-check" />
      <Copy x={126} y={90} w={48} />
      <Glyph name="check-circle" cx={210} cy={90} size={12} className={styles.glyph} />
      <TraceIn d="M110,58 L110,82 M110,98 L110,124 A6,6 0 0 0 116,130 L123,130" />
      <Rect x={124} y={116} w={92} h={28} rx={14} className={styles.halo} />
      <Rect x={130} y={122} w={80} h={16} rx={8} className={styles.solid} />
      <Glyph name="wallet" cx={146} cy={130} size={10} className={styles.glyphOn} />
      <path className={styles.tick} d="M158,130 L194,130" />
      <ArrowRight x={130} y={130} />
    </>
  );
}

/** One status track, the order at production, followed by the customer and the staff alike. */
function Status() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <Rect x={50} y={50} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="cart" cx={70} cy={70} size={16} className={styles.glyph} />
      <Hop x1={90} x2={140} y={70} />
      <Focus x={160} y={70} glyph="layers" size={12} />
      <path className={styles.trail} d="M180,70 L230,70" />
      <Rect x={230} y={50} w={40} h={40} rx={8} className={styles.trailFrame} />
      <Glyph name="flag" cx={250} cy={70} size={16} className={styles.glyphQuiet} />
      <path className={styles.hair} d="M30,106 L290,106" />
      <Glyph name="user" cx={70} cy={128} size={16} className={styles.glyph} />
      <Copy x={86} y={128} w={48} quiet />
      <Glyph name="users-group-rounded" cx={190} cy={128} size={16} className={styles.glyph} />
      <Copy x={206} y={128} w={48} quiet />
    </>
  );
}

/** One component set, between the store and the back office: the same control in both. */
function Components() {
  return (
    <>
      <Rect x={30} y={40} w={70} h={100} rx={8} className={styles.frame} />
      <Glyph name="cart" cx={46} cy={56} size={14} className={styles.glyph} />
      <Copy x={42} y={76} w={40} quiet />
      <Rect x={42} y={86} w={46} h={20} className={styles.tile} />
      <Rect x={42} y={116} w={32} h={12} rx={6} className={styles.solid} />

      <Rect x={130} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Copy x={144} y={64} w={24} quiet />
      <Rect x={144} y={76} w={32} h={12} rx={6} className={styles.solid} />
      <Rect x={144} y={96} w={32} h={12} rx={6} className={styles.tile} />
      <Rect x={144} y={114} w={20} h={8} rx={2} className={styles.tile} />

      <Rect x={220} y={40} w={70} h={100} rx={8} className={styles.frame} />
      <Glyph name="checklist" cx={236} cy={56} size={14} className={styles.glyph} />
      {[76, 88, 100].map((y, i) => (
        <Copy key={y} x={232} y={y} w={[44, 32, 40][i] ?? 40} quiet />
      ))}
      <Rect x={232} y={116} w={32} h={12} rx={6} className={styles.solid} />

      <path className={styles.line} d="M130,90 L107,90 M190,90 L213,90" />
      <ArrowLeft x={100} y={90} />
      <ArrowRight x={220} y={90} />
      <circle className={styles.node} cx="130" cy="90" r="2.5" />
      <circle className={styles.node} cx="190" cy="90" r="2.5" />
    </>
  );
}

/** The prototype, put to both kinds of buyer: the one who types the part number, the one comparing. */
function Prototypes() {
  return (
    <>
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.trailFrame} />
      <Copy x={46} y={58} w={40} quiet />
      <Copy x={46} y={72} w={64} />
      <Hatched x={46} y={84} w={68} h={18} />
      <Rect x={46} y={114} w={40} h={14} rx={7} className={styles.tile} />
      <Cursor x={76} y={112} />
      <Hop x1={130} x2={162} y={90} />
      <Rect x={162} y={40} w={128} h={100} rx={8} className={styles.frame} />
      <Glyph name="user" cx={178} cy={70} size={18} className={styles.glyph} />
      <Rect x={192} y={60} w={58} h={20} rx={10} className={styles.tile} />
      {/* the kit has no search glyph: a small magnifier drawn in the quiet ink */}
      <circle className={styles.copyQuiet} cx="203" cy="70" r="4" />
      <path className={styles.copyQuiet} d="M206,73 L209,76" />
      {/* a typed part number: three short code groups */}
      <Copy x={213} y={70} w={6} />
      <Copy x={224} y={70} w={6} />
      <Copy x={235} y={70} w={6} />
      <Glyph name="check-circle" cx={270} cy={70} size={14} className={styles.glyph} />
      <Glyph name="user" cx={178} cy={110} size={18} className={styles.glyph} />
      <Rect x={192} y={100} w={20} h={20} rx={3} className={styles.tile} />
      <Rect x={196} y={104} w={12} h={7} rx={1} className={styles.frameQuiet} />
      <Copy x={196} y={115} w={12} />
      <path className={styles.line} d="M221,107 L218,110 L221,113 M218,110 L228,110 M225,107 L228,110 L225,113" />
      <Rect x={232} y={100} w={20} h={20} rx={3} className={styles.tile} />
      <Rect x={236} y={104} w={12} h={7} rx={1} className={styles.frameQuiet} />
      <Copy x={236} y={115} w={12} />
      <Rect x={257} y={97} w={26} h={26} rx={13} className={styles.halo} />
      <Glyph name="check-circle" cx={270} cy={110} size={14} className={styles.glyphAccent} />
    </>
  );
}

/** The design, built as the store by our developers or written up as specs for your own team. */
function Build() {
  return (
    <>
      <Rect x={36} y={44} w={80} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={44} y={66} w={32} quiet />
      <Rect x={44} y={78} w={52} h={20} className={styles.tile} />
      <Copy x={44} y={112} w={40} quiet />
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      <TraceIn d="M110,90 L144,90 A6,6 0 0 0 150,84 L150,56 A6,6 0 0 1 156,50 L183,50" />
      <TraceIn d="M150,90 L150,124 A6,6 0 0 0 156,130 L183,130" />
      <ArrowRight x={190} y={50} />
      <ArrowRight x={190} y={130} />

      <Rect x={190} y={30} w={100} h={40} rx={8} className={styles.frame} />
      <Glyph name="cart" cx={208} cy={50} size={14} className={styles.glyph} />
      <Copy x={224} y={50} w={24} />
      <Rect x={256} y={44} w={22} h={12} rx={6} className={styles.solid} />

      <Rect x={190} y={110} w={100} h={40} rx={8} className={styles.frame} />
      <Glyph name="document-text" cx={208} cy={130} size={14} className={styles.glyph} />
      <Copy x={224} y={125} w={52} quiet />
      <Copy x={224} y={135} w={36} quiet />
    </>
  );
}

/* ── The terms ────────────────────────────────────────────────────────────────── */

/** The senior designer (lit) and the account lead; researchers join to observe, developers to build. */
function Team() {
  const roles: { glyph: IconName; cy: number }[] = [
    { glyph: 'eye', cy: 70 },
    { glyph: 'code', cy: 110 },
  ];
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {roles.map(({ glyph, cy }) => (
        <g key={glyph}>
          <Rect x={216} y={cy - 14} w={70} h={28} rx={8} className={styles.trailFrame} />
          <C cx={234} cy={cy} glyph={glyph} />
          <Copy x={250} y={cy} w={26} quiet />
          <path className={styles.trail} d={`M216,${cy} L183,${cy}`} />
          <circle className={styles.nodeOpen} cx={180} cy={cy} r={3} />
        </g>
      ))}
    </>
  );
}

/** Support emails, searches and analytics; buyers to test with and access; the person who makes the calls (lit). */
function Needs() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      {[2, 1].map((n) => (
        <Rect
          key={n}
          x={58 + n * 4}
          y={44 - n * 4}
          w={28}
          h={20}
          rx={4}
          className={styles.frameQuiet}
        />
      ))}
      <Rect x={58} y={44} w={28} h={20} rx={4} className={styles.frame} />
      <Glyph name="chat-round-dots" cx={72} cy={54} size={12} className={styles.glyph} />
      <C cx={66} cy={90} glyph="users-group-rounded" />
      <C cx={94} cy={90} glyph="key" />
      <Focus x={80} y={130} glyph="user" size={12} />
      <path className={styles.line} d="M130,50 L144,50 A6,6 0 0 1 150,56 L150,90" />
      <path className={styles.line} d="M130,130 L144,130 A6,6 0 0 0 150,124 L150,90" />
      <path className={styles.line} d="M130,90 L150,90" />
      {[50, 90, 130].map((y) => (
        <circle key={y} className={styles.node} cx={130} cy={y} r="2.5" />
      ))}
      <circle className={styles.node} cx="150" cy="90" r="3.5" />
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Copy x={206} y={58} w={48} />
      <Copy x={206} y={70} w={68} quiet />
      <Hatched x={206} y={86} w={68} h={40} />
    </>
  );
}

/** One row on their panel: its chips, then a heading line and a quiet one. */
function Theirs({ cy, glyphs }: { cy: number; glyphs: readonly IconName[] }) {
  const x = 236 + 20 * (glyphs.length - 1);
  const w = 280 - x;
  return (
    <>
      {glyphs.map((glyph, i) => (
        <C key={glyph} cx={216 + i * 20} cy={cy} glyph={glyph} />
      ))}
      <Copy x={x} y={cy - 4} w={w} />
      <Copy x={x} y={cy + 4} w={Math.round(w * 0.7)} quiet />
    </>
  );
}

/** The store designed, checked and handed over; marketing, consumer rules and payments stay theirs. */
function Stops() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="cart" cx={48} cy={68} size={14} className={styles.glyph} />
      <Copy x={62} y={68} w={32} quiet />
      <Copy x={42} y={88} w={56} />
      <Rect x={42} y={106} w={36} h={12} rx={4} className={styles.tile} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['graph-up']} />
      <Theirs cy={90} glyphs={['shield-check']} />
      <Theirs cy={130} glyphs={['wallet', 'lock']} />
    </>
  );
}

/**
 * /expertise/commerce-transactional-products · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Research from support emails and search terms: Research from support emails, search terms and abandoned baskets, and from watching staff handle orders */
  'wyg-commerce-transactional-products-research-from-support-emails': Research,
  /* Product pages that answer fit: Navigation, search and product pages that answer fit, variant, stock, delivery and warranty beside the price */
  'wyg-commerce-transactional-products-product-pages-answer-fit': ProductPage,
  /* A checkout with the checks your products need: A checkout with the measuring, approvals and checks your products need before payment */
  'wyg-commerce-transactional-products-checkout-checks-products-need': Checkout,
  /* Order, production and delivery status: Order, production and delivery status that customers and staff can both follow */
  'wyg-commerce-transactional-products-order-production-delivery-status': Status,
  /* One set of components: One set of components and a style guide shared by the store and the back office, so a repeated interaction is agreed once with engineering */
  'wyg-commerce-transactional-products-one-set-components': Components,
  /* Prototypes tested with buyers: Prototypes tested with buyers who know the part number and buyers still comparing */
  'wyg-commerce-transactional-products-prototypes-tested-buyers': Prototypes,
  /* The store built on Shopify or Magento: The store built on Shopify or Magento by our developers, or specs for your own team */
  'wyg-commerce-transactional-products-store-built-shopify-or': Build,
  /* Who does the work: Your lead is a senior product designer who also does the design, with an account lead keeping the work on track. Researchers join for the ob */
  'team-commerce-transactional-products': Team,
  /* What we need from you: Support emails, search terms and analytics, and time with the staff who handle orders. Buyers or trade accounts to test with, access to the  */
  'needs-commerce-transactional-products': Needs,
  /* Where our part stops: Ads, email campaigns and testing programmes stay with your performance marketing specialists. Consumer rules and payment authentication stay */
  'stops-commerce-transactional-products': Stops,
};
