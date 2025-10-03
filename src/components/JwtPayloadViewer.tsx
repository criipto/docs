import React from 'react';
import { PayloadViewer, JwtPayload } from '../JwtViewer';

interface Props {
  payload: JwtPayload;
}
export default function JwtPayloadViewer(props: Props) {
  return <PayloadViewer payload={props.payload} className="p-3 border rounded max-w-screen-md" />;
}
