import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import publicSigningKey from '../keys/signing_jwks_public.json';
import { PROVIDERS } from '../../../utils/auth-methods';
import oidcConfig from '../oidcConfig';
import { Button } from '../../Button/Button';
import { InputField } from '../../FormFields/InputField';
import { Select } from '../../FormFields/Select';
import { Textarea } from '../../FormFields/Textarea';
import { Checkbox } from '../../FormFields/Checkbox/Checkbox';
import xMarkIcon from '../../../images/xmark-icon.svg';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (newConfig: {
    domain: string;
    clientId: string;
    clientSecret: string;
    scope: string;
    pkJwtAuth: boolean;
    acrValues?: string[];
  }) => void;
  domain: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  redirectUri: string;
  acrValues?: string[];
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
  acrValues,
  pkJwtAuth,
}: ModalProps) {
  const [settings, setSettings] = useState({
    domain,
    clientId,
    clientSecret,
    scope,
    acrValues: acrValues || [],
    pkJwtAuth,
  });

  const toggleAcrValue = (value: string) => {
    setSettings(prev => {
      const current = prev.acrValues;
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, acrValues: next };
    });
  };

  const authDescriptions = {
    client_secret: (
      <>
        Standard client authentication using a shared{' '}
        <a href="/verify/reference/glossary/#client-secret" target="_blank">
          client secret
        </a>
        .
      </>
    ),
    private_jwt: (
      <>
        A more secure authentication option based on asymmetric cryptography. For more details, see{' '}
        <a href="/verify/guides/privatekey-jwt/" target="_blank">
          Private key JWT authentication
        </a>
        .
      </>
    ),
  };

  const publicKeyHelpText = (
    <p>
      To test Private Key JWT authentication with your own application, you must register the
      provided public signing key in the Idura Dashboard. Open your application settings and
      navigate to the <span className="font-medium">OpenID Connect</span> tab. Under{' '}
      <span className="font-medium">Client JWKs</span>, set the type to{' '}
      <span className="font-medium"> Static</span> and paste the JWK set shown above.{' '}
      <span className="font-medium">Security Note:</span> These keys are for demonstration only.
      When building your own applications, generate a unique key pair and never share the private
      key.
    </p>
  );

  return createPortal(
    <div
      className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm p-4 flex items-center justify-center ${
        open ? 'flex' : 'hidden'
      }`}
      onClick={onClose} // clicking outside closes modal
    >
      <div
        className="bg-light-blue-10 shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={xMarkIcon}
          alt="Close icon"
          className="absolute right-4 top-4 text-light-blue-600 hover:text-black text-lg cursor-pointer "
          onClick={onClose}
        />

        <div className="mb-6">
          <h2 className="text-xl font-medium text-light-blue-900 mb-3">Client Configuration</h2>

          <p className="text-sm font-normal leading-5 text-light-blue-700">
            This visualizer is configured to use Idura’s default application settings. You can
            update them to test the OpenID Connect flow with your own Idura application instead. If
            you do, make sure to add <i>https://docs.idura.app/verify/guides/oidc-visualizer</i> as
            a <span className="font-medium">redirect URI</span> in your application settings in the{' '}
            <a href="https://dashboard.idura.app/" target="_blank" rel="noopener noreferrer">
              Idura dashboard
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Select
            label="Client Authentication"
            variant="primary"
            value={settings.pkJwtAuth ? 'private_jwt' : 'client_secret'}
            onChange={e => {
              setSettings({ ...settings, pkJwtAuth: e.target.value === 'private_jwt' });
            }}
            helpText={
              settings.pkJwtAuth ? authDescriptions.private_jwt : authDescriptions.client_secret
            }
          >
            <option value="client_secret">Client Secret</option>
            <option value="private_jwt">Private Key JWT</option>
          </Select>

          {settings.pkJwtAuth && (
            <>
              <Textarea
                label="Public key"
                disabled
                readOnly
                value={JSON.stringify(publicSigningKey, null, 2)}
                onClick={e => (e.target as HTMLTextAreaElement).select()}
                helpText={publicKeyHelpText}
              />
            </>
          )}
          <div className="flex items-center gap-2">
            <InputField
              label="Domain"
              variant="primary"
              value={settings.domain}
              onChange={e => setSettings({ ...settings, domain: e.target.value })}
            />
          </div>

          <InputField
            label="Client ID"
            variant="primary"
            value={settings.clientId}
            onChange={e => setSettings({ ...settings, clientId: e.target.value })}
          />

          {!settings.pkJwtAuth && (
            <InputField
              label="Client Secret"
              variant="primary"
              value={settings.clientSecret}
              onChange={e => setSettings({ ...settings, clientSecret: e.target.value })}
              disabled={settings.pkJwtAuth}
            />
          )}

          <InputField
            label="Scope"
            variant="primary"
            value={settings.scope}
            onChange={e => setSettings({ ...settings, scope: e.target.value })}
          />

          <InputField
            label="Redirect URI"
            variant="primary"
            disabled
            value="https://docs.idura.app/verify/guides/oidc-visualizer"
          />

          <div>
            <div className="w-32 text-light-blue-800 font-medium mb-1">Acr_values</div>
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 ">
              {PROVIDERS.map(provider => (
                <div key={provider.title} className="flex flex-col">
                  <p className="font-medium text-light-blue-800 mb-1 text-sm">{provider.title}</p>

                  <div className="flex flex-col">
                    {provider.authMethods.map(authMethod => (
                      <Checkbox
                        id={authMethod.acrValue}
                        label={authMethod.title}
                        name={authMethod.acrValue}
                        checked={settings.acrValues.includes(authMethod.acrValue)}
                        onChange={() => toggleAcrValue(authMethod.acrValue)}
                        className="text-light-blue-800"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="default"
            onClick={() => {
              setSettings({
                domain: oidcConfig.domain,
                clientId: oidcConfig.clientId,
                clientSecret: oidcConfig.clientSecret,
                scope: oidcConfig.scope,
                acrValues: oidcConfig.acrValues || [],
                pkJwtAuth: oidcConfig.pkJwtAuth,
              });
            }}
          >
            Reset
          </Button>
          <Button variant="primary" onClick={() => onSave(settings)}>
            Save
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
