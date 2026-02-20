import React from 'react';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import { Select } from './FormFields/Select';

type Product = 'Welcome' | 'Verify' | 'Signatures';

const PRODUCT_TO_PATH: Record<Product, string | null> = {
  Welcome: '/',
  Verify: '/verify',
  Signatures: '/signatures',
};

function productFromPath(pathname: string): Product {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path.startsWith('/verify')) return 'Verify';
  if (path.startsWith('/signatures')) return 'Signatures';
  return 'Welcome';
}

export function ProductSelect() {
  const location = useLocation();
  // Derive value from path, so it stays in sync with navigation
  const value: Product = React.useMemo(
    () => productFromPath(location.pathname),
    [location.pathname],
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value as Product;
    const nextPath = PRODUCT_TO_PATH[nextValue];
    if (nextPath) navigate(nextPath);
  };

  return (
    <Select
      name="Select product"
      label={'Product'}
      onChange={handleChange}
      className="mb-8 mr-5 lg:mt-0 w-[85%] lg:w-[90%]"
      value={value}
    >
      <option value="Welcome">Welcome</option>
      <option value="Verify">Verify</option>
      <option value="Signatures">Signatures</option>
    </Select>
  );
}
