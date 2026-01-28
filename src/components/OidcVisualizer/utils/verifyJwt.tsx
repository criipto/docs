import { jwtVerify, createRemoteJWKSet } from 'jose';

type verifyJwtProps = {
  tokenResponse: { id_token?: string } | null;
  oidcSettings: { domain: string };
  setDecodedPayload: (payload: Record<string, any> | null) => void;
  setStep3Error: (error: string | null) => void;
};

export const verifyJwt = async ({
  tokenResponse,
  oidcSettings,
  setDecodedPayload,
  setStep3Error,
}: verifyJwtProps) => {
  if (!tokenResponse?.id_token) return;

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`https://${oidcSettings.domain}/.well-known/jwks.json`),
    );
    const { payload } = await jwtVerify(tokenResponse.id_token, JWKS);
    setDecodedPayload(payload);
  } catch (err: any) {
    setStep3Error('Token Verification Failed: ' + err.message);
  }
};
