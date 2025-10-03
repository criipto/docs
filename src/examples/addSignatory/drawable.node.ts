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
  evidenceProviders: [
    {
      enabledByDefault: false,
      drawable: {
        requireName: true,
      },
    },
  ],
});

// Find drawable evidence provider
const drawable = signatureOrder!.evidenceProviders.find(
  e => e.__typename === 'DrawableSignatureEvidenceProvider',
);

// Add signatory
var signatory = await client.addSignatory(signatureOrder.id, {
  evidenceProviders: [
    {
      id: drawable!.id,
    },
  ],
});

console.log(signatory.href); // Signing link, redirect user to this link, or send it in an email
