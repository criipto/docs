import { CriiptoSignatures } from '@criipto/signatures';

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

// Add signatory
var signatory = await client.addSignatory(signatureOrder.id);

// Find drawable evidence provider
const drawable = signatureOrder!.evidenceProviders.find(
  e => e.__typename === 'DrawableSignatureEvidenceProvider',
);

// Change signatory to enable drawable
await client.changeSignatory(signatory.id, {
  evidenceProviders: [
    {
      id: drawable!.id,
    },
  ],
});
