import React from 'react';
import { Stethoscope, HeartHandshake, FileSpreadsheet, LineChart, CheckCircle2, ShieldCheck } from 'lucide-react';
import styles from './OperationalBenefits.module.css';

export const OperationalBenefits: React.FC = () => {
  const roles = [
    {
      icon: <Stethoscope size={26} color="#0D9488" />,
      role: 'Doctors & Surgeons',
      tag: 'Clinical Agility',
      benefits: [
        'Complete longitudinal patient encounter history accessible in one click',
        'Rapid daily round & procedure logger (< 30 seconds per admitted patient)',
        'Standardized 2D Echocardiography, OT operative notes & investigation orders',
        'Automatic calculation of consultant visiting and surgical procedure fees',
      ],
    },
    {
      icon: <HeartHandshake size={26} color="#0D9488" />,
      role: 'Nursing & Ward Stations',
      tag: 'Zero Clerical Fatigue',
      benefits: [
        'Live bed status matrix across General, Semi-Special, Deluxe & ICU wards',
        'Bedside nursing dressing, catheterization & clinical finding recording',
        'Immediate notification of new admissions with bed number and diagnosis',
        'Automated bed clearance on official discharge authorization',
      ],
    },
    {
      icon: <FileSpreadsheet size={26} color="#0D9488" />,
      role: 'Billing & Cashier Desks',
      tag: 'Zero Revenue Leakage',
      benefits: [
        'Automated consolidation of bed days, doctor rounds, procedures & tests',
        'Real-time deduction of advance admission deposits with receipt linkage',
        'Flexible part-payment installments and multi-mode settlement (Cash/Card/UPI)',
        'Professional, itemized invoice PDF generation ready for insurance claims',
      ],
    },
    {
      icon: <LineChart size={26} color="#0D9488" />,
      role: 'Hospital Directors & Owners',
      tag: 'Institutional Control',
      benefits: [
        'Live operational dashboards for occupancy rates and daily cash collections',
        'Relational data integrity with zero orphaned patient or billing records',
        'Configurable master directories for departments, room tariffs & doctors',
        'NABH-aligned documentation structure ready for regulatory hospital audits',
      ],
    },
  ];

  return (
    <section id="benefits" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <ShieldCheck size={14} /> Value Proposition
          </span>
          <h2 className="section-title">
            Tailored Advantages for Every Healthcare Stakeholder
          </h2>
          <p className="section-subtitle">
            Engineered to respect the demanding daily realities of hospital staff — empowering doctors, nurses, billing clerks, and administrators with specialized tools.
          </p>
        </div>

        <div className={styles.grid}>
          {roles.map((r, i) => (
            <div key={i} className={`glass-card ${styles.card}`}>
              <div className={styles.cardTop}>
                <div className={styles.iconCircle}>{r.icon}</div>
                <div>
                  <span className={styles.tag}>{r.tag}</span>
                  <h3 className={styles.roleTitle}>{r.role}</h3>
                </div>
              </div>
              <ul className={styles.benefitList}>
                {r.benefits.map((b, bIdx) => (
                  <li key={bIdx} className={styles.benefitItem}>
                    <CheckCircle2 size={16} className={styles.checkIcon} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
