import React from 'react';

// Inline keyboard / token chip. Registered globally in src/theme/MDXComponents.js,
// so it's usable in any .mdx as <Kbd>…</Kbd> with no per-file import.
export default function Kbd({children}) {
  return (
    <kbd
      style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.82em',
        lineHeight: 1,
        padding: '0.2em 0.45em',
        border: '1px solid var(--ifm-color-primary)',
        borderBottomWidth: 2,
        borderRadius: 5,
        background: 'var(--ifm-background-surface-color)',
        color: 'var(--ifm-font-color-base)',
        whiteSpace: 'nowrap',
      }}>
      {children}
    </kbd>
  );
}
