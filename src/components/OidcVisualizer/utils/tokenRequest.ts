import oidcConfig from '../oidcConfig';
import { generateJWT } from './generateJwt';
import type { OidcSettings } from '../types';

type BuildRequestProps = {
  authCode: string | null;
  oidcSettings: OidcSettings;
};

type TokenReqParams = Record<string, string>;

export const buildTokenReqParams = async ({
  authCode,
  oidcSettings,
}: BuildRequestProps): Promise<TokenReqParams> => {
  if (!authCode) throw new Error('Missing authorization code');

  const params: TokenReqParams = {
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: oidcConfig.redirectUri,
  };

  if (oidcSettings.pkJwtAuth) {
    const clientAssertion = await generateJWT(oidcSettings);
    params['client_assertion_type'] = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
    params['client_assertion'] = clientAssertion;
  }

  return params;
};

type FormatTokenRequestArgs = { params: TokenReqParams; oidcSettings: OidcSettings };

export const formattedTokenRequest = ({ params, oidcSettings }: FormatTokenRequestArgs) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (!oidcSettings.pkJwtAuth) {
    headers.Authorization = `Basic ${btoa(
      `${oidcSettings.clientId}:${oidcSettings.clientSecret}`,
    )}`;
  }
  return [
    `POST /oauth2/token HTTP/1.1`,
    `Host: ${oidcSettings.domain}`,
    ...Object.entries(headers).map(([k, v]) => `${k}: ${v}`),
    ``,
    new URLSearchParams(params).toString().replaceAll('&', '\n'),
  ].join('\n');
};

export const exchangeCodeForTokens = async ({
  authCode,
  oidcSettings,
}: BuildRequestProps): Promise<Response> => {
  if (!authCode) throw new Error('Missing authorization code');
  const params = await buildTokenReqParams({ authCode, oidcSettings });
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (!oidcSettings.pkJwtAuth) {
    headers.Authorization = `Basic ${btoa(`${oidcSettings.clientId}:${oidcSettings.clientSecret}`)}`;
  }

  const response = await fetch(`https://${oidcSettings.domain}/oauth2/token`, {
    method: 'POST',
    headers,
    body: new URLSearchParams(params),
  });

  return response;
};
