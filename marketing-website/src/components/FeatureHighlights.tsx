import React from 'react';
import { 
  UserPlus, 
  BedDouble, 
  Clock, 
  Receipt, 
  FileCheck, 
  Activity, 
  CheckCheck,
  TrendingUp,
  Sliders
} from 'lucide-react';
import styles from './FeatureHighlights.module.css';

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      icon: <UserPlus size={24} color="#0D9488" />,
      tag: 'Front Desk & Triage',
      title: 'Rapid Patient Registration & UHID Barcoding',
      description: 'Issue unique patient identifiers in seconds. Instant search by mobile, UHID, or name with integrated sticker and wristband barcode generation.',
      metric: 'Zero duplicate entries',
    },
    {
      icon: <BedDouble size={24} color="#0D9488" />,
      tag: 'Inpatient Operations',
      title: 'Interactive Bed & Room Type Master Matrix',
      description: 'Color-coded visual status (Vacant, Occupied, Maintenance, Cleaning). Instant ward admission with auto-populated daily bed charges.',
      metric: 'Real-time bed tracking',
    },
    {
      icon: <Clock size={24} color="#0D9488" />,
      tag: 'Clinical Care',
      title: 'Doctor Visits & Bedside Procedures Logger',
      description: 'Track visiting consultants, daily clinical rounds, nursing dressings, catheterizations, and bedside procedures with automated billing ledger credit.',
      metric: 'Fast round logging',
    },
    {
      icon: <Receipt size={24} color="#0D9488" />,
      tag: 'Revenue Cycle',
      title: 'Unified Inpatient Invoicing & Part-Payment',
      description: 'Consolidate bed stay charges, doctor rounds, procedure fees, investigations, and initial deposits into itemized, professional hospital invoices.',
      metric: 'Zero billing leakage',
    },
    {
      icon: <Activity size={24} color="#0D9488" />,
      tag: 'Diagnostics',
      title: 'Echo & Specialized Investigation Engine',
      description: 'Standardized 2D Echocardiography reporting, pathology test ordering, and clinical imaging notes with dynamic calculation of ejection fractions.',
      metric: 'Standardized clinical templates',
    },
    {
      icon: <FileCheck size={24} color="#0D9488" />,
      tag: 'Discharge & Legal',
      title: 'Automated Discharge Card & Certificate Generation',
      description: 'Produce NABH-compliant discharge summaries, medical certificates, death certificates, and MLC legal cards with one-click print layouts.',
      metric: 'Automated bed clearance',
    },
  ];

  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Sliders size={14} /> Comprehensive Capabilities
          </span>
          <h2 className="section-title">
            Deeply Specialized Features for Every Hospital Department
          </h2>
          <p className="section-subtitle">
            Every screen, form, and report in Mixu Infosystem has been crafted to eliminate repetitive clerical work 
            and guarantee 100% accurate clinical and financial records.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((f, i) => (
            <div key={i} className={`glass-card ${styles.card}`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>{f.icon}</div>
                <span className={styles.featureTag}>{f.tag}</span>
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.description}</p>
              <div className={styles.cardFooter}>
                <div className={styles.metricBadge}>
                  <CheckCheck size={14} color="#10B981" />
                  <span>{f.metric}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
