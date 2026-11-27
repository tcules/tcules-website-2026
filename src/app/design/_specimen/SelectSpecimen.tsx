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

/* Placeholder countries for the searchable specimen: the shape the phone field's list takes
   (lib/phone), a short list so the specimen needs no library. */
const COUNTRIES: readonly InputOption[] = [
  ['AU', 'Australia', '61'],
  ['CA', 'Canada', '1'],
  ['DE', 'Germany', '49'],
  ['IN', 'India', '91'],
  ['IE', 'Ireland', '353'],
  ['NL', 'Netherlands', '31'],
  ['SG', 'Singapore', '65'],
  ['AE', 'United Arab Emirates', '971'],
  ['GB', 'United Kingdom', '44'],
  ['US', 'United States', '1'],
].map(([value, name, code]) => ({
  value: value!,
  label: `${name} +${code}`,
  short: `+${code}`,
  keywords: [`+${code}`, code!, value!],
}));

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
  searchable = false,
}: {
  label: string;
  appearance?: 'box' | 'fill' | 'line';
  long?: boolean;
  /** The country-code list: a filter field at the top, the code alone in the closed field. */
  searchable?: boolean;
  empty?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const options = searchable ? COUNTRIES : long ? LONG : SHORT;
  const [value, setValue] = useState<string | undefined>(
    empty ? undefined : searchable ? 'GB' : options[1]?.value,
  );
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
        placeholder={searchable ? 'Code' : 'Choose one'}
        search={
          searchable
            ? { label: 'Find your country', placeholder: 'Country or code', empty: 'No country matches' }
            : undefined
        }
        invalid={invalid}
        disabled={disabled}
        indicator={<Icon name="alt-arrow-down" />}
        check={<Icon name="chrome-check" />}
      />
    </Layout>
  );
}
