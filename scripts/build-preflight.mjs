#!/usr/bin/env node
/**
 * Runs before every `npm run build` (npm's `prebuild` hook), so a deploy that cannot read the CMS
 * fails instead of shipping pages built without it.
 *
 * The build prerenders the site from the CMS and keeps each page until a publish expires it
 * (app/layout.tsx). Two things can make that bake in the wrong pages, and this answers both:
 *
 * 1. An unreachable CMS. The readers fall back rather than throw (a missing nav, a page without its
 *    band, a 404), which is right for one request and wrong for a page kept until the next publish.
 *    The probe below fails the build, so the deployment already live keeps serving.
 *
 * 2. A data cache carried over from an earlier build. CMS reads are kept in .next/cache/fetch-cache
 *    with no time limit, a publish expires them only in the running server's memory, and a host that
 *    restores .next/cache between builds (likely on Railway: a redeploy on 18 Nov 2026 kept stale CMS
 *    data) would prerender
 *    from reads as old as that cache. It is deleted, so every build reads the CMS as it is now. The
 *    rest of .next/cache (the bundler's own cache) is kept.
 *
 * A failure mid-build is not caught here: that page renders with its fallback and heals on the
 * layout's five-minute safety net, because a failed read is never cached.
 */
import { rmSync } from 'node:fs';

import nextEnv from '@next/env';

/* The same .env files `next build` reads, so a local build with the URL in .env.local passes. */
nextEnv.loadEnvConfig(process.cwd());

rmSync('.next/cache/fetch-cache', { recursive: true, force: true });

const url = process.env.NEW_CMS_GRAPHQL_URL?.trim();
if (!url) {
  console.error(
    'build-preflight: NEW_CMS_GRAPHQL_URL is not set for the build. The build prerenders every page\n' +
      'from the CMS, so it must be readable at build time as well as at runtime (on Railway: the\n' +
      "service's variables, which Railway also hands to the build).",
  );
  process.exit(1);
}

async function probe() {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ __typename }' }),
    signal: AbortSignal.timeout(10_000),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.data) throw new Error(`HTTP ${response.status}`);
}

let lastError;
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await probe();
    console.log(`build-preflight: CMS readable at ${new URL(url).host}; data cache cleared.`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 5_000));
  }
}
console.error(
  `build-preflight: the CMS at ${new URL(url).host} did not answer (${lastError?.message ?? lastError}).\n` +
    'The build would prerender pages without their content, so it stops here; the live deployment\n' +
    'keeps serving. Retry the deploy once the CMS answers.',
);
process.exit(1);
