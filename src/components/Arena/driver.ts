/**
 * The Arena's timeline, ported from the owner's "Tcules Hero Arena" artifact (2 Nov 2026,
 * https://claude.ai/artifact/Y1uVUykZLj9Bdi1XNhFRYQ). Every number below is the drawing's: the
 * coordinates are in the SVG's own user space (viewBox 1024 × 720), and the times are milliseconds
 * into the 10.3-second loop. They are not layout values and do not belong in the token layer.
 *
 * Scoped to one SVG: every element is looked up inside it by its `arena-` prefixed id, never on the
 * document, so the drawing cannot reach anything else on the page.
 *
 * Phases are written to the stage as `data-phase` ('grey' while the field is held, 'far' once the
 * app has risen); the stylesheet does the rest (the field's fade, the fog lifting, the glow).
 */

type XY = [number, number];
type Pt = 'row' | 'note' | 'c1a' | 'c1b' | 'opt' | 'slot' | 'c2a' | 'c2b' | 'built' | 'card';
type Head = 'client' | 'res' | 'des' | 'eng';
type Station = 'R' | 'D' | 'B';
type Shim = 'shR' | 'shD' | 'shB';

/* The drawing's geometry, measured when it was drawn. */
const J = {
  off: 201.5,
  posts: [
    [320.0, 134.4, -67.1],
    [658.0, 303.4, 101.9],
    [106.8, 241.0, 39.5],
  ] as const,
  pts: {
    row: [239.68, 15.38],
    note: [222.76, 210.06],
    c1a: [240.7, 270.25],
    c1b: [309.6, 264.4],
    opt: [354.45, 263.69],
    slot: [407.75, 243.28],
    c2a: [440.9, 287.15],
    c2b: [512.4, 281.3],
    built: [613.8, 263.62],
    card: [388.07, 104.86],
  } as Record<Pt, XY>,
  nd: [
    [16.38, 11.2],
    [32.68, 6.06],
    [27.96, 1.04],
    [-20.88, 2.77],
    [-23.56, -11.73],
    [-20.24, -30.92],
    [-23.62, 10.54],
    [-41.6, -26.77],
    [-12.54, -2.57],
  ] as XY[],
  heads: {
    client: [153.6, 185.6],
    res: [187.4, 210.3],
    des: [388.9, 234.3],
    eng: [551.4, 246.7],
  } as Record<Head, XY>,
  ag: {
    R: [
      [198.45, 186.85],
      [200.01, 198.69],
      [198.45, 208.95],
      [221.2, 220.33],
      [222.76, 210.06],
      [221.2, 198.23],
      [243.95, 209.6],
      [245.51, 221.44],
      [243.95, 231.7],
    ],
    D: [
      [350.55, 250.68],
      [365.5, 258.16],
      [380.45, 265.63],
      [339.5, 256.21],
      [354.45, 263.69],
      [369.4, 271.16],
    ],
    B: [
      [589.75, 242.75],
      [586.89, 246.27],
      [597.03, 256.27],
      [583.25, 254.32],
      [593.39, 264.34],
      [590.53, 267.84],
    ],
  } as Record<Station, XY[]>,
  heroClosed: { cx: 382.4, cy: 278.7 },
};

const XA = 66;
const XB = 880;
const RISE = 70;
const LOOP = 10300;

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fade = (c: number, t0: number, d = 220) => clamp((c - t0) / d);
const win = (c: number, a: number, b: number, f = 160) =>
  c < a || c > b ? 0 : Math.min(1, (c - a) / f, (b - c) / f);

/* A point `p` (0–1) of the way along a polyline, by length. */
function pathAt(list: readonly XY[], p: number): XY {
  const pt = (i: number): XY => list[i] ?? [0, 0];
  const L: number[] = [0];
  const len = (i: number) => L[i] ?? 0;
  for (let i = 1; i < list.length; i++)
    L.push(len(i - 1) + Math.hypot(pt(i)[0] - pt(i - 1)[0], pt(i)[1] - pt(i - 1)[1]));
  const d = p * len(L.length - 1);
  let i = 1;
  while (i < L.length - 1 && len(i) < d) i++;
  const q = (d - len(i - 1)) / (len(i) - len(i - 1) || 1);
  return [lerp(pt(i - 1)[0], pt(i)[0], q), lerp(pt(i - 1)[1], pt(i)[1], q)];
}

export type ArenaDriver = {
  play(): void;
  pause(): void;
  replay(): void;
  /** Stop the clock while the drawing is out of view, without touching the reader's pause. */
  suspend(): void;
  resume(): void;
  destroy(): void;
};

export type ArenaOptions = {
  /** Start on the finished frame and wait for the reader (prefers-reduced-motion). */
  still: boolean;
  /** The square cut: the camera holds on the studio floor rather than the whole app. */
  phone: boolean;
};

export function startArena(
  stage: HTMLElement,
  svg: SVGSVGElement,
  { still: startStill, phone }: ArenaOptions,
): ArenaDriver {
  const $ = (id: string) => svg.querySelector<SVGGraphicsElement>(`#arena-${id}`);
  const need = (id: string) => {
    const e = $(id);
    if (!e) throw new Error(`Arena: the drawing has no #arena-${id}`);
    return e;
  };

  const cam = need('cam');
  const hero = need('hero');
  const lid = need('lid');
  const gap = need('gap');
  const tok = need('token');
  const clipR = need('clipR');
  const seam = need('seam');
  const fly = need('fly');
  const crews = [...svg.querySelectorAll<SVGGraphicsElement>('#arena-hero .crew')];
  const notes = [...svg.querySelectorAll<SVGGraphicsElement>('#arena-hero .note')];
  const P = J.pts;
  let OFF = 0;
  let LASTO = 0;
  let LIVE = false;

  const op = (id: string, v: number) => $(id)?.setAttribute('opacity', v.toFixed(2));
  const setSeam = (x: number) => {
    clipR.setAttribute('x', String(x));
    clipR.setAttribute('width', String(990 - x));
    seam.setAttribute('transform', `translate(${x} 0)`);
  };
  const setOpen = (o: number) => {
    OFF = J.off * (1 - o);
    lid.setAttribute('transform', `translate(0 ${OFF.toFixed(2)})`);
    const a = clamp((o - 0.25) / 0.5);
    crews.forEach((c) => c.setAttribute('opacity', a.toFixed(2)));
    let h = '';
    if (o > 0.02)
      J.posts.forEach((p) => {
        const y1 = p[1];
        const y2 = p[2] + OFF;
        if (y1 > y2 + 1)
          h += `<line x1="${p[0]}" y1="${y1}" x2="${p[0]}" y2="${y2}" stroke="#B8C8FF" stroke-width="1"/>`;
      });
    gap.innerHTML = h;
  };
  const setCam = (cx: number, cy: number, k: number) =>
    cam.setAttribute(
      'transform',
      `translate(512 360) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`,
    );
  const onLid = (k: Pt): XY => [P[k][0], P[k][1] + OFF];
  const along = (keys: Pt[], p: number) =>
    pathAt(
      keys.map((k) => (k === 'row' || k === 'card' ? onLid(k) : P[k])),
      p,
    );
  const token = (xy: XY | null, a: number) => {
    if (!xy) return op('token', 0);
    tok.setAttribute('transform', `translate(${xy[0].toFixed(1)} ${xy[1].toFixed(1)}) scale(1)`);
    op('token', a);
  };
  const place = (id: string, xy: XY | null, a: number) => {
    const e = $(id);
    if (!e) return;
    if (!xy || a <= 0) {
      e.setAttribute('opacity', '0');
      return;
    }
    e.setAttribute('transform', `translate(${xy[0].toFixed(1)} ${xy[1].toFixed(1)})`);
    e.setAttribute('opacity', a.toFixed(2));
  };

  /* The shimmer bars inside each station's progress strip. */
  const bar = (id: Shim) => {
    const b = need(`${id}b`);
    const r = svg.querySelector(`#arena-${id} rect`);
    return { b, x0: +(b.getAttribute('x') ?? 0), w: +(r?.getAttribute('width') ?? 0) };
  };
  const SH: Record<Shim, ReturnType<typeof bar>> = {
    shR: bar('shR'),
    shD: bar('shD'),
    shB: bar('shB'),
  };
  const shim = (id: Shim, c: number, t0: number, d: number) => {
    const o = SH[id];
    const p = (c - t0) / d;
    if (p <= 0 || p >= 1) return o.b.setAttribute('opacity', '0');
    o.b.setAttribute('x', (o.x0 + p * (o.w + 3.2)).toFixed(2));
    o.b.setAttribute('opacity', '1');
  };
  const bub = (who: Head, kind: string, c: number, a: number, b: number) => {
    const h = J.heads[who];
    place(
      `b-${who}-${kind}`,
      [h[0] + (who === 'des' ? -38 : 16), h[1] + 4 - 6 * ease(clamp((c - a) / 220))],
      win(c, a, b),
    );
  };
  const agentH = (id: string, key: Station, c: number, a: number, b: number, h: number) => {
    const L = J.ag[key];
    if (c < a - 150 || c > h) return place(id, null, 0);
    place(id, pathAt(L, ease(clamp((c - a) / (b - a - 150)))), win(c, a - 150, h));
  };

  /* The studio floor, as a function of time in the loop. */
  function floor(c: number) {
    bub('client', 'dots', c, 1850, 2500);
    bub('res', 'dots', c, 2250, 2850);
    agentH('agR', 'R', c, 1950, 2950, 3700);
    shim('shR', c, 1950, 950);
    const pn = ease(clamp((c - 1950) / 950));
    notes.forEach((e, k) => {
      const d = J.nd[k];
      if (!d) return;
      e.setAttribute(
        'transform',
        `translate(${(d[0] * (1 - pn)).toFixed(1)} ${(d[1] * (1 - pn)).toFixed(1)})`,
      );
    });
    op('found', fade(c, 2950, 200));
    agentH('agD', 'D', c, 3650, 4350, 5650);
    shim('shD', c, 3650, 700);
    const ORD = [0, 5, 2, 3, 1];
    for (let k = 0; k < 6; k++) {
      const xi = ORD.indexOf(k);
      op(
        `opt${k}`,
        fade(c, 3700 + k * 100, 130) *
          (k === 4 ? 1 - fade(c, 4750, 180) : 1 - fade(c, 4400 + xi * 70, 160)),
      );
    }
    op('pick', fade(c, 4650, 180));
    bub('des', 'tick', c, 4550, 5000);
    op(
      'slotFill',
      fade(c, 4950, 180) *
        (c > 6050 && c < 6350 ? 0.4 + 0.6 * Math.abs(Math.cos((c - 6050) / 50)) : 1),
    );
    bub('client', 'tick', c, 5450, 5950);
    agentH('agB', 'B', c, 5600, 6400, 7900);
    shim('shB', c, 5600, 800);
    for (let k = 0; k < 6; k++) op(`code${k}`, fade(c, 5620 + k * 125, 110));
    for (let k = 0; k < 3; k++) op(`chk${k}`, fade(c, 6450 + k * 100, 110));
    bub('des', 'dots', c, 6450, 6800);
    op('built', fade(c, 7050, 180) * (1 - fade(c, 7450, 160)));
    bub('eng', 'tick', c, 7000, 7450);
    const ST: Record<Station, number> = { R: 1700, D: 3100, B: 5000 };
    const on = (k: Station) => (c >= 7300 ? 1 : 0.3 + 0.7 * ease(clamp((c - ST[k]) / 450)));
    op('stR', on('R'));
    op('stD', on('D'));
    op('stB', on('B'));
  }

  /* Camera stops, measured once the drawing is in the page. */
  setOpen(1);
  const bb = hero.getBBox();
  const cb = crews[0]?.getBBox() ?? bb;
  setOpen(0);
  const W0 = { cx: J.heroClosed.cx, cy: J.heroClosed.cy - 140, k: 0.32 };
  const W1 = {
    cx: bb.x + bb.width / 2,
    cy: bb.y + bb.height / 2 - RISE,
    k: Math.min(1024 / (bb.width + 70), 720 / (bb.height + 50)),
  };
  const W2 = phone
    ? {
        cx: cb.x + cb.width / 2,
        cy: cb.y + cb.height / 2 - RISE - 60,
        k: Math.min(1024 / (cb.width + 200), 720 / (cb.height + 170)),
      }
    : {
        cx: bb.x + bb.width / 2,
        cy: bb.y + bb.height / 2 - RISE,
        k: Math.min(1024 / (bb.width + 50), 720 / (bb.height + 36)),
      };

  function loop(c: number) {
    let x = XA;
    let o = 0;
    let tk: XY | null = null;
    let ta = 1;
    LASTO = 0;
    if (c < 900) {
      /* held */
    } else if (c < 1900) {
      const e = ease((c - 900) / 1000);
      x = lerp(XA, XB, e);
      o = e;
    } else if (c < 7400) {
      x = XB;
      o = 1;
    } else if (c < 8600) {
      const e = ease((c - 7400) / 1200);
      x = lerp(XB, XA, e);
      o = 1 - e;
    }
    setSeam(x);
    setOpen(o);
    LASTO = o;
    floor(c);
    if (LIVE) {
      const q = ease(o);
      setCam(lerp(W1.cx, W2.cx, q), lerp(W1.cy, W2.cy, q), lerp(W1.k, W2.k, q));
    }
    op('rowPulse', c > 1700 && c < 2300 ? 0.55 + 0.45 * Math.sin((c - 1700) / 85) : 0);
    const T = (keys: Pt[], a: number, b: number) => {
      tk = along(keys, ease(clamp((c - a) / (b - a))));
      ta = win(c, a - 100, b + 60, 100);
    };
    if (c >= 1950 && c < 2150) {
      tk = onLid('row');
      ta = fade(c, 1950, 150);
    } else if (c >= 2150 && c < 2650) T(['row', 'note'], 2150, 2600);
    else if (c >= 3000 && c < 3750) T(['note', 'c1a', 'c1b', 'opt'], 3100, 3700);
    else if (c >= 4650 && c < 5000) T(['opt', 'slot'], 4700, 4950);
    else if (c >= 5000 && c < 5700) T(['slot', 'c2a', 'c2b', 'built'], 5050, 5600);
    token(tk, ta);
    const mv = (id: string, keys: Pt[], a: number, b: number) =>
      place(id, along(keys, ease(clamp((c - a) / (b - a)))), win(c, a - 100, b + 80, 100));
    if (c >= 4950 && c < 5550) mv('qchip', ['slot', 'c1b', 'c1a', 'note'], 5050, 5450);
    else if (c >= 6050 && c < 6550) mv('qchip', ['built', 'c2b', 'c2a', 'slot'], 6150, 6450);
    else place('qchip', null, 0);
    if (c >= 5550 && c < 6150) mv('achip', ['note', 'c1a', 'c1b', 'slot'], 5650, 6050);
    else if (c >= 6550 && c < 7100) mv('achip', ['slot', 'c2a', 'c2b', 'built'], 6650, 7000);
    else place('achip', null, 0);
    if (c >= 7400 && c < 8800) {
      const e = ease(clamp((c - 7400) / 1200));
      const a = P.built;
      const b = onLid('card');
      const cx = lerp(a[0], b[0], e);
      const cy = lerp(a[1], b[1], e) - Math.sin(Math.PI * e) * 26;
      const k = Math.min(1, lerp(0.28, 1, e));
      fly.setAttribute(
        'transform',
        `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(3)}) translate(${-P.card[0]} ${-P.card[1]})`,
      );
      op('fly', fade(c, 7400, 150) * (1 - fade(c, 8550, 150)));
    } else op('fly', 0);
    op('emptySlot', c < 1900 ? 0 : c >= 8600 ? 1 - fade(c, 8600, 60) : 1);
    op('landFlash', c > 8600 && c < 9350 ? Math.max(0, Math.sin((Math.PI * (c - 8600)) / 750)) : 0);
    op('matched', c >= 8700 ? fade(c, 8700, 220) : 0);
  }

  function render(t: number) {
    if (t < 550) {
      stage.dataset.phase = 'grey';
      setCam(W0.cx, W0.cy, W0.k);
      hero.setAttribute('transform', 'translate(0 0)');
      loop(0);
    } else if (t < 1500) {
      stage.dataset.phase = 'far';
      const p = ease(clamp((t - 550) / 950));
      hero.setAttribute('transform', `translate(0 ${(-RISE * p).toFixed(1)})`);
      loop(t >= 900 ? t : 0);
      const q = ease(LASTO);
      const tx = lerp(W1.cx, W2.cx, q);
      const ty = lerp(W1.cy, W2.cy, q);
      const tk = lerp(W1.k, W2.k, q);
      setCam(lerp(W0.cx, tx, p), lerp(W0.cy, ty, p), lerp(W0.k, tk, p));
    } else {
      stage.dataset.phase = 'far';
      hero.setAttribute('transform', `translate(0 ${-RISE})`);
      LIVE = true;
      loop(t % LOOP);
      LIVE = false;
    }
  }

  /* The finished frame: the app open, the floor mid-build, nothing in flight. */
  function still() {
    stage.dataset.phase = 'far';
    hero.setAttribute('transform', `translate(0 ${-RISE})`);
    setCam(W2.cx, W2.cy, W2.k);
    setSeam(520);
    setOpen(1);
    floor(8000);
    token(null, 0);
    op('fly', 0);
    op('emptySlot', 0);
    place('qchip', null, 0);
    place('achip', null, 0);
  }

  /* The clock. `elapsed` is time on the timeline; it advances only while playing AND in view. */
  let elapsed = 0;
  let last: number | null = null;
  let raf = 0;
  let playing = !startStill;
  let inView = true;
  let fresh = !startStill;

  const frame = (now: number) => {
    if (last !== null) elapsed += now - last;
    last = now;
    render(elapsed);
    raf = requestAnimationFrame(frame);
  };
  const run = () => {
    stage.dataset.paused = 'false';
    if (raf || !playing || !inView) return;
    last = null;
    raf = requestAnimationFrame(frame);
  };
  const halt = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    stage.dataset.paused = 'true';
  };

  if (startStill) {
    still();
    stage.dataset.paused = 'true';
  } else run();

  return {
    play() {
      playing = true;
      /* From the still, play starts the film from its opening rather than mid-loop. */
      if (!fresh) {
        fresh = true;
        elapsed = 0;
      }
      run();
    },
    pause() {
      playing = false;
      halt();
    },
    replay() {
      fresh = true;
      elapsed = 0;
      playing = true;
      halt();
      run();
    },
    suspend() {
      inView = false;
      halt();
    },
    resume() {
      inView = true;
      if (playing) run();
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
