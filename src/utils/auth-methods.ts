type AuthMethod = {
  title: string;
  acrValue: string;
  scopes?: string[];
};

type Provider = {
  title: string;
  authMethods: AuthMethod[];
  page: string;
};

const dkScopes = ['address', 'ssn'];
const noBankIdScopes = ['email', 'phone', 'address', 'ssn'];
const noVippsScopes = ['email', 'phone', 'address', 'birthdate', 'ssn'];
const personalAusweisScopes = ['odis:Pseudonym', 'odis:Profile1', 'odis:Profile2', 'odis:Profile3'];
const frejaIdScopes = [
  'frejaid:email_address',
  'frejaid:all_email_addresses',
  'frejaid:all_phone_numbers',
  'frejaid:registration_level',
  'frejaid:basic_user_info',
  'frejaid:date_of_birth',
  'frejaid:age',
  'frejaid:ssn',
  'frejaid:addresses',
  'frejaid:document',
  'frejaid:photo',
  'frejaid:document_photo',
];

export const PROVIDERS: Provider[] = [
  {
    title: 'Finnish Trust Network',
    authMethods: [
      {
        title: 'BankID',
        acrValue: 'urn:grn:authn:fi:bank-id',
      },
      {
        title: 'Mobile certificate (Mobiilivarmenne)',
        acrValue: 'urn:grn:authn:fi:mobile-id',
      },
      {
        title: 'All (Both of the above)',
        acrValue: 'urn:grn:authn:fi:all',
      },
    ],
    page: '/verify/e-ids/finnish-trust-network',
  },
  {
    title: 'Danish MitID',
    authMethods: [
      {
        title: 'Low',
        acrValue: 'urn:grn:authn:dk:mitid:low',
        scopes: dkScopes,
      },
      {
        title: 'Substantial',
        acrValue: 'urn:grn:authn:dk:mitid:substantial',
        scopes: dkScopes,
      },
      {
        title: 'MitID Erhverv',
        acrValue: 'urn:grn:authn:dk:mitid:business',
        scopes: dkScopes,
      },
    ],
    page: '/verify/e-ids/danish-mitid',
  },
  {
    title: 'Swedish BankID',
    authMethods: [
      {
        title: 'Selector page',
        acrValue: 'urn:grn:authn:se:bankid',
      },
      {
        title: 'Same device',
        acrValue: 'urn:grn:authn:se:bankid:same-device',
      },
      {
        title: 'QR Code',
        acrValue: 'urn:grn:authn:se:bankid:another-device:qr',
      },
    ],
    page: '/verify/e-ids/swedish-bankid',
  },
  {
    title: 'Norwegian BankID',
    authMethods: [
      {
        title: 'Norwegian BankID',
        acrValue: 'urn:grn:authn:no:bankid',
        scopes: noBankIdScopes,
      },
      {
        title: 'Norwegian BankID Biometrics',
        acrValue: 'urn:grn:authn:no:bankid:substantial',
        scopes: noBankIdScopes,
      },
    ],
    page: '/verify/e-ids/norwegian-bankid',
  },
  {
    title: 'Vipps MobilePay',
    authMethods: [
      {
        title: 'Vipps MobilePay',
        acrValue: 'urn:grn:authn:no:vipps',
        scopes: noVippsScopes,
      },
    ],
    page: '/verify/e-ids/vipps-mobilepay',
  },
  {
    title: 'Netherlands',
    authMethods: [
      {
        title: 'iDIN',
        acrValue: 'urn:grn:authn:nl:idin',
      },
    ],
    page: '/verify/e-ids/dutch-idin',
  },
  {
    title: 'German Personalausweis',
    authMethods: [
      {
        title: 'German Personalausweis',
        acrValue: 'urn:grn:authn:de:personalausweis',
        scopes: personalAusweisScopes,
      },
    ],
    page: '/verify/e-ids/german-personalausweis',
  },
  {
    title: 'Swedish FrejaID',
    authMethods: [
      {
        title: 'Swedish FrejaID',
        acrValue: 'urn:grn:authn:se:frejaid',
        scopes: frejaIdScopes,
      },
    ],
    page: '/verify/e-ids/frejaid',
  },
  {
    title: 'Age verification',
    authMethods: [
      {
        title: 'Age verification',
        acrValue: 'urn:age-verification',
        scopes: ['is_over_15', 'is_over_16', 'is_over_18', 'is_over_21'],
      },
    ],
    page: '/verify/guides/age-verification/',
  },
];
