import React, { ReactElement } from 'react';
import { LogoCard } from '../components/LogoCard/LogoCard';
import MitIDLogo from './logos/eids/mitid.svg';
import NoBankIDLogo from './logos/eids/no-bankid.svg';
import SeBankIDLogo from './logos/eids/se-bankid.svg';
import FtnLogo from './logos/eids/ftn.svg';
import FrejaIDLogo from './logos/eids/freja.svg';
import VippsLogo from './logos/eids/vipps.svg';
import iDinLogo from './logos/eids/idin.svg';
import MitIDErhvervLogo from './logos/eids/mitid-erhverv.svg';
import PersonalausweisLogo from './logos/eids/personalausweis.svg';

const eids = [
  {
    href: 'danish-mitid',
    header: 'Danish MitID',
    logo: {
      src: MitIDLogo,
      width: 36,
      height: 21,
      alt: 'Danish MitID logo',
    },
  },
  {
    href: 'norwegian-bankid',
    header: 'Norwegian BankID',
    logo: {
      src: NoBankIDLogo,
      width: 32,
      height: 20,
      alt: 'Norwegian BankID logo',
    },
  },
  {
    href: 'swedish-bankid',
    header: 'Swedish BankID',
    logo: {
      src: SeBankIDLogo,
      width: 34,
      height: 32,
      alt: 'Swedish BankID logo',
    },
  },
  {
    href: 'finnish-trust-network',
    header: 'Finnish Trust Network',
    logo: {
      src: FtnLogo,
      width: 36,
      height: 19,
      alt: 'FTN logo',
    },
  },
  {
    href: 'frejaid',
    header: 'Freja eID',
    logo: {
      src: FrejaIDLogo,
      width: 28,
      height: 28,
      alt: 'Freja logo',
    },
  },
  {
    href: 'vipps-mobilepay',
    header: 'Vipps MobilePay',
    logo: {
      src: VippsLogo,
      width: 33,
      height: 33,
      alt: 'Vipps MobilePay logo',
    },
  },

  {
    href: 'dutch-idin',
    header: 'Dutch iDIN',
    logo: {
      src: iDinLogo,
      width: 34,
      height: 32,
      alt: 'Dutch iDIN logo',
    },
  },
  {
    href: 'danish-mitid-erhverv',
    header: 'Danish MitID Erhverv',
    logo: {
      src: MitIDErhvervLogo,
      width: 33,
      height: 33,
      alt: 'Danish MitID Erhverv logo',
    },
  },
  {
    href: 'german-personalausweis',
    header: 'German Personalausweis',
    logo: {
      src: PersonalausweisLogo,
      width: 32,
      height: 32,
      alt: 'German Personalausweis logo',
    },
  },
];

export function EidCards(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4 not-prose">
      {eids.map(eid => (
        <LogoCard
          key={eid.href}
          className="h-[104px] w-[152px]"
          href={`/verify/e-ids/${eid.href}`}
          logo={eid.logo}
        >
          {eid.header}
        </LogoCard>
      ))}
    </div>
  );
}
