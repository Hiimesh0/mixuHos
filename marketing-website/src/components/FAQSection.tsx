import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FAQSection.module.css';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: 'What infrastructure is required to deploy Mixu Infosystem in our hospital?',
      a: 'Mixu Infosystem is engineered for extreme deployment flexibility. It can run as an on-premises local server (Windows or Linux) accessible across your hospital local area network (LAN), or hosted securely in the cloud. It features a lightweight Django REST core with flat-file JSON repositories that are also 100% MySQL/PostgreSQL ready, requiring no complex third-party enterprise database licenses.',
    },
    {
      q: 'Can the hospital continue operations if the internet connection goes down?',
      a: 'Yes. With local on-premises deployment or hybrid client-side caching, front desks, ward nurses, and billing staff can register patients, allocate beds, and log consultant visits without uninterrupted external internet connectivity. When connectivity resumes, all transactions reconcile automatically.',
    },
    {
      q: 'How does Mixu ensure zero unbilled charges and prevent billing leakage?',
      a: 'In Mixu, all clinical and bedside activities (visiting consultant rounds, procedural dressings, catheterizations, OT surgeries, and diagnostics) are linked directly to the patient’s active Inpatient (IPD) encounter. When generating the final Inpatient Bill, the system automatically pulls every logged service, calculates total bed stay days, and deducts all advance deposits, ensuring zero orphaned or forgotten charges.',
    },
    {
      q: 'Is Mixu compliant with NABH clinical documentation and medico-legal standards?',
      a: 'Yes. Mixu includes standardized templates for clinical discharge summaries, medical fitness and illness certificates, death registers, and Medico-Legal Case (MLC) documentation. All reports and invoices feature standard hospital headers, authorized doctor signatories, and unique tracking identifiers ready for hospital accreditation audits.',
    },
    {
      q: 'How customizable are ward bed rates, doctor consultation fees, and tariffs?',
      a: 'Every pricing rule is fully configurable through institutional Master settings. You can set distinct daily bed charges across ICU, Deluxe AC, Semi-Special, and General Wards. Similarly, you can configure standard vs. emergency consultation fees per doctor, as well as procedure and OT package tariffs.',
    },
    {
      q: 'Does Mixu support patient barcode wristbands and registration stickers?',
      a: 'Yes. The Patient Registration module automatically generates standardized Code128 barcodes for each new UHID. With one click, front desk staff can print patient registration stickers, wristband barcodes, and printable bill headers compatible with standard thermal label and laser printers.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <HelpCircle size={14} /> Frequently Asked Questions
          </span>
          <h2 className="section-title">
            Everything You Need to Know About Mixu
          </h2>
          <p className="section-subtitle">
            Clear answers to common questions about deployment, data integrity, offline reliability, and clinical workflows.
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`${styles.faqCard} ${isOpen ? styles.faqOpen : ''}`}
                onClick={() => toggle(i)}
              >
                <div className={styles.faqQuestion}>
                  <h3 className={styles.questionText}>{f.q}</h3>
                  <div className={styles.chevronWrap}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    <p>{f.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
