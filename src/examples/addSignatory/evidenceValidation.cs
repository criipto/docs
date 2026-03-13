using Criipto.Signatures;
using Criipto.Signatures.Models;

using (var client = new CriiptoSignaturesClient("{YOUR_CRIIPTO_CLIENT_ID}", "{YOUR_CRIIPTO_CLIENT_SECRET}"))
{
    // Setup document input
    var documents = new List<DocumentInput>{
        new DocumentInput {
            pdf = new PadesDocumentInput {
                title = "Dotnet Sample",
                blob = new Byte[64], // Should be the bytes of a PDF file
                storageMode = DocumentStorageMode.Temporary
            }
        }
    };

    var evidenceProviders = new List<EvidenceProviderInput>() {
      new EvidenceProviderInput {
        criiptoVerify = new CriiptoVerifyProviderInput() {
          scope = "openid ssn",

        }
      }
    };

    // Setup signature order input
    var createSignatureOrderInput = new CreateSignatureOrderInput
    {
        title = "Dotnet Sample",
        documents = documents,
        evidenceProviders = evidenceProviders
    };

    // Create signature order
    var signatureOrder = await client.CreateSignatureOrder(createSignatureOrderInput);

    // Add signatory
    var signatory = await client.AddSignatory(
        signatureOrder.id,
        new AddSignatoryInput()
        {
            evidenceValidation = new List<SignatoryEvidenceValidationInput>() {
                new SignatoryEvidenceValidationInput() {
                    key = "cprNumberIdentifier",
                    value = "112233445555"
                }
            }
        }
    );
    Console.WriteLine(signatory.href); // Signing link, redirect user to this link, or send it in an email
}
