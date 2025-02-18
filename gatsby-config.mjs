// @ts-check
// having this file as .ts causes major issues with ESM

import {config as dotenv} from 'dotenv';
import rehypeSlug from 'rehype-slug';
import algoliaQueries from './src/utils/algolia-queries.mjs';
import {default as netlifyDefault} from 'gatsby-adapter-netlify';
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
    siteUrl: "https://docs.criipto.com",
    title: "Criipto Documentation for Verify and Signatures",
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
          key: `Content-Security-Policy:`,
          value: `frame-ancestors 'self' https://dashboard.criipto.com https://dashboard-test.criipto.com https://deploy-preview-*.dashboard-test.criipto.com http://localhost:5001`,
        },
      ],
    },
  ],
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-sitemap",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Criipto Documentation",
        short_name: "Criipto Docs",
        start_url: "/",
        background_color: "#204c82",
        theme_color: "#204c82",
        display: "browser",
        icon: "src/images/icon.png"
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
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
          rehypePlugins: [
            rehypeSlug
          ]
        }
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
        ignore: [`**/*\.graphql\.tsx`],
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "snippets",
        path: "./src/snippets/"
      },
      __key: "snippets",
    },
    {
      resolve: `gatsby-plugin-json-output`,
      options: {
        siteUrl: 'https://docs.criipto.com/changelog/',
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
        serialize: results => results.data.allMdx.edges.map(({ node }) => ({
          path: node.fields.slug, // MUST contain a path
          title: node.frontmatter.title,
          date: node.frontmatter.date,
          excerpt: node.excerpt,
        })),
        serializeFeed: results => results.data.allMdx.edges.map(({ node }) => ({
          id: node.fields.slug,
          url: 'https://docs.criipto.com/' + node.fields.slug,
          title: node.frontmatter.title,
          date: node.frontmatter.date,
          excerpt: node.excerpt,
        })),
        feedFilename: "changelog",
        nodesPerFeedFile: 1000,
      }
    }
  ].concat(process.env.GATSBY_ALGOLIA_APP_ID ? [
    {
      resolve: `gatsby-plugin-algolia`,
      /**
       * @type any
       */
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: algoliaQueries
      },
    }
  ] : [])
  .concat(process.env.SENTRY_DSN ? [
    {
      resolve: "@sentry/gatsby",
      /**
       * @type any
       */
      options: {
        dsn: process.env.SENTRY_DSN,
        sampleRate: 0.7,
      },
    }
  ] : []),
};

export default config;