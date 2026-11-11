import { cache } from 'react';

import type { SiteIdentity } from '../../types';
import { text } from './home';
import { absoluteAssetUrl } from './image';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';

const SITE_IDENTITY_QUERY = `
  query PublishedSiteIdentity {
    seoSettings(status: PUBLISHED) {
      siteName
      siteURL
      language
      organization {
        name legalName url description email telephone
        logo { url width height }
        sameAs { url }
        address { streetAddress addressLocality addressRegion postalCode addressCountry }
      }
    }
  }
`;

type Text = string | null | undefined;
type Settings = {
  siteName: Text;
  siteURL: Text;
  language: Text;
  organization: {
    name: Text;
    legalName: Text;
    url: Text;
    description: Text;
    email: Text;
    telephone: Text;
    logo: { url: Text; width: number | null; height: number | null } | null;
    sameAs: { url: Text }[] | null;
    address: {
      streetAddress: Text;
      addressLocality: Text;
      addressRegion: Text;
      postalCode: Text;
      addressCountry: Text;
    } | null;
  } | null;
};

/**
 * Who the site is, from the SEO Settings single type: the one place the organisation's facts are
 * kept. The root layout turns it into the site-wide Organization and WebSite nodes; no page entry
 * needs to repeat them. Null when the CMS cannot answer, so a page still renders.
 */
export const getPublishedSiteIdentity = cache(async (): Promise<SiteIdentity | null> => {
  let settings: Settings | null;
  try {
    ({ seoSettings: settings } = await publicGraphql<{ seoSettings: Settings | null }>(
      SITE_IDENTITY_QUERY,
      'PublishedSiteIdentity',
    ));
  } catch (error) {
    console.error(error);
    return null;
  }
  const siteUrl = text(settings?.siteURL);
  const org = settings?.organization;
  const name = text(org?.name) ?? text(settings?.siteName);
  if (!siteUrl || !name) return null;

  const address = org?.address;
  const addressParts = {
    streetAddress: text(address?.streetAddress),
    addressLocality: text(address?.addressLocality),
    addressRegion: text(address?.addressRegion),
    postalCode: text(address?.postalCode),
    addressCountry: text(address?.addressCountry),
  };
  const logoUrl = absoluteAssetUrl(org?.logo?.url, publicGraphqlUrl());

  return {
    siteName: text(settings?.siteName) ?? name,
    siteUrl,
    language: text(settings?.language),
    organization: {
      name,
      legalName: text(org?.legalName),
      url: text(org?.url) ?? siteUrl,
      description: text(org?.description),
      email: text(org?.email),
      telephone: text(org?.telephone),
      logo: logoUrl
        ? {
            url: logoUrl,
            width: org?.logo?.width ?? undefined,
            height: org?.logo?.height ?? undefined,
          }
        : undefined,
      sameAs: (org?.sameAs ?? []).flatMap((link) => text(link.url) ?? []),
      address: Object.values(addressParts).some(Boolean) ? addressParts : undefined,
    },
  };
});
