const oidcConfig = {
  clientId: 'urn:oidc:visualizer',
  clientSecret: '4AGzg0LRnJpoVzHV01/N9YfBDZkwcoePYca5QB93c88=',
  domain: 'docs-samples-test.criipto.id',
  redirectUri: `${typeof window !== 'undefined' ? window.location.origin : 'https://docs.idura.app'}/verify/guides/oidc-visualizer`,
  scope: 'openid',
  responseType: 'code',
  pkJwtAuth: false,
  acrValues: [],
};

export default oidcConfig;
