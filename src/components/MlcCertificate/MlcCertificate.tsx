import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, Printer, CheckCircle2, AlertCircle, Plus
} from 'lucide-react';
import styles from './MlcCertificate.module.css';
import { certificateApi, type CertificateRecord } from '../../api/clinicalApi';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { openCertificatePrint } from '../../utils/universalPrintGenerator';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface MlcFormData {
  id?: string;
  certificate_no: string;
  uhid: string;
  patient_name: string;
  age: string;
  gender: string;
  doctor_name: string;
  issue_date: string;
  police_station: string;
  buckle_no: string;
  brought_by: string;
  examination_time: string;
  identification_marks: string;
  injury_details: string;
}

const defaultFormData: MlcFormData = {
  certificate_no: '',
  uhid: '',
  patient_name: '',
  age: '30',
  gender: 'Male',
  doctor_name: 'Dr. Snehal Mahale',
  issue_date: new Date().toISOString().split('T')[0],
  police_station: 'Umra Police Station, Surat',
  buckle_no: 'PC-4022',
  brought_by: 'Constable Maheshbhai & Family',
  examination_time: new Date().toTimeString().slice(0, 5),
  identification_marks: '1. Black mole on left cheek near zygoma.\n2. 3cm linear healed scar on dorsal right forearm.',
  injury_details: '1. Contusion with tenderness over left frontal bone, 3cm x 2cm, bluish red.\n2. Superficial skin abrasion over right knee joint.\nNo evidence of fracture on clinical exam.',
};

const MlcCertificate: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [formData, setFormData] = useState<MlcFormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [certs, pats] = await Promise.all([
        certificateApi.getCertificates({ cert_type: 'MLC' }),
        patientApi.getPatients(),
      ]);
      setCertificates(certs);
      setPatients(pats);

      if (certs.length > 0) {
        setCurrentIndex(certs.length - 1);
        populateFromRecord(certs[certs.length - 1]);
      } else if (pats.length > 0) {
        populateFromPatient(pats[0]);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load MLC certificates.' });
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
      age: rec.age || '30',
      gender: rec.gender || 'Male',
      doctor_name: rec.doctor_name,
      issue_date: rec.issue_date,
      police_station: rec.police_station || '',
      buckle_no: rec.buckle_no || '',
      brought_by: rec.brought_by || '',
      examination_time: rec.examination_time || '',
      identification_marks: rec.identification_marks || '',
      injury_details: rec.injury_details || rec.diagnosis || '',
    });
  };

  const populateFromPatient = (pat: PatientRecord) => {
    setSelectedPatientId(pat.id);
    setFormData(prev => ({
      ...prev,
      uhid: pat.uhid || pat.id,
      patient_name: pat.name,
      age: pat.age ? String(pat.age) : '30',
      gender: pat.gender || 'Male',
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
      examination_time: new Date().toTimeString().slice(0, 5),
    });
    setNotification({ type: 'info', message: 'Ready to create new MLC certificate.' });
  };

  const handleSave = async () => {
    if (!formData.patient_name.trim()) {
      setNotification({ type: 'warning', message: 'Please enter patient name.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<CertificateRecord> = {
        cert_type: 'MLC',
        uhid: formData.uhid || 'UHID-1001',
        patient_name: formData.patient_name,
        age: formData.age,
        gender: formData.gender,
        doctor_name: formData.doctor_name,
        issue_date: formData.issue_date,
        police_station: formData.police_station,
        buckle_no: formData.buckle_no,
        brought_by: formData.brought_by,
        examination_time: formData.examination_time,
        identification_marks: formData.identification_marks,
        injury_details: formData.injury_details,
        is_active: true,
      };

      const result = await certificateApi.createCertificate(payload);
      setNotification({
        type: 'success',
        message: `MLC Certificate #${result.certificate_no} saved successfully!`,
      });

      const updated = await certificateApi.getCertificates({ cert_type: 'MLC' });
      setCertificates(updated);
      setCurrentIndex(updated.length - 1);
      populateFromRecord(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving MLC certificate.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const toPrint: CertificateRecord = {
      id: formData.id || 'NEW',
      cert_type: 'MLC',
      certificate_no: formData.certificate_no || 'MLC-2026-DRAFT',
      patient_id: formData.uhid,
      uhid: formData.uhid,
      patient_name: formData.patient_name || 'Patient',
      age: formData.age,
      gender: formData.gender,
      doctor_name: formData.doctor_name,
      issue_date: formData.issue_date,
      police_station: formData.police_station,
      buckle_no: formData.buckle_no,
      brought_by: formData.brought_by,
      examination_time: formData.examination_time,
      identification_marks: formData.identification_marks,
      injury_details: formData.injury_details,
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
        <h1 className={styles.pageTitle}>MEDICO-LEGAL EXAMINATION CERTIFICATE (MLC)</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className={styles.input}
            style={{ width: '260px' }}
            value={selectedPatientId}
            onChange={e => handlePatientSelect(e.target.value)}
          >
            <option value="">-- Autofill from Patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.uhid || p.id})</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.mainSection}>
          <div className={styles.row}>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>MLC Cert No:</label>
              <input type="text" className={styles.input} value={formData.certificate_no || 'Auto on Save'} readOnly />
            </div>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>Exam Date:</label>
              <input type="date" className={styles.input} value={formData.issue_date} onChange={e => setFormData({ ...formData, issue_date: e.target.value })} />
            </div>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>Exam Time:</label>
              <input type="time" className={styles.input} value={formData.examination_time} onChange={e => setFormData({ ...formData, examination_time: e.target.value })} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.fieldGroup} ${styles.flex2}`}>
              <label className={styles.label}>Patient Name *</label>
              <input type="text" className={styles.input} value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} />
            </div>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>UHID:</label>
              <input type="text" className={styles.input} value={formData.uhid} onChange={e => setFormData({ ...formData, uhid: e.target.value })} />
            </div>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>Age / Gender:</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="number" className={styles.input} value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} style={{ width: '60px' }} />
                <select className={styles.input} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>Police Station:</label>
              <input type="text" className={styles.input} value={formData.police_station} onChange={e => setFormData({ ...formData, police_station: e.target.value })} />
            </div>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>Buckle / Badge No:</label>
              <input type="text" className={styles.input} value={formData.buckle_no} onChange={e => setFormData({ ...formData, buckle_no: e.target.value })} />
            </div>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>Brought By:</label>
              <input type="text" className={styles.input} value={formData.brought_by} onChange={e => setFormData({ ...formData, brought_by: e.target.value })} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>Identification Marks:</label>
              <textarea className={styles.textarea} style={{ minHeight: '60px' }} value={formData.identification_marks} onChange={e => setFormData({ ...formData, identification_marks: e.target.value })} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>Details of Injuries / Trauma Findings *</label>
              <textarea className={styles.textarea} style={{ minHeight: '90px' }} value={formData.injury_details} onChange={e => setFormData({ ...formData, injury_details: e.target.value })} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.fieldGroup} ${styles.flex1}`}>
              <label className={styles.label}>Examining Medical Officer / Doctor *</label>
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
              <Printer size={16} /> Print MLC Certificate
            </button>
            <button className={styles.secondaryBtn} onClick={handleNew}>
              <Plus size={16} /> New MLC
            </button>
          </div>

          <div className={styles.rightActions}>
            <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save MLC Record'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MlcCertificate;
