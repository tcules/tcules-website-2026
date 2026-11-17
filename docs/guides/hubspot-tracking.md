# HubSpot website enquiries

Tracking and delivery run only when `RAILWAY_ENVIRONMENT_NAME=live`. The shared
tracking component loads portal `9387720` once using Next.js Script. Client route
changes receive manual page views; HubSpot owns the initial page view.

The enquiry API verifies Turnstile and saves to Strapi before sending to the
published Website enquiry form `41f4177f-a64c-49d8-a1fc-2bbbf6b1cdee`. It uses the
public Forms submission API without credentials. Contact-page enquiries and audit
requests use the same integration. Careers/application forms and newsletters stay
in Strapi only. Forms carry `data-hs-do-not-collect` to prevent HubSpot's automatic
collector from duplicating submissions or collecting excluded forms.

Email, first name, remaining name words as last name, company and message map to
their corresponding HubSpot fields. Missing optional names are omitted. The
existing form context supplies `tcules_origin_route` and `tcules_placement`.
`tcules_lead_source` is always `Website`.

`tcules:hubspot-visit` in sessionStorage keeps the first landing URL, external
referrer and campaign for the visit. If storage is blocked, these remain in memory
for the current document. `tcules_utm_campaign` holds a URL-encoded query string
containing the available `utm_source`, `utm_medium` and `utm_campaign` values from
that landing URL. Subsequent navigation does not overwrite attribution.

The submission context includes the current page URL/title and `hubspotutk` read
from the request cookie when present. Missing or blocked tracking cookies do not
prevent saving the enquiry; those contacts cannot be linked using that cookie.

HubSpot delivery has a four-second timeout and no automatic retry. HTTP/network
failures log the Strapi document ID and status/error type without enquiry data or
cookies. The visitor still receives success because Strapi already saved the lead.
Failed HubSpot deliveries need review using the saved Strapi record. Existing
browser conversion events continue to fire once after the enquiry API succeeds.

Run `npm run test:hubspot` for mapping, ordering, attribution, exclusions, failure
handling and conversion tests. Before launch, verify one HubSpot script and initial
page view, subsequent client navigation views, and a tracking cookie on the actual
live domain. Submit a controlled enquiry to verify its contact history in HubSpot.
Ensure GTM does not also install the same loader. Do not enable automatic collection
for these forms or send a second HubSpot request from a browser success listener.
