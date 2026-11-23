import type { CSSProperties, ReactNode } from 'react';

import { cx } from '@/lib/cx';

import styles from './Sketch.module.css';
import { KIT } from './kit';
import { L1_BANDS } from './l1-bands';
import { L1_OUTCOMES } from './l1-outcomes';
import { L1_SPECIALISTS, L1_SPECIALISTS_DRAWN } from './l1-specialists';
import { L1_TERMS } from './l1-terms';
import { TERMS } from './terms';
import { OFFER, OFFER_DRAWN } from './offer';
import { PAGES } from './wyg';
import { INFOGRAPHICS, type SketchLabel } from './ov-figures';
import { STILL } from './scenes';
import { STORY, STORY_DRAWN } from './stories';
import type { SketchName } from '@/lib/sketches';

/**
 * What a sketch shows (the names live in @/lib/sketches, with the route map). One scene per service,
 * each drawing only what the service's name says, in the flat-graphics grammar
 * (docs/research/flat-graphics-grammar.md): the dot field, quiet frames, one blue focal point.
 *   new-product            the product dashed, its first release built, the parts still to come
 *                          hatched, the launch lit
 *   product-design         a screen whose flow reaches a decision, both branches drawn out of it
 *   product-modernisation  a cluttered legacy screen rebuilt as the same screen, clean
 *   design-systems         a library of components, one of them placed into a screen
 *   ai-product-ux          a suggestion, and the person's cursor accepting it
 *   design-engineering     the design and its code side by side, one component shared
 *   software-development   three layers of a product, joined, the release lit
 *   audits                 a problem on the screen traced to the findings, ranked, the first lit
 * And the ARTICLE scenes, each drawn for one insight from its own argument, its cover until a real
 * one exists (owner, 13 Oct 2026; @/lib/sketches `ArticleSceneName`): code-review,
 * security-checklist, prototype-to-production. And the KIT scenes (./kit): EngagementOptions' scopes
 * (`scope-*`) and TracePlates' stages (`trace-*`), so every flat drawing is drawn by this one component
 * (owner, 26 Oct 2026, S2). And the OFFER scenes (./offer): a service page's items, each drawn from its
 * own words (owner, 26 Oct 2026, product-design page).
 */
export type { SketchName };

const sceneRegistries = [
  STORY,
  STILL,
  KIT,
  OFFER,
  L1_BANDS,
  L1_OUTCOMES,
  L1_SPECIALISTS,
  L1_TERMS,
  TERMS,
  PAGES,
];

export function isSketchName(name: string): name is SketchName {
  return sceneRegistries.some((registry) => Object.hasOwn(registry, name));
}

export type SketchProps = {
  /**
   * The scene. Absent: the EMPTY PLATE, its dot field and nothing drawn on it, where a set of scenes
   * names a subject whose own scene is not drawn yet (GatewayPaths' service rows, owner 29 Oct 2026:
   * a scene is never borrowed from another subject). Plate frame only; a bare frame draws nothing.
   */
  name?: SketchName;
  /**
   * `plate` (default): the drawing on its 16:9 dot-field plate, filling its box's width.
   * `bare`: the drawing alone, cropped to its own drawn edge and set at its own size in drawing
   * units, for a parent that supplies the ground and the scale (Bento, owner 19 Oct 2026). Cropped
   * so its left edge is the drawing's, not the plate's margin: a bare scene set on a title's edge
   * starts exactly there. Its size is its width in drawing units times `--skt-scale` (default 1),
   * which the parent sets on an ancestor to scale it, per breakpoint if it needs to.
   */
  frame?: 'plate' | 'bare';
  /**
   * Let a scene move when the link it sits in is hovered or focused, in either frame (owner, 1 Nov
   * 2026: every hover tile that carries a drawing animates it). A bare parent sets `--skt-scale` so the
   * route lands at the line weight; on a plate it scales with the plate. A STORY scene (./stories) tells its story, the problem at rest and
   * solved (owner, 25 Oct 2026, home What we do); every other tile scene makes its one `Move`/`GrowIn`
   * move (decisions/2026-10-30-service-tile-drawing-moves-on-hover). Without it a scene is drawn still,
   * as every plate draws it: a cover or a card image does not move. A still scene shows its END state,
   * the picture the tile's move arrives at (owner, 19 Nov 2026: "motion on the tiles but the static end
   * state inside resources"): every moving part (TraceIn, GrowIn, Glide, the parts that light, Move)
   * set where the hover leaves it, with no transition, from the same drawing.
   */
  story?: boolean;
  /**
   * A LIVE scene held in its end state, for a specimen showing rest and end side by side. A still scene
   * needs no flag: it is always its end state.
   */
  end?: boolean;
  /**
   * `wide` (default): the 320 × 180 drawing on its 16:9 plate. `portrait` (19 Nov 2026, the overhaul
   * pages' figures beside rows, MVP's "Your demo works" and "Your prototype is the brief"): a 240 × 300
   * drawing on a 4:5 plate, the media split's own ratio, its dot field on the same 20-unit grid. A
   * plate only: the bare frame crops to a drawing's own edge whatever its shape.
   */
  shape?: 'wide' | 'portrait';
  /**
   * The plate fills its parent's box, whatever its shape, instead of setting its own height from the
   * drawing's ratio (round 10, owner 19 Nov 2026: MVP's brief drawing "need not be this tall", it is as
   * tall as the rows beside it). The drawing centres at the scale the box's shorter side allows and
   * the dot field runs on to the plate's edges on the same grid. The parent must be a size container
   * (`container-type: size`), as ContentSection's `media.headAbove` box is. A plate only.
   */
  fill?: boolean;
};

const W = 320;
const H = 180;
/** The portrait plate's drawing, 4:5 on the same 20-unit grid. */
const PORTRAIT_W = 240;
const PORTRAIT_H = 300;

/** Every infographic's phone composition, by its own name, with its labels: drawn 240 × 300. */
const PHONE: ReadonlyMap<string, readonly SketchLabel[]> = new Map(
  Object.values(INFOGRAPHICS).flatMap((infographic) =>
    infographic?.phone ? [[infographic.phone.name, infographic.phone.labels] as const] : [],
  ),
);

/**
 * The still scenes' drawn edge in the 320 × 180 drawing, for the bare frame: the one shared area every
 * scene is centred in (round 3), halos included. A story scene's is in ./stories.
 */
const DRAWN: Partial<Record<SketchName, readonly [number, number, number, number]>> = {
  'new-product': [26, 26, 268, 128],
  /* The two engagement terms' marks (EngagementOptions `terms`, owner 30 Oct 2026): set bare, so
     cropped to the drawn edge. */
  'scope-build': [30, 30, 260, 120],
  'scope-overlap': [50, 24, 220, 126],
};

/**
 * Sketch — a small drawing on its plate (16:9, the photograph radius), a stand-in for an illustration
 * where a block needs a visual subject and no illustration exists (owner, 12 Oct 2026, the About
 * services selector: "some visual element with the text on the right side would be nice").
 * Decorative: `aria-hidden`, the words beside it carry the meaning. Strokes are non-scaling and come
 * in the grammar's two weights, 1 and 2, at every size (owner, 26 Oct 2026, S2). The dot field is the
 * plate's CSS background and the drawings use no ids, so any number can share a page.
 */
export function Sketch(props: SketchProps) {
  /* A PHONE COMPOSITION named on its own (a specimen showing it beside its wide chart) is still drawn
     on its own shape, the portrait plate, with its own labels: a scene's shape belongs to the scene,
     never to the caller, so a portrait drawing cannot land on a 16:9 plate. */
  const phoneLabels =
    props.name && (props.frame ?? 'plate') === 'plate' ? PHONE.get(props.name) : undefined;
  if (phoneLabels) {
    return (
      <Labelled labels={phoneLabels} w={PORTRAIT_W} h={PORTRAIT_H}>
        <Plate {...props} shape="portrait" />
      </Labelled>
    );
  }
  const infographic =
    props.name && (props.frame ?? 'plate') === 'plate' && props.name in INFOGRAPHICS
      ? INFOGRAPHICS[props.name as keyof typeof INFOGRAPHICS]
      : undefined;
  if (!infographic || !props.name) return <Plate {...props} />;
  /* An INFOGRAPHIC (owner, 19 Nov 2026, How we work's engagement chart: "because it is an infographic,
     we can add labels"): the one kind of flat drawing that carries words, as short labels in the
     site's mono label voice set over the plate, at a fixed type size at every width rather than
     scaled with the drawing. Its phone composition, when it has one, replaces it below 768, where the
     wide chart's labels would not fit. Decorative as a whole, as every Sketch is: the words around
     it carry the meaning. */
  const wide = (
    <Labelled labels={infographic.labels} w={W} h={H}>
      <Plate {...props} />
    </Labelled>
  );
  if (!infographic.phone) return wide;
  return (
    <div>
      <div className={styles.fromMd}>{wide}</div>
      <div className={styles.untilMd}>
        <Labelled labels={infographic.phone.labels} w={PORTRAIT_W} h={PORTRAIT_H}>
          <Plate name={infographic.phone.name} shape="portrait" />
        </Labelled>
      </div>
    </div>
  );
}

/** The plate with its labels over it, each placed by its point in the drawing's units. */
function Labelled({
  labels,
  w,
  h,
  children,
}: {
  labels: readonly SketchLabel[];
  w: number;
  h: number;
  children: ReactNode;
}) {
  return (
    <div className={styles.labelled} aria-hidden="true">
      {children}
      {labels.map((label) => (
        <span
          key={`${label.x},${label.y}`}
          className={cx(
            styles.label,
            label.align === 'start'
              ? styles.labelStart
              : label.align === 'end'
                ? styles.labelEnd
                : styles.labelMiddle,
            label.accent && styles.labelAccent,
          )}
          /* The label's point as shares of the plate, which scales with its box. */
          style={
            {
              '--skt-label-x': `${(label.x / w) * 100}%`,
              '--skt-label-y': `${(label.y / h) * 100}%`,
            } as CSSProperties
          }
        >
          {label.lines.map((line) => (
            <span key={line} className={styles.labelLine}>
              {line}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

function Plate({
  name,
  frame = 'plate',
  story = false,
  end = false,
  shape = 'wide',
  fill = false,
}: SketchProps) {
  const bare = frame === 'bare';
  const portrait = !bare && shape === 'portrait';
  const storyDrawing = name ? STORY[name] : undefined;
  /* A scene moves where it is asked to; anywhere else it is held at its END state (a story scene
     solved, every other scene moved: its routes drawn, its GrowIn parts present, its Move parts moved),
     the same picture the tile's hover arrives at (owner, 19 Nov 2026). */
  const live = story;
  const Still = name
    ? (STILL[name] ??
      (name in KIT ? KIT[name as keyof typeof KIT] : undefined) ??
      (name in OFFER ? OFFER[name as keyof typeof OFFER] : undefined) ??
      (name in L1_BANDS ? L1_BANDS[name as keyof typeof L1_BANDS] : undefined) ??
      (name in L1_OUTCOMES ? L1_OUTCOMES[name as keyof typeof L1_OUTCOMES] : undefined) ??
      (name in L1_SPECIALISTS
        ? L1_SPECIALISTS[name as keyof typeof L1_SPECIALISTS]
        : undefined) ??
      (name in L1_TERMS ? L1_TERMS[name as keyof typeof L1_TERMS] : undefined) ??
      (name in TERMS ? TERMS[name as keyof typeof TERMS] : undefined) ??
      PAGES[name as keyof typeof PAGES])
    : undefined;
  const [x, y, w, h] =
    (bare &&
      (storyDrawing
        ? name && STORY_DRAWN[name]
        : name &&
          (DRAWN[name] ??
            OFFER_DRAWN[name as keyof typeof OFFER_DRAWN] ??
            L1_SPECIALISTS_DRAWN[name as keyof typeof L1_SPECIALISTS_DRAWN]))) ||
    (portrait ? ([0, 0, PORTRAIT_W, PORTRAIT_H] as const) : ([0, 0, W, H] as const));
  return (
    <svg
      className={cx(
        styles.sketch,
        bare && styles.bare,
        portrait && styles.portrait,
        !bare && fill && styles.fill,
        /* Every scene not asked to move is held finished: its routes drawn, what arrives there,
           what lights lit, what moves moved (a plate never moves, owner 25 Oct 2026; its end state
           inside a resource, owner 19 Nov 2026). */
        !live && styles.still,
        (end || !live) && styles.end,
        live && styles.live,
      )}
      viewBox={`${x} ${y} ${w} ${h}`}
      width={bare ? w : undefined}
      height={bare ? h : undefined}
      /* The bare drawing's width in drawing units, for its own stylesheet to scale (--skt-scale). */
      style={bare ? ({ '--skt-units': w } as CSSProperties) : undefined}
      focusable="false"
      aria-hidden="true"
      /* The scene name, in development only, so "no scene twice on a page" can be scanned. */
      data-scene={process.env.NODE_ENV !== 'production' ? name : undefined}
    >
      {storyDrawing ?? (Still ? <Still /> : null)}
    </svg>
  );
}
