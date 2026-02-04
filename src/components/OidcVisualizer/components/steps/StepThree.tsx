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
      title="Validate ID Token"
      description={
        tokenResponse && (
          <>
            <p className="mb-3">
              <div>
                <p className="text-xs font-bold text-light-blue-500 uppercase tracking-wider mb-2">
                  id_token
                </p>
                <pre className="my-1 mb-3">{tokenResponse.id_token}</pre>
              </div>
              The Client Application must check the ID Token's{' '}
              <a href="/verify/reference/glossary/#json-web-signature-jws" target="_blank">
                signature
              </a>{' '}
              and{' '}
              <a href="/verify/reference/glossary/#claims" target="_blank">
                claims
              </a>{' '}
              to confirm the token originates from the expected issuer and has not been tampered
              with.
            </p>

            <p>
              The token is cryptographically signed by Idura Verify. The Client Application
              validates the signature using one of the public keys published at{' '}
              <a href={jwksUrl} target="_blank">
                {jwksUrl}
              </a>
              . The key is selected based on the token’s Key ID (<code>kid</code>).
            </p>

            <p>
              In this visualizer, validation runs in the background when you click{' '}
              <strong>Validate</strong>. In a real integration, use a dedicated library to perform
              all required checks.
            </p>
          </>
        )
      }
      isActive={!!tokenResponse && !decodedPayload && codeExchangeCompleted}
      isCompleted={!!decodedPayload}
      action={
        <Button onClick={onVerify} variant="primary">
          Validate
        </Button>
      }
      error={step3Error}
    />
  );
}
