import React from 'react';
import StepCard from '../StepCard';
import { primaryBtn } from '../../styles';
import type { OidcTokenResponse } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

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
      title="Exchange Code for Tokens"
      description={
        authCode && (
          <>
            Your Authorization Code is:{' '}
            <span className="bg-gray-200 text-gray-700 font-mono text-sm px-2 py-1 rounded-sm shadow-inner break-all">
              {authCode}
            </span>
            <p>
              The code can now be exchanged for an Access Token and an ID Token. The client
              initiates the exchange by sending a POST request with the code and the client
              credentials to the{' '}
              <a href="/verify/reference/glossary/#token-endpoint">Token Endpoint</a> at Idura
              Verify.
            </p>
            <i>
              The authorization code is only valid for a single use. Another token request with the
              same code will trigger an{' '}
              <a href="/verify/reference/errors/unknown-access-code-error/" target="_blank">
                <code>Unknown Access Code</code>
              </a>{' '}
              error.
            </i>
          </>
        )
      }
      req={authCode ? req : null}
      reqNote={
        !pkJwtAuth ? (
          <>
            <strong>Note:</strong> Including client credentials (<code>client_id</code> and{' '}
            <code>client_secret</code>) in the payload is discouraged by the OAuth2 specification.
            Server-side applications should instead send the credentials in the{' '}
            <code>Authorization: Basic</code> HTTP header.
          </>
        ) : null
      }
      responseId="codeExchangeResponse"
      res={tokenResponse}
      isActive={!!authCode && !codeExchangeCompleted}
      isCompleted={!!tokenResponse && codeExchangeCompleted}
      action={
        !tokenResponse ? (
          <button onClick={onCodeExchange} className={cx(primaryBtn)}>
            Exchange Code
          </button>
        ) : (
          <div className="flex flex-row gap-2">
            <button onClick={onCodeExchange} className={cx(primaryBtn)}>
              <div className="flex flex-row items-center gap-1">
                <FontAwesomeIcon icon="arrows-rotate" className="text-md" />
                Retry Exchange
              </div>
            </button>

            <button
              onClick={proceedToVerifyWT}
              className={cx(
                primaryBtn,
                step2Error && 'bg-gray-400 cursor-not-allowed hover:bg-gray-400',
              )}
              disabled={!!step2Error}
            >
              Next
            </button>
          </div>
        )
      }
      error={step2Error}
    />
  );
}
