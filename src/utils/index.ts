import { NavigationQuery } from '../../graphql-gatsby-types';

export function isIndexPage(node: { internal?: { contentFilePath?: string | null | undefined } }) {
  return (
    node.internal?.contentFilePath?.endsWith('index.mdx') ||
    node.internal?.contentFilePath?.endsWith('index.tsx')
  );
}

type Page =
  | NavigationQuery['signaturesPages']['edges'][0]['node']
  | NavigationQuery['verifyPages']['edges'][0]['node'];

export const findIndexPage = (category: string, pages: Page[]) => {
  return pages.find(node => isIndexPage(node) && node.frontmatter?.category === category);
};

export function slugToPath(slug: string) {
  if (slug.endsWith('/')) {
    return `/${slug}`;
  }
  return `/${slug}/`;
}
