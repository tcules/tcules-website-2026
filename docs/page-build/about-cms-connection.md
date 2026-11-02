# About single type in preview

`/about` reads `about(status: PUBLISHED)` from the production **About** single type through
`STRAPI_CASE_STUDY_GRAPHQL_URL`. The default is
`https://tcules-cms-2026-production.up.railway.app/graphql`. Optional server-only bearer
authentication uses `STRAPI_CASE_STUDY_API_TOKEN`. The general `STRAPI_GRAPHQL_URL` does not
control this route.

The native title, hero, content dynamic zone and SEO own the page. No local About document,
legacy About projection or `corpusContent` snapshot is read. The source maps native components
into the existing About template's page model, preserving native section and relation order.
Removing or unpublishing a selected service, employee, case, testimonial or FAQ removes its content
from this page; old snapshot rows are not retained.

The current published record contains nine sections: eight service destinations, five comparisons,
five audiences, four case studies, two leaders and two studio stories, six working terms, sixteen
company facts, three testimonials, nine active FAQs and a closing button CTA. Published service
summaries and case covers are resolved by the CMS from the selected records. Employee names,
roles, biographies and optional LinkedIn links come from the selected published profiles. A person
without a LinkedIn link still renders. A service without a registered drawing still renders its tile.

Uploaded hero, story and case images take precedence over approved layout fallbacks. Their alt text,
intrinsic dimensions and responsive variants are preserved. Story images follow their component
identity when reordered. Native testimonial copy, attribution, rating and optional portrait reach
the existing testimonial components. Native rich text retains paragraphs, headings, lists, inline
links and emphasis; the FAQ and closing CTA retain their authored links. Native table captions and
summaries are supported alongside the company facts. Social link rows remain the template's buttons.

SEO supplies title, description, canonical and robots, with empty values falling back to the native
hero and the About route. Authored JSON-LD is emitted with `<` escaped. The CMS's declarative schema
types (`AboutPage`, `BreadcrumbList`, `FAQPage`) are projected into JSON-LD using this published
page's actual title, breadcrumb and active questions. The native `updatedAt` supplies `lastModified`
in both sitemap views.

Reads use the shared ten-second timeout and five-minute cache tagged `about`. Missing or unpublished
About content returns 404 and is omitted from the sitemap. Request/schema failures surface instead
of serving local copy. Local design specimens keep their own source. This integration writes no CMS
content and submits no enquiries.

Validation:

- `npm run about:check` exercises the real adapter and About renderer, covering native component
  mapping, order/removal, media, people without social links, new service destinations, tables,
  testimonial portraits, FAQ links, SEO/schema, endpoint/authentication and failures.
- `npm run about:check -- --live` verifies the published record's complete text against the actual
  About template and records the native values for browser checks.
- `npm run verify`, `npm run build` and `npm run aria:check` cover repository and rendered contracts.
- Desktop/mobile browser checks cover content, destinations, native images, people, FAQs, CTA,
  metadata, structured data, sitemap, anchors and overflow.
