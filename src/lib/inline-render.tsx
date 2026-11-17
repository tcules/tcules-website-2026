import Link from 'next/link';

/* Links never prefetch (performance pass, 6 Nov 2026): every page renders on request from the CMS,
   so each link in view cost a full server render on every page load. See SiteNav. */
import type { ReactNode } from 'react';

import type { InlineRun } from './inline';

/**
 * Render inline runs as React nodes — `strong`, `em`, `code`, `<br>` and links, nothing else.
 *
 * A function rather than a component: it adds no element of its own, so it drops into whatever
 * text container a pattern already owns (a paragraph, a list item, a heading, a table cell) and
 * inherits that container's type role. It carries no style and no spacing; the base `strong`, `em`,
 * `a` and `code` rules in globals.css are the floor.
 *
 * Links: a path beginning with `/` goes through `next/link`; a `#anchor` and anything absolute is a
 * plain anchor, and an absolute URL opens as an ordinary external link with `rel="noopener"`.
 */
export function renderInline(runs: readonly InlineRun[]): ReactNode {
  return runs.map((run, i) => {
    switch (run.type) {
      case 'text':
        return run.text;
      case 'strong':
        return <strong key={i}>{renderInline(run.children)}</strong>;
      case 'em':
        return <em key={i}>{renderInline(run.children)}</em>;
      case 'code':
        return <code key={i}>{run.text}</code>;
      case 'br':
        return <br key={i} />;
      case 'link':
        return run.href.startsWith('/') ? (
          <Link key={i} href={run.href} prefetch={false}>
            {renderInline(run.children)}
          </Link>
        ) : (
          <a key={i} href={run.href} rel={/^https?:/.test(run.href) ? 'noopener' : undefined}>
            {renderInline(run.children)}
          </a>
        );
    }
  });
}
