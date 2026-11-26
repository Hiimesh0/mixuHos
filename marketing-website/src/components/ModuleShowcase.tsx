import React, { useState } from 'react';
import { 
  HeartPulse, 
  Microscope, 
  DollarSign, 
  Building2, 
  Check, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import styles from './ModuleShowcase.module.css';
import { HOSPITAL_APP_URL } from '../config';

interface Suite {
  id: string;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  modules: { name: string; desc: string; route: string }[];
  highlightMetric: string;
}

export const ModuleShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('clinical');

  const suites: Suite[] = [
    {
      id: 'clinical',
      name: 'Clinical & Patient Care',
      icon: <HeartPulse size={20} />,
      tagline: 'Inpatient & Outpatient Clinical Excellence',
      description: 'Streamline bedside workflows from initial casualty triage to consultant ward rounds, surgical logging, and post-op care.',
      highlightMetric: '25+ Clinical & Ward Modules',
      modules: [
        { name: 'Patient Registration', desc: 'Demographic capture, UHID generation & sticker barcoding', route: '/patient-registration' },
        { name: 'Indoor Register (IPD)', desc: 'Admissions ledger with active bed assignment and IPD numbering', route: '/indoor-register' },
        { name: 'Dr. Visit & Procedure', desc: 'Daily consultant rounds, charges tracking & nursing dressings', route: '/dr-visit-procedure' },
        { name: 'OT Entry & Surgical Log', desc: 'Surgeon, anaesthetist, operative notes & OT tariff recording', route: '/ot-entry' },
        { name: 'Discharge Card & Summary', desc: 'Clinical summary, discharge medications, follow-up & bed release', route: '/discharge-card' },
        { name: 'Patient History & Past Info', desc: 'Complete longitudinal clinical history across all encounters', route: '/patient-history' },
      ],
    },
    {
      id: 'diagnostics',
      name: 'Diagnostics & Pathology',
      icon: <Microscope size={20} />,
      tagline: 'Precision Investigation & Diagnostic Templates',
      description: 'Standardize diagnostic reporting with clinical templates, automated normal-range flagging, and custom report formats.',
      highlightMetric: '100% Template-Driven Reports',
      modules: [
        { name: '2D Echocardiography Report', desc: 'Detailed cardiac parameters, LV systolic function & Doppler stats', route: '/echo-report' },
        { name: 'Investigation Ordered', desc: 'Pathology & radiology test requisition and sample status tracking', route: '/investigation-ordered' },
        { name: 'Report Templates Master', desc: 'Pre-configured department headers, normal values & boilerplates', route: '/report-template' },
        { name: 'Medical Certificates', desc: 'Fitness, illness, leave & hospital stay official certificates', route: '/medical-certificate' },
        { name: 'MLC & Death Register', desc: 'Medico-legal cases documentation and death certificate register', route: '/mlc-certificate' },
      ],
    },
    {
      id: 'billing',
      name: 'Billing & Financial Accounts',
      icon: <DollarSign size={20} />,
      tagline: 'Audit-Ready Revenue Cycle Management',
      description: 'Eliminate revenue leakage with transparent itemized invoicing, deposit credits, and multi-mode payment tracking.',
      highlightMetric: 'Zero Unbilled Inpatient Charges',
      modules: [
        { name: 'Inpatient Comprehensive Bill', desc: 'Consolidated bed days, doctor visits, medicines & deposit deductions', route: '/inpatient-bill' },
        { name: 'OPD Billing Desk', desc: 'Consultation fees, rapid invoice printing & receipts', route: '/billing' },
        { name: 'Inpatient Receipts', desc: 'Official payment acknowledgement receipts with tax breakdown', route: '/inpatient-receipt' },
        { name: 'Deposit Entry', desc: 'Advance admission deposit ledger and receipt issuance', route: '/deposit-entry' },
        { name: 'Part-Payment Management', desc: 'Track partial installment settlements for long inpatient stays', route: '/part-payment' },
      ],
    },
    {
      id: 'admin',
      name: 'Hospital Administration',
      icon: <Building2 size={20} />,
      tagline: 'Facility, Tariff & Master Configuration',
      description: 'Maintain institutional control over room tariffs, doctor master directories, department hierarchies, and visiting rules.',
      highlightMetric: '50+ Configurable Masters',
      modules: [
        { name: 'Bed Master & Matrix', desc: 'Ward, room type, tariff rates & real-time occupancy status', route: '/bed-master' },
        { name: 'Doctor Master Directory', desc: 'Consultants, visiting specialists, reference doctors & fee schedules', route: '/doctor-master' },
        { name: 'Room Type Master', desc: 'ICU, Deluxe, Special, Semi-Special & General Ward tariffs', route: '/room-type-master' },
        { name: 'Medicine & Pharmacy Master', desc: 'Generic, brand, dosage form, batch, unit & retail pricing', route: '/medicine-master' },
        { name: 'Department Master', desc: 'Clinical, diagnostic & administrative department groupings', route: '/department-master' },
      ],
    },
  ];

  const currentSuite = suites.find(s => s.id === activeTab) || suites[0];

  return (
    <section id="modules" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Building2 size={14} /> Modular System Architecture
          </span>
          <h2 className="section-title">
            Explore Mixu’s Complete Suite of 50+ Dedicated Modules
          </h2>
          <p className="section-subtitle">
            Engineered modularly so every department operates with tailored workflows while data remains completely synchronized across the entire facility.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabContainer}>
          <div className={styles.tabList}>
            {suites.map(s => (
              <button
                key={s.id}
                type="button"
                className={`${styles.tabBtn} ${activeTab === s.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(s.id)}
              >
                <span className={styles.tabIcon}>{s.icon}</span>
                <span className={styles.tabName}>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className={`glass-card ${styles.showcaseCard}`}>
          <div className={styles.showcaseHeader}>
            <div>
              <span className={styles.suiteTagline}>{currentSuite.tagline}</span>
              <h3 className={styles.suiteTitle}>{currentSuite.name}</h3>
              <p className={styles.suiteDesc}>{currentSuite.description}</p>
            </div>
            <div className={styles.suiteBadge}>
              {currentSuite.highlightMetric}
            </div>
          </div>

          <div className={styles.moduleGrid}>
            {currentSuite.modules.map((m, idx) => (
              <a
                key={idx}
                href={`${HOSPITAL_APP_URL}#${m.route}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.moduleItem}
              >
                <div className={styles.moduleMeta}>
                  <h4 className={styles.moduleName}>{m.name}</h4>
                  <p className={styles.moduleDesc}>{m.desc}</p>
                </div>
                <div className={styles.moduleAction}>
                  <span>Open in App</span>
                  <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
