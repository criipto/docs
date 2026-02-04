import React from 'react';
import StepCard from '../StepCard';
import { JWTPayload } from 'jose';

type StepOneProps = {
  stepRef: React.RefObject<HTMLDivElement | null>;
  decodedPayload: JWTPayload | null;
};

export default function StepFour({ stepRef, decodedPayload }: StepOneProps) {
  return (
    <StepCard
      number={4}
      cardRef={stepRef}
      title="🎉 ID Token is valid!"
      description={
        <div>
          <p>
            The Client Application can trust the user's identity data and use the{' '}
            <a href="/verify/reference/glossary/#claims">claims</a> as needed (for example, to
            establish a local session and log the user in).
          </p>
          <p className="text-xs font-bold text-light-blue-500 uppercase tracking-wider mb-0">
            Decoded payload
          </p>
          <pre className="mt-2">{JSON.stringify(decodedPayload, null, 2)}</pre>
        </div>
      }
      isActive={!!decodedPayload}
      isCompleted={!!decodedPayload}
    />
  );
}
