export function formatUrl(url: string): string {
  const [base, query] = url.split('?');
  if (!query) return base;

  const formattedParams = query
    .split('&')
    .map(param => '  ' + decodeURIComponent(param))
    .join('\n');

  return `${base}?\n${formattedParams}`;
}
