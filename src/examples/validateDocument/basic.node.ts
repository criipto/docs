import { CriiptoSignatures } from '@criipto/signatures';

const client = new CriiptoSignatures('{YOUR_CRIIPTO_CLIENT_ID}', '{YOUR_CRIIPTO_CLIENT_SECRET}');

// Create signature order
const result = await client.validateDocument({
  pdf: Buffer.from('...'), // Should be the buffer of a PDF file
});

console.log(result.valid); // Whether or not document is valid
console.log(result.errors); // Any errors
console.log(result.fixable); // If errors are fixable
