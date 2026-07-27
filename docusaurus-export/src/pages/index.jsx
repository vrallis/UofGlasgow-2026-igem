import React, { useEffect } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import SynwaveBackground from '@site/src/components/SynwaveBackground';
import useReveal from '@site/src/components/useReveal';
import styles from './index.module.css';

const PROJECT = 'Synwave';
const TEAM = 'iGEM UofG';
const TAGLINE =
  'Synwave is an engineered bacterial biosensor that reads the gut–brain axis to detect Alzheimer\u2019s up to 15 years before symptoms — non-invasively, in time for treatment to matter.';
const MARQUEE =
  'EARLY DETECTION ✦ THE GUT–BRAIN AXIS ✦ ENGINEERED BIOSENSING ✦ iGEM 2026 ✦\u00A0';

// Placeholder image slot — swap for a real <img> when you have artwork.
// ratio / radius are genuinely per-use values, so they stay as small inline
// styles; everything visual lives in the .slot class.
function Slot({ label, ratio = '4 / 3', radius = 20, className }) {
  return (
    <div className={clsx(styles.slot, className)} style={{ aspectRatio: ratio, borderRadius: radius }}>
      <span className={styles.slotLabel}>{label}</span>
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

export default function Home() {
  useReveal();
  useCountUp();

  return (
    <Layout title={`${PROJECT} — iGEM 2026`} description={TAGLINE}>
      <div className={styles.page}>
        {/* ============ HERO ============ */}
        <header id="top" className={styles.hero}>
          <SynwaveBackground />

          <div className={styles.heroLogo}>
            <div className={styles.heroGlow} />
            <img src="/img/synwave-logo-v2.png" alt="Synwave logo" className={styles.heroLogoImg} />
          </div>

          <div className={styles.heroKicker}>
            <div className={styles.kickerRow}>
              <span className={styles.kickerLine} />
              <span className={styles.kickerLabel}>iGEM 2026 · {TEAM}</span>
            </div>
          </div>

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Catching Alzheimer's
              <br />
              before it speaks.
            </h1>
            <p className={styles.heroLead}>{TAGLINE}</p>
            <div className={styles.heroActions}>
              <a href="#story" className={clsx(styles.btn, styles.btnPrimary)}>
                Read the story
              </a>
              <a href="#explore" className={clsx(styles.btn, styles.btnGhost)}>
                Explore the wiki
              </a>
            </div>
          </div>

          <div className={styles.scrollHint}>
            <span className={styles.scrollText}>SCROLL</span>
            <span className={styles.scrollBar} />
          </div>
        </header>

        {/* ============ MARQUEE ============ */}
        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            {[0, 1].map((k) => (
              <span key={k} className={styles.marqueeText}>
                {MARQUEE}
              </span>
            ))}
          </div>
        </div>

        {/* ============ STORY ============ */}
        <section id="story" className={styles.story}>
          <div data-reveal="0" className={styles.storyRow}>
            <div className={styles.storyText}>
              <div className={styles.storyEyebrow}>
                <span className={styles.storyNum}>01</span>
                <span className={styles.storyKicker}>The Problem</span>
              </div>
              <h2 className={styles.storyTitle}>Diagnosed too late to help.</h2>
              <p className={styles.storyBody}>
                Dementia will affect <strong className={styles.hl}>1 in 3 people in Scotland</strong>. Yet Alzheimer's is so often caught too late — by the time symptoms appear, the new generation of disease-modifying drugs can no longer change the outcome.
              </p>
            </div>
            <div className={styles.storyMedia}>
              <Slot label="[ image — the human cost of late diagnosis ]" />
            </div>
          </div>

          <div data-reveal="0" className={clsx(styles.storyRow, styles.storyRowReverse)}>
            <div className={styles.storyText}>
              <div className={styles.storyEyebrow}>
                <span className={styles.storyNum}>02</span>
                <span className={styles.storyKicker}>The Idea</span>
              </div>
              <h2 className={styles.storyTitle}>Listening through the gut–brain axis.</h2>
              <p className={styles.storyBody}>
                The gut and the brain are in constant conversation. By reading that signal, Synwave opens a <strong className={styles.hl}>non-invasive pathway</strong> to detect Alzheimer's through bio-sensing — targeting the earliest disease biomarkers, up to <strong className={styles.hl}>15 years before symptoms</strong> emerge.
              </p>
            </div>
            <div className={styles.storyMedia}>
              <Slot label="[ diagram — the gut–brain axis ]" />
            </div>
          </div>

          <div data-reveal="0" className={clsx(styles.storyRow, styles.storyRowTight)}>
            <div className={styles.storyText}>
              <div className={styles.storyEyebrow}>
                <span className={styles.storyNum}>03</span>
                <span className={styles.storyKicker}>The Solution</span>
              </div>
              <h2 className={styles.storyTitle}>Bacteria engineered to sound the alarm.</h2>
              <p className={styles.storyBody}>
                We engineer bacterial cultures that recognise known early biomarkers and answer with an <strong className={styles.hl}>amplified signal</strong> — a clear, reliable readout. The Synwave Screening Test turns that signal into earlier intervention, and earlier intervention into better lives.
              </p>
            </div>
            <div className={styles.storyMedia}>
              <Slot label="[ image — engineered biosensor cultures ]" />
            </div>
          </div>
        </section>

        {/* ============ STATS ============ */}
        <section data-reveal="0" className={styles.stats}>
          <div className={styles.statsInner}>
            <div className={styles.stat}>
              <span className={styles.statBig}>1 in 3</span>
              <span className={styles.statLabel}>people in Scotland affected by dementia</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statBig}><span data-count="15">0</span> yrs</span>
              <span className={styles.statLabel}>earlier than symptom onset</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statBig}>0</span>
              <span className={styles.statLabel}>needles — a non-invasive sample</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statBig}>1</span>
              <span className={styles.statLabel}>amplified signal, one reliable result</span>
            </div>
          </div>
        </section>

        {/* ============ EXPLORE THE WIKI ============ */}
        <section id="explore" className={styles.explore}>
          <div className={styles.exploreInner}>
            <div data-reveal="0" className={styles.exploreHead}>
              <h2 className={styles.exploreTitle}>Explore the wiki</h2>
              <span className={styles.exploreMeta}>Six chapters · one mission</span>
            </div>
            <div className={styles.cards}>
              {chapters.map((c, i) => (
                <a key={c.n} href={c.href} data-reveal={(i % 3) * 80} className={styles.card}>
                  <span className={styles.cardNum}>{c.n}</span>
                  <span className={styles.cardTitle}>{c.title}</span>
                  <span className={styles.cardDesc}>{c.desc}</span>
                  <span className={styles.cardArrow}>→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ============ TEAM + SPONSORS ============ */}
        <section className={styles.teamSponsor}>
          <div className={styles.teamSponsorInner}>
            <div data-reveal="0" className={styles.teamBand}>
              <div>
                <span className={styles.teamBandEyebrow}>The Team</span>
                <h3 className={styles.teamBandTitle}>iGEM UofG — students from the University of Glasgow with one shared goal.</h3>
                <p className={styles.teamBandBody}>A multidisciplinary team building Synwave from the bench up — molecular biology, modelling, hardware and human practices.</p>
                <a href="/team" className={styles.teamBandCta}>
                  Meet the team
                </a>
              </div>
              <Slot label="[ team photo ]" ratio="16 / 10" radius={18} className={styles.teamBandMedia} />
            </div>

            <div data-reveal="0" className={styles.sponsorsWrap}>
              <span className={styles.sponsorsLabel}>Supported by</span>
              <div className={styles.sponsorsGrid}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={styles.sponsor}>
                    <span className={styles.sponsorText}>[ sponsor ]</span>
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
