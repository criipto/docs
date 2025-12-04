import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import xMarkIcon from '../images/xmark-icon.svg';
import cx from 'classnames';

type IduraBannerProps = {
  isVisible?: boolean;
  onClose?: () => void;
  className?: string;
};

export function IduraBanner(props: IduraBannerProps) {
  const { onClose, isVisible } = props;

  if (!isVisible) return null;

  return (
    <div className={cx('bg-sky-100 mb-8 p-4 rounded-sm text-sky-800', props.className)}>
      <div className="flex flex-row justify-between pb-4">
        <FontAwesomeIcon icon={faCircleInfo} />
        <img src={xMarkIcon} alt="Close icon" className="cursor-pointer" onClick={onClose} />
      </div>
      <h2 className="text-md">We changed our name from Criipto to Idura</h2>
      <p className="text-sm mt-2">
        You will still see <span className="font-mono">@criipto</span> packages and default imports
        in our SDKs and code samples. This is expected and fully supported.
      </p>
      <p className="text-sm mt-2">
        Read the full story in our announcement:{' '}
        <a
          className="underline"
          href="https://www.idura.eu/blog/we-are-now-idura"
          target="_blank"
        >
          We are now Idura
        </a>
        .
      </p>
    </div>
  );
}
