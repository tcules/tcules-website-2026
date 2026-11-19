import type { Metadata } from 'next';

import { Layout, Section, TurnstileWidget } from '@/components';

import { Specimen } from '../_specimen/Specimen';

export const metadata: Metadata = {
  title: 'TurnstileWidget | Design',
  robots: { index: false, follow: false },
};

/**
 * TurnstileWidget: Cloudflare's invisible check on a form. It draws nothing at rest: the script
 * loads on the visitor's first touch of the form, and a token is asked for on submit. The empty
 * band below is the expected rendering; without NEXT_PUBLIC_TURNSTILE_SITE_KEY it stays unrendered.
 */
export default function TurnstileWidgetSpecimen() {
  return (
    <Section surface="paper">
      <Layout rowGap="stack">
        <Specimen
          title="inside a form, at rest"
          note="Nothing visible until a submit asks for a token. Focus the form to load the script."
        >
          <form>
            <TurnstileWidget ref={null} />
          </form>
        </Specimen>
      </Layout>
    </Section>
  );
}
