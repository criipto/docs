import * as jose from 'jose';
import oidcConfig from './oidcConfig';
import signingJwks from './keys/public_and_private_signing_jwks.json';

async function generateJWT(): Promise<string> {
  const jwkObject = signingJwks.keys[0];
  const privateKey = await jose.importJWK(jwkObject, 'RS256');

  try {
    const jti = crypto.randomUUID();
    const jwt = await new jose.SignJWT({ jti })
      .setProtectedHeader({ alg: 'RS256', kid: jwkObject.kid })
      .setIssuedAt()
      .setIssuer(oidcConfig.clientId)
      .setSubject(oidcConfig.clientId)
      .setAudience(`https://${oidcConfig.domain}`)
      .setExpirationTime('5m')
      .sign(privateKey);
    return jwt;
  } catch (error) {
    console.error('Error generating JWT:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export const clientAssertion = await generateJWT();
