import React from 'react';

// Links a BioBrick / Registry part number straight to the iGEM Registry.
// Registered globally in src/theme/MDXComponents.js → use <Part>BBa_K823005</Part>
// anywhere with no import.
export default function Part({children}) {
  const id = String(children).trim();
  return (
    <a
      href={`https://parts.igem.org/Part:${id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.9em',
        fontWeight: 700,
        color: 'var(--ifm-color-primary)',
        textDecoration: 'none',
        borderBottom: '1px dotted var(--ifm-color-primary)',
      }}>
      {id}
    </a>
  );
}
