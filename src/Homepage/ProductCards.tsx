import React, { ReactElement } from 'react';
import { CardLink } from '../components/ProductCard/ProductCard';

export function ProductCards(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row">
        <CardLink
          href="/verify"
          header={<h3 className="text-lg font-medium text-light-blue-900">Idura Verify</h3>}
        >
          Authenticate your users with secure eID logins. Integrate trusted national IDs directly
          into your application.
        </CardLink>

        <CardLink
          href="/signatures"
          header={<h3 className="text-lg font-medium text-light-blue-900">Idura Signatures</h3>}
        >
          Enable legally binding PDF signatures using national eIDs. Generate PAdES-LTA
          standard-compliant documents with ease.
        </CardLink>

        <CardLink
          href="/verify/guides/age-verification"
          header={<h3 className="text-lg font-medium text-light-blue-900">Age Verification</h3>}
        >
          Verify user age without collecting personal data. Ensure compliance with GDPR and age
          restriction regulations.
        </CardLink>
      </div>
    </div>
  );
}
