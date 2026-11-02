# Case study detail pages: production CMS connection

On `preview`, `/case-studies/{slug}` reads the published case study collection from
`https://tcules-cms-2026-production.up.railway.app/graphql`.

The server sends `GetCaseStudyInternalPage` with the exact slug, `status: PUBLISHED`
and a one-record limit. The new CMS exposes its native body through the existing
`caseStudyContents` GraphQL projection. The adapter keeps the current block renderer,
including rich text, media, quotes, links, profile facts, statements, SEO and the
generated table of contents.

When the record includes `storyView`, the adapter validates its chapters, all five
part types, figure annotations and media metadata before using the existing
`CaseStory` template. Identity, profile facts, statements and SEO come from the same
case record. The live route does not fall back to the local Benchmark fixture;
that fixture remains available to the design specimen.

Missing published records return 404. HTTP errors, GraphQL errors and invalid story
data surface as errors instead of quietly substituting content. Requests time out
after ten seconds. Next.js caches successful reads for five minutes, and React's
request cache shares the record between metadata generation and page rendering.
Relative media URLs resolve against the new CMS; responsive image widths come from
its uploads.

## Configuration

`STRAPI_CASE_STUDY_GRAPHQL_URL` optionally overrides the production endpoint above.
`STRAPI_CASE_STUDY_API_TOKEN` optionally supplies a server-side bearer token when
public case study reads are disabled. The production public reader currently needs
no token. Neither variable is exposed to browser code.

This change applies to detail pages. The case index and other page families retain
their current sources. `STRAPI_GRAPHQL_URL` continues to configure those existing
adapters independently.

## Verification

`npm run case-studies:check` checks the adapter without network access and runs in
`npm run verify`. It covers published reads, structured and block bodies, all story
part types, arrays longer than 25 items, media resolution, SEO, endpoint overrides,
optional authentication, unknown slugs, malformed content and API failures.

`npm run case-studies:check -- --live` additionally reads every published production
case through the actual query and adapter. On 2 November 2026, it verified 20 cases,
including Benchmark Gensuite's six chapters, and an unknown slug.
