import Script from 'next/script';

import { HubSpotTracking } from './hubspot-tracking';

export function TrackingScripts() {
  return (
    <>
      <HubSpotTracking />
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
      <Script id="snitcher-script" strategy="afterInteractive">
        {`
          !(function (s, n, i, t, c, h) {
            s.SnitchObject = i;
            s[i] ||
              (s[i] = function () {
                (s[i].q = s[i].q || []).push(arguments);
              });
            s[i].l = +new Date();
            c = n.createElement(t);
            h = n.getElementsByTagName(t)[0];
            c.src = 'https://snid.snitcher.com/8433359.js';
            h.parentNode.insertBefore(c, h);
          })(window, document, 'snid', 'script');
          snid('verify', '8433359');
        `}
      </Script>
      <Script id="vector-script" strategy="afterInteractive">
        {`
          !(function (e, r) {
            try {
              if (e.vector) return;
              var t = {};
              t.q = t.q || [];
              for (
                var m = ['load', 'identify', 'on'],
                  f = function (k) {
                    return function () {
                      var a = [].slice.call(arguments);
                      t.q.push([k, a]);
                    };
                  },
                  i = 0;
                i < m.length;
                i++
              ) {
                t[m[i]] = f(m[i]);
              }
              e.vector = t;
              if (!t.loaded) {
                var s = r.createElement('script');
                s.type = 'text/javascript';
                s.async = !0;
                s.src = 'https://cdn.vector.co/pixel.js';
                var x = r.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
                t.loaded = !0;
              }
            } catch (err) {}
          })(window, document);
          vector.load('0b1be0ff-60a0-45b9-aedc-c4bd1ea5b95c');
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
