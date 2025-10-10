import { CriiptoSignatures } from '@criipto/signatures';

const client = new CriiptoSignatures('{YOUR_CRIIPTO_CLIENT_ID}', '{YOUR_CRIIPTO_CLIENT_SECRET}');

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
  webhook: {
    url: 'https://httpbin.org/post',
    validateConnectivity: true,
    // Use a unique cryptographically random value for each signature order
    secret: Buffer.from('BOUGIXjJk2zjZUex74T25MzwdpYGZDmRJTptTpdSdE8=', 'base64'),
  },
});

console.log(signatureOrder.id);
