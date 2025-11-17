import React, { useMemo } from 'react';
import MdxLayout from './mdx';

export default function VerifyErrorLayout(props: {
  children: React.ReactNode;
  location: Location;
  pageContext: any;
  path: string;
  pageResources: any;
}) {
  const searchParams = useMemo(() => new URLSearchParams(props.location.search), [props.location]);
  const traceId = searchParams.get('trace_id');
  return (
    <React.Fragment>
      <MdxLayout {...props}>
        {props.children}

        {traceId ? (
          <div>
            <a href={`https://dashboard.idura.app/telemetry?traceId=${traceId}`} target="_blank">
              View trace in dashboard
            </a>
          </div>
        ) : null}
      </MdxLayout>
    </React.Fragment>
  );
}
