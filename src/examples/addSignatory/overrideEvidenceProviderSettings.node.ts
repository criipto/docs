import CriiptoSignatures from '@criipto/signatures';

const client = new CriiptoSignatures('{YOUR_CRIIPTO_CLIENT_ID}', '{YOUR_CRIIPTO_CLIENT_SECRET}');

// Create signature order
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
});

const criiptoVerifyEvidenceProviderId = signatureOrder.evidenceProviders.find(
  ep => ep.__typename === 'CriiptoVerifySignatureEvidenceProvider',
);

if (!criiptoVerifyEvidenceProviderId) throw new Error('Criipto Verify Evidence Provider not found');

// Add signatory
var signatory = await client.addSignatory(signatureOrder.id, {
  evidenceProviders: [
    {
      id: criiptoVerifyEvidenceProviderId.id,
      criiptoVerify: {
        acrValues: [
          'urn:grn:authn:dk:mitid:substantial',
          'urn:grn:authn:se:bankid:another-device:qr',
          'urn:grn:authn:no:bankid:substantial',
        ],
        message: 'signatory message',
        loginHint: 'signatory login hint',
      },
    },
  ],
});

console.log(signatory.href); // Signing link, redirect user to this link, or send it in an email
