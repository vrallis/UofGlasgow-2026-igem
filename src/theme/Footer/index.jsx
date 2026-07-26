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
const TEAM_YEAR = '2026';
const TEAM_SLUG = 'uofglasgow';
const REPO_URL = `https://gitlab.igem.org/${TEAM_YEAR}/${TEAM_SLUG}`;
const gold = '#F0C581';
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const sora = { fontFamily: "'Sora', sans-serif" };
const link = { color: '#9EAAD0', textDecoration: 'underline' };

function scrollTop(e) {
  e.preventDefault();
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export default function Footer() {
  return (
    <footer style={{ background: '#0C1036', padding: 'clamp(60px, 12vw, 110px) clamp(22px, 5vw, 40px) 40px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              ...sora,
              fontWeight: 800,
              fontSize: 'clamp(44px, 13vw, 200px)',
              lineHeight: 1,
              letterSpacing: '-0.022em',
              color: '#0C1036',
              WebkitTextStroke: 'clamp(1.4px, 0.4vw, 2.4px) rgba(240,197,129,.6)',
              paintOrder: 'stroke',
              display: 'block',
              whiteSpace: 'nowrap',
            }}
          >
            {PROJECT}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 30, marginTop: 80, borderTop: '1px solid rgba(234,238,248,.08)', paddingTop: 28, flexWrap: 'wrap' }}>
          <span style={{ ...mono, fontSize: 11, letterSpacing: '.12em', color: '#7986B0' }}>© {TEAM_YEAR} {TEAM} · iGEM Competition</span>
          <a
            href="#"
            onClick={scrollTop}
            style={{ ...mono, fontSize: 11, letterSpacing: '.14em', color: '#9EAAD0', textDecoration: 'none', textTransform: 'uppercase' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = gold; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9EAAD0'; }}
          >
            Back to top ↑
          </a>
        </div>

        {/*
          iGEM judging requirement — the following MUST appear on every page:
            1. the content licence, and
            2. a link to this wiki's repository on gitlab.igem.org
          Do not remove either line. See CLAUDE.md / README.md.
        */}
        <div style={{ ...mono, fontSize: 11, lineHeight: 1.8, color: '#7986B0', marginTop: 18, textAlign: 'center' }}>
          <p style={{ margin: 0 }}>
            © {TEAM_YEAR} — Content on this site is licensed under a{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" rel="license" style={link}>
              Creative Commons Attribution 4.0 International license
            </a>
            .
          </p>
          <p style={{ margin: 0 }}>
            The repository used to create this website is available at{' '}
            <a href={REPO_URL} style={link}>
              gitlab.igem.org/{TEAM_YEAR}/{TEAM_SLUG}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
