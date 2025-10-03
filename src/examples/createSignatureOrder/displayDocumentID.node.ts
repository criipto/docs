import CriiptoSignatures from '@criipto/signatures';

const client = new CriiptoSignatures('{YOUR_CRIIPTO_CLIENT_ID}', '{YOUR_CRIIPTO_CLIENT_SECRET}');

const signatureOrder = await client.createSignatureOrder({
  title: 'PDF Form Sample',
  documents: [
    {
      pdf: {
        title: 'PDF Form Sample',
        blob: Buffer.from('...'),
        storageMode: 'Temporary',
        displayDocumentID: 'TOP',
      },
    },
  ],
});

console.log(signatureOrder.id);
