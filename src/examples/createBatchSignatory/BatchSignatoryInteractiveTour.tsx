import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'gatsby';
import { Button } from '../../components/Button/Button';
import { slug } from 'github-slugger';

import * as createSignatureOrderExample from '../../examples/createSignatureOrder.graphql';
import * as addSignatoryExample from '../../examples/addSignatory.graphql';
import * as createBatchSignatoryExample from './basic.graphql';
import * as closeSignatureOrderExample from '../../examples/closeSignatureOrder.graphql';
import {
  AddSignatoryOutput,
  BatchSignatoryItem,
  BatchSignatoryItemInput,
  CloseSignatureOrderOutput,
  CreateSignatureOrderOutput,
  CreateBatchSignatoryOutput,
} from '../../../graphql-signatures-types';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import GraphQLExplorer, {
  GraphQLResponse,
  GraphQLError,
  CredentialsForm,
} from '../../components/GraphQLExplorer';
import { H2, Paragraph } from '../../components/MdxProvider';
import { clearExampleData } from '../../state/store';

type Step =
  | 'authenticate'
  | 'createSignatureOrders'
  | 'addSignatories'
  | 'createBatchSignatory'
  | 'sign'
  | 'closeSignatureOrders';

const stepIndex = (s: Step) => {
  switch (s) {
    case 'authenticate':
      return 0;
    case 'createSignatureOrders':
      return 1;
    case 'addSignatories':
      return 2;
    case 'createBatchSignatory':
      return 3;
    case 'sign':
      return 4;
    case 'closeSignatureOrders':
      return 5;
    default:
      throw new Error(`stepIndex missing for ${s}`);
  }
};

const TITLES = {
  authenticate: 'Step 0: Authenticate',
  createSignatureOrder: 'Step 1: Create a signature order',
  addSignatories: 'Step 2: Add signatories',
  createBatchSignatory: 'Step 3: Create batch signatory',
  sign: 'Step 4: Sign documents',
  closeSignatureOrder: 'Step 5: Close signature order',
};

export default function InteractiveTour() {
  const credentials = useAppSelector(state => state.auth);
  const [step, setStep] = useState<Step>(credentials ? 'createSignatureOrders' : 'authenticate');
  const [signatureOrders, setSignatureOrders] = useState<
    CreateSignatureOrderOutput['signatureOrder'][]
  >([]);
  const [currentSignatureOrder, setCurrentSignatureOrder] =
    useState<CreateSignatureOrderOutput['signatureOrder']>();
  const [signatories, setSignatories] = useState<BatchSignatoryItemInput[]>([]);
  const [batchSignatory, setBatchSignatory] =
    useState<CreateBatchSignatoryOutput['batchSignatory']>();
  const [closedSignatureOrders, setClosedSignatureOrders] = useState<
    CloseSignatureOrderOutput['signatureOrder'][]
  >([]);
  const exampleData = useAppSelector(state => state.exampleData);
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<GraphQLError[]>([]);
  const [response, setResponse] = useState<GraphQLResponse | null>(null);

  const handleResponse = (step: Step, response: GraphQLResponse) => {
    setResponse(response);
    if (response.errors) {
      setErrors(response.errors);
    }

    if (step === 'createSignatureOrders') {
      if (response.data.createSignatureOrder) {
        const createSignatureOrder: CreateSignatureOrderOutput = response.data.createSignatureOrder;
        setSignatureOrders(signatureOrders =>
          signatureOrders.concat(createSignatureOrder.signatureOrder),
        );
        setSignatories([]);
        setErrors([]);
      }
    }

    if (step === 'addSignatories') {
      if (response.data.addSignatory) {
        const addSignatory: AddSignatoryOutput = response.data.addSignatory;
        setSignatories(signatories =>
          signatories.concat({
            signatoryId: addSignatory.signatory.id,
            signatureOrderId: addSignatory.signatureOrder.id,
          }),
        );
        setErrors([]);
      }
    }

    if (step === 'createBatchSignatory') {
      if (response.data.createBatchSignatory) {
        const createBatchSignatory: CreateBatchSignatoryOutput = response.data.createBatchSignatory;
        setBatchSignatory(createBatchSignatory.batchSignatory);

        const batchSignatorySignatureOrders = createBatchSignatory.batchSignatory.items.map(
          (so: BatchSignatoryItem) => so.signatureOrder.id,
        );
        setSignatureOrders(signatureOrders =>
          signatureOrders.filter(so => batchSignatorySignatureOrders.includes(so.id)),
        );
        setCurrentSignatureOrder(undefined);

        setStep('sign');
      }
    }

    if (step === 'closeSignatureOrders') {
      if (response.data.closeSignatureOrder) {
        const closeSignatureOrder: CloseSignatureOrderOutput = response.data.closeSignatureOrder;
        setSignatureOrders(signatureOrders =>
          signatureOrders.filter(so => so.id !== closeSignatureOrder.signatureOrder.id),
        );
        setClosedSignatureOrders(closedSignatureOrders =>
          closedSignatureOrders.concat(closeSignatureOrder.signatureOrder),
        );
      }
    }
  };

  // Automatically clear errors when changing steps
  useEffect(() => {
    setErrors([]);
  }, [step]);

  // Automatically skip step 0 when authenticating
  useEffect(() => {
    if (!credentials) return;
    if (step !== 'authenticate') return;
    setStep('createSignatureOrders');
  }, [credentials]);

  return (
    <React.Fragment>
      <div className="prose max-w-none hidden lg:block">
        {step === 'authenticate' && (
          <React.Fragment>
            <H2 id={slug(TITLES.authenticate)}>{TITLES.authenticate}</H2>
            <Paragraph>
              Please enter your{' '}
              <Link to="/signatures/getting-started/register-application/">API credentials</Link> to
              start the interactive tour.
            </Paragraph>
            <Paragraph>
              Queries are executed against your actual application. Please make sure you are using
              test credentials.
            </Paragraph>
            <CredentialsForm />
          </React.Fragment>
        )}
        {step === 'createSignatureOrders' && (
          <React.Fragment>
            <H2 id={slug(TITLES.createSignatureOrder)}>{TITLES.createSignatureOrder}</H2>
            <Paragraph>
              Signature Orders form the basic building blocks of the signatures API. A Signature
              Order contains documents and the signatories you intend to sign them.
            </Paragraph>
            <Paragraph>
              <strong>Press the play button</strong> below to create your first Signature Order.
            </Paragraph>

            {signatureOrders.length ? (
              <React.Fragment>
                <Paragraph>
                  <strong>{signatureOrders.length} signature orders created.</strong>
                  When you have created as many signature orders as you want, you can proceed via
                  the button below.
                </Paragraph>
                <Button variant="primary" size="lg" onClick={() => setStep('addSignatories')}>
                  Proceed to next step
                </Button>
              </React.Fragment>
            ) : null}

            <GraphQLExplorer
              query={createSignatureOrderExample.query}
              variables={createSignatureOrderExample.variables()}
              onResponse={response => handleResponse('createSignatureOrders', response)}
            />
          </React.Fragment>
        )}
        {step === 'addSignatories' && (
          <React.Fragment>
            <p className="bg-light-blue-25 p-2 rounded">
              Awesome! You have created your first Signature Order
              {signatureOrders.length > 1 ? 's' : ''}, now you have to add some signatories.
              Signatories represent the individuals you want to sign your signature order.
            </p>
            <H2 id={slug(TITLES.addSignatories)}>{TITLES.addSignatories}</H2>
            <Paragraph>
              <strong>Press the play button</strong> below to add signatories to every signature
              order.
            </Paragraph>

            <div className="gap-2">
              {signatureOrders.map(so => (
                <label className="break-all flex gap-4">
                  <input
                    type="radio"
                    value={so.id}
                    checked={currentSignatureOrder?.id === so.id}
                    onClick={() => setCurrentSignatureOrder(so)}
                  />
                  <p>{so.id}</p>
                </label>
              ))}
            </div>

            {signatories.length ? (
              <React.Fragment>
                <Paragraph>
                  <strong>{signatories.length} signatories added.</strong>
                </Paragraph>
                <Button variant="primary" size="lg" onClick={() => setStep('createBatchSignatory')}>
                  Proceed to next step
                </Button>
              </React.Fragment>
            ) : null}

            {currentSignatureOrder && (
              <GraphQLExplorer
                query={addSignatoryExample.queryWithSignatureOrder}
                variables={addSignatoryExample.variables({
                  ...exampleData,
                  createSignatureOrder: {
                    ...exampleData.createSignatureOrder!,
                    signatureOrder: currentSignatureOrder,
                  },
                })}
                onResponse={response => handleResponse('addSignatories', response)}
              />
            )}
          </React.Fragment>
        )}
        {step === 'createBatchSignatory' && (
          <React.Fragment>
            <p className="bg-light-blue-25 p-2 rounded">
              After creating some signature orders and adding signatories, it is now time for
              creating the batch!
            </p>
            <H2 id={slug(TITLES.createBatchSignatory)}>{TITLES.createBatchSignatory}</H2>
            <Paragraph>
              <strong>Press the play button</strong> below to create a batch signatory.
            </Paragraph>

            <GraphQLExplorer
              query={createBatchSignatoryExample.query}
              variables={createBatchSignatoryExample.variables({
                signatories: signatories,
              })}
              onResponse={response => handleResponse('createBatchSignatory', response)}
            />
          </React.Fragment>
        )}
        {step === 'sign' && (
          <React.Fragment>
            <H2 id={slug(TITLES.sign)}>{TITLES.sign}</H2>
            <Paragraph>
              A batch signatory has a single link that can be sent to its intended target. This link
              can be used to interact with every signatory in the batch at once.
            </Paragraph>
            <Paragraph>
              <a href={batchSignatory?.href} target="_blank">
                Sign as batch signatory
              </a>
            </Paragraph>
            <Paragraph>
              The signatories are signed using a single authentication, our system will take care of
              everything.
            </Paragraph>
            <Paragraph>
              When you have signed or rejected the batch signatory, you can proceed to the next
              step.
            </Paragraph>
            <Button variant="primary" size="lg" onClick={() => setStep('closeSignatureOrders')}>
              Proceed to next step
            </Button>
          </React.Fragment>
        )}
        {step === 'closeSignatureOrders' && (
          <React.Fragment>
            <H2 id={slug(TITLES.closeSignatureOrder)}>{TITLES.closeSignatureOrder}</H2>

            <Paragraph>Select a signature order to close:</Paragraph>
            <div className="gap-2">
              {signatureOrders.map(so => (
                <label className="break-all flex gap-4">
                  <input
                    type="radio"
                    value={so.id}
                    checked={currentSignatureOrder?.id === so.id}
                    onClick={() => setCurrentSignatureOrder(so)}
                  />
                  <p>{so.id}</p>
                </label>
              ))}
            </div>

            {currentSignatureOrder && signatureOrders?.length ? (
              <React.Fragment>
                <Paragraph>
                  <strong>Press the play button</strong> below to close your signature order.
                </Paragraph>
                <GraphQLExplorer
                  query={closeSignatureOrderExample.query}
                  variables={closeSignatureOrderExample.variables({
                    ...exampleData,
                    createSignatureOrder: {
                      ...exampleData.createSignatureOrder!,
                      signatureOrder: currentSignatureOrder,
                    },
                  })}
                  onResponse={response => handleResponse('closeSignatureOrders', response)}
                />
              </React.Fragment>
            ) : null}

            {closedSignatureOrders?.length ? (
              <React.Fragment>
                <Paragraph>
                  Your signature order
                  {closedSignatureOrders.length > 1 ? 's' : ''} is now closed. The signed documents
                  are returned as blobs when you close the signature order.
                </Paragraph>
                <Paragraph>
                  <strong>Notice:</strong> all your signatories may have rejected your signature
                  order, in which case your signature order will not have any signatures.
                </Paragraph>
                {closedSignatureOrders.map(so => (
                  <React.Fragment>
                    <div className="break-all">
                      <h4>{so.id}</h4>
                      <ol>
                        {so.documents.map(document => (
                          <li key={document.id}>
                            <a href={blobUrl(document.blob!)} download>
                              Download {document.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ) : null}
          </React.Fragment>
        )}
      </div>
      <div className="prose block lg:hidden">
        <p className="bg-light-blue-25 p-2 rounded">
          Our interactive tour is only available on larger screens.
        </p>
      </div>
    </React.Fragment>
  );
}

const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

function blobUrl(input: string) {
  const blob = b64toBlob(input, 'application/pdf');
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}
