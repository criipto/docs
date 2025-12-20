import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { linkStyles, inputStyles, disabledInputStyles } from '../styles';
import publicSigningKey from '../keys/signing_jwks_public.json';
import oidcConfig from '../oidcConfig';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (newConfig: {
    domain: string;
    clientId: string;
    clientSecret: string;
    scope: string;
    pkJwtAuth: boolean;
  }) => void;
  domain: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  redirectUri: string;
  pkJwtAuth: boolean;
};

export default function Modal({
  open,
  onClose,
  onSave,
  domain,
  clientId,
  clientSecret,
  scope,
  pkJwtAuth,
}: ModalProps) {
  const [settings, setSettings] = useState({
    domain,
    clientId,
    clientSecret,
    scope,
    pkJwtAuth,
  });

  const authDescriptions = {
    client_secret: (
      <>
        Standard client authentication using a shared{' '}
        <a className={linkStyles} href="/verify/reference/glossary/#client-secret" target="_blank">
          client secret
        </a>
        .
      </>
    ),
    private_jwt: (
      <>
        A more secure authentication option based on asymmetric cryptography. For more details, see{' '}
        <a href="/verify/guides/privatekey-jwt/" target="_blank" className={linkStyles}>
          Private key JWT authentication
        </a>
        .
      </>
    ),
  };

  return createPortal(
    <div
      className={`backdrop-blur-sm bg-black/30 fixed h-screen w-screen inset-0 z-50 p-4 items-center justify-center ${open ? 'flex' : 'hidden'}`}
      onClick={onClose} // clicking outside closes modal
    >
      <div
        className="bg-white shadow-xl p-10 w-full max-w-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-black text-lg"
          onClick={onClose}
        >
          <FontAwesomeIcon icon="xmark" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 my-2">Client Configuration</h2>

        <p className="text-gray-700 mb-2 text-sm">
          This visualizer is configured to use Idura’s default application settings. You can update
          them to test the OpenID Connect flow with your own Idura application instead. If you do,
          make sure to add{' '}
          <span className="font-mono text-xs">
            https://docs.idura.app/verify/guides/oidc-visualizer
          </span>{' '}
          as a <span className="font-medium">redirect URI</span> in your application settings in the{' '}
          <a
            href="https://dashboard.idura.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkStyles}
          >
            Idura dashboard
          </a>
          .
        </p>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-start gap-2">
            <label className="w-32 text-gray-800 font-medium">Client Authentication</label>
            <div className="flex flex-col flex-1">
              <select
                className="flex-1 border border-gray-300 px-1 py-1 text-gray-900 transition-colors focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
                value={settings.pkJwtAuth ? 'private_jwt' : 'client_secret'}
                onChange={e => {
                  setSettings({ ...settings, pkJwtAuth: e.target.value === 'private_jwt' });
                }}
              >
                <option value="client_secret">Client Secret</option>
                <option value="private_jwt">Private Key JWT</option>
              </select>
              <p className="leading-tight text-xs px-2 py-1 mt-1 bg-slate-50 text-slate-600">
                {settings.pkJwtAuth ? authDescriptions.private_jwt : authDescriptions.client_secret}
              </p>
            </div>
          </div>
          {settings.pkJwtAuth && (
            <div className="flex items-start gap-2">
              <label className="w-32 text-gray-800 font-medium">Public key</label>
              <div className="flex-1 relative">
                <textarea
                  readOnly
                  className={`${inputStyles} w-full h-24 font-mono text-xs resize-none bg-gray-50 cursor-text`}
                  value={JSON.stringify(publicSigningKey, null, 2)}
                  onClick={e => (e.target as HTMLTextAreaElement).select()}
                />
                <div className="px-1 py-1 bg-slate-50 leading-tight text-xs text-slate-600">
                  <p>
                    To test Private Key JWT authentication with your own application, you must
                    register the provided public signing key in the Idura Dashboard. Open your
                    application settings and navigate to the{' '}
                    <span className="font-medium text-gray-700">OpenID Connect</span> tab. Under{' '}
                    <span className="font-medium text-slate-900">Client JWKs</span>, set the type to
                    <span className="font-medium text-slate-900"> Static</span> and paste the JWK
                    set shown above.
                  </p>

                  <div className="mt-3 bg-yellow-100 p-2">
                    <p>
                      <strong>Security Note:</strong> These keys are for demonstration only. When
                      building your own applications, generate a unique key pair and never share the
                      private key.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="w-32 text-gray-800 font-medium">Domain</label>
            <input
              className={inputStyles}
              value={settings.domain}
              onChange={e => setSettings({ ...settings, domain: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32 text-gray-800 font-medium">Client ID</label>
            <input
              className={inputStyles}
              value={settings.clientId}
              onChange={e => setSettings({ ...settings, clientId: e.target.value })}
            />
          </div>

          {!settings.pkJwtAuth && (
            <div className="flex items-center gap-2">
              <label className="w-32 text-gray-800 font-medium">Client Secret</label>
              <input
                className={inputStyles}
                value={settings.clientSecret}
                onChange={e => setSettings({ ...settings, clientSecret: e.target.value })}
                disabled={settings.pkJwtAuth}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="w-32 text-gray-800 font-medium">Scope</label>
            <input
              className={inputStyles}
              value={settings.scope}
              onChange={e => setSettings({ ...settings, scope: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-32 text-gray-800 font-medium">Redirect URI</label>
            <input
              disabled
              className={disabledInputStyles}
              value="https://docs.idura.app/verify/guides/oidc-visualizer"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end text-sm">
          <button
            onClick={() => {
              setSettings({
                domain: oidcConfig.domain,
                clientId: oidcConfig.clientId,
                clientSecret: oidcConfig.clientSecret,
                scope: oidcConfig.scope,
                pkJwtAuth: oidcConfig.pkJwtAuth,
              });
            }}
            className="px-5 py-2 bg-sky-900 mr-2 text-white font-medium hover:bg-gray-900 transition"
          >
            Reset to Default
          </button>

          <button
            onClick={() => onSave(settings)}
            className="px-5 py-2 bg-black text-white font-medium hover:bg-gray-900 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
