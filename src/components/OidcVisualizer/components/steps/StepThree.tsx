import React from 'react';
import { JWTPayload } from 'jose';
import StepCard from '../StepCard';
import { Button } from '../../../Button/Button';
import type { OidcTokenResponse } from '../../types';
import oidcConfig from '../../oidcConfig';

type StepThreeProps = {
  stepRef: React.RefObject<HTMLDivElement | null>;
  tokenResponse: OidcTokenResponse | null;
  codeExchangeCompleted: boolean;
  decodedPayload: JWTPayload | null;
  onVerify: () => void;
  step3Error?: string | null;
};

export default function StepThree({
  stepRef,
  tokenResponse,
  decodedPayload,
  codeExchangeCompleted,
  onVerify,
  step3Error,
}: StepThreeProps) {
  const jwksUrl = `https://${oidcConfig.domain}/.well-known/jwks`;
  return (
    <StepCard
      number={3}
      cardRef={stepRef}
      title="Verify ID Token"
      description={
        tokenResponse && (
          <>
            <p className="mb-3">
              The final step is validating the{' '}
              <a href="/verify/reference/glossary/#id-token" target="_blank">
                ID Token
              </a>
              . To confirm that the token originates from the expected issuer and has not been
              tampered with, the client application must check its{' '}
              <a href="/verify/reference/glossary/#json-web-signature-jws" target="_blank">
                signature
              </a>{' '}
              and{' '}
              <a href="/verify/reference/glossary/#claims" target="_blank">
                claims
              </a>
              .
            </p>

            <p className="font-semibold mt-4">Your id_token is:</p>

            <pre>{tokenResponse.id_token}</pre>

            <p className="mt-4">
              The token is cryptographically signed by Idura Verify. To validate the signature, we
              use one of the public keys published at{' '}
              <a href={jwksUrl} target="_blank">
                {jwksUrl}
              </a>
              . The key is selected based on the token’s Key ID (<code>kid</code>).
            </p>
          </>
        )
      }
      isActive={!!tokenResponse && !decodedPayload && codeExchangeCompleted}
      isCompleted={!!decodedPayload}
      action={
        <Button onClick={onVerify} variant="primary">
          Verify
        </Button>
      }
      error={step3Error}
    />
  );
}
