'use client';

import { type FormEvent, useRef, useState } from 'react';

import {
  Button,
  Cluster,
  Input,
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from '@/components';

import styles from './SiteFooter.module.css';
import type { SiteFooterNewsletter } from './types';

export function NewsletterForm({ action, fieldLabel, placeholder, cta }: SiteFooterNewsletter) {
  const inFlight = useRef(false);
  const turnstile = useRef<TurnstileWidgetHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const form = event.currentTarget;
    /* Spaces taken out of the address before it is checked (F.3): a pasted address often carries one. */
    const email = form.elements.namedItem('email');
    if (email instanceof HTMLInputElement) email.value = email.value.replace(/\s+/g, '');
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    inFlight.current = true;
    setSubmitting(true);
    setMessage('');
    try {
      let token: string | undefined;
      try {
        token = await turnstile.current?.requestToken();
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : 'Verification failed. Please try again.',
        );
        return;
      }
      if (!token) {
        setMessage('Verification is unavailable. Please try again.');
        return;
      }
      data.set('turnstileToken', token);
      const response = await fetch(action, { method: 'POST', body: data });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          code?: string;
          error?: string;
        } | null;
        setMessage(
          result?.code === 'turnstile'
            ? result.error || 'Verification failed. Please try again.'
            : response.status === 400
              ? 'Enter a valid email address.'
              : 'We could not subscribe you. Please try again.',
        );
        return;
      }
      form.reset();
      setMessage('You’re subscribed.');
    } catch {
      setMessage('We could not subscribe you. Please try again.');
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form
      data-hs-do-not-collect="true"
      action={action}
      method="post"
      className={styles.newsletterForm}
      onSubmit={handleSubmit}
      aria-busy={submitting || undefined}
    >
      <Cluster rowGap="tight" colGap="tight" align="end">
        <label className={styles.fieldLabel}>
          <span className={styles.fieldLabelText}>{fieldLabel}</span>
          <Input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            placeholder={placeholder}
            required
            readOnly={submitting}
          />
        </label>
        <Button
          type="submit"
          emphasis="ghost"
          extendHitArea
          aria-disabled={submitting || undefined}
        >
          {cta.label}
        </Button>
      </Cluster>
      <TurnstileWidget ref={turnstile} />
      <p className={styles.body} role="status">
        {submitting ? 'Subscribing…' : message}
      </p>
    </form>
  );
}
