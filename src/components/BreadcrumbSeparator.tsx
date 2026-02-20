import React from 'react';

export const BreadcrumbSeparator = () => (
  <svg
    width="3"
    height="6"
    aria-hidden="true"
    className="mx-3 overflow-visible text-light-blue-500"
  >
    <path
      d="M0 0L3 3L0 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
