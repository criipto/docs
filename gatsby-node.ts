import type { GatsbyNode } from 'gatsby';

export const onCreatePage: GatsbyNode['onCreatePage'] = ({ page, actions }) => {
  const { createPage } = actions;

  createPage({
    path: `/_embedded${page.path}`,
    component: page.component,
    context: {
      ...page.context,
      isEmbedded: true,
    },
  });
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const path = node.internal.contentFilePath!.split('src/pages/')[1];
    if (path) {
      const slug = path.replace('/index.mdx', '').replace('.mdx', '');
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });
    }
    createNodeField({
      node,
      name: 'rawBody',
      value: node.body,
    });
    createNodeField({
      node,
      name: 'tableOfContents',
      value: node.tableOfContents,
    });
  }
};

export const createPages: GatsbyNode['createPages'] = ({ actions }) => {
  const { createRedirect } = actions;
  createRedirect({
    fromPath: '/verify/guides/faq/#unknown-access-code-error',
    toPath: '/verify/reference/errors/unknown-access-code-error',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/verify/guides/faq/#mitid-core-client-error',
    toPath: '/verify/reference/errors/danish-mitid/MitID-core-client-error',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/verify/errors/MITID_NONCE_COOKIE_MALFORMED',
    toPath: '/verify/reference/errors/danish-mitid/MITID_NONCE_COOKIE_MALFORMED',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/verify/errors/MITID_NONCE_COOKIE_MISSING',
    toPath: '/verify/reference/errors/danish-mitid/MITID_NONCE_COOKIE_MISSING',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/verify/getting-started/glossary/',
    toPath: '/verify/reference/glossary/',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/verify/getting-started/rate-limiting/',
    toPath: '/verify/reference/rate-limiting/',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/verify/getting-started/token-contents/',
    toPath: '/verify/reference/token-contents/',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/getting-started/dk-mitid',
    toPath: '/verify/e-ids/danish-mitid',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/getting-started/no-bankid',
    toPath: '/verify/e-ids/norwegian-bankid',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/getting-started/*',
    toPath: '/verify/getting-started/:splat',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/getting-started',
    toPath: '/verify/getting-started',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/authentication/*',
    toPath: '/verify/integrations/:splat',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/authentication',
    toPath: '/verify/integrations',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/eid-specifics/mitid-ux-reqs',
    toPath: '/verify/e-ids/danish-mitid/#mitid-user-interface-requirements',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/eid-specifics/order-dk-mitid',
    toPath: '/verify/e-ids/danish-mitid/#order-mitid-for-production',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/eid-specifics/order-no-bankid',
    toPath: '/verify/e-ids/norwegian-bankid/#ordering-norwegian-bankid',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/eid-specifics/order-no-vipps',
    toPath: '/verify/e-ids/vipps-mobilepay/#ordering-vipps-mobilepay',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/verify/e-ids/norwegian-vipps',
    toPath: '/verify/e-ids/vipps-mobilepay',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/eid-specifics/order-se-bankid',
    toPath: '/verify/e-ids/swedish-bankid/#ordering-swedish-bankid',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/eid-specifics/order-fi-bankid',
    toPath: '/verify/e-ids/finnish-trust-network/#ordering-a-production-agreement',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/eid-specifics',
    toPath: '/verify/e-ids',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/how-to/get-ready-for-production',
    toPath: '/verify/guides/production',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/how-to/get-ready-for-production/',
    toPath: '/verify/guides/production',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/how-to/acr-values',
    toPath: '/verify/guides/authorize-url-builder/#auth-methods--acr-values',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/how-to/apply-custom-styling/',
    toPath: '/verify/guides/custom-styling',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/how-to/test-users/',
    toPath: '/verify/e-ids',
    isPermanent: true,
    force: true,
  });

  createRedirect({
    fromPath: '/how-to/*',
    toPath: '/verify/how-to/:splat',
    isPermanent: true,
    force: true,
  });
  createRedirect({
    fromPath: '/how-to',
    toPath: '/verify/how-to',
    isPermanent: true,
    force: true,
  });
};

// https://www.gatsbyjs.com/docs/conceptual/data-fetching/#source-data-to-be-queried-at-build-time
// https://www.gatsbyjs.com/docs/tutorial/creating-a-source-plugin/part-2/#createnode
export const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions,
  createContentDigest,
  createNodeId,
}) => {
  const { createNode } = actions;

  const res = await fetch(
    `https://raw.githubusercontent.com/criipto/idura-verify-android/refs/heads/master/README.md`,
  );
  if (!res.ok) {
    throw new Error(`Fetching idura-verify-android failed`);
  }

  const data = (await res.text()).replace('# idura-verify-android', '');
  createNode({
    // Arbitrary fields, which can be queried from gql
    iduraVerifyAndroidReadme: data,

    // required fields
    id: createNodeId('idura-verify-android-readme'),
    parent: null,
    children: [],
    internal: {
      type: `github`,
      mediaType: `text/markdown`,
      contentDigest: createContentDigest(data),
    },
  });
};
