// @ts-check
// having this file as .ts causes major issues with ESM

import { config as dotenv } from 'dotenv';
import rehypeSlug from 'rehype-slug';
import algoliaQueries from './src/utils/algolia-queries.mjs';
import { default as netlifyDefault } from 'gatsby-adapter-netlify';
dotenv();

/**
 * @type any
 */
const netlify = netlifyDefault;
/**
 * @type {import('gatsby').AdapterInit}
 */
const adapter = netlify.default;

/**
 * @type {import('gatsby').GatsbyConfig}
 */
const config = {
  siteMetadata: {
    siteUrl: 'https://docs.idura.app',
    title: 'Idura Documentation for Verify and Signatures',
  },
  adapter: adapter({
    excludeDatastoreFromEngineFunction: false,
    imageCDN: false,
  }),
  headers: [
    {
      source: `*`,
      headers: [
        {
          key: `x-xss-protection`,
          value: `1; mode=block`,
        },
        {
          key: `x-content-type-options`,
          value: `nosniff`,
        },
        {
          key: `referrer-policy`,
          value: `same-origin`,
        },
        {
          key: `Content-Security-Policy`,
          value: `frame-ancestors 'self' https://dashboard.criipto.com https://dashboard-test.criipto.com https://deploy-preview-*.dashboard-test.criipto.com https://dashboard.idura.app https://dashboard.int-idura.app https://deploy-preview-*.dashboard.int-idura.app http://localhost:5001`,
        },
      ],
    },
    {
      source: '/changelog.json',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
      ],
    },
  ],
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-sitemap',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Idura Documentation',
        short_name: 'Idura Docs',
        start_url: '/',
        background_color: '#204c82',
        theme_color: '#204c82',
        display: 'browser',
        icon: 'src/images/idura-brandmark.svg',
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 768,
              linkImagesToOriginal: false,
            },
          },
        ],
        mdxOptions: {
          rehypePlugins: [rehypeSlug],
        },
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
        ignore: [`**/*\.graphql\.tsx`],
      },
      __key: 'pages',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'snippets',
        path: './src/snippets/',
      },
      __key: 'snippets',
    },
    {
      resolve: `gatsby-plugin-json-output`,
      options: {
        siteUrl: 'https://docs.idura.app/changelog/',
        graphQLQuery: `{
  allMdx(
    filter: {internal: {contentFilePath: {regex: "/(changelog)/"}}}
    sort: {frontmatter: {date: DESC}}
  ) {
    edges {
      node {
        excerpt(pruneLength: 5000)
        frontmatter {
          title
          date
        }
        fields {
          slug
        }
      }
    }
  }
}`,
        serialize: results =>
          results.data.allMdx.edges.map(({ node }) => ({
            path: node.fields.slug, // MUST contain a path
            title: node.frontmatter.title,
            date: node.frontmatter.date,
            excerpt: node.excerpt,
          })),
        serializeFeed: results =>
          results.data.allMdx.edges.map(({ node }) => ({
            id: node.fields.slug,
            url: 'https://docs.criipto.com/' + node.fields.slug,
            title: node.frontmatter.title,
            date: node.frontmatter.date,
            excerpt: node.excerpt,
          })),
        feedFilename: 'changelog',
        nodesPerFeedFile: 1000,
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, pages } }) => {
              return pages.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.title,
                  date: edge.node.frontmatter.date,
                  url: `${site.siteMetadata.siteUrl}/${edge.node.fields.slug}`,
                  guid: edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.body }],
                });
              });
            },
            query: `
             {
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
            `,
            output: '/changelog.xml',
            title: 'Idura changelog',
          },
        ],
      },
    },
  ]
    .concat(
      process.env.GATSBY_ALGOLIA_APP_ID
        ? [
            {
              resolve: `gatsby-plugin-algolia`,
              /**
               * @type any
               */
              options: {
                appId: process.env.GATSBY_ALGOLIA_APP_ID,
                apiKey: process.env.ALGOLIA_ADMIN_KEY,
                queries: algoliaQueries,
              },
            },
          ]
        : [],
    )
    .concat(
      process.env.SENTRY_DSN
        ? [
            {
              resolve: '@sentry/gatsby',
              /**
               * @type any
               */
              options: {
                dsn: process.env.SENTRY_DSN,
                sampleRate: 0.7,
              },
            },
          ]
        : [],
    )
    .concat(['static-redirects']),
};

export default config;
