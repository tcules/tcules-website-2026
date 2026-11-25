import { CtaSection, EnquiryForm } from '@/patterns';
import { ENDPOINTS } from '@/lib/routes';

/**
 * The close every legal page ends on (docs/specs/EnquiryForms.md § 3): the privacy request form on
 * the island, with no drawing (2026-10-29 forms only on the island), and the card's three fields:
 * name, email and what the reader needs. It asks for no link, and it has no dropdown until the CMS
 * lists a second privacy intent. Its submissions never reach HubSpot.
 *
 * The copy is the CMS's Privacy Request Form, edited once and shown on all three pages.
 */
export type PrivacyCloseProps = {
  close: {
    heading: string;
    lead?: string;
    island: 'ink' | 'blue';
    submitLabel: string;
    success: { heading: string; body: string };
    defaultIntent?: string;
  };
  /** The legal page's route: where the request was sent from. */
  route: string;
};

export function PrivacyClose({ close, route }: PrivacyCloseProps) {
  return (
    <CtaSection
      id="privacy-request"
      heading={close.heading}
      body={close.lead ? [close.lead] : undefined}
      island={close.island}
      islandArrangement="beside"
      islandTexture="frame"
      form={
        <EnquiryForm
          variant="enquiry"
          formType="privacy"
          label="Send a privacy request"
          action={ENDPOINTS.enquiry}
          workLabel="What do you need help with?"
          asksUrl={false}
          submitLabel={close.submitLabel}
          success={close.success}
          defaultIntent={close.defaultIntent}
          fieldScale="md"
          submit="inline"
          dress={{ kind: 'card', name: true }}
          context={{
            originRoute: route,
            placement: 'privacy-close',
            family: 'legal',
            serviceOrAudit: '',
            referrer: '',
            campaign: '',
          }}
        />
      }
    />
  );
}
