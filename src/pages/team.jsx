import React from 'react';
import Layout from '@theme/Layout';
import SynwaveBackground from '@site/src/components/SynwaveBackground';
import useReveal from '@site/src/components/useReveal';
import useDarkOnly from '@site/src/components/useDarkOnly';
import { subteams, advisors } from '@site/src/data/team';

const PROJECT = 'Synwave';
const TEAM = 'iGEM UofG';
const INTRO =
  'A multidisciplinary team of University of Glasgow students building Synwave from the bench up — molecular biology, modelling, hardware and human practices, united by one goal: catching Alzheimer\u2019s before it speaks.';

// ---- shared style fragments ------------------------------------------------
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const sora = { fontFamily: "'Sora', sans-serif" };
const stripe =
  'repeating-linear-gradient(45deg, rgba(138,166,220,.10) 0 12px, transparent 12px 24px)';

function PhotoSlot({ photo, alt, style, label = '[ photo ]', color = '#8C97BC' }) {
  if (photo) {
    return <img src={photo} alt={alt} style={{ ...style, objectFit: 'cover' }} />;
  }
  return (
    <div
      style={{
        ...style,
        border: '1px dashed #B8C2DD',
        background: stripe,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ ...mono, fontSize: 11, color, letterSpacing: '.08em' }}>{label}</span>
    </div>
  );
}

export default function TeamPage() {
  useReveal();
  useDarkOnly();
  const memberCount = subteams.reduce((n, g) => n + g.members.length, 0);

  return (
    <Layout title="Team" description={`Meet the ${TEAM} team behind ${PROJECT}.`}>
      <main
        style={{
          fontFamily: "'Archivo', sans-serif",
          background: '#0C1036',
          color: '#EAEEF8',
          overflowX: 'hidden',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* ============ HEADER ============ */}
        <header
          style={{
            position: 'relative',
            minHeight: '62vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            overflow: 'hidden',
            background: '#111749',
          }}
        >
          <SynwaveBackground />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '40%',
              width: 720,
              aspectRatio: '1',
              borderRadius: '50%',
              background:
                'radial-gradient(closest-side, rgba(240,197,129,.16), rgba(240,197,129,0) 70%)',
              animation: 'glowPulse 7s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              padding: 'clamp(40px, 9vw, 64px) clamp(22px, 5vw, 40px) 0',
              animation: 'fadeUp 1s cubic-bezier(.2,.7,.2,1) both',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 28, height: 1, background: '#F0C581', display: 'block' }} />
              <span
                style={{
                  ...mono,
                  fontSize: 13,
                  letterSpacing: '.22em',
                  color: '#F0C581',
                  textTransform: 'uppercase',
                }}
              >
                iGEM 2026 · The Team
              </span>
            </div>
          </div>
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              padding: '0 clamp(22px, 5vw, 40px) clamp(40px, 8vw, 64px)',
              maxWidth: 1000,
              animation: 'fadeUp 1.1s cubic-bezier(.2,.7,.2,1) .15s both',
            }}
          >
            <h1
              style={{
                ...sora,
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(40px, 8vw, 100px)',
                lineHeight: '.98',
                letterSpacing: '-0.03em',
                paddingBottom: '0.1em',
                background:
                  'linear-gradient(115deg, #FFFFFF 18%, #F0C581 62%, #8AA6DC 108%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              The people behind
              <br />
              Synwave.
            </h1>
            <p
              style={{
                margin: '28px 0 0 4px',
                maxWidth: 600,
                fontSize: 19,
                lineHeight: 1.65,
                color: '#C3CCE8',
                textWrap: 'pretty',
              }}
            >
              {INTRO}
            </p>
          </div>
        </header>

        {/* ============ GROUP PHOTO ============ */}
        <section style={{ background: '#0C1036', padding: 'clamp(48px, 10vw, 90px) clamp(22px, 5vw, 40px) 20px' }}>
          <div data-reveal="0" style={{ maxWidth: 1280, margin: '0 auto' }}>
            <PhotoSlot
              label="[ full team group photo ]"
              color="#6E7AA6"
              style={{
                aspectRatio: '21 / 9',
                borderRadius: 24,
                borderColor: 'rgba(138,166,220,.25)',
              }}
            />
          </div>
        </section>

        {/* ============ MEMBERS ============ */}
        <section
          style={{
            background: '#E8ECF7',
            color: '#111749',
            padding: 'clamp(64px, 12vw, 120px) clamp(22px, 5vw, 40px)',
            marginTop: 70,
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div
              data-reveal="0"
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 40,
                marginBottom: 72,
                flexWrap: 'wrap',
              }}
            >
              <h2
                style={{
                  ...sora,
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 'clamp(34px, 7vw, 62px)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1,
                }}
              >
                Meet the team
              </h2>
              <span
                style={{
                  ...mono,
                  fontSize: 12,
                  letterSpacing: '.18em',
                  color: '#6E7AA6',
                  textTransform: 'uppercase',
                  paddingBottom: 8,
                }}
              >
                {memberCount} students · {TEAM}
              </span>
            </div>

            {subteams.map((group) => (
              <div key={group.name} style={{ marginBottom: 76 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
                  <span style={{ width: 26, height: 2, background: '#C79233', display: 'block' }} />
                  <span
                    style={{
                      ...mono,
                      fontSize: 13,
                      letterSpacing: '.2em',
                      color: '#C79233',
                      textTransform: 'uppercase',
                    }}
                  >
                    {group.name}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 210px), 1fr))',
                    gap: 'clamp(14px, 3vw, 22px)',
                  }}
                >
                  {group.members.map((member, i) => (
                    <div
                      key={i}
                      data-reveal="0"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#FFFFFF',
                        border: '1px solid #D4DBEC',
                        borderRadius: 20,
                        padding: 16,
                        transition:
                          'transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = '0 18px 44px rgba(17,23,73,.14)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <PhotoSlot
                        photo={member.photo}
                        alt={member.name}
                        style={{ aspectRatio: '4 / 5', borderRadius: 12 }}
                      />
                      <span
                        style={{
                          ...sora,
                          margin: '18px 0 0 4px',
                          fontWeight: 700,
                          fontSize: 20,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {member.name}
                      </span>
                      <span
                        style={{
                          ...mono,
                          margin: '7px 0 6px 4px',
                          fontSize: 11.5,
                          letterSpacing: '.1em',
                          color: '#C79233',
                          textTransform: 'uppercase',
                        }}
                      >
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ ADVISORS ============ */}
        <section style={{ background: '#E8ECF7', color: '#111749', padding: '0 clamp(22px, 5vw, 40px) clamp(72px, 13vw, 130px)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div
              data-reveal="0"
              style={{ background: '#111749', borderRadius: 28, padding: 'clamp(28px, 6vw, 56px)', color: '#EAEEF8' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 38 }}>
                <span style={{ width: 26, height: 2, background: '#F0C581', display: 'block' }} />
                <span
                  style={{
                    ...mono,
                    fontSize: 13,
                    letterSpacing: '.2em',
                    color: '#F0C581',
                    textTransform: 'uppercase',
                  }}
                >
                  Advisors &amp; PIs
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
                  gap: 30,
                }}
              >
                {advisors.map((advisor, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}
                  >
                    <PhotoSlot
                      photo={advisor.photo}
                      alt={advisor.name}
                      color="#8AA6DC"
                      style={{
                        width: 92,
                        height: 92,
                        borderRadius: '50%',
                        borderColor: 'rgba(138,166,220,.4)',
                      }}
                    />
                    <div>
                      <div style={{ ...sora, fontWeight: 700, fontSize: 19, letterSpacing: '-0.01em' }}>
                        {advisor.name}
                      </div>
                      <div
                        style={{
                          ...mono,
                          marginTop: 7,
                          fontSize: 11.5,
                          letterSpacing: '.1em',
                          color: '#F0C581',
                          textTransform: 'uppercase',
                        }}
                      >
                        {advisor.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
