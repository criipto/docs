import React, { useEffect, useMemo, useState } from 'react';

import { H3, Paragraph } from './MdxProvider';
import URLCodeBlock from './URLCodeBlock';
import { PROVIDERS } from '../utils/auth-methods';
import { Link } from 'gatsby';

const ACTION_SUPPORTING_ACR_VALUES = [
  'urn:grn:authn:dk:mitid:low',
  'urn:grn:authn:dk:mitid:substantial',
  'urn:grn:authn:dk:mitid:high',
  'urn:grn:authn:dk:mitid:business',
  'urn:grn:authn:se:bankid',
  'urn:grn:authn:se:bankid:same-device',
  'urn:grn:authn:se:bankid:another-device:qr',
  'urn:grn:authn:no:bankid',
];

const FREJA_ACTION_SUPPORTING_ACR_VALUES = ['urn:grn:authn:se:frejaid'];

const TITLE_SUPPORTING_ACR_VALUES = ['urn:grn:authn:se:frejaid'];

const PUSH_TITLE_SUPPORTING_ACR_VALUES = ['urn:grn:authn:se:frejaid'];

const PUSH_TEXT_SUPPORTING_ACR_VALUES = ['urn:grn:authn:se:frejaid'];

const MESSAGE_SUPPORTING_ACR_VALUES = [
  'urn:grn:authn:dk:mitid:low',
  'urn:grn:authn:dk:mitid:substantial',
  'urn:grn:authn:dk:mitid:high',
  'urn:grn:authn:dk:mitid:business',
  'urn:grn:authn:se:bankid',
  'urn:grn:authn:se:bankid:same-device',
  'urn:grn:authn:se:bankid:another-device:qr',
  'urn:grn:authn:se:frejaid',
  'urn:grn:authn:no:bankid',
];

const NONVISIBLEDATA_SUPPORTING_ACR_VALUES = [
  'urn:grn:authn:se:bankid',
  'urn:grn:authn:se:bankid:same-device',
  'urn:grn:authn:se:bankid:another-device:qr',
  'urn:grn:authn:se:frejaid',
];

const ID_TOKEN_HINT_SUPPORT_ACR_VALUES = ['urn:age-verification'];

const TXINFO_SUPPORT_ACR_VALUES = ['urn:grn:authn:de:personalausweis'];

const MINREGISTRATIONLEVEL_SUPPORT_ACR_VALUES = ['urn:grn:authn:se:frejaid'];
const minRegistrationLevels = ['basic', 'extended', 'plus'] as const;
type MinRegistrationLevel = (typeof minRegistrationLevels)[number];
const nonBasicFrejaIdScopes = [
  'frejaid:basic_user_info',
  'frejaid:date_of_birth',
  'frejaid:age',
  'frejaid:ssn',
  'frejaid:addresses',
  'frejaid:document',
  'frejaid:photo',
  'frejaid:document_photo',
];

const USERCONFIRMATIONMETHOD_SUPPORT_ACR_VALUES = ['urn:grn:authn:se:frejaid'];
const userConfirmationMethods = ['default', 'defaultandface'] as const;
type UserConfirmationMethod = (typeof userConfirmationMethods)[number];

const actions = ['login', 'confirm', 'accept', 'approve', 'sign'] as const;
type Action = (typeof actions)[number];

const frejaActions = ['sign', 'sign_extended', 'sign_advanced'] as const;
type FrejaAction = (typeof frejaActions)[number];

const prompts = ['login', 'none', 'consent', 'consent_revoke'] as const;
type Prompt = (typeof prompts)[number];

interface AuthorizeURLOptions {
  domain: string;
  client_id: string;
  redirect_uri: string;
  response_type: 'code' | 'id_token';
  response_mode: 'query' | 'fragment';
  acr_values: string[];
  acr_values_quirk: 'none' | 'login_hint' | 'path';
  nonce: string;
  state: string | null;
  login_hint: string | null;
  id_token_hint: string | null;
  availableScopes: string[];
  selectedScopes: string[];
  scopes_quirk: 'none' | 'login_hint';
  prompt: Prompt | null;
  action: Action | null;
  frejaAction: FrejaAction | null;
  title: string | null;
  pushTitle: string | null;
  pushText: string | null;
  message: string | null;
  nonVisibleData: string | null;
  txInfo: string | null;
  minRegistrationLevel: MinRegistrationLevel | null;
  userConfirmationMethod: UserConfirmationMethod | null;
}

const isBrowser = typeof window !== 'undefined';

function randomUUID() {
  if (!isBrowser) return '';
  if (window.crypto.getRandomValues !== undefined) return window.crypto.randomUUID();
  return (
    (Math.random() + 1).toString(36).substring(2) +
    (Math.random() + 1).toString(36).substring(2) +
    (Math.random() + 1).toString(36).substring(2)
  );
}

export default function AuthorizeURLBuilder(props: {
  acr_values?: string[];
  login_hint?: string;
  scope?: string[];

  quirks?: boolean;
}) {
  const [options, setOptions] = useState<AuthorizeURLOptions>({
    domain: 'criipto-verify-prod.criipto.id',
    client_id: 'urn:criipto:dev',
    redirect_uri: 'https://jwt.io',
    response_type: 'id_token',
    response_mode: 'fragment',
    acr_values: props.acr_values ?? [],
    acr_values_quirk: 'none',
    nonce: `ecnon-${randomUUID()}`,
    state: null,
    login_hint: props.login_hint ?? null,
    id_token_hint: null,
    availableScopes: [],
    selectedScopes: props.scope ?? [],
    scopes_quirk: 'none',
    prompt: null,
    action: null,
    frejaAction: null,
    title: null,
    pushTitle: null,
    pushText: null,
    message: null,
    nonVisibleData: null,
    txInfo: 'TestCompany',
    minRegistrationLevel: null,
    userConfirmationMethod: null,
  });

  useEffect(() => {
    if (!isBrowser) return;
    const url = new URL(location.href);
    const domain = url.searchParams.get('domain');
    const client_id = url.searchParams.get('client_id');
    const redirect_uri = url.searchParams.get('redirect_uri');
    const acr_values = url.searchParams.get('acr_values')?.split(' ');
    const action = url.searchParams.get('action') as Action | null;
    const frejaAction = url.searchParams.get('frejaAction') as FrejaAction | null;
    const prompt = url.searchParams.get('prompt') as Prompt | null;
    const minRegistrationLevel = url.searchParams.get(
      'minregistrationlevel',
    ) as MinRegistrationLevel | null;
    const userConfirmationMethod = url.searchParams.get('prompt') as UserConfirmationMethod | null;
    setOptions(options => ({
      ...options,
      domain: domain ?? options.domain,
      client_id: client_id ?? options.client_id,
      redirect_uri: redirect_uri ?? options.redirect_uri,
      acr_values: acr_values ?? options.acr_values,
      action: action ?? options.action,
      frejaAction: frejaAction ?? options.frejaAction,
      title: url.searchParams.get('title') ?? options.title,
      pushTitle: url.searchParams.get('pushTitle') ?? options.pushTitle,
      pushText: url.searchParams.get('pushText') ?? options.pushText,
      message: url.searchParams.get('message') ?? options.message,
      nonVisibleData: url.searchParams.get('nonVisibleData') ?? options.nonVisibleData,
      txInfo: url.searchParams.get('txinfo') ?? options.txInfo,
      prompt: prompt ?? options.prompt,
      minRegistrationLevel: minRegistrationLevel ?? options.minRegistrationLevel,
      userConfirmationMethod: userConfirmationMethod ?? options.userConfirmationMethod,
    }));
  }, []);

  const supports = useMemo(
    () => ({
      action:
        options.acr_values.length === 1
          ? ACTION_SUPPORTING_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => ACTION_SUPPORTING_ACR_VALUES.includes(v)) &&
              !options.acr_values.some(v => FREJA_ACTION_SUPPORTING_ACR_VALUES.includes(v))
            : true,
      frejaAction:
        options.acr_values.length === 1
          ? FREJA_ACTION_SUPPORTING_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(
                v =>
                  FREJA_ACTION_SUPPORTING_ACR_VALUES.includes(v) &&
                  !options.acr_values.some(v => ACTION_SUPPORTING_ACR_VALUES.includes(v)),
              )
            : false,
      title:
        options.acr_values.length === 1
          ? TITLE_SUPPORTING_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => TITLE_SUPPORTING_ACR_VALUES.includes(v))
            : false,
      pushTitle:
        options.acr_values.length === 1
          ? PUSH_TITLE_SUPPORTING_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => PUSH_TITLE_SUPPORTING_ACR_VALUES.includes(v))
            : false,
      pushText:
        options.acr_values.length === 1
          ? PUSH_TEXT_SUPPORTING_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => PUSH_TEXT_SUPPORTING_ACR_VALUES.includes(v))
            : false,
      message:
        options.acr_values.length === 1
          ? MESSAGE_SUPPORTING_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => MESSAGE_SUPPORTING_ACR_VALUES.includes(v))
            : false,
      id_token_hint:
        options.acr_values.length === 1
          ? ID_TOKEN_HINT_SUPPORT_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => ID_TOKEN_HINT_SUPPORT_ACR_VALUES.includes(v))
            : false,
      nonVisibleData:
        options.acr_values.length === 1
          ? NONVISIBLEDATA_SUPPORTING_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => NONVISIBLEDATA_SUPPORTING_ACR_VALUES.includes(v))
            : false,
      txInfo:
        options.acr_values.length === 1
          ? TXINFO_SUPPORT_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => TXINFO_SUPPORT_ACR_VALUES.includes(v))
            : false,
      minRegistrationLevel:
        options.acr_values.length === 1
          ? MINREGISTRATIONLEVEL_SUPPORT_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => MINREGISTRATIONLEVEL_SUPPORT_ACR_VALUES.includes(v))
            : false,
      userConfirmationMethod:
        options.acr_values.length === 1
          ? USERCONFIRMATIONMETHOD_SUPPORT_ACR_VALUES.includes(options.acr_values[0])
          : options.acr_values.length >= 2
            ? options.acr_values.some(v => USERCONFIRMATIONMETHOD_SUPPORT_ACR_VALUES.includes(v))
            : false,
    }),
    [options.acr_values],
  );
  const supportsAction = supports.action;
  const supportsFrejaAction = supports.frejaAction;
  const supportsTitle = supports.title;
  const supportsPushTitle = supports.pushTitle;
  const supportsPushText = supports.pushText;
  const supportsMessage = supports.message;
  const supportsNonVisibleData = supports.nonVisibleData;
  const supportsTxInfo = supports.txInfo;
  const supportsMinRegistrationLevel = supports.minRegistrationLevel;
  const supportsUserConfirmationMethod = supports.userConfirmationMethod;
  const notAlphanumeric = /[^a-z0-9]+/gi;
  function intersect(a: string[], b: string[]) {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
  }
  const containsNonBasicFrejaIdScopes =
    intersect(options.selectedScopes, nonBasicFrejaIdScopes).length > 0;

  const updateOption = (
    key: keyof AuthorizeURLOptions,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setOptions(options => ({
      ...options,
      [key]: event.target.value,
    }));
  };

  const updateBooleanOption = (
    key: keyof AuthorizeURLOptions,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOptions(options => ({
      ...options,
      [key]: event.target.checked,
    }));
  };

  const toggleAcrValue = (acrValue: string) => {
    setOptions(options => {
      let acr_values = options.acr_values;

      if (acr_values.includes(acrValue)) {
        acr_values = acr_values.filter(s => s !== acrValue);
      } else {
        acr_values = acr_values.concat([acrValue]);
      }

      return {
        ...options,
        acr_values,
      };
    });
  };

  useEffect(() => {
    let scopeCandidates = options.acr_values
      .flatMap(acrValue => {
        return PROVIDERS.flatMap(provider => {
          return provider.authMethods.filter(am => am.acrValue === acrValue);
        });
      })
      .map(authMethod => authMethod.scopes || []);

    let seed = scopeCandidates.shift() || [];
    let availableScopes = scopeCandidates.reduce((memo, ary) => {
      return memo.filter(i => ary.includes(i));
    }, seed);

    let selectedScopes = options.selectedScopes.filter(selScope => {
      return availableScopes.includes(selScope);
    });

    setOptions(options => ({
      ...options,
      availableScopes,
      selectedScopes,
    }));
  }, [options.acr_values]);

  const toggleScope = (scope: string) => {
    setOptions(options => {
      let selectedScopes = options.selectedScopes;
      if (selectedScopes.includes(scope)) {
        selectedScopes = selectedScopes.filter(s => s !== scope);
      } else {
        selectedScopes = selectedScopes.concat([scope]);
      }
      return {
        ...options,
        selectedScopes,
      };
    });
  };

  const url = new URL(`https://${options.domain}/oauth2/authorize?scope=openid`);

  let key: keyof AuthorizeURLOptions;
  for (key in options) {
    if (key == 'acr_values') continue;
    if (key == 'acr_values_quirk') continue;
    if (key == 'domain') continue;
    if (key == 'availableScopes') continue;
    if (key == 'selectedScopes') continue;
    if (key == 'scopes_quirk') continue;
    if (key == 'action') continue;
    if (key == 'frejaAction') continue;
    if (key == 'title') continue;
    if (key == 'pushTitle') continue;
    if (key == 'pushText') continue;
    if (key == 'message') continue;
    if (key == 'login_hint') continue;
    if (key == 'nonVisibleData') continue;
    if (key == 'txInfo') continue;
    if (key == 'minRegistrationLevel') continue;
    if (key == 'userConfirmationMethod') continue;
    if (!options[key]) continue;
    url.searchParams.set(key, options[key]!);
  }

  let loginHint = options.login_hint ? [options.login_hint] : [];
  if (options.acr_values.length) {
    if (options.acr_values_quirk == 'login_hint' && options.acr_values.length === 1) {
      loginHint.unshift(`acr_values:${options.acr_values.join(' ')}`);
    } else if (options.acr_values_quirk == 'path' && options.acr_values.length === 1) {
      url.pathname = `${btoa(options.acr_values[0])}/oauth2/authorize`;
    } else {
      url.searchParams.set('acr_values', options.acr_values.join(' '));
    }
  }

  if (options.selectedScopes.length) {
    if (options.scopes_quirk == 'login_hint') {
      let tokens = options.selectedScopes.map(s => `scope:${s}`);
      loginHint.unshift(`${tokens.join(' ')}`);
    } else {
      url.searchParams.set('scope', `openid ${options.selectedScopes.join(' ')}`);
    }
  }

  if (supportsAction && options.action) {
    loginHint.push(`action:${options.action}`);
  }

  if (supportsFrejaAction && options.frejaAction) {
    loginHint.push(`action:${options.frejaAction}`);
  }

  if (supportsTitle && options.title) {
    loginHint.push(`title:${btoa(options.title)}`);
  }

  if (supportsPushTitle && options.pushTitle) {
    loginHint.push(`pushTitle:${btoa(options.pushTitle)}`);
  }

  if (supportsPushText && options.pushText) {
    loginHint.push(`pushText:${btoa(options.pushText)}`);
  }

  if (supportsMessage && options.message) {
    loginHint.push(`message:${btoa(options.message)}`);
  }

  if (supportsNonVisibleData && options.nonVisibleData) {
    loginHint.push(`nonVisibleData:${btoa(options.nonVisibleData)}`);
  }

  if (supportsTxInfo && options.txInfo) {
    loginHint.push(`txinfo:${options.txInfo}`);
  }

  if (supportsMinRegistrationLevel && options.minRegistrationLevel) {
    loginHint.push(`minregistrationlevel:${options.minRegistrationLevel}`);
  }

  if (supportsUserConfirmationMethod && options.userConfirmationMethod) {
    loginHint.push(`userconfirmationmethod:${options.userConfirmationMethod}`);
  }

  if (loginHint.length > 0) {
    url.searchParams.set('login_hint', loginHint.join(' '));
  }

  return (
    <React.Fragment>
      <H3>General parameters</H3>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="domain">
            Domain
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="domain"
            type="text"
            placeholder="Domain"
            value={options.domain}
            onChange={event => updateOption('domain', event)}
          />
        </div>
        <div>
          <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="clientID">
            Client ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="clientID"
            type="text"
            placeholder="Client ID"
            value={options.client_id}
            onChange={event => updateOption('client_id', event)}
          />
          <small>Also known as 'realm'</small>
        </div>
        <div>
          <label
            className="block text-light-blue-800 text-sm font-medium mb-2"
            htmlFor="redirectURI"
          >
            Redirect URI
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="redirectURI"
            type="text"
            placeholder="Redirect URI"
            value={options.redirect_uri}
            onChange={event => updateOption('redirect_uri', event)}
          />
          <small>Also known as 'Callback URL'</small>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-light-blue-800 text-sm font-medium mb-2"
            htmlFor="responseType"
          >
            Response type
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="responseType"
            value={options.response_type}
            onChange={event => updateOption('response_type', event)}
          >
            <option value="code">code</option>
            <option value="id_token">id_token</option>
          </select>
          <small>
            `code` is the recommended response_type and enables PKCE and back-channel flows.
            `id_token` is deprecated but useful for debugging with `https://jwt.io`
          </small>
        </div>
        <div>
          <label
            className="block text-light-blue-800 text-sm font-medium mb-2"
            htmlFor="responseMode"
          >
            Response mode
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="responseMode"
            value={options.response_mode}
            onChange={event => updateOption('response_mode', event)}
          >
            <option value="query">query</option>
            <option value="fragment">fragment</option>
          </select>
          {(options.selectedScopes.includes('frejaid:photo') ||
            options.selectedScopes.includes('frejaid:document_photo')) &&
            options.response_type === 'id_token' &&
            (options.response_mode === 'fragment' || options.response_mode === 'query') && (
              <small>
                <span className="text-red-400">
                  The selected scopes cannot be returned via a URL-based response. You must select a
                  different Response Type or Response Mode!
                </span>
                <br />
              </small>
            )}
        </div>
        <div>
          <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="nonce">
            Nonce
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="nonce"
            type="text"
            placeholder="Nonce"
            value={options.nonce}
            onChange={event => updateOption('nonce', event)}
          />
          <small>Should be a cryptographically strong value</small>
        </div>
        <div>
          <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="prompt">
            Prompt
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="prompt"
            value={options.prompt || ''}
            onChange={event => updateOption('prompt', event)}
          >
            <option value="">Not set</option>
            {prompts.map(prompt => (
              <option key={prompt} value={prompt}>
                {prompt}
              </option>
            ))}
          </select>
          {options.prompt === 'login' ? (
            <small>`prompt=login` will force a login regardless of SSO state.</small>
          ) : options.prompt === 'none' ? (
            <small>
              `prompt=none` will use existing SSO session or fail with `login_required`.
            </small>
          ) : options.prompt === 'consent_revoke' ? (
            <small>`prompt=consent_revoke` will revoke any existing SSN consent.</small>
          ) : null}
        </div>
        <div>
          <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="state">
            State
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
            id="state"
            type="text"
            placeholder="state"
            value={options.state ?? ''}
            onChange={event => updateOption('state', event)}
          />
          <small>
            Can be any value supplied by your application, often used to carry information about the
            original user's session.
          </small>
        </div>
        {supports.id_token_hint ? (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="id_token_hint"
            >
              id_token_hint
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="id_token_hint"
              type="text"
              placeholder="id_token_hint"
              value={options.id_token_hint ?? ''}
              onChange={event => updateOption('id_token_hint', event)}
            />
          </div>
        ) : null}
        {props.acr_values && props.acr_values.every(s => s === 'urn:age-verification') ? (
          <div>
            <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="country">
              Country
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="country"
              value={options.login_hint ?? undefined}
              onChange={event => updateOption('login_hint', event)}
            >
              <option value="country:DK">DK</option>
              <option value="country:SE">SE</option>
              <option value="country:NO">NO</option>
              <option value="country:FI">FI</option>
            </select>
          </div>
        ) : (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="login_hint"
            >
              Login hint
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="login_hint"
              type="text"
              placeholder="login_hint"
              value={options.login_hint ?? ''}
              onChange={event => updateOption('login_hint', event)}
            />
            <small>
              Login hints are used for{' '}
              <a href="/verify/guides/prefilled-fields/">prefilling values</a>,{' '}
              <a href="/verify/guides/appswitch/">triggering appswitch</a> and eID unique features
              like `message` (see example below after picking MitID)
            </small>
          </div>
        )}
      </div>

      {props.acr_values === undefined ? (
        <>
          <H3>Auth methods / acr values</H3>
          <Paragraph>
            You can click the individual eID headlines or use the navigation to your left to learn
            more about each eID.
          </Paragraph>
          <Paragraph>
            If you select multiple (or zero) eIDs the user will be presented with a landing page
            where they can use their eID of choice.
          </Paragraph>
          <Paragraph>
            Some features, like <strong>input prefill</strong> and{' '}
            <strong>acr_values quirk handling</strong> is only available if you only select a{' '}
            <strong>single acr_values</strong>
          </Paragraph>
          <div className="mb-4 grid grid-cols-4 gap-4">
            {PROVIDERS.map(provider => (
              <div>
                <Link
                  to={provider.page}
                  className="font-medium no-underline text-sm"
                  title={`Learn more about ${provider.title}`}
                  target="_blank"
                >
                  {provider.title}
                </Link>
                <br />
                {provider.authMethods.map(authMethod => (
                  <label className="text-light-blue-800 text-sm block my-2">
                    <input
                      type="checkbox"
                      id={authMethod.acrValue}
                      className="mr-2"
                      checked={options.acr_values.includes(authMethod.acrValue)}
                      onChange={() => toggleAcrValue(authMethod.acrValue)}
                    />
                    {authMethod.title}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : null}

      {options.availableScopes.length > 0 ? (
        <div>
          <label className="block text-light-blue-800 text-sm font-medium mb-2">scopes</label>
          {options.availableScopes.map(scope => (
            <label className="text-light-blue-800 text-sm block my-2">
              <input
                type="checkbox"
                id={scope}
                className="mr-2"
                checked={options.selectedScopes.includes(scope)}
                onChange={() => toggleScope(scope)}
              />
              {scope}
            </label>
          ))}

          {((supportsMinRegistrationLevel && options.minRegistrationLevel === 'basic') ||
            !options.minRegistrationLevel) &&
            containsNonBasicFrejaIdScopes && (
              <small>
                <span className="text-red-400">
                  The selected scopes are not available for registration level Basic. You must
                  select a higher minimum registration level!
                </span>
                <br />
              </small>
            )}
          {(options.selectedScopes.includes('frejaid:photo') ||
            options.selectedScopes.includes('frejaid:document_photo')) &&
            options.response_type === 'id_token' &&
            (options.response_mode === 'fragment' || options.response_mode === 'query') && (
              <small>
                <span className="text-red-400">
                  The selected scopes cannot be returned via a URL-based response. You must select a
                  different Response Type or Response Mode!
                </span>
                <br />
              </small>
            )}
        </div>
      ) : null}
      <div className="mb-4 grid grid-cols-2 gap-4">
        {props.quirks !== false && options.availableScopes.length > 0 ? (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="scopes_quirk"
            >
              scopes quirk handling
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="scopes_quirk"
              value={options.scopes_quirk}
              onChange={event => updateOption('scopes_quirk', event)}
            >
              <option value="none">none</option>
              <option value="login_hint">login_hint</option>
            </select>
            <small>
              Some integrations, like Auth0, require that you pass scopes through the login_hint.
              <br />
            </small>
          </div>
        ) : null}

        {props.quirks !== false && options.acr_values.length == 1 ? (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="acr_values_quirk"
            >
              acr_values quirk handling
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="acr_values_quirk"
              value={options.acr_values_quirk}
              onChange={event => updateOption('acr_values_quirk', event)}
            >
              <option value="none">none</option>
              <option value="login_hint">login_hint</option>
              <option value="path">path</option>
            </select>
            <small>
              Some integrations, like Auth0, require that you pass acr_values through the login_hint
              instead.
              <br />
              For integrations that do not allow you to define acr_values nor login_hint you can use
              the value base64 encoded in the path segment.
              <br />
              (only supported with a single selected acr_value)
            </small>
          </div>
        ) : null}

        {supportsAction && (
          <div>
            <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="action">
              Action
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="action"
              value={options.action || ''}
              onChange={event => updateOption('action', event)}
            >
              {actions.map(action => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <small>
              Setting action will change header texts on Idura pages and also the action text inside
              the MitID login box.
            </small>
          </div>
        )}

        {supportsFrejaAction && (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="frejaAction"
            >
              Action
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="frejaAction"
              value={options.frejaAction || ''}
              onChange={event => updateOption('frejaAction', event)}
            >
              <option value="">Not set</option>
              {frejaActions.map(action => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <small>Set action to activate a Freja signature flow.</small>
          </div>
        )}

        {supportsTitle && (
          <div>
            <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="title">
              Title
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="title"
              placeholder="Title"
              value={options.title || ''}
              onChange={event => updateOption('title', event)}
            />
            <small>
              FrejaID only. Sets the title of a signature request.
              <br />
              Maximum length is 128 characters (before base64 encoding).
            </small>
          </div>
        )}

        {supportsPushTitle && (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="pushTitle"
            >
              Push notification title
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="pushTitle"
              placeholder="Push notification title"
              value={options.pushTitle || ''}
              onChange={event => updateOption('pushTitle', event)}
            />
            <small>
              FrejaID only. Sets the title of the push notification for a signature request.
              <br />
              Maximum length is 256 characters (before base64 encoding).
            </small>
          </div>
        )}

        {supportsPushText && (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="pushText"
            >
              Push notification text
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="pushText"
              placeholder="Push notification text"
              value={options.pushText || ''}
              onChange={event => updateOption('pushText', event)}
            />
            <small>
              FrejaID only. Sets the text of the push notification for a signature request.
              <br />
              Maximum length is 256 characters (before base64 encoding).
            </small>
          </div>
        )}

        {supportsMessage && (
          <div>
            <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="message"
              placeholder="Message"
              value={options.message || ''}
              onChange={event => updateOption('message', event)}
            />
            <small>
              DK MitID/SE BankID/FrejaID only. Will display a message to the end user in the app.
              <br />
              The maximum message length depends on the eID provider:
              <br />
              For SE BankID, the limit is 1500 characters <em>after base64 encoding.</em>
              <br />
              For FrejaID, the limit is 4096 characters <em>before base64 encoding.</em>
              <br />
              For MitID, our tests indicate a limit of 130 characters{' '}
              <em>before base64 encoding.</em>
            </small>
          </div>
        )}

        {supportsNonVisibleData && (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="nonVisibleData"
            >
              Non-visible data
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="nonVisibleData"
              placeholder="Non-visible data"
              value={options.nonVisibleData || ''}
              onChange={event => updateOption('nonVisibleData', event)}
            />
            <small>
              SE BankID/FrejaID only.
              <br />
              For SE BankID, will roundtrip the supplied value in the `evidence` claim in a
              dedicated XML element.
              <br />
              For FrejaID, will include the supplied data in the signed data. Only supported for the
              Extended signature flow.
              <br />
              Must be base64-encoded.
            </small>
            {options.nonVisibleData && options.frejaAction !== 'sign_extended' && (
              <small>
                <br />
                <span className="text-red-400">
                  Non-visible data is only supported for the Extended signature flow in FrejaID.
                </span>
              </small>
            )}
          </div>
        )}

        {supportsTxInfo && (
          <div>
            <label className="block text-light-blue-800 text-sm font-medium mb-2" htmlFor="txInfo">
              Transaction information
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="txInfo"
              placeholder="txinfo"
              value={options.txInfo || ''}
              defaultValue={'TestCompany'}
              onChange={event => updateOption('txInfo', event)}
            />
            <small>
              Personalausweis only. Will display in the transaction information template.
              <br />
              Up to 32 alphanumeric characters.
              {!options.txInfo && (
                <>
                  <br />
                  <span className="text-red-400">
                    txinfo must not be blank unless you have your own client credentials!
                  </span>
                </>
              )}
              {options.txInfo && options.txInfo.length > 32 && (
                <>
                  <br />
                  <span className="text-red-400">
                    txinfo must not be longer than 32 characters!
                  </span>
                </>
              )}
              {options.txInfo && notAlphanumeric.test(options.txInfo) && (
                <>
                  <br />
                  <span className="text-red-400">
                    txinfo must only contain alphanumeric characters!
                  </span>
                </>
              )}
            </small>
          </div>
        )}

        {supportsMinRegistrationLevel && (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="minregistrationlevel"
            >
              Minimum registration level
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="action"
              value={options.minRegistrationLevel || ''}
              onChange={event => updateOption('minRegistrationLevel', event)}
            >
              <option value="">Not set</option>
              {minRegistrationLevels.map(minregistrationlevel => (
                <option key={minregistrationlevel} value={minregistrationlevel}>
                  {minregistrationlevel}
                </option>
              ))}
            </select>
            <small>
              Setting minimum registration level will force users to be registered with a certain
              level of registration.
              <br />
              Selecting "extended" or "plus" will enable additional scopes.
              {(options.minRegistrationLevel === 'basic' || !options.minRegistrationLevel) &&
                containsNonBasicFrejaIdScopes && (
                  <>
                    <br />
                    <span className="text-red-400">
                      The selected scopes are not available for registration level Basic. You must
                      select a higher minimum registration level!
                    </span>
                  </>
                )}
            </small>
          </div>
        )}

        {supportsUserConfirmationMethod && (
          <div>
            <label
              className="block text-light-blue-800 text-sm font-medium mb-2"
              htmlFor="userconfirmationmethod"
            >
              User confirmation method
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-light-blue-800 leading-5 focus:outline-none focus:shadow-outline"
              id="action"
              value={options.userConfirmationMethod || ''}
              onChange={event => updateOption('userConfirmationMethod', event)}
            >
              <option value="">Not set</option>
              {userConfirmationMethods.map(userconfirmationmethod => (
                <option key={userconfirmationmethod} value={userconfirmationmethod}>
                  {userconfirmationmethod}
                </option>
              ))}
            </select>
            <small>
              Setting the user confirmation method to "defaultandface" will force users to take a
              photo of themselves during authentication and reject the request if the photo does not
              match their profile.
              {(options.minRegistrationLevel === 'basic' || !options.minRegistrationLevel) &&
                options.userConfirmationMethod === 'defaultandface' && (
                  <>
                    <br />
                    <span className="text-red-400">
                      Photo verification is not available for registration level Basic. You must
                      select a higher minimum registration level!
                    </span>
                  </>
                )}
            </small>
          </div>
        )}
      </div>

      <URLCodeBlock url={url} />
    </React.Fragment>
  );
}
