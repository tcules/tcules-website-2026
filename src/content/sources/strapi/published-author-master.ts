import { cache } from 'react';

import { authorPath, ROUTES } from '@/lib/routes';
import type {
  AuthorMasterPage,
  AuthorMasterSection,
} from '@/templates/CorpusPage/published-author-master-model';

import { mapBand, mapHero, rows, text } from './home';
import type { CmsHero, CmsHomeSection, Entries } from './home-types';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { PUBLISHED_CTA, PUBLISHED_FIELDS, PUBLISHED_HERO } from './published-page-fields';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';

export const PUBLISHED_AUTHOR_MASTER_QUERY = `
query PublishedAuthorMaster {
  authorMaster(status: PUBLISHED) {
    documentId routePath
    ${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedAuthorListing {
        id accessibleLabel sortMode anchorId
        authors {
          documentId name slug designation description linkedInProfile
          profilePicture { url alternativeText width height formats }
        }
      }
      ${PUBLISHED_CTA}
    }
  }
}
${PUBLISHED_FIELDS}
`;

type Person = {
  documentId: string;
  name?: string | null;
  slug?: string | null;
  designation?: string | null;
  description?: string | null;
  linkedInProfile?: string | null;
  profilePicture?: StrapiUploadFile | null;
};
type Listing = {
  __typename: 'ComponentSharedAuthorListing';
  id: string;
  accessibleLabel?: string | null;
  sortMode?: 'surname' | 'manual' | null;
  anchorId?: string | null;
  authors: Entries<Person>;
};
type CmsPage = {
  routePath?: string | null;
  hero?: CmsHero | null;
  content: Entries<Listing | CmsHomeSection>;
};
const warn = (message: string) => console.warn(`New CMS ${ROUTES.authors}: ${message}`);
const surname = (name: string) => name.trim().split(/\s+/).at(-1) ?? name;

export function mapAuthorMaster(page: CmsPage | null | undefined): AuthorMasterPage | null {
  if (!page) return null;
  if (page.routePath !== ROUTES.authors)
    throw new Error(
      `New CMS ${ROUTES.authors}: published entry reports route ${page.routePath}`,
    );
  const hero = mapHero(page.hero);
  if (!hero) throw new Error(`New CMS ${ROUTES.authors}: published entry has no hero title`);
  const sections: AuthorMasterSection[] = [];
  for (const section of rows(page.content)) {
    if (section.__typename === 'ComponentSharedAuthorListing') {
      const seen = new Set<string>();
      const people = rows(section.authors).flatMap((person) => {
        const name = text(person.name);
        const slug = text(person.slug);
        if (!name || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          warn(`Author ${person.documentId} has no name or a valid slug; not listed`);
          return [];
        }
        if (seen.has(slug)) {
          warn(`listing ${section.id} relates Author ${slug} twice; listed once`);
          return [];
        }
        seen.add(slug);
        const firstName = name.split(/\s+/)[0];
        const linkedin = text(person.linkedInProfile);
        if (linkedin && !/^https:\/\/([a-z]+\.)?linkedin\.com\//i.test(linkedin))
          warn(`Author ${slug} has a LinkedIn profile that is not a LinkedIn URL; not linked`);
        return [
          {
            slug,
            name,
            role: text(person.designation),
            bio: text(person.description),
            portrait: mapUploadImage(person.profilePicture, publicGraphqlUrl(), {
              fallbackAlt: name,
            }),
            link: { label: `More from ${firstName}`, href: authorPath(slug) },
            linkedin:
              linkedin && /^https:\/\/([a-z]+\.)?linkedin\.com\//i.test(linkedin)
                ? { label: 'LinkedIn', href: linkedin }
                : undefined,
          },
        ];
      });
      if (section.sortMode !== 'manual')
        people.sort(
          (a, b) =>
            surname(a.name).localeCompare(surname(b.name)) || a.name.localeCompare(b.name),
        );
      sections.push({
        type: 'authors',
        key: section.id,
        id: text(section.anchorId),
        label: text(section.accessibleLabel) ?? '',
        people,
      });
    } else if (section.__typename === 'ComponentSharedCta') {
      const mapped = mapBand(section, ROUTES.authors);
      if (mapped?.type === 'cta') sections.push(mapped);
    } else {
      warn(`${section.__typename} has no place on the authors index; not shown`);
    }
  }
  return { hero, sections };
}

export const getPublishedAuthorMaster = cache(async () => {
  const data = await publicGraphql<{ authorMaster: CmsPage | null }>(
    PUBLISHED_AUTHOR_MASTER_QUERY,
    'PublishedAuthorMaster',
  );
  return mapAuthorMaster(data.authorMaster);
});
