/**
 * The pages whose hero is a silent film (PageHero `media.type === 'clip'`), by route, and the
 * hero arrangement it takes: stacked, so the film sits at the column's full width under the words
 * (owner, 2 Nov 2026: "stacked variant so the video sits in large").
 *
 * Files live in public/clips/<name>-{wide,tall}.{webm,mp4} with a -poster.jpg each, rendered from
 * the owner's HTML piece (Claude Design, "Worked example – storyboard v14c"). The words are part of
 * the picture, so `description` carries them as text.
 */
type ClipFiles = {
  sources: readonly { src: string; type: 'video/webm' | 'video/mp4' }[];
  poster: string;
};

export type HeroClipEntry = {
  wide: ClipFiles;
  tall: ClipFiles;
  title: string;
  description: string;
};

const files = (name: string, cut: 'wide' | 'tall'): ClipFiles => ({
  sources: [
    { src: `/clips/${name}-${cut}.webm`, type: 'video/webm' },
    { src: `/clips/${name}-${cut}.mp4`, type: 'video/mp4' },
  ],
  poster: `/clips/${name}-${cut}-poster.jpg`,
});

export const HERO_CLIPS: Readonly<Record<string, HeroClipEntry>> = {
  '/audits/prototype-readiness-review': {
    wide: files('prototype-readiness', 'wide'),
    tall: files('prototype-readiness', 'tall'),
    title: 'Prototype Readiness Review: an illustrative film',
    description:
      'You built a prototype with Lovable, v0, Bolt or Replit, and it demos beautifully. But is it ' +
      'dev-ready yet? We can help you find out. Our team, a designer and an engineer, audits your ' +
      'prototype and marks what it takes for granted, screen by screen. Then we give you a decision ' +
      'on every screen: preserve it, harden it, replace it or retire it. We are the bridge between ' +
      'your idea and the reality. This example is illustrative; nothing in it is a real client’s product.',
  },
};

/** The route's hero film, if it has one. */
export const heroClip = (route: string): HeroClipEntry | undefined => HERO_CLIPS[route];
