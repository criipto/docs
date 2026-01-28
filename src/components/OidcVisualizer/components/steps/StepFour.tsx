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
        <>
          <p className="text-xs font-bold text-light-blue-500 uppercase tracking-wider">
            Decoded payload:
          </p>
          <pre>{JSON.stringify(decodedPayload, null, 2)}</pre>
        </>
      }
      isActive={!!decodedPayload}
      isCompleted={!!decodedPayload}
    />
  );
}
