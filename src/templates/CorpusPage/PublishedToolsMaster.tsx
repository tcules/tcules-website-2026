import { Fragment } from 'react';

import { Layout, Media } from '@/components';
import type { OfferScenes, SketchName } from '@/lib/sketches';
import { serviceSceneFor } from '@/lib/sketches';
import { Bento, ContentSection, type BentoItem, type HeroMedia } from '@/patterns';

import { BandBody, onwardId } from './CopyBands';
import styles from './CorpusPage.module.css';
import { PublishedHero } from './PublishedHome';
import { SharedSectionView, type SharedSectionCtx } from './PublishedService';
import type {
  ToolDirectoryGroup,
  ToolDirectorySection,
  ToolDirectoryTool,
  ToolsMasterPage,
  ToolsMasterSection,
} from './published-tools-master-model';
import { tileActionFor } from './text';

/**
 * The tools as the /services hub's split tiles, as the corpus DirectoryBand drew them (tools critic,
 * 4 Nov 2026; decisions/2026-11-04-one-tool-tile): the drawing, the tool's title and its paragraph in
 * the named half, its listing facts ("Best for", "Bring", "You leave with") as the result panel's
 * labelled fields, and the listing's action at the panel's foot. The CMS drawing wins; else the drawing
 * the frontend files under the tool's route; else the empty plate.
 */
function toolTiles(tools: readonly ToolDirectoryTool[]): BentoItem[] {
  return tools.map((tool) => {
    const scene = tool.art?.scene ?? (tool.art?.image ? undefined : serviceSceneFor(tool.href));
    const [first, ...more] = tool.facts;
    const action = tool.action ?? tileActionFor(tool.href);
    return {
      id: tool.href,
      title: tool.title,
      href: tool.href,
      ...(tool.body ? { body: tool.body } : {}),
      ...(scene ? { scene: scene as SketchName } : {}),
      ...(tool.art?.image
        ? {
            picture: <Media image={tool.art.image} sizes="(min-width: 1024px) 25vw, 90vw" />,
          }
        : {}),
      ...(first
        ? {
            detail: {
              ...first,
              ...(more.length > 0 ? { fields: more } : {}),
              ...(action ? { action } : {}),
            },
          }
        : {}),
    };
  });
}

type HeadedGroup = ToolDirectoryGroup & { id: string; heading: string; headingId: string };

const isHeaded = (group: ToolDirectoryGroup): group is HeadedGroup =>
  Boolean(group.id && group.heading && group.headingId);

/** One headed group inside the directory: its h2 at the group scale, a `block` over its set. */
function ToolGroupNode({ group, tracks }: { group: HeadedGroup; tracks: 2 | 4 }) {
  return (
    <Layout as="section" id={group.id} data-band="tool-tiles" rowGap="block">
      <h2 id={group.headingId} className={styles.groupHeading}>
        {group.heading}
      </h2>
      <Bento items={toolTiles(group.tools)} tracks={tracks} />
    </Layout>
  );
}

/**
 * The headed groups as rows of one band: a group of two takes a row; two single-tool groups in a row
 * share one as two headed halves, their heads on one shared row from 1024. Then the groups' words
 * after their sets, under the whole set at the body measure, as the band's onward line.
 */
function ToolGroupRows({ groups }: { groups: readonly HeadedGroup[] }) {
  const rows: HeadedGroup[][] = [];
  for (const group of groups) {
    const prev = rows.at(-1);
    const single = group.tools.length === 1;
    if (single && prev?.length === 1 && prev[0]!.tools.length === 1) prev.push(group);
    else rows.push([group]);
  }
  const closing = groups.filter((group) => group.after.length > 0);
  return (
    <Layout rowGap="stack">
      <Layout rowGap="section">
        {rows.map((row) =>
          row.length === 2 ? (
            <Layout
              key={row[0]!.key}
              columns={{ base: 1, lg: [1, 1] }}
              shareRows={2}
              colGap="gutter"
              rowGap="section"
            >
              {row.map((group) => (
                <ToolGroupNode key={group.key} group={group} tracks={2} />
              ))}
            </Layout>
          ) : (
            <ToolGroupNode key={row[0]!.key} group={row[0]!} tracks={4} />
          ),
        )}
      </Layout>
      {closing.map((group) => (
        <Layout
          key={group.key}
          as="section"
          id={onwardId(group.id)}
          aria-labelledby={group.headingId}
          rowGap="stack"
        >
          <BandBody blocks={group.after} labelledBy={group.headingId} />
        </Layout>
      ))}
    </Layout>
  );
}

/** A group with no heading of its own: its tiles, then its words after the set at the body measure. */
function PlainToolGroup({
  group,
  labelledBy,
}: {
  group: ToolDirectoryGroup;
  labelledBy: string;
}) {
  const set = group.tools.length > 0 ? <Bento items={toolTiles(group.tools)} /> : null;
  if (group.after.length === 0) return set;
  return (
    <Layout rowGap="stack">
      {set}
      <BandBody blocks={group.after} labelledBy={labelledBy} />
    </Layout>
  );
}

/** The groups in saved order: consecutive headed groups share rows; a plain group stands alone. */
function directoryRuns(groups: readonly ToolDirectoryGroup[]) {
  const runs: (HeadedGroup[] | ToolDirectoryGroup)[] = [];
  for (const group of groups) {
    const prev = runs.at(-1);
    if (!isHeaded(group)) runs.push(group);
    else if (Array.isArray(prev)) prev.push(group);
    else runs.push([group]);
  }
  return runs;
}

/**
 * A tool directory: the band's head and lead, then its groups in the editor's order, then its own
 * words after the set. Every tool on the page takes the one split-tile form.
 */
export function ToolDirectoryBand({ section }: { section: ToolDirectorySection }) {
  const runs = directoryRuns(section.groups);
  const parts = runs.map((run) =>
    Array.isArray(run) ? (
      <ToolGroupRows key={run[0]!.key} groups={run} />
    ) : (
      <PlainToolGroup key={run.key} group={run} labelledBy={section.headingId} />
    ),
  );
  const after =
    section.after.length > 0 ? (
      <BandBody blocks={section.after} labelledBy={section.headingId} />
    ) : null;
  const children =
    parts.length === 1 && !after ? (
      parts[0]
    ) : (
      <Layout rowGap="stack">
        {parts}
        {after}
      </Layout>
    );
  return (
    <ContentSection
      id={section.id}
      heading={section.heading}
      headingId={section.headingId}
      data-band="tool-tiles"
      {...(section.lead ? { lead: section.lead } : {})}
    >
      {children}
    </ContentSection>
  );
}

function MasterSection({
  section,
  ctx,
}: {
  section: ToolsMasterSection;
  ctx: SharedSectionCtx;
}) {
  return section.type === 'tool-directory' ? (
    <ToolDirectoryBand section={section} />
  ) : (
    <SharedSectionView section={section} ctx={ctx} />
  );
}

/**
 * TIER 3 — the Tool Master (`/tools`) from the new CMS: the hero, then every section in the editor's
 * order, each through the band the corpus hub drew it with. Drawings fall back to the frontend's own;
 * words never do.
 */
export function PublishedToolsMaster({
  page,
  fallbackMedia,
  scenes,
}: {
  page: ToolsMasterPage;
  /** The hub's own hero drawing, for a hero whose CMS entry has no media. */
  fallbackMedia?: HeroMedia;
  scenes?: OfferScenes;
}) {
  const ctx: SharedSectionCtx = {
    route: page.route,
    slug: page.route.slice(1),
    family: 'tool_hub',
    scenes,
  };
  return (
    <>
      <PublishedHero hero={page.hero} fallbackMedia={fallbackMedia} />
      {page.sections.map((section) => (
        <Fragment key={section.key}>
          <MasterSection section={section} ctx={ctx} />
        </Fragment>
      ))}
    </>
  );
}
