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
  ui: {
    signatoryRedirectUri: 'http://example.com',
    language: 'DA_DK',
    logo: {
      src: 'https://www.criipto.com/hubfs/logo.svg',
      href: 'https://www.criipto.com',
    },
    stylesheet: 'https://signatures-storybook.criipto.com/custom.css',
  },
});

console.log(signatureOrder.id);
