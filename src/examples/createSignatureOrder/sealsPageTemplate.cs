using Criipto.Signatures;
using Criipto.Signatures.Models;

using (var client = new CriiptoSignaturesClient("{YOUR_CRIIPTO_CLIENT_ID}", "{YOUR_CRIIPTO_CLIENT_SECRET}")) {
    // Setup document input
    var documents = new List<DocumentInput>{
        new DocumentInput {
            pdf = new PadesDocumentInput {
                title = "Example PDF",
                blob = new Byte[64], // Should be the bytes of a PDF file
                storageMode = DocumentStorageMode.Temporary,

                sealsPageTemplate = new PadesDocumentSealsPageTemplateInput {
                    blob = new Byte[64], // Should be the bytes of a PDF file
                    area = new PdfBoundingBoxInput{x1 = 33, x2 = 561, y1 = 388, y2 = 820},
                    expectedRows = 4,
                    expectedColumns = 2,
                }
            }
        }
    };

    // Setup signature order input
    var createSignatureOrderInput = new CreateSignatureOrderInput
    {
        documents = documents,
        maxSignatories = 8  
    };

    // Create signature order
    var signatureOrder = await client.CreateSignatureOrder(createSignatureOrderInput);
}