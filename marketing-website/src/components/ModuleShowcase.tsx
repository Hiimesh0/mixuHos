import React, { useState } from 'react';
import { 
  HeartPulse, 
  Microscope, 
  DollarSign, 
  Building2, 
  FileText,
  ShieldCheck,
  CalendarCheck2,
  ChevronRight
} from 'lucide-react';
import styles from './ModuleShowcase.module.css';

interface ModuleShowcaseProps {
  onOpenDemo?: () => void;
}

interface Suite {
  id: string;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  highlightMetric: string;
  modules: { name: string; desc: string; category: string }[];
}

export const ModuleShowcase: React.FC<ModuleShowcaseProps> = ({ onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState<string>('clinical');

  const suites: Suite[] = [
    {
      id: 'clinical',
      name: 'Clinical & Patient Care',
      icon: <HeartPulse size={20} />,
      tagline: 'Inpatient & Outpatient Care Orchestration',
      description: 'Streamline bedside workflows from casualty triage to consultant rounds, surgical documentation, and verified discharge cards.',
      highlightMetric: 'Verified Clinical Workflow',
      modules: [
        { name: 'Patient Registration', desc: 'Demographic capture, auto-generated UHID & high-density barcode sticker generation', category: 'OPD' },
        { name: 'Indoor Register & Admissions', desc: 'Active inpatient registry with IPD numbering, admitting doctor, and bed binding', category: 'IPD' },
        { name: 'Dr. Visit & Procedure Tracker', desc: 'Daily consultant rounds, minor bedside procedures, dressing charges & nurse notes', category: 'Clinical' },
        { name: 'OT Entry & Surgical Log', desc: 'Operative notes, surgical team assignments, anaesthesia classification & OT charges', category: 'Surgical' },
        { name: 'Discharge Card Generator', desc: 'Clinical summary, medications, operative notes, follow-up date & auto bed release', category: 'IPD' },
        { name: 'Longitudinal Patient History', desc: 'Unified clinical timeline across all OPD visits, admissions, and diagnostic reports', category: 'Records' },
      ],
    },
    {
      id: 'bed',
      name: 'Bed & Ward Management',
      icon: <Building2 size={20} />,
      tagline: 'Real-Time Occupancy & Tariff Matrix',
      description: 'Eliminate overbooking and bed allocation disputes with live ward tracking, occupancy status boards, and automated room tariffs.',
      highlightMetric: 'Real-Time Ward Matrix',
      modules: [
        { name: 'Bed Master & Allocation Board', desc: 'Real-time room visualizer with vacant, occupied, and maintenance status indicators', category: 'Beds' },
        { name: 'Room Type Master', desc: 'Configure ICU, Deluxe, Special, Semi-Special & General Ward baseline tariffs', category: 'Tariff' },
        { name: 'Room Status Monitor', desc: 'Interactive floor plan display with admitted patient references and admission dates', category: 'Operations' },
        { name: 'Historical Bed Occupancy', desc: 'Calculate exact bed-day utilization from verified admission and discharge dates', category: 'Analytics' },
      ],
    },
    {
      id: 'diagnostics',
      name: 'Diagnostics & 2D Echo',
      icon: <Microscope size={20} />,
      tagline: 'Precision Investigation & Cardiac Reporting',
      description: 'Standardize diagnostic reporting with clinical templates, automated normal ranges, and specialized 2D Echo studies.',
      highlightMetric: 'Template-Driven Reports',
      modules: [
        { name: '2D Echocardiography Study', desc: 'Cardiac chamber measurements, LVEF calculation, RWMA, and valve assessment with Indication tracking', category: 'Cardiology' },
        { name: 'Investigation Ordered', desc: 'Pathology & radiology test requisitions with sample status and turnaround metrics', category: 'Laboratory' },
        { name: 'Clinical Report Templates', desc: 'Pre-configured department headers, standard findings, and custom templates', category: 'Templates' },
        { name: 'Medical & Fitness Certificates', desc: 'Official medical certificates for illness, leave, fitness, and hospital stay', category: 'Certificates' },
        { name: 'MLC & Death Register', desc: 'Secure medico-legal documentation and registered death certificates with audit trail', category: 'Statutory' },
      ],
    },
    {
      id: 'billing',
      name: 'Billing & Cash Counter',
      icon: <DollarSign size={20} />,
      tagline: 'Transparent Revenue Cycle Management',
      description: 'Eliminate revenue leakage with transparent itemized invoicing, deposit credits, and multi-mode payment tracking.',
      highlightMetric: 'Audit-Proof Billing',
      modules: [
        { name: 'Inpatient Comprehensive Bill', desc: 'Auto-aggregated bed days, doctor rounds, procedures, medicines & advance deposit deduction', category: 'Billing' },
        { name: 'OPD Billing Desk', desc: 'Rapid patient consultation invoicing, dynamic charges, and thermal/A4 bill printing', category: 'OPD' },
        { name: 'Deposit Entry & Advances', desc: 'Official advance admission deposit management with printable deposit receipts', category: 'Receipts' },
        { name: 'Part-Payment Management', desc: 'Interim installment settlements during extended hospitalizations with balance tracking', category: 'Finance' },
      ],
    },
    {
      id: 'accounts',
      name: 'Accounts & Reporting',
      icon: <FileText size={20} />,
      tagline: 'Payment-Wise Ledger & Reconciled Reports',
      description: 'Gain complete financial clarity with multi-column payment-wise reports, department revenue splits, and live ledger reconciliation.',
      highlightMetric: 'PDF, Excel & CSV Engine',
      modules: [
        { name: 'Payment Wise Report', desc: 'Multi-column matrix: IPD Deposit, Lab, OPD, Echo, TMT, Packages vs Cash, Card, UPI, Cheque, RTGS', category: 'Financial' },
        { name: 'Accounts Dashboard', desc: 'Billed amount, collected revenue, outstanding balances, and daily transaction charts', category: 'Ledger' },
        { name: 'Patient-Wise & Date-Wise Reports', desc: 'Detailed patient financial audit trails and daily collection totals with server-side pagination', category: 'Reporting' },
        { name: 'Export & Printing Hub', desc: 'Instant export to professional landscape PDF, native Excel spreadsheets, and CSV files', category: 'Export' },
      ],
    },
    {
      id: 'security',
      name: 'Security & Granular RBAC',
      icon: <ShieldCheck size={20} />,
      tagline: 'Institutional Governance & Audit Trails',
      description: 'Enforce strict role-based access control with page-level and operation-level checkbox permissions, hashed credentials, and immutable audit logs.',
      highlightMetric: 'Enterprise RBAC Protection',
      modules: [
        { name: 'Roles & Permissions Matrix', desc: 'Interactive checkbox grid controlling access, view, create, edit, delete, print, and export for every page', category: 'Security' },
        { name: 'User Management Directory', desc: 'Staff account provisioning with role assignments, status controls, and PBKDF2 password hashing', category: 'Users' },
        { name: 'Backend Permission Enforcement', desc: 'Strict deny-by-default API authentication rejecting unauthorized requests at the server level', category: 'Auth' },
        { name: 'Security Audit Logs', desc: 'Tamper-evident logs of logins, permission updates, financial exports, and record modifications', category: 'Audit' },
      ],
    },
  ];

  const currentSuite = suites.find(s => s.id === activeTab) || suites[0];

  return (
    <section id="modules" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Building2 size={14} /> Comprehensive Institutional Architecture
          </span>
          <h2 className="section-title">
            Explore Mixu’s Complete Suite of Dedicated Hospital Modules
          </h2>
          <p className="section-subtitle">
            Engineered modularly so every department operates with specialized workflows while hospital clinical and financial records remain completely synchronized.
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
              <div
                key={idx}
                className={styles.moduleItem}
                onClick={onOpenDemo}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.moduleMeta}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 className={styles.moduleName}>{m.name}</h4>
                    <span style={{ fontSize: '11px', color: '#14b8a6', background: 'rgba(20, 184, 166, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {m.category}
                    </span>
                  </div>
                  <p className={styles.moduleDesc}>{m.desc}</p>
                </div>
                <div className={styles.moduleAction}>
                  <span>Book Demo for Module</span>
                  <CalendarCheck2 size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleShowcase;
