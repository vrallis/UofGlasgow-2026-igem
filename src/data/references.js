// Bibliography data — single source of truth for citations.
// Cite inline with <Cite id="hill1910" /> and render the list with <Bibliography />.
// (Both components live in src/components/Cite.jsx.)

export const references = {
  hill1910: {
    authors: 'Hill, A. V.',
    year: 1910,
    title:
      'The possible effects of the aggregation of the molecules of haemoglobin on its dissociation curves',
    source: 'J. Physiol. 40, iv–vii',
    url: 'https://doi.org/10.1113/jphysiol.1910.sp001386',
  },
  michaelis1913: {
    authors: 'Michaelis, L. & Menten, M. L.',
    year: 1913,
    title: 'Die Kinetik der Invertinwirkung',
    source: 'Biochem. Z. 49, 333–369',
    url: 'https://www.biochemj.org/content/ppbiochemj/early/2011/12/12/BJ20111461.full.pdf',
  },
  igem2026: {
    authors: 'iGEM Foundation',
    year: 2026,
    title: 'Competition — Medals & Awards',
    source: 'igem.org',
    url: 'https://competition.igem.org/judging/medals',
  },
};
