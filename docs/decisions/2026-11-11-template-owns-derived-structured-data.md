---
title: "The template owns the structured data it can derive; Strapi holds the facts"
date: 2026-11-11
status: active
area: [content]
source: "Owner, 11 Nov 2026, triaging Jatin's SEO list (D2, D4) in a Claude session; applied in fix/organization-jsonld and fix/insights-breadcrumbs (PRs to new-cms)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

The template writes the JSON-LD it can derive, and Strapi holds the facts it is built from, plus the
nodes only one page can say.
- **Site-wide nodes.** The root layout renders the Organization and WebSite nodes once per page, from
  SEO Settings (`seoSettings.organization`, `siteName`, `siteURL`, `language`). A page entry's
  hand-typed copies are dropped, and only their `@id` references are kept.
- **Breadcrumbs.** A page's BreadcrumbList is built from the same trail the page shows, and the
  entry's hand-typed one is replaced. Insights come first: Home › Insights › {Format} › title, with
  the format level linking `/insights?type={format}`.
- **What editors still write.** Page-specific nodes, such as WebPage, Article and FAQPage.

**Why.** Site facts copied by hand drift.
- 96 SEO page entries repeated an Organization node with the non-www url (`https://tcules.com`).
- 82 insights carried a richer copy of the Organization, and the rest a bare one.
- 117 insights carried a hand-typed BreadcrumbList, 96 of them pointing at the retired format pages,
  which redirect.

A fact kept in one place can't disagree with itself. A trail and its markup built from one list
can't disagree with each other.

**The mistake it prevents.** Treating JSON-LD as copy that an editor pastes into every entry. On the
live site, every page's Organization node had drifted from SEO Settings, and article breadcrumbs, both
visible and in the markup, linked `/insights/articles`, a redirect.

**How to apply.**
- **Site-wide nodes:** `lib/json-ld.ts` (`withoutSiteNodes`, `siteGraphMarkup`) and the root layout.
- **Insight breadcrumbs:** `lib/breadcrumb-json-ld.ts`, fed by the insight's derived breadcrumbs in
  `published-resource.ts`.
- **Other page types:** they move their BreadcrumbList to the template as they are touched.
- **Organisation facts:** a missing one is fixed in SEO Settings, never in a page entry.
- **Strapi cleanup:** the copies left in Strapi entries are ignored. Removing them is a content task
  that can be scripted.
