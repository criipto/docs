import React, { useState } from 'react';

import './EncodedViewer.css';

interface Props {
  jwt?: string;
  onChange?: (jwt: string) => void;
}
export default function EncodedViewer(props: Props) {
  const [jwt, setJwt] = useState(props.jwt);
  const [header, payload, signature] = jwt ? jwt.split('.') : [];

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJwt(event.target.value);
    if (props.onChange) props.onChange(event.target.value);
  };

  return (
    <div className="criipto-jwt-viewer-encoded">
      <textarea value={jwt} onChange={handleChange} />
      {header !== undefined ? (
        <React.Fragment>
          <span className="header">{header}</span>
          {payload !== undefined ? (
            <React.Fragment>
              <span className="dot">.</span>
              <span className="payload">{payload}</span>
              {signature !== undefined ? (
                <React.Fragment>
                  <span className="dot">.</span>
                  <span className="signature">{signature}</span>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : null}
        </React.Fragment>
      ) : null}
    </div>
  );
}
