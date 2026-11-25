'use client';

import { useState } from 'react';

import { Icon, Input, Layout } from '@/components';
import type { InputOption } from '@/components';

/* Placeholder choices for the select specimens. */
const SHORT: readonly InputOption[] = [
  { value: 'discuss-project', label: 'Discuss a project' },
  { value: 'start-pilot', label: 'Start with a pilot' },
  { value: 'scope-project', label: 'Scope a project' },
  { value: 'design-team', label: 'Embedded design team' },
  { value: 'ux-audit', label: 'Discuss a UX audit' },
  { value: 'prototype-review', label: 'Discuss a paid prototype review' },
  { value: 'intro-call', label: 'Request an introductory call' },
];
const LONG: readonly InputOption[] = [
  ...SHORT,
  { value: 'senior-designer', label: 'Senior Product Designer' },
  { value: 'design-engineer', label: 'Design Engineer' },
  { value: 'researcher', label: 'Product Researcher' },
  { value: 'content-designer', label: 'Content Designer' },
  { value: 'general', label: 'General application, for a role that is not listed here yet' },
];

/**
 * One labelled select, stateful so it can be tried: the route-local harness for `Input as="select"`
 * (route scaffolding, like Specimen; nothing outside /design imports it).
 */
export function SelectSpecimen({
  label,
  appearance,
  long = false,
  empty = false,
  invalid = false,
  disabled = false,
}: {
  label: string;
  appearance?: 'box' | 'fill' | 'line';
  long?: boolean;
  empty?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const options = long ? LONG : SHORT;
  const [value, setValue] = useState<string | undefined>(empty ? undefined : options[1]?.value);
  const id = `select-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <Layout rowGap="tight">
      <label htmlFor={id}>{label}</label>
      <Input
        as="select"
        id={id}
        appearance={appearance}
        options={options}
        value={value}
        onValueChange={setValue}
        placeholder="Choose one"
        invalid={invalid}
        disabled={disabled}
        indicator={<Icon name="alt-arrow-down" />}
        check={<Icon name="chrome-check" />}
      />
    </Layout>
  );
}
