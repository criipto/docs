import React, { MouseEvent } from 'react';
import StepCard from '../StepCard';
import { Button } from '../../../Button/Button';

type StepOneProps = {
  stepRef: React.RefObject<HTMLDivElement | null>;
  authorizeUrl: string;
  authCode?: string | null;
  onLogin: (event: MouseEvent<HTMLButtonElement>) => void;
  requestSettings?: React.ReactNode;
};

export function formatRequest(method: string, url: string): string {
  const prefix = `${method} `;
  // Align query params under the start of the URL
  const indent = ' '.repeat(prefix.length);

  const [base, query] = url.split('?');
  if (!query) return `${prefix}${base}`;

  const formattedParams = query
    .split('&')
    .map(p => indent + decodeURIComponent(p))
    .join('\n');

  return `${prefix}${base}?\n${formattedParams}`;
}

export default function StepOne({
  stepRef,
  authorizeUrl,
  authCode,
  onLogin,
  requestSettings,
}: StepOneProps) {
  return (
    <StepCard
      number={1}
      cardRef={stepRef}
      title="Redirect the user to Idura Verify for authentication"
      description={
        <p className="!mb-0">
          <b>a. Create an authentication request (authorize URL)</b>
          <br />
          Build the authentication request by generating an{' '}
          <a href="/verify/reference/glossary/#authorization-request-authorize-url" target="_blank">
            authorize URL
          </a>{' '}
          with the required parameters (for example, <code>response_type</code>,{' '}
          <code>client_id</code>, <code>redirect_uri</code>, and <code>scope</code>). The visualizer
          is prefilled with defaults, so it works out of the box. You can adjust request parameters
          and use your own application credentials by clicking <strong>Configure</strong>.
          <br />
        </p>
      }
      secondaryDescription={
        <p className="mb-0">
          <b>b. Redirect the user to Idura Verify</b>
          <br />
          Press <strong>Redirect</strong> to open the authorize URL. Complete authentication as the
          end user with an eID of your choice (please use{' '}
          <a href="/verify/guides/test-users/" target="_blank">
            test user credentials
          </a>
          ).
        </p>
      }
      req={`${formatRequest('GET', authorizeUrl)}`}
      res={authCode ? { code: authCode } : null}
      isActive={!authCode}
      isCompleted={!!authCode}
      action={
        <Button variant="primary" onClick={onLogin}>
          Redirect
        </Button>
      }
      requestSettings={requestSettings}
    />
  );
}
