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
});

// Add signatories
var approverSignatory = await client.addSignatory(signatureOrder.id, {
  signatoryRole: 'APPROVER'
});

var signerSignatory = await client.addSignatory(signatureOrder.id, {
  signatoryRole: 'SIGNER'
});

console.log(approverSignatory.href); // Approver link, redirect user to this link, or send it in an email
console.log(signerSignatory.href); // Signing link, redirect user to this link, or send it in an email
