
type AuthMethod = {
  title: string
  acrValue: string
  scopes? : string[]
}

type Provider = {
  title: string
  authMethods: AuthMethod[]
  page: string
}

const dkScopes = ['address', 'ssn']
const noBankIdScopes = ['email', 'phone', 'address', 'ssn']
const noVippsScopes = ['email', 'phone', 'address', 'birthdate', 'ssn']

export const PROVIDERS : Provider[] = [
  {
    title: 'Finnish Trust Network',
    authMethods: [
      {
        title: 'BankID',
        acrValue: 'urn:grn:authn:fi:bank-id'
      },
      {
        title: 'Mobile certificate (Mobiilivarmenne)',
        acrValue: 'urn:grn:authn:fi:mobile-id'
      },
      {
        title: 'All (Both of the above)',
        acrValue: 'urn:grn:authn:fi:all'
      }
    ],
    page: '/verify/e-ids/finnish-trust-network'
  },
  {
    title: 'Danish MitID',
    authMethods: [
      {
        title: 'Low',
        acrValue: 'urn:grn:authn:dk:mitid:low',
        scopes: dkScopes
      },
      {
        title: 'Substantial',
        acrValue: 'urn:grn:authn:dk:mitid:substantial',
        scopes: dkScopes
      },
      {
        title: 'MitID Erhverv',
        acrValue: 'urn:grn:authn:dk:mitid:business',
        scopes: dkScopes
      }
    ],
    page: '/verify/e-ids/danish-mitid'
  },
  {
    title: 'Swedish BankID',
    authMethods: [
      {
        title: 'Same device',
        acrValue: 'urn:grn:authn:se:bankid:same-device'
      },
      {
        title: 'QR Code',
        acrValue: 'urn:grn:authn:se:bankid:another-device:qr'
      }
    ],
    page: '/verify/e-ids/swedish-bankid'
  },
  {
    title: 'ItsME',
    authMethods: [
      {
        title: 'Basic',
        acrValue: 'urn:grn:authn:itsme:basic'
      },
      {
        title: 'Advanced',
        acrValue: 'urn:grn:authn:itsme:advanced'
      }
    ],
    page: '/verify/e-ids/itsme'
  },
  {
    title: 'Norwegian BankID',
    authMethods: [{
      title: 'Norwegian BankID',
      acrValue: 'urn:grn:authn:no:bankid',
      scopes: noBankIdScopes
    },
    {
      title: 'Norwegian BankID Biometrics',
      acrValue: 'urn:grn:authn:no:bankid:substantial',
      scopes: noBankIdScopes
    }],
    page: '/verify/e-ids/norwegian-bankid'
  },
  {
    title: 'Norwegian Vipps',
    authMethods: [{
      title: 'Norwegian Vipps',
      acrValue: 'urn:grn:authn:no:vipps',
      scopes: noVippsScopes
    }],
    page: '/verify/e-ids/norwegian-vipps'
  },
  {
    title: 'Belgium',
    authMethods: [
      {
        title: 'Verified e-ID',
        acrValue: 'urn:grn:authn:be:eid:verified'
      }
    ],
    page: '/verify/e-ids/belgian-eid'
  }
];