import React, { useMemo } from 'react';
import {
  JwtPayload,
  JwtPayloadArrayValue,
  JwtPayloadObjectValue,
  JwtPayloadValue,
  MitIDRiskData,
} from '../samples';

import Tooltip from './Tooltip';

import './PayloadViewer.css';

interface Props {
  payload: JwtPayload;
  className?: string;
}
export default function PayloadViewer(props: Props) {
  const keys = useMemo(() => Object.keys(props.payload), [props.payload]);

  return (
    <div className={`criipto-jwt-viewer-payload ${props.className || ''}`}>
      &#123;
      <br />
      {keys.map((key, index) => (
        <Claim key={key} claim={key} payload={props.payload} last={index === keys.length - 1} />
      ))}
      &#125;
      <br />
      {/* for debugging: <pre>
        {JSON.stringify(props.payload, null, 2)}
      </pre> */}
    </div>
  );
}

interface ClaimProps {
  parentClaim?: string;
  claim: string | number;
  payload: JwtPayload | JwtPayloadObjectValue | JwtPayloadArrayValue;
  last: boolean;
}

function Claim(props: ClaimProps) {
  const value =
    typeof props.claim === 'number'
      ? (props.payload as JwtPayloadArrayValue)[props.claim]!
      : (props.payload as JwtPayload | JwtPayloadObjectValue)[props.claim]!;
  const keys = useMemo(
    () => (value && typeof value === 'object' ? Object.keys(value) : null),
    [value],
  );
  const path = typeof props.claim === 'number' ? '[]' : props.claim;
  const claimPath =
    typeof props.claim === 'number'
      ? props.parentClaim
        ? `${props.parentClaim}[]`
        : '[]'
      : props.parentClaim
        ? `${props.parentClaim}.${path}`
        : path;

  if (value && typeof value === 'object') {
    if (Array.isArray(value)) {
      return (
        <div style={{ marginLeft: 15 }}>
          <div className="criipto-jwt-viewer-claim">
            "{props.claim}": &#91;
            <br />
            {value.map((item, index) => (
              <Claim
                key={index}
                claim={index}
                parentClaim={claimPath}
                payload={value}
                last={index === value.length - 1}
              />
            ))}
            &#93;{props.last ? null : ','}
            <br />
          </div>
        </div>
      );
    }
    return (
      <div style={{ marginLeft: 15 }}>
        <div className="criipto-jwt-viewer-claim">
          {typeof props.claim === 'number' ? null : `"${props.claim}": `}&#123;
          <br />
          {keys!.map((key, index) => (
            <Claim
              key={key}
              claim={key}
              parentClaim={claimPath}
              payload={value}
              last={index === keys!.length - 1}
            />
          ))}
          &#125;{props.last ? null : ','}
          <br />
          <ClaimTooltip
            claim={props.claim}
            claimPath={claimPath}
            payload={props.payload}
            value={value}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: 15 }}>
      <div className="criipto-jwt-viewer-claim">
        "{props.claim}": {JSON.stringify(value)}
        {props.last ? null : ','}
        <ClaimTooltip
          claim={props.claim}
          claimPath={claimPath}
          payload={props.payload}
          value={value}
        />
      </div>
    </div>
  );
}

interface ClaimTooltipProps {
  claim: string | number;
  claimPath: string;
  payload: JwtPayload | JwtPayloadObjectValue | JwtPayloadArrayValue;
  value: JwtPayloadValue;
}
function ClaimTooltip(props: ClaimTooltipProps) {
  const { claim, claimPath, value, payload } = props;
  const identityscheme = 'identityscheme' in payload ? payload.identityscheme : null;

  let tooltip: string | React.ReactElement | null = null;
  let isClaimPath = function (cnd: string | number, claimPath: string) {
    if (typeof cnd === 'number') return false;

    if (cnd === null) return false;
    if (claimPath === null) return false;
    if (cnd === claimPath) return true;
    let ucCnd = cnd.toUpperCase(),
      ucPath = claimPath.toUpperCase();
    return ucCnd.endsWith(`/${ucPath}`) || ucCnd.endsWith(`:${ucPath}`);
  };

  if (isClaimPath(claim, 'iss')) tooltip = 'Your Criipto domain';
  if (isClaimPath(claim, 'aud')) tooltip = 'ClientID/Realm of your Criipto Application';
  if (isClaimPath(claim, 'iat')) tooltip = 'Issued at (seconds since Unix epoch)';
  if (isClaimPath(claim, 'nbf')) tooltip = 'Not valid before (seconds since Unix epoch)';
  if (isClaimPath(claim, 'exp')) tooltip = 'Expiration time (seconds since Unix epoch)';
  if (isClaimPath(claim, 'identityscheme')) tooltip = 'Overall eID used to authenticate';
  if (isClaimPath(claim, 'nameidentifier')) tooltip = `Legacy format of 'sub'`;
  if (isClaimPath(claim, 'sub'))
    tooltip = `Persistent pseudonym. Uniquely identifies an eID user (per Criipto Verify tenant)`;
  if (isClaimPath(claim, 'authenticationtype')) tooltip = `acr_values used to authenticate`;
  if (isClaimPath(claim, 'socialno')) tooltip = 'Social security number';
  if (isClaimPath(claim, 'ssn')) tooltip = 'Social security number';
  if (isClaimPath(claim, 'uniqueuserid'))
    tooltip =
      'Identifies the legal person corresponding to the login (just like the socialno does, but is not considered to be sensitive)';
  if (isClaimPath(claim, 'cprNumberIdentifier')) tooltip = 'Danish SSN (CPR Nummer)';
  if (isClaimPath(claim, 'pidNumberIdentifier'))
    tooltip =
      'Danish NemID Person-ID (a persistent pseudonym which the DK authorities can use to identify the citizen)';
  if (isClaimPath(claim, 'cvrNumberIdentifier'))
    tooltip = 'Danish Business Registry Number (CVR Nummer)';
  if (isClaimPath(claim, 'ridNumberIdentifier'))
    tooltip = 'Danish NemID Employee-ID (a persistent pseudonym representing a legal person)';
  if (isClaimPath(claim, '2.5.4.10')) tooltip = 'Company Name';
  if (isClaimPath(claim, 'companySignatory'))
    tooltip =
      'Company signatories can enter legal agreements on behalf of the company (DK readers: Ledelsesrepræsentant/tegningsberettiget)';
  if (isClaimPath(claim, 'productionUnit'))
    tooltip =
      'P-number: production unit number; denotes the addresses where the company has employees and/or carries out economic activity';
  if (isClaimPath(claim, 'seNumber'))
    tooltip =
      'SE-number: administrative unit an employee belongs to (in case a company runs different activities under the same legal entity)';
  if (isClaimPath(claim, 'hetu')) tooltip = 'Finnish SSN';
  if (isClaimPath(claim, 'satu')) tooltip = 'Finnish Unique Identification Number';
  if (isClaimPath(claim, 'name') && identityscheme === 'fitupas')
    tooltip =
      'Display name (when available for the user), or sub value received from FTN provider.';
  if (isClaimPath(claim, 'address'))
    tooltip = (
      <React.Fragment>
        <a
          href="https://openid.net/specs/openid-connect-core-1_0.html#AddressClaim"
          target="_blank"
        >
          An OpenID Connect standard address claim
        </a>
      </React.Fragment>
    );
  if (isClaimPath(claim, 'cprNumberStatus'))
    tooltip = (
      <React.Fragment>
        <a
          href="https://cprservicedesk.atlassian.net/wiki/spaces/CPR/pages/1722384544/Statuskoder+i+CPR"
          target="_blank"
        >
          The status of the CPR Number as maintained by CPR Kontoret. Can be used to reason about
          why some users do not have address data available.
        </a>
      </React.Fragment>
    );
  if (isClaimPath(claim, 'given_name'))
    tooltip = (
      <React.Fragment>
        <a
          href="https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims"
          target="_blank"
        >
          An OpenID Connect standard claim
        </a>
      </React.Fragment>
    );
  if (isClaimPath(claim, 'family_name'))
    tooltip = (
      <React.Fragment>
        <a
          href="https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims"
          target="_blank"
        >
          An OpenID Connect standard claim
        </a>
      </React.Fragment>
    );

  if (isClaimPath(claim, 'uuid')) {
    tooltip =
      'Danish MitID Person-ID (a persistent pseudonym which the DK authorities can use to identify the person). For citizens, it identifies the natural person. For employees, it identifies the legal person.';
  }

  if (isClaimPath(claimPath, 'mitid_risk_data.riskData[]')) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      const riskData = value as MitIDRiskData;
      if (riskData.pc === 'network' && riskData.pt === 'ip') {
        if (riskData.src === 'Client') {
          tooltip = 'IP-Address of the browser that started the MitID authentication';
        }
        if (riskData.src === 'AuthenticatorStandaloneCodeApp') {
          tooltip = 'IP-Address of the MitID authenticator app';
        }
      }
    }
  }

  if (!tooltip) {
    if (typeof window !== 'undefined' && 'STORYBOOK_ENV' in window) {
      console.warn(`Missing tooltip for ${claimPath}: ${JSON.stringify(value)}`);
    }
    return null;
  }
  return <Tooltip tooltip={tooltip} />;
}
