import { useStaticQuery, graphql } from 'gatsby';

export default function useAllPages() {
  return useStaticQuery<{
    pages: {
      nodes: [
        {
          fields: {
            slug: string;
          };
          tableOfContents: {
            items: {
              title: string;
              url: string;
            }[];
          };
        },
      ];
    };
  }>(graphql`
    query usePagesQuery {
      pages: allMdx {
        nodes {
          id
          frontmatter {
            title
          }
          fields {
            slug
          }
          tableOfContents
        }
      }
    }
  `);
}
