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

// Close signature order
const closedSignatureOrder = await client.closeSignatureOrder(signatureOrder.id, {
  retainDocumentsForDays: 7,
});

closedSignatureOrder.documents.forEach(document => {
  // document.blob is a Buffer containing the signed/closed PDF
  document.signatures?.forEach(signature => {
    console.log(signature.__typename);
    if (signature.__typename === 'JWTSignature') {
      // signature.jwt holds the authentication evidence used in the signature
      console.log(signature.jwt);
      // signature.claims hold the claims decoded from the authentication evidence JWT
      console.log(signature.claims);
    }
  });
});
