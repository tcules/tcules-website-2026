# Strapi cache revalidation

1. Set `CMS_REVALIDATION_SECRET` to a random secret on the frontend deployment and deploy this
   version. The public GraphQL endpoint still uses anonymous reads.
2. In the new Strapi CMS, go to **Settings → Webhooks** and add a webhook pointing to
   `https://<frontend-host>/api/revalidate/strapi`. Add an `Authorization` header with the value
   `Bearer <CMS_REVALIDATION_SECRET>`. Strapi adds the `X-Strapi-Event` header automatically.
3. Enable entry **Create**, **Update**, **Delete**, **Publish**, and **Unpublish**, and media
   **Create**, **Update**, and **Delete**. Enable **Release publish** if available. Create and
   Update also cover types where edits go live without a Publish action.
4. In staging, change and publish a sample page and its SEO record. Open the page in a fresh
   browser tab after webhook delivery. Check the body, HTML title and description, and JSON-LD
   against the published values. Restore the sample after the check.

An accepted event expires the tagged CMS data. On the next request to Next.js, affected pages
regenerate with fresh content and SEO. The shared tag covers nested relations and Dynamic Zones,
listings, and site navigation and footer. Media events also expire cached media fetched by the
frontend server. Regeneration happens as pages are requested.

The five-minute, request-driven ISR interval remains a backup if a webhook is missed. The first
request after that interval can still see the previous version while Next.js regenerates in the
background. Already-open pages need a refresh to pick up changes. If the deployment uses multiple
Next.js instances, use a shared cache with tag invalidation. If a separate CDN caches HTML, purge
that cache on publish or bypass it for CMS-backed pages to get first-request freshness. Media
served directly from the CMS or its CDN follows that origin's cache policy. This webhook covers the
new CMS endpoint.
