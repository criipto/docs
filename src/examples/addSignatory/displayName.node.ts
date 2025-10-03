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

// Add signatory
var signatory = await client.addSignatory(signatureOrder.id, {
  signatureAppearance: {
    identifierFromEvidence: [],
    displayName: [
      {
        template: '{{name}} of {{company}}',
        replacements: [
          {
            placeholder: 'name',
            fromEvidence: ['name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
          },
          {
            placeholder: 'company',
            fromEvidence: ['2.5.4.10'],
          },
        ],
      },
      {
        template: '{{name}}',
        replacements: [
          {
            placeholder: 'name',
            fromEvidence: ['name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
          },
        ],
      },
    ],
  },
});

console.log(signatory.href); // Signing link, redirect user to this link, or send it in an email
