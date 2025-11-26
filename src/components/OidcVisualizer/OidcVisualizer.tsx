import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { jwtVerify, createRemoteJWKSet, JWTPayload } from 'jose';
import { formatUrl } from './helpers';
import useLocalStorage from './hooks/useLocalStorage';
import StepCard from './components/StepCard';
import OidcSettingsModal from './components/OidcSettingsModal';
import oidcConfig from './oidcConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

type OidcTokenResponse = {
  token_type: 'Bearer';
  expires_in: number;
  id_token: string;
  access_token: string;
  error?: string;
  error_description?: string;
};

type OidcSettings = {
  domain: string;
  clientId: string;
  clientSecret: string;
  scope: string;
};

const OidcVisualizer = () => {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [tokenResponse, setTokenResponse] = useState<OidcTokenResponse | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<JWTPayload | null>(null);
  const [codeExchangeCompleted, setCodeExchangeCompleted] = useState<boolean>(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [step3Error, setStep3Error] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [oidcSettings, setOidcSettings] = useLocalStorage<OidcSettings>(
    'oidc-settings',
    oidcConfig,
  );

  const authorizeUrl = `https://${oidcSettings.domain}/oauth2/authorize?response_type=code&client_id=${oidcSettings.clientId}&redirect_uri=${encodeURIComponent(oidcConfig.redirectUri)}&scope=${encodeURIComponent(oidcSettings.scope)}`;

  const baseBtnStyles =
    'px-6 py-4 bg-sky-900 text-white uppercase text-xs font-medium transition hover:bg-sky-700 hover:delay-100';

  /* Close settings modal with Escape key */
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowSettings(false);
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* Define the current step for scrolling */
  const STEP = {
    STEP_1: 1,
    STEP_2: 2,
    STEP_3: 3,
    STEP_4: 4,
  } as const;

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  const currentStep = (() => {
    if (decodedPayload) return STEP.STEP_4;
    if (tokenResponse && codeExchangeCompleted) return STEP.STEP_3;
    if (authCode) return STEP.STEP_2;
    return STEP.STEP_1;
  })();

  const stepRefs = {
    [STEP.STEP_1]: step1Ref,
    [STEP.STEP_2]: step2Ref,
    [STEP.STEP_3]: step3Ref,
    [STEP.STEP_4]: step4Ref,
  };

  /* Scroll to current step on step change */
  useLayoutEffect(() => {
    const el = stepRefs[currentStep].current;
    if (!el) return;

    const headerHeight = 56;
    const elementTop = el.getBoundingClientRect().top;
    const targetY = elementTop + window.scrollY - headerHeight;

    if (tokenResponse && !decodedPayload && currentStep !== 3) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
      // When token is received, scroll to the bottom of step #2 to show "Next" button
    } else {
      // Otherwise, scroll to center
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    }
  }, [currentStep, tokenResponse]);

  /* Extract authorization code from URL on mount */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      setAuthCode(code);
      window.history.replaceState({}, document.title, window.location.pathname); // Remove authorization code from URL
    }
  }, []);

  /* Handle code for token exchange */
  const handleExchange = async () => {
    if (!authCode) return;

    try {
      const getToken = await fetch(`https://${oidcSettings.domain}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: oidcSettings.clientId,
          client_secret: oidcSettings.clientSecret,
          code: authCode,
          redirect_uri: oidcConfig.redirectUri,
        }),
      });

      const data: OidcTokenResponse = await getToken.json();

      if (data.error) throw new Error(data.error_description || data.error);
      setTokenResponse(data);
    } catch (err: any) {
      setStep2Error(err.message);
    }
  };

  /* Proceed to token verification step */
  const proceedToVerifyWT = () => {
    setCodeExchangeCompleted(true);
  };

  /* Handle JWT validation */
  const handleVerify = async () => {
    if (!tokenResponse?.id_token) return;

    try {
      const JWKS = createRemoteJWKSet(
        new URL(`https://${oidcSettings.domain}/.well-known/jwks.json`),
      );
      const { payload } = await jwtVerify(tokenResponse.id_token, JWKS);
      setDecodedPayload(payload);
    } catch (err: any) {
      setStep3Error('Token Verification Failed: ' + err.message);
    }
  };

  const handleLogin = () => {
    window.location.href = authorizeUrl;
  };

  const handleReset = () => {
    setAuthCode(null);
    setTokenResponse(null);
    setDecodedPayload(null);
    setCodeExchangeCompleted(false);
    setStep2Error(null);
    setStep3Error(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  /* Updating OIDC settings */
  const handleUpdateSettings = (newSettings: OidcSettings) => {
    setOidcSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
    handleReset();
    setShowSettings(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-0">OpenID Connect Visualizer</h1>
        <button
          onClick={() => setShowSettings(true)}
          className="px-2 py-2 bg-white text-sky-700 uppercase text-xs font-medium transition hover:text-sky-900 hover:delay-100 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none"
        >
          <div className="flex flex-row items-center gap-1 ">
            <FontAwesomeIcon icon="gear" className="text-md" />
            <p>Configure</p>
          </div>
        </button>
      </div>

      {/* STEP 1: Authorization */}
      <StepCard
        number={1}
        cardRef={step1Ref}
        title="Redirect to OpenID Connect Server"
        description="User is redirected to the Authorization Server to log in."
        req={formatUrl(authorizeUrl)}
        res={authCode ? { code: authCode } : null}
        isActive={!authCode}
        isCompleted={!!authCode}
        action={
          <button onClick={handleLogin} className={baseBtnStyles}>
            Start
          </button>
        }
      />

      {/* STEP 2: Code for Token Exchange */}
      <StepCard
        number={2}
        cardRef={step2Ref}
        title="Exchange Code for Token"
        description={
          authCode && (
            <>
              Your Authorization Code is:{' '}
              <span className="bg-gray-200 text-gray-700 font-mono text-sm px-2 py-1 rounded-sm shadow-inner break-all">
                {authCode}
              </span>
              <p className="mt-2 ">
                Now, the authorization code can be exchanged for an access token and an ID token. To
                do this, the authorization server sends a POST request to your token endpoint,
                including the authorization code and the client credentials. Note that the
                authorization code is valid for a single use.
              </p>
            </>
          )
        }
        req={
          authCode
            ? {
                method: 'POST',
                url: `/oauth2/token`,
                body: {
                  grant_type: 'authorization_code',
                  code: authCode,
                  client_id: oidcConfig.clientId,
                },
              }
            : null
        }
        responseId="codeExchangeResponse"
        res={tokenResponse}
        isActive={!!authCode && !codeExchangeCompleted}
        isCompleted={!!tokenResponse && codeExchangeCompleted}
        action={
          !tokenResponse ? (
            <button
              onClick={handleExchange}
              disabled={!!step2Error}
              className={cx(
                baseBtnStyles,
                step2Error && 'bg-gray-400 cursor-not-allowed hover:bg-gray-400',
              )}
            >
              Exchange Code
            </button>
          ) : (
            <button onClick={proceedToVerifyWT} className={baseBtnStyles}>
              Next
            </button>
          )
        }
        error={step2Error}
      />

      {/* STEP 3: Token Verification */}
      <StepCard
        number={3}
        cardRef={step3Ref}
        title="Verify ID Token"
        description={
          tokenResponse && (
            <>
              <p className="text-gray-600 mb-3">
                The final step is validating the <span className="font-semibold">ID Token</span>. We
                must confirm the token came from the correct sender and hasn't been tampered with by
                verifying its <span className="font-semibold">JWT signature</span>.
              </p>

              <p className="font-semibold mt-4">Your id_token is:</p>

              <div className="bg-slate-900 text-slate-50 p-4 rounded mt-1 overflow-x-auto font-mono text-sm">
                <pre>{tokenResponse.id_token}</pre>
              </div>

              <p className="mt-4 text-gray-600">
                This token is cryptographically signed with the HS256 algorithm. We'll use the
                client secret to confirm the signature is valid.
              </p>
            </>
          )
        }
        isActive={!!tokenResponse && !decodedPayload && codeExchangeCompleted}
        isCompleted={!!decodedPayload}
        action={
          <button onClick={handleVerify} className={baseBtnStyles}>
            Validate Signature
          </button>
        }
        error={step3Error}
      />

      {/* STEP 4: Result */}
      {decodedPayload && (
        <StepCard
          number={4}
          cardRef={step4Ref}
          title="🎉 ID Token is valid!"
          description={
            <>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Decoded payload:
              </p>
              <div className="bg-slate-900 text-slate-50 p-4 rounded mt-1 overflow-x-auto font-mono text-sm">
                <pre>{JSON.stringify(decodedPayload, null, 2)}</pre>
              </div>
            </>
          }
          isActive={!!decodedPayload}
          isCompleted={!!decodedPayload}
        />
      )}

      {/* Reset Button */}
      {(decodedPayload || step2Error || step3Error) && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleReset}
            className="px-6 py-4 bg-white border-2 border-sky-900 text-sky-900 uppercase text-xs font-medium transition hover:bg-sky-900 hover:text-white hover:delay-100"
          >
            Start over
          </button>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <OidcSettingsModal
          open={showSettings}
          onClose={() => setShowSettings(false)}
          domain={oidcSettings.domain}
          clientId={oidcSettings.clientId}
          clientSecret={oidcSettings.clientSecret}
          scope={oidcSettings.scope}
          redirectUri={oidcConfig.redirectUri}
          onSave={handleUpdateSettings}
        />
      )}
    </div>
  );
};

export default OidcVisualizer;
