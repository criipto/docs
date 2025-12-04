import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { slug } from 'github-slugger';

import * as createSignatureOrderExample from '../../../examples/createSignatureOrder/sealsPageTemplateCoolEnergy.graphql';
import * as addSignatoryExample from '../../../examples/addSignatory.graphql';
import * as closeSignatureOrderExample from '../../../examples/closeSignatureOrder.graphql';
import { AddSignatoryOutput } from '../../../../graphql-signatures-types';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import GraphQLExplorer, {
  GraphQLResponse,
  GraphQLError,
  CredentialsForm,
} from '../../../components/GraphQLExplorer';
import { CodeBlock, H3, Paragraph } from '../../../components/MdxProvider';
import { clearExampleData } from '../../../state/store';
import partnershipAgreementImg from './images/partnership-agreement.png';
import customSealsPageImg from './images/custom-seals-page.png';
import signedAgreementImg from './images/signed-partnership-agreement.png';

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
  sign: 'Step 3: Sign document',
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
    setStep('createSignatureOrder');
  };

  const steps = [
    {
      text: TITLES.createSignatureOrder,
      link: `#${slug(TITLES.createSignatureOrder)}`,
      onClick: () => reset(),
      active: step === 'createSignatureOrder',
    },
  ]
    .concat(
      stepIndex(step) >= stepIndex('addSignatories')
        ? [
            {
              text: TITLES.addSignatories,
              link: `#${slug(TITLES.addSignatories)}`,
              onClick: () => setStep('addSignatories'),
              active: step === 'addSignatories',
            },
          ]
        : [],
    )
    .concat(
      stepIndex(step) >= stepIndex('sign')
        ? [
            {
              text: TITLES.sign,
              link: `#${slug(TITLES.sign)}`,
              onClick: () => setStep('sign'),
              active: step === 'sign',
            },
          ]
        : [],
    )
    .concat(
      stepIndex(step) >= stepIndex('closeSignatureOrder')
        ? [
            {
              text: TITLES.closeSignatureOrder,
              link: `#${slug(TITLES.closeSignatureOrder)}`,
              onClick: () => setStep('closeSignatureOrder'),
              active: step === 'closeSignatureOrder',
            },
          ]
        : [],
    );

  return (
    <React.Fragment>
      <div className="prose max-w-none hidden lg:block">
        <ol className="text-deep-purple-900 text-md leading-6 list-decimal list-inside flex flex-row p-0">
          {steps.map((item, i) => (
            <li key={item.text} className="mr-3">
              <a
                href={item.link}
                className={`no-underline font-normal ${item.active ? 'font-bold' : ''}`}
                onClick={event => {
                  event.preventDefault();
                  item.onClick();
                }}
              >
                {item.text.replace(/Step (.?): /, '')}
              </a>
            </li>
          ))}
        </ol>

        {step === 'authenticate' && (
          <React.Fragment>
            <H3 className="mt-2" id={slug(TITLES.authenticate)}>
              {TITLES.authenticate}
            </H3>
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
            <H3 className="mt-2" id={slug(TITLES.createSignatureOrder)}>
              {TITLES.createSignatureOrder}
            </H3>
            <Paragraph>
              Signature Orders form the basic building blocks of the Signatures API. A Signature
              Order contains documents and the signatories you intend to sign them.
            </Paragraph>
            This signature order will include:
            <ul>
              <li>A Partnership Agreement that needs to be signed.</li>
              <li>A branded seals page template with Cool Energy's logo and colors.</li>
            </ul>
            <div className="flex flex-row gap-2">
              <img
                src={partnershipAgreementImg}
                className="h-[360px]"
                alt="Partnership agreement"
              />
              <img src={customSealsPageImg} className="h-[360px]" alt="Seals template page" />
            </div>
            <Paragraph>We'll set the maximum number of signatories to eight.</Paragraph>
            <Paragraph>
              <em>
                Note: The custom seals page template feature must be enabled for your account to
                proceed with the interactive tour. Please contact{' '}
                <a href="mailto:support@idura.eu">support@idura.eu</a> to activate it.
              </em>
            </Paragraph>
            <Paragraph>
              <strong>Press the play button</strong> below to create a Signature Order.
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
            <p className="bg-gray-300 p-2 rounded">
              Awesome! You have created the Signature Order with a custom seals template page. Now
              you can start adding signatories. Signatories represent the individuals you want to
              sign your signature order.
            </p>
            <H3 className="mt-2" id={slug(TITLES.addSignatories)}>
              {TITLES.addSignatories}
            </H3>
            <Paragraph>
              <strong>Press the play button</strong> below to add a signatory. You can add up to 8
              signatories.
            </Paragraph>

            {signatories.length ? (
              <React.Fragment>
                <Paragraph>
                  <strong>{signatories.length} signatories added. </strong>
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
            <H3 className="mt-2" id={slug(TITLES.sign)}>
              {TITLES.sign}
            </H3>
            <Paragraph>
              Normally, the signatory links will be sent to the intended recipients at this step.
              But in this case, you can proceed by signing the documents yourself via the links below.
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
            <H3 className="mt-2" id={slug(TITLES.closeSignatureOrder)}>
              {TITLES.closeSignatureOrder}
            </H3>
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
                  You can download the final signed PDF below. See how the signature seals are
                  placed on a custom template page we added when creating the signature order.
                </Paragraph>
                <div className="flex flex-row gap-2">
                  <img
                    src={partnershipAgreementImg}
                    alt="Partnership agreement"
                    className="h-[360px]"
                  />
                  <img
                    src={signedAgreementImg}
                    alt="Partnership agreement signed"
                    className="h-[360px]"
                  />
                </div>
                <Paragraph>
                  <strong>Notice:</strong> if your signatories rejected signing the document, the
                  signature order will not have any signatures.
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
        <p className="bg-gray-300 p-2 rounded">
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
