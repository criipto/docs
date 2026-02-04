import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonData = { [key: string]: JsonValue };

type StepCardProps = {
  number?: number;
  title?: string;
  description?: string | React.ReactNode;
  secondaryDescription?: string | React.ReactNode;
  req?: string | JsonData | null;
  res?: string | JsonData | null;
  action?: React.ReactNode;
  requestSettings?: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
  error?: string | null;
  errorInfo?: React.ReactNode;
  responseId?: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
};

const StepCard = ({
  number,
  title,
  description,
  secondaryDescription,
  req,
  res,
  action,
  requestSettings,
  isActive,
  isCompleted,
  error,
  errorInfo,
  responseId,
  cardRef,
}: StepCardProps) => {
  const showStep = isActive || isCompleted ? 'block' : 'hidden';

  return (
    <div
      ref={cardRef}
      className={cx('relative p-6 mb-6 transition-all bg-light-blue-25', showStep)}
    >
      <div className="flex items-center gap-3">
        <div
          className={cx(
            'w-8 h-8 rounded-full flex shrink-0 items-center justify-center font-bold border-2',
            {
              'text-green-600 border-green-600': isCompleted,
              'text-primary-600 border-primary-600': !isCompleted,
            },
          )}
        >
          {isCompleted ? <FontAwesomeIcon icon={faCheck} /> : number}
        </div>
        <h3 className="text-xl font-bold text-light-blue-800 my-4">{title}</h3>
      </div>

      <p className="text-light-blue-800 mb-1">{description}</p>

      {/* Request Section */}
      {req && (
        <div className="mb-4">
          <div className="flex flex-row justify-between items-center">
            <p className="text-xs font-bold text-light-blue-500 uppercase tracking-wider mb-2">
              Request
            </p>
            {requestSettings ? <div className="shrink-0">{requestSettings}</div> : null}
          </div>
          <pre className="p-4 mt-0 overflow-x-auto text-sm">
            {typeof req === 'string' ? req : JSON.stringify(req, null, 2)}
          </pre>
        </div>
      )}

      {secondaryDescription && <p className="text-light-blue-800 mb-4">{secondaryDescription}</p>}

      {/* Response Section */}
      {res && (
        <div
          className="mb-4"
          id={responseId} // This id will be used for scrolling to the response section on Step 2, once the code exchange is completed
        >
          <span className="text-xs font-bold text-light-blue-500 uppercase tracking-wider">
            Response
          </span>
          <pre className="p-4 mt-1 overflow-x-auto text-sm">
            {typeof res === 'string' ? res : JSON.stringify(res, null, 2)}
          </pre>
        </div>
      )}

      {action && <div className="mt-4 pt-4 flex justify-end items-start">{action}</div>}

      {error && (
        <div className="bg-red-25 p-4 mt-6 text-red-500 not-prose">
          <div className="flex items-start gap-3 p-0 m-0">
            <FontAwesomeIcon icon={faCircleExclamation} className="h-5 w-5" />
            <div className="flex flex-wrap flex-col font-normal text-md gap-1 leading-abs-5">
              <p className="font-medium text-md">An error occurred</p>{' '}
              <p className="font-normal">{error}</p>
              {errorInfo && <>{errorInfo}</>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepCard;
