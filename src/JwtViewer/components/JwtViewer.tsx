import React, { useMemo, useState } from 'react';

import EncodedViewer from './EncodedViewer';
import HeaderViewer from './HeaderViewer';
import PayloadViewer from './PayloadViewer';
import './JwtViewer.css';
import { JwtHeader, JwtPayload, toSample, tryJwtDecode } from '../samples';

interface Props {
  jwt?: string;
}
export default function JwtViewer(props: Props) {
  const [jwt, setJwt] = useState(props.jwt);

  const decoded = useMemo(() => {
    if (!jwt) return null;
    return {
      jwt,
      ...tryJwtDecode<JwtHeader, JwtPayload>(jwt),
    };
  }, [jwt]);

  return (
    <div className="jwt-viewer">
      <div className="encoded">
        <EncodedViewer jwt={jwt} onChange={setJwt} />
      </div>
      <div className="decoded">
        <div className="box">
          <strong>Header</strong>
          {decoded?.header ? <HeaderViewer header={decoded.header} /> : null}
        </div>
        <div className="box">
          <strong>Payload</strong>
          {decoded?.payload ? <PayloadViewer payload={decoded.payload} /> : null}
        </div>
      </div>
    </div>
  );
}
