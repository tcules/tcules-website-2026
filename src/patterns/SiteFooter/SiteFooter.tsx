import Link from 'next/link';

import {
  BrandMark,
  Button,
  Cluster,
  Icon,
  Input,
  Layout,
  Logo,
  RatingBadge,
  Section,
} from '@/components';

import styles from './SiteFooter.module.css';
import type { SiteFooterProps } from './types';

/**
 * SiteFooter — the closing band: brand, directory, newsletter, studio, legal.
 *
 * A SERVER component, and worth keeping that way. Nothing here is stateful, nothing reads the URL,
 * and the newsletter posts as a plain form rather than through JavaScript — so the footer ships no
 * client bundle at all. That is why `'use client'` is confined to SiteNav, which genuinely needs
 * it: a footer on every page of the site is the wrong place to hand the browser a hydration cost
 * for nothing. The mobile accordions below are native `<details>`, chosen so that constraint
 * survives them.
 *
 * ── Five bands, five shapes ─────────────────────────────────────────────────────────────────────
 * The one decision worth defending. A footer is the easiest place in a site to end up with four
 * identical rectangles of small links, and the rule here is that if you squint it has to read as
 * more than one idea. So (order and content: owner, 3 Nov 2026):
 *
 *   1  BRAND      the mark at 40 and the tagline at lead on one side, the action and the rating
 *                 badge on the other. Left-weighted and tall; the weight is scale and position.
 *   2  DIRECTORY  six groups in two rows of three — what we do, then who we are and what we
 *                 publish. Three tracks rather than six because the expertise labels are long:
 *                 at six they broke over two lines each and the column read as a paragraph.
 *   3  NEWSLETTER two columns — the pitch, and the field. The only form on the page.
 *   4  STUDIO     one line about the studio at body, the address and email under it in small
 *                 print, then the profiles as words. A statement, not a grid of cells.
 *   5  LEGAL      one line: the notice and the legal pages against the icon credit.
 *
 * Bands 2 to 5 are separated by a hairline with air on both sides, and by nothing else — no
 * alternating grounds, because varying the ground behind a block is how a page ends up with five
 * bands and one idea. Under all of it sits the watermark: the mark again, oversized, at
 * --opacity-faint, which is ground rather than a sixth band.
 *
 * ── Why the directory is rendered twice ─────────────────────────────────────────────────────────
 * The design is a grid at lg and collapsed accordions below it. Those are two different DOM
 * shapes, not one shape restyled, and with no JavaScript nothing can turn one into the other at
 * runtime. Forcing a closed `<details>` visually open with `display` DOES NOT WORK in Chrome — the
 * UA hides closed content more strongly than a `display` override undoes, which was verified
 * rather than assumed. So both are rendered and CSS picks one.
 *
 * The cost is that the directory's links appear twice in the markup. That is accepted, and the
 * alternative was worse: the audit requires every link to be in the rendered mobile HTML, which
 * rules out shipping only the accordions' contents when open. `display: none` removes the inactive
 * copy from the accessibility tree and the tab order both, so only one is ever reachable.
 */
export function SiteFooter({
  brand,
  cta,
  groups,
  newsletter,
  studio,
  legal,
  surface = 'ink',
}: SiteFooterProps) {
  return (
    <Section as="footer" surface={surface}>
      <Layout rowGap="stack">
        {/* ── 1 · Brand ───────────────────────────────────────────────────────────────
            No hairline and no inset: it is the first band, and a rule above the mark would be a
            rule against the section's own top padding.

            Opposed rather than stacked: the mark and its sentence read left, the thing to DO reads
            right, and the gap between them is what stops the band being one more full-width
            rectangle. Two tracks at 2:1 rather than a Cluster, because Cluster's gap scale stops
            at 24 and the two halves are a split (CLAUDE.md § gap scale, rule 2) — the mark and the
            action are different kinds of thing, so they take a section's distance. One track below md, where the right group left-aligns under the tagline. */}
        <Layout
          columns={{ base: 1, md: [2, 1] }}
          colGap="section"
          rowGap="gutter"
          shareRows={2}
        >
          {/* From lg the two halves share their rows (owner, 4 Nov 2026: the right side looked
              taller). The button and the badge are not the heights of the mark and the tagline, so
              two independent stacks never met at either end; sharing rows puts the button in the
              mark's row and the badge in the tagline's, each centred on its partner. */}
          <Layout className={styles.brandIdentity} rowGap="block" align="center">
            {/* The mark carries its own name here. Unlike the header's, it is not inside a link,
                so nothing else announces it. */}
            {/* Mono on every ground, the light ones included: the footer is UI chrome, where ch02
                v1.0 makes the whole wordmark neutral-950 — and white on ink and blue. The accent
                bar is for the mark at marketing scale, which this is not. */}
            <Logo size="lg" variant="mono" />
            <p className={styles.tagline}>{brand.tagline}</p>
          </Layout>

          <Layout className={styles.brandAction} rowGap="block" align="center">
            {/* md, not lg. The tagline beside it is the band's weight; an lg button opposite a
                lede line makes two things compete for the same job, and the badge under it reads
                as a caption to a smaller control rather than an equal to a larger one. */}
            <Button as={Link} href={cta.href}>
              {cta.label}
            </Button>
            {brand.rating ? (
              <RatingBadge
                size="sm"
                score={brand.rating.score}
                platform={brand.rating.platform}
                href={brand.rating.href}
                icon={<Icon name="star" size="sm" />}
                mark={<BrandMark name={brand.rating.mark} />}
              />
            ) : null}
          </Layout>
        </Layout>

        {/* ── 2 · Directory ───────────────────────────────────────────────────────────
            Three tracks at lg, accordions below it. The link rest state is ink rather than blue:
            forty blue links is not forty signals, it is a blue block. */}
        {/* A band like the others at lg. Below it the hairline is the top edge of the accordion
            list, with no air under it, so the list reads as ruled and closed at both ends (owner,
            4 Nov 2026). */}
        <div className={styles.directoryBand}>
          {/* Desktop. Three tracks, two rows: Services and the two expertise groups, then Work,
              Resources and Studio. The breakpoint toggle lives on this wrapper rather than on the
              Layout, because both would be single-class selectors and which one won `display`
              would come down to the order the bundler happened to emit them in. */}
          <div className={styles.directoryDesktop}>
            <Layout columns={3} colGap="gutter" rowGap="stack">
              {groups.map((group) => (
                <Layout key={group.title} rowGap="block">
                  <p className={styles.label}>{group.title}</p>
                  <Layout as="ul" rowGap="tight">
                    {group.links.map((link) => (
                      <li key={`${group.title}-${link.label}`}>
                        <Link href={link.href} className={styles.link}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </Layout>
                </Layout>
              ))}
            </Layout>
          </div>

          {/* Mobile. Native <details>: collapsed by default, no script, and every link present in
              the markup whether or not a group is open. */}
          <div className={styles.directoryAccordions}>
            {groups.map((group) => (
              <details key={group.title} className={styles.accordion}>
                <summary className={styles.accordionSummary}>
                  <span className={styles.label}>{group.title}</span>
                  <span className={styles.accordionChevron}>
                    <Icon name="alt-arrow-down" size="sm" />
                  </span>
                </summary>
                <Layout as="ul" className={styles.accordionPanel} rowGap="tight">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.label}`}>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </Layout>
              </details>
            ))}
          </div>
        </div>

        {/* ── 3 · Newsletter ──────────────────────────────────────────────────────── */}
        <Layout className={styles.newsletterBand} columns={[1, 1]} colGap="section" rowGap="stack">
          <Layout rowGap="block">
            {/* The label and title nest at tight INSIDE a block stack. Flattening all three to
                block makes them read as three unrelated lines rather than an eyebrow on a title
                with a sentence under it. */}
            <Layout rowGap="tight">
              <p className={styles.label}>Newsletter</p>
              <p className={styles.title}>{newsletter.title}</p>
            </Layout>
            <p className={styles.body}>{newsletter.description}</p>
          </Layout>

          {/* A plain POST, no JavaScript. NOTHING SERVES THIS ENDPOINT YET — see ENDPOINTS in
              @/lib/routes. `align="end"` so a field and button that have wrapped onto two lines
              still sit on one baseline. */}
          <form action={newsletter.action} method="post" className={styles.newsletterForm}>
            <Cluster rowGap="tight" colGap="tight" align="end">
              {/* The input is WRAPPED by its label rather than wired to it with an id. A real
                  label is required — a placeholder is not one, it disappears the moment anyone
                  types — and wrapping means the pattern needs no generated id, which is what keeps
                  it a server component and lets four of them coexist on the proving ground without
                  three broken `for` references. */}
              <label className={styles.fieldLabel}>
                <span className={styles.fieldLabelText}>{newsletter.fieldLabel}</span>
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={newsletter.placeholder}
                  required
                />
              </label>
              {/* Ghost rather than solid: the page already has one primary action, two bands up,
                  and a second solid button here would split the ask. extendHitArea because this
                  one has nothing to help it — the field beside it is wrapped in a label that
                  forwards taps, and this Button is not. 40px box, 44px target, row height
                  unchanged. */}
              <Button type="submit" emphasis="ghost" extendHitArea>
                {newsletter.cta.label}
              </Button>
            </Cluster>
          </form>
        </Layout>

        {/* ── 4 · Studio ──────────────────────────────────────────────────────────────
            A split: the studio describing itself on one side, the facts on the other (owner,
            4 Nov 2026: "something better" than one run-on paragraph over a line of small print).
            The statement and the facts are different kinds of thing, so they take a section's
            distance. The facts are two peers — where the studio is and how to write to it, and where
            else it is — each a labelled stack, so the address reads as an address (three short
            lines) rather than as a sentence. */}
        <Layout
          className={styles.band}
          columns={{ base: 1, lg: [1, 1] }}
          colGap="section"
          rowGap="stack"
        >
          <p className={styles.statement}>{studio.statement}</p>

          <Layout columns={[1, 1]} colGap="gutter" rowGap="stack">
            <Layout rowGap="text">
              <p className={styles.label}>Address</p>
              <Layout rowGap="tight">
                <address className={styles.address}>
                  {studio.address.map((line) => (
                    <span key={line} className={styles.addressLine}>
                      {line}
                    </span>
                  ))}
                </address>
                <a className={styles.email} href={`mailto:${studio.email}`}>
                  {studio.email}
                </a>
              </Layout>
            </Layout>

            <Layout rowGap="text">
              <p className={styles.label}>Elsewhere</p>
              {/* A plain anchor, not a Link: next/link prefetches and client-navigates, and
                  neither means anything for another origin. `noreferrer` implies `noopener`, and
                  both are stated because the pair is what reviews look for. */}
              <Layout as="ul" rowGap="tight">
                {studio.social.map((social) => (
                  <li key={social.label}>
                    <a
                      className={styles.socialLink}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {social.label}
                      <Icon name="arrow-right-up" size="sm" />
                    </a>
                  </li>
                ))}
              </Layout>
            </Layout>
          </Layout>
        </Layout>

        {/* ── 5 · Legal ───────────────────────────────────────────────────────────────
            The notice leads and the legal pages follow it on one line, the credit closes at the
            far end. All of it in the legal treatment: small print in link colour would read as one
            more navigation group. */}
        <Cluster className={styles.band} justify="between" align="baseline" rowGap="text" colGap="block">
          <Cluster align="baseline" rowGap="tight" colGap="text">
            <p className={styles.legal}>{legal.notice}</p>
            <Cluster as="ul" rowGap="tight" colGap="text">
              {legal.links.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.smallLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Cluster>
          </Cluster>
          <p className={styles.legal}>{legal.credit}</p>
        </Cluster>
      </Layout>

      {/* ── Watermark ───────────────────────────────────────────────────────────────
          The mark again, oversized, as ground rather than as a mark. Rendered at a real size
          rather than transformed: a transform contributes nothing to layout height, so a scaled
          mark paints outside the document and cannot be scrolled to. Decorative — the wordmark is
          already announced once at the top of the band, and twice is noise. */}
      <div className={styles.watermark} aria-hidden="true">
        <Logo size="lg" variant="mono" title="" />
      </div>
    </Section>
  );
}
