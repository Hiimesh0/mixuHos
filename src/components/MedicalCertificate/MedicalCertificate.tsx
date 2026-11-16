import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, Printer, RefreshCw, CheckCircle2, AlertCircle, Plus
} from 'lucide-react';
import styles from './MedicalCertificate.module.css';
import { certificateApi, type CertificateRecord } from '../../api/clinicalApi';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { openCertificatePrint } from '../../utils/universalPrintGenerator';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface MedCertFormData {
  id?: string;
  certificate_no: string;
  uhid: string;
  patient_name: string;
  age: string;
  gender: string;
  diagnosis: string;
  rest_from: string;
  rest_to: string;
  fitness_date: string;
  doctor_name: string;
  issue_date: string;
}

const defaultFormData: MedCertFormData = {
  certificate_no: '',
  uhid: '',
  patient_name: '',
  age: '35',
  gender: 'Male',
  diagnosis: 'Acute Bronchitis with persistent cough & low grade fever',
  rest_from: new Date().toISOString().split('T')[0],
  rest_to: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
  fitness_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  doctor_name: 'Dr. Nilesh Mahale',
  issue_date: new Date().toISOString().split('T')[0],
};

const MedicalCertificate: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [formData, setFormData] = useState<MedCertFormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [certs, pats] = await Promise.all([
        certificateApi.getCertificates({ cert_type: 'MEDICAL' }),
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
      setNotification({ type: 'error', message: 'Failed to load medical certificates.' });
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
      age: rec.age || '35',
      gender: rec.gender || 'Male',
      diagnosis: rec.diagnosis || '',
      rest_from: rec.rest_from || new Date().toISOString().split('T')[0],
      rest_to: rec.rest_to || '',
      fitness_date: rec.fitness_date || '',
      doctor_name: rec.doctor_name,
      issue_date: rec.issue_date,
    });
  };

  const populateFromPatient = (pat: PatientRecord) => {
    setSelectedPatientId(pat.id);
    const fullName = pat.name || [pat.firstName, pat.lastName].filter(Boolean).join(' ') || pat.id;
    setFormData(prev => ({
      ...prev,
      uhid: pat.uhid || pat.id,
      patient_name: fullName,
      age: pat.age ? String(pat.age) : '35',
      gender: pat.gender || (pat as any).sex || 'Male',
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
      issue_date: new Date().toISOString().split('T')[0],
      rest_from: new Date().toISOString().split('T')[0],
    });
    setNotification({ type: 'info', message: 'Ready to create new medical certificate.' });
  };

  const handleSave = async () => {
    if (!formData.patient_name.trim()) {
      setNotification({ type: 'warning', message: 'Please enter patient name.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<CertificateRecord> = {
        cert_type: 'MEDICAL',
        uhid: formData.uhid || 'UHID-1001',
        patient_name: formData.patient_name,
        age: formData.age,
        gender: formData.gender,
        diagnosis: formData.diagnosis,
        rest_from: formData.rest_from,
        rest_to: formData.rest_to,
        fitness_date: formData.fitness_date,
        doctor_name: formData.doctor_name,
        issue_date: formData.issue_date,
        is_active: true,
      };

      const result = await certificateApi.createCertificate(payload);
      setNotification({
        type: 'success',
        message: `Medical Certificate #${result.certificate_no} saved successfully!`,
      });

      const updated = await certificateApi.getCertificates({ cert_type: 'MEDICAL' });
      setCertificates(updated);
      setCurrentIndex(updated.length - 1);
      populateFromRecord(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving certificate.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const toPrint: CertificateRecord = {
      id: formData.id || 'NEW',
      cert_type: 'MEDICAL',
      certificate_no: formData.certificate_no || 'MED-2026-DRAFT',
      patient_id: formData.uhid,
      uhid: formData.uhid,
      patient_name: formData.patient_name || 'Patient',
      age: formData.age,
      gender: formData.gender,
      doctor_name: formData.doctor_name,
      issue_date: formData.issue_date,
      diagnosis: formData.diagnosis,
      rest_from: formData.rest_from,
      rest_to: formData.rest_to,
      fitness_date: formData.fitness_date,
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
        <h1 className={styles.pageTitle}>Medical Fitness & Leave Certificate</h1>
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

      {/* Form Container */}
      <div className={styles.formContainer}>
        <div className={styles.mainSection}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroupExpanded} style={{ maxWidth: '200px' }}>
              <label className={styles.label}>Certificate No:</label>
              <input type="text" className={`${styles.input} ${styles.inputYellow}`} value={formData.certificate_no || 'Auto on Save'} readOnly />
            </div>
            <div className={styles.fieldGroupExpanded} style={{ maxWidth: '180px' }}>
              <label className={styles.label}>Date of Issue:</label>
              <input type="date" className={styles.input} value={formData.issue_date} onChange={e => setFormData({ ...formData, issue_date: e.target.value })} />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroupExpanded} style={{ flex: 2 }}>
              <label className={styles.label}>Patient Name *</label>
              <input type="text" className={styles.input} value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} />
            </div>
            <div className={styles.fieldGroupExpanded} style={{ flex: 1 }}>
              <label className={styles.label}>UHID:</label>
              <input type="text" className={styles.input} value={formData.uhid} onChange={e => setFormData({ ...formData, uhid: e.target.value })} />
            </div>
            <div className={styles.fieldGroupExpanded} style={{ flex: 0.8 }}>
              <label className={styles.label}>Age:</label>
              <input type="number" min="0" max="120" className={styles.input} value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
            </div>
            <div className={styles.fieldGroupExpanded} style={{ flex: 0.8 }}>
              <label className={styles.label}>Gender:</label>
              <select className={styles.input} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroupExpanded} style={{ flex: 1 }}>
              <label className={styles.label}>Clinical Diagnosis *</label>
              <input type="text" className={styles.input} value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroupExpanded} style={{ flex: 1 }}>
              <label className={styles.label}>Recommended Rest From:</label>
              <input type="date" className={styles.input} value={formData.rest_from} onChange={e => setFormData({ ...formData, rest_from: e.target.value })} />
            </div>
            <div className={styles.fieldGroupExpanded} style={{ flex: 1 }}>
              <label className={styles.label}>Recommended Rest To:</label>
              <input type="date" className={styles.input} value={formData.rest_to} onChange={e => setFormData({ ...formData, rest_to: e.target.value })} />
            </div>
            <div className={styles.fieldGroupExpanded} style={{ flex: 1 }}>
              <label className={styles.label}>Fit to Resume Duty Date:</label>
              <input type="date" className={styles.input} value={formData.fitness_date} onChange={e => setFormData({ ...formData, fitness_date: e.target.value })} />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroupExpanded} style={{ flex: 1 }}>
              <label className={styles.label}>Issuing Doctor / Consultant *</label>
              <input type="text" className={styles.input} value={formData.doctor_name} onChange={e => setFormData({ ...formData, doctor_name: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.navControls}>
            <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Record"><ChevronsLeft size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record"><ChevronLeft size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record"><ChevronRight size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(certificates.length - 1)} title="Last Record"><ChevronsRight size={18} /></button>
          </div>

          <div className={styles.middleActions}>
            <button className={styles.secondaryBtn} onClick={handlePrint}>
              <Printer size={16} /> Print Certificate
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

export default MedicalCertificate;
