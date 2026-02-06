// const pagePath = `src/pages`
const pageQuery = `{
  pages: allMdx {
    edges {
      node {
        id
        internal {
          contentDigest
        }
        frontmatter {
          product
          title
          category
          subtitle
        }
        fields {
          slug
        }
        excerpt(pruneLength: 5000)
        tableOfContents(maxDepth: 3)
      }
    }
  }
}`;
function pageToAlgoliaRecord({ node: { id, internal, frontmatter, fields, ...rest } }) {
  return {
    objectID: id,
    internal,
    ...frontmatter,
    ...fields,
    ...rest,
    _tags: (frontmatter?.product ? [frontmatter.product] : []).concat(
      frontmatter?.category ? [frontmatter.category] : [],
    ),
  };
}
const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => data.pages.edges.map(pageToAlgoliaRecord),
    indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || 'test',
    settings: { attributesToSnippet: [`excerpt:20`] },
  },
];
export default queries;
