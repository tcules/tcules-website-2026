export type StrapiEventFile = {
  documentId?: string | null;
  url?: string | null;
  alternativeText?: string | null;
  /** The upload's own caption: the visible words under a body image. Never the alt. */
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  /** Strapi's generated derived widths, a JSON scalar; read only by sources/strapi/image.ts. */
  formats?: unknown;
  mime?: string | null;
  name?: string | null;
};

export type StrapiEventLink = {
  id?: string | null;
  name?: string | null;
  href?: string | null;
  description?: string | null;
  isExternal?: boolean | null;
  icon?: Pick<StrapiEventFile, 'documentId' | 'url' | 'alternativeText'> | null;
};

export type StrapiEventBlock = {
  __typename?: string | null;
  id?: string | null;
  blogContent?: string | null;
  title?: string | null;
  videoDescription?: string | null;
  autoplay?: boolean | null;
  loop?: boolean | null;
  thumbnail?: StrapiEventFile | null;
  videoFile?: StrapiEventFile | null;
  heading?: string | null;
  shadowDescription?: string | null;
  isShadowVisible?: boolean | null;
  isBackgroundAvailable?: boolean | null;
  link?: StrapiEventLink | null;
  tdlrDescription?: string | null;
  styles?: string | null;
  color?: string | null;
  thickness?: number | null;
  marginTop?: number | null;
  marginBottom?: number | null;
  layout?: string | null;
  imageSection?: StrapiEventFile[] | null;
  code?: string | null;
  message?: string | null;
};

export type StrapiEventSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug?: string | null;
  canonicalURL?: string | null;
  robot?: string | null;
  focusString?: string | null;
  graphCode?: unknown;
};

export type StrapiEvent = {
  documentId?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  createdAt?: string | null;
  publishedAt?: string | null;
  thumbnail?: StrapiEventFile | null;
  featureImage?: StrapiEventFile | null;
  eventWhereAbout?: Array<{
    id?: string | null;
    descOne?: string | null;
    descTwo?: string | null;
  }> | null;
  tags?: Array<{ documentId?: string | null; name?: string | null }> | null;
  categories?: Array<{
    documentId?: string | null;
    name?: string | null;
    slug?: string | null;
  }> | null;
  seo?: StrapiEventSeo | null;
  mainSection?: StrapiEventBlock[] | null;
};

export type StrapiEventResource = {
  documentId?: string | null;
  title?: string | null;
  slug?: string | null;
  createdAt?: string | null;
  publishedAt?: string | null;
  /** The SEO meta description: an article's standfirst, as its own page uses it. */
  seo?: { metaDescription?: string | null } | null;
  /** Only the body's iframe blocks: one of them carries the authored date line. */
  mainSection?: Array<{
    __typename?: string | null;
    title?: string | null;
    description?: string | null;
    url?: string | null;
    embedCode?: string | null;
  }> | null;
  thumbnail?: StrapiEventFile | null;
};

export type StrapiEventResponse = {
  data?: {
    eventInternal?: StrapiEvent[] | null;
    exploreOtherResources?: StrapiEventResource[] | null;
  } | null;
  errors?: Array<{ message?: string | null }> | null;
};
