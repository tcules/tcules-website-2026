# Strapi Admin webhook cache revalidation

The website caches published GraphQL responses until a relevant Strapi Admin webhook expires them. Configure your existing webhook; the CMS uses its standard webhook sender. The custom delivery queue and its CMS startup hooks have been removed.

## Easy setup

1. Create a random secret of at least 32 characters. Run this once in Terminal and copy its output:

   ```sh
   openssl rand -hex 32
   ```

2. In Railway, open the **Next.js website service → Variables**. Set:

   ```dotenv
   NEW_CMS_GRAPHQL_URL=https://tcules-cms-2026-production.up.railway.app/graphql
   CMS_REVALIDATION_SECRET=YOUR_GENERATED_SECRET
   ```

   Use the raw generated value for the secret. Deploy the updated Next.js code before pointing Strapi at the endpoint.

3. In **Strapi Admin → Settings → Webhooks**, open your existing website-cache webhook. Set these fields:

   | Setting      | Value                                        |
   | ------------ | -------------------------------------------- |
   | Name         | Website cache refresh                        |
   | URL          | `https://YOUR-WEBSITE-DOMAIN/api/revalidate` |
   | Header key   | `Authorization`                              |
   | Header value | `Bearer YOUR_GENERATED_SECRET`               |
   | Enabled      | On                                           |

   Replace `YOUR-WEBSITE-DOMAIN` with the HTTPS domain running the updated website. If that is `www.tcules.com`, use `https://www.tcules.com/api/revalidate`. Use the final domain directly, without a redirect or an authentication screen. The secret in the header must exactly match the website variable; keep `Bearer` followed by one space before the secret. Strapi sends the JSON Content-Type itself.

4. Enable all five **Entry** events: **Create, Update, Publish, Unpublish, Delete**. Include all website collection types and single types if the UI exposes content-type-specific event rows. Enable **Media Create, Update, Delete** as well, so image changes refresh dependent content. Save and enable the webhook.

5. Click **Trigger** in the Admin webhook screen. Expect HTTP **200**. The response includes `test: true` and `revalidated: false`: this checks the URL and secret without expiring content. Then edit and publish a real test entry and refresh its website page and listing.

6. If you added the earlier automatic-sender settings to the CMS service, remove `NEXT_CACHE_REVALIDATION_URL` and the CMS-side `CMS_REVALIDATION_SECRET`. Deploy the reverted CMS code if you previously deployed the custom sender. The shared secret is configured in the Admin webhook header and the website environment. No new CMS runtime variables, lifecycle hooks or database tables are required by the Admin-based setup.

## Verify content changes

Use a temporary entry and confirm:

- Publishing a new entry makes its detail and listing appear, including a URL that previously returned 404.
- Updating and publishing changes the visible content.
- Changing the slug and publishing makes the new URL work and the old URL return 404.
- Unpublishing or deleting removes the entry from its detail page and listings.
- Revisiting unchanged pages does not request the same CMS data again.

The website logs use `scope: cms-revalidation`. A real accepted event has `status: revalidated`; an Admin Trigger probe has `status: tested`. Each request has a request ID and a body-derived event ID for tracing/replay. Private contact types and other unrelated models are ignored.

## Failure handling

| Status                 | Check                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| 200                    | Accepted. `test: true` is a connectivity check; publish an entry to test content refresh.     |
| 400                    | Unsupported/malformed event payload. Use Strapi's normal Entry or Media events.               |
| 401                    | The Admin Authorization value does not match the website secret.                              |
| 404                    | The URL is wrong or the updated website endpoint has not been deployed.                       |
| 405 on a browser visit | The endpoint accepts POST webhooks; use the Admin Trigger button.                             |
| 413                    | The webhook payload exceeds the 256 KiB limit.                                                |
| 503                    | The website secret is missing/too short, or cache invalidation failed. Check the website log. |

The installed Strapi 5.58.0 Admin sender sends one request with a ten-second timeout and does not automatically retry failures. After fixing a failed delivery, save/publish the affected entry again to send a new event. The Trigger button only checks connectivity; it does not replay a content event. Duplicate and out-of-order content events safely repeat invalidation without restoring older content.

An operator can replay a saved native event when needed:

```sh
curl --fail-with-body "$WEBSITE_ORIGIN/api/revalidate" \
  -H "Authorization: Bearer $CMS_REVALIDATION_SECRET" \
  -H 'Content-Type: application/json' \
  --data-binary @event.json
```

A native entry payload has this shape; Strapi generates it automatically:

```json
{
  "event": "entry.update",
  "createdAt": "2026-11-12T07:00:00.000Z",
  "model": "service",
  "uid": "api::service.service",
  "entry": { "documentId": "example-document-id", "slug": "product-design" }
}
```

## Cache behavior

The installed Next.js version is **16.3.1**. The shared reader caches validated data using `unstable_cache` with `revalidate: false`. Its internal `no-store` fetch runs only on a cache miss or after invalidation. It only uses `NEW_CMS_GRAPHQL_URL`, coalesces identical concurrent reads within a process and preserves existing GraphQL mapping and optional-image recovery. Unexpected GraphQL errors, HTTP failures and timeouts are not cached. Legacy public adapters now request published content through the same endpoint; contact submission mutations remain uncached.

The existing request-rendered layout remains in place. React `cache()` deduplicates within a render; Next's tagged Data Cache supplies persistence across visits. Existing page timer declarations do not change the explicit persistent data entries.

`src/lib/cms/cache-policy.ts` maps query owners and dependencies. Listing, singleton, related-content, taxonomy, SEO and media reads carry model tags. Detail reads also carry a hashed slug/SEO-path tag and a detail-family tag. The endpoint calls `revalidateTag(tag, { expire: 0 })`, so the next read fetches fresh published data rather than intentionally serving the expired result.

Native Admin events do not include a previous slug or SEO path. Each event therefore expires the affected model's detail family as well as its model/dependency tags. This handles old URLs, deletions and cached 404s without a stored slug index. Other detail records of that same model can also refresh. Unrelated content types remain cached unless a query depends on the changed type. JSON `resolved` placements conservatively depend on their possible routed content families. The implementation does not clear the root layout or the entire website cache.

The endpoint invalidates without fetching CMS data; regeneration happens when needed. Already-open browser tabs need a refresh or new navigation. External CDN page caching must respect application cache headers. Multiple Next.js instances need a shared cache with tag propagation, or webhook delivery to every independent cache instance. Sending a webhook to one load-balanced instance alone does not invalidate other private caches.

## Tests

From the website repository:

```sh
npm run test:cms-cache
npm run test:cms-cache:integration
npm run typecheck
npm run lint
NEW_CMS_GRAPHQL_URL=https://tcules-cms-2026-production.up.railway.app/graphql npm run build
```

The tests cover native Admin entry/media payloads, the Trigger probe, authentication, bounded bodies, retryable receiver errors, duplicate events, model dependencies, validated caching and request coalescing. The production Next.js integration uses a local counting GraphQL server to verify warm visits, listing refresh, native slug changes without a previous slug, cached 404s, all five entry events and unrelated content remaining cached. Tests do not edit production CMS content.

References: [Strapi webhooks](https://docs.strapi.io/cms/backend-customization/webhooks), [Next.js unstable_cache](https://nextjs.org/docs/app/api-reference/functions/unstable_cache), [Next.js revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).
