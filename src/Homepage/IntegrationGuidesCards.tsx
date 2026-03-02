import React, { ReactElement } from 'react';
import { LogoCard } from '../components/LogoCard/LogoCard';

import Auth0Logo from './logos/auth0.svg';
import JavaScriptLogo from './logos/javascript.svg';
import ReactLogo from './logos/react.svg';
import NodejsLogo from './logos/nodejs.svg';
import VuejsLogo from './logos/vuejs.svg';
import ExpoLogo from './logos/expo.svg';
import WordpressLogo from './logos/wordpress.svg';
import AwsCognitoLogo from './logos/aws-cognito.svg';
import FirebaseLogo from './logos/firebase.svg';
import OktaLogo from './logos/okta.svg';
import PingFederateLogo from './logos/ping-identity.svg';
import PhpLogo from './logos/php.svg';
import DotnetLogo from './logos/dotnet.svg';
import OneLoginLogo from './logos/onelogin.svg';
import KotlinLogo from './logos/kotlin.svg';
import SwiftLogo from './logos/swift.svg';

const guides = [
  {
    href: 'react',
    header: 'React',
    src: ReactLogo,
    width: 46,
  },
  {
    href: 'javascript',
    header: 'JavaScript',
    src: JavaScriptLogo,
  },
  {
    href: 'nodejs-express',
    header: 'Node.js (Express)',
    src: NodejsLogo,
    width: 70,
    height: 42,
  },
  {
    href: 'vuejs',
    header: 'Vue.js',
    src: VuejsLogo,
    height: 46,
  },
  {
    href: 'kotlin',
    header: 'Kotlin (Android)',
    src: KotlinLogo,
  },
  {
    href: 'react-native-expo',
    header: 'Expo (React Native)',
    src: ExpoLogo,
    height: 42,
    width: 38,
  },

  {
    href: 'swift',
    header: 'Swift (iOS)',
    src: SwiftLogo,
  },
  {
    href: 'wordpress',
    header: 'Wordpress',
    src: WordpressLogo,
    width: 42,
    height: 42,
  },
  {
    href: 'auth0',
    header: 'Auth0',
    src: Auth0Logo,
    height: 36,
  },
  {
    href: 'aws-cognito',
    header: 'AWS Cognito',
    src: AwsCognitoLogo,
    width: 38,
    height: 44,
  },
  {
    href: 'firebase',
    header: 'Firebase',
    src: FirebaseLogo,
    width: 32,
    height: 44,
  },
  {
    href: 'okta',
    header: 'Okta',
    src: OktaLogo,
    width: 69,
    height: 23,
  },
  {
    href: 'onelogin',
    header: 'OneLogin',
    src: OneLoginLogo,
    width: 42,
    height: 42,
  },
  {
    href: 'pingfederate',
    header: 'PingFederate',
    src: PingFederateLogo,
  },
  {
    href: 'PHP',
    header: 'PHP',
    src: PhpLogo,
    width: 64,
    height: 34,
  },
  {
    href: 'aspnet-core-v6',
    header: 'ASP.NET Core 6.0',
    src: DotnetLogo,
  },
  {
    href: 'aspnet-core-v3',
    header: 'ASP.NET Core 3.1',
    src: DotnetLogo,
  },
];

export function IntegrationCards(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4 not-prose">
      {guides.map(guide => (
        <LogoCard
          key={guide.href}
          className="h-[104px] w-[152px]"
          href={`/verify/integrations/${guide.href}`}
          logoSrc={guide.src}
          logoWidth={guide.width}
          logoHeight={guide.height}
        >
          {guide.header}
        </LogoCard>
      ))}
    </div>
  );
}
