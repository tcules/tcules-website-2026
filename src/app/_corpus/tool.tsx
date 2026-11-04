import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCorpusPage } from '@/content';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { LongformPage } from '@/templates';

/**
 * The corpus-backed tool routes (`/tools/*`). Only the pages whose band shapes the page-mapping has
 * verified switch to the corpus; the other tools keep their current source until their own batch
 * maps them (page-mapping § 1.2). Adding a page to the list is the whole act of switching it.
 */
export const PASS_1_TOOL_ROUTES: ReadonlySet<string> = new Set([
  '/tools/design-system-drift-checker',
  '/tools/ai-product-ux-readiness-check',
  '/tools/ai-trust-control-canvas',
  '/tools/audit-redesign-modernise-rebuild',
  '/tools/figma-storybook-fidelity-checklist',
  '/tools/prototype-readiness-checklist',
]);

export const isCorpusTool = (route: string): boolean => PASS_1_TOOL_ROUTES.has(route);

export const toolSlugs = (): string[] =>
  [...PASS_1_TOOL_ROUTES].map((route) => route.slice('/tools/'.length));

export async function toolMetadata(route: string): Promise<Metadata | null> {
  if (!isCorpusTool(route)) return null;
  const page = await getCorpusPage(route);
  return page ? corpusMetadata(page) : null;
}

/**
 * A tool renders as an article-style page (the tools shape-off, 4 Nov 2026, after the 28 Oct launch
 * plan: "tools launch as article-style pages"): LongformPage `family="tool"`, the worksheet in one
 * shell beside its outline. A tool cites no case, so it takes no case refs.
 */
export async function ToolRoute({ route }: { route: string }) {
  const page = await getCorpusPage(route);
  if (!page) notFound();
  return <LongformPage page={page} family="tool" caseRefs={{}} />;
}
