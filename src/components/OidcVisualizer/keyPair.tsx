import * as jose from 'jose';
import oidcConfig from './oidcConfig';

async function generateKeys() {
  try {
    // Generate RSA key pair (public and private keys)
    const { publicKey, privateKey } = await jose.generateKeyPair('RS256');
    // Export the public key to JWK format
    const jwk = await jose.exportJWK(publicKey);
    const kid = await jose.calculateJwkThumbprint(jwk);
    const jwks = {
      keys: [
        {
          ...jwk,
          kid,
          use: 'sig',
        },
      ],
    };
    // Log the JWKS (public key in JWK Set format)
    console.log('JWK Set (Public Key):', JSON.stringify(jwks, null, 2));
    // Your private key here. Ensure to store your private key in a secure environment.
    console.log('Private Key:', privateKey);
    return { publicKey, privateKey, jwks };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

interface KeyPairResult {
  publicKey: CryptoKey | Uint8Array<ArrayBufferLike>;
  privateKey: CryptoKey | Uint8Array<ArrayBufferLike>;
  jwks: {
    keys: Array<{
      [key: string]: unknown;
      kid: string;
      use: string;
    }>;
  };
}

interface JWTPayload {
  jti: string;
}

const { publicKey, privateKey, jwks }: KeyPairResult = await generateKeys();

async function generateJWT(signingKey: CryptoKey | Uint8Array<ArrayBufferLike>): Promise<string> {
  try {
    const jti: string = 'e4f9c3b8a9d12';
    const jwt: string = await new jose.SignJWT({ jti } as jose.JWTPayload)
      .setProtectedHeader({ alg: 'RS256', kid: 'YOUR_KID' })
      .setIssuedAt()
      .setIssuer(oidcConfig.clientId)
      .setSubject(oidcConfig.clientId)
      .setAudience(oidcConfig.domain)
      .setExpirationTime('5m')
      .sign(signingKey);
    console.log('JWT:', jwt); // remove this console
    return jwt;
  } catch (error) {
    console.error('Error generating JWT:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

export const clientAssertion = await generateJWT(privateKey);
