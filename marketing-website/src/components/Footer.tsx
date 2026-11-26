import React from 'react';
import { Activity, ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import styles from './Footer.module.css';
import { HOSPITAL_APP_URL } from '../config';

interface FooterProps {
  onOpenDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDemo }) => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.topSection}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <div className={styles.logoIcon}>
                <Activity size={22} color="#0D9488" />
              </div>
              <div className={styles.brandText}>
                <span className={styles.brandName}>MIXU INFOSYSTEM</span>
                <span className={styles.brandSub}>Hospital Intelligence &amp; EMR</span>
              </div>
            </div>
            <p className={styles.brandDesc}>
              Next-generation hospital management system unifying patient registration, live bed matrix, bedside clinical rounds, OT logging, diagnostic reports, and audit-ready financial invoicing.
            </p>
            <div className={styles.badgeRow}>
              <div className={styles.badge}>
                <ShieldCheck size={14} color="#10B981" />
                <span>NABH Aligned</span>
              </div>
              <div className={styles.badge}>
                <Activity size={14} color="#06B6D4" />
                <span>Zero-Orphan Integrity</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Navigation</h4>
            <ul className={styles.linkList}>
              <li><a href="#overview">Architecture Overview</a></li>
              <li><a href="#features">Core Features</a></li>
              <li><a href="#modules">50+ Modular Suites</a></li>
              <li><a href="#preview">Live Dashboard Preview</a></li>
              <li><a href="#benefits">Stakeholder Value</a></li>
              <li><a href="#workflow">Patient Journey</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Key Modules */}
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Featured Modules</h4>
            <ul className={styles.linkList}>
              <li><a href={`${HOSPITAL_APP_URL}#/patient-registration`} target="_blank" rel="noreferrer">Patient Registration (UHID)</a></li>
              <li><a href={`${HOSPITAL_APP_URL}#/indoor-register`} target="_blank" rel="noreferrer">Indoor Register (IPD)</a></li>
              <li><a href={`${HOSPITAL_APP_URL}#/dr-visit-procedure`} target="_blank" rel="noreferrer">Dr. Visit &amp; Procedure</a></li>
              <li><a href={`${HOSPITAL_APP_URL}#/echo-report`} target="_blank" rel="noreferrer">2D Echocardiography</a></li>
              <li><a href={`${HOSPITAL_APP_URL}#/inpatient-bill`} target="_blank" rel="noreferrer">Inpatient Billing Desk</a></li>
              <li><a href={`${HOSPITAL_APP_URL}#/discharge-card`} target="_blank" rel="noreferrer">Discharge Card &amp; Clearance</a></li>
            </ul>
          </div>

          {/* Action Col */}
          <div className={styles.actionCol}>
            <h4 className={styles.colTitle}>Ready to Experience?</h4>
            <p className={styles.actionDesc}>
              Test our fully functional live deployment populated with authentic hospital demo patients, beds, and billing records.
            </p>
            <a
              href={HOSPITAL_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.launchBtn}
            >
              <span>Launch Live App</span>
              <ExternalLink size={16} />
            </a>
            <button
              type="button"
              className={styles.demoBtn}
              onClick={onOpenDemo}
            >
              Request Custom Demo
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} Mixu Infosystem Hospital Management System. All rights reserved.</p>
          <div className={styles.bottomMeta}>
            <span>Crafted for Modern Healthcare Facilities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
