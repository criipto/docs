import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { isIndexPage } from '../utils';

type QueryData = {
  pages: {
    edges: {
      node: {
        id: string;
        frontmatter: {
          title: string;
        };
        fields: {
          slug: string;
        };
        internal: {
          contentFilePath: string;
        };
      };
    }[];
  };
};

const TestUsersSetupLinks = () => {
  const data = useStaticQuery<QueryData>(graphql`
    query TestUsersSetupLinksQuery {
      pages: allMdx(
        filter: {
          frontmatter: {
            product: { eq: "verify" }
            category: { eq: "eIDs" }
          }
        }
        sort: { frontmatter: { sort: ASC } }
      ) {
        edges {
          node {
            __typename
            id
            frontmatter {
              title
            }
            fields {
              slug
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `);

  return (
    <ul>
      {data.pages.edges 
        .map(edge => edge.node)
        .filter(node => !isIndexPage(node))
        .filter(
          node =>
            node.frontmatter.title !== 'Dutch iDIN' &&
            node.frontmatter.title !== 'German Personalausweis' &&
            node.frontmatter.title !== 'FrejaID',
        )
        .map(node => (
          <li key={node.id}>
            <Link to={`/${node.fields.slug}/#test-users`}>
              {node.frontmatter.title}
            </Link>
            <br />
          </li>
        ))}
      <li>
        <Link to="/verify/e-ids/frejaid/#testing">
          FrejaID
        </Link>
      </li>
      <li>
        <Link to="/verify/e-ids/german-personalausweis/#testing">
          German Personalausweis
        </Link>
      </li>
    </ul>
  );
};

export default TestUsersSetupLinks;