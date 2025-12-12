import React from 'react';
import StepCard from '../StepCard';
import { JWTPayload } from 'jose';
import { primaryBtn } from '../../styles';
import type { OidcTokenResponse } from '../../types';

type StepThreeProps = {
  stepRef: React.RefObject<HTMLDivElement | null>;
  tokenResponse: OidcTokenResponse | null;
  codeExchangeCompleted: boolean;
  decodedPayload: JWTPayload | null;
  onVerify: () => void;
  step3Error?: string | null;
};

export function formatUrl(url: string): string {
  const [base, query] = url.split('?');
  if (!query) return base;

  const formattedParams = query
    .split('&')
    .map(param => '  ' + decodeURIComponent(param))
    .join('\n');

  return `${base}?\n${formattedParams}`;
}

export default function StepThree({
  stepRef,
  tokenResponse,
  decodedPayload,
  codeExchangeCompleted,
  onVerify,
  step3Error,
}: StepThreeProps) {
  return (
    <StepCard
      number={3}
      cardRef={stepRef}
      title="Verify ID Token"
      description={
        tokenResponse && (
          <>
            <p className="text-gray-600 mb-3">
              The final step is validating the <span className="font-semibold">ID Token</span>. We
              must confirm the token came from the correct sender and hasn't been tampered with by
              verifying its <span className="font-semibold">JWT signature</span>.
            </p>

            <p className="font-semibold mt-4">Your id_token is:</p>

            <div className="bg-slate-900 text-slate-50 p-4 rounded mt-1 overflow-x-auto font-mono text-sm">
              <pre>{tokenResponse.id_token}</pre>
            </div>

            <p className="mt-4 text-gray-600">
              This token is signed by Idura Verify using the RSA algorithm. We'll use the private
              key of an asymmetric key par to confirm the signature is valid. (explain a bit more, I
              dont think its the same key pair as for authentication)
              https://samples.criipto.id/.well-known/jwks
            </p>
          </>
        )
      }
      isActive={!!tokenResponse && !decodedPayload && codeExchangeCompleted}
      isCompleted={!!decodedPayload}
      action={
        <button onClick={onVerify} className={primaryBtn}>
          Validate Signature
        </button>
      }
      error={step3Error}
    />
  );
}
