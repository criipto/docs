import React, { useEffect, useState } from 'react';

import GraphQLExample from '../GraphQLExample';
import { useAppSelector } from '../../state/hooks';
import {
  AddSignatoryInput,
  SignatoryDocumentInput,
  SignatoryEvidenceValidationInput,
} from '../../../graphql-signatures-types';
import { query } from '../../examples/addSignatory.graphql';
import { H3, Paragraph } from '../MdxProvider';

export default function AddSignatoryQueryBuilder() {
  const data = useAppSelector(state => state.exampleData);
  const [input, setInput] = useState<AddSignatoryInput>({
    signatureOrderId: data?.createSignatureOrder?.signatureOrder.id || '[signatureOrder.id]',
  });
  const [evidenceValidation, setEvidenceValidation] = useState<SignatoryEvidenceValidationInput[]>(
    [],
  );
  const [documents, setDocuments] = useState<SignatoryDocumentInput[]>([]);

  const variables = (): { input: AddSignatoryInput } => {
    return {
      input: {
        ...input,
        evidenceValidation: evidenceValidation.length > 0 ? evidenceValidation : null,
        documents: documents.length > 0 ? documents : null,
      },
    };
  };

  useEffect(() => {
    if (!data.createSignatureOrder?.signatureOrder) return;
    setInput(input => ({
      ...input,
      signatureOrderId: data.createSignatureOrder?.signatureOrder.id!,
    }));

    setDocuments(
      data.createSignatureOrder.signatureOrder.documents.map<SignatoryDocumentInput>(document => {
        return {
          id: document.id,
          preapproved: false,
        };
      }),
    );
  }, [data.createSignatureOrder?.signatureOrder]);

  const handleAddEvidenceValidation = () => {
    setEvidenceValidation(list => list.concat({ key: '', value: '' }));
  };
  const removeEvidenceValidation = (index: number) => {
    setEvidenceValidation(list => list.filter((v, i) => i !== index));
  };
  const handleChangeEvidenceValidation = (
    ev: SignatoryEvidenceValidationInput,
    key: keyof SignatoryEvidenceValidationInput,
    value: string,
  ) => {
    setEvidenceValidation(list =>
      list.map(s => {
        if (s === ev) {
          return {
            ...s,
            [key]: value,
          };
        }
        return s;
      }),
    );
  };

  const handleChangeDocument = (
    ev: SignatoryDocumentInput,
    key: keyof SignatoryDocumentInput,
    value: string | boolean,
  ) => {
    setDocuments(documents =>
      documents.map(s => {
        if (s == ev) {
          return {
            ...s,
            [key]: value,
          };
        }
        return s;
      }),
    );
  };

  const handleRemoveDocument = (ev: SignatoryDocumentInput) => {
    setDocuments(documents => documents.filter(s => s !== ev));
  };

  return (
    <React.Fragment>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <label
            className="block text-light-blue-800 text-sm font-medium mb-2"
            htmlFor="input.signatureOrderId"
          >
            Signature Order ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="input.signatureOrderId"
            type="text"
            placeholder="Signature Order ID"
            value={input?.signatureOrderId || ''}
            onChange={event =>
              setInput(input => ({
                ...input,
                signatureOrderId: event.target.value,
              }))
            }
          />
        </div>
        <div>
          <label
            className="block text-light-blue-800 text-sm font-medium mb-2"
            htmlFor="input.reference"
          >
            Reference
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="input.reference"
            type="text"
            placeholder="Reference"
            value={input?.reference || ''}
            onChange={event => setInput(input => ({ ...input, reference: event.target.value }))}
          />
        </div>
      </div>
      <H3>Evidence Validation</H3>
      <Paragraph>
        Evidence validation lets you validate the token provided by Idura Verify when the user
        signs.
        <br />
        For Denmark, cprNumberIdentifier can be a useful evidence validation key.
        <br />
        See examples of various{' '}
        <a href="/verify/reference/token-contents/" target="_blank" rel="noopener">
          Idura Verify tokens
        </a>{' '}
        for more details.
      </Paragraph>
      <div className="mb-4 grid grid-cols-3 gap-4">
        {evidenceValidation.map((item, index) => (
          <div key={index}>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor={`evidence_validation_${index}_key`}
            >
              Key
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline mb-3"
              id={`evidence_validation_${index}_key`}
              type="text"
              placeholder="Key"
              value={item.key || ''}
              onChange={event => handleChangeEvidenceValidation(item, 'key', event.target.value)}
            />
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor={`evidence_validation_${index}value`}
            >
              Value
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id={`evidence_validation_${index}value`}
              type="text"
              placeholder="Value"
              value={item.value || ''}
              onChange={event => handleChangeEvidenceValidation(item, 'value', event.target.value)}
            />
            <button className="" onClick={() => removeEvidenceValidation(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        className="bg-primary-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={handleAddEvidenceValidation}
      >
        Add
      </button>
      <H3>Documents</H3>
      <Paragraph>
        This example requires using the createSignatureOrder example above with documents.
      </Paragraph>
      <Paragraph>
        Signatories can be scoped to particular documents in a signature order (i.e. only wanting a
        particular signatory to see two of three documents).
      </Paragraph>
      <Paragraph>
        Additionally signatories can have their documents preapproved if you handle document
        approval in your own application.
      </Paragraph>
      <Paragraph>
        Leaving the documents input empty is the default, and enabled the signatory to see all
        documents.
      </Paragraph>
      <div className="mb-4 grid grid-cols-3 gap-4">
        {documents.map(document => (
          <div>
            <div className="font-medium mb-2">
              {data.createSignatureOrder?.signatureOrder.documents.find(s => s.id == document.id)
                ?.title || ''}
            </div>
            <div className="mb-4">
              <label
                className="block text-light-blue-800 text-sm font-medium mb-2"
                htmlFor={`documents_${document.id}id`}
              >
                Document ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
                id={`documents_${document.id}id`}
                type="text"
                placeholder="Document ID"
                value={document.id}
                onChange={event => handleChangeDocument(document, 'id', event.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-light-blue-800 text-sm font-medium mb-2"
                htmlFor={`documents_${document.id}_preapproved`}
              >
                Preapproved
              </label>
              <input
                type="checkbox"
                id={`documents_${document.id}_preapproved`}
                checked={documents.find(s => s.id === document.id)?.preapproved || false}
                onChange={event =>
                  handleChangeDocument(document, 'preapproved', event.target.checked)
                }
              />
            </div>
            <button className="" onClick={() => handleRemoveDocument(document)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <GraphQLExample example={{ query, variables }} />
    </React.Fragment>
  );
}
