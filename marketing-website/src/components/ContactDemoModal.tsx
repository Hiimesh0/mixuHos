import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building, Mail, Phone, User, Bed, ShieldAlert } from 'lucide-react';
import styles from './ContactDemoModal.module.css';

interface ContactDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDemoModal: React.FC<ContactDemoModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bedCount, setBedCount] = useState('25-50 beds');
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'IPD Bed Management',
    'Inpatient & OPD Billing',
  ]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const moduleOptions = [
    'OPD Registration & UHID Barcoding',
    'IPD Bed Management & Ward Matrix',
    'Doctor Rounds & Bedside Procedures',
    'OT & Surgical Log',
    'Diagnostics & 2D Echo Reports',
    'Inpatient & OPD Billing',
    'Accounts & Financial Ledger',
    'Discharge Summary & Medical Certificates',
  ];

  const toggleModule = (mod: string) => {
    setSelectedModules(prev =>
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!hospitalName.trim()) {
      setError('Please enter your hospital or clinic name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid official email address.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setError('Please enter a valid contact phone number.');
      return;
    }

    setIsSubmitting(true);
    // Simulate instantaneous local processing
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className={styles.successState}>
            <div className={styles.successIconWrap}>
              <CheckCircle2 size={48} color="#10B981" />
            </div>
            <h3 className={styles.successTitle}>Walkthrough Request Confirmed!</h3>
            <p className={styles.successDesc}>
              Thank you, <strong>{name}</strong>. Our clinical systems specialist will contact you at{' '}
              <strong>{email}</strong> within 1 business day with your dedicated hospital sandbox credentials.
            </p>
            <div className={styles.confirmedSummary}>
              <div><strong>Facility:</strong> {hospitalName} ({bedCount})</div>
              <div><strong>Modules:</strong> {selectedModules.join(', ') || 'Full Suite'}</div>
            </div>
            <button
              type="button"
              className={styles.doneBtn}
              onClick={onClose}
            >
              Done &amp; Return to Overview
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formHeader}>
              <span className={styles.formTag}>Priority System Consultation</span>
              <h2 className={styles.formTitle}>Request Executive Walkthrough</h2>
              <p className={styles.formSubtitle}>
                Schedule a private, tailored demonstration for your medical superintendents, nursing leaders, and finance directors.
              </p>
            </div>

            {error && (
              <div className={styles.errorAlert}>
                <ShieldAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <User size={14} /> Full Name *
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Dr. Rajesh Patel"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <Building size={14} /> Hospital / Clinic Name *
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="City General Hospital"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <Mail size={14} /> Work Email *
                </label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="superintendent@cityhospital.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  <Phone size={14} /> Phone / Mobile *
                </label>
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="+91 98251 00000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>
                  <Bed size={14} /> Facility Bed Capacity
                </label>
                <select
                  className={styles.select}
                  value={bedCount}
                  onChange={e => setBedCount(e.target.value)}
                >
                  <option value="10-25 beds">10 - 25 Beds (Daycare / Clinic)</option>
                  <option value="25-50 beds">25 - 50 Beds (Nursing Home)</option>
                  <option value="50-100 beds">50 - 100 Beds (Mid-Size Hospital)</option>
                  <option value="100-250 beds">100 - 250 Beds (Multi-Speciality)</option>
                  <option value="250+ beds">250+ Beds (Tertiary Care Center)</option>
                </select>
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Modules of Primary Interest</label>
                <div className={styles.pillGroup}>
                  {moduleOptions.map(mod => {
                    const isSelected = selectedModules.includes(mod);
                    return (
                      <button
                        key={mod}
                        type="button"
                        className={`${styles.pillBtn} ${isSelected ? styles.pillSelected : ''}`}
                        onClick={() => toggleModule(mod)}
                      >
                        {mod}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Special Requirements or Notes (Optional)</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  placeholder="e.g. Current software migration requirements, NABH audit timeline, offline LAN deployment..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Securing Time Slot...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Walkthrough Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
