import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import oidcConfig from '../oidcConfig';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (newConfig: {
    domain: string;
    clientId: string;
    clientSecret: string;
    scope: string;
  }) => void;
  domain: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  redirectUri: string;
};

export default function Modal({
  open,
  onClose,
  onSave,
  domain,
  clientId,
  clientSecret,
  scope,
}: ModalProps) {
  const [settings, setSettings] = useState({
    domain,
    clientId,
    clientSecret,
    scope,
  });

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

        <h2 className="text-2xl font-semibold text-gray-900 my-4">Client Configuration</h2>

        <p className="text-gray-700 mb-6 text-sm leading-relaxed">
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
            className="text-sky-700 underline hover:text-sky-900"
          >
            Idura dashboard
          </a>
          .
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label className="w-32 text-gray-800 font-medium">Domain</label>
            <input
              className="flex-1 border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
              value={settings.domain}
              onChange={e => setSettings({ ...settings, domain: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-32 text-gray-800 font-medium">Client ID</label>
            <input
              className="flex-1 border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
              value={settings.clientId}
              onChange={e => setSettings({ ...settings, clientId: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-32 text-gray-800 font-medium">Client Secret</label>
            <input
              className="flex-1 border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
              value={settings.clientSecret}
              onChange={e => setSettings({ ...settings, clientSecret: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-32 text-gray-800 font-medium">Scope</label>
            <input
              className="flex-1 border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
              value={settings.scope}
              onChange={e => setSettings({ ...settings, scope: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-32 text-gray-800 font-medium">Redirect URI</label>
            <input
              disabled
              className="flex-1 border border-gray-300 border-dashed bg-gray-100 text-gray-700 px-3 py-2"
              value="https://docs.idura.app/verify/guides/oidc-visualizer"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              setSettings({
                domain: oidcConfig.domain,
                clientId: oidcConfig.clientId,
                clientSecret: oidcConfig.clientSecret,
                scope: oidcConfig.scope,
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
