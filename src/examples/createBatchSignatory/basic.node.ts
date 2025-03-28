import CriiptoSignatures from "@criipto/signatures";

const client = new CriiptoSignatures(
  "{YOUR_CRIIPTO_CLIENT_ID}",
  "{YOUR_CRIIPTO_CLIENT_SECRET}"
);

const batchSignatory = await client.createBatchSignatory({
  items: [
    {
      signatoryId: "[signatoryA.id]",
      signatureOrderId: "[signatureOrderA.id]",
    },
    {
      signatoryId: "[signatoryB.id]",
      signatureOrderId: "[signatureOrderB.id]",
    },
    // ...
  ],
});

console.log(batchSignatory.href);
