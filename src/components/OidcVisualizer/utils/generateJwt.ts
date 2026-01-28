import * as jose from 'jose';
import signingJwks from '../keys/signing_jwks_public_and_private.json';

type generateJwtProps = {
  domain: string;
  clientId: string;
};

export async function generateJWT({ domain, clientId }: generateJwtProps): Promise<string> {
  const jwkObject = signingJwks.keys[0];
  const privateKey = await jose.importJWK(jwkObject, 'RS256');

  try {
    const jti = crypto.randomUUID();
    const jwt = await new jose.SignJWT({ jti })
      .setProtectedHeader({ alg: 'RS256', kid: jwkObject.kid })
      .setIssuedAt()
      .setIssuer(clientId)
      .setSubject(clientId)
      .setAudience(`https://${domain}`)
      .setExpirationTime('5m')
      .sign(privateKey);
    return jwt;
  } catch (error) {
    console.error('Error generating JWT:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}
