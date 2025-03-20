import React from 'react';
export default function FullscreenLayout(props: {children: React.ReactNode}) {
  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  );
}