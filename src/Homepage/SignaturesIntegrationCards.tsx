import React, { ReactElement } from 'react';
import { LogoCard } from '../components/LogoCard/LogoCard';
import PythonLogo from './logos/integrations/python.svg';
import NodejsLogo from './logos/integrations/nodejs.svg';
import PhpLogo from './logos/integrations/php.svg';
import CsharpLogo from './logos/integrations/csharp.svg';

const guides = [
  {
    href: 'python',
    header: 'Python',
    logo: {
      src: PythonLogo,
      alt: 'Python logo',
    },
  },
  {
    href: 'nodejs',
    header: 'Node.js',
    logo: {
      src: NodejsLogo,
      width: 70,
      height: 42,
      alt: 'Node.js logo',
    },
  },
  {
    href: 'php',
    header: 'PHP',
    logo: {
      src: PhpLogo,
      width: 64,
      height: 34,
      alt: 'PHP logo',
    },
  },
  {
    href: 'csharp',
    header: '.NET (C#)',
    logo: {
      src: CsharpLogo,
      alt: 'C# logo',
    },
  },
];

export function SignaturesIntegrationCards(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4 not-prose">
      {guides.map(guide => (
        <LogoCard
          key={guide.href}
          className="h-[104px] w-[152px]"
          href={`/signatures/integrations/${guide.href}`}
          logo={guide.logo}
        >
          {guide.header}
        </LogoCard>
      ))}
    </div>
  );
}
