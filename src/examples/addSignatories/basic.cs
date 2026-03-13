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
            },
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

    // Add signatories
    var signatories = await client.AddSignatories(signatureOrder.id, new List<CreateSignatureOrderSignatoryInput>() {
        new CreateSignatureOrderSignatoryInput() {
            reference = "A",
            documents = signatureOrder.documents.Select(d => new SignatoryDocumentInput() {
                id = d.id,
                preapproved = true
            }).ToList()
        },
        new CreateSignatureOrderSignatoryInput() {
            reference = "B",
            evidenceValidation = new List<SignatoryEvidenceValidationInput>() {
                new SignatoryEvidenceValidationInput() {
                    key = "cprNumberIdentifier",
                    value = "112233445555"
                }
            }
        }
    });

    foreach (var signatory in signatories)
    {
        Console.WriteLine(signatory.href); // Signing link, redirect user to this link, or send it in an email
    }
}
