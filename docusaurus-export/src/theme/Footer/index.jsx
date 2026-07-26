import React from 'react';

/**
 * Synwave site footer — swizzled to fully replace the default Docusaurus
 * (Infima) footer. This renders the wordmark band from the landing page so the
 * SAME footer appears on every page: home, team, docs and blog.
 *
 * Because this component overrides @theme/Footer entirely, the `footer` config
 * in docusaurus.config.ts (link columns, copyright) is no longer used — edit
 * the markup here instead.
 */

const PROJECT = 'Synwave';
const TEAM = 'iGEM UofG';
const gold = '#F0C581';
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const sora = { fontFamily: "'Sora', sans-serif" };

function scrollTop(e) {
  e.preventDefault();
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export default function Footer() {
  return (
    <footer style={{ background: '#0C1036', padding: '110px 40px 40px 40px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              ...sora,
              fontWeight: 800,
              fontSize: 'clamp(90px, 14vw, 200px)',
              lineHeight: 1,
              letterSpacing: '-0.022em',
              color: '#0C1036',
              WebkitTextStroke: '2.4px rgba(240,197,129,.6)',
              paintOrder: 'stroke',
              display: 'block',
            }}
          >
            {PROJECT}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 30, marginTop: 80, borderTop: '1px solid rgba(234,238,248,.08)', paddingTop: 28, flexWrap: 'wrap' }}>
          <span style={{ ...mono, fontSize: 11, letterSpacing: '.12em', color: '#7986B0' }}>© 2026 {TEAM} · iGEM Competition</span>
          <a
            href="#"
            onClick={scrollTop}
            style={{ ...mono, fontSize: 11, letterSpacing: '.14em', color: '#9EAAD0', textDecoration: 'none', textTransform: 'uppercase' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = gold; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9EAAD0'; }}
          >
            Back to top ↑
          </a>
          <span style={{ ...mono, fontSize: 11, letterSpacing: '.12em', color: '#7986B0' }}>Content licensed CC BY 4.0</span>
        </div>
      </div>
    </footer>
  );
}
