import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, Printer, CheckCircle2, AlertCircle, Plus
} from 'lucide-react';
import styles from './DeathCertificate.module.css';
import { certificateApi, type CertificateRecord } from '../../api/clinicalApi';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { openCertificatePrint } from '../../utils/universalPrintGenerator';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface DeathCertFormData {
  id?: string;
  certificate_no: string;
  uhid: string;
  patient_name: string;
  age: string;
  gender: string;
  date_of_death: string;
  time_of_death: string;
  cause_of_death_immediate: string;
  cause_of_death_antecedent: string;
  doctor_name: string;
  issue_date: string;
}

const defaultFormData: DeathCertFormData = {
  certificate_no: '',
  uhid: '',
  patient_name: '',
  age: '68',
  gender: 'Male',
  date_of_death: new Date().toISOString().split('T')[0],
  time_of_death: '06:15 AM',
  cause_of_death_immediate: 'Cardio-Respiratory Arrest',
  cause_of_death_antecedent: 'Septic Shock secondary to Severe Community-Acquired Pneumonia with Multi-Organ Dysfunction',
  doctor_name: 'Dr. Nilesh Mahale',
  issue_date: new Date().toISOString().split('T')[0],
};

const DeathCertificate: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [formData, setFormData] = useState<DeathCertFormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [certs, pats] = await Promise.all([
        certificateApi.getCertificates({ cert_type: 'DEATH' }),
        patientApi.getPatients(),
      ]);
      const patList = Array.isArray(pats) ? pats : ((pats as any)?.patients || []);
      setCertificates(Array.isArray(certs) ? certs : []);
      setPatients(patList);

      if (certs && certs.length > 0) {
        setCurrentIndex(certs.length - 1);
        populateFromRecord(certs[certs.length - 1]);
      } else if (patList.length > 0) {
        populateFromPatient(patList[0]);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load death certificates.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const populateFromRecord = (rec: CertificateRecord) => {
    setFormData({
      id: rec.id,
      certificate_no: rec.certificate_no,
      uhid: rec.uhid,
      patient_name: rec.patient_name,
      age: rec.age || '68',
      gender: rec.gender || 'Male',
      date_of_death: rec.date_of_death || rec.issue_date,
      time_of_death: rec.time_of_death || '06:00 AM',
      cause_of_death_immediate: rec.cause_of_death_immediate || 'Cardio-Respiratory Arrest',
      cause_of_death_antecedent: rec.cause_of_death_antecedent || rec.diagnosis || '',
      doctor_name: rec.doctor_name,
      issue_date: rec.issue_date,
    });
  };

  const populateFromPatient = (pat: PatientRecord) => {
    setSelectedPatientId(pat.id);
    const g = (pat.gender || pat.sex || 'Male').toLowerCase();
    const cleanGender: 'Male' | 'Female' | 'Other' = g.startsWith('f') ? 'Female' : g.startsWith('o') ? 'Other' : 'Male';
    setFormData(prev => ({
      ...prev,
      uhid: pat.uhid || pat.id,
      patient_name: pat.name || '',
      age: pat.age ? String(pat.age) : '68',
      gender: cleanGender,
    }));
  };

  const handlePatientSelect = (patId: string) => {
    const found = patients.find(p => p.id === patId);
    if (found) populateFromPatient(found);
  };

  const handleNav = (target: number) => {
    if (certificates.length === 0) return;
    const bounded = Math.max(0, Math.min(target, certificates.length - 1));
    setCurrentIndex(bounded);
    populateFromRecord(certificates[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultFormData,
      date_of_death: new Date().toISOString().split('T')[0],
      issue_date: new Date().toISOString().split('T')[0],
    });
    setNotification({ type: 'info', message: 'Ready to create new Death Certificate.' });
  };

  const handleSave = async () => {
    if (!formData.patient_name.trim()) {
      setNotification({ type: 'warning', message: 'Please enter patient name.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<CertificateRecord> = {
        cert_type: 'DEATH',
        uhid: formData.uhid || 'UHID-1001',
        patient_name: formData.patient_name,
        age: formData.age,
        gender: formData.gender,
        date_of_death: formData.date_of_death,
        time_of_death: formData.time_of_death,
        cause_of_death_immediate: formData.cause_of_death_immediate,
        cause_of_death_antecedent: formData.cause_of_death_antecedent,
        doctor_name: formData.doctor_name,
        issue_date: formData.issue_date,
        is_active: true,
      };

      const result = await certificateApi.createCertificate(payload);
      setNotification({
        type: 'success',
        message: `Death Certificate #${result.certificate_no} saved successfully!`,
      });

      const updated = await certificateApi.getCertificates({ cert_type: 'DEATH' });
      setCertificates(updated);
      setCurrentIndex(updated.length - 1);
      populateFromRecord(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving Death Certificate.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const toPrint: CertificateRecord = {
      id: formData.id || 'NEW',
      cert_type: 'DEATH',
      certificate_no: formData.certificate_no || 'DTH-2026-DRAFT',
      patient_id: formData.uhid,
      uhid: formData.uhid,
      patient_name: formData.patient_name || 'Patient',
      age: formData.age,
      gender: formData.gender,
      date_of_death: formData.date_of_death,
      time_of_death: formData.time_of_death,
      cause_of_death_immediate: formData.cause_of_death_immediate,
      cause_of_death_antecedent: formData.cause_of_death_antecedent,
      doctor_name: formData.doctor_name,
      issue_date: formData.issue_date,
      is_active: true,
    };
    openCertificatePrint(toPrint);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Toast Notification */}
      {notification && (
        <div
          role="alert"
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${notification.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
            color: notification.type === 'success' ? '#065f46' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button onClick={dismissNotification} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>MEDICAL CERTIFICATE OF CAUSE OF DEATH</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className={styles.input}
            style={{ width: '260px' }}
            value={selectedPatientId}
            onChange={e => handlePatientSelect(e.target.value)}
          >
            <option value="">-- Autofill from Patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name || [p.firstName, p.lastName].filter(Boolean).join(' ') || p.id} ({p.uhid || p.id})</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.mainSection}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Certificate No:</label>
              <input type="text" className={`${styles.input} ${styles.inputYellow}`} value={formData.certificate_no || 'Auto on Save'} readOnly />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Issue Date:</label>
              <input type="date" className={styles.input} value={formData.issue_date} onChange={e => setFormData({ ...formData, issue_date: e.target.value })} />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ flex: 2 }}>
              <label className={styles.label}>Name of Deceased *</label>
              <input type="text" className={styles.input} value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>UHID:</label>
              <input type="text" className={styles.input} value={formData.uhid} onChange={e => setFormData({ ...formData, uhid: e.target.value })} />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 0.8 }}>
              <label className={styles.label}>Age:</label>
              <input type="number" min="0" max="130" className={styles.input} value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 0.8 }}>
              <label className={styles.label}>Sex:</label>
              <select className={styles.input} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Date of Death *</label>
              <input type="date" className={styles.input} value={formData.date_of_death} onChange={e => setFormData({ ...formData, date_of_death: e.target.value })} />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Time of Death *</label>
              <input type="text" className={styles.input} value={formData.time_of_death} onChange={e => setFormData({ ...formData, time_of_death: e.target.value })} />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Immediate Cause of Death (Direct Cause) *</label>
              <input type="text" className={styles.input} value={formData.cause_of_death_immediate} onChange={e => setFormData({ ...formData, cause_of_death_immediate: e.target.value })} />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Antecedent / Underlying Cause</label>
              <textarea className={styles.textarea} style={{ minHeight: '80px' }} value={formData.cause_of_death_antecedent} onChange={e => setFormData({ ...formData, cause_of_death_antecedent: e.target.value })} />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Certifying Medical Practitioner *</label>
              <input type="text" className={styles.input} value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.navControls}>
            <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Record"><ChevronsLeft size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record"><ChevronLeft size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record"><ChevronRight size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(certificates.length - 1)} title="Last Record"><ChevronsRight size={18} /></button>
          </div>

          <div className={styles.middleActions}>
            <button className={styles.secondaryBtn} onClick={handlePrint}>
              <Printer size={16} /> Print Death Certificate
            </button>
            <button className={styles.secondaryBtn} onClick={handleNew}>
              <Plus size={16} /> New Certificate
            </button>
          </div>

          <div className={styles.rightActions}>
            <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Certificate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeathCertificate;
