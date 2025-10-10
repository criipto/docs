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
  ui: {
    language: 'DA_DK',
  },
});

// Add signatory with custom UI settings
var signatory = await client.addSignatory(signatureOrder.id, {
  ui: {
    signatoryRedirectUri: 'http://example.com',
    language: 'SV_SE',
    stylesheet: 'https://signatures-storybook.criipto.com/custom.css',
  },
});

console.log(signatory.href); // Signing link, redirect user to this link, or send it in an email
