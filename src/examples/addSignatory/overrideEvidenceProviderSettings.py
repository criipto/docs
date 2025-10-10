from criipto_signatures import CriiptoSignaturesSDKSync
from criipto_signatures.models import (
  CreateSignatureOrderInput,
  DocumentInput,
  PadesDocumentInput,
  DocumentStorageMode,
  AddSignatoryInput,
  CriiptoVerifyProviderInput,
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
  )
)

# Add signatory
signatory = client.addSignatory(
  AddSignatoryInput(
    signatureOrderId=signatureOrder.id,
    evidenceProviders=[
      SignatoryEvidenceProviderInput(
        id=signatureOrder.evidenceProviders[0].id,
        criiptoVerify=CriiptoVerifyProviderInput(
          acrValues=[
            "urn:grn:authn:dk:mitid:substantial",
            "urn:grn:authn:se:bankid:another-device:qr",
            "urn:grn:authn:no:bankid:substantial",
          ],
          message="signatory message",
          loginHint="signatory login hint",
        ),
      )
    ],
  )
)

print(
  signatory.href
)  # Signing link, redirect user to this link, or send it in an email
