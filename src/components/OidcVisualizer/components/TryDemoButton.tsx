import React from 'react';
import { AnchorButton } from '../../Button/Button';

const TryDemoButton = () => {
  return (
    <div className="relative">
      <AnchorButton
        variant="primary"
        href="/verify/guides/oidc-visualizer/#try-the-interactive-demo"
      >
        Try Demo
      </AnchorButton>
    </div>
  );
};

export default TryDemoButton;
