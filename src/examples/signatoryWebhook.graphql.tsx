export const query = /* Signatures GraphQL */ `
query SignatoryWebhook($signatoryId: ID!) {
  signatory(id: $signatoryId) {
    status

    signatureOrder {
      id
    }
  }
}
`;
