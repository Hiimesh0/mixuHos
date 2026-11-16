import React, { useState, useEffect, useCallback } from 'react';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, Save, Trash2, Printer, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './IndoorRegister.module.css';
import { admissionApi, bedApi, type AdmissionRecord, type BedRecord } from '../../api/hospitalApi';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { doctorApi, type DoctorRecord } from '../../api/masterApi';
import { openAdmissionPrint } from '../../utils/universalPrintGenerator';
import { openPatientStickerPdf } from '../../utils/patientStickerGenerator';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface AdmissionFormData {
  id?: string;
  prefix: string;
  ipd_no: string;
  bed_number: string;
  ward_name: string;
  room_type: string;
  room_charge: number;
  admission_date: string;
  admission_time: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  patient_name: string;
  uhid: string;
  age: string;
  gender: string;
  address: string;
  mobile: string;
  admitting_doctor: string;
  reference_doctor: string;
  insurance_company: string;
  policy_no: string;
  is_mlc: boolean;
  mlc_no: string;
  police_station: string;
  police_name: string;
  belt_no: string;
  diagnosis: string;
  initial_deposit: number;
  remarks: string;
  status: 'Admitted' | 'Discharged' | 'Transferred';
}

const defaultFormData: AdmissionFormData = {
  prefix: 'GEN',
  ipd_no: '',
  bed_number: '',
  ward_name: 'General Ward',
  room_type: 'General Ward (Male)',
  room_charge: 1000,
  admission_date: new Date().toISOString().split('T')[0],
  admission_time: new Date().toTimeString().slice(0, 5),
  first_name: '',
  middle_name: '',
  last_name: '',
  patient_name: '',
  uhid: '',
  age: '35',
  gender: 'Male',
  address: '',
  mobile: '',
  admitting_doctor: 'Dr. Nilesh Mahale',
  reference_doctor: 'Self',
  insurance_company: 'None / Cash',
  policy_no: '',
  is_mlc: false,
  mlc_no: '',
  police_station: '',
  police_name: '',
  belt_no: '',
  diagnosis: '',
  initial_deposit: 5000,
  remarks: '',
  status: 'Admitted',
};

const IndoorRegister: React.FC = () => {
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [beds, setBeds] = useState<BedRecord[]>([]);
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [formData, setFormData] = useState<AdmissionFormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [patientSearch, setPatientSearch] = useState<string>('');
  const [showPatientDropdown, setShowPatientDropdown] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [adms, bds, docs, pats] = await Promise.all([
        admissionApi.getAdmissions(),
        bedApi.getBeds(),
        doctorApi.getDoctors({ active_only: true }),
        patientApi.getPatients(),
      ]);

      setAdmissions(adms);
      setBeds(bds);
      setDoctors(docs.doctors || []);
      const patList = Array.isArray(pats) ? pats : ((pats as any)?.patients || []);
      setPatients(patList);

      if (adms.length > 0) {
        setCurrentIndex(adms.length - 1);
        populateFromRecord(adms[adms.length - 1]);
      } else {
        setFormData({ ...defaultFormData });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load indoor admission data.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const populateFromRecord = (rec: AdmissionRecord) => {
    const parts = (rec.patient_name || '').split(' ');
    setFormData({
      id: rec.id,
      prefix: 'GEN',
      ipd_no: rec.ipd_no || '',
      bed_number: rec.bed_number || '',
      ward_name: rec.ward_name || 'General Ward',
      room_type: rec.room_type || 'General Ward (Male)',
      room_charge: rec.daily_bed_charge || 1000,
      admission_date: rec.admission_date || new Date().toISOString().split('T')[0],
      admission_time: rec.admission_time || '10:00',
      first_name: parts[0] || '',
      middle_name: parts.length > 2 ? parts[1] : '',
      last_name: parts.length > 2 ? parts.slice(2).join(' ') : parts[1] || '',
      patient_name: rec.patient_name || '',
      uhid: rec.uhid || '',
      age: rec.age || '35',
      gender: rec.gender || 'Male',
      address: '',
      mobile: rec.mobile || '',
      admitting_doctor: rec.admitting_doctor || 'Dr. Nilesh Mahale',
      reference_doctor: rec.reference_doctor || 'Self',
      insurance_company: rec.insurance_company || 'None / Cash',
      policy_no: '',
      is_mlc: false,
      mlc_no: '',
      police_station: '',
      police_name: '',
      belt_no: '',
      diagnosis: rec.provisional_diagnosis || '',
      initial_deposit: rec.initial_deposit || 0,
      remarks: '',
      status: rec.status || 'Admitted',
    });
  };

  const handleNav = (targetIndex: number) => {
    if (admissions.length === 0) return;
    const bounded = Math.max(0, Math.min(targetIndex, admissions.length - 1));
    setCurrentIndex(bounded);
    populateFromRecord(admissions[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultFormData,
      admission_date: new Date().toISOString().split('T')[0],
      admission_time: new Date().toTimeString().slice(0, 5),
    });
    setNotification({ type: 'info', message: 'Ready to enter new indoor admission.' });
  };

  const handleSelectPatient = (pat: PatientRecord) => {
    const parts = (pat.name || '').split(' ');
    setFormData(prev => ({
      ...prev,
      uhid: pat.uhid || pat.id,
      patient_name: pat.name,
      first_name: parts[0] || '',
      middle_name: parts.length > 2 ? parts[1] : '',
      last_name: parts.length > 2 ? parts.slice(2).join(' ') : parts[1] || '',
      age: pat.age ? String(pat.age) : '35',
      gender: pat.gender || 'Male',
      mobile: pat.mobile || '',
      address: pat.address || '',
      reference_doctor: pat.ref_by || prev.reference_doctor,
    }));
    setShowPatientDropdown(false);
  };

  const handleBedSelect = (bedNum: string) => {
    const selectedBed = beds.find(b => b.bed_number === bedNum);
    setFormData(prev => ({
      ...prev,
      bed_number: bedNum,
      ward_name: selectedBed?.ward_name || prev.ward_name,
      room_charge: selectedBed?.daily_rate || prev.room_charge,
    }));
  };

  const handleSave = async () => {
    if (!formData.bed_number) {
      setNotification({ type: 'warning', message: 'Please select a Bed Number.' });
      return;
    }
    const fullName = [formData.first_name, formData.middle_name, formData.last_name].filter(Boolean).join(' ') || formData.patient_name;
    if (!fullName) {
      setNotification({ type: 'warning', message: 'Please enter patient name.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<AdmissionRecord> = {
        uhid: formData.uhid || `UHID-${Math.floor(1000 + Math.random() * 9000)}`,
        patient_name: fullName,
        age: formData.age,
        gender: formData.gender,
        mobile: formData.mobile,
        admission_date: formData.admission_date,
        admission_time: formData.admission_time,
        bed_number: formData.bed_number,
        ward_name: formData.ward_name,
        room_type: formData.room_type,
        daily_bed_charge: Number(formData.room_charge),
        admitting_doctor: formData.admitting_doctor,
        reference_doctor: formData.reference_doctor,
        insurance_company: formData.insurance_company,
        provisional_diagnosis: formData.diagnosis,
        initial_deposit: Number(formData.initial_deposit),
        status: 'Admitted',
      };

      const result = await admissionApi.admitPatient(payload);
      setNotification({
        type: 'success',
        message: `Patient admitted successfully with IPD #${result.ipd_no} into Bed ${result.bed_number}!`,
      });

      // Reload data
      const updatedAdmissions = await admissionApi.getAdmissions();
      const updatedBeds = await bedApi.getBeds();
      setAdmissions(updatedAdmissions);
      setBeds(updatedBeds);
      setCurrentIndex(updatedAdmissions.length - 1);
      populateFromRecord(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error admitting patient.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintAdmission = () => {
    if (currentIndex >= 0 && admissions[currentIndex]) {
      openAdmissionPrint(admissions[currentIndex]);
    } else {
      const currentDraft: AdmissionRecord = {
        id: formData.id || 'NEW',
        ipd_no: formData.ipd_no || 'IPD-DRAFT',
        patient_id: formData.uhid || 'UHID-0000',
        uhid: formData.uhid || 'UHID-0000',
        patient_name: [formData.first_name, formData.middle_name, formData.last_name].filter(Boolean).join(' ') || formData.patient_name || 'Patient',
        age: formData.age,
        gender: formData.gender,
        mobile: formData.mobile,
        admission_date: formData.admission_date,
        admission_time: formData.admission_time,
        bed_number: formData.bed_number,
        ward_name: formData.ward_name,
        room_type: formData.room_type,
        daily_bed_charge: formData.room_charge,
        admitting_doctor: formData.admitting_doctor,
        reference_doctor: formData.reference_doctor,
        insurance_company: formData.insurance_company,
        provisional_diagnosis: formData.diagnosis,
        initial_deposit: formData.initial_deposit,
        status: formData.status,
      };
      openAdmissionPrint(currentDraft);
    }
  };

  const handlePrintSticker = () => {
    const name = [formData.first_name, formData.middle_name, formData.last_name].filter(Boolean).join(' ') || formData.patient_name || 'Patient';
    openPatientStickerPdf({
      uhid: formData.uhid || 'UHID-1001',
      name: name,
      age: Number(formData.age) || 35,
      gender: (formData.gender as 'Male' | 'Female' | 'Other') || 'Male',
      dr_incharge: formData.admitting_doctor,
      mobile: formData.mobile,
      reg_date: formData.admission_date,
    });
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
            backgroundColor: notification.type === 'success' ? '#ecfdf5' : notification.type === 'error' ? '#fef2f2' : '#eff6ff',
            border: `1px solid ${notification.type === 'success' ? '#6ee7b7' : notification.type === 'error' ? '#fca5a5' : '#bfdbfe'}`,
            color: notification.type === 'success' ? '#065f46' : notification.type === 'error' ? '#991b1b' : '#1e40af',
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
        <div className={styles.headerLeft}>
          <span className={styles.recordCount}>
            {admissions.length > 0 ? `${currentIndex + 1} of ${admissions.length}` : '0 of 0'}
          </span>
          <span className={styles.userBadge}>{formData.status}</span>
        </div>

        <h1 className={styles.pageTitle}>Indoor Patient Register</h1>

        <div className={styles.headerRight}>
          <div className={styles.headerField}>
            <label className={styles.label}>Prefix:</label>
            <select
              className={styles.select}
              value={formData.prefix}
              onChange={e => setFormData({ ...formData, prefix: e.target.value })}
            >
              <option value="GEN">GEN</option>
              <option value="EMG">EMG</option>
            </select>
          </div>
          <div className={styles.headerField}>
            <label className={styles.label}>IPD No:</label>
            <input
              type="text"
              className={styles.input}
              value={formData.ipd_no}
              placeholder="Auto on save"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Section 1: Admission Details */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Admission Details</h2>
          <div className={`${styles.grid} ${styles.grid12}`}>
            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>Bed Number *</label>
              <div className={styles.inputWithAction}>
                <select
                  className={styles.select}
                  value={formData.bed_number}
                  onChange={e => handleBedSelect(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">-- Select Bed --</option>
                  {beds.map(b => (
                    <option
                      key={b.id}
                      value={b.bed_number}
                      disabled={b.status === 'Occupied' && b.bed_number !== formData.bed_number}
                    >
                      Bed {b.bed_number} ({b.ward_name} - {b.status}) - Rs.{b.daily_rate}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>Room Charge (Rs./day)</label>
              <input
                type="number"
                className={styles.input}
                value={formData.room_charge}
                onChange={e => setFormData({ ...formData, room_charge: Number(e.target.value) })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col2}`}>
              <label className={styles.label}>DOA</label>
              <input
                type="date"
                className={styles.input}
                value={formData.admission_date}
                onChange={e => setFormData({ ...formData, admission_date: e.target.value })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col2}`}>
              <label className={styles.label}>Time</label>
              <input
                type="time"
                className={styles.input}
                value={formData.admission_time}
                onChange={e => setFormData({ ...formData, admission_time: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Patient Identity & Search */}
        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className={styles.sectionTitle}>Patient Identity</h2>
            <div style={{ position: 'relative', width: '300px' }}>
              <input
                type="text"
                placeholder="Search registered patient..."
                className={styles.input}
                value={patientSearch}
                onChange={e => {
                  setPatientSearch(e.target.value);
                  setShowPatientDropdown(true);
                }}
                onFocus={() => setShowPatientDropdown(true)}
              />
              {showPatientDropdown && patientSearch && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    backgroundColor: '#fff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    maxHeight: '180px',
                    overflowY: 'auto',
                  }}
                >
                  {patients
                    .filter(p =>
                      (p.name || '').toLowerCase().includes(patientSearch.toLowerCase()) ||
                      (p.uhid || '').toLowerCase().includes(patientSearch.toLowerCase())
                    )
                    .slice(0, 8)
                    .map(p => (
                      <div
                        key={p.uhid || p.id}
                        onClick={() => {
                          handleSelectPatient(p);
                          setPatientSearch('');
                        }}
                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}
                      >
                        <strong>{p.name || [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ')}</strong> ({p.uhid}) - {p.sex || (p as any).gender || '--'}, {p.age} Yrs
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className={`${styles.grid} ${styles.grid12}`}>
            <div className={`${styles.fieldGroup} ${styles.col3}`}>
              <label className={styles.label}>First Name *</label>
              <input
                type="text"
                className={styles.input}
                value={formData.first_name}
                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col3}`}>
              <label className={styles.label}>Middle Name</label>
              <input
                type="text"
                className={styles.input}
                value={formData.middle_name}
                onChange={e => setFormData({ ...formData, middle_name: e.target.value })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col3}`}>
              <label className={styles.label}>Last Name</label>
              <input
                type="text"
                className={styles.input}
                value={formData.last_name}
                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col3}`}>
              <label className={styles.label}>UHID</label>
              <input
                type="text"
                className={styles.input}
                value={formData.uhid}
                placeholder="Auto-generated if empty"
                onChange={e => setFormData({ ...formData, uhid: e.target.value })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col2}`}>
              <label className={styles.label}>Age</label>
              <input
                type="number"
                min="0"
                max="120"
                className={styles.input}
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col2}`}>
              <label className={styles.label}>Sex</label>
              <select
                className={styles.select}
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>Mobile</label>
              <input
                type="tel"
                className={styles.input}
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>Initial Advance Deposit (Rs.)</label>
              <input
                type="number"
                className={styles.input}
                value={formData.initial_deposit}
                onChange={e => setFormData({ ...formData, initial_deposit: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Care, Doctor & Diagnosis */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Consultant & Clinical Information</h2>
          <div className={`${styles.grid} ${styles.grid12}`}>
            <div className={`${styles.fieldGroup} ${styles.col6}`}>
              <label className={styles.label}>Under Care Doctor (Admitting Consultant) *</label>
              <select
                className={styles.select}
                value={formData.admitting_doctor}
                onChange={e => setFormData({ ...formData, admitting_doctor: e.target.value })}
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.drName}>{d.drName} ({d.speciality || d.department || 'Consultant'})</option>
                ))}
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.col6}`}>
              <label className={styles.label}>Reference Doctor / Source</label>
              <input
                type="text"
                className={styles.input}
                value={formData.reference_doctor}
                onChange={e => setFormData({ ...formData, reference_doctor: e.target.value })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col6}`}>
              <label className={styles.label}>Cashless / Insurance Company</label>
              <input
                type="text"
                className={styles.input}
                value={formData.insurance_company}
                onChange={e => setFormData({ ...formData, insurance_company: e.target.value })}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col6}`}>
              <label className={styles.label}>Provisional Diagnosis on Admission</label>
              <input
                type="text"
                className={styles.input}
                value={formData.diagnosis}
                placeholder="e.g. Acute Appendicitis / Dengue with Thrombocytopenia"
                onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.navGroup}>
            <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Record">
              <ChevronFirst size={18} />
            </button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record">
              <ChevronLeft size={18} />
            </button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record">
              <ChevronRight size={18} />
            </button>
            <button className={styles.navBtn} onClick={() => handleNav(admissions.length - 1)} title="Last Record">
              <ChevronLast size={18} />
            </button>
          </div>

          <div className={styles.utilsGroup}>
            <button className={styles.secondaryBtn} onClick={handlePrintAdmission}>
              <Printer size={16} /> Print Admission
            </button>
            <button className={styles.secondaryBtn} onClick={handlePrintSticker}>
              <FileText size={16} /> Sticker
            </button>
            <button className={styles.secondaryBtn} onClick={handleNew}>
              + New Admission
            </button>
          </div>

          <div className={styles.actionGroup}>
            <button className={styles.primaryBtn} onClick={handleSave} disabled={loading}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save Admission'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndoorRegister;
