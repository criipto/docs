import React from 'react';
import StepCard from '../StepCard';
import { primaryBtn } from '../../styles';
import oidcConfig from '../../oidcConfig';
import type { OidcTokenResponse } from '../../types';
import cx from 'classnames';

type StepTwoProps = {
  stepRef: React.RefObject<HTMLDivElement | null>;
  authCode: string | null;
  tokenResponse: OidcTokenResponse | null;
  codeExchangeCompleted: boolean;
  onCodeExchange: () => void;
  proceedToVerifyWT: () => void;
  step2Error?: string | null;
};

export default function StepTwo({
  stepRef,
  authCode,
  tokenResponse,
  codeExchangeCompleted,
  onCodeExchange,
  proceedToVerifyWT,
  step2Error,
}: StepTwoProps) {
  return (
    <StepCard
      number={2}
      cardRef={stepRef}
      title="Exchange Code for Token"
      description={
        authCode && (
          <>
            Your Authorization Code is:{' '}
            <span className="bg-gray-200 text-gray-700 font-mono text-sm px-2 py-1 rounded-sm shadow-inner break-all">
              {authCode}
            </span>
            <p className="mt-2 ">
              Now, the authorization code can be exchanged for an access token and an ID token. To
              do this, the authorization server sends a POST request to your token endpoint,
              including the authorization code and the client credentials. Note that the
              authorization code is valid for a single use.
            </p>
          </>
        )
      }
      req={
        authCode
          ? {
              method: 'POST',
              url: `/oauth2/token`,
              body: {
                grant_type: 'authorization_code',
                code: authCode,
                client_id: oidcConfig.clientId,
              },
            }
          : null
      }
      responseId="codeExchangeResponse"
      res={tokenResponse}
      isActive={!!authCode && !codeExchangeCompleted}
      isCompleted={!!tokenResponse && codeExchangeCompleted}
      action={
        !tokenResponse ? (
          <button
            onClick={onCodeExchange}
            disabled={!!step2Error}
            className={cx(
              primaryBtn,
              step2Error && 'bg-gray-400 cursor-not-allowed hover:bg-gray-400',
            )}
          >
            Exchange Code
          </button>
        ) : (
          <button onClick={proceedToVerifyWT} className={primaryBtn}>
            Next
          </button>
        )
      }
      error={step2Error}
    />
  );
}
