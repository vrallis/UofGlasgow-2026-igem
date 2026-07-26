import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import SynwaveBackground from '@site/src/components/SynwaveBackground';
import useReveal from '@site/src/components/useReveal';
import useDarkOnly from '@site/src/components/useDarkOnly';

const PROJECT = 'Synwave';
const TEAM = 'iGEM UofG';
const TAGLINE =
  'Synwave is an engineered bacterial biosensor that reads the gut–brain axis to detect Alzheimer\u2019s up to 15 years before symptoms — non-invasively, in time for treatment to matter.';
const MARQUEE =
  'EARLY DETECTION ✦ THE GUT–BRAIN AXIS ✦ ENGINEERED BIOSENSING ✦ iGEM 2026 ✦\u00A0';

const gold = '#F0C581';
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const sora = { fontFamily: "'Sora', sans-serif" };
const stripe =
  'repeating-linear-gradient(45deg, rgba(138,166,220,.06) 0 12px, transparent 12px 24px)';

// Placeholder image slot — swap for a real <img> when you have artwork.
function Slot({ label, ratio = '4 / 3', radius = 20, border = 'rgba(138,166,220,.25)', bg = stripe, color = '#6E7AA6' }) {
  return (
    <div
      style={{
        aspectRatio: ratio,
        borderRadius: radius,
        border: `1px dashed ${border}`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ ...mono, fontSize: 12, color, letterSpacing: '.1em' }}>{label}</span>
    </div>
  );
}

const chapters = [
  { n: '01', title: 'Project Description', desc: 'Why early Alzheimer\u2019s detection, and why the gut–brain axis is the key.', href: '/docs/description' },
  { n: '02', title: 'Engineering', desc: 'Design–build–test–learn: building biosensors that recognise biomarkers.', href: '/docs/engineering' },
  { n: '03', title: 'Results', desc: 'Sensitivity, signal amplification, and how reliable the readout really is.', href: '/docs/results' },
  { n: '04', title: 'Human Practices', desc: 'Clinicians, patients and carers — shaping a test people will actually trust.', href: '/docs/human-practices' },
  { n: '05', title: 'Team', desc: 'The iGEM UofG students and advisors behind Synwave.', href: '/team' },
  { n: '06', title: 'Notebook', desc: 'The week-by-week lab record — every cycle, honestly documented.', href: '/docs/notebook' },
];

const cardBase = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  background: '#FFFFFF',
  border: '1px solid #D4DBEC',
  borderRadius: 20,
  padding: 30,
  textDecoration: 'none',
  color: '#111749',
  transition: 'transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease',
};

function liftOn(e) {
  e.currentTarget.style.transform = 'translateY(-6px)';
  e.currentTarget.style.boxShadow = '0 18px 44px rgba(17,23,73,.14)';
}
function liftOff(e) {
  e.currentTarget.style.transform = 'none';
  e.currentTarget.style.boxShadow = 'none';
}

// Count-up for the stat tagged with data-count, triggered on scroll into view.
function useCountUp() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-count]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseInt(el.getAttribute('data-count'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          const start = performance.now();
          const dur = 1400;
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * ease) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const statBig = { ...sora, fontWeight: 800, fontSize: 'clamp(42px, 9vw, 64px)', color: gold, lineHeight: 1 };
const statLabel = {
  ...mono,
  fontSize: 11,
  letterSpacing: '.18em',
  color: '#9EAAD0',
  textTransform: 'uppercase',
  lineHeight: 1.6,
};

export default function Home() {
  useReveal();
  useCountUp();
  useDarkOnly();

  // Static assets need useBaseUrl — a bare "/img/..." would resolve against the
  // domain root, not under baseUrl (/uofglasgow/), and 404 in production.
  const logoUrl = useBaseUrl('/img/synwave-logo-v2.png');

  return (
    <Layout title={`${PROJECT} — iGEM 2026`} description={TAGLINE}>
      <div
        style={{
          fontFamily: "'Archivo', sans-serif",
          background: '#0C1036',
          color: '#EAEEF8',
          overflowX: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* ============ HERO ============ */}
        <header
          id="top"
          style={{
            position: 'relative',
            minHeight: 'calc(100vh - var(--ifm-navbar-height))',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#111749',
          }}
        >
          <SynwaveBackground />

          <div
            className="synwave-hero-logo"
            style={{
              position: 'absolute',
              right: '6%',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              width: 'min(46vw, 560px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '130%',
                aspectRatio: '1',
                borderRadius: '50%',
                background: 'radial-gradient(closest-side, rgba(240,197,129,.22), rgba(240,197,129,0) 70%)',
                animation: 'glowPulse 6s ease-in-out infinite',
              }}
            />
            <img
              src={logoUrl}
              alt="Synwave logo"
              style={{
                position: 'relative',
                width: '100%',
                height: 'auto',
                display: 'block',
                animation: 'logoFloat 8s ease-in-out infinite',
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 62%, transparent 78%)',
                maskImage: 'radial-gradient(circle at 50% 50%, #000 62%, transparent 78%)',
              }}
            />
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 3,
              padding: 'clamp(92px, 16vw, 116px) clamp(22px, 5vw, 40px) 0',
              animation: 'fadeUp 1s cubic-bezier(.2,.7,.2,1) both',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 28, height: 1, background: gold, display: 'block' }} />
              <span style={{ ...mono, fontSize: 13, letterSpacing: '.22em', color: gold, textTransform: 'uppercase' }}>
                iGEM 2026 · {TEAM}
              </span>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 3,
              padding: '0 clamp(22px, 5vw, 40px) clamp(40px, 8vw, 58px)',
              marginTop: 'auto',
              maxWidth: 880,
              animation: 'fadeUp 1.1s cubic-bezier(.2,.7,.2,1) .15s both',
            }}
          >
            <h1
              style={{
                ...sora,
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(40px, 9vw, 116px)',
                lineHeight: '.98',
                letterSpacing: '-0.03em',
                paddingBottom: '0.1em',
                background: 'linear-gradient(115deg, #FFFFFF 18%, #F0C581 60%, #8AA6DC 105%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Catching Alzheimer's
              <br />
              before it speaks.
            </h1>
            <p style={{ margin: '28px 0 0 4px', maxWidth: 560, fontSize: 19, lineHeight: 1.65, color: '#C3CCE8', textWrap: 'pretty' }}>
              {TAGLINE}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 34 }}>
              <a
                href="#story"
                style={{ ...mono, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', textDecoration: 'none', color: '#111749', background: gold, padding: '14px 26px', borderRadius: 999, fontWeight: 600, whiteSpace: 'nowrap', transition: 'transform .25s ease, box-shadow .25s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(240,197,129,.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                Read the story
              </a>
              <a
                href="#explore"
                style={{ ...mono, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', textDecoration: 'none', color: '#EAEEF8', border: '1px solid rgba(234,238,248,.28)', padding: '14px 26px', borderRadius: 999, fontWeight: 500, whiteSpace: 'nowrap', transition: 'border-color .25s ease, color .25s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8AA6DC'; e.currentTarget.style.color = '#8AA6DC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(234,238,248,.28)'; e.currentTarget.style.color = '#EAEEF8'; }}
              >
                Explore the wiki
              </a>
            </div>
          </div>

          <div className="synwave-scroll-cue" style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ ...mono, fontSize: 10, letterSpacing: '.3em', color: '#7986B0' }}>SCROLL</span>
            <span style={{ width: 1, height: 34, background: gold, display: 'block', animation: 'scrollPulse 2.2s ease-in-out infinite' }} />
          </div>
        </header>

        {/* ============ MARQUEE ============ */}
        <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(234,238,248,.08)', borderBottom: '1px solid rgba(234,238,248,.08)', padding: '22px 0', background: '#0C1036' }}>
          <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'marquee 38s linear infinite' }}>
            {[0, 1].map((k) => (
              <span key={k} style={{ ...sora, fontWeight: 700, fontSize: 'clamp(28px, 7vw, 46px)', letterSpacing: '.05em', color: '#0C1036', WebkitTextStroke: '1.6px rgba(138,166,220,.6)', paintOrder: 'stroke', paddingRight: 56 }}>
                {MARQUEE}
              </span>
            ))}
          </div>
        </div>

        {/* ============ STORY ============ */}
        <section id="story" style={{ padding: 'clamp(80px, 14vw, 140px) clamp(22px, 5vw, 40px) 40px', maxWidth: 1280, margin: '0 auto', scrollMarginTop: 70 }}>
          <div data-reveal="0" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(36px, 8vw, 90px)', alignItems: 'center', paddingBottom: 'clamp(80px, 14vw, 150px)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                <span style={{ ...mono, fontSize: 14, color: gold, letterSpacing: '.2em' }}>01</span>
                <span style={{ ...mono, fontSize: 12, color: '#7986B0', letterSpacing: '.22em', textTransform: 'uppercase' }}>The Problem</span>
              </div>
              <h2 style={{ ...sora, margin: '22px 0 0 0', fontWeight: 700, fontSize: 'clamp(30px, 6vw, 50px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#EAEEF8', textWrap: 'pretty' }}>Diagnosed too late to help.</h2>
              <p style={{ margin: '24px 0 0 0', fontSize: 17, lineHeight: 1.75, color: '#9EAAD0', maxWidth: 470, textWrap: 'pretty' }}>
                Dementia will affect <strong style={{ color: gold, fontWeight: 600 }}>1 in 3 people in Scotland</strong>. Yet Alzheimer's is so often caught too late — by the time symptoms appear, the new generation of disease-modifying drugs can no longer change the outcome.
              </p>
            </div>
            <Slot label="[ image — the human cost of late diagnosis ]" />
          </div>

          <div data-reveal="0" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(36px, 8vw, 90px)', alignItems: 'center', paddingBottom: 'clamp(80px, 14vw, 150px)' }}>
            <div className="story-flip-text" style={{ order: 2 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                <span style={{ ...mono, fontSize: 14, color: gold, letterSpacing: '.2em' }}>02</span>
                <span style={{ ...mono, fontSize: 12, color: '#7986B0', letterSpacing: '.22em', textTransform: 'uppercase' }}>The Idea</span>
              </div>
              <h2 style={{ ...sora, margin: '22px 0 0 0', fontWeight: 700, fontSize: 'clamp(30px, 6vw, 50px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#EAEEF8', textWrap: 'pretty' }}>Listening through the gut–brain axis.</h2>
              <p style={{ margin: '24px 0 0 0', fontSize: 17, lineHeight: 1.75, color: '#9EAAD0', maxWidth: 470, textWrap: 'pretty' }}>
                The gut and the brain are in constant conversation. By reading that signal, Synwave opens a <strong style={{ color: gold, fontWeight: 600 }}>non-invasive pathway</strong> to detect Alzheimer's through bio-sensing — targeting the earliest disease biomarkers, up to <strong style={{ color: gold, fontWeight: 600 }}>15 years before symptoms</strong> emerge.
              </p>
            </div>
            <div className="story-flip-media" style={{ order: 1 }}>
              <Slot label="[ diagram — the gut–brain axis ]" />
            </div>
          </div>

          <div data-reveal="0" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(36px, 8vw, 90px)', alignItems: 'center', paddingBottom: 'clamp(70px, 12vw, 130px)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                <span style={{ ...mono, fontSize: 14, color: gold, letterSpacing: '.2em' }}>03</span>
                <span style={{ ...mono, fontSize: 12, color: '#7986B0', letterSpacing: '.22em', textTransform: 'uppercase' }}>The Solution</span>
              </div>
              <h2 style={{ ...sora, margin: '22px 0 0 0', fontWeight: 700, fontSize: 'clamp(30px, 6vw, 50px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#EAEEF8', textWrap: 'pretty' }}>Bacteria engineered to sound the alarm.</h2>
              <p style={{ margin: '24px 0 0 0', fontSize: 17, lineHeight: 1.75, color: '#9EAAD0', maxWidth: 470, textWrap: 'pretty' }}>
                We engineer bacterial cultures that recognise known early biomarkers and answer with an <strong style={{ color: gold, fontWeight: 600 }}>amplified signal</strong> — a clear, reliable readout. The Synwave Screening Test turns that signal into earlier intervention, and earlier intervention into better lives.
              </p>
            </div>
            <Slot label="[ image — engineered biosensor cultures ]" />
          </div>
        </section>

        {/* ============ STATS ============ */}
        <section data-reveal="0" style={{ borderTop: '1px solid rgba(234,238,248,.08)', borderBottom: '1px solid rgba(234,238,248,.08)', background: '#111749' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(48px, 9vw, 72px) clamp(22px, 5vw, 40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={statBig}>1 in 3</span>
              <span style={statLabel}>people in Scotland affected by dementia</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={statBig}><span data-count="15">0</span> yrs</span>
              <span style={statLabel}>earlier than symptom onset</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={statBig}>0</span>
              <span style={statLabel}>needles — a non-invasive sample</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={statBig}>1</span>
              <span style={statLabel}>amplified signal, one reliable result</span>
            </div>
          </div>
        </section>

        {/* ============ EXPLORE THE WIKI ============ */}
        <section id="explore" style={{ background: '#E8ECF7', color: '#111749', padding: 'clamp(72px, 13vw, 130px) clamp(22px, 5vw, 40px)', scrollMarginTop: 70 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div data-reveal="0" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, marginBottom: 64, flexWrap: 'wrap' }}>
              <h2 style={{ ...sora, margin: 0, fontWeight: 800, fontSize: 'clamp(34px, 7vw, 62px)', letterSpacing: '-0.025em', lineHeight: 1 }}>Explore the wiki</h2>
              <span style={{ ...mono, fontSize: 12, letterSpacing: '.18em', color: '#6E7AA6', textTransform: 'uppercase', paddingBottom: 8 }}>Six chapters · one mission</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 22 }}>
              {chapters.map((c, i) => (
                <Link key={c.n} to={c.href} data-reveal={(i % 3) * 80} style={cardBase} onMouseEnter={liftOn} onMouseLeave={liftOff}>
                  <span style={{ ...mono, fontSize: 12, color: '#C79233', letterSpacing: '.18em' }}>{c.n}</span>
                  <span style={{ ...sora, fontWeight: 700, fontSize: 23, letterSpacing: '-0.01em' }}>{c.title}</span>
                  <span style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5B6488' }}>{c.desc}</span>
                  <span style={{ marginTop: 'auto', fontSize: 18, color: '#C79233' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ TEAM + SPONSORS ============ */}
        <section style={{ background: '#E8ECF7', color: '#111749', padding: '0 clamp(22px, 5vw, 40px) clamp(72px, 13vw, 130px)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div data-reveal="0" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(36px, 6vw, 70px)', alignItems: 'center', background: '#111749', borderRadius: 28, padding: 'clamp(28px, 6vw, 56px)', color: '#EAEEF8' }}>
              <div>
                <span style={{ ...mono, fontSize: 12, letterSpacing: '.22em', color: gold, textTransform: 'uppercase' }}>The Team</span>
                <h3 style={{ ...sora, margin: '18px 0 0 0', fontWeight: 700, fontSize: 'clamp(26px, 5vw, 42px)', letterSpacing: '-0.02em', lineHeight: 1.1, textWrap: 'pretty' }}>iGEM UofG — students from the University of Glasgow with one shared goal.</h3>
                <p style={{ margin: '20px 0 0 0', fontSize: 16, lineHeight: 1.7, color: '#C3CCE8', maxWidth: 460 }}>A multidisciplinary team building Synwave from the bench up — molecular biology, modelling, hardware and human practices.</p>
                <Link
                  to="/team"
                  style={{ display: 'inline-block', marginTop: 30, ...mono, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', textDecoration: 'none', color: '#111749', background: gold, padding: '13px 26px', borderRadius: 999, fontWeight: 600, transition: 'transform .25s ease, box-shadow .25s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(240,197,129,.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Meet the team
                </Link>
              </div>
              <Slot label="[ team photo ]" ratio="16 / 10" radius={18} border="rgba(138,166,220,.3)" bg="repeating-linear-gradient(45deg, rgba(138,166,220,.08) 0 12px, transparent 12px 24px)" />
            </div>

            <div data-reveal="0" style={{ marginTop: 80 }}>
              <span style={{ ...mono, fontSize: 11, letterSpacing: '.24em', color: '#6E7AA6', textTransform: 'uppercase' }}>Supported by</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: 18, marginTop: 22 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ height: 72, border: '1px dashed #B8C2DD', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ ...mono, fontSize: 11, color: '#8C97BC' }}>[ sponsor ]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
