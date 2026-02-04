import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { JWTPayload } from 'jose';
import useLocalStorage from './hooks/useLocalStorage';
import OidcSettingsModal from './components/OidcSettingsModal';
import oidcConfig from './oidcConfig';
import StepOne from './components/steps/StepOne';
import StepTwo from './components/steps/StepTwo';
import StepThree from './components/steps/StepThree';
import StepFour from './components/steps/StepFour';
import { Button } from '../Button/Button';
import {
  buildTokenReqParams,
  formattedTokenRequest,
  exchangeCodeForTokens,
} from './utils/tokenRequest';
import { verifyJwt } from './utils/verifyJwt';
import type { OidcTokenResponse, OidcSettings } from './types';

const OidcVisualizer = () => {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [tokenResponse, setTokenResponse] = useState<OidcTokenResponse | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<JWTPayload | null>(null);
  const [tokenRequest, setTokenRequest] = useState<string | null>(null);
  const [codeExchangeCompleted, setCodeExchangeCompleted] = useState<boolean>(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);
  const [step3Error, setStep3Error] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [oidcSettings, setOidcSettings] = useLocalStorage<OidcSettings>(
    'oidc-settings',
    oidcConfig,
  );

  const authorizeUrl = `https://${oidcSettings.domain}/oauth2/authorize?response_type=code&client_id=${oidcSettings.clientId}&redirect_uri=${encodeURIComponent(oidcConfig.redirectUri)}&scope=${encodeURIComponent(oidcSettings.scope)}${
    oidcSettings.acrValues?.length
      ? `&acr_values=${encodeURIComponent(oidcSettings.acrValues.join(' '))}`
      : ''
  }`;

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
    if (!authCode) return;
    const el = stepRefs[currentStep].current;
    if (!el) return;

    const headerHeight = 56;
    const elementTop = el.getBoundingClientRect().top;
    const targetY = elementTop + window.scrollY - headerHeight;

    // When token is received, scroll to the bottom of step #2 to show the "Next" button
    if (tokenResponse && !decodedPayload && currentStep !== 3) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      // Otherwise, scroll to top
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    }
  }, [currentStep, tokenResponse, tokenRequest]);

  /* Extract authorization code from URL on mount */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      setAuthCode(code);
      window.history.replaceState({}, document.title, window.location.pathname); // Remove authorization code from URL
    }
  }, []);

  /* Create formatted token request (only for display)*/
  useEffect(() => {
    if (!authCode) return;

    (async () => {
      const params = await buildTokenReqParams({ authCode, oidcSettings });
      const formattedRequest = formattedTokenRequest({ params, oidcSettings });
      setTokenRequest(formattedRequest);
    })().catch(err => {
      console.error(err);
    });
  }, [authCode, oidcSettings]);

  /* Handle code for token exchange */
  const handleExchange = async () => {
    if (!authCode) return;

    try {
      const res = await exchangeCodeForTokens({ authCode, oidcSettings });

      const data: OidcTokenResponse = await res.json();

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
    <div className="max-w-3xl pl-0 p-2">
      {/* STEP 1: Authorization */}
      <StepOne
        stepRef={step1Ref}
        authCode={authCode}
        authorizeUrl={authorizeUrl}
        onLogin={() => {
          window.location.href = authorizeUrl;
        }}
        requestSettings={
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="text-primary-600 uppercase text-xs font-medium transition hover:text-primary-800 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none mb-1"
          >
            <div className="flex flex-row items-center flex-end gap-1 mb-0 align-bottom">
              <p className="m-0">Configure</p>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-5 w-5 ">
                <path
                  fill="#604fed"
                  d="M384.1 48L404.6 147.5C412.4 151.3 420 155.7 427.2 160.6L523.7 128.6L587.7 239.5L511.7 307C512.3 315.6 512.3 324.5 511.7 333L587.7 400.5L523.7 511.4L427.2 479.4C420 484.2 412.5 488.6 404.6 492.5L384.1 592L256.1 592L235.6 492.5C227.8 488.7 220.2 484.3 213 479.4L116.5 511.4L52.5 400.5L128.5 333C127.9 324.4 127.9 315.5 128.5 307L52.5 239.4L116.5 128.5L213 160.5C220.2 155.7 227.7 151.3 235.6 147.4L256.1 47.9L384.1 47.9zM437.3 191L422.4 196L409.4 187.2C403.4 183.2 397.1 179.5 390.6 176.3L376.5 169.4L373.3 154L358.1 80L282.3 80C270.1 139.1 264 168.9 263.9 169.4L249.8 176.3C243.3 179.5 237 183.1 231 187.2L218 196C217.5 195.8 188.7 186.3 131.4 167.2L93.3 232.8C138.4 272.9 161.2 293.1 161.5 293.4L160.5 309C160 316.2 160 323.6 160.5 330.8L161.5 346.4L149.8 356.8L93.3 407L131.2 472.7L202.9 448.9L217.8 443.9L230.8 452.7C236.8 456.7 243.1 460.4 249.6 463.6L263.7 470.5C263.8 471 269.9 500.7 282.1 559.9L357.9 559.9L373.1 485.9L376.3 470.5L390.4 463.6C396.9 460.4 403.2 456.8 409.2 452.7L422.2 443.9L437.1 448.9L508.8 472.7L546.7 407L490.2 356.8L478.5 346.4L479.5 330.8C480 323.6 480 316.2 479.5 309L478.5 293.4L490.2 283L546.7 232.8L508.8 167.1L437.1 190.9zM264.1 320C264.1 350.9 289.1 376 320.1 376C351 376 376 350.9 376 320C376 289.1 351 264.1 320.1 264.1C289.1 264.1 264.1 289.1 264.1 320zM320 408C271.4 408 232 368.6 232.1 320C232.1 271.3 271.5 232 320.1 232C368.7 232 408.1 271.4 408.1 320.1C408 368.7 368.6 408 320 408z"
                />
              </svg>
            </div>
          </button>
        }
      />

      {/* STEP 2: Code for Token Exchange */}
      <StepTwo
        req={tokenRequest}
        stepRef={step2Ref}
        authCode={authCode}
        tokenResponse={tokenResponse}
        codeExchangeCompleted={codeExchangeCompleted}
        onCodeExchange={handleExchange}
        proceedToVerifyWT={proceedToVerifyWT}
        step2Error={step2Error}
        pkJwtAuth={oidcSettings.pkJwtAuth}
      />

      {/* STEP 3: Token Verification */}
      {!step2Error && (
        <StepThree
          stepRef={step3Ref}
          tokenResponse={tokenResponse}
          codeExchangeCompleted={codeExchangeCompleted}
          decodedPayload={decodedPayload}
          onVerify={() =>
            verifyJwt({
              tokenResponse,
              oidcSettings,
              setDecodedPayload,
              setStep3Error,
            })
          }
        />
      )}

      {/* STEP 4: Result */}
      {decodedPayload && !step2Error && (
        <StepFour stepRef={step4Ref} decodedPayload={decodedPayload} />
      )}

      {/* Reset Button */}
      {(decodedPayload || step2Error || step3Error) && (
        <div className="flex justify-center mt-4">
          <Button variant="primary" onClick={handleReset}>
            Start over
          </Button>
        </div>
      )}

      {/* OIDC Settings Modal */}
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
          acrValues={oidcSettings.acrValues}
        />
      )}
    </div>
  );
};

export default OidcVisualizer;
