import { CriiptoSignatures } from '@criipto/signatures';

const client = new CriiptoSignatures('{YOUR_CRIIPTO_CLIENT_ID}', '{YOUR_CRIIPTO_CLIENT_SECRET}');

const [signatureOrderA, signatureOrderB] = await Promise.all([
  client.createSignatureOrder({
    documents: [
      {
        pdf: {
          title: 'A document',
          blob: Buffer.from('...'),
          storageMode: 'Temporary',
        },
      },
    ],
    signatories: [{}],
  }),
  client.createSignatureOrder({
    documents: [
      {
        pdf: {
          title: 'A document',
          blob: Buffer.from('...'),
          storageMode: 'Temporary',
        },
      },
    ],
    signatories: [{}],
  }),
]);
const batchSignatory = await client.createBatchSignatory({
  items: [
    {
      signatoryId: signatureOrderA.signatories[0].id,
      signatureOrderId: signatureOrderA.id,
    },
    {
      signatoryId: signatureOrderB.signatories[0].id,
      signatureOrderId: signatureOrderB.id,
    },
    // ...
  ],
});

console.log(batchSignatory.href);
