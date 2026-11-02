import { cache } from 'react';
import type { AuthorPage, AuthorsContentSource } from '../../types';
import { personSlug } from '../people';
import { mapUploadImage } from './image';
import { listPublishedResources, resourceAuthors, resourceCard } from './resources';
import { productionCmsUrl } from './production-cms';

/** Native employee profiles and credits from every published resource, including co-authors. */
const loadAuthors = cache(async (): Promise<AuthorPage[]> => {
  const records = await listPublishedResources();
  const people = new Map<string, AuthorPage>();
  for (const record of records) {
    const piece = resourceCard(record);
    for (const person of resourceAuthors(record)) {
      const slug = personSlug(person.name);
      if (!slug) continue;
      let author = people.get(person.documentId);
      if (!author) {
        const image = mapUploadImage(person.profileImage, productionCmsUrl(), {
          fallbackAlt: person.name,
          requireImageMime: true,
        });
        const linkedin = person.linkedInProfile?.trim();
        author = {
          slug,
          name: person.name,
          role: person.designation || undefined,
          bio: person.largeDescription || person.smallDescription || undefined,
          ...(image ? { image } : {}),
          ...(/^https:\/\/([a-z]+\.)?linkedin\.com\//u.test(linkedin || '')
            ? { linkedin }
            : {}),
          pieceCount: 0,
          pieces: [],
          topics: [],
        };
        people.set(person.documentId, author);
      }
      author.pieces.push(piece);
      author.pieceCount++;
    }
  }
  for (const author of people.values()) {
    const counts = new Map<string, number>();
    for (const piece of author.pieces)
      for (const topic of piece.tags) counts.set(topic.name, (counts.get(topic.name) || 0) + 1);
    author.topics = [...counts].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }
  return [...people.values()];
});

export const resourceAuthorsSource: AuthorsContentSource = {
  async listAuthors() {
    return (await loadAuthors()).map(({ pieces, topics, ...author }) => {
      void pieces;
      void topics;
      return author;
    });
  },
  async getAuthorPage(slug) {
    return (await loadAuthors()).find((person) => person.slug === slug) || null;
  },
};
