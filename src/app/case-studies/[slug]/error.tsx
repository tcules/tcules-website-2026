'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

import { Button, Layout, Section } from '@/components';

export default function CaseStudyError({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <Section>
      <Layout rowGap="block" justifyItems="start">
        <h1>Case study temporarily unavailable</h1>
        <Button
          onClick={() =>
            startTransition(() => {
              router.refresh();
              reset();
            })
          }
        >
          Try again
        </Button>
      </Layout>
    </Section>
  );
}
