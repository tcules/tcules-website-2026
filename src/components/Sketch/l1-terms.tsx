import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { L1TermScene } from '@/lib/sketches';

import { Copy, Hop, Rect, Switch } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/**
 * The TERM scenes of the six service lines plus new product (round 6, 30 Oct 2026): "What we need
 * from you" and "Where our part stops", one pair per page, each drawn from its own page's words in
 * the flat-graphics grammar (docs/research/flat-graphics-grammar.md): 320 × 180 units, ports, turns
 * and line ends on the dots, routes on the axes, one arrowhead, weights 1 and 2, no words, Solar
 * glyphs, hatching for what is not there yet, sheets behind for one of many, ONE lit focal point.
 *
 *   needs-*   the HANDOVER, read "you to us". The client's panel (a neutral quiet-edged ground) holds up to three inputs on rows 50, 90, 130 in the copy's order; each
 *             route leaves its input's right port on its row and turns into one trunk at y = 90 that
 *             ends on the arrowhead at our frame's left port (190, 90). Our frame holds a heading
 *             line, a quiet line and the work, hatched, waiting on these. The lit input is the one the
 *             copy treats as decisive.
 *   stops-*   the BOUNDARY, read "us to you": our last piece, routed to our check on its own card
 *             (the lit focal point); what stays theirs sits on their panel (the same ground as the
 *             needs-* client panel, one row each: flag always means product calls; server, database
 *             and layers platform, data and infrastructure), no route entering it. The gap between
 *             the two is the boundary; nothing is drawn across it.
 *   team-*    WHO DOES THE WORK (round 7): our team frame with the senior designer lit and the account
 *             lead, and role cards to its right: the roles that are always in the team solid and routed
 *             in (arrowhead into the frame), the specialists who join when needed dashed, their route
 *             ending in an open node, no arrowhead.
 *
 * Never borrowed from How we work together's scope-* scenes, which draw a different argument.
 */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** A sheet centred at (cx, cy), with `behind` sheets stacked up and to the right: one of many. */
function Sheet({ cx, cy, behind = 0 }: { cx: number; cy: number; behind?: number }) {
  return (
    <>
      {Array.from({ length: behind }, (_, i) => behind - i).map((n) => (
        <Rect
          key={n}
          x={cx - 14 + n * 4}
          y={cy - 10 - n * 4}
          w={28}
          h={20}
          rx={4}
          className={styles.frameQuiet}
        />
      ))}
      <Rect x={cx - 14} y={cy - 10} w={28} h={20} rx={4} className={styles.frame} />
      <Glyph name="document-text" cx={cx} cy={cy} size={12} className={styles.glyph} />
    </>
  );
}

/** A run of chips on one row, centred on cx, 24 apart. */
function Chips({ cx, cy, glyphs }: { cx: number; cy: number; glyphs: readonly IconName[] }) {
  return (
    <>
      {glyphs.map((glyph, i) => (
        <C key={glyph} cx={cx + (i - (glyphs.length - 1) / 2) * 28} cy={cy} glyph={glyph} />
      ))}
    </>
  );
}

const ROWS = [50, 90, 130] as const;

/**
 * The handover: the client's panel, one route per row into one trunk, our frame at the end. The three
 * `inputs` are the rows' contents, top to bottom.
 */
function Needs({
  inputs,
}: {
  inputs: readonly [ReactNode, ReactNode, ReactNode];
}) {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      {inputs}
      <path className={styles.line} d={`M130,50 L144,50 A6,6 0 0 1 150,56 L150,90`} />
      <path className={styles.line} d={`M130,130 L144,130 A6,6 0 0 0 150,124 L150,90`} />
      <path className={styles.line} d={`M130,90 L150,90`} />
      {ROWS.map((y) => (
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

/** What stays theirs, one row on their panel: its chips, then a heading line and a quiet one. */
function Theirs({ cy, glyphs }: { cy: number; glyphs: readonly IconName[] }) {
  const n = glyphs.length;
  const x = 236 + 20 * (n - 1);
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

/**
 * The boundary: our last piece (`ours`) routed to our check on its own card, then their panel with
 * what stays theirs. No route enters their panel: the gap is the boundary.
 */
function Stops({
  ours,
  theirs,
}: {
  ours: ReactNode;
  theirs: readonly [ReactNode, ReactNode, ReactNode];
}) {
  return (
    <>
      {ours}
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      {theirs}
    </>
  );
}

/**
 * Who does the work: our team frame (the senior designer lit, the account lead) with role cards at
 * its right. A core role is solid and routed in; a joiner is dashed and its route ends open.
 */
type Role = { glyph: IconName; core?: boolean; sheets?: 0 | 1 };
export function Team({ roles }: { roles: readonly Role[] }) {
  const ys = roles.length === 1 ? [90] : roles.length === 2 ? [70, 110] : [50, 90, 130];
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {roles.map((role, i) => {
        const cy = ys[i] ?? 90;
        return (
          <g key={`${role.glyph}-${i}`}>
            {role.sheets ? (
              <Rect x={220} y={cy - 18} w={70} h={28} rx={8} className={styles.frameQuiet} />
            ) : null}
            <Rect
              x={216}
              y={cy - 14}
              w={70}
              h={28}
              rx={8}
              className={role.core ? styles.frame : styles.trailFrame}
            />
            <C cx={234} cy={cy} glyph={role.glyph} />
            <Copy x={250} y={cy} w={26} quiet />
            {role.core ? (
              <Hop x1={216} x2={180} y={cy} />
            ) : (
              <>
                <path className={styles.trail} d={`M216,${cy} L183,${cy}`} />
                <circle className={styles.nodeOpen} cx={180} cy={cy} r={3} />
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

/** A screen at (30, 50), 80 wide: its heading line, a line of copy, a quiet one, and an action. */
function Screen({
  h = 80,
  sheets = 0,
  action = false,
  children,
}: {
  h?: number;
  sheets?: number;
  action?: boolean;
  children?: ReactNode;
}) {
  return (
    <>
      {Array.from({ length: sheets }, (_, i) => sheets - i).map((n) => (
        <Rect
          key={n}
          x={30 - n * 4}
          y={50 - n * 4}
          w={80}
          h={h}
          rx={8}
          className={styles.frameQuiet}
        />
      ))}
      <Rect x={30} y={50} w={80} h={h} rx={8} className={styles.frame} />
      {children ?? (
        <>
          <Copy x={42} y={64} w={32} quiet />
          <Copy x={42} y={76} w={56} />
          <Copy x={42} y={88} w={44} quiet />
          {action ? (
            <Rect x={42} y={106} w={36} h={12} rx={6} className={styles.solid} />
          ) : (
            <Rect x={42} y={106} w={36} h={12} rx={4} className={styles.tile} />
          )}
        </>
      )}
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer and the account lead; researchers, design engineers and developers join when needed. */
function TeamProductDesign() {
  return <Team roles={[{ glyph: 'chat-round-dots' }, { glyph: 'code' }, { glyph: 'server' }]} />;
}

/** The senior designer and the account lead, with design engineers always in the team. */
function TeamAiProductUx() {
  return <Team roles={[{ glyph: 'code', core: true, sheets: 1 }]} />;
}

function TeamDesignEngineering() {
  return <Team roles={[{ glyph: 'code', core: true, sheets: 1 }]} />;
}

function TeamDesignSystems() {
  return <Team roles={[{ glyph: 'code', core: true, sheets: 1 }]} />;
}

/** Specialists join the senior designer and the account lead when the product needs them. */
function TeamNewProduct() {
  return <Team roles={[{ glyph: 'user' }, { glyph: 'user' }, { glyph: 'user' }]} />;
}

function TeamProductModernisation() {
  return <Team roles={[{ glyph: 'code' }, { glyph: 'server' }]} />;
}

/** Developers always in the team, and the senior engineer who reviews every change. */
function TeamSoftwareDevelopment() {
  return (
    <Team
      roles={[
        { glyph: 'code', core: true, sheets: 1 },
        { glyph: 'clipboard-check', core: true },
      ]}
    />
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** Research held, people who use it, someone who can make the product calls (lit). */
function NeedsProductDesign() {
  return (
    <Needs
      inputs={[
        <Sheet key="a" cx={72} cy={54} behind={2} />,
        <C key="b" cx={80} cy={90} glyph="users-group-rounded" />,
        <Focus key="c" x={80} y={130} glyph="user" size={12} />,
      ]}
    />
  );
}

/** One task your users already do (lit), the data and permissions the AI may use, good and bad results. */
function NeedsAiProductUx() {
  return (
    <Needs
      inputs={[
        <Focus key="a" x={80} y={50} glyph="checklist" size={12} />,
        <Chips key="b" cx={80} cy={90} glyphs={['database', 'lock']} />,
        <g key="c">
          <Rect x={44} y={118} w={32} h={24} rx={4} className={styles.frame} />
          <Glyph name="check-circle" cx={60} cy={130} size={12} className={styles.glyph} />
          <Rect x={84} y={118} w={32} h={24} rx={4} className={styles.frame} />
          <Glyph name="close-circle" cx={100} cy={130} size={12} className={styles.glyph} />
        </g>,
      ]}
    />
  );
}

/** The interaction in question (lit), a sandbox or the codebase, realistic data with the awkward case. */
function NeedsDesignEngineering() {
  return (
    <Needs
      inputs={[
        <Focus key="a" x={80} y={50} glyph="widget" size={12} />,
        <Chips key="b" cx={80} cy={90} glyphs={['code', 'key']} />,
        <g key="c">
          <Rect x={46} y={114} w={68} h={32} rx={4} className={styles.frame} />
          <Copy x={54} y={121} w={44} quiet />
          <Copy x={54} y={129} w={32} quiet />
          <Hatched x={54} y={134} w={44} h={8} />
          <Glyph name="danger-triangle" cx={106} cy={138} size={9} className={styles.glyphQuiet} />
        </g>,
      ]}
    />
  );
}

/** The screens, Figma files and code in use; where they copy or override; the leads who will own it (lit). */
function NeedsDesignSystems() {
  return (
    <Needs
      inputs={[
        <Chips key="a" cx={80} cy={50} glyphs={['monitor', 'ruler-pen', 'code']} />,
        <g key="b">
          <Rect x={44} y={82} w={32} h={16} rx={8} className={styles.tile} />
          <Copy x={54} y={90} w={12} quiet />
          <Hatched x={84} y={82} w={32} h={16} />
        </g>,
        <Focus key="c" x={80} y={130} glyph="users-group-rounded" size={12} />,
      ]}
    />
  );
}

/** Whatever exists, from a deck to a prototype; someone who makes the product calls (lit); access to first customers. */
function NeedsNewProduct() {
  return (
    <Needs
      inputs={[
        <g key="a">
          <Sheet cx={58} cy={50} behind={2} />
          <Rect x={88} y={40} w={30} h={20} rx={4} className={styles.trailFrame} />
          <Copy x={96} y={50} w={14} quiet />
        </g>,
        <Focus key="b" x={80} y={90} glyph="user" size={12} />,
        <C key="c" cx={80} cy={130} glyph="users-group-rounded" />,
      ]}
    />
  );
}

/** The live product, analytics and support history; people who use it daily; the leads who agree what changes (lit). */
function NeedsProductModernisation() {
  return (
    <Needs
      inputs={[
        <Chips key="a" cx={80} cy={50} glyphs={['monitor', 'graph-up', 'chat-round-dots']} />,
        <C key="b" cx={80} cy={90} glyph="users-group-rounded" />,
        <Focus key="c" x={80} y={130} glyph="users-group-rounded" size={12} />,
      ]}
    />
  );
}

/** Whatever exists, from research to a live codebase; access to the repository and environments; sign-off (lit). */
function NeedsSoftwareDevelopment() {
  return (
    <Needs
      inputs={[
        <g key="a">
          <Sheet cx={56} cy={54} behind={2} />
          <C cx={104} cy={50} glyph="code" />
        </g>,
        <Chips key="b" cx={80} cy={90} glyphs={['key', 'server']} />,
        <Focus key="c" x={80} y={130} glyph="user" size={12} />,
      ]}
    />
  );
}

/* ── Where our part stops ───────────────────────────────────────────────────────── */

/** Designs ready to build, handed over: what ships, the platform, and the engineers' code are theirs. */
function StopsProductDesign() {
  return (
    <Stops
      ours={<Screen sheets={2} />}
      theirs={[
        <Theirs key="a" cy={50} glyphs={['flag']} />,
        <Theirs key="b" cy={90} glyphs={['server', 'database']} />,
        <Theirs key="c" cy={130} glyphs={['code']} />,
      ]}
    />
  );
}

/** The AI's behaviour, designed; what it may do alone, how accurate the model is, and sign-off are theirs. */
function StopsAiProductUx() {
  return (
    <Stops
      ours={
        <Screen>
          <C cx={50} cy={66} glyph="stars" />
          <Copy x={42} y={86} w={48} />
          <Copy x={42} y={98} w={32} quiet />
          <Switch x={42} y={108} on={false} />
        </Screen>
      }
      theirs={[
        <g key="a">
          <Switch x={208} y={44} on={false} />
          <C cx={244} cy={50} glyph="user" />
          <Copy x={256} y={46} w={24} />
          <Copy x={256} y={54} w={16} quiet />
        </g>,
        <Theirs key="b" cy={90} glyphs={['cpu']} />,
        <Theirs key="c" cy={130} glyphs={['shield-check']} />,
      ]}
    />
  );
}

/** One change in the code, handed over: the review, the direction and the platform are theirs. */
function StopsDesignEngineering() {
  return (
    <Stops
      ours={
        <Screen>
          <Copy x={42} y={66} w={40} quiet />
          <Copy x={42} y={78} w={52} quiet />
          <path className={styles.line} d="M42,90 L86,90" />
          <Copy x={42} y={102} w={36} quiet />
          <Copy x={42} y={114} w={48} quiet />
        </Screen>
      }
      theirs={[
        <Theirs key="a" cy={50} glyphs={['clipboard-check']} />,
        <Theirs key="b" cy={90} glyphs={['flag']} />,
        <Theirs key="c" cy={130} glyphs={['server']} />,
      ]}
    />
  );
}

/** The system to its first release, drawn as components; contributions, the codebase and the calls are theirs. */
function StopsDesignSystems() {
  return (
    <Stops
      ours={
        <>
          <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
          {[60, 82, 104].map((y) =>
            [40, 74].map((x) => (
              <Rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                w={26}
                h={16}
                rx={x === 40 && y === 104 ? 8 : 4}
                className={styles.tile}
              />
            )),
          )}
        </>
      }
      theirs={[
        <Theirs key="a" cy={50} glyphs={['refresh']} />,
        <Theirs key="b" cy={90} glyphs={['code']} />,
        <Theirs key="c" cy={130} glyphs={['flag']} />,
      ]}
    />
  );
}

/** A built product, handed over: the code, the launch call and the specialist checks are theirs. */
function StopsNewProduct() {
  return (
    <Stops
      ours={<Screen action />}
      theirs={[
        <Theirs key="a" cy={50} glyphs={['key']} />,
        <Theirs key="b" cy={90} glyphs={['flag']} />,
        <Theirs key="c" cy={130} glyphs={['shield-check', 'user']} />,
      ]}
    />
  );
}

/** Each stage designed and checked: what ships, the infrastructure and any large cloud move are theirs. */
function StopsProductModernisation() {
  return (
    <Stops
      ours={<Screen sheets={2} />}
      theirs={[
        <Theirs key="a" cy={50} glyphs={['flag']} />,
        <Theirs key="b" cy={90} glyphs={['server', 'database']} />,
        <Theirs key="c" cy={130} glyphs={['layers']} />,
      ]}
    />
  );
}

/** What we build, checked; sign-off, hosting and large cloud moves are theirs. */
function StopsSoftwareDevelopment() {
  return (
    <Stops
      ours={
        <Screen>
          <C cx={50} cy={66} glyph="code" />
          <Copy x={42} y={86} w={48} />
          <Copy x={42} y={98} w={32} quiet />
          <Copy x={42} y={110} w={44} quiet />
        </Screen>
      }
      theirs={[
        <Theirs key="a" cy={50} glyphs={['clipboard-check']} />,
        <Theirs key="b" cy={90} glyphs={['server']} />,
        <Theirs key="c" cy={130} glyphs={['layers']} />,
      ]}
    />
  );
}

export const L1_TERMS: Record<L1TermScene, () => ReactNode> = {
  'team-product-design': TeamProductDesign,
  'team-ai-product-ux': TeamAiProductUx,
  'team-design-engineering': TeamDesignEngineering,
  'team-design-systems': TeamDesignSystems,
  'team-new-product': TeamNewProduct,
  'team-product-modernisation': TeamProductModernisation,
  'team-software-development': TeamSoftwareDevelopment,
  'needs-product-design': NeedsProductDesign,
  'needs-ai-product-ux': NeedsAiProductUx,
  'needs-design-engineering': NeedsDesignEngineering,
  'needs-design-systems': NeedsDesignSystems,
  'needs-new-product': NeedsNewProduct,
  'needs-product-modernisation': NeedsProductModernisation,
  'needs-software-development': NeedsSoftwareDevelopment,
  'stops-product-design': StopsProductDesign,
  'stops-ai-product-ux': StopsAiProductUx,
  'stops-design-engineering': StopsDesignEngineering,
  'stops-design-systems': StopsDesignSystems,
  'stops-new-product': StopsNewProduct,
  'stops-product-modernisation': StopsProductModernisation,
  'stops-software-development': StopsSoftwareDevelopment,
};
