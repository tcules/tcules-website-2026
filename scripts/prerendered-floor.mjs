/**
 * The floor under every check that reads the prerendered HTML in .next/server/app (aria:check,
 * kinds:check).
 *
 * Those checks can only see a page the build prerendered. From 6 to 26 Nov 2026 the root layout
 * carried `revalidate = 0`, so every route rendered per request and the build wrote ONE html file
 * (`_global-error.html`): aria:check reported "1 prerendered pages, 0 idrefs followed" and passed,
 * checking nothing, for three weeks. A check that finds almost nothing to check must fail, not pass.
 *
 * The floor counts the site's own pages, never the `/design` specimens: main carries about 110 of
 * those and new-cms (production) none, so counting them let main pass where production failed. On
 * 26 Nov 2026 both prerendered 87 site pages. The floor is deliberately far below that and far above
 * what a per-request build leaves (1), so a CMS page that comes or goes never trips it, and a segment
 * config that switches prerendering off for the site always does. The home page is named on its own:
 * it is the one route every build must prerender.
 */
import { existsSync, globSync } from 'node:fs';
import { join } from 'node:path';

export const MIN_PRERENDERED_PAGES = 50;

/** The prerendered pages under `app` (.next/server/app), or exits 1 with the reason. */
export function prerenderedPages(app, check) {
  const files = globSync(join(app, '**/*.html'));
  const site = files.filter((f) => !f.startsWith(join(app, 'design')));
  const home = existsSync(join(app, 'index.html'));
  if (site.length >= MIN_PRERENDERED_PAGES && home) return files;

  console.error(
    `FAIL  ${check}: the build prerendered ${site.length} site page(s) outside /design` +
      `${home ? '' : ', and not the home page'}; the floor is ${MIN_PRERENDERED_PAGES}.\n` +
      (files.length === 0
        ? '      Run `npm run build` first: this check reads what the build emitted.\n'
        : '      Something stopped the build prerendering the site, most likely a segment config\n' +
          '      (`revalidate = 0`, `dynamic = "force-dynamic"`) on a layout every route shares, or a\n' +
          '      request-time API (cookies, headers, searchParams) in one. This check cannot see a page\n' +
          '      that was not prerendered, so it refuses to pass on what it could not read.\n'),
  );
  process.exit(1);
}
