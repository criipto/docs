import React, { ReactElement } from 'react';
import { CardLink } from '../components/CardLink/CardLink';

export function ProductCards(): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CardLink
        href="/verify"
        header={<h3 className="text-lg font-medium text-light-blue-900">Idura Verify</h3>}
      >
        Idura Verify provides eID authentication as a service, allowing you to integrate trusted
        national ID logins directly into your website or application.
      </CardLink>

      <CardLink
        href="/signatures"
        header={<h3 className="text-lg font-medium text-light-blue-900">Idura Signatures</h3>}
      >
        Idura Signatures enables you to sign any PDF document using national eIDs supported by Idura
        Verify. Documents will be produced according to the PAdES-LTA standard.
      </CardLink>

      <CardLink
        href="/verify/guides/age-verification"
        header={<h3 className="text-lg font-medium text-light-blue-900">Age Verification</h3>}
      >
        With Age Verification, you can verify your users' ages without collecting personal data.
        This lets you stay compliant with GDPR and age restriction regulations.
      </CardLink>

      <CardLink
        href="/verify/guides/caller-authentication"
        header={<h3 className="text-lg font-medium text-light-blue-900">Caller Authentication</h3>}
      >
        Caller Authentication integrates national eID verification into your call center workflow,
        creating a secure, phishing-resistant way to confirm who you are talking with.
      </CardLink>
    </div>
  );
}
