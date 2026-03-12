import React, { ReactElement } from 'react';
import { LogoCard } from '../components/LogoCard/LogoCard';

import Auth0Logo from './logos/integrations/auth0.svg';
import JavaScriptLogo from './logos/integrations/javascript.svg';
import ReactLogo from './logos/integrations/react.svg';
import NodejsLogo from './logos/integrations/nodejs.svg';
import VuejsLogo from './logos/integrations/vuejs.svg';
import ExpoLogo from './logos/integrations/expo.svg';
import WordpressLogo from './logos/integrations/wordpress.svg';
import AwsCognitoLogo from './logos/integrations/aws-cognito.svg';
import FirebaseLogo from './logos/integrations/firebase.svg';
import OktaLogo from './logos/integrations/okta.svg';
import PingFederateLogo from './logos/integrations/ping-identity.svg';
import PhpLogo from './logos/integrations/php.svg';
import DotnetLogo from './logos/integrations/dotnet.svg';
import OneLoginLogo from './logos/integrations/onelogin.svg';
import KotlinLogo from './logos/integrations/kotlin.svg';
import SwiftLogo from './logos/integrations/swift.svg';

const guides = [
  {
    href: 'react',
    header: 'React',
    logo: { src: ReactLogo, width: 46, alt: 'React logo' },
  },
  {
    href: 'javascript',
    header: 'JavaScript',
    logo: { src: JavaScriptLogo, alt: 'JavaScript logo' },
  },
  {
    href: 'nodejs-express',
    header: 'Node.js (Express)',
    logo: { src: NodejsLogo, width: 70, height: 42, alt: 'Node.js (Express) logo' },
  },
  {
    href: 'vuejs',
    header: 'Vue.js',
    logo: { src: VuejsLogo, height: 46, alt: 'Vue.js logo' },
  },
  {
    href: 'kotlin',
    header: 'Kotlin (Android)',
    logo: { src: KotlinLogo, alt: 'Kotlin logo' },
  },
  {
    href: 'react-native-expo',
    header: 'Expo (React Native)',
    logo: { src: ExpoLogo, height: 42, width: 38, alt: 'Expo logo' },
  },

  {
    href: 'swift',
    header: 'Swift (iOS)',
    logo: { src: SwiftLogo, alt: 'Swift logo' },
  },
  {
    href: 'wordpress',
    header: 'Wordpress',
    logo: { src: WordpressLogo, width: 42, height: 42, alt: 'Wordpress logo' },
  },
  {
    href: 'auth0',
    header: 'Auth0',
    logo: { src: Auth0Logo, height: 36, alt: 'Auth0 logo' },
  },
  {
    href: 'aws-cognito',
    header: 'AWS Cognito',
    logo: { src: AwsCognitoLogo, width: 38, height: 44, alt: 'AWS Cognito logo' },
  },
  {
    href: 'firebase',
    header: 'Firebase',
    logo: { src: FirebaseLogo, width: 32, height: 44, alt: 'Firebase logo' },
  },
  {
    href: 'okta',
    header: 'Okta',
    logo: { src: OktaLogo, width: 69, height: 23, alt: 'Okta logo' },
  },
  {
    href: 'onelogin',
    header: 'OneLogin',
    logo: { src: OneLoginLogo, width: 42, height: 42, alt: 'OneLogin logo' },
  },
  {
    href: 'pingfederate',
    header: 'PingFederate',
    logo: { src: PingFederateLogo, alt: 'PingFederate logo' },
  },
  {
    href: 'PHP',
    header: 'PHP',
    logo: { src: PhpLogo, width: 64, height: 34, alt: 'PHP logo' },
  },
  {
    href: 'aspnet-core-v6',
    header: 'ASP.NET Core 6.0',
    logo: { src: DotnetLogo, alt: 'Dotnet logo' },
  },
  {
    href: 'aspnet-core-v3',
    header: 'ASP.NET Core 3.1',
    logo: { src: DotnetLogo, alt: 'Dotnet logo' },
  },
];

export function VerifyIntegrationCards(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4 not-prose">
      {guides.map(guide => (
        <LogoCard
          key={guide.href}
          className="h-[104px] w-[152px]"
          href={`/verify/integrations/${guide.href}`}
          logo={guide.logo}
        >
          {guide.header}
        </LogoCard>
      ))}
    </div>
  );
}
