import React, { useState } from 'react';
import { 
  UserCheck, 
  Bed, 
  Stethoscope, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react';
import styles from './WorkflowSection.module.css';

export const WorkflowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'Patient Intake & UHID Issuance',
      icon: <UserCheck size={24} />,
      subtitle: 'Front Desk & Triage',
      description: 'The patient arrives at the registration desk. Staff capture demographics, generate a permanent UHID barcode sticker, and route the patient for outpatient consultation or immediate emergency triage.',
      details: [
        'Automatic UHID barcode and registration sticker printing',
        'Past medical record lookup by mobile number or name',
        'Demographic verification with category-based fee tariff',
      ],
    },
    {
      num: '02',
      title: 'Inpatient Admission & Bed Allocation',
      icon: <Bed size={24} />,
      subtitle: 'Indoor Registration & Ward Matrix',
      description: 'When inpatient care is indicated, staff open the Indoor Register, assign an IPD number, select an available bed from the live visual ward matrix (ICU, Deluxe, General), and record the advance deposit.',
      details: [
        'Live bed availability status check (prevents double booking)',
        'Automatic association of daily bed charges by room type',
        'Official deposit receipt generation with transaction reference',
      ],
    },
    {
      num: '03',
      title: 'Clinical Care, Rounds & Investigation',
      icon: <Stethoscope size={24} />,
      subtitle: 'Wards, OT & Diagnostic Lab',
      description: 'Admitting and visiting consultants log clinical rounds and bedside procedures. Surgeons record operative notes and tariffs. Diagnostics order tests with structured 2D Echo and pathology templates.',
      details: [
        'Instant consultant round logger with rate and note capture',
        'Surgical procedure and anaesthetist charge tracking in OT log',
        'All clinical entries automatically accumulate on patient ledger',
      ],
    },
    {
      num: '04',
      title: 'Discharge Clearance & Consolidated Invoicing',
      icon: <FileText size={24} />,
      subtitle: 'Discharge Desk & Billing Counter',
      description: 'On recovery, the doctor creates an itemized Discharge Summary. The billing desk compiles all bed stay days, doctor rounds, procedure fees, medicines, and deducts deposits for final settlement.',
      details: [
        'Comprehensive itemized invoice preview and printable PDF',
        'Automatic bed release and status flip upon bill settlement',
        'NABH-compliant discharge certificate, follow-up advice & MLC register',
      ],
    },
  ];

  return (
    <section id="workflow" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} /> End-to-End Patient Journey
          </span>
          <h2 className="section-title">
            How Mixu Connects Every Step from Admission to Discharge
          </h2>
          <p className="section-subtitle">
            Eliminate gaps between clinical decision-making and administrative execution with a unified, synchronized patient journey.
          </p>
        </div>

        {/* Workflow Timeline Steps */}
        <div className={styles.timelineRow}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={`${styles.timelineStep} ${activeStep === idx ? styles.activeTimelineStep : ''}`}
              onClick={() => setActiveStep(idx)}
            >
              <div className={styles.stepNumberBadge}>{s.num}</div>
              <span className={styles.stepName}>{s.title}</span>
            </div>
          ))}
        </div>

        {/* Active Step Showcase Card */}
        <div className={`glass-card ${styles.stepCard}`}>
          <div className={styles.stepCardLeft}>
            <div className={styles.stepCardIcon}>{steps[activeStep].icon}</div>
            <span className={styles.stepCardSub}>{steps[activeStep].subtitle}</span>
            <h3 className={styles.stepCardTitle}>{steps[activeStep].title}</h3>
            <p className={styles.stepCardDesc}>{steps[activeStep].description}</p>
          </div>

          <div className={styles.stepCardRight}>
            <h4 className={styles.featureListTitle}>Key Operational Highlights:</h4>
            <ul className={styles.featureList}>
              {steps[activeStep].details.map((d, dIdx) => (
                <li key={dIdx} className={styles.featureItem}>
                  <CheckCircle size={18} color="#10B981" className={styles.featureIcon} />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
