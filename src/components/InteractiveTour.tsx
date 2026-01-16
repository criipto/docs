import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'gatsby';
import { slug } from 'github-slugger';

import * as createSignatureOrderExample from '../examples/createSignatureOrder.graphql';
import * as addSignatoryExample from '../examples/addSignatory.graphql';
import * as closeSignatureOrderExample from '../examples/closeSignatureOrder.graphql';
import { AddSignatoryOutput } from '../../graphql-signatures-types';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import GraphQLExplorer, { GraphQLResponse, GraphQLError, CredentialsForm } from './GraphQLExplorer';
import { CodeBlock, H2, Paragraph } from './MdxProvider';
import { DesktopPageNavigation } from './PageNavigation';
import { clearExampleData } from '../state/store';

type Step =
  | 'authenticate'
  | 'createSignatureOrder'
  | 'addSignatories'
  | 'sign'
  | 'closeSignatureOrder';

const stepIndex = (s: Step) => {
  switch (s) {
    case 'authenticate':
      return 0;
    case 'createSignatureOrder':
      return 1;
    case 'addSignatories':
      return 2;
    case 'sign':
      return 3;
    case 'closeSignatureOrder':
      return 4;
    default:
      throw new Error(`stepIndex missing for ${s}`);
  }
};

const TITLES = {
  authenticate: 'Step 0: Authenticate',
  createSignatureOrder: 'Step 1: Create a signature order',
  addSignatories: 'Step 2: Add signatories',
  sign: 'Step 3: Sign documents',
  closeSignatureOrder: 'Step 4: Close signature order',
};

export default function InteractiveTour() {
  const credentials = useAppSelector(state => state.auth);
  const [step, setStep] = useState<Step>(credentials ? 'createSignatureOrder' : 'authenticate');
  const [signatories, setSignatories] = useState<AddSignatoryOutput['signatory'][]>([]);
  const exampleData = useAppSelector(state => state.exampleData);
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<GraphQLError[]>([]);
  const [response, setResponse] = useState<GraphQLResponse | null>(null);

  const handleResponse = (step: Step, response: GraphQLResponse) => {
    setResponse(response);
    if (response.errors) {
      setErrors(response.errors);
    }

    if (step === 'createSignatureOrder') {
      if (response.data.createSignatureOrder) {
        setSignatories([]);
        setErrors([]);
        setStep('addSignatories');
      }
    }
    if (step === 'addSignatories') {
      if (response.data.addSignatory) {
        const addSignatory: AddSignatoryOutput = response.data.addSignatory;
        setSignatories(signatories => signatories.concat(addSignatory.signatory));
        setErrors([]);
      }
    }
    if (step === 'closeSignatureOrder') {
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
    setStep('createSignatureOrder');
  }, [credentials]);

  const reset = () => {
    setErrors([]);
    dispatch(clearExampleData());
  };

  const items = useMemo(() => {
    return [
      {
        title: TITLES.createSignatureOrder,
        url: `#${slug(TITLES.createSignatureOrder)}`,
        onClick: () => {
          reset();
        },
      },
    ]
      .concat(
        stepIndex(step) >= stepIndex('addSignatories')
          ? [
              {
                title: TITLES.addSignatories,
                url: `#${slug(TITLES.addSignatories)}`,
                onClick: () => setStep('addSignatories'),
              },
            ]
          : [],
      )
      .concat(
        stepIndex(step) >= stepIndex('sign')
          ? [
              {
                title: TITLES.sign,
                url: `#${slug(TITLES.sign)}`,
                onClick: () => setStep('sign'),
              },
            ]
          : [],
      )
      .concat(
        stepIndex(step) >= stepIndex('closeSignatureOrder')
          ? [
              {
                title: TITLES.closeSignatureOrder,
                url: `#${slug(TITLES.closeSignatureOrder)}`,
                onClick: () => setStep('closeSignatureOrder'),
              },
            ]
          : [],
      );
  }, [step]);

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
        {step === 'createSignatureOrder' && (
          <React.Fragment>
            <H2 id={slug(TITLES.createSignatureOrder)}>{TITLES.createSignatureOrder}</H2>
            <Paragraph>
              Signature Orders form the basic building blocks of the Signatures API. A Signature
              Order contains documents and the signatories you intend to sign them.
            </Paragraph>
            <Paragraph>
              <strong>Press the play button</strong> below to create your first Signature Order.
            </Paragraph>
            <GraphQLExplorer
              query={createSignatureOrderExample.query}
              variables={createSignatureOrderExample.variables()}
              onResponse={response => handleResponse('createSignatureOrder', response)}
            />
          </React.Fragment>
        )}
        {step === 'addSignatories' && (
          <React.Fragment>
            <p className="bg-light-blue-25 p-2 rounded">
              Awesome! You have created your first Signature Order, now you can start adding
              signatories. Signatories represent the individuals you want to sign your signature
              order.
            </p>
            <H2 id={slug(TITLES.addSignatories)}>{TITLES.addSignatories}</H2>
            <Paragraph>
              <strong>Press the play button</strong> below to add a signatory. You can add as many
              signatories as you want.
            </Paragraph>

            {signatories.length ? (
              <React.Fragment>
                <Paragraph>
                  <strong>{signatories.length} signatories added.</strong>
                  When you have added as many signatories as you want, you can proceed via the
                  button below.
                </Paragraph>
                <button
                  className="bg-primary-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setStep('sign')}
                >
                  Proceed to next step
                </button>
              </React.Fragment>
            ) : null}

            <GraphQLExplorer
              query={addSignatoryExample.query}
              variables={addSignatoryExample.variables(exampleData)}
              onResponse={response => handleResponse('addSignatories', response)}
            />
          </React.Fragment>
        )}
        {step === 'sign' && (
          <React.Fragment>
            <H2 id={slug(TITLES.sign)}>{TITLES.sign}</H2>
            <Paragraph>
              Normally, you'd send the signatory links to your intended recipients at this step. But
              in this case, you can proceed by signing the documents yourself via the links below.
              Remember to use a <a href='/signatures/getting-started/test-users/'>test user</a>, not your real eID.
            </Paragraph>
            <ol>
              {signatories.map((signatory, index) => (
                <li key={signatory.id}>
                  <a href={signatory.href} target="_blank">
                    Sign as signatory #{index + 1}
                  </a>
                </li>
              ))}
            </ol>
            <Paragraph>
              Signatories can sign in parallel, our system will take care of everything.
            </Paragraph>
            <Paragraph>
              When you have signed or rejected the signature order with all the signatories you
              added, you can proceed to the next step.
            </Paragraph>
            <button
              className="bg-primary-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => setStep('closeSignatureOrder')}
            >
              Proceed to next step
            </button>
          </React.Fragment>
        )}
        {step === 'closeSignatureOrder' && (
          <React.Fragment>
            <H2 id={slug(TITLES.closeSignatureOrder)}>{TITLES.closeSignatureOrder}</H2>
            <Paragraph>
              <strong>Press the play button</strong> below to close your signature order.
            </Paragraph>

            {errors.length ? (
              <p className="bg-red-300 p-2 rounded">
                Oops! Looks like an error occurred, you can see the error details in the response
                tab below.
              </p>
            ) : null}

            {exampleData.closeSignatureOrder ? (
              <React.Fragment>
                <Paragraph>
                  Your signature order is now closed. The signed documents are returned as blobs
                  when you close the signature order.
                </Paragraph>
                <Paragraph>
                  <strong>Notice:</strong> all your signatories may have rejected your signature
                  order, in which case your signature order will not have any signatures.
                </Paragraph>
                <ol>
                  {exampleData.closeSignatureOrder.signatureOrder.documents.map(document => (
                    <li key={document.id}>
                      <a href={blobUrl(document.blob!)} download>
                        Download {document.title}
                      </a>
                    </li>
                  ))}
                </ol>
                <CodeBlock text={JSON.stringify(response, null, 2)} />
              </React.Fragment>
            ) : (
              <GraphQLExplorer
                query={closeSignatureOrderExample.query}
                variables={closeSignatureOrderExample.variables(exampleData)}
                onResponse={response => handleResponse('closeSignatureOrder', response)}
              />
            )}
          </React.Fragment>
        )}
      </div>
      <div className="prose block lg:hidden">
        <p className="bg-light-blue-25 p-2 rounded">
          Our interactive tour is only available on larger screens.
        </p>
      </div>
      <DesktopPageNavigation isEmbedded={false} title="Tour Steps" items={items} />
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
