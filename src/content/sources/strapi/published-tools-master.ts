import { cache } from 'react';

import { ROUTES, toolPath } from '@/lib/routes';
import type {
  ToolDirectoryGroup,
  ToolDirectorySection,
  ToolDirectoryTool,
  ToolsMasterPage,
  ToolsMasterSection,
} from '@/templates/CorpusPage/published-tools-master-model';

import { illustration, mapHero, rows, text } from './home';
import type { CmsHero, CmsIllustration, Entries } from './home-types';
import {
  flowBlocks,
  mapSharedSection,
  type CmsFlow,
  type CmsSharedSection,
} from './published-service';
import { PUBLISHED_TOOLS_MASTER_QUERY } from './published-tools-master-query';
import { publicGraphql } from './public-graphql';

type Text = string | null | undefined;

type CmsTool = {
  documentId: string;
  name: Text;
  slug: Text;
  routePath: Text;
  hero: { title: Text; illustration: CmsIllustration | null } | null;
  listing: {
    description: Text;
    ctaText: Text;
    facts: Entries<{ label: Text; body: Text }>;
  } | null;
};

type CmsToolDirectory = {
  __typename: 'ComponentListingToolDirectory';
  id: string;
  heading: Text;
  directoryAnchorId: Text;
  directoryDescription: Text;
  groups: Entries<{
    id: string;
    groupHeading: Text;
    groupAnchorId: Text;
    tools: Entries<{ id: string; tool: CmsTool | null }>;
    after: Entries<CmsFlow>;
  }>;
  after: Entries<CmsFlow>;
};

type CmsToolsMasterSection =
  | CmsToolDirectory
  | Extract<
      CmsSharedSection,
      { __typename: 'ComponentSharedEditorialSection' | 'ComponentSharedFaqSection' }
    >;

type CmsToolsMaster = {
  documentId: string;
  routePath: string;
  hero: CmsHero | null;
  content: Entries<CmsToolsMasterSection>;
};

function warn(message: string) {
  console.warn(`New CMS ${ROUTES.tools}: ${message}`);
}

/* ── Prose saved as HTML ─────────────────────────────────────────────────────── */

const ENTITIES: Readonly<Record<string, string>> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (whole, name: string) => {
    if (name.startsWith('#x') || name.startsWith('#X'))
      return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
    if (name.startsWith('#')) return String.fromCodePoint(Number.parseInt(name.slice(1), 10));
    return ENTITIES[name.toLowerCase()] ?? whole;
  });
}

/**
 * A flow block's prose is Markdown on every other owner; the Tool Master's was saved as HTML
 * (`<p>…<a href="/audits">audits</a>…</p>`, 5 Nov 2026). Paragraphs, links and emphasis are read as
 * the Markdown they stand for, so the words render rather than their tags; any other tag is dropped
 * with a warning, keeping its words.
 */
function proseFromHtml(body: Text, context: string): Text {
  const source = text(body);
  if (!source || !/^<[a-z][^>]*>/iu.test(source)) return body;
  const markdown = source
    .replace(/\r\n?/gu, '\n')
    .replace(/<\/p>\s*<p(?:\s[^>]*)?>/giu, '\n\n')
    .replace(/<\/?p(?:\s[^>]*)?>/giu, '\n\n')
    .replace(/<br\s*\/?>/giu, '\n')
    .replace(
      /<a\s[^>]*?href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/giu,
      (_whole, _quote: string, href: string, label: string) =>
        `[${label}](${decodeEntities(href)})`,
    )
    .replace(/<\/?(?:strong|b)>/giu, '**')
    .replace(/<\/?(?:em|i)>/giu, '*')
    .replace(/<[^>]+>/gu, (tag) => {
      warn(`${context}: drops the unsupported HTML tag ${tag}`);
      return '';
    });
  return decodeEntities(markdown)
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join('\n\n');
}

/** Flow blocks with any HTML prose read as Markdown, for `flowBlocks` and the shared sections. */
function markdownProse(entries: Entries<CmsFlow>, context: string): CmsFlow[] {
  return rows(entries).map((block) =>
    block.prose
      ? {
          ...block,
          prose: { body: proseFromHtml(block.prose.body, `${context} block ${block.id}`) },
        }
      : block,
  );
}

function proseBlocks(entries: Entries<CmsFlow>, context: string) {
  return flowBlocks(markdownProse(entries, context), (message) =>
    warn(`${context} ${message}`),
  );
}

/* ── The tool directory ──────────────────────────────────────────────────────── */

function mapTool(tool: CmsTool | null, context: string): ToolDirectoryTool | undefined {
  if (!tool) {
    warn(`${context} selects no published Tool`);
    return undefined;
  }
  const slug = text(tool.slug);
  if (!slug) {
    warn(`${context} Tool ${tool.documentId} has no slug`);
    return undefined;
  }
  const href = toolPath(slug);
  if (text(tool.routePath) && text(tool.routePath) !== href)
    warn(`${context} Tool ${slug} reports route ${tool.routePath}; linking ${href}`);
  const title = text(tool.hero?.title) ?? text(tool.name);
  if (!title) {
    warn(`${context} Tool ${slug} has no title or name`);
    return undefined;
  }
  if (!tool.listing)
    warn(`${context} Tool ${slug} has no listing (description, facts, action)`);
  const body = text(tool.listing?.description);
  const facts = rows(tool.listing?.facts).flatMap((fact) => {
    const label = text(fact.label);
    const factText = text(fact.body);
    return label && factText ? [{ label, text: factText }] : [];
  });
  const art = illustration(tool.hero?.illustration);
  const action = text(tool.listing?.ctaText);
  return {
    id: tool.documentId,
    title,
    href,
    ...(body ? { body } : {}),
    facts,
    ...(action ? { action } : {}),
    ...(art ? { art } : {}),
  };
}

function mapToolDirectory(section: CmsToolDirectory): ToolDirectorySection | undefined {
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.heading);
  if (!heading) {
    warn(`${key} has no heading`);
    return undefined;
  }
  const id = text(section.directoryAnchorId);
  const groups = rows(section.groups).flatMap((group): ToolDirectoryGroup[] => {
    const groupKey = `${key} group ${group.id}`;
    const tools = rows(group.tools).flatMap(
      (entry) => mapTool(entry.tool, `${groupKey} entry ${entry.id}`) ?? [],
    );
    const after = proseBlocks(group.after, groupKey);
    if (tools.length === 0) {
      warn(`${groupKey} has no tools to show`);
      if (after.length === 0) return [];
    }
    const groupHeading = text(group.groupHeading);
    const groupId =
      text(group.groupAnchorId) ?? (groupHeading ? `${key}-${group.id}` : undefined);
    return [
      {
        key: `${key}-${group.id}`,
        ...(groupId ? { id: groupId } : {}),
        ...(groupHeading ? { heading: groupHeading, headingId: `${groupId}-heading` } : {}),
        tools,
        after,
      },
    ];
  });
  const lead = text(section.directoryDescription);
  return {
    type: 'tool-directory',
    key,
    ...(id ? { id } : {}),
    heading,
    headingId: `${id ?? key}-heading`,
    ...(lead ? { lead } : {}),
    groups,
    after: proseBlocks(section.after, key),
  };
}

function mapSection(section: CmsToolsMasterSection): ToolsMasterSection | undefined {
  switch (section.__typename) {
    case 'ComponentListingToolDirectory':
      return mapToolDirectory(section);
    case 'ComponentSharedEditorialSection':
      return mapSharedSection(
        {
          ...section,
          blocks: markdownProse(section.blocks, `${section.__typename}-${section.id}`),
        },
        ROUTES.tools,
      );
    case 'ComponentSharedFaqSection':
      return mapSharedSection(section, ROUTES.tools);
    default: {
      const unknown = section as { __typename?: string };
      warn(`an unsupported section (${unknown.__typename ?? 'unknown'}) is skipped`);
      return undefined;
    }
  }
}

/** The published Tool Master, or null when none is published. */
export const getPublishedToolsMaster = cache(async (): Promise<ToolsMasterPage | null> => {
  const { toolMaster } = await publicGraphql<{ toolMaster: CmsToolsMaster | null }>(
    PUBLISHED_TOOLS_MASTER_QUERY,
    'PublishedToolsMaster',
  );
  if (!toolMaster) return null;
  if (toolMaster.routePath !== ROUTES.tools) {
    throw new Error(
      `New CMS ${ROUTES.tools}: published entry reports route ${toolMaster.routePath}`,
    );
  }
  const hero = mapHero(toolMaster.hero);
  if (!hero) throw new Error(`New CMS ${ROUTES.tools}: published entry has no hero title`);
  return {
    route: ROUTES.tools,
    hero,
    sections: rows(toolMaster.content).flatMap((section) => mapSection(section) ?? []),
  };
});
