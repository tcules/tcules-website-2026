import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCaseRefs, getCorpusPage } from '@/content';
import { caseRoutesIn } from '@/lib/corpus-cases';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { LongformPage, type LongformFamily } from '@/templates';
import type { CorpusPage } from '@/lib/corpus-types';

/**
 * The shared article and glossary renderer. Live glossary routes supply a published CMS document;
 * the local allowlist remains available to design specimens and other corpus routes. Only pages whose
 * band shapes the page-mapping has verified switch to the corpus; the rest keep their current source
 * until their own batch maps them (page-mapping § 1.2). Adding a page to the list is the whole act of
 * switching it, and its image slots must have register rows first (src/lib/placeholders.ts).
 */
export const PASS_1_LONGFORM_ROUTES: ReadonlySet<string> = new Set([
  '/insights/cpq-ux-design',
  '/glossary/design-system',
  '/glossary/agentic-ux',
  '/glossary/ai-assisted-product-development',
  '/glossary/ai-native-product-design',
  '/glossary/ai-product-ux',
  '/glossary/coded-prototype',
  '/glossary/design-engineering',
  '/glossary/design-intent',
  '/glossary/design-system-adoption',
  '/glossary/design-system-drift',
  '/glossary/design-system-governance',
  '/glossary/design-to-code',
  '/glossary/human-in-the-loop',
  '/glossary/information-architecture',
  '/glossary/product-modernisation',
  '/glossary/prototype-hardening',
  '/glossary/user-journey-mapping',
  '/glossary/ux-debt',
  '/glossary/workflow-design',
  /* The legal pages need no design (owner, 31 Oct 2026): one document in the article shell. */
  '/privacy-policy',
  '/terms-of-use',
  '/cookie-policy',
]);

export const isCorpusLongform = (route: string): boolean => PASS_1_LONGFORM_ROUTES.has(route);

const FAMILIES: Readonly<Record<string, LongformFamily>> = {
  '/insights': 'article',
  '/glossary': 'term',
  '/privacy-policy': 'article',
  '/terms-of-use': 'article',
  '/cookie-policy': 'article',
};

/** The route's `generateStaticParams` entries for one family: the path segments after the family. */
export function longformSlugs(family: '/insights' | '/glossary'): string[] {
  return [...PASS_1_LONGFORM_ROUTES]
    .filter((route) => route.startsWith(`${family}/`))
    .map((route) => route.slice(family.length + 1));
}

export async function longformMetadata(route: string): Promise<Metadata | null> {
  if (!isCorpusLongform(route)) return null;
  const page = await getCorpusPage(route);
  return page ? corpusMetadata(page) : null;
}

export async function LongformRoute({
  route,
  page: suppliedPage,
}: {
  route: string;
  page?: CorpusPage;
}) {
  const page = suppliedPage ?? (await getCorpusPage(route));
  const family = FAMILIES[`/${route.split('/')[1]}`];
  if (!page || !family) notFound();
  const caseRefs = await getCaseRefs(caseRoutesIn(page));
  return <LongformPage page={page} family={family} caseRefs={caseRefs} />;
}
