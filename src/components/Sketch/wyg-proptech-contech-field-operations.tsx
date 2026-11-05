import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Hop, Lens, Rect } from './offer';
import { Chip, Focus, Glyph, GrowIn, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** The live product, read row by row: the part that causes trouble flagged, the part people rely on lit. */
function AuditLiveProduct() {
  return (
    <>
      <Rect x={80} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={96} y={48} w={40} quiet />
      {/* The part that causes trouble. */}
      <Rect x={96} y={62} w={16} h={16} rx={4} className={styles.tile} />
      <Copy x={122} y={70} w={64} quiet />
      <Glyph name="danger-triangle" cx={214} cy={70} size={14} className={styles.glyph} />
      {/* The part people rely on. */}
      <Rect x={90} y={86} w={140} h={28} rx={10} className={styles.halo} />
      <Rect x={96} y={92} w={16} h={16} rx={4} className={styles.solid} />
      <Glyph name="users-group-rounded" cx={104} cy={100} size={10} className={styles.glyphOn} />
      <Copy x={122} y={100} w={80} />
      {/* A part that simply works. */}
      <Rect x={96} y={122} w={16} h={16} rx={4} className={styles.tile} />
      <Copy x={122} y={130} w={56} quiet />
    </>
  );
}

/** The researcher watches at the desk, but the site is the subject: the phone with its signal down to one bar, a message cutting in. */
function ResearchDesksSite() {
  return (
    <>
      {/* The desk: a workstation, the easy half. */}
      <Rect x={26} y={58} w={56} h={64} rx={8} className={styles.frame} />
      <Glyph name="monitor" cx={54} cy={90} size={24} className={styles.glyph} />
      {/* The site: the large subject. The phone, and the right column stacked on one axis: a message
          cutting in above the signal down to one bar (no flag: on this page a flag means trouble). */}
      <Rect x={156} y={40} w={134} h={100} rx={8} className={styles.frame} />
      <Glyph name="smartphone" cx={200} cy={90} size={36} className={styles.glyph} />
      <C cx={248} cy={66} glyph="chat-round-dots" />
      <rect x={238} y={106} width={5} height={8} rx={1} className={styles.solid} />
      <rect x={246} y={100} width={5} height={14} rx={1} className={styles.frameQuiet} />
      <rect x={254} y={94} width={5} height={20} rx={1} className={styles.frameQuiet} />
      {/* The researcher, on the ground between them, looking both ways; ports 6 clear of the halo. */}
      <Focus x={118} y={90} glyph="eye" size={12} />
      <Hop x1={94} x2={82} y={90} />
      <Hop x1={142} x2={156} y={90} />
    </>
  );
}

/** One person for each step: each card carries what that role must see, and the last one signs off. */
function EveryRoleSignoffChain() {
  const roles = [60, 160, 260] as const;
  return (
    <>
      {roles.map((cx, i) => (
        <g key={cx}>
          <Rect x={cx - 30} y={40} w={60} h={100} rx={8} className={styles.frame} />
          {i === 2 ? (
            <Focus x={cx} y={66} glyph="check-circle" size={13} />
          ) : (
            <Glyph name="user" cx={cx} cy={66} size={20} className={styles.glyph} />
          )}
          {/* What this role must see before acting. */}
          <Rect x={cx - 18} y={98} w={36} h={28} rx={4} className={styles.tile} />
          <Copy x={cx - 10} y={108} w={20} />
          <Copy x={cx - 10} y={116} w={14} quiet />
        </g>
      ))}
      <Hop x1={90} x2={130} y={90} />
      <Hop x1={190} x2={230} y={90} />
    </>
  );
}

/** One record of the property in the middle; the office and the site each reach it, every role from its side. */
function OneRecordEachProperty() {
  const roles: [number, number, IconName][] = [
    [50, 70, 'user'],
    [50, 110, 'user'],
    [270, 70, 'user'],
    [270, 110, 'user'],
  ];
  return (
    <>
      <Rect x={110} y={30} w={100} h={120} rx={8} className={styles.frame} />
      {/* The property: its picture, then its details. */}
      <Rect x={126} y={46} w={68} h={40} rx={4} className={styles.soft} />
      <Copy x={126} y={102} w={56} />
      <Copy x={126} y={114} w={40} quiet />
      <Copy x={126} y={126} w={48} quiet />
      {roles.map(([cx, cy, glyph]) => (
        <g key={`${cx}-${cy}`}>
          <Rect x={cx - 20} y={cy - 14} w={40} h={28} rx={8} className={styles.frame} />
          <Glyph name={glyph} cx={cx} cy={cy} size={16} className={styles.glyph} />
          {cx < 160 ? <Hop x1={70} x2={110} y={cy} /> : <Hop x1={250} x2={210} y={cy} />}
        </g>
      ))}
    </>
  );
}

/** The static mock-up passed over; the working prototype holds the moment the signal drops, and syncs. */
function FieldMomentsTriedWorking() {
  return (
    <>
      {/* The static mock-up: the moment never shows. */}
      <Rect x={70} y={50} w={80} h={80} rx={8} className={styles.frameQuiet} />
      <Copy x={82} y={64} w={36} quiet />
      <Hatched x={82} y={76} w={56} h={40} />
      <Hop x1={150} x2={190} y={90} />
      {/* The working prototype on the phone: offline, held, synced. */}
      <Rect x={190} y={30} w={60} h={120} rx={8} className={styles.frame} />
      <Copy x={202} y={46} w={28} quiet />
      <Copy x={202} y={56} w={36} />
      <Focus x={220} y={90} glyph="refresh" size={13} />
      <Copy x={202} y={122} w={36} quiet />
      <Rect x={202} y={130} w={36} h={10} rx={5} className={styles.tile} />
    </>
  );
}

/** The change, cut to the space your product leaves for it, goes into its place within the limits. */
function ChangeFitsExistingProduct() {
  return (
    <>
      {/* The change: built to the slot's size. */}
      <Rect x={30} y={50} w={72} h={40} rx={10} className={styles.halo} />
      <Rect x={36} y={56} w={60} h={28} rx={4} className={styles.solid} />
      <Glyph name="widget" cx={66} cy={70} size={14} className={styles.glyphOn} />
      <Hop x1={102} x2={150} y={70} />
      {/* The existing product, its parts in place, one space within its limits. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Rect x={166} y={56} w={60} h={28} rx={4} className={styles.trailFrame} />
      <Rect x={234} y={56} w={40} h={28} rx={4} className={styles.tile} />
      <Rect x={166} y={96} w={40} h={28} rx={4} className={styles.tile} />
      <Rect x={214} y={96} w={60} h={28} rx={4} className={styles.tile} />
      <Copy x={166} y={44} w={40} quiet />
      <Copy x={166} y={136} w={72} quiet />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer (lit) and the account lead; researchers for site visits, design engineers and developers join when needed. */
function TeamProptech() {
  const roles: IconName[] = ['eye', 'code', 'server'];
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {roles.map((glyph, i) => {
        const cy = [50, 90, 130][i] ?? 90;
        return (
          <g key={glyph}>
            <Rect x={216} y={cy - 14} w={70} h={28} rx={8} className={styles.trailFrame} />
            <C cx={234} cy={cy} glyph={glyph} />
            <Copy x={250} y={cy} w={26} quiet />
            <path className={styles.trail} d={`M216,${cy} L183,${cy}`} />
            <circle className={styles.nodeOpen} cx={180} cy={cy} r={3} />
          </g>
        );
      })}
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** People in the office and on site; the live product and its known limits; the person who decides what ships (lit). */
function NeedsProptech() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <C cx={66} cy={50} glyph="users-group-rounded" />
      <C cx={94} cy={50} glyph="smartphone" />
      <C cx={66} cy={90} glyph="monitor" />
      <C cx={94} cy={90} glyph="danger-triangle" />
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

/* ── Where our part stops ───────────────────────────────────────────────────────── */

/** What stays theirs, one row on their panel: its chips, then a heading line and a quiet one. */
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

/** Our screen presents their figures clearly; valuation models, BIM data, integrations and building codes stay theirs. */
function StopsProptech() {
  return (
    <>
      {/* Our last piece: the screen that shows their data plainly. */}
      {[2, 1].map((n) => (
        <Rect
          key={n}
          x={30 - n * 4}
          y={50 - n * 4}
          w={80}
          h={80}
          rx={8}
          className={styles.frameQuiet}
        />
      ))}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      <Rect x={42} y={74} w={56} h={24} rx={4} className={styles.tile} />
      <Copy x={42} y={110} w={44} />
      <Copy x={42} y={120} w={28} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Theirs: valuation models; BIM data; integrations and building codes. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['graph-up']} />
      <Theirs cy={90} glyphs={['layers', 'database']} />
      <Theirs cy={130} glyphs={['code', 'clipboard-check']} />
    </>
  );
}

/* ── What we design in ──────────────────────────────────────────────────────────── */

/**
 * Acquisition and deal-pipeline software: the property added from its place lands in its one deal on the
 * pipeline board. At rest the property stands off the board; on hover the route draws onto the board and
 * the deal it belongs to lights.
 */
function KindDealPipeline() {
  return (
    <>
      {/* The property, from its place. */}
      <Rect x={30} y={60} w={40} h={60} rx={8} className={styles.frame} />
      <Glyph name="map-point" cx={50} cy={82} size={20} className={styles.glyph} />
      <Copy x={40} y={106} w={20} quiet />
      {/* The pipeline board: two stages of deals. */}
      <Rect x={160} y={30} w={130} h={120} rx={8} className={styles.frameQuiet} />
      <Copy x={170} y={40} w={28} quiet />
      <Copy x={230} y={40} w={28} quiet />
      {[50, 80, 110].map((y) => (
        <Rect key={y} x={170} y={y} w={52} h={20} rx={4} className={styles.tile} />
      ))}
      {[50, 80].map((y) => (
        <Rect key={y} x={230} y={y} w={52} h={20} rx={4} className={styles.tile} />
      ))}
      <GrowIn>
        <Rect x={164} y={74} w={64} h={32} rx={10} className={styles.halo} />
        <Rect x={170} y={80} w={52} h={20} rx={4} className={styles.solid} />
        <Glyph name="map-point" cx={182} cy={90} size={12} className={styles.glyphOn} />
      </GrowIn>
      <circle className={styles.node} cx="70" cy="90" r="2.5" />
      <TraceIn d="M70,90 L157,90" />
      <GrowIn>
        <ArrowRight x={164} y={90} />
      </GrowIn>
    </>
  );
}

/** Listing screens: of the properties listed, the one that deserves a closer look stands out under the lens. */
function KindListingScreens() {
  return (
    <>
      <Rect x={40} y={30} w={240} h={120} rx={8} className={styles.frame} />
      {[56, 128, 200].map((x) => {
        const lit = x === 128;
        return (
          <g key={x}>
            {lit ? <Rect x={x - 6} y={40} w={76} h={100} rx={10} className={styles.halo} /> : null}
            <Rect x={x} y={46} w={64} h={88} rx={4} className={lit ? styles.frame : styles.tile} />
            <Rect x={x + 8} y={54} w={48} h={36} rx={4} className={lit ? styles.soft : styles.tile} />
            <Copy x={x + 8} y={104} w={36} quiet={!lit} />
            <Copy x={x + 8} y={118} w={24} quiet />
          </g>
        );
      })}
      <Lens x={158} y={67} r={11} />
    </>
  );
}

/**
 * AI drawing checks signed off by an engineer: the issue the AI marked on the plan goes to the engineer,
 * who signs it off. At rest the mark sits on the plan and the engineer waits; on hover the route draws
 * from the mark to the engineer and the tick grows.
 */
function KindAiDrawingChecks() {
  return (
    <>
      {/* The drawing: a plan, its rooms, one spot the AI marked. */}
      <Rect x={30} y={30} w={90} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M70,30 L70,70 M30,70 L70,70 M30,120 L120,120 M80,120 L80,150" />
      <Rect x={76} y={76} w={38} h={28} rx={4} className={styles.trailFrame} />
      <Glyph name="stars" cx={95} cy={90} size={16} className={styles.glyph} />
      {/* The engineer, and the sign-off still to give. */}
      <Rect x={210} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Glyph name="user" cx={250} cy={64} size={24} className={styles.glyph} />
      <circle className={styles.trailFrame} cx="250" cy="110" r="11" />
      <GrowIn>
        <Focus x={250} y={110} glyph="check-circle" size={13} />
      </GrowIn>
      <circle className={styles.node} cx="120" cy="90" r="2.5" />
      <TraceIn d="M120,90 L203,90" />
      <GrowIn>
        <ArrowRight x={210} y={90} />
      </GrowIn>
    </>
  );
}

/** Field apps for inspections: the inspection saved on the phone itself, plainly, while the office waits for signal. */
function KindFieldApps() {
  return (
    <>
      <Rect x={70} y={30} w={70} h={120} rx={8} className={styles.frame} />
      <Copy x={82} y={44} w={28} quiet />
      {[58, 72, 86].map((y) => (
        <g key={y}>
          <Rect x={82} y={y - 5} w={10} h={10} rx={3} className={styles.tile} />
          <path className={styles.line} d={`M84.5,${y} L86.5,${y + 2} L89.5,${y - 2}`} />
          <Copy x={98} y={y} w={30} />
        </g>
      ))}
      <Focus x={105} y={124} glyph="check-circle" size={13} />
      {/* The office, reached once there is signal: the route not taken yet. */}
      <path className={styles.trail} d="M140,90 L203,90" />
      <path className={styles.quietMark} d="M210,90 L203,86 L203,94 Z" />
      <Rect x={210} y={66} w={48} h={48} rx={8} className={styles.frameQuiet} />
      <Glyph name="server" cx={234} cy={90} size={22} className={styles.glyphQuiet} />
    </>
  );
}

/** Defect and handover apps: each defect's before photo, then its after photo, made good. */
function KindDefectHandover() {
  return (
    <>
      {/* Before: one of many defects, its photo with the fault. */}
      <Rect x={38} y={42} w={90} h={90} rx={8} className={styles.frameQuiet} />
      <Rect x={34} y={46} w={90} h={90} rx={8} className={styles.frameQuiet} />
      <Rect x={30} y={50} w={90} h={90} rx={8} className={styles.frame} />
      <Rect x={40} y={60} w={70} h={50} rx={4} className={styles.tile} />
      <Glyph name="danger-triangle" cx={75} cy={85} size={20} className={styles.glyph} />
      <Copy x={40} y={124} w={40} quiet />
      <Hop x1={120} x2={190} y={90} />
      {/* After: the same view, made good. */}
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Rect x={200} y={50} w={80} h={60} rx={10} className={styles.halo} />
      <Rect x={206} y={56} w={68} h={48} rx={4} className={styles.solid} />
      <Glyph name="check-circle" cx={240} cy={80} size={20} className={styles.glyphOn} />
      <Copy x={200} y={126} w={40} />
    </>
  );
}

/** Tenant portals: one job, tagged at the top, threads through tenant, manager and contractor alike. */
function KindTenantPortals() {
  const rows: readonly (readonly [number, IconName, number])[] = [
    [70, 'user', 80],
    [100, 'key', 64],
    [130, 'bolt-circle', 72],
  ];
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      {/* The one job: its tag, and the spine it runs down to every party. */}
      <Rect x={94} y={38} w={32} h={16} rx={8} className={styles.solid} />
      <Glyph name="checklist" cx={110} cy={46} size={10} className={styles.glyphOn} />
      {rows.map(([y, glyph, w]) => (
        <g key={y}>
          <path className={styles.line} d={`M110,54 L110,${y - 6} A6,6 0 0 0 116,${y} L120,${y}`} />
          <circle className={styles.node} cx={122} cy={y} r={2.5} />
          <Glyph name={glyph} cx={140} cy={y} size={16} className={styles.glyph} />
          <Rect x={156} y={y - 9} w={w} h={18} rx={9} className={styles.tile} />
          <Copy x={166} y={y} w={w - 24} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * /expertise/proptech-contech-field-operations · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* An audit of the live product: An audit of the live product: which parts cause trouble and which parts people rely on */
  'wyg-proptech-contech-field-operations-audit-live-product': AuditLiveProduct,
  /* Research at desks and on site: Research at desks and on site, where signal, gloves and interruptions change the work */
  'wyg-proptech-contech-field-operations-research-at-desks-site': ResearchDesksSite,
  /* Every role in the sign-off chain: Every role in the sign-off chain named, with what each must see before acting */
  'wyg-proptech-contech-field-operations-every-role-signoff-chain': EveryRoleSignoffChain,
  /* One record of each property: One record of each property, project or site, designed for every role around it */
  'wyg-proptech-contech-field-operations-one-record-each-property': OneRecordEachProperty,
  /* Field moments tried in working prototypes: The field moments, such as location, offline use and interruptions, tried in working prototypes where a static mock-up would hide them */
  'wyg-proptech-contech-field-operations-field-moments-tried-working': FieldMomentsTriedWorking,
  /* A change that fits your existing product: A change that fits your existing product and its technical limits, with the product questions answered for your engineers or ours */
  'wyg-proptech-contech-field-operations-change-fits-existing-product': ChangeFitsExistingProduct,
  /* Who does the work: A senior product designer heads the work and designs it, backed by an account lead. Researchers join for site visits, and design engineers o */
  'team-proptech-contech-field-operations': TeamProptech,
  /* What we need from you: Access to people in the office and on site, the live product and its known limits, and the person who decides what ships. For field work, we */
  'needs-proptech-contech-field-operations': NeedsProptech,
  /* Where our part stops: Valuation models, BIM data, integrations and building codes stay with your engineers and domain specialists; our design presents them clearl */
  'stops-proptech-contech-field-operations': StopsProptech,
  /* MOVING: this tile links to /case-studies/enterprise-workflow-redesign-dealpath-real-estate, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: Acquisition and deal-pipeline software for real estate acquisitions teams: Dealpath */
  'kind-proptech-contech-field-operations-acquisition-deal-pipeline-software': KindDealPipeline,
  /* What we design in, tile: Listing screens that show which property deserves a closer look: Dealpath */
  'kind-proptech-contech-field-operations-listing-screens-show-property': KindListingScreens,
  /* MOVING: this tile links to /case-studies/ai-quality-control-expert-review-buildtwin, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: AI drawing checks with an engineer who signs off each one: BuildTwin */
  'kind-proptech-contech-field-operations-ai-drawing-checks-engineer': KindAiDrawingChecks,
  /* What we design in, tile: Field apps for inspections and site visits: Offline saving and a clear "saved" state */
  'kind-proptech-contech-field-operations-field-apps-inspections-site': KindFieldApps,
  /* What we design in, tile: Defect and handover apps for new homes: Every defect with its before and after photos */
  'kind-proptech-contech-field-operations-defect-handover-apps-new': KindDefectHandover,
  /* What we design in, tile: Property management and tenant portals: Tenant, manager and contractor on one job */
  'kind-proptech-contech-field-operations-property-management-tenant-portals': KindTenantPortals,
};
