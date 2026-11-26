import React from 'react';
import { ExternalLink, ArrowRight, ShieldCheck, Bed, Layers, Stethoscope } from 'lucide-react';
import styles from './Hero.module.css';
import { HOSPITAL_APP_URL } from '../config';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  return (
    <section className={styles.heroSection}>
      {/* Background ambient lighting */}
      <div className={styles.glowTop} />
      <div className={styles.glowRight} />

      <div className={`container ${styles.heroContainer}`}>
        {/* Top Tag Pill */}
        <div className={styles.tagWrapper}>
          <div className={styles.pulsePill}>
            <span className={styles.pulseDot} />
            <span className={styles.pulseText}>Mixu 2.0 Production Ready • NABH Aligned</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className={styles.title}>
          Next-Generation <span className={styles.gradientText}>Hospital Management</span> &amp; Clinical Intelligence
        </h1>

        {/* Hero Subtitle */}
        <p className={styles.subtitle}>
          The unified operations platform purpose-built for modern hospitals and healthcare centers. 
          Seamlessly orchestrate patient registration, real-time bed allocations, consultant rounds, 
          OT logging, diagnostic reports, and audit-ready financial invoicing with zero-data-loss architecture.
        </p>

        {/* CTA Group */}
        <div className={styles.ctaGroup}>
          <a
            href={HOSPITAL_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryCta}
          >
            <span>Experience Live Hospital Demo</span>
            <ExternalLink size={18} />
          </a>
          <button
            type="button"
            className={styles.secondaryCta}
            onClick={onOpenDemo}
          >
            <span>Schedule Executive Walkthrough</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Core Metric Highlights */}
        <div className={styles.metricGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <Layers size={22} color="#0D9488" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>50+</span>
              <span className={styles.metricLabel}>Dedicated Modules</span>
              <span className={styles.metricDesc}>OPD, IPD, OT, Diagnostics &amp; Billing</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <Bed size={22} color="#0D9488" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>100%</span>
              <span className={styles.metricLabel}>Live Bed Occupancy</span>
              <span className={styles.metricDesc}>ICU, Deluxe, Special &amp; General Wards</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <Stethoscope size={22} color="#0D9488" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>&lt; 30 sec</span>
              <span className={styles.metricLabel}>Bedside Round Entry</span>
              <span className={styles.metricDesc}>Quick doctor visit &amp; procedure logging</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <ShieldCheck size={22} color="#0D9488" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>Zero-Orphan</span>
              <span className={styles.metricLabel}>Data Integrity</span>
              <span className={styles.metricDesc}>Reconciled UHID, IPD &amp; Invoice linking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
