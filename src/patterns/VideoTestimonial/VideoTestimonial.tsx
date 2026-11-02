'use client';

import { type ReactNode, useEffect, useId, useRef, useState } from 'react';

import { Icon, Layout, Media, type MediaImage } from '@/components';
import { cx } from '@/lib/cx';

import styles from './VideoTestimonial.module.css';

/**
 * VideoTestimonial — a client interview on film: the poster, a play control, the line pulled from
 * it and who said it (7 Oct review, r7-video).
 *
 * ── The contract ─────────────────────────────────────────────────────────────────
 *   No autoplay, ever. Before the reader presses play there is no <video> source fetched at all:
 *   the element is in the DOM with `preload="none"`, under the poster, so the page costs one
 *   photograph. Sound starts only because a person pressed a button.
 *   The poster is a photograph from the record (Media, the photograph radius), and NO TYPE is set
 *   on it (owner ruling): the running time and the captions note are in the text beside it.
 *   Pressing play swaps the poster for the native player in the same 16:9 box, starts it inside
 *   the click (a user gesture, so the browser lets it play with sound), and moves focus to the
 *   player, so the next key a keyboard user presses reaches its controls.
 *   Captions are a TRACK SLOT: `captions` renders one <track kind="captions"> per file. A film
 *   with captions says so in its label before it is played.
 *   Reduced motion: the poster's push-in and the disc's swell are dropped, not shortened.
 *
 * ── Semantics ────────────────────────────────────────────────────────────────────
 *   A <figure>: the film is the figure, and its caption is the pulled line (a <blockquote>) and
 *   the speaker. The play control is a <button> whose name says what it plays and for how long.
 *
 * ── One film, alone (owner rule, 9 Oct) ──────────────────────────────────────────
 *   This renders exactly ONE video, and it is the ONLY testimonial in its section. Never two films
 *   in a band, and never a film beside text quotes: the video demands attention and has to fight
 *   for it, so it is never set as one item of a row or a group. A band that needs several voices
 *   uses Proof; a band with a film in it has the film and nothing else that speaks.
 *
 * ── Variants ─────────────────────────────────────────────────────────────────────
 *   All three are single-film layouts; none is a group.
 *   featured   a large poster with the quote beside it from 1024 — [3, 2], 96 between (a split, owner 13 Oct) — and the
 *              quote under it below. The band's one object.
 *   wide       the poster across the full column in a cinematic crop, the caption under it as one
 *              row from 1024 (the quote, the speaker at its foot). For a band where the film itself
 *              is the argument and wants the whole width — and still fits the 830 fold at 1470.
 *              The crop is the POSTER's: pressing play opens the box to the film's own 16:9.
 *   portrait  a vertical film (9:16), shot on a phone or for one. The poster stands at its true
 *              ratio from 768 in a content-sized track — 352 wide from 1024 (626 tall, so the band
 *              is 818 and clears the 830 fold at 1470), 240 at 768 — with the caption in the rest of
 *              the row, 96 between: copy beside an image is a split (CLAUDE.md gap rule 2). The
 *              caption is centred on the poster's height, as featured's is. (Pinning the speaker
 *              to the poster's foot was tried and rejected by eye: at 626 tall it opened a 300
 *              hole between the quote and its speaker.) Below 768 the poster is a 4:5 crop across the column
 *              (408 at 390, not a 580 tower) and pressing play opens the box to the film's 9:16.
 *              The md play disc at every width: the poster is never wider than 352.
 *   All three take the display quote role; featured and wide take the large play disc from 1024.
 *
 * Owns no band and no ground; the caller places it in a Section, and the surface reaches it through
 * data-surface. Imports components only.
 */

export type VideoTestimonialVariant = 'featured' | 'wide' | 'portrait';

/** One encoding of the film. Listed best first; the browser plays the first type it supports. */
export type VideoTestimonialSource = {
  src: string;
  /** The MIME type, e.g. `video/mp4` or `video/webm`. Required so the browser can skip what it cannot play without fetching it. */
  type: string;
};

/** One captions file (WebVTT). The slot is a list so a second language is data, not a prop. */
export type VideoTestimonialCaptions = {
  src: string;
  /** BCP 47 language tag of the captions, e.g. `en`. */
  srclang: string;
  /** What the player's captions menu calls this track, e.g. "English". */
  label: string;
};

export type VideoTestimonialFilm = {
  sources: readonly VideoTestimonialSource[];
  /** The track slot. Empty or absent: no captions, and the label does not claim any. */
  captions?: readonly VideoTestimonialCaptions[];
  /** Running time as published, `m:ss` — "4:52". Read in the label and in the control's name. */
  duration: string;
};

export type VideoTestimonialProps = {
  variant: VideoTestimonialVariant;
  /** The poster: a photograph record, as Media takes it. Its `alt` is ignored — see `film`. */
  poster: MediaImage;
  film: VideoTestimonialFilm;
  /** The line pulled from the interview. Plain text; no quotation marks — the rule says it is speech. */
  quote: string;
  /** The speaker. Required: named attribution is mandatory, as for every quote on the site. */
  name: string;
  /** The speaker's title. Optional; missing, it leaves no separator. */
  role?: string;
  /** The client. */
  company: string;
  /**
   * What the film is called, in the label above the quote — "Client interview" by default. Sentence
   * case as authored; the mono role uppercases it in presentation only.
   */
  label?: string;
  /**
   * The rendered width of the poster, as a `sizes` list. The variant has a default for its usual
   * placement; pass one when the caller's track is a different width.
   */
  sizes?: string;
};

/* The poster widths at 1470, from Section's 1240 column (src/lib/image-sizes.ts arithmetic):
   featured is the 3 of [3, 2] with a 96 seam, (1240 - 96) * 3/5 ≈ 687; wide is the whole column,
   1240 once the viewport clears 1240 + two 32 gutters. Below that each is the full column, the
   viewport less two 32 gutters. portrait is its own token width from 768 (--vt-portrait-width-*),
   so its list states those, and the full column below. */
const SIZES: Record<VideoTestimonialVariant, string> = {
  featured: '(min-width: 1024px) 687px, calc(100vw - 64px)',
  wide: '(min-width: 1304px) 1240px, calc(100vw - 64px)',
  portrait: '(min-width: 1024px) 352px, (min-width: 768px) 240px, calc(100vw - 64px)',
};

/** "4:52" → "4 minutes 52 seconds", so the control's name is not read as a clock time. */
function spokenDuration(duration: string): string {
  const [m = Number.NaN, s = Number.NaN] = duration
    .split(':')
    .map((n) => Number.parseInt(n, 10));
  if (!Number.isFinite(m) || !Number.isFinite(s)) return duration;
  const parts: string[] = [];
  if (m > 0) parts.push(`${m} minute${m === 1 ? '' : 's'}`);
  if (s > 0) parts.push(`${s} second${s === 1 ? '' : 's'}`);
  return parts.join(' ') || duration;
}

export function VideoTestimonial({
  variant,
  poster,
  film,
  quote,
  name,
  role,
  company,
  label = 'Client interview',
  sizes,
}: VideoTestimonialProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const quoteId = useId();
  const captioned = (film.captions?.length ?? 0) > 0;
  const featured = variant === 'featured';
  const portrait = variant === 'portrait';

  function play() {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(true);
    /* Inside the click: a user gesture, so playback with sound is allowed. If the browser still
       refuses (a policy, a missing codec), the native controls are showing and the reader can
       press play there. */
    void video.play().catch(() => undefined);
  }

  /* Focus follows the film. The poster button is gone once playing, so without this the focus
     would fall to <body>; on the player instead, Space and the arrow keys reach its controls. */
  useEffect(() => {
    if (playing) videoRef.current?.focus();
  }, [playing]);

  const meta = [label, film.duration, captioned ? 'Captions' : undefined].filter(Boolean);
  const attribution = [role, company].filter(Boolean).join(', ');

  const screen = (
    <div className={cx(styles.screen, playing && styles.playing)}>
      <video
        ref={videoRef}
        className={styles.video}
        controls={playing}
        preload="none"
        playsInline
        tabIndex={playing ? 0 : -1}
        aria-hidden={playing ? undefined : true}
        aria-label={`${label}: ${name}, ${company}`}
      >
        {film.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
        {film.captions?.map((track, i) => (
          <track
            key={track.src}
            kind="captions"
            src={track.src}
            srcLang={track.srclang}
            label={track.label}
            default={i === 0}
          />
        ))}
      </video>
      {playing ? null : (
        <button
          type="button"
          className={styles.poster}
          onClick={play}
          aria-label={`Play ${label}: ${name}, ${spokenDuration(film.duration)}${captioned ? ', captioned' : ''}`}
          aria-describedby={quoteId}
        >
          <span className={styles.frame}>
            <span className={styles.zoom}>
              <Media
                image={{ ...poster, alt: '' }}
                sizes={sizes ?? SIZES[variant]}
                fit="fill"
                edge="placement"
              />
            </span>
          </span>
          <span className={styles.play} aria-hidden>
            <Icon name="play" />
          </span>
        </button>
      )}
    </div>
  );

  const label_ = <p className={styles.meta}>{meta.join(' · ')}</p>;
  const pulled = (
    <blockquote id={quoteId} className={styles.quote}>
      <p>{quote}</p>
    </blockquote>
  );
  const speaker = (
    <p className={styles.attribution}>
      <span className={styles.name}>{name}</span>
      {attribution ? <span className={styles.role}>{attribution}</span> : null}
    </p>
  );

  /* wide sets the caption as one row from 1024 — the quote with its label, the speaker in the
     narrow track at the quote's foot — so the band spends its height on the film, not on a stack.
     featured and portrait stack the label and quote, then the speaker, centred beside the poster. */
  let caption: ReactNode;
  if (variant === 'wide') {
    caption = (
      <Layout
        as="figcaption"
        columns={{ base: 1, lg: [3, 1] }}
        colGap="column"
        rowGap="stack"
        className={styles.caption}
      >
        {pulled}
        <Layout rowGap="block">
          {label_}
          {speaker}
        </Layout>
      </Layout>
    );
  } else {
    caption = (
      <Layout as="figcaption" rowGap="stack" className={styles.caption}>
        <Layout rowGap="block">
          {label_}
          {pulled}
        </Layout>
        {speaker}
      </Layout>
    );
  }

  /* The figure's row. featured: [3, 2] from 1024, centred; a split, so the section step. portrait: the poster's own width (an
     `auto` track sized by the screen's token width) beside the caption from 768, centred; a split,
     so the section step. wide: a single track. */
  const columns = featured
    ? { base: 1, lg: [3, 2] }
    : portrait
      ? { base: 1, md: ['auto' as const, 1] }
      : undefined;

  return (
    <Layout
      as="figure"
      columns={columns}
      colGap="section"
      rowGap={variant === 'wide' ? 'block' : 'stack'}
      align={variant === 'wide' ? undefined : 'center'}
      className={cx(
        styles.root,
        variant === 'wide' && styles.wide,
        portrait && styles.portrait,
      )}
    >
      {screen}
      {caption}
    </Layout>
  );
}
