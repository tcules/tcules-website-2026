import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BrandMark, Button, Media } from '@/components';
import { getAuthorDetail } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { authorPath, ENDPOINTS, ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import { Breadcrumbs, EnquiryForm, PageHero, type BreadcrumbItem } from '@/patterns';
import { AuthorPieces, ENQUIRY_SKETCH_TO_SHIPPED, ListingClose } from '@/templates';

type Author = NonNullable<Awaited<ReturnType<typeof getAuthorDetail>>>;
type AuthorPageProps = { params: Promise<{ slug: string }> };
const NEW_TAB = { target: '_blank', rel: 'noopener' } as const;
const TOPIC_LABELS = 4;
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;
const piecesHeading = (author: Author) =>
  `${author.pieceCount} ${author.pieceCount === 1 ? 'piece' : 'pieces'} by ${firstName(author.name)}`;

function breadcrumbs(author: Author): BreadcrumbItem[] {
  return [
    { label: 'Home', href: ROUTES.home },
    { label: 'Insights', href: ROUTES.insights },
    { label: 'Authors', href: ROUTES.authors },
    { label: author.name, href: authorPath(author.slug) },
  ];
}

/** Retain the author template's existing island close and form behavior. The seam omits
 * an incomplete CMS form; it never fills its authored copy from the previous CMS or the repo. */
function AuthorClose({ author }: { author: Author }) {
  const closing = author.closing;
  if (!closing?.heading) return null;
  if (closing.variant === 'form' && closing.form) {
    const form = closing.form;
    return (
      <ListingClose
        closing={{
          id: closing.id,
          heading: closing.heading,
          body: closing.lead,
          eyebrow: closing.eyebrow,
          island: {
            surface: closing.island ?? 'blue',
            art: <Media image={closing.image ?? ENQUIRY_SKETCH_TO_SHIPPED} sizes="300px" />,
          },
          form: (
            <EnquiryForm
              variant="enquiry"
              urlLabel={form.urlLabel}
              action={ENDPOINTS.enquiry}
              fieldScale="md"
              submit="inline"
              submitLabel={form.submitLabel}
              caption={form.caption ?? null}
              success={form.success}
              nextSteps={form.nextSteps}
              scheduleHref={form.scheduleHref}
              dress={{ kind: 'card', reply: form.reply ?? form.caption ?? '' }}
              context={{
                originRoute: author.path,
                placement: closing.id ?? 'author-page',
                family: 'insights',
                serviceOrAudit: '',
                referrer: '',
                campaign: '',
              }}
            />
          ),
        }}
      />
    );
  }
  return closing.variant === 'button' && closing.actions[0] ? (
    <ListingClose
      closing={{
        id: closing.id,
        heading: closing.heading,
        body: closing.lead,
        eyebrow: closing.eyebrow,
        action: closing.actions[0],
      }}
    />
  ) : null;
}

export const revalidate = 300;

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const author = await getAuthorDetail(slug);
    return (
      author?.seo.metadata ?? {
        title: 'Author not found | Tcules',
        description: null,
        robots: { index: false, follow: false },
      }
    );
  } catch {
    return {
      title: 'Author temporarily unavailable | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  }
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorDetail(slug);
  if (!author) notFound();
  const body = [author.role ?? '', author.bio ?? ''].filter((line) => line.trim().length > 0);
  const crumbs = breadcrumbs(author);
  const linkedin = author.linkedin ? (
    <Button
      as="a"
      href={author.linkedin}
      {...NEW_TAB}
      emphasis="link"
      tone="primary"
      iconLeft={<BrandMark name="linkedin" />}
      aria-label={`${author.name} on LinkedIn (opens in a new tab)`}
    >
      LinkedIn
    </Button>
  ) : undefined;
  return (
    <>
      {author.seo.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(author.seo.structuredData) }}
        />
      ) : null}
      <PageHero
        data-fold-hero=""
        trail={heroTrail(crumbs, author.name, (trail) => (
          <Breadcrumbs {...trail} />
        ))}
        arrangement="profile"
        portrait={{ name: author.name, ...(author.image ? { image: author.image } : {}) }}
        title={author.name}
        titleSize="h1"
        body={body.length ? (body as [string, ...string[]]) : undefined}
        labels={author.topics.slice(0, TOPIC_LABELS)}
        leadAside={body.length ? linkedin : undefined}
        texture
        surface="paper"
      >
        {body.length ? null : linkedin}
      </PageHero>
      <AuthorPieces heading={piecesHeading(author)} items={author.pieces} />
      <AuthorClose author={author} />
    </>
  );
}
