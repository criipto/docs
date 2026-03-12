import React, { ReactElement } from 'react';
import { CardLink } from '../components/CardLink/CardLink';

export function DeveloperToolsCards(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row">
        <CardLink
          href="/verify/guides/oidc-visualizer"
          header={
            <h3 className="text-lg font-medium text-light-blue-900">OpenID Connect Visualizer</h3>
          }
        >
          Step through the OpenID Connect authentication flow and see what happens under the hood.
          While our SDKs handle the heavy lifting, understanding the underlying protocol will make
          testing and troubleshooting much easier.
        </CardLink>

        <CardLink
          href="/verify/guides/authorize-url-builder"
          header={
            <h3 className="text-lg font-medium text-light-blue-900">Authorize URL Builder</h3>
          }
        >
          Experiment with different eIDs and authentication parameters without writing any code.
          Authorize URL Builder lets you generate login URLs, tweak the configuration to fit your
          needs, and preview the end-user login experience.
        </CardLink>

        <CardLink
          href="/signatures/getting-started/interactive-tour"
          header={
            <h3 className="text-lg font-medium text-light-blue-900">
              Interactive Tour for Signatures
            </h3>
          }
        >
          See what it takes to build a document signature flow as our interactive tour walks you
          through the required GraphQL API queries step-by-step. You'll need API credentials from
          your own Signatures application.
        </CardLink>
      </div>
    </div>
  );
}
