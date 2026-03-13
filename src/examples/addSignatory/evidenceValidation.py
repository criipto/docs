from criipto_signatures import CriiptoSignaturesSDKSync
from criipto_signatures.models import (
  CreateSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  DocumentStorageMode,
  AddSignatoryInput,
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
        )
      )
    ],
    evidenceProviders=[
      EvidenceProviderInput(
        criiptoVerify=CriiptoVerifyProviderInput(scope="openid ssn")
      )
    ],
  )
)

# Add signatory
signatory = client.addSignatory(
  AddSignatoryInput(
    signatureOrderId=signatureOrder.id,
    evidenceValidation=[
      SignatoryEvidenceValidationInput(key="cprNumberIdentifier", value="112233445555")
    ],
  )
)

print(
  signatory.href
)  # Signing link, redirect user to this link, or send it in an email
