import React, { useMemo } from 'react';
import { JwtHeader } from '../samples';

import Tooltip from './Tooltip';

import './HeaderViewer.css';

interface Props {
  header: JwtHeader;
  className?: string;
}
export default function HeaderViewer(props: Props) {
  const keys = useMemo(() => Object.keys(props.header), [props.header]);

  return (
    <div className={`criipto-jwt-viewer-header ${props.className || ''}`}>
      &#123;
      <br />
      {keys.map((key, index) => (
        <Claim
          key={key}
          item={key as keyof JwtHeader}
          header={props.header}
          level={1}
          last={index === keys.length - 1}
        />
      ))}
      &#125;
      <br />
    </div>
  );
}

interface ClaimProps {
  item: keyof JwtHeader;
  header: JwtHeader;
  level: number;
  last: boolean;
}

function Claim(props: ClaimProps) {
  return (
    <div style={{ marginLeft: props.level * 15 }}>
      <div className="criipto-jwt-viewer-header-item">
        "{props.item}": {JSON.stringify(props.header[props.item])}
        {props.last ? null : ','}
        <HeaderTooltip item={props.item} header={props.header} />
      </div>
    </div>
  );
}

interface HeaderTooltipProps {
  item: string;
  header: JwtHeader;
}
function HeaderTooltip(props: HeaderTooltipProps) {
  const { item } = props;
  let tooltip: string | null = null;

  if (item === 'typ') tooltip = 'Type of token. Always JWT';
  if (item === 'alg') tooltip = 'Signature algorithm';
  if (item === 'kid') tooltip = 'ID of token signing key';

  if (!tooltip) return null;
  return <Tooltip tooltip={tooltip} />;
}
