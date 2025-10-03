export function isIndexPage(node: { internal?: { contentFilePath?: string | null | undefined } }) {
  return (
    node.internal?.contentFilePath?.endsWith('index.mdx') ||
    node.internal?.contentFilePath?.endsWith('index.tsx')
  );
}
