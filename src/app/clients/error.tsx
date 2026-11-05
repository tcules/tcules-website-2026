'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

import { Button, Layout, Section } from '@/components';

export default function ClientsError({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <Section>
      <Layout rowGap="block" justifyItems="start">
        <h1>Clients temporarily unavailable</h1>
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
