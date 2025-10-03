import React from 'react';
import { Link } from 'gatsby';

import { Paragraph } from './MdxProvider';

export default function ConsentRevocation() {
  return (
    <React.Fragment>
      <Paragraph>
        You can add a "forget-me" link on your website if you want to let users revoke the consent
        again. Use a normal authorize request as target, but add a{' '}
        <strong>prompt=consent_revoke</strong> query parameter to the request. Criipto will then run
        a login flow (to be able to recognize the end user), and delete the granted consent.
      </Paragraph>
      <Paragraph>
        <span>You can learn more about authorize requests in </span>
        <Link to="/verify/guides/authorize-url-builder?prompt=consent_revoke">
          our authorize URL builder.
        </Link>
      </Paragraph>
    </React.Fragment>
  );
}
