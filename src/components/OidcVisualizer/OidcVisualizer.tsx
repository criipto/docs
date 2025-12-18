import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { jwtVerify, createRemoteJWKSet, JWTPayload } from 'jose';
import useLocalStorage from './hooks/useLocalStorage';
import OidcSettingsModal from './components/OidcSettingsModal';
import oidcConfig from './oidcConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StepOne from './components/steps/StepOne';
import StepTwo from './components/steps/StepTwo';
import StepThree from './components/steps/StepThree';
import StepFour from './components/steps/StepFour';
import { clientAssertion } from './generateJwt';
import type { OidcTokenResponse, OidcSettings } from './types';

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
      const params: Record<string, string> = {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: oidcConfig.redirectUri,
      };

      if (oidcSettings.pkJwtAuth) {
        params['client_assertion_type'] = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
        params['client_assertion'] = clientAssertion;
      } else {
        params['client_id'] = oidcSettings.clientId;
        params['client_secret'] = oidcSettings.clientSecret;
      }

      console.log(`exchanging token, pkJwtAuth: ${oidcSettings.pkJwtAuth}`);

      const getToken = await fetch(`https://${oidcSettings.domain}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(params),
      });
      console.log('Params object:', params);
      console.log('URL encoded body:', new URLSearchParams(params).toString());

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
    console.log('updating settings');
    setOidcSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
    console.log('new settings:', oidcSettings);
    handleReset();
    setShowSettings(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center mb-8">
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
      <StepOne
        stepRef={step1Ref}
        authCode={authCode}
        authorizeUrl={authorizeUrl}
        onLogin={() => {
          window.location.href = authorizeUrl;
        }}
      />

      {/* STEP 2: Code for Token Exchange */}
      <StepTwo
        stepRef={step2Ref}
        authCode={authCode}
        tokenResponse={tokenResponse}
        codeExchangeCompleted={codeExchangeCompleted}
        onCodeExchange={handleExchange}
        proceedToVerifyWT={proceedToVerifyWT}
        step2Error={step2Error}
      />

      {/* STEP 3: Token Verification */}
      <StepThree
        stepRef={step3Ref}
        tokenResponse={tokenResponse}
        codeExchangeCompleted={codeExchangeCompleted}
        decodedPayload={decodedPayload}
        onVerify={handleVerify}
      />

      {/* STEP 4: Result */}
      {decodedPayload && <StepFour stepRef={step4Ref} decodedPayload={decodedPayload} />}

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
          pkJwtAuth={oidcSettings.pkJwtAuth}
          oidcSettings={oidcSettings}
          setOidcSettings={setOidcSettings}
        />
      )}
    </div>
  );
};

export default OidcVisualizer;
