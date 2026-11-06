/**
 * `next/form` — host-framework shim for the Design System artifact bundle. See next-link.tsx for why
 * the real module cannot be bundled (it pulls in Next's router internals, which need Next's runtime).
 *
 * The listings Finder (ListingIndex) is the one reader: its filters are a GET form whose `action` is
 * the listing's own path. Next's Form turns a submit into a client navigation; a static card has
 * nowhere to navigate, so this is the plain element with Next's extra props dropped.
 */
import type { FormHTMLAttributes, ReactNode } from 'react';

type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action'> & {
  action: string | ((formData: FormData) => void | Promise<void>);
  children?: ReactNode;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: false | null;
};

export default function Form({
  action,
  replace: _replace,
  scroll: _scroll,
  prefetch: _prefetch,
  children,
  ...rest
}: FormProps) {
  return (
    <form {...rest} action={typeof action === 'string' ? action : undefined}>
      {children}
    </form>
  );
}
