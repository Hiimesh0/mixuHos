import React from 'react';
import { ArrowRight, ShieldCheck, Bed, Layers, CalendarCheck2, Users, FileSpreadsheet, Lock } from 'lucide-react';
import { WorldMapBackground } from './WorldMapBackground';
import styles from './Hero.module.css';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('modules') || document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.heroSection}>
      {/* World Map Inspired Background Theme */}
      <WorldMapBackground />

      <div className={`container ${styles.heroContainer}`}>
        {/* Top Tag Pill */}
        <div className={styles.tagWrapper}>
          <div className={styles.pulsePill}>
            <span className={styles.pulseDot} />
            <span className={styles.pulseText}>Mixu Enterprise Hospital Operations Platform</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className={styles.title}>
          Smarter Hospital Management.{' '}
          <span className={styles.gradientText}>One Connected Platform.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className={styles.subtitle}>
          Bring patient management, admissions, clinical workflows, billing and hospital operations together in one organized system.
        </p>

        {/* CTA Group: Book a Demo + Explore Features */}
        <div className={styles.ctaGroup}>
          <button
            type="button"
            className={styles.primaryCta}
            onClick={onOpenDemo}
          >
            <CalendarCheck2 size={19} />
            <span>Book a Demo</span>
          </button>
          <a
            href="#modules"
            className={styles.secondaryCta}
            onClick={scrollToFeatures}
          >
            <span>Explore Features</span>
            <ArrowRight size={18} />
          </a>
        </div>

        <div className={styles.securityNotice}>
          <Lock size={14} color="#14b8a6" />
          <span>Controlled Demo Access with Administrator Approval • Zero Public Exposure of Patient Data</span>
        </div>

        {/* Core Operational Pillar Highlights */}
        <div className={styles.metricGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <Layers size={22} color="#14B8A6" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>25+</span>
              <span className={styles.metricLabel}>Integrated Modules</span>
              <span className={styles.metricDesc}>OPD, IPD, OT, Diagnostics, Accounts &amp; Masters</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <Bed size={22} color="#06B6D4" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>100%</span>
              <span className={styles.metricLabel}>Bed Occupancy Sync</span>
              <span className={styles.metricDesc}>ICU, Deluxe, Special &amp; General Ward Allocation</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <FileSpreadsheet size={22} color="#38BDF8" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>Multi-Format</span>
              <span className={styles.metricLabel}>Payment Wise Reports</span>
              <span className={styles.metricDesc}>Payment-Wise, Patient-Wise, PDF, Excel &amp; CSV</span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <ShieldCheck size={22} color="#10B981" />
            </div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>Granular</span>
              <span className={styles.metricLabel}>RBAC &amp; Security</span>
              <span className={styles.metricDesc}>Page-Level &amp; Operation-Level Checkbox Permissions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
