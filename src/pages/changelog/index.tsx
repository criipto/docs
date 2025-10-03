import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Markdown from 'react-markdown';

import MdxLayout from '../../layouts/mdx';
import { H2, MdxComponents } from '../../components/MdxProvider';
import { isIndexPage } from '../../utils';

export default function Changelog(props: { location: Location }) {
  const data = useStaticQuery<{
    pages: {
      edges: {
        node: {
          id: string;
          frontmatter: {
            title: string;
            date: string;
          };
          fields: {
            slug: string;
          };
          body: string;
          internal: {
            contentFilePath: string;
          };
        };
      }[];
    };
  }>(graphql`
    query changelogPages {
      pages: allMdx(
        filter: { internal: { contentFilePath: { regex: "/(changelog)/" } } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            __typename
            id
            frontmatter {
              title
              date
            }
            internal {
              contentFilePath
            }
            body
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  const pages = data.pages.edges.map(edge => edge.node);
  const count = pages.length;

  return (
    <MdxLayout
      location={props.location}
      path="/changelog"
      pageContext={{
        frontmatter: {
          title: 'Changelog',
          description: 'Changelog for Cripto products',
        },
      }}
    >
      <div>
        {data.pages.edges
          .map(edge => edge.node)
          .filter(node => !isIndexPage(node))
          .map((node, index) => (
            <React.Fragment>
              <div key={node.id} className="mb-8">
                <Link to={`/${node.fields.slug}/`} className="no-underline">
                  <H2 className="m-0">{node.frontmatter.title}</H2>
                </Link>
                <em>
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'full',
                  }).format(new Date(node.frontmatter.date))}
                </em>

                <IncludedMarkdown source={node.body} />
              </div>
            </React.Fragment>
          ))}
      </div>
    </MdxLayout>
  );
}

function IncludedMarkdown(props: { source: string }) {
  const source = props.source
    .replace(/---([\S\s]+?)---/m, '')
    .replace(/^import (.+)$/gm, '')
    .replace(/^export (.+)$/gm, '');
  return (
    <Markdown
      source={source}
      renderers={{
        Code: MdxComponents.code,
        CodeBlock: MdxComponents.CodeBlock,
        Paragraph: MdxComponents.Paragraph,
        Heading: (props: any) => {
          if (props.level === '2') {
            return <MdxComponents.h2 {...props} />;
          }
          if (props.level === '3') {
            return <MdxComponents.h3 {...props} />;
          }
          return <h4 {...props}>{props.children}</h4>;
        },
        List: (props: any) => {
          if (props.type === 'Bullet') {
            return <MdxComponents.ol {...props} />;
          }
          return <MdxComponents.ul {...props} />;
        },
      }}
    />
  );
}
