import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonData = { [key: string]: JsonValue };

type StepCardProps = {
  number?: number;
  title?: string;
  description?: string | React.ReactNode;
  req?: string | JsonData | null;
  res?: string | JsonData | null;
  action?: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
  error?: string | null;
  responseId?: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
};

const StepCard = ({
  number,
  title,
  description,
  req,
  res,
  action,
  isActive,
  isCompleted,
  error,
  responseId,
  cardRef,
}: StepCardProps) => {
  const opacityClass = isActive || isCompleted ? 'opacity-100' : 'opacity-40 pointer-events-none';

  return (
    <div
      ref={cardRef}
      className={cx('relative border p-6 mb-6 bg-white shadow-sm transition-all', opacityClass)}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-sky-700" />
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cx('w-8 h-8 rounded-full flex items-center justify-center font-bold', {
            'bg-green-600 text-white': isCompleted,
            'bg-sky-600 text-white': !isCompleted,
          })}
        >
          {isCompleted ? <FontAwesomeIcon icon={faCheck} /> : number}
        </div>
        <h3 className="text-xl font-bold text-gray-800 my-4">{title}</h3>
      </div>

      <p className="text-gray-600 mb-4">{description}</p>

      {/* Request Section */}
      {req && (
        <div className="mb-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Request</span>
          <div className="bg-slate-900 text-slate-50 p-4 rounded mt-1 overflow-x-auto font-mono text-sm">
            <pre>{typeof req === 'string' ? req : JSON.stringify(req, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Response Section */}
      {res && (
        <div
          className="mb-4"
          id={responseId} // This id will be used for scrolling to the response section on Step 2, once the code exchange is completed
        >
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Response</span>
          <div className="bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded mt-1 overflow-x-auto font-mono text-sm">
            <pre>{typeof res === 'string' ? res : JSON.stringify(res, null, 2)}</pre>
          </div>
        </div>
      )}

      {action && <div className="mt-4 pt-4 flex justify-center">{action}</div>}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mt-6">
          <p className="font-bold">An error occurred</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default StepCard;
