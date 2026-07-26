import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import SynwaveBackground from '@site/src/components/SynwaveBackground';
import useReveal from '@site/src/components/useReveal';
import { subteams, advisors } from '@site/src/data/team';
import styles from './team.module.css';

const PROJECT = 'Synwave';
const TEAM = 'iGEM UofG';
const INTRO =
  'A multidisciplinary team of University of Glasgow students building Synwave from the bench up — molecular biology, modelling, hardware and human practices, united by one goal: catching Alzheimer\u2019s before it speaks.';

// Photo placeholder — renders the real image when `photo` is set, otherwise a
// labelled dashed box. `className` carries the per-use size/shape.
function PhotoSlot({ photo, alt, className, label = '[ photo ]' }) {
  if (photo) {
    return <img src={photo} alt={alt} className={clsx(styles.photoImg, className)} />;
  }
  return (
    <div className={clsx(styles.photoSlot, className)}>
      <span className={styles.photoLabel}>{label}</span>
    </div>
  );
}

export default function TeamPage() {
  useReveal();
  const memberCount = subteams.reduce((n, g) => n + g.members.length, 0);

  return (
    <Layout title="Team" description={`Meet the ${TEAM} team behind ${PROJECT}.`}>
      <main className={styles.page}>
        {/* ============ HEADER ============ */}
        <header className={styles.header}>
          <SynwaveBackground />
          <div className={styles.headerGlow} />
          <div className={styles.headerKicker}>
            <div className={styles.kickerRow}>
              <span className={styles.kickerLine} />
              <span className={styles.kickerLabel}>iGEM 2026 · The Team</span>
            </div>
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              The people behind
              <br />
              Synwave.
            </h1>
            <p className={styles.lead}>{INTRO}</p>
          </div>
        </header>

        {/* ============ GROUP PHOTO ============ */}
        <section className={styles.groupPhoto}>
          <div data-reveal="0" className={styles.groupPhotoInner}>
            <PhotoSlot label="[ full team group photo ]" className={styles.groupPhotoSlot} />
          </div>
        </section>

        {/* ============ MEMBERS ============ */}
        <section className={styles.members}>
          <div className={styles.membersInner}>
            <div data-reveal="0" className={styles.membersHead}>
              <h2 className={styles.membersTitle}>Meet the team</h2>
              <span className={styles.membersMeta}>
                {memberCount} students · {TEAM}
              </span>
            </div>

            {subteams.map((group) => (
              <div key={group.name} className={styles.group}>
                <div className={styles.groupHead}>
                  <span className={styles.groupBar} />
                  <span className={styles.groupName}>{group.name}</span>
                </div>
                <div className={styles.memberGrid}>
                  {group.members.map((member, i) => (
                    <div key={i} data-reveal="0" className={styles.member}>
                      <PhotoSlot photo={member.photo} alt={member.name} className={styles.memberPhoto} />
                      <span className={styles.memberName}>{member.name}</span>
                      <span className={styles.memberRole}>{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ ADVISORS ============ */}
        <section className={styles.advisors}>
          <div className={styles.advisorsInner}>
            <div data-reveal="0" className={styles.advisorsBand}>
              <div className={styles.advisorsHead}>
                <span className={styles.advisorsBar} />
                <span className={styles.advisorsLabel}>Advisors &amp; PIs</span>
              </div>
              <div className={styles.advisorGrid}>
                {advisors.map((advisor, i) => (
                  <div key={i} className={styles.advisor}>
                    <PhotoSlot photo={advisor.photo} alt={advisor.name} className={styles.advisorPhoto} />
                    <div>
                      <div className={styles.advisorName}>{advisor.name}</div>
                      <div className={styles.advisorRole}>{advisor.role}</div>
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
