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
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Decoded payload:
          </p>
          <div className="bg-slate-900 text-slate-50 p-4 rounded mt-1 overflow-x-auto font-mono text-sm">
            <pre>{JSON.stringify(decodedPayload, null, 2)}</pre>
          </div>
        </>
      }
      isActive={!!decodedPayload}
      isCompleted={!!decodedPayload}
    />
  );
}
