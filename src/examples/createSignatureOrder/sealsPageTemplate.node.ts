import CriiptoSignatures from '@criipto/signatures';

const client = new CriiptoSignatures('{YOUR_CRIIPTO_CLIENT_ID}', '{YOUR_CRIIPTO_CLIENT_SECRET}');

const signatureOrder = await client.createSignatureOrder({
  maxSignatories: 8,
  documents: [
    {
      pdf: {
        title: 'Example PDF',
        blob: Buffer.from('...'),
        storageMode: 'Temporary',

        sealsPageTemplate: {
          blob: Buffer.from('...'),
          area: { x1: 33, x2: 561, y1: 388, y2: 820 },
          expectedRows: 4,
          expectedColumns: 2,
        },
      },
    },
  ],
});

console.log(signatureOrder.id);
