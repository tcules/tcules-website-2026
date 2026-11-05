'use client';

import { type FormEvent, useRef, useState } from 'react';

import { Button, Cluster, Input } from '@/components';

import styles from './SiteFooter.module.css';
import type { SiteFooterNewsletter } from './types';

export function NewsletterForm({ action, fieldLabel, placeholder, cta }: SiteFooterNewsletter) {
  const inFlight = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    inFlight.current = true;
    setSubmitting(true);
    setMessage('');
    try {
      const response = await fetch(action, { method: 'POST', body: data });
      if (!response.ok) {
        setMessage(
          response.status === 400
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
      <p className={styles.body} role="status">
        {submitting ? 'Subscribing…' : message}
      </p>
    </form>
  );
}
