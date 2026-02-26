export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function getBreadcrumbTrail(pathname: string): BreadcrumbItem[] {
  // Breadcrumb logic for nested index pages ("Errors" and "Samples")
  if (
    pathname.startsWith('/verify/reference/errors/danish-mitid') ||
    pathname.startsWith('/verify/reference/errors/general')
  ) {
    return [
      { label: 'Reference', href: '/verify/reference' },
      { label: 'Errors', href: '/verify/reference/errors' },
    ];
  } else if (pathname.startsWith('/verify/reference/samples/custom-ui-samples')) {
    return [
      { label: 'Reference', href: '/verify/reference' },
      { label: 'Samples', href: '/verify/reference/samples' },
    ];
  }
  return [];
}
