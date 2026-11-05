/**
 * The Arena's timeline, ported from the owner's "Tcules Hero Arena" artifact (2 Nov 2026,
 * https://claude.ai/artifact/Y1uVUykZLj9Bdi1XNhFRYQ). Every number below is the drawing's: the
 * coordinates are in the SVG's own user space (viewBox 1024 × 720), and the times are milliseconds
 * into the 11.8-second loop. v11 (4 Nov 2026, https://claude.ai/artifact/ENhFK86hDXngbWxzgTVof9):
 * the lid lifts with a little give, the stations rise into place, the work arcs between them, and
 * the finished task pops out, resolves and catches the light. They are not layout values and do not belong in the token layer.
 * The drawing, its geometry, the camera and the opening are the v11 artifact's as published, taken
 * whole (owner, 5 Nov 2026: "just use the new one and replace the old one"): a warm field, one
 * slow move in onto the closed app, a beat, then the loop, with the camera opening out to the app
 * edge to edge.
 *
 * Scoped to one SVG: every element is looked up inside it by its `arena-` prefixed id, never on the
 * document, so the drawing cannot reach anything else on the page.
 *
 * Phases are written to the stage as `data-phase` ('grey' while the field is held, 'far' once the
 * app has risen); the stylesheet does the rest (the field receding, the glow).
 */

type XY = [number, number];
type Pt = 'row' | 'note' | 'c1a' | 'c1b' | 'opt' | 'slot' | 'c2a' | 'c2b' | 'built' | 'card';
type Head = 'client' | 'res' | 'des' | 'eng';
type Station = 'R' | 'D' | 'B';
type Shim = 'shR' | 'shD' | 'shB';

/* The drawing's geometry, measured when it was drawn. */
const J = {
  off: 222.3,
  posts: [
    [320.0, 134.4, -87.9],
    [658.0, 303.4, 81.1],
    [106.8, 241.0, 18.7],
  ] as const,
  pts: {
    row: [239.68, -5.42],
    note: [222.76, 210.06],
    c1a: [240.7, 270.25],
    c1b: [309.6, 264.4],
    opt: [354.45, 263.69],
    slot: [407.75, 243.28],
    c2a: [440.9, 287.15],
    c2b: [512.4, 281.3],
    built: [613.8, 263.62],
    card: [388.07, 84.06],
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
const LOOP = 11800;

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
/* Overshoots past 1 and settles back: the lid's give, the pop. */
const backOut = (p: number) => {
  const c1 = 1.3;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};
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
          h += `<line x1="${p[0]}" y1="${y1}" x2="${p[0]}" y2="${y2}" stroke="#D3CEC2" stroke-width="1"/>`;
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
    tok.setAttribute(
      'transform',
      `translate(${xy[0].toFixed(1)} ${xy[1].toFixed(1)}) scale(1)`,
    );
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
  /* A speech bubble pops in (a small overshoot in scale) rather than fading. */
  const bub = (who: Head, kind: string, c: number, a: number, b: number) => {
    const h = J.heads[who];
    const e = $(`b-${who}-${kind}`);
    if (!e) return;
    const w = win(c, a, b);
    if (w <= 0) return e.setAttribute('opacity', '0');
    const p = clamp((c - a) / 260);
    const k = 0.6 + 0.4 * backOut(p);
    e.setAttribute(
      'transform',
      `translate(${h[0] + (who === 'des' ? -38 : 16)} ${(h[1] + 4 - 6 * ease(p)).toFixed(1)}) scale(${k.toFixed(3)})`,
    );
    e.setAttribute('opacity', w.toFixed(2));
  };
  const agentH = (id: string, key: Station, c: number, a: number, b: number, h: number) => {
    const L = J.ag[key];
    if (c < a - 150 || c > h) return place(id, null, 0);
    /* The agent hovers: lifted 5 and bobbing as it works. */
    const q = pathAt(L, ease(clamp((c - a) / (b - a - 150))));
    place(id, [q[0], q[1] - 5 + Math.sin(c / 230) * 2.2], win(c, a - 150, h));
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
    /* Each station rises 9 into place as it switches on. */
    (['R', 'D', 'B'] as const).forEach((k) => {
      const e = ease(clamp((c - ST[k]) / 650));
      $(`st${k}`)?.setAttribute(
        'transform',
        `translate(0 ${(c >= 7300 ? 0 : 9 * (1 - e)).toFixed(1)})`,
      );
    });
  }

  const NS = 'http://www.w3.org/2000/svg';
  const heroc = need('heroc');
  /* A spark: a four-point star, a blue dot or a lime dot, in turn. */
  const spark = (i: number) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('opacity', '0');
    g.innerHTML =
      i % 3 === 0
        ? '<path d="M0 -7 C1 -1.5 1.5 -1 7 0 C1.5 1 1 1.5 0 7 C-1 1.5 -1.5 1 -7 0 C-1.5 -1 -1 -1.5 0 -7 Z" fill="#E2F26A" stroke="#0048FF" stroke-width="1.2"/>'
        : i % 3 === 1
          ? '<circle r="3" fill="#0048FF"/>'
          : '<circle r="2.4" fill="#E2F26A" stroke="#A1B71F" stroke-width="1"/>';
    heroc.appendChild(g);
    return g;
  };

  /* A ring spreads under each hand-off as the work lands at the next station. */
  const RIP = (
    [
      [2600, 'note'],
      [3700, 'opt'],
      [4950, 'slot'],
      [5600, 'built'],
    ] as const
  ).map(([t, k]) => {
    const e = document.createElementNS(NS, 'ellipse');
    e.setAttribute('fill', 'none');
    e.setAttribute('stroke', '#A1B71F');
    e.setAttribute('stroke-width', '1.8');
    e.setAttribute('opacity', '0');
    heroc.appendChild(e);
    return { t, k, e };
  });
  function ripples(c: number) {
    RIP.forEach((r) => {
      if (!r.e) return;
      const p = (c - r.t) / 650;
      if (p < 0 || p > 1) return r.e.setAttribute('opacity', '0');
      const q = P[r.k];
      const R = 6 + 26 * ease(p);
      r.e.setAttribute('cx', String(q[0]));
      r.e.setAttribute('cy', String(q[1]));
      r.e.setAttribute('rx', R.toFixed(1));
      r.e.setAttribute('ry', (R * 0.55).toFixed(1));
      r.e.setAttribute('opacity', (0.8 * (1 - p)).toFixed(2));
    });
  }

  /* Nine sparks burst from the finished card as it resolves. */
  const SPK = Array.from({ length: 9 }, (_, i) => ({
    g: spark(i),
    a: -Math.PI / 2 + (i - 4) * 0.36 + (i % 2 ? 0.12 : -0.08),
    d: 46 + (i % 4) * 14,
  }));
  function sparks(c: number, t0: number) {
    const p = (c - t0) / 900;
    const b = onLid('card');
    SPK.forEach((s) => {
      if (!s.g) return;
      if (p < 0 || p > 1) return s.g.setAttribute('opacity', '0');
      const e = 1 - Math.pow(1 - p, 3);
      const r = 8 + s.d * e;
      s.g.setAttribute(
        'transform',
        `translate(${(b[0] + Math.cos(s.a) * r * 1.25).toFixed(1)} ${(b[1] - 14 + Math.sin(s.a) * r).toFixed(1)}) rotate(${(p * 90).toFixed(0)}) scale(${(0.6 + 0.7 * Math.sin(Math.PI * Math.min(1, p * 1.3))).toFixed(2)})`,
      );
      s.g.setAttribute('opacity', (1 - Math.pow(p, 2)).toFixed(2));
    });
  }

  /* Camera stops, measured once the drawing is in the page. */
  setOpen(1);
  const bb = hero.getBBox();
  const cb = crews[0]?.getBBox() ?? bb;
  setOpen(0);
  const W0 = { cx: J.heroClosed.cx, cy: J.heroClosed.cy - 140, k: 0.32 };
  /* Close on the closed app: where the opening move lands, and where each loop returns. */
  const Wc = {
    cx: J.heroClosed.cx + 4,
    cy: J.heroClosed.cy - RISE - 26,
    k: phone ? 0.95 : Math.min((1024 * 0.74) / 577, (720 * 0.62) / 300),
  };
  /* The phone cut holds on the studio floor. The box is square, so the slice shows 720 of the
     drawing's 1024 units across: the zoom fits the crews into THAT width (owner, 5 Nov 2026: fitted
     to 1024, the end crew ran off the column and the floor read off-centre). */
  const W2 = phone
    ? {
        cx: cb.x + cb.width / 2,
        cy: cb.y + cb.height / 2 - RISE - 60,
        k: Math.min(720 / (cb.width + 120), 720 / (cb.height + 170)),
      }
    : {
        cx: bb.x + bb.width / 2 + 6,
        cy: bb.y + bb.height / 2 - RISE - 8,
        k: Math.min(1024 / (bb.width - 10), 720 / (bb.height - 5)),
      };

  function loop(c: number) {
    let x = XA;
    let o = 0;
    let tk: XY | null = null;
    let ta = 1;
    if (c < 900) {
      /* held */
    } else if (c < 1900) {
      /* The lid lifts a little past open and settles back (backOut): its give. */
      const p = (c - 900) / 1000;
      const e = ease(p);
      x = lerp(XA, XB, e);
      o = backOut(ease(Math.min(1, p * 1.05)));
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
    floor(c);
    if (LIVE) {
      const q = Math.min(1, o);
      setCam(lerp(Wc.cx, W2.cx, q), lerp(Wc.cy, W2.cy, q), lerp(Wc.k, W2.k, q));
    }
    op('rowPulse', c > 1700 && c < 2300 ? 0.55 + 0.45 * Math.sin((c - 1700) / 85) : 0);
    /* The work arcs between stations: lifted 14 at the middle of each hop. */
    const T = (keys: Pt[], a: number, b: number) => {
      const p = ease(clamp((c - a) / (b - a)));
      const xy = along(keys, p);
      tk = [xy[0], xy[1] - Math.sin(Math.PI * p) * 14];
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
    if (c >= 7400 && c < 8600) {
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
      op('fly', fade(c, 7400, 150));
      op('flyTick', 0);
      op('flyDone', 0);
      op('popShadow', 0);
    } else if (c >= 8600 && c < 10150) {
      /* Landed, the card pops out of its slot (lifted 18, scaled 7%, a shadow under it), its tick
         draws on and its Done button appears; then it settles back. */
      const b = onLid('card');
      const l1 = clamp((c - 8650) / 420);
      const l2 = clamp((c - 9650) / 480);
      const lift = (l1 < 1 ? backOut(l1) : 1) * (1 - ease(l2));
      fly.setAttribute(
        'transform',
        `translate(${b[0].toFixed(1)} ${(b[1] - lift * 18).toFixed(1)}) scale(${(1 + 0.07 * lift).toFixed(3)}) translate(${-P.card[0]} ${-P.card[1]})`,
      );
      op('fly', c < 10050 ? 1 : 1 - fade(c, 10050, 100));
      op('popShadow', Math.max(0, lift) * 0.32);
      op('flyTick', fade(c, 8900, 140));
      $('flyTickP')?.setAttribute(
        'stroke-dashoffset',
        (30 * (1 - ease(clamp((c - 8930) / 320)))).toFixed(1),
      );
      op('flyDone', fade(c, 9150, 180));
    } else {
      op('fly', 0);
      op('popShadow', 0);
    }
    sparks(c, 9150);
    /* Then a band of light sweeps across the app: it catches the light. */
    {
      const p = clamp((c - 9250) / 950);
      $('sweepLight')?.setAttribute('x', (-320 + 1500 * ease(p)).toFixed(0));
      op('sweepLight', p > 0 && p < 1 ? 1 : 0);
    }
    op('emptySlot', c < 1900 ? 0 : c >= 8600 ? 1 - fade(c, 8600, 60) : 1);
    op('landFlash', 0);
    op('matched', c >= 10050 ? 1 : 0);
    op('doneBtn', c >= 10050 ? 1 : 0);
    ripples(c);
  }

  function render(t: number) {
    const rise = (y: number) => hero.setAttribute('transform', `translate(0 ${y.toFixed(1)})`);
    if (t < 700) {
      /* A vast, still field; ours already shows the finished screen. */
      stage.dataset.phase = 'grey';
      setCam(W0.cx, W0.cy, W0.k);
      rise(0);
      loop(0);
    } else if (t < 2600) {
      /* One smooth move in to our product. */
      stage.dataset.phase = 'far';
      const p = ease(clamp((t - 700) / 1900));
      rise(-RISE * p);
      setCam(lerp(W0.cx, Wc.cx, p), lerp(W0.cy, Wc.cy, p), lerp(W0.k, Wc.k, p));
      loop(0);
    } else if (t < 3100) {
      /* A moment to see it whole, then the lid opens. */
      stage.dataset.phase = 'far';
      rise(-RISE);
      setCam(Wc.cx, Wc.cy, Wc.k);
      loop(0);
    } else {
      stage.dataset.phase = 'far';
      rise(-RISE);
      LIVE = true;
      loop((t - 3100 + 900) % LOOP);
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
