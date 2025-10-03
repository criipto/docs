import React from 'react';

import './Tooltip.css';

interface Props {
  tooltip: string | React.ReactElement;
}
export default function Tooltip(props: Props) {
  return (
    <div className="criipto-jwt-viewer-tooltip">
      {props.tooltip}
      <div className="arrow" />
    </div>
  );
}
