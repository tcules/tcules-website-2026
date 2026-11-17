export type StrapiContactImage = {
  documentId?: string | null;
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  /** Strapi's generated derived widths, a JSON scalar; read only by sources/strapi/image.ts. */
  formats?: unknown;
  mime?: string | null;
};

export type StrapiContactLink = {
  id?: string | null;
  name?: string | null;
  href?: string | null;
  description?: string | null;
  isExternal?: boolean | null;
  icon?: StrapiContactImage | null;
};

export type StrapiContactSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug?: string | null;
  canonicalURL?: string | null;
  robot?: string | null;
  focusString?: string | null;
  graphCode?: unknown;
};

export type StrapiContactPage = {
  documentId?: string | null;
  heading?: string | null;
  description?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
  cards?: Array<{
    id?: string | null;
    heading?: string | null;
    icon?: StrapiContactImage | null;
    link?: StrapiContactLink | null;
  }> | null;
  socialMedia?: StrapiContactLink[] | null;
  seo?: StrapiContactSeo | null;
};

export type StrapiContactResponse = {
  data?: { contactUs?: StrapiContactPage | null } | null;
  errors?: Array<{ message?: string | null }> | null;
};
