import React, { MouseEvent } from 'react';
import StepCard from '../StepCard';
import { Button } from '../../../Button/Button';

type StepOneProps = {
  stepRef: React.RefObject<HTMLDivElement | null>;
  authorizeUrl: string;
  authCode?: string | null;
  onLogin: (event: MouseEvent<HTMLButtonElement>) => void;
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

export default function StepOne({ stepRef, authorizeUrl, authCode, onLogin }: StepOneProps) {
  return (
    <StepCard
      number={1}
      cardRef={stepRef}
      title="Authentication Request"
      description={
        <>
          <p>
            The client application creates an authentication request with the required parameters (
            <code>response_type</code>, <code>redirect_uri</code>, etc.) and redirects the user to
            the Authorization Endpoint. Here, the user authenticates via one of the eIDs supported
            by Idura Verify.
          </p>
          <p>
            Please use{' '}
            <a href="/verify/guides/test-users/" target="_blank">
              test user credentials
            </a>{' '}
            to log in.
          </p>
        </>
      }
      req={formatUrl(authorizeUrl)}
      res={authCode ? { code: authCode } : null}
      isActive={!authCode}
      isCompleted={!!authCode}
      action={
        <Button variant="primary" onClick={onLogin}>
          Redirect
        </Button>
      }
    />
  );
}
