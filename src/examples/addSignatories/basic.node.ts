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

// Add signatories
const signatories = await client.addSignatories(signatureOrder.id, {
  signatories: [
    {
      reference: 'A',
      documents: signatureOrder.documents.map(d => ({
        id: d.id,
        preapproved: true,
      })),
    },
    {
      reference: 'B',
      evidenceValidation: [
        {
          key: 'cprNumberIdentifier',
          value: '112233445555',
        },
      ],
    },
  ],
});

signatories.forEach(signatory => {
  console.log(signatory.href); // Signing link, redirect user to this link, or send it in an email
});
