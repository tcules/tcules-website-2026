/**
 * `next/script` — host-framework shim for the Design System artifact bundle. See next-link.tsx for why
 * the real module cannot be bundled (it pulls in Next's runtime internals, which need Next's runtime).
 *
 * The enquiry form's Turnstile check is the one reader: it loads Cloudflare's widget script. A library
 * card has no site key and no visitor to check, so the shim loads nothing and the widget stays an
 * empty box, as it does before the script arrives on the site.
 */
export default function Script(_props: Record<string, unknown>) {
  return null;
}
