from criipto_signatures import CriiptoSignaturesSDKSync
from criipto_signatures.models import (
  CreateSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  DocumentStorageMode,
  AddSignatoryInput,
  SignatoryRole,
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
  )
)


# Add signatories
approverSignatory = client.addSignatory(
  AddSignatoryInput(
    signatureOrderId=signatureOrder.id, signatoryRole=SignatoryRole.APPROVER
  )
)

signerSignatory = client.addSignatory(
  AddSignatoryInput(
    signatureOrderId=signatureOrder.id, signatoryRole=SignatoryRole.SIGNER
  )
)

print(
  approverSignatory.href
)  # Approver link, redirect user to this link, or send it in an email


print(
  signerSignatory.href
)  # Signing link, redirect user to this link, or send it in an email
