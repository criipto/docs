from criipto_signatures import CriiptoSignaturesSDKSync
from criipto_signatures.models import (
  CreateSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  DocumentStorageMode,
  AddSignatoriesInput,
  CreateSignatureOrderSignatoryInput,
  SignatoryDocumentInput,
  SignatoryEvidenceValidationInput,
  EvidenceProviderInput,
  CriiptoVerifyProviderInput,
)

client = CriiptoSignaturesSDKSync(
  "{YOUR_CRIIPTO_CLIENT_ID}", "{YOUR_CRIIPTO_CLIENT_SECRET}"
)

# Create signature order
signatureOrder = client.createSignatureOrder(
  CreateSignatureOrderInput(
    title="Python sample",
    documents=[
      DocumentInput(
        pdf=PadesDocumentInput(
          title="My document",
          blob=bytes("...", "utf-8"),  # bytes object, or a base64 encoded string
          storageMode=DocumentStorageMode.Temporary,
        ),
      )
    ],
    evidenceProviders=[
      EvidenceProviderInput(
        criiptoVerify=CriiptoVerifyProviderInput(scope="openid ssn")
      )
    ],
  )
)

# Add signatories
signatories = client.addSignatories(
  AddSignatoriesInput(
    signatureOrderId=signatureOrder.id,
    signatories=[
      CreateSignatureOrderSignatoryInput(
        reference="A",
        documents=[
          SignatoryDocumentInput(id=document.id, preapproved=True)
          for document in signatureOrder.documents
        ],
      ),
      CreateSignatureOrderSignatoryInput(
        reference="B",
        evidenceValidation=[
          SignatoryEvidenceValidationInput(
            key="cprNumberIdentifier", value="112233445555"
          )
        ],
      ),
    ],
  )
)

for signatory in signatories:
  print(
    signatory.href
  )  # Signing link, redirect user to this link, or send it in an email
