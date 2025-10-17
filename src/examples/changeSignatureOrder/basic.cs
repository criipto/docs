using Criipto.Signatures;
using Criipto.Signatures.Models;

using (var client = new CriiptoSignaturesClient("{YOUR_CRIIPTO_CLIENT_ID}", "{YOUR_CRIIPTO_CLIENT_SECRET}"))
{
    // Setup document input
    var documents = new List<DocumentInput>
    {
        new DocumentInput
        {
            pdf = new PadesDocumentInput
            {
                title = "Dotnet Sample",
                blob = new Byte[64], // Should be the bytes of a PDF file
                storageMode = DocumentStorageMode.Temporary
            }
        }
    };

    // Setup signature order input
    var createSignatureOrderInput = new CreateSignatureOrderInput
    {
        title = "Dotnet Sample",
        documents = documents,
        maxSignatories = 10
    };

    // Create signature order
    var signatureOrder = await client.CreateSignatureOrder(createSignatureOrderInput);

    // Change signature order to support 20 signatories
    await client.ChangeSignatureOrder(
        new ChangeSignatureOrderInput
        {
            signatureOrderId = signatureOrder.id,
            maxSignatories = 20
        }
    );
}
