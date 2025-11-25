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
  reqNote?: React.ReactNode;
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
  reqNote,
  res,
  action,
  isActive,
  isCompleted,
  error,
  responseId,
  cardRef,
}: StepCardProps) => {
  const showStep = isActive || isCompleted ? 'block' : 'hidden';

  return (
    <div ref={cardRef} className={cx('relative p-6 mb-6 transition-all bg-gray-ash-25', showStep)}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cx(
            'w-8 h-8 rounded-full flex items-center justify-center font-bold border-2',
            {
              'text-green-600 border-green-600': isCompleted,
              'text-primary-600 border-primary-600': !isCompleted,
            },
          )}
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
          <pre className="p-4 mt-1 overflow-x-auto text-sm">
            {typeof req === 'string' ? req : JSON.stringify(req, null, 2)}
          </pre>

          {reqNote && (
            <div className="-mt-4 p-2 bg-gray-50 border-l-4 border-gray-200 text-xs">{reqNote}</div>
          )}
        </div>
      )}

      {/* Response Section */}
      {res && (
        <div
          className="mb-4"
          id={responseId} // This id will be used for scrolling to the response section on Step 2, once the code exchange is completed
        >
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Response</span>
          <pre className="p-4 mt-1 overflow-x-auto text-sm">
            {typeof res === 'string' ? res : JSON.stringify(res, null, 2)}
          </pre>
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
