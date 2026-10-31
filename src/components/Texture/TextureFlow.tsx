'use client';

import { useEffect, useRef } from 'react';

import { cx } from '@/lib/cx';
import grid from '@/styles/textures/pixel-grid.json';

import styles from './Texture.module.css';

export type TextureFlowProps = {
  /**
   * `start` quiets the field toward the inline start, so a drawing placed there sits on calm ground
   * (owner, 23 Oct 2026). Absent, the field runs the whole box.
   */
  fade?: 'start';
  /**
   * `resolve` (default): loose loops at the start, easing into parallel streams toward the end (the
   * enquiry close). `turbulent`: the start's loose churn runs the whole box and never settles, for a
   * ground with no direction to resolve toward (owner, 31 Oct 2026, About's Lab card).
   */
  flow?: 'resolve' | 'turbulent';
  /**
   * Fade the field out toward the box's edge as a rounded rectangle (--tex-flow-feather wide, its
   * levels rounded at --tex-flow-feather-radius), rather than stopping at the edge: for a paper island
   * on paper, where the field alone draws the island (owner, 31 Oct 2026).
   */
  feather?: boolean;
  /**
   * Reach past the box's top and bottom into the neighbouring bands' air (--tex-flow-bleed), for a
   * field on an open band (Section `density="open"`, which raises the band so it shows).
   */
  bleed?: boolean;
};

/* The grid's rows as GLSL: the same cells Texture draws (pixel-grid.json), so the moving field and
   every static placement are one texture. Each cell is a 3-wide column of five 1px rows — an "=". */
const ROW_ALPHA = grid.cells
  .slice()
  .sort((a, b) => a.y - b.y)
  .map((c, i, all) => (i < all.length - 1 ? `r < ${c.y + 0.5} ? ${c.alpha} : ` : `${c.alpha}`))
  .join('');
/* every row shares one column: its width, read from the first cell (3 in the shipped grid) */
const COL_WIDTH = grid.cells[0]?.width ?? 3;

/* The field (locked by the owner, 23 Oct 2026; the Confluence mock). Every cell points along one
   flow: loose contour loops toward the start, eased by a smootherstep into parallel streams 56 apart
   toward the end. The gathering is a lens with a long focal length — its focus sits 900 past the
   box — so there is no point where everything meets and no seam where the two fields join. The
   streamlines carry the grid's full strength and the water between them half; behind the words
   (`data-texture-calm`) the water is still and quieter, feathered wide so it has no edge. */
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform vec4 uCalm;
uniform float uFade; uniform float uSettle; uniform vec2 uFeather; uniform vec4 uFocus; uniform float uFaint; uniform vec3 uInk;
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0); m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float rowAlpha(float r){ return ${ROW_ALPHA}; }
float box(vec4 r, vec2 p, float f){
  vec2 d = max(vec2(r.x - p.x, r.y - p.y), vec2(p.x - r.z, p.y - r.w));
  return 1.0 - smoothstep(0.0, f, max(d.x, d.y));
}
void main(){
  float P = ${grid.pitch.toFixed(1)};
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 W = uRes / uDpr;
  vec2 c = floor(px / P) * P + P * 0.5;            // the field is read once per cell
  float calm = uCalm.z > uCalm.x ? box(uCalm, c, 160.0) : 0.0;
  float lx = clamp((c.x - 0.12 * W.x) / (0.5 * W.x), 0.0, 1.0);
  float settle = uSettle * lx * lx * lx * (lx * (lx * 6.0 - 15.0) + 10.0);
  // Resolving, the water behind the words is still; turbulent (uSettle 0), it keeps churning and is
  // only quieter there, so a formless island reads turbulent across (owner, 31 Oct 2026).
  float loose = (1.0 - settle) * (1.0 - calm * uSettle);

  vec2 T = vec2(W.x + 900.0, W.y * 0.5);
  vec2 d = T - c;
  float K = (0.5 * W.x + 900.0) / 56.0;
  float n1 = snoise(c / 240.0 + vec2(0.0, uTime * 0.035));
  float n2 = snoise(c / 105.0 + vec2(uTime * 0.02, 3.7));
  float ang = mix(atan(d.y, d.x), 0.0, settle) + loose * (1.5 * n1 + 0.55 * n2);
  float psi = mix(atan(d.y, d.x) * K, (T.y - c.y) / 56.0, settle) + loose * 2.0 * n1;

  float line = 1.0 - smoothstep(0.0, 0.32, abs(fract(psi) - 0.5) * 2.0);
  float tone = mix(0.5, 1.0, line) * mix(1.0, 0.6, calm);
  tone *= mix(1.0, smoothstep(0.18 * W.x, 0.62 * W.x, c.x), uFade);

  vec2 l = px - c; float cs = cos(ang), sn = sin(ang);
  vec2 lp = vec2(cs * l.x + sn * l.y, -sn * l.x + cs * l.y);
  float aa = 0.5 / uDpr;
  float hw = ${(COL_WIDTH / 2).toFixed(1)};   // half the column's width ("half" is reserved in GLSL ES)
  float cx = clamp((hw - abs(lp.x)) / (2.0 * aa) + 0.5, 0.0, 1.0);
  float cy = clamp((P * 0.5 - abs(lp.y)) / (2.0 * aa) + 0.5, 0.0, 1.0);
  float a = cx * cy * rowAlpha(floor(lp.y + P * 0.5)) * tone;
  if (uFeather.x > 0.0) {
    // A rounded-rectangle fade: full strength inside the box inset by the feather, gone at the box's
    // edge, every level of the fade a rounded rectangle (radius uFeather.y) so no corner is drawn.
    vec2 hb = W * 0.5;
    vec2 q = abs(px - hb) - (hb - vec2(uFeather.x + uFeather.y));
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uFeather.y;
    a *= 1.0 - smoothstep(0.0, uFeather.x, d);
  }
  if (uFocus.z > uFocus.x) {
    // Full strength around the words (\`data-texture-focus\`), faint (uFaint) everywhere else, the step
    // between them feathered wide so the focus has no edge.
    a *= mix(uFaint, 1.0, box(uFocus, c, 160.0));
  }
  gl_FragColor = vec4(uInk * a, a);
}`;
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

/* The churn is slow (a loop reshapes over tens of seconds), so 30 frames a second is plenty. */
const FRAME_MS = 1000 / 30;

/**
 * TextureFlow — the pixel grid as a FIELD IN MOTION (owner, 23 Oct 2026; the enquiry close). The
 * grid's cells keep their shape, size and strength; each "=" turns to follow one designed flow, and
 * only the loose water at the start churns. Where the streams run straight every cell sits at 0°,
 * which is the grid exactly as every static Texture draws it.
 *
 * Fills its nearest positioned ancestor, as Texture does, between the ground and the content. The
 * words it must stay quiet behind are any descendant of that ancestor marked `data-texture-calm`
 * (the first one), so the caller composes and this never reaches for a pattern. A descendant marked
 * `data-texture-focus` is the reverse: the field is at full strength around it and faint
 * (--tex-flow-faint) everywhere else (owner, 31 Oct 2026, About's studio links).
 *
 * Decorative: hidden from assistive tech, no pointer events. Motion only while on screen and the
 * tab is visible; under prefers-reduced-motion it is drawn once and holds. Without WebGL it draws
 * nothing and the ground stands plain.
 */
export function TextureFlow({
  fade,
  flow = 'resolve',
  feather = false,
  bleed = false,
}: TextureFlowProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const fadeOn = fade === 'start' ? 1 : 0;
  const settleOn = flow === 'turbulent' ? 0 : 1;
  const featherOn = feather;

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      antialias: false,
      alpha: true,
    });
    if (!gl) return;
    /* A lost context (a GPU reset, or the browser's cap on live contexts when a page carries many
       fields, as the CtaSection specimen does) leaves the canvas painting the browser's own
       placeholder over the island. The field is decoration: it steps aside and the ground stands
       plain, as it does without WebGL. */
    const lost = () => canvas.setAttribute('data-lost', '');
    canvas.addEventListener('webglcontextlost', lost);

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = shader(gl.VERTEX_SHADER, VERT),
      fs = shader(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u('uRes'),
      dpr: u('uDpr'),
      time: u('uTime'),
      calm: u('uCalm'),
      fade: u('uFade'),
      settle: u('uSettle'),
      feather: u('uFeather'),
      focus: u('uFocus'),
      faint: u('uFaint'),
      ink: u('uInk'),
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    /* Start mid-flow, so the first frame is already a composed field. */
    const T0 = 12;
    let held = T0,
      start = performance.now(),
      raf = 0,
      last = 0,
      visible = true;

    const measure = () => {
      /* The canvas's own box: the host's, or taller where the field bleeds past it. */
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.dpr, dpr);
      gl.uniform1f(U.fade, fadeOn);
      gl.uniform1f(U.settle, settleOn);
      /* The feather's width and corner radius, from the surface's tokens (--tex-flow-feather*). */
      const cs = getComputedStyle(canvas);
      gl.uniform2f(
        U.feather,
        featherOn ? parseFloat(cs.getPropertyValue('--tex-flow-feather')) || 0 : 0,
        featherOn ? parseFloat(cs.getPropertyValue('--tex-flow-feather-radius')) || 0 : 0,
      );
      const focusEl = host.querySelector('[data-texture-focus]');
      const f = focusEl?.getBoundingClientRect();
      gl.uniform4f(
        U.focus,
        ...(f
          ? ([
              f.left - box.left,
              f.top - box.top,
              f.right - box.left,
              f.bottom - box.top,
            ] as const)
          : ([0, 0, 0, 0] as const)),
      );
      gl.uniform1f(
        U.faint,
        parseFloat(getComputedStyle(canvas).getPropertyValue('--tex-flow-faint')) || 0.3,
      );
      const calmEl = host.querySelector('[data-texture-calm]');
      const r = calmEl?.getBoundingClientRect();
      gl.uniform4f(
        U.calm,
        ...(r
          ? ([
              r.left - box.left,
              r.top - box.top,
              r.right - box.left,
              r.bottom - box.top,
            ] as const)
          : ([0, 0, 0, 0] as const)),
      );
      /* --tex-ink, per surface: read from the canvas's own colour, which the class sets. */
      const [r0 = 255, g0 = 255, b0 = 255] =
        getComputedStyle(canvas)
          .color.match(/[\d.]+/g)
          ?.map(Number) ?? [];
      gl.uniform3f(U.ink, r0 / 255, g0 / 255, b0 / 255);
    };
    const draw = (sec: number) => {
      gl.uniform1f(U.time, sec);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const tick = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        draw(T0 + (now - start) / 1000);
      }
      raf = requestAnimationFrame(tick);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (!reduce.matches && visible && !document.hidden) {
        start = performance.now() - (held - T0) * 1000;
        raf = requestAnimationFrame(tick);
      } else {
        held = reduce.matches ? T0 : T0 + (performance.now() - start) / 1000;
        draw(held);
      }
    };

    measure();
    run();
    const resize = new ResizeObserver(() => {
      measure();
      run();
    });
    resize.observe(host);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      run();
    });
    seen.observe(host);
    document.addEventListener('visibilitychange', run);
    reduce.addEventListener('change', run);
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      document.removeEventListener('visibilitychange', run);
      reduce.removeEventListener('change', run);
    };
  }, [fadeOn, settleOn, featherOn]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cx(styles.texture, styles.flow, bleed && styles.flowBleed)}
    />
  );
}
