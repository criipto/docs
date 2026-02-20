import React, { useEffect, useReducer, useState, useRef } from 'react';
import { Link } from 'gatsby';
import { AnchorButton } from './Button/Button';
import Search from './Search';
import logo from '../images/idura-logo.svg';

export default function Header(props: { path: string | undefined; className?: string }) {
  const [showDropdown, toggleDropdown] = useReducer(value => !value, false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const { path } = props;
  const isVerify = path?.startsWith('/verify');
  const isSignatures = path?.startsWith('/signatures');

  const isBrowser = typeof navigator !== 'undefined';
  const isMac = isBrowser ? navigator.platform.startsWith('Mac') : false;
  const modifierKeyPrefix = isMac ? '⌘' : 'ctrl';

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const ctrlOrCmdKey = isMac ? event.metaKey : event.ctrlKey;

      const tagName = (event.target as HTMLElement | null)?.tagName?.toUpperCase() ?? '';
      const targetIsInput = ['INPUT', 'TEXTAREA'].includes(tagName);

      if (event.key === 'Escape') setShowSearch(false);

      const shouldShowSearch =
        // If the user is in an input element, they probably want to type a slash instead of searching.
        (event.key === '/' && !targetIsInput) || (event.key === 'k' && ctrlOrCmdKey);
      if (shouldShowSearch) {
        event.preventDefault();
        setShowSearch(true);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        toggleDropdown();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <React.Fragment>
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur flex-none duration-500 lg:z-50 bg-white border-b border-light-blue-300/40 text-md text-deep-purple-900 supports-backdrop-blur:bg-blue/60 font-medium font-sans ${props.className}`}
      >
        {/* Match DefaultLayout: centering + padding + max-width (to align Search bar with the content). */}
        <div className="px-4 sm:px-6 md:px-8 max-w-screen-2xl mx-auto">
          {/* 2 columns on lg/xl screens: left navigation(22rem) + content(flexible). */}
          <div className="grid grid-cols-1 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-x-0 items-center py-2">
            {/* Left column */}
            <div className="flex items-center">
              <a href="/" className="mr-3 flex flex-row gap-6 items-center h-[21px]">
                <img src={logo} alt="Idura" className="h-[21px]" />
                <span className="inline uppercase text-deep-purple-900 font-sans font-medium">
                  Documentation
                </span>
              </a>

              <button
                onClick={() => setShowSearch(true)}
                type="button"
                className="ml-auto text-white w-8 h-8 -my-1 flex items-center justify-center lg:hidden"
              >
                <span className="sr-only">Search</span>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m19 19-3.5-3.5"></path>
                  <circle cx="11" cy="11" r="6"></circle>
                </svg>
              </button>
            </div>

            {/* Right column */}
            <div className="hidden lg:flex items-center gap-6 min-w-0">
              {/* Search bar */}
              <button
                onClick={() => setShowSearch(true)}
                type="button"
                className="relative flex items-center w-64 text-sm leading-6 bg-light-blue-25 text-light-blue-800 py-1.5 pl-2 pr-3 hover:bg-light-blue-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="w-5 h-5 mr-3"
                >
                  <path d="M448.1 272c0-97.2-78.8-176-176-176s-176 78.8-176 176 78.8 176 176 176 176-78.8 176-176zm-40.6 158c-36.4 31.2-83.7 50-135.3 50-114.9 0-208-93.1-208-208s93.1-208 208-208 208 93.1 208 208c0 51.7-18.8 99-50 135.3l141.4 141.4 11.3 11.3-22.6 22.6-11.3-11.3-141.4-141.4z" />
                </svg>
                Search
                {isBrowser && (
                  <div className="absolute right-0 top-0 bottom-0 flex pointer-events-none items-center p-2">
                    <div className="text-xs bg-light-blue-200 text-light-blue-900 py-0.5 px-1 rounded">
                      {modifierKeyPrefix}+K
                    </div>
                  </div>
                )}
              </button>

              <div className="ml-auto flex items-center">
                <a
                  href="https://status.idura.app"
                  target="_blank"
                  className="ml-2 inline-block cursor-pointer font-medium uppercase text-deep-purple-900 hover:text-primary-600"
                  rel="noreferrer"
                >
                  Operations Status
                </a>

                <Link
                  to="/changelog"
                  target="_blank"
                  className="font-medium ml-2 py-2 px-4 rounded uppercase text-deep-purple-900 hover:text-primary-600 focus:outline-none focus:shadow-outline"
                >
                  Changelog
                </Link>

                <a
                  href="https://dashboard.idura.app"
                  target="_blank"
                  className="font-medium ml-2 py-2 px-4 rounded uppercase text-deep-purple-900 hover:text-primary-600 focus:outline-none focus:shadow-outline"
                  rel="noreferrer"
                >
                  Dashboard
                </a>

                <AnchorButton
                  href="https://dashboard.idura.app/signup?utm_source=docs"
                  target="_blank"
                  variant="primary"
                  size="sm"
                  className="uppercase ml-2"
                >
                  Sign up
                </AnchorButton>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search modal */}
      <div
        className={`backdrop-blur-sm bg-black/30 fixed h-screen w-screen top-0 left-0 right-0 z-50 p-4 items-center justify-center ${
          showSearch ? 'flex' : 'hidden'
        }`}
        onClick={() => setShowSearch(false)}
      >
        <div
          className="bg-white rounded-md p-4 w-full h-full max-w-2xl lg:max-h-[42rem] overflow-auto prose"
          onClick={event => event.stopPropagation()}
        >
          <button
            onClick={() => setShowSearch(false)}
            type="button"
            className="absolute z-10 top-5 right-5 w-8 h-8 flex items-center justify-center text-light-blue-600 hover:text-light-blue-700"
          >
            <span className="sr-only">Close search</span>
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 overflow-visible">
              <path
                d="M0 0L10 10M10 0L0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              ></path>
            </svg>
          </button>

          <p className="mb-2 mt-0 text-sm">
            Tip: You can also use keyboard shortcut '/' or '{modifierKeyPrefix}
            +k' to access search
          </p>
          {showSearch ? <Search onHide={() => setShowSearch(false)} /> : null}
        </div>
      </div>
    </React.Fragment>
  );
}
