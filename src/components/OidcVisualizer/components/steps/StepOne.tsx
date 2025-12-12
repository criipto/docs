import React, { MouseEvent } from 'react';
import StepCard from '../StepCard';
import { primaryBtn } from '../../styles';

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
      title="Redirect to OpenID Connect Server"
      description="User is redirected to the Authorization Server to log in."
      req={formatUrl(authorizeUrl)}
      res={authCode ? { code: authCode } : null}
      isActive={!authCode}
      isCompleted={!!authCode}
      action={
        <button onClick={onLogin} className={primaryBtn}>
          Start
        </button>
      }
    />
  );
}
