'use client';

import Script from 'next/script';
import { type Ref, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';

type TurnstileApi = {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      appearance: 'execute';
      execution: 'execute';
      size: 'normal';
      theme: 'light';
      retry: 'never';
      'response-field': false;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
      'timeout-callback': () => void;
    },
  ): string;
  reset(id: string): void;
  execute(id: string): void;
  remove(id: string): void;
};

export type TurnstileWidgetHandle = { requestToken(): Promise<string> };

const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
const unavailable = 'Verification is unavailable. Please try again.';
const failed = 'Verification failed. Please try again.';
const expired = 'Verification expired. Please try again.';

export function TurnstileWidget({ ref }: { ref: Ref<TurnstileWidgetHandle> }) {
  const scriptId = useId();
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<{ api: TurnstileApi; id: string } | null>(null);
  const pending = useRef<((result: string | Error) => void) | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const api = (window as Window & { turnstile?: TurnstileApi }).turnstile;
    if (!ready || !api || !container.current || !sitekey) return;

    let id: string;
    try {
      id = api.render(container.current, {
        sitekey,
        appearance: 'execute',
        execution: 'execute',
        size: 'normal',
        theme: 'light',
        retry: 'never',
        'response-field': false,
        callback: (token) => pending.current?.(token || new Error(failed)),
        'expired-callback': () => pending.current?.(new Error(expired)),
        'error-callback': () => pending.current?.(new Error(failed)),
        'timeout-callback': () => pending.current?.(new Error(expired)),
      });
    } catch {
      return;
    }
    widget.current = { api, id };
    return () => {
      pending.current?.(new Error(unavailable));
      widget.current = null;
      api.remove(id);
    };
  }, [ready]);

  useImperativeHandle(
    ref,
    () => ({
      requestToken() {
        const current = widget.current;
        if (!current || pending.current) return Promise.reject(new Error(unavailable));

        return new Promise((resolve, reject) => {
          const timer = window.setTimeout(() => pending.current?.(new Error(expired)), 120_000);
          pending.current = (result) => {
            window.clearTimeout(timer);
            pending.current = null;
            if (typeof result === 'string') resolve(result);
            else reject(result);
          };
          try {
            current.api.reset(current.id);
            current.api.execute(current.id);
          } catch {
            pending.current?.(new Error(failed));
          }
        });
      },
    }),
    [],
  );

  if (!sitekey) return null;
  return (
    <>
      <Script
        id={`cloudflare-turnstile-${scriptId}`}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
      />
      <div ref={container} />
    </>
  );
}
