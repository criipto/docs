import React from 'react';
import StepCard from '../StepCard';
import { Button } from '../../../Button/Button';
import type { OidcTokenResponse } from '../../types';

type StepTwoProps = {
  stepRef: React.RefObject<HTMLDivElement | null>;
  authCode: string | null;
  tokenResponse: OidcTokenResponse | null;
  codeExchangeCompleted: boolean;
  onCodeExchange: () => void;
  proceedToVerifyWT: () => void;
  step2Error?: string | null;
  req: string | null;
  pkJwtAuth: boolean;
};

export default function StepTwo({
  stepRef,
  authCode,
  tokenResponse,
  codeExchangeCompleted,
  onCodeExchange,
  proceedToVerifyWT,
  step2Error,
  req,
  pkJwtAuth,
}: StepTwoProps) {
  return (
    <StepCard
      number={2}
      cardRef={stepRef}
      title="Exchange Authorization Code for Tokens"
      description={
        authCode && (
          <>
            Idura Verify responded with Authorization Code:{' '}
            <span className="text-light-blue-800 font-mono text-sm font-semibold break-all">
              {authCode}
            </span>
            <p className="mb-0">
              To exchange the code for tokens, send a POST request to Idura Verify’s{' '}
              <a href="/verify/reference/glossary/#token-endpoint">Token Endpoint</a> including the
              Authorization Code and your client credentials.
            </p>
          </>
        )
      }
      req={authCode ? req : null}
      responseId="codeExchangeResponse"
      res={tokenResponse}
      isActive={!!authCode && !codeExchangeCompleted}
      isCompleted={!!tokenResponse && codeExchangeCompleted}
      action={
        !tokenResponse ? (
          <Button variant="primary" onClick={onCodeExchange}>
            Exchange Code
          </Button>
        ) : (
          <div className="flex flex-row gap-2">
            <Button
              variant="danger"
              onClick={onCodeExchange}
              disabled={!!step2Error}
              iconLeft={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="h-4 w-4"
                  fill="white"
                >
                  <path d="M96 64L96 183.8L133 144.7C181.6 93.2 249.2 64 320 64C459.7 64 575.9 180.4 576 320C576.1 459.3 459.7 575.9 320 576C219.9 576.1 126.7 515.5 86.1 424.1L115.3 411.1C150.7 491 232.5 544.1 320 544C442.1 543.9 544.1 441.6 544 320C543.9 198.1 442 96 320 96C258 96 198.8 121.5 156.2 166.6L117.1 208L240 208L240 240L64 240L64 64L96 64z" />
                </svg>
              }
            >
              Retry Exchange
            </Button>

            <Button variant="primary" onClick={proceedToVerifyWT} disabled={!!step2Error}>
              Next
            </Button>
          </div>
        )
      }
      error={step2Error}
      errorInfo={
        step2Error?.includes('Unknown Access Code') && (
          <span>
            <p>
              Authorization code is only valid for a single use. If the same code is used in another
              token request, the Authorization Server returns an{' '}
              <a
                href="/verify/reference/errors/unknown-access-code-error/"
                target="_blank"
                className="underline"
              >
                <code>Unknown Access Code</code>
              </a>{' '}
              error.{' '}
            </p>
            <p>Restart the authorization flow to get a new code.</p>
          </span>
        )
      }
    />
  );
}
