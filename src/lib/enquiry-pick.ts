/**
 * A link that preselects an answer in the page's enquiry form (4 Nov 2026, /careers: each open role's
 * title goes to the application with its chip already picked). The link is an ordinary in-page anchor
 * (`href="#apply"`), so it scrolls with no script; it also carries this attribute with the choice's
 * value, and EnquiryForm, where it has a role group, checks that chip when such a link is followed.
 * One name, read by the pattern that writes the link and the form that answers it, so neither imports
 * the other.
 */
export const ENQUIRY_ROLE_ATTRIBUTE = 'data-enquiry-role';

/** A choice's posted value from its label, as authored: "UX/UI Designer (Generalist)" → "ux-ui-designer-generalist". */
export function enquiryChoiceValue(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
