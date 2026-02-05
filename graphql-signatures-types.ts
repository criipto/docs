export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Blob: { input: string; output: string; }
  Date: { input: string; output: string; }
  DateTime: { input: string; output: string; }
  URI: { input: string; output: string; }
};

export type AddSignatoriesInput = {
  signatories: Array<CreateSignatureOrderSignatoryInput>;
  signatureOrderId: Scalars['ID']['input'];
};

export type AddSignatoriesOutput = {
  __typename?: 'AddSignatoriesOutput';
  signatories: Array<Signatory>;
  signatureOrder: SignatureOrder;
};

export type AddSignatoryInput = {
  /** Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents. */
  documents?: InputMaybe<Array<SignatoryDocumentInput>>;
  /** Selectively enable evidence providers for this signatory. */
  evidenceProviders?: InputMaybe<Array<SignatoryEvidenceProviderInput>>;
  evidenceValidation?: InputMaybe<Array<SignatoryEvidenceValidationInput>>;
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  /** Deprecated in favor of 'signingAs'. Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output. */
  role?: InputMaybe<Scalars['String']['input']>;
  /** Denotes the signatory role, e.g. SIGNER or VIEWER. Defaults to SIGNER. */
  signatoryRole?: InputMaybe<SignatoryRole | '%future added value'>;
  signatureAppearance?: InputMaybe<SignatureAppearanceInput>;
  signatureOrderId: Scalars['ID']['input'];
  /** Define the who signatory is signing as, i.e., 'Chairman'. Will be visible in the document output. */
  signingAs?: InputMaybe<Scalars['String']['input']>;
  /** Defines signing sequence order for sequential signing. If two signatories have the same number they can sign in parallel. Default: 2147483647 */
  signingSequence?: InputMaybe<Scalars['Int']['input']>;
  /** Override UI settings for signatory, defaults to UI settings for signature order */
  ui?: InputMaybe<SignatoryUiInput>;
};

export type AddSignatoryOutput = {
  __typename?: 'AddSignatoryOutput';
  signatory: Signatory;
  signatureOrder: SignatureOrder;
};

export type AllOfEvidenceProviderInput = {
  providers: Array<SingleEvidenceProviderInput>;
};

export type AllOfSignatureEvidenceProvider = SignatureEvidenceProvider & {
  __typename?: 'AllOfSignatureEvidenceProvider';
  id: Scalars['ID']['output'];
  providers: Array<CriiptoVerifySignatureEvidenceProvider | DrawableSignatureEvidenceProvider | NoopSignatureEvidenceProvider | OidcJwtSignatureEvidenceProvider>;
};

export type AnonymousViewer = Viewer & {
  __typename?: 'AnonymousViewer';
  authenticated: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
};

export type Application = Viewer & {
  __typename?: 'Application';
  apiKeys: Array<ApplicationApiKey>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  signatureOrders: SignatureOrderConnection;
  /** Tenants are only accessable from user viewers */
  tenant?: Maybe<Tenant>;
  verifyApplication: VerifyApplication;
  webhookLogs: Array<WebhookExceptionInvocation | WebhookHttpErrorInvocation | WebhookSuccessfulInvocation | WebhookTimeoutInvocation>;
};


export type ApplicationSignatureOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<SignatureOrderStatus>;
};


export type ApplicationWebhookLogsArgs = {
  from: Scalars['String']['input'];
  succeeded?: InputMaybe<Scalars['Boolean']['input']>;
  to: Scalars['String']['input'];
};

export type ApplicationApiKey = {
  __typename?: 'ApplicationApiKey';
  clientId: Scalars['String']['output'];
  clientSecret?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mode: ApplicationApiKeyMode | '%future added value';
  note?: Maybe<Scalars['String']['output']>;
};

export enum ApplicationApiKeyMode {
  READ_ONLY = 'READ_ONLY',
  READ_WRITE = 'READ_WRITE'
}

export type BatchSignatory = {
  __typename?: 'BatchSignatory';
  href: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  items: Array<BatchSignatoryItem>;
  /** The authentication token required for performing batch operations. */
  token: Scalars['String']['output'];
  traceId: Scalars['String']['output'];
  ui: SignatureOrderUi;
};

export type BatchSignatoryItem = {
  __typename?: 'BatchSignatoryItem';
  signatory: Signatory;
  signatureOrder: SignatureOrder;
};

export type BatchSignatoryItemInput = {
  signatoryId: Scalars['String']['input'];
  signatureOrderId: Scalars['String']['input'];
};

export type BatchSignatoryViewer = Viewer & {
  __typename?: 'BatchSignatoryViewer';
  authenticated: Scalars['Boolean']['output'];
  batchSignatoryId: Scalars['ID']['output'];
  documents: SignatoryDocumentConnection;
  evidenceProviders: Array<AllOfSignatureEvidenceProvider | CriiptoVerifySignatureEvidenceProvider | DrawableSignatureEvidenceProvider | NoopSignatureEvidenceProvider | OidcJwtSignatureEvidenceProvider>;
  id: Scalars['ID']['output'];
  signer: Scalars['Boolean']['output'];
  status: SignatoryStatus | '%future added value';
  traceId: Scalars['String']['output'];
  ui: SignatureOrderUi;
};

export type CancelSignatureOrderInput = {
  signatureOrderId: Scalars['ID']['input'];
};

export type CancelSignatureOrderOutput = {
  __typename?: 'CancelSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type Certificate = {
  __typename?: 'Certificate';
  issuer: Scalars['String']['output'];
  raw: Scalars['Blob']['output'];
  subject: Scalars['String']['output'];
};

export type ChangeSignatoryInput = {
  /** Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents. */
  documents?: InputMaybe<Array<SignatoryDocumentInput>>;
  /** Selectively enable evidence providers for this signatory. */
  evidenceProviders?: InputMaybe<Array<SignatoryEvidenceProviderInput>>;
  evidenceValidation?: InputMaybe<Array<SignatoryEvidenceValidationInput>>;
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  /** Deprecated in favor of 'signingAs'. Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output. */
  role?: InputMaybe<Scalars['String']['input']>;
  signatoryId: Scalars['ID']['input'];
  signatureAppearance?: InputMaybe<SignatureAppearanceInput>;
  /** Define the who signatory is signing as, i.e., 'Chairman'. Will be visible in the document output. */
  signingAs?: InputMaybe<Scalars['String']['input']>;
  /** Defines signing sequence order for sequential signing. If two signatories have the same number they can sign in parallel. Default: 2147483647 */
  signingSequence?: InputMaybe<Scalars['Int']['input']>;
  /** Override UI settings for signatory, defaults to UI settings for signature order */
  ui?: InputMaybe<SignatoryUiInput>;
};

export type ChangeSignatoryOutput = {
  __typename?: 'ChangeSignatoryOutput';
  signatory: Signatory;
  signatureOrder: SignatureOrder;
};

export type ChangeSignatureOrderInput = {
  /** Max allowed signatories (as it influences pages needed for seals). Cannot be changed after first signer. */
  maxSignatories?: InputMaybe<Scalars['Int']['input']>;
  signatureOrderId: Scalars['ID']['input'];
  /** Signature order webhook settings */
  webhook?: InputMaybe<CreateSignatureOrderWebhookInput>;
};

export type ChangeSignatureOrderOutput = {
  __typename?: 'ChangeSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type CleanupSignatureOrderInput = {
  signatureOrderId: Scalars['ID']['input'];
};

export type CleanupSignatureOrderOutput = {
  __typename?: 'CleanupSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type CloseSignatureOrderInput = {
  /** Retains documents on Criipto servers after closing a signature order. You MUST manually call the cleanupSignatureOrder mutation when you are sure you have downloaded the blobs. Maximum value is 7 days. */
  retainDocumentsForDays?: InputMaybe<Scalars['Int']['input']>;
  signatureOrderId: Scalars['ID']['input'];
};

export type CloseSignatureOrderOutput = {
  __typename?: 'CloseSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type CompleteCriiptoVerifyEvidenceProviderInput = {
  code: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type CompleteCriiptoVerifyEvidenceProviderOutput = {
  __typename?: 'CompleteCriiptoVerifyEvidenceProviderOutput';
  jwt: Scalars['String']['output'];
};

export type CompositeSignature = Signature & {
  __typename?: 'CompositeSignature';
  signatory?: Maybe<Signatory>;
  signatures: Array<DrawableSignature | EmptySignature | JwtSignature | NorwegianBankIdSignature>;
  timestampToken: TimestampToken;
};

export type CreateApplicationApiKeyInput = {
  applicationId: Scalars['ID']['input'];
  mode?: InputMaybe<ApplicationApiKeyMode | '%future added value'>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateApplicationApiKeyOutput = {
  __typename?: 'CreateApplicationApiKeyOutput';
  apiKey: ApplicationApiKey;
  application: Application;
};

export type CreateApplicationInput = {
  name: Scalars['String']['input'];
  tenantId: Scalars['ID']['input'];
  verifyApplicationDomain: Scalars['String']['input'];
  verifyApplicationEnvironment: VerifyApplicationEnvironment | '%future added value';
  verifyApplicationRealm: Scalars['String']['input'];
};

export type CreateApplicationOutput = {
  __typename?: 'CreateApplicationOutput';
  apiKey: ApplicationApiKey;
  application: Application;
  tenant: Tenant;
};

export type CreateBatchSignatoryInput = {
  items: Array<BatchSignatoryItemInput>;
  /** UI settings for batch signatory, will use defaults otherwise (will not use UI settings from sub signatories) */
  ui?: InputMaybe<SignatoryUiInput>;
};

export type CreateBatchSignatoryOutput = {
  __typename?: 'CreateBatchSignatoryOutput';
  batchSignatory: BatchSignatory;
};

export type CreateSignatureOrderInput = {
  /** By default signatories will be prompted to sign with a Criipto Verify based e-ID, this setting disables it. */
  disableVerifyEvidenceProvider?: InputMaybe<Scalars['Boolean']['input']>;
  documents: Array<DocumentInput>;
  /** Define evidence providers for signature order if not using built-in Criipto Verify for e-IDs */
  evidenceProviders?: InputMaybe<Array<EvidenceProviderInput>>;
  /** Defines when a signatory must be validated, default is when signing, but can be expanded to also be required when viewing documents. */
  evidenceValidationStages?: InputMaybe<Array<EvidenceValidationStage | '%future added value'>>;
  /** When this signature order will auto-close/expire at exactly in one of the following ISO-8601 formats: yyyy-MM-ddTHH:mm:ssZ, yyyy-MM-ddTHH:mm:ss.ffZ, yyyy-MM-ddTHH:mm:ss.fffZ, yyyy-MM-ddTHH:mm:ssK, yyyy-MM-ddTHH:mm:ss.ffK, yyyy-MM-ddTHH:mm:ss.fffK. Cannot be provided with `expiresInDays`. */
  expiresAt?: InputMaybe<Scalars['String']['input']>;
  /** When this signature order will auto-close/expire. Default 90 days. Cannot be provided with `expiresAt` */
  expiresInDays?: InputMaybe<Scalars['Int']['input']>;
  /** Attempt to automatically fix document formatting errors if possible. Default 'true'. */
  fixDocumentFormattingErrors?: InputMaybe<Scalars['Boolean']['input']>;
  /** Max allowed signatories (as it influences pages needed for seals). Default 14. */
  maxSignatories?: InputMaybe<Scalars['Int']['input']>;
  signatories?: InputMaybe<Array<CreateSignatureOrderSignatoryInput>>;
  /** Configure appearance of signatures inside documents */
  signatureAppearance?: InputMaybe<SignatureAppearanceInput>;
  /** Timezone to render signature seals in, default UTC. */
  timezone?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  /** Various settings for how the UI is presented to the signatory. */
  ui?: InputMaybe<CreateSignatureOrderUiInput>;
  /** Signature order webhook settings */
  webhook?: InputMaybe<CreateSignatureOrderWebhookInput>;
};

export type CreateSignatureOrderOutput = {
  __typename?: 'CreateSignatureOrderOutput';
  application: Application;
  signatureOrder: SignatureOrder;
};

export type CreateSignatureOrderSignatoryInput = {
  /** Define a subset of documents for the signatory. Must be a non-empty list. Leave null for all documents. */
  documents?: InputMaybe<Array<SignatoryDocumentInput>>;
  /** Selectively enable evidence providers for this signatory. */
  evidenceProviders?: InputMaybe<Array<SignatoryEvidenceProviderInput>>;
  evidenceValidation?: InputMaybe<Array<SignatoryEvidenceValidationInput>>;
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  /** Deprecated in favor of 'signingAs'. Define a role for the signatory, i.e. 'Chairman'. Will be visible in the document output. */
  role?: InputMaybe<Scalars['String']['input']>;
  /** Denotes the signatory role, e.g. SIGNER or VIEWER. Defaults to SIGNER. */
  signatoryRole?: InputMaybe<SignatoryRole | '%future added value'>;
  signatureAppearance?: InputMaybe<SignatureAppearanceInput>;
  /** Define the who signatory is signing as, i.e., 'Chairman'. Will be visible in the document output. */
  signingAs?: InputMaybe<Scalars['String']['input']>;
  /** Defines signing sequence order for sequential signing. If two signatories have the same number they can sign in parallel. Default: 2147483647 */
  signingSequence?: InputMaybe<Scalars['Int']['input']>;
  /** Override UI settings for signatory, defaults to UI settings for signature order */
  ui?: InputMaybe<SignatoryUiInput>;
};

export type CreateSignatureOrderUiInput = {
  /** Removes the UI options to reject a document or signature order. */
  disableRejection?: InputMaybe<Scalars['Boolean']['input']>;
  /** Adds an UI option for the signatory to cancel, will return to 'signatoryRedirectUri' if defined. */
  enableCancel?: InputMaybe<Scalars['Boolean']['input']>;
  /** The language of texts rendered to the signatory. */
  language?: InputMaybe<Language | '%future added value'>;
  /** Define a logo to be shown in the signatory UI. */
  logo?: InputMaybe<SignatureOrderUiLogoInput>;
  /** Renders a UI layer for PDF annotations, such as links, making them interactive in the UI/browser */
  renderPdfAnnotationLayer?: InputMaybe<Scalars['Boolean']['input']>;
  /** The signatory will be redirected to this URL after signing or rejected the signature order. */
  signatoryRedirectUri?: InputMaybe<Scalars['String']['input']>;
  /** Add stylesheet/css via an absolute HTTPS URL. */
  stylesheet?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSignatureOrderWebhookInput = {
  /** If defined, webhook invocations will have a X-Criipto-Signature header containing a HMAC-SHA256 signature (as a base64 string) of the webhook request body (utf-8). The secret should be between 256 and 512 bits. */
  secret?: InputMaybe<Scalars['Blob']['input']>;
  /** Webhook url. POST requests will be executed towards this URL on certain signatory events. */
  url: Scalars['String']['input'];
  /** Validates webhook connectivity by triggering a WEBHOOK_VALIDATION event, your webhook must respond within 5 seconds with 200/OK or the signature order creation will fail. */
  validateConnectivity?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CriiptoVerifyEvidenceProviderRedirect = {
  __typename?: 'CriiptoVerifyEvidenceProviderRedirect';
  redirectUri: Scalars['String']['output'];
  state: Scalars['String']['output'];
};

export enum CriiptoVerifyEvidenceProviderVersion {
  /** Version 1 is the original version. Deprecated in favour of Version 2. */
  V1 = 'V1',
  /** Version 2 adds increased observability and newer signing features. */
  V2 = 'V2'
}

/** Criipto Verify based evidence for signatures. */
export type CriiptoVerifyProviderInput = {
  acrValues?: InputMaybe<Array<Scalars['String']['input']>>;
  alwaysRedirect?: InputMaybe<Scalars['Boolean']['input']>;
  /** Define additional valid audiences (besides the main client_id) for the Criipto Verify domain/issuer underlying the application. */
  audiences?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Set a custom login_hint for the underlying authentication request. */
  loginHint?: InputMaybe<Scalars['String']['input']>;
  /** Messages displayed when performing authentication (only supported by DKMitID currently). */
  message?: InputMaybe<Scalars['String']['input']>;
  /** Set a custom scope for the underlying authentication request. */
  scope?: InputMaybe<Scalars['String']['input']>;
  /** Enforces that signatories sign by unique evidence by comparing the values of previous evidence on the key you define. For Criipto Verify you likely want to use `sub` which is a unique pseudonym value present in all e-ID tokens issued. */
  uniqueEvidenceKey?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<CriiptoVerifyEvidenceProviderVersion | '%future added value'>;
};

export type CriiptoVerifySignatureEvidenceProvider = SignatureEvidenceProvider & SingleSignatureEvidenceProvider & {
  __typename?: 'CriiptoVerifySignatureEvidenceProvider';
  acrValues: Array<Scalars['String']['output']>;
  alwaysRedirect: Scalars['Boolean']['output'];
  audience: Scalars['String']['output'];
  audiences: Array<Scalars['String']['output']>;
  clientID: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  environment?: Maybe<VerifyApplicationEnvironment | '%future added value'>;
  id: Scalars['ID']['output'];
  loginHint?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  scope?: Maybe<Scalars['String']['output']>;
  version: CriiptoVerifyEvidenceProviderVersion | '%future added value';
};

export type DeleteApplicationApiKeyInput = {
  apiKeyId: Scalars['ID']['input'];
  applicationId: Scalars['ID']['input'];
};

export type DeleteApplicationApiKeyOutput = {
  __typename?: 'DeleteApplicationApiKeyOutput';
  application: Application;
};

export type DeleteSignatoryInput = {
  signatoryId: Scalars['ID']['input'];
  signatureOrderId: Scalars['ID']['input'];
};

export type DeleteSignatoryOutput = {
  __typename?: 'DeleteSignatoryOutput';
  signatureOrder: SignatureOrder;
};

export type DeviceInput = {
  os?: InputMaybe<DeviceOperatingSystem | '%future added value'>;
};

export enum DeviceOperatingSystem {
  ANDROID = 'ANDROID',
  IOS = 'IOS'
}

export type Document = {
  blob?: Maybe<Scalars['Blob']['output']>;
  id: Scalars['ID']['output'];
  originalBlob?: Maybe<Scalars['Blob']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  signatoryViewerStatus?: Maybe<SignatoryDocumentStatus | '%future added value'>;
  signatures?: Maybe<Array<CompositeSignature | DrawableSignature | EmptySignature | JwtSignature | NorwegianBankIdSignature>>;
  title: Scalars['String']['output'];
};

export enum DocumentIdLocation {
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TOP = 'TOP'
}

export type DocumentInput = {
  /** (BETA feature) When enabled, will allow any existing signatures to remain on the document. This disables recreation of the PDF document, which disables a number of features such as automatic seal placement, document id watermarking and custom seals area. */
  keepPreviousSignatures?: InputMaybe<Scalars['Boolean']['input']>;
  pdf?: InputMaybe<PadesDocumentInput>;
  /** When enabled, will remove any existing signatures from the document before storing. (PDF only) */
  removePreviousSignatures?: InputMaybe<Scalars['Boolean']['input']>;
  /** XML signing is coming soon, reach out to learn more. */
  xml?: InputMaybe<XadesDocumentInput>;
};

/** Document storage mode. Temporary documents will be deleted once completed. */
export enum DocumentStorageMode {
  /** Temporary documents will be deleted once completed. */
  Temporary = 'Temporary'
}

export type DownloadVerificationCriiptoVerifyInput = {
  jwt: Scalars['String']['input'];
};

export type DownloadVerificationInput = {
  criiptoVerify?: InputMaybe<DownloadVerificationCriiptoVerifyInput>;
  oidc?: InputMaybe<DownloadVerificationOidcInput>;
};

export type DownloadVerificationOidcInput = {
  jwt: Scalars['String']['input'];
};

/** Hand drawn signature evidence for signatures. */
export type DrawableEvidenceProviderInput = {
  /** Required minimum height of drawed area in pixels. */
  minimumHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Required minimum width of drawed area in pixels. */
  minimumWidth?: InputMaybe<Scalars['Int']['input']>;
  requireName?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DrawableSignature = Signature & SingleSignature & {
  __typename?: 'DrawableSignature';
  image: Scalars['Blob']['output'];
  name?: Maybe<Scalars['String']['output']>;
  signatory?: Maybe<Signatory>;
  timestampToken: TimestampToken;
};

export type DrawableSignatureEvidenceProvider = SignatureEvidenceProvider & SingleSignatureEvidenceProvider & {
  __typename?: 'DrawableSignatureEvidenceProvider';
  id: Scalars['ID']['output'];
  minimumHeight?: Maybe<Scalars['Int']['output']>;
  minimumWidth?: Maybe<Scalars['Int']['output']>;
  requireName: Scalars['Boolean']['output'];
};

export type EmptySignature = Signature & SingleSignature & {
  __typename?: 'EmptySignature';
  signatory?: Maybe<Signatory>;
  timestampToken: TimestampToken;
};

/** Must define a evidence provider subsection. */
export type EvidenceProviderInput = {
  allOf?: InputMaybe<AllOfEvidenceProviderInput>;
  /** Criipto Verify based evidence for signatures. */
  criiptoVerify?: InputMaybe<CriiptoVerifyProviderInput>;
  /** Hand drawn signature evidence for signatures. */
  drawable?: InputMaybe<DrawableEvidenceProviderInput>;
  /** Determined if this evidence provider should be enabled by signatories by default. Default true */
  enabledByDefault?: InputMaybe<Scalars['Boolean']['input']>;
  /** TEST environment only. Does not manipulate the PDF, use for integration or webhook testing. */
  noop?: InputMaybe<NoopEvidenceProviderInput>;
  /** Deprecated */
  oidc?: InputMaybe<OidcEvidenceProviderInput>;
};

export enum EvidenceValidationStage {
  SIGN = 'SIGN',
  /** Require the signatory to be validated before viewing documents */
  VIEW = 'VIEW'
}

export type ExtendSignatureOrderInput = {
  /** Expiration to add to order, in days, max 30. */
  additionalExpirationInDays: Scalars['Int']['input'];
  signatureOrderId: Scalars['ID']['input'];
};

export type ExtendSignatureOrderOutput = {
  __typename?: 'ExtendSignatureOrderOutput';
  signatureOrder: SignatureOrder;
};

export type JwtClaim = {
  __typename?: 'JWTClaim';
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type JwtSignature = Signature & SingleSignature & {
  __typename?: 'JWTSignature';
  claims: Array<JwtClaim>;
  jwks: Scalars['String']['output'];
  jwt: Scalars['String']['output'];
  signatory?: Maybe<Signatory>;
  timestampToken: TimestampToken;
};

export enum Language {
  DA_DK = 'DA_DK',
  EN_US = 'EN_US',
  NB_NO = 'NB_NO',
  SV_SE = 'SV_SE'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Add multiple signatures to your signature order. */
  addSignatories?: Maybe<AddSignatoriesOutput>;
  /** Add a signatory to your signature order. */
  addSignatory?: Maybe<AddSignatoryOutput>;
  /** Cancels the signature order without closing it, use if you no longer need a signature order. Documents are deleted from storage after cancelling. */
  cancelSignatureOrder?: Maybe<CancelSignatureOrderOutput>;
  /** Change an existing signatory */
  changeSignatory?: Maybe<ChangeSignatoryOutput>;
  /** Change an existing signature order */
  changeSignatureOrder?: Maybe<ChangeSignatureOrderOutput>;
  /** Cleans up the signature order and removes any saved documents from the servers. */
  cleanupSignatureOrder?: Maybe<CleanupSignatureOrderOutput>;
  /** Finalizes the documents in the signature order and returns them to you as blobs. Documents are deleted from storage after closing. */
  closeSignatureOrder?: Maybe<CloseSignatureOrderOutput>;
  completeCriiptoVerifyEvidenceProvider?: Maybe<CompleteCriiptoVerifyEvidenceProviderOutput>;
  /** Creates a signature application for a given tenant. */
  createApplication?: Maybe<CreateApplicationOutput>;
  /** Creates a new set of api credentials for an existing application. */
  createApplicationApiKey?: Maybe<CreateApplicationApiKeyOutput>;
  createBatchSignatory?: Maybe<CreateBatchSignatoryOutput>;
  /** Creates a signature order to be signed. */
  createSignatureOrder?: Maybe<CreateSignatureOrderOutput>;
  /** Deletes a set of API credentials for an application. */
  deleteApplicationApiKey?: Maybe<DeleteApplicationApiKeyOutput>;
  /** Delete a signatory from a signature order */
  deleteSignatory?: Maybe<DeleteSignatoryOutput>;
  /** Extends the expiration of the signature order. */
  extendSignatureOrder?: Maybe<ExtendSignatureOrderOutput>;
  /** Refreshes the client secret for an existing set of API credentials. Warning: The old client secret will stop working immediately. */
  refreshApplicationApiKey?: Maybe<RefreshApplicationApiKeyOutput>;
  /** Used by Signatory frontends to reject a signature order in full. */
  rejectSignatureOrder?: Maybe<RejectSignatureOrderOutput>;
  retrySignatureOrderWebhook?: Maybe<RetrySignatureOrderWebhookOutput>;
  /** Used by Signatory frontends to sign the documents in a signature order. */
  sign?: Maybe<SignOutput>;
  /** Sign with API credentials acting as a specific signatory. The signatory MUST be preapproved in this case. */
  signActingAs?: Maybe<SignActingAsOutput>;
  /** Signatory frontend use only. */
  signatoryBeacon?: Maybe<SignatoryBeaconOutput>;
  /** Signatory frontend use only. */
  startCriiptoVerifyEvidenceProvider?: Maybe<StartCriiptoVerifyEvidenceProviderOutput>;
  /** Signatory frontend use only. */
  trackSignatory?: Maybe<TrackSignatoryOutput>;
  /** Used by Signatory frontends to mark documents as opened, approved or rejected. */
  updateSignatoryDocumentStatus?: Maybe<UpdateSignatoryDocumentStatusOutput>;
  validateDocument?: Maybe<ValidateDocumentOutput>;
};


export type MutationAddSignatoriesArgs = {
  input: AddSignatoriesInput;
};


export type MutationAddSignatoryArgs = {
  input: AddSignatoryInput;
};


export type MutationCancelSignatureOrderArgs = {
  input: CancelSignatureOrderInput;
};


export type MutationChangeSignatoryArgs = {
  input: ChangeSignatoryInput;
};


export type MutationChangeSignatureOrderArgs = {
  input: ChangeSignatureOrderInput;
};


export type MutationCleanupSignatureOrderArgs = {
  input: CleanupSignatureOrderInput;
};


export type MutationCloseSignatureOrderArgs = {
  input: CloseSignatureOrderInput;
};


export type MutationCompleteCriiptoVerifyEvidenceProviderArgs = {
  input: CompleteCriiptoVerifyEvidenceProviderInput;
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};


export type MutationCreateApplicationApiKeyArgs = {
  input: CreateApplicationApiKeyInput;
};


export type MutationCreateBatchSignatoryArgs = {
  input: CreateBatchSignatoryInput;
};


export type MutationCreateSignatureOrderArgs = {
  input: CreateSignatureOrderInput;
};


export type MutationDeleteApplicationApiKeyArgs = {
  input: DeleteApplicationApiKeyInput;
};


export type MutationDeleteSignatoryArgs = {
  input: DeleteSignatoryInput;
};


export type MutationExtendSignatureOrderArgs = {
  input: ExtendSignatureOrderInput;
};


export type MutationRefreshApplicationApiKeyArgs = {
  input: RefreshApplicationApiKeyInput;
};


export type MutationRejectSignatureOrderArgs = {
  input: RejectSignatureOrderInput;
};


export type MutationRetrySignatureOrderWebhookArgs = {
  input: RetrySignatureOrderWebhookInput;
};


export type MutationSignArgs = {
  input: SignInput;
};


export type MutationSignActingAsArgs = {
  input: SignActingAsInput;
};


export type MutationSignatoryBeaconArgs = {
  input: SignatoryBeaconInput;
};


export type MutationStartCriiptoVerifyEvidenceProviderArgs = {
  input: StartCriiptoVerifyEvidenceProviderInput;
};


export type MutationTrackSignatoryArgs = {
  input: TrackSignatoryInput;
};


export type MutationUpdateSignatoryDocumentStatusArgs = {
  input: UpdateSignatoryDocumentStatusInput;
};


export type MutationValidateDocumentArgs = {
  input: ValidateDocumentInput;
};

/** TEST only. Allows empty signatures for testing. */
export type NoopEvidenceProviderInput = {
  name: Scalars['String']['input'];
};

export type NoopSignatureEvidenceProvider = SignatureEvidenceProvider & SingleSignatureEvidenceProvider & {
  __typename?: 'NoopSignatureEvidenceProvider';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type NorwegianBankIdSignature = Signature & SingleSignature & {
  __typename?: 'NorwegianBankIdSignature';
  claims: Array<JwtClaim>;
  signatory?: Maybe<Signatory>;
  signingCertificate: Certificate;
  timestampToken: TimestampToken;
};

/** OIDC/JWT based evidence for signatures. */
export type OidcEvidenceProviderInput = {
  acrValues?: InputMaybe<Array<Scalars['String']['input']>>;
  alwaysRedirect?: InputMaybe<Scalars['Boolean']['input']>;
  audience: Scalars['String']['input'];
  clientID: Scalars['String']['input'];
  domain: Scalars['String']['input'];
  name: Scalars['String']['input'];
  /** Enforces that signatories sign by unique evidence by comparing the values of previous evidence on the key you define. */
  uniqueEvidenceKey?: InputMaybe<Scalars['String']['input']>;
};

export type OidcJwtSignatureEvidenceProvider = SignatureEvidenceProvider & SingleSignatureEvidenceProvider & {
  __typename?: 'OidcJWTSignatureEvidenceProvider';
  acrValues: Array<Scalars['String']['output']>;
  alwaysRedirect: Scalars['Boolean']['output'];
  clientID: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type PadesDocumentFormInput = {
  enabled: Scalars['Boolean']['input'];
};

export type PadesDocumentInput = {
  blob: Scalars['Blob']['input'];
  /** Will add a unique identifier for the document to the specified margin of each page. Useful when printing signed documents. */
  displayDocumentID?: InputMaybe<DocumentIdLocation | '%future added value'>;
  form?: InputMaybe<PadesDocumentFormInput>;
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  removeBookmarks?: InputMaybe<Scalars['Boolean']['input']>;
  sealsPageTemplate?: InputMaybe<PadesDocumentSealsPageTemplateInput>;
  storageMode: DocumentStorageMode | '%future added value';
  title: Scalars['String']['input'];
};

export type PadesDocumentSealsPageTemplateInput = {
  /** Using the PDF coordinate system, with (x1, y1) being bottom-left */
  area: PdfBoundingBoxInput;
  /** Must be a PDF containing a SINGLE page */
  blob: Scalars['Blob']['input'];
  /** Validate that the defined seal area produces the expected number of columns, will error if expectation is not met */
  expectedColumns?: InputMaybe<Scalars['Int']['input']>;
  /** Validate that the defined seal area produces the expected number of rows, will error if expectation is not met */
  expectedRows?: InputMaybe<Scalars['Int']['input']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PdfBoundingBoxInput = {
  x1: Scalars['Float']['input'];
  x2: Scalars['Float']['input'];
  y1: Scalars['Float']['input'];
  y2: Scalars['Float']['input'];
};

export type PdfDocument = Document & {
  __typename?: 'PdfDocument';
  blob?: Maybe<Scalars['Blob']['output']>;
  /** Same value as stamped on document when using displayDocumentID */
  documentID: Scalars['String']['output'];
  form?: Maybe<PdfDocumentForm>;
  id: Scalars['ID']['output'];
  originalBlob?: Maybe<Scalars['Blob']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  signatoryViewerStatus?: Maybe<SignatoryDocumentStatus | '%future added value'>;
  signatures?: Maybe<Array<CompositeSignature | DrawableSignature | EmptySignature | JwtSignature | NorwegianBankIdSignature>>;
  title: Scalars['String']['output'];
};

export type PdfDocumentForm = {
  __typename?: 'PdfDocumentForm';
  enabled: Scalars['Boolean']['output'];
};

export type PdfSealPosition = {
  page: Scalars['Int']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  application?: Maybe<Application>;
  batchSignatory?: Maybe<BatchSignatory>;
  document?: Maybe<PdfDocument | XmlDocument>;
  /** Query a signatory by id. Useful when using webhooks. */
  signatory?: Maybe<Signatory>;
  signatureOrder?: Maybe<SignatureOrder>;
  /** Tenants are only accessable from user viewers */
  tenant?: Maybe<Tenant>;
  timezones: Array<Scalars['String']['output']>;
  viewer: AnonymousViewer | Application | BatchSignatoryViewer | SignatoryViewer | UnvalidatedSignatoryViewer | UserViewer;
};


export type QueryApplicationArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  verifyApplication?: InputMaybe<VerifyApplicationQueryInput>;
};


export type QueryBatchSignatoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySignatoryArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySignatureOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTenantArgs = {
  id: Scalars['ID']['input'];
};

export type RefreshApplicationApiKeyInput = {
  apiKeyId: Scalars['ID']['input'];
  applicationId: Scalars['ID']['input'];
};

export type RefreshApplicationApiKeyOutput = {
  __typename?: 'RefreshApplicationApiKeyOutput';
  apiKey: ApplicationApiKey;
  application: Application;
};

export type RejectSignatureOrderInput = {
  dummy: Scalars['Boolean']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type RejectSignatureOrderOutput = {
  __typename?: 'RejectSignatureOrderOutput';
  viewer: AnonymousViewer | Application | BatchSignatoryViewer | SignatoryViewer | UnvalidatedSignatoryViewer | UserViewer;
};

export type RetrySignatureOrderWebhookInput = {
  retryPayload: Scalars['String']['input'];
  signatureOrderId: Scalars['ID']['input'];
};

export type RetrySignatureOrderWebhookOutput = {
  __typename?: 'RetrySignatureOrderWebhookOutput';
  invocation: WebhookExceptionInvocation | WebhookHttpErrorInvocation | WebhookSuccessfulInvocation | WebhookTimeoutInvocation;
};

export type SignActingAsInput = {
  evidence: SignInput;
  signatoryId: Scalars['ID']['input'];
};

export type SignActingAsOutput = {
  __typename?: 'SignActingAsOutput';
  signatory: Signatory;
  signatureOrder: SignatureOrder;
};

export type SignAllOfInput = {
  criiptoVerify?: InputMaybe<SignCriiptoVerifyInput>;
  criiptoVerifyV2?: InputMaybe<SignCriiptoVerifyV2Input>;
  drawable?: InputMaybe<SignDrawableInput>;
  noop?: InputMaybe<Scalars['Boolean']['input']>;
  oidc?: InputMaybe<SignOidcInput>;
};

export type SignCriiptoVerifyInput = {
  jwt: Scalars['String']['input'];
};

export type SignCriiptoVerifyV2Input = {
  code: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type SignDocumentFormFieldInput = {
  field: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type SignDocumentFormInput = {
  fields: Array<SignDocumentFormFieldInput>;
};

export type SignDocumentInput = {
  form?: InputMaybe<SignDocumentFormInput>;
  id: Scalars['ID']['input'];
};

export type SignDrawableInput = {
  image: Scalars['Blob']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SignInput = {
  allOf?: InputMaybe<SignAllOfInput>;
  criiptoVerify?: InputMaybe<SignCriiptoVerifyInput>;
  criiptoVerifyV2?: InputMaybe<SignCriiptoVerifyV2Input>;
  documents?: InputMaybe<Array<SignDocumentInput>>;
  drawable?: InputMaybe<SignDrawableInput>;
  /** EvidenceProvider id */
  id: Scalars['ID']['input'];
  noop?: InputMaybe<Scalars['Boolean']['input']>;
  oidc?: InputMaybe<SignOidcInput>;
};

export type SignOidcInput = {
  jwt: Scalars['String']['input'];
};

export type SignOutput = {
  __typename?: 'SignOutput';
  viewer: AnonymousViewer | Application | BatchSignatoryViewer | SignatoryViewer | UnvalidatedSignatoryViewer | UserViewer;
};

export type Signatory = {
  __typename?: 'Signatory';
  documents: SignatoryDocumentConnection;
  /** A download link for signatories to download their signed documents. Signatories must verify their identity before downloading. Can be used when signature order is closed with document retention. */
  downloadHref?: Maybe<Scalars['String']['output']>;
  evidenceProviders: Array<AllOfSignatureEvidenceProvider | CriiptoVerifySignatureEvidenceProvider | DrawableSignatureEvidenceProvider | NoopSignatureEvidenceProvider | OidcJwtSignatureEvidenceProvider>;
  /** A link to the signatures frontend, you can send this link to your users to enable them to sign your documents. */
  href: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  reference?: Maybe<Scalars['String']['output']>;
  /** @deprecated Deprecated in favor of signingAs */
  role?: Maybe<Scalars['String']['output']>;
  signatoryRole: SignatoryRole | '%future added value';
  /** Signature order for the signatory. */
  signatureOrder: SignatureOrder;
  signingAs?: Maybe<Scalars['String']['output']>;
  signingSequence: SignatorySigningSequence;
  spanId: Scalars['String']['output'];
  /** The current status of the signatory. */
  status: SignatoryStatus | '%future added value';
  /** The reason for the signatory status (rejection reason when rejected). */
  statusReason?: Maybe<Scalars['String']['output']>;
  /** The signature frontend authentication token, only required if you need to build a custom url. */
  token: Scalars['String']['output'];
  traceId: Scalars['String']['output'];
  ui: SignatureOrderUi;
};

export type SignatoryBeaconInput = {
  lastActionAt: Scalars['DateTime']['input'];
  /** Used to determine if there is clock skew between client and server. */
  now?: InputMaybe<Scalars['DateTime']['input']>;
};

export type SignatoryBeaconOutput = {
  __typename?: 'SignatoryBeaconOutput';
  viewer: AnonymousViewer | Application | BatchSignatoryViewer | SignatoryViewer | UnvalidatedSignatoryViewer | UserViewer;
};

export type SignatoryDocumentConnection = {
  __typename?: 'SignatoryDocumentConnection';
  edges: Array<SignatoryDocumentEdge>;
};

export type SignatoryDocumentEdge = {
  __typename?: 'SignatoryDocumentEdge';
  node: PdfDocument | XmlDocument;
  status?: Maybe<SignatoryDocumentStatus | '%future added value'>;
};

export type SignatoryDocumentInput = {
  id: Scalars['ID']['input'];
  /** Deprecated in favor of `pdfSealPositions`. Define custom position for PDF seal. Uses PDF coordinate system (bottom-left as 0,0). If defined for one signatory/document, must be defined for all. */
  pdfSealPosition?: InputMaybe<PdfSealPosition>;
  /** Define custom positions for PDF seals. Uses PDF coordinate system (bottom-left as 0,0). If defined for one signatory/document, must be defined for all. */
  pdfSealPositions?: InputMaybe<Array<PdfSealPosition>>;
  preapproved?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum SignatoryDocumentStatus {
  APPROVED = 'APPROVED',
  OPENED = 'OPENED',
  PREAPPROVED = 'PREAPPROVED',
  REJECTED = 'REJECTED',
  SIGNED = 'SIGNED'
}

export type SignatoryEvidenceProviderInput = {
  allOf?: InputMaybe<AllOfEvidenceProviderInput>;
  /** Criipto Verify based evidence for signatures. */
  criiptoVerify?: InputMaybe<CriiptoVerifyProviderInput>;
  /** Hand drawn signature evidence for signatures. */
  drawable?: InputMaybe<DrawableEvidenceProviderInput>;
  id: Scalars['ID']['input'];
  /** TEST environment only. Does not manipulate the PDF, use for integration or webhook testing. */
  noop?: InputMaybe<NoopEvidenceProviderInput>;
  /** Deprecated */
  oidc?: InputMaybe<OidcEvidenceProviderInput>;
};

export type SignatoryEvidenceValidationInput = {
  boolean?: InputMaybe<Scalars['Boolean']['input']>;
  key: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export enum SignatoryFrontendEvent {
  DOWNLOAD_LINK_OPENED = 'DOWNLOAD_LINK_OPENED',
  SIGN_LINK_OPENED = 'SIGN_LINK_OPENED'
}

export enum SignatoryRole {
  APPROVER = 'APPROVER',
  SIGNER = 'SIGNER',
  VIEWER = 'VIEWER'
}

export type SignatorySigningSequence = {
  __typename?: 'SignatorySigningSequence';
  initialNumber: Scalars['Int']['output'];
};

export enum SignatoryStatus {
  APPROVED = 'APPROVED',
  DELETED = 'DELETED',
  ERROR = 'ERROR',
  OPEN = 'OPEN',
  REJECTED = 'REJECTED',
  SIGNED = 'SIGNED'
}

export type SignatoryUiInput = {
  /** Removes the UI options to reject a document or signature order. */
  disableRejection?: InputMaybe<Scalars['Boolean']['input']>;
  /** Adds an UI option for the signatory to cancel, will return to 'signatoryRedirectUri' if defined. */
  enableCancel?: InputMaybe<Scalars['Boolean']['input']>;
  /** The language of texts rendered to the signatory. */
  language?: InputMaybe<Language | '%future added value'>;
  /** Define a logo to be shown in the signatory UI. */
  logo?: InputMaybe<SignatureOrderUiLogoInput>;
  /** Renders a UI layer for PDF annotations, such as links, making them interactive in the UI/browser */
  renderPdfAnnotationLayer?: InputMaybe<Scalars['Boolean']['input']>;
  /** The signatory will be redirected to this URL after signing or rejected the signature order. */
  signatoryRedirectUri?: InputMaybe<Scalars['String']['input']>;
  /** Add stylesheet/css via an absolute HTTPS URL. */
  stylesheet?: InputMaybe<Scalars['String']['input']>;
};

export type SignatoryViewer = Viewer & {
  __typename?: 'SignatoryViewer';
  authenticated: Scalars['Boolean']['output'];
  documents: SignatoryDocumentConnection;
  download?: Maybe<SignatoryViewerDownload>;
  evidenceProviders: Array<AllOfSignatureEvidenceProvider | CriiptoVerifySignatureEvidenceProvider | DrawableSignatureEvidenceProvider | NoopSignatureEvidenceProvider | OidcJwtSignatureEvidenceProvider>;
  id: Scalars['ID']['output'];
  role: SignatoryRole | '%future added value';
  signatoryId: Scalars['ID']['output'];
  signatureOrderStatus: SignatureOrderStatus | '%future added value';
  signer: Scalars['Boolean']['output'];
  status: SignatoryStatus | '%future added value';
  traceId: Scalars['String']['output'];
  ui: SignatureOrderUi;
};


export type SignatoryViewerDownloadArgs = {
  verification?: InputMaybe<DownloadVerificationInput>;
};

export type SignatoryViewerDownload = {
  __typename?: 'SignatoryViewerDownload';
  documents?: Maybe<SignatoryDocumentConnection>;
  expired: Scalars['Boolean']['output'];
  verificationEvidenceProvider?: Maybe<AllOfSignatureEvidenceProvider | CriiptoVerifySignatureEvidenceProvider | DrawableSignatureEvidenceProvider | NoopSignatureEvidenceProvider | OidcJwtSignatureEvidenceProvider>;
  verificationRequired: Scalars['Boolean']['output'];
};

/** Represents a signature on a document. */
export type Signature = {
  signatory?: Maybe<Signatory>;
  timestampToken: TimestampToken;
};

export type SignatureAppearanceInput = {
  displayName?: InputMaybe<Array<SignatureAppearanceTemplateInput>>;
  footer?: InputMaybe<Array<SignatureAppearanceTemplateInput>>;
  headerLeft?: InputMaybe<Array<SignatureAppearanceTemplateInput>>;
  /** Render evidence claim as identifier in the signature appearance inside the document. You can supply multiple keys and they will be tried in order. If no key is found a GUID will be rendered. */
  identifierFromEvidence: Array<Scalars['String']['input']>;
};

export type SignatureAppearanceTemplateInput = {
  replacements?: InputMaybe<Array<SignatureAppearanceTemplateReplacementInput>>;
  template: Scalars['String']['input'];
};

export type SignatureAppearanceTemplateReplacementInput = {
  fromEvidence: Array<Scalars['String']['input']>;
  placeholder: Scalars['String']['input'];
};

export type SignatureEvidenceProvider = {
  id: Scalars['ID']['output'];
};

export type SignatureOrder = {
  __typename?: 'SignatureOrder';
  application?: Maybe<Application>;
  closedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  documents: Array<PdfDocument | XmlDocument>;
  evidenceProviders: Array<AllOfSignatureEvidenceProvider | CriiptoVerifySignatureEvidenceProvider | DrawableSignatureEvidenceProvider | NoopSignatureEvidenceProvider | OidcJwtSignatureEvidenceProvider>;
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Number of max signatories for the signature order */
  maxSignatories: Scalars['Int']['output'];
  /** List of signatories for the signature order. */
  signatories: Array<Signatory>;
  status: SignatureOrderStatus | '%future added value';
  /** Tenants are only accessable from user viewers */
  tenant?: Maybe<Tenant>;
  timezone: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  traceId: Scalars['String']['output'];
  ui: SignatureOrderUi;
  webhook?: Maybe<SignatureOrderWebhook>;
};

/** A connection from an object to a list of objects of type SignatureOrder */
export type SignatureOrderConnection = {
  __typename?: 'SignatureOrderConnection';
  /** Information to aid in pagination. */
  edges: Array<SignatureOrderEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A count of the total number of objects in this connection, ignoring pagination. This allows a client to fetch the first five objects by passing \"5\" as the argument to `first`, then fetch the total count so it could display \"5 of 83\", for example. In cases where we employ infinite scrolling or don't have an exact count of entries, this field will return `null`. */
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** An edge in a connection from an object to another object of type SignatureOrder */
export type SignatureOrderEdge = {
  __typename?: 'SignatureOrderEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. Must NOT be an enumerable collection. */
  node: SignatureOrder;
};

export enum SignatureOrderStatus {
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
  OPEN = 'OPEN'
}

export type SignatureOrderUi = {
  __typename?: 'SignatureOrderUI';
  disableRejection: Scalars['Boolean']['output'];
  enableCancel: Scalars['Boolean']['output'];
  language: Language | '%future added value';
  logo?: Maybe<SignatureOrderUiLogo>;
  renderPdfAnnotationLayer: Scalars['Boolean']['output'];
  signatoryRedirectUri?: Maybe<Scalars['String']['output']>;
  stylesheet?: Maybe<Scalars['String']['output']>;
};

export type SignatureOrderUiLogo = {
  __typename?: 'SignatureOrderUILogo';
  href?: Maybe<Scalars['String']['output']>;
  src: Scalars['String']['output'];
};

export type SignatureOrderUiLogoInput = {
  /** Turns your logo into a link with the defined href. */
  href?: InputMaybe<Scalars['String']['input']>;
  /** The image source for the logo. Must be an absolute HTTPS URL or a valid data: url */
  src: Scalars['String']['input'];
};

export type SignatureOrderWebhook = {
  __typename?: 'SignatureOrderWebhook';
  logs: Array<WebhookExceptionInvocation | WebhookHttpErrorInvocation | WebhookSuccessfulInvocation | WebhookTimeoutInvocation>;
  url: Scalars['String']['output'];
};


export type SignatureOrderWebhookLogsArgs = {
  from: Scalars['String']['input'];
  succeeded?: InputMaybe<Scalars['Boolean']['input']>;
  to: Scalars['String']['input'];
};

/** Must define a evidence provider subsection. */
export type SingleEvidenceProviderInput = {
  /** Criipto Verify based evidence for signatures. */
  criiptoVerify?: InputMaybe<CriiptoVerifyProviderInput>;
  /** Hand drawn signature evidence for signatures. */
  drawable?: InputMaybe<DrawableEvidenceProviderInput>;
  /** TEST environment only. Does not manipulate the PDF, use for integration or webhook testing. */
  noop?: InputMaybe<NoopEvidenceProviderInput>;
  /** Deprecated */
  oidc?: InputMaybe<OidcEvidenceProviderInput>;
};

export type SingleSignature = {
  signatory?: Maybe<Signatory>;
};

export type SingleSignatureEvidenceProvider = {
  id: Scalars['ID']['output'];
};

export type StartCriiptoVerifyEvidenceProviderInput = {
  acrValue: Scalars['String']['input'];
  device?: InputMaybe<DeviceInput>;
  id: Scalars['ID']['input'];
  /** Use the id_token of a previous login to infer, for instance, reauthentication or other hints for the next login. */
  idTokenHint?: InputMaybe<Scalars['String']['input']>;
  redirectUri: Scalars['String']['input'];
  stage: EvidenceValidationStage | '%future added value';
};

export type StartCriiptoVerifyEvidenceProviderOutput = CriiptoVerifyEvidenceProviderRedirect;

export type Tenant = {
  __typename?: 'Tenant';
  applications: Array<Application>;
  id: Scalars['ID']['output'];
  webhookLogs: Array<WebhookExceptionInvocation | WebhookHttpErrorInvocation | WebhookSuccessfulInvocation | WebhookTimeoutInvocation>;
};


export type TenantApplicationsArgs = {
  domain?: InputMaybe<Scalars['String']['input']>;
};


export type TenantWebhookLogsArgs = {
  from: Scalars['String']['input'];
  succeeded?: InputMaybe<Scalars['Boolean']['input']>;
  to: Scalars['String']['input'];
};

export type TimestampToken = {
  __typename?: 'TimestampToken';
  timestamp: Scalars['Date']['output'];
};

export type TrackSignatoryInput = {
  event: SignatoryFrontendEvent | '%future added value';
};

export type TrackSignatoryOutput = {
  __typename?: 'TrackSignatoryOutput';
  viewer: AnonymousViewer | Application | BatchSignatoryViewer | SignatoryViewer | UnvalidatedSignatoryViewer | UserViewer;
};

export type UnvalidatedSignatoryViewer = Viewer & {
  __typename?: 'UnvalidatedSignatoryViewer';
  authenticated: Scalars['Boolean']['output'];
  download?: Maybe<SignatoryViewerDownload>;
  evidenceProviders: Array<AllOfSignatureEvidenceProvider | CriiptoVerifySignatureEvidenceProvider | DrawableSignatureEvidenceProvider | NoopSignatureEvidenceProvider | OidcJwtSignatureEvidenceProvider>;
  id: Scalars['ID']['output'];
  signatoryId: Scalars['ID']['output'];
  ui: SignatureOrderUi;
};


export type UnvalidatedSignatoryViewerDownloadArgs = {
  verification?: InputMaybe<DownloadVerificationInput>;
};

export type UpdateSignatoryDocumentStatusInput = {
  documentId: Scalars['ID']['input'];
  status: SignatoryDocumentStatus | '%future added value';
};

export type UpdateSignatoryDocumentStatusOutput = {
  __typename?: 'UpdateSignatoryDocumentStatusOutput';
  documentEdge: SignatoryDocumentEdge;
  viewer: AnonymousViewer | Application | BatchSignatoryViewer | SignatoryViewer | UnvalidatedSignatoryViewer | UserViewer;
};

export type UserViewer = Viewer & {
  __typename?: 'UserViewer';
  authenticated: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  tenants: Array<Tenant>;
};

export type ValidateDocumentInput = {
  pdf?: InputMaybe<Scalars['Blob']['input']>;
  xml?: InputMaybe<Scalars['Blob']['input']>;
};

export type ValidateDocumentOutput = {
  __typename?: 'ValidateDocumentOutput';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  /** Whether or not the errors are fixable using 'fixDocumentFormattingErrors' */
  fixable?: Maybe<Scalars['Boolean']['output']>;
  /** `true` if the document contains bookmarks. If the value is `null`, we were unable to determine whether the document has any bookmarks. */
  hasBookmarks?: Maybe<Scalars['Boolean']['output']>;
  /** `true` if the document contains signatures. If value is `null`, we were unable to determine whether the document has been previously signed. */
  previouslySigned?: Maybe<Scalars['Boolean']['output']>;
  valid: Scalars['Boolean']['output'];
};

export type VerifyApplication = {
  __typename?: 'VerifyApplication';
  domain: Scalars['String']['output'];
  environment: VerifyApplicationEnvironment | '%future added value';
  realm: Scalars['String']['output'];
};

export enum VerifyApplicationEnvironment {
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST'
}

export type VerifyApplicationQueryInput = {
  domain: Scalars['String']['input'];
  realm: Scalars['String']['input'];
  tenantId: Scalars['ID']['input'];
};

export type Viewer = {
  id: Scalars['ID']['output'];
};

export type WebhookExceptionInvocation = WebhookInvocation & {
  __typename?: 'WebhookExceptionInvocation';
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent | '%future added value'>;
  exception: Scalars['String']['output'];
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  retryPayload: Scalars['String']['output'];
  retryingAt?: Maybe<Scalars['String']['output']>;
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type WebhookHttpErrorInvocation = WebhookInvocation & {
  __typename?: 'WebhookHttpErrorInvocation';
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent | '%future added value'>;
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  responseStatusCode: Scalars['Int']['output'];
  retryPayload: Scalars['String']['output'];
  retryingAt?: Maybe<Scalars['String']['output']>;
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type WebhookInvocation = {
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent | '%future added value'>;
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export enum WebhookInvocationEvent {
  SIGNATORY_APPROVED = 'SIGNATORY_APPROVED',
  SIGNATORY_DOCUMENT_STATUS_CHANGED = 'SIGNATORY_DOCUMENT_STATUS_CHANGED',
  SIGNATORY_DOWNLOAD_LINK_OPENED = 'SIGNATORY_DOWNLOAD_LINK_OPENED',
  SIGNATORY_REJECTED = 'SIGNATORY_REJECTED',
  SIGNATORY_SIGNED = 'SIGNATORY_SIGNED',
  SIGNATORY_SIGN_ERROR = 'SIGNATORY_SIGN_ERROR',
  SIGNATORY_SIGN_LINK_OPENED = 'SIGNATORY_SIGN_LINK_OPENED',
  SIGNATURE_ORDER_EXPIRED = 'SIGNATURE_ORDER_EXPIRED'
}

export type WebhookSuccessfulInvocation = WebhookInvocation & {
  __typename?: 'WebhookSuccessfulInvocation';
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent | '%future added value'>;
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  responseStatusCode: Scalars['Int']['output'];
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type WebhookTimeoutInvocation = WebhookInvocation & {
  __typename?: 'WebhookTimeoutInvocation';
  correlationId: Scalars['String']['output'];
  event?: Maybe<WebhookInvocationEvent | '%future added value'>;
  requestBody: Scalars['String']['output'];
  responseBody?: Maybe<Scalars['String']['output']>;
  responseTimeout: Scalars['Int']['output'];
  retryPayload: Scalars['String']['output'];
  retryingAt?: Maybe<Scalars['String']['output']>;
  signatureOrderId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type XadesDocumentInput = {
  blob: Scalars['Blob']['input'];
  /** Will not be displayed to signatories, can be used as a reference to your own system. */
  reference?: InputMaybe<Scalars['String']['input']>;
  storageMode: DocumentStorageMode | '%future added value';
  title: Scalars['String']['input'];
};

export type XmlDocument = Document & {
  __typename?: 'XmlDocument';
  blob?: Maybe<Scalars['Blob']['output']>;
  id: Scalars['ID']['output'];
  originalBlob?: Maybe<Scalars['Blob']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  signatoryViewerStatus?: Maybe<SignatoryDocumentStatus | '%future added value'>;
  signatures?: Maybe<Array<CompositeSignature | DrawableSignature | EmptySignature | JwtSignature | NorwegianBankIdSignature>>;
  title: Scalars['String']['output'];
};

export type ExampleAddSignatoriesMutationVariables = Exact<{
  input: AddSignatoriesInput;
}>;


export type ExampleAddSignatoriesMutation = { __typename?: 'Mutation', addSignatories?: { __typename?: 'AddSignatoriesOutput', signatories: Array<{ __typename?: 'Signatory', id: string, href: string }> } | null };

export type ExampleAddSignatoryMutationVariables = Exact<{
  input: AddSignatoryInput;
}>;


export type ExampleAddSignatoryMutation = { __typename?: 'Mutation', addSignatory?: { __typename?: 'AddSignatoryOutput', signatory: { __typename?: 'Signatory', id: string, href: string, token: string } } | null };

export type ExampleChangeSignatoryMutationVariables = Exact<{
  input: ChangeSignatoryInput;
}>;


export type ExampleChangeSignatoryMutation = { __typename?: 'Mutation', changeSignatory?: { __typename?: 'ChangeSignatoryOutput', signatory: { __typename?: 'Signatory', id: string, href: string, token: string } } | null };

export type ExampleChangeSignatureOrderMutationVariables = Exact<{
  input: ChangeSignatureOrderInput;
}>;


export type ExampleChangeSignatureOrderMutation = { __typename?: 'Mutation', changeSignatureOrder?: { __typename?: 'ChangeSignatureOrderOutput', signatureOrder: { __typename?: 'SignatureOrder', id: string, maxSignatories: number } } | null };

export type ExampleValidateDocumentMutationVariables = Exact<{
  input: ValidateDocumentInput;
}>;


export type ExampleValidateDocumentMutation = { __typename?: 'Mutation', validateDocument?: { __typename?: 'ValidateDocumentOutput', valid: boolean, errors?: Array<string> | null, fixable?: boolean | null } | null };
