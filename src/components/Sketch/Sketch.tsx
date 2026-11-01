import type { CSSProperties } from 'react';

import { cx } from '@/lib/cx';

import styles from './Sketch.module.css';
import { KIT } from './kit';
import { L1_BANDS } from './l1-bands';
import { L1_OUTCOMES } from './l1-outcomes';
import { L1_SPECIALISTS, L1_SPECIALISTS_DRAWN } from './l1-specialists';
import { L1_TERMS } from './l1-terms';
import { TERMS } from './terms';
import { OFFER, OFFER_DRAWN } from './offer';
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
   * Let a scene move when the link it sits in is hovered or focused (bare frame only, because the
   * moving route assumes its scale). A STORY scene (./stories) tells its story, the problem at rest and
   * solved (owner, 25 Oct 2026, home What we do); every other tile scene makes its one `Move`/`GrowIn`
   * move (decisions/2026-10-30-service-tile-drawing-moves-on-hover). Without it a scene is drawn still,
   * as every plate draws it: a cover or a card image does not move.
   */
  story?: boolean;
  /** A story drawing held in its solved state, or a live scene in its moved one, for a specimen showing both. */
  end?: boolean;
};

const W = 320;
const H = 180;

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
export function Sketch({ name, frame = 'plate', story = false, end = false }: SketchProps) {
  const bare = frame === 'bare';
  const storyDrawing = name ? STORY[name] : undefined;
  /* Any scene moves where it is asked to, in the bare frame; anywhere else it is held at rest (a story
     scene solved, every other scene as drawn: its Move parts at rest, its GrowIn parts present). */
  const live = story && bare;
  const moving = storyDrawing !== undefined && live;
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
      (name in TERMS ? TERMS[name as keyof typeof TERMS] : undefined))
    : undefined;
  const [x, y, w, h] =
    (bare &&
      (storyDrawing
        ? name && STORY_DRAWN[name]
        : name &&
          (DRAWN[name] ??
            OFFER_DRAWN[name as keyof typeof OFFER_DRAWN] ??
            L1_SPECIALISTS_DRAWN[name as keyof typeof L1_SPECIALISTS_DRAWN]))) ||
    ([0, 0, W, H] as const);
  return (
    <svg
      className={cx(
        styles.sketch,
        bare && styles.bare,
        storyDrawing !== undefined && !moving && styles.still,
        storyDrawing !== undefined && (end || !moving) && styles.end,
        live && styles.live,
        end && styles.solved,
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
