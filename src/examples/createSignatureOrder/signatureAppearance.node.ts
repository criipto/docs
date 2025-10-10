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
  signatureAppearance: {
    identifierFromEvidence: [
      'cprNumberIdentifier',
      'dk:gov:saml:attribute:CprNumberIdentifier',
      'ssn',
      'http://schemas.grean.id/claims/se/ssn',
      'socialno',
      'http://schemas.grean.id/claims/no/socialno',
    ],
  },
});

console.log(signatureOrder.id);
