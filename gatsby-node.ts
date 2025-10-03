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
    toPath: '/verify/e-ids/norwegian-vipps/#ordering-norwegian-vipps-login',
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
