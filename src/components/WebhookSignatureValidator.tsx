import React, { useState } from 'react';
import { Button } from './Button/Button';

function bytesToBase64(bytes: Uint8Array) {
  var binary = '';
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++){
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function WebhookSignatureValidator() {
  const [secret, setSecret] = useState('');
  const [body, setBody] = useState('');
  const [signature, setSignature] = useState('');
  const [valid, setValid] = useState<boolean | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!secret?.length) return;
    if (!body?.length) return;
    if (!signature?.length) return;

    const encoder = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
      'raw',
      base64ToArrayBuffer(secret),
      {
        name: 'hmac',
        hash: 'SHA-256',
      },
      false,
      ['sign'],
    );

    const actual = await window.crypto.subtle
      .sign('HMAC', key, encoder.encode(body))
      .then(r => bytesToBase64(new Uint8Array(r)));
    setValid(actual === signature);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-[550px]">
      <div className="mb-4 flex flex-col gap-4">
        <div>
          <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="secret">
            Secret
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="secret"
            type="text"
            placeholder="Webhook secret"
            value={secret}
            onChange={event => setSecret(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="body">
            Request body
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="body"
            placeholder="Request body"
            value={body}
            onChange={event => setBody(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="signature">
            Signature
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="signature"
            type="text"
            placeholder="Signature"
            value={signature}
            onChange={event => setSignature(event.target.value)}
            required
          />
        </div>
      </div>
      {valid !== null ? (
        <div className="mb-4">
          <strong>Signature {valid ? 'valid' : 'not valid'}</strong>
        </div>
      ) : null}
      <Button variant="primary" type="submit" size="lg">
        Validate
      </Button>
    </form>
  );
}
