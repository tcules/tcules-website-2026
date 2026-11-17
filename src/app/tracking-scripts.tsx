'use client';

import Script from 'next/script';

import { useTrackingStarted } from '@/lib/tracking-start';

import { HubSpotTracking } from './hubspot-tracking';

/**
 * Every third-party tag on the live site, rendered only once tracking has started (lib/tracking-start:
 * the visitor's first scroll, tap or keypress, or 5 s after load). Marketing, Jatin, 17 Nov 2026:
 * Tag Manager no longer loads before the page; of the three visitor-identification tools only RB2B
 * stays (Vector and Snitcher are gone). RB2B itself loads LiveIntent, an ad-identity service.
 */
export function TrackingScripts() {
  const started = useTrackingStarted();
  return (
    <>
      <HubSpotTracking started={started} />
      {started ? <TrackingTags /> : null}
    </>
  );
}

function TrackingTags() {
  return (
    <>
      <Script id="gtm-script" strategy="afterInteractive">
        {`
          (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var first = d.getElementsByTagName(s)[0];
            var tag = d.createElement(s);
            var layer = l !== 'dataLayer' ? '&l=' + l : '';
            tag.async = true;
            tag.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + layer;
            first.parentNode.insertBefore(tag, first);
          })(window, document, 'script', 'dataLayer', 'GTM-KMJSP983');
        `}
      </Script>
      <Script id="openai-pixel" strategy="afterInteractive">
        {`
          !(function (w, d, s, u) {
            if (w.oaiq) return;
            var q = function () {
              q.q.push(arguments);
            };
            q.q = [];
            w.oaiq = q;
            var j = d.createElement(s);
            j.async = 1;
            j.src = u;
            var f = d.getElementsByTagName(s)[0];
            f.parentNode.insertBefore(j, f);
          })(window, document, 'script', 'https://bzrcdn.openai.com/sdk/oaiq.min.js');

          oaiq('init', {
            pixelId: 'J1uZ6fyppdqJefmMMs5juQ',
            debug: true,
          });
        `}
      </Script>
      <Script id="rb2b-script" strategy="afterInteractive">
        {`
          !(function () {
            var reb2b = (window.reb2b = window.reb2b || []);
            if (reb2b.invoked) return;
            reb2b.invoked = true;
            reb2b.methods = ['identify', 'collect'];
            reb2b.factory = function (m) {
              return function () {
                var a = [].slice.call(arguments);
                a.unshift(m);
                reb2b.push(a);
                return reb2b;
              };
            };
            for (var i = 0; i < reb2b.methods.length; i++) {
              reb2b[reb2b.methods[i]] = reb2b.factory(reb2b.methods[i]);
            }
            reb2b.load = function (k) {
              var s = document.createElement('script');
              s.type = 'text/javascript';
              s.async = true;
              s.src =
                'https://ddwl4m2hdecbv.cloudfront.net/b/' + k + '/5NRP9HQEWWO1.js.gz';
              var x = document.getElementsByTagName('script')[0];
              x.parentNode.insertBefore(s, x);
            };
            reb2b.SNIPPET_VERSION = '1.0.1';
            reb2b.load('5NRP9HQEWWO1');
          })();
        `}
      </Script>
      <Script id="clarity-script" strategy="afterInteractive">
        {`
          (function (c, l, a, r, i, t, y) {
            c[a] =
              c[a] ||
              function () {
                (c[a].q = c[a].q || []).push(arguments);
              };
            t = l.createElement(r);
            t.async = 1;
            t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
          })(window, document, 'clarity', 'script', 'sv3bblws8p');
        `}
      </Script>
    </>
  );
}
