from criipto_signatures import CriiptoSignaturesSDKSync
from criipto_signatures.models import (
  CreateSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  DocumentStorageMode,
  AddSignatoryInput,
  EvidenceProviderInput,
  DrawableEvidenceProviderInput,
  ChangeSignatoryInput,
  SignatoryEvidenceProviderInput,
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
        enabledByDefault=False,
        drawable=DrawableEvidenceProviderInput(requireName=True),
      )
    ],
  )
)

# Add signatory
signatory = client.addSignatory(AddSignatoryInput(signatureOrderId=signatureOrder.id))

# Find drawable evidence provider
drawable = signatureOrder.evidenceProviders[0]

# Change signatory to enable drawable
client.changeSignatory(
  ChangeSignatoryInput(
    signatoryId=signatory.id,
    evidenceProviders=[SignatoryEvidenceProviderInput(id=drawable.id)],
  )
)
