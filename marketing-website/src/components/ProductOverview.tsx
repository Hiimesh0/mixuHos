import React from 'react';
import { Stethoscope, Bed, FileText, CheckCircle2, Shield, Zap, RefreshCw, Cpu } from 'lucide-react';
import styles from './ProductOverview.module.css';

export const ProductOverview: React.FC = () => {
  const pillars = [
    {
      icon: <Stethoscope size={24} color="#0D9488" />,
      title: 'Integrated Clinical Workflows',
      desc: 'Seamless transition between Outpatient consultation, Inpatient admission, daily consultant ward rounds, nursing orders, and OT surgical tracking.',
      points: [
        'Rapid UHID registration & barcode generation',
        'Bedside round logging with automated billing sync',
        'Pre-formatted clinical templates & notes',
      ],
    },
    {
      icon: <Bed size={24} color="#0D9488" />,
      title: 'Real-Time Bed & Ward Matrix',
      desc: 'Live occupancy visualization across ICU, Deluxe AC, Semi-Special, and General Wards. Instantly allocate, transfer, or vacate beds upon discharge.',
      points: [
        'Dynamic tariff calculation per ward tier',
        'Automated status flip upon discharge authorization',
        'Zero duplicate bed allocation conflict lock',
      ],
    },
    {
      icon: <FileText size={24} color="#0D9488" />,
      title: 'Complete Financial Reconciliation',
      desc: 'Audit-ready inpatient and outpatient invoicing with automated calculation of bed stay days, doctor round fees, OT charges, medicines, and initial deposits.',
      points: [
        'Itemized bill breakdown with instant PDF/print preview',
        'Deposit credit ledger & receipt tracking',
        'Configurable tax, concession & billing clearances',
      ],
    },
    {
      icon: <Cpu size={24} color="#0D9488" />,
      title: 'Zero-Orphan Data Architecture',
      desc: 'Relational data integrity across flat-file JSON storage and MySQL-ready repositories ensuring patient records, visits, admissions, and bills are always linked.',
      points: [
        'Single source of truth per patient UHID',
        'Dual-mode client storage for offline reliability',
        'Concurrency-safe file write locking mechanism',
      ],
    },
  ];

  return (
    <section id="overview" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Zap size={14} /> Unified EMR Architecture
          </span>
          <h2 className="section-title">
            Engineered to Solve Complex Clinical &amp; Administrative Friction
          </h2>
          <p className="section-subtitle">
            Most hospital software is fragmented across isolated departmental silos. 
            Mixu Infosystem provides a single, high-performance operational cockpit 
            connecting registration desks, nursing stations, doctors, labs, and billing counters.
          </p>
        </div>

        <div className={styles.pillarGrid}>
          {pillars.map((p, idx) => (
            <div key={idx} className={`glass-card ${styles.pillarCard}`}>
              <div className={styles.iconCircle}>{p.icon}</div>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarDesc}>{p.desc}</p>
              <ul className={styles.pointList}>
                {p.points.map((pt, pIdx) => (
                  <li key={pIdx} className={styles.pointItem}>
                    <CheckCircle2 size={16} className={styles.checkIcon} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Reliability Banner */}
        <div className={styles.reliabilityBanner}>
          <div className={styles.bannerIcon}>
            <Shield size={32} color="#10B981" />
          </div>
          <div className={styles.bannerText}>
            <h4>Enterprise Reliability &amp; Offline Continuity</h4>
            <p>
              Designed with dual-mode operational resiliency: runs locally with instantaneous response times 
              and automatic sync, ensuring hospital staff can record vitals and generate bills even during internet outages.
            </p>
          </div>
          <div className={styles.bannerBadge}>
            <RefreshCw size={16} /> Continuous Availability
          </div>
        </div>
      </div>
    </section>
  );
};
