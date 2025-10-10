from criipto_signatures import CriiptoSignaturesSDKSync
from criipto_signatures.models import (
  CreateBatchSignatoryInput,
  BatchSignatoryItemInput,
  SignatoryUIInput,
  Language,
  CreateSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  DocumentStorageMode,
  CreateSignatureOrderSignatoryInput,
)


client = CriiptoSignaturesSDKSync(
  "{YOUR_CRIIPTO_CLIENT_ID}", "{YOUR_CRIIPTO_CLIENT_SECRET}"
)

signatureOrderA = client.createSignatureOrder(
  CreateSignatureOrderInput(
    documents=[
      DocumentInput(
        pdf=PadesDocumentInput(
          title="My document",
          blob=bytes("...", "utf-8"),  # bytes object, or a base64 encoded string
          storageMode=DocumentStorageMode.Temporary,
        ),
      )
    ],
    signatories=[CreateSignatureOrderSignatoryInput()],
  )
)
signatureOrderB = client.createSignatureOrder(
  CreateSignatureOrderInput(
    documents=[
      DocumentInput(
        pdf=PadesDocumentInput(
          title="My document",
          blob=bytes("...", "utf-8"),  # bytes object, or a base64 encoded string
          storageMode=DocumentStorageMode.Temporary,
        ),
      )
    ],
    signatories=[CreateSignatureOrderSignatoryInput()],
  )
)

batchSignatory = client.createBatchSignatory(
  CreateBatchSignatoryInput(
    ui=SignatoryUIInput(
      signatoryRedirectUri="https://example.com",
      language=Language.SV_SE,
    ),
    items=[
      BatchSignatoryItemInput(
        signatoryId=signatureOrderA.signatories[0].id,
        signatureOrderId=signatureOrderA.id,
      ),
      BatchSignatoryItemInput(
        signatoryId=signatureOrderB.signatories[0].id,
        signatureOrderId=signatureOrderB.id,
      ),
    ],
  )
)

print(batchSignatory.href)
