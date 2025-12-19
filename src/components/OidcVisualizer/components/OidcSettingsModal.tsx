import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { primaryBtn, secondaryBtn, linkStyles, inputStyles, disabledInputStyles } from '../styles';
import { PROVIDERS } from '../../../utils/auth-methods';
import oidcConfig from '../oidcConfig';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (newConfig: {
    domain: string;
    clientId: string;
    clientSecret: string;
    scope: string;
    acrValues?: string[];
  }) => void;
  domain: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  redirectUri: string;
  acrValues?: string[];
};

export default function Modal({
  open,
  onClose,
  onSave,
  domain,
  clientId,
  clientSecret,
  scope,
  acrValues,
}: ModalProps) {
  const [settings, setSettings] = useState({
    domain,
    clientId,
    clientSecret,
    scope,
    acrValues: acrValues || [],
  });

  const toggleAcrValue = (value: string) => {
    setSettings(prev => {
      const current = prev.acrValues;
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, acrValues: next };
    });
  };

  return createPortal(
    <div
      className={`backdrop-blur-sm bg-black/30 fixed h-screen w-screen inset-0 z-50 p-4 items-center justify-center ${open ? 'flex' : 'hidden'}`}
      onClick={onClose} // clicking outside closes modal
    >
      <div
        className="bg-white shadow-xl p-6 w-full max-w-4xl relative"
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
            className={linkStyles}
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

          <div className="flex items-start gap-2">
            <label className="w-32 text-gray-800 font-medium">Acr values</label>

            <div className="flex-1 grid grid-cols-5 gap-x-4 gap-y-3 text-[10px]">
              {PROVIDERS.map(provider => (
                <div key={provider.title} className="flex flex-col">
                  <p className="font-medium text-gray-800 mb-1">{provider.title}</p>

                  <div className="flex flex-col space-y-0.5">
                    {provider.authMethods.map(authMethod => (
                      <label
                        key={authMethod.acrValue}
                        className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id={authMethod.acrValue}
                          className="mr-2 h-3 w-3 mt-0.5 accent-sky-600"
                          checked={settings.acrValues.includes(authMethod.acrValue)}
                          onChange={() => toggleAcrValue(authMethod.acrValue)}
                        />
                        <span className="leading-normal">{authMethod.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => {
              setSettings({
                domain: oidcConfig.domain,
                clientId: oidcConfig.clientId,
                clientSecret: oidcConfig.clientSecret,
                scope: oidcConfig.scope,
                acrValues: oidcConfig.acrValues || [],
              });
            }}
            className={secondaryBtn}
          >
            Reset to Default
          </button>

          <button onClick={() => onSave(settings)} className={primaryBtn}>
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
