from criipto_signatures import CriiptoSignaturesSDKSync
from criipto_signatures.models import (
  CreateSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  DocumentStorageMode,
  AddSignatoryInput,
  PdfSealPosition,
  SignatoryDocumentInput,
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

# Add signatory
signatory = client.addSignatory(
  AddSignatoryInput(
    signatureOrderId=signatureOrder.id,
    documents=[
      SignatoryDocumentInput(
        id=document.id,
        pdfSealPositions=[
          PdfSealPosition(page=1, x=15, y=15, scale=0.7),
        ],
      )
      for document in signatureOrder.documents
    ],
  )
)

print(
  signatory.href
)  # Signing link, redirect user to this link, or send it in an email
