import { CriiptoSignatures } from '@criipto/signatures';

const client = new CriiptoSignatures('{YOUR_CRIIPTO_CLIENT_ID}', '{YOUR_CRIIPTO_CLIENT_SECRET}');

const signatureOrder = await client.createSignatureOrder({
  title: 'Node.js Sample',
  documents: [
    {
      pdf: {
        title: 'Node.js Sample',
        blob: Buffer.from('...'), // Should be the buffer of a PDF file
        storageMode: 'Temporary',
      },
    },
  ],
  evidenceProviders: [
    {
      criiptoVerify: {
        acrValues: ['urn:grn:authn:se:bankid:same-device'],
        alwaysRedirect: true,
        scope: 'openid ssn',
        loginHint: 'message:U2lnbmluZyBkb2N1bWVudHM=',
      },
    },
  ],
});

console.log(signatureOrder.id);
