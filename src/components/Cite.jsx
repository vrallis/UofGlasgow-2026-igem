import React from 'react';
import {references} from '@site/src/data/references';

// Author–year inline citation linked to the source. Pull entries from
// src/data/references.js so there is one source of truth.
export function Cite({id}) {
  const ref = references[id];
  if (!ref) {
    return <span style={{color: 'var(--ifm-color-danger)'}}>[?{id}]</span>;
  }
  // First author surname + year, e.g. "(Hill, 1910)".
  const short = ref.authors.split(/[,&]/)[0].trim();
  return (
    <a href={`#ref-${id}`} title={ref.title} style={{whiteSpace: 'nowrap'}}>
      ({short}, {ref.year})
    </a>
  );
}

// Full reference list. Pass an ordered `ids` array, or omit to list everything.
export function Bibliography({ids}) {
  const keys = ids ?? Object.keys(references);
  return (
    <ol style={{fontSize: '0.9em', lineHeight: 1.5}}>
      {keys.map((id) => {
        const ref = references[id];
        if (!ref) return null;
        return (
          <li id={`ref-${id}`} key={id}>
            {ref.authors} ({ref.year}). {ref.title}. <em>{ref.source}</em>.{' '}
            {ref.url && (
              <a href={ref.url} target="_blank" rel="noopener noreferrer">
                link
              </a>
            )}
          </li>
        );
      })}
    </ol>
  );
}
