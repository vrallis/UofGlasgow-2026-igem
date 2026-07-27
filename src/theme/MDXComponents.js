// Swizzled global MDX component registry. Anything exported here is available
// in EVERY .md/.mdx file with no per-file import. Reserve this for components
// used across many pages; keep one-offs as inline `export const` in the page.
import MDXComponents from '@theme-original/MDXComponents';
import Kbd from '@site/src/components/Kbd';
import Part from '@site/src/components/Part';

export default {
  ...MDXComponents,
  Kbd,
  Part,
};
