export type StrapiPodcastFile = {
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

export type StrapiPodcastLink = {
  name?: string | null;
  href?: string | null;
  description?: string | null;
  isExternal?: boolean | null;
  icon?: Pick<StrapiPodcastFile, 'url' | 'alternativeText'> | null;
};

export type StrapiPodcastBlock = {
  __typename?: string | null;
  id?: string | null;
  heading?: string | null;
  shadowDescription?: string | null;
  isShadowVisible?: boolean | null;
  isBackgroundAvailable?: boolean | null;
  link?: StrapiPodcastLink | null;
  title?: string | null;
  videoDescription?: string | null;
  autoplay?: boolean | null;
  loop?: boolean | null;
  thumbnail?: StrapiPodcastFile | null;
  videoFile?: StrapiPodcastFile | null;
  tdlrDescription?: string | null;
  styles?: string | null;
  color?: string | null;
  thickness?: number | null;
  marginTop?: number | null;
  marginBottom?: number | null;
  layout?: string | null;
  imageSection?: StrapiPodcastFile[] | null;
  blogContent?: string | null;
  code?: string | null;
  message?: string | null;
};

export type StrapiPodcastSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug?: string | null;
  canonicalURL?: string | null;
  robot?: string | null;
  focusString?: string | null;
  graphCode?: unknown;
};

export type StrapiPodcast = {
  documentId?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  createdAt?: string | null;
  publishedAt?: string | null;
  thumbnail?: StrapiPodcastFile | null;
  tags?: Array<{ documentId?: string | null; name?: string | null }> | null;
  categories?: Array<{
    documentId?: string | null;
    name?: string | null;
    slug?: string | null;
  }> | null;
  seo?: StrapiPodcastSeo | null;
  mainSection?: StrapiPodcastBlock[] | null;
};

export type StrapiPodcastResource = {
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
  thumbnail?: StrapiPodcastFile | null;
};

export type StrapiPodcastResponse = {
  data?: {
    podcastInternal?: StrapiPodcast[] | null;
    exploreOtherResources?: StrapiPodcastResource[] | null;
  } | null;
  errors?: Array<{ message?: string | null }> | null;
};
