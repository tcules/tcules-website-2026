export type StrapiBlogFile = {
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
};

export type StrapiBlogLink = {
  id?: string | null;
  name?: string | null;
  href?: string | null;
  description?: string | null;
  isExternal?: boolean | null;
};

export type StrapiBlogSeo = {
  id?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug?: string | null;
  canonicalURL?: string | null;
  robot?: string | null;
  structuredData?: unknown;
  codeJson?: unknown;
  focusString?: string | null;
  graphCode?: unknown;
};

export type StrapiBlogBlock = {
  __typename?: string | null;
  id?: string | null;
  heading?: string | null;
  tdlrDescription?: string | null;
  title?: string | null;
  styles?: string | null;
  color?: string | null;
  thickness?: number | null;
  marginTop?: number | null;
  marginBottom?: number | null;
  blogContent?: string | null;
  body?: unknown;
  layout?: string | null;
  imageSection?: StrapiBlogFile[] | null;
  youtubeUrl?: string | null;
  description?: string | null;
  autoplay?: boolean | null;
  loop?: boolean | null;
  thumbnail?: StrapiBlogFile | null;
  videoFile?: StrapiBlogFile | null;
  embedCode?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  codeSnippet?: string | null;
};

export type StrapiBlog = {
  documentId?: string | null;
  title?: string | null;
  slug?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  thumbnail?: StrapiBlogFile | null;
  featureImage?: StrapiBlogFile[] | null;
  tags?: Array<{ documentId?: string | null; name?: string | null }> | null;
  categories?: Array<{
    documentId?: string | null;
    name?: string | null;
    slug?: string | null;
  }> | null;
  blogProfileSection?: Array<{
    id?: string | null;
    name?: string | null;
    designation?: string | null;
    profilePicture?: StrapiBlogFile[] | null;
  }> | null;
  mainSection?: StrapiBlogBlock[] | null;
  ctoSection?: {
    id?: string | null;
    heading?: string | null;
    description?: string | null;
    link?: StrapiBlogLink | null;
  } | null;
  seo?: StrapiBlogSeo | null;
};

export type StrapiBlogResource = {
  documentId?: string | null;
  title?: string | null;
  slug?: string | null;
  publishedAt?: string | null;
  /** Only the body's iframe blocks: one of them carries the authored date line. */
  mainSection?: StrapiBlogBlock[] | null;
  /** The SEO meta description: an article's standfirst, as its own page uses it. */
  seo?: { metaDescription?: string | null } | null;
  thumbnail?: StrapiBlogFile | null;
  featureImage?: StrapiBlogFile[] | null;
  tags?: Array<{ documentId?: string | null; name?: string | null }> | null;
  categories?: Array<{
    documentId?: string | null;
    name?: string | null;
    slug?: string | null;
  }> | null;
};

export type StrapiBlogResponse = {
  data?: {
    currentBlog?: StrapiBlog[] | null;
    exploreOtherResources?: StrapiBlogResource[] | null;
  } | null;
  errors?: Array<{ message?: string | null }> | null;
};
