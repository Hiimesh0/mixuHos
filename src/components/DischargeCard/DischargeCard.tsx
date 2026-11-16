import React, { useState, useEffect, useCallback } from 'react';
import { Save, Printer, RefreshCw, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';
import styles from './DischargeCard.module.css';
import { admissionApi, dischargeApi, type AdmissionRecord, type DischargeRecord } from '../../api/hospitalApi';
import { openDischargePrint } from '../../utils/universalPrintGenerator';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface DischargeFormData {
  id?: string;
  discharge_no: string;
  admission_id: string;
  ipd_no: string;
  uhid: string;
  patient_name: string;
  age: string;
  gender: string;
  bed_number: string;
  ward: string;
  admission_date: string;
  discharge_date: string;
  discharge_time: string;
  final_diagnosis: string;
  condition_on_discharge: 'Recovered' | 'Improved' | 'LAMA' | 'Referred' | 'Deceased';
  treatment_summary: string;
  investigation_summary: string;
  operative_notes: string;
  discharge_medications: string;
  follow_up_instructions: string;
  follow_up_date: string;
  discharging_doctor_name: string;
}

const defaultFormData: DischargeFormData = {
  discharge_no: '',
  admission_id: '',
  ipd_no: '',
  uhid: '',
  patient_name: '',
  age: '35',
  gender: 'Male',
  bed_number: '',
  ward: '',
  admission_date: '',
  discharge_date: new Date().toISOString().split('T')[0],
  discharge_time: new Date().toTimeString().slice(0, 5),
  final_diagnosis: '',
  condition_on_discharge: 'Improved',
  treatment_summary: 'Inpatient medical management administered with vital stability and clinical improvement.',
  investigation_summary: 'Routine lab tests performed. Complete Blood Count and Biochemical parameters within acceptable limits.',
  operative_notes: '',
  discharge_medications: '1. Tab. Paracetamol 650mg SOS\n2. Tab. Pantoprazole 40mg 1 tab OD (before breakfast) x 7 days\n3. Cap. Amoxicillin-Clav 625mg 1 tab BD x 5 days',
  follow_up_instructions: 'Take light, easily digestible diet. Avoid heavy lifting. Review in OPD after 7 days.',
  follow_up_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  discharging_doctor_name: 'Dr. Nilesh Mahale',
};

const DischargeCard: React.FC = () => {
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [discharges, setDischarges] = useState<DischargeRecord[]>([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>('');
  const [formData, setFormData] = useState<DischargeFormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allAdmissions, allDischarges] = await Promise.all([
        admissionApi.getAdmissions(),
        dischargeApi.getDischarges(),
      ]);

      const activeAdmitted = allAdmissions.filter(a => a.status === 'Admitted');
      setAdmissions(activeAdmitted);
      setDischarges(allDischarges);

      if (activeAdmitted.length > 0) {
        populateFromAdmission(activeAdmitted[0]);
      } else if (allDischarges.length > 0) {
        populateFromDischarge(allDischarges[allDischarges.length - 1]);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load inpatient records.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const populateFromAdmission = (adm: AdmissionRecord) => {
    setSelectedAdmissionId(adm.id);
    setFormData(prev => ({
      ...prev,
      id: undefined,
      discharge_no: '',
      admission_id: adm.id,
      ipd_no: adm.ipd_no,
      uhid: adm.uhid,
      patient_name: adm.patient_name,
      age: adm.age || '35',
      gender: adm.gender || 'Male',
      bed_number: adm.bed_number,
      ward: adm.ward_name,
      admission_date: adm.admission_date,
      discharging_doctor_name: adm.admitting_doctor || prev.discharging_doctor_name,
      final_diagnosis: adm.provisional_diagnosis || prev.final_diagnosis,
    }));
  };

  const populateFromDischarge = (dis: DischargeRecord) => {
    setFormData({
      id: dis.id,
      discharge_no: dis.discharge_no,
      admission_id: dis.admission_id,
      ipd_no: dis.ipd_no,
      uhid: dis.uhid,
      patient_name: dis.patient_name,
      age: dis.age || '35',
      gender: dis.gender || 'Male',
      bed_number: dis.bed_number || '',
      ward: '',
      admission_date: dis.admission_date || '',
      discharge_date: dis.discharge_date,
      discharge_time: dis.discharge_time,
      final_diagnosis: dis.final_diagnosis,
      condition_on_discharge: dis.condition_on_discharge,
      treatment_summary: dis.treatment_summary || '',
      investigation_summary: dis.investigation_summary || '',
      operative_notes: dis.operative_notes || '',
      discharge_medications: dis.discharge_medications || '',
      follow_up_instructions: dis.follow_up_instructions || '',
      follow_up_date: dis.follow_up_date || '',
      discharging_doctor_name: dis.discharging_doctor_name,
    });
  };

  const handleAdmissionSelect = (admId: string) => {
    const found = admissions.find(a => a.id === admId);
    if (found) populateFromAdmission(found);
  };

  const handleSaveDischarge = async () => {
    if (!formData.ipd_no || !formData.patient_name) {
      setNotification({ type: 'warning', message: 'Please select an admitted patient to discharge.' });
      return;
    }
    if (!formData.final_diagnosis) {
      setNotification({ type: 'warning', message: 'Please enter final clinical diagnosis.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<DischargeRecord> = {
        admission_id: formData.admission_id,
        ipd_no: formData.ipd_no,
        uhid: formData.uhid,
        patient_name: formData.patient_name,
        age: formData.age,
        gender: formData.gender,
        bed_number: formData.bed_number,
        admission_date: formData.admission_date,
        discharge_date: formData.discharge_date,
        discharge_time: formData.discharge_time,
        final_diagnosis: formData.final_diagnosis,
        condition_on_discharge: formData.condition_on_discharge,
        treatment_summary: formData.treatment_summary,
        investigation_summary: formData.investigation_summary,
        operative_notes: formData.operative_notes,
        discharge_medications: formData.discharge_medications,
        follow_up_instructions: formData.follow_up_instructions,
        follow_up_date: formData.follow_up_date,
        discharging_doctor_name: formData.discharging_doctor_name,
      };

      const result = await dischargeApi.processDischarge(payload);
      setNotification({
        type: 'success',
        message: `Discharge summary #${result.discharge_no} processed. Bed ${result.bed_number || ''} vacated!`,
      });

      // Reload
      await loadData();
      populateFromDischarge(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error processing discharge.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const recordToPrint: DischargeRecord = {
      id: formData.id || 'DIS-DRAFT',
      discharge_no: formData.discharge_no || 'DIS-2026-DRAFT',
      admission_id: formData.admission_id,
      ipd_no: formData.ipd_no,
      patient_id: formData.uhid,
      uhid: formData.uhid,
      patient_name: formData.patient_name,
      age: formData.age,
      gender: formData.gender,
      bed_number: formData.bed_number,
      admission_date: formData.admission_date,
      discharge_date: formData.discharge_date,
      discharge_time: formData.discharge_time,
      final_diagnosis: formData.final_diagnosis,
      condition_on_discharge: formData.condition_on_discharge,
      treatment_summary: formData.treatment_summary,
      investigation_summary: formData.investigation_summary,
      operative_notes: formData.operative_notes,
      discharge_medications: formData.discharge_medications,
      follow_up_instructions: formData.follow_up_instructions,
      follow_up_date: formData.follow_up_date,
      discharging_doctor_name: formData.discharging_doctor_name,
    };
    openDischargePrint(recordToPrint);
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

      {/* Top Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.topHeader}>
          <div className={styles.fieldGroup}>
            <span className={styles.headerInfoText}>Active Inpatients:</span>
            <span style={{ fontWeight: 700, color: '#2563eb' }}>{admissions.length} Admitted</span>
          </div>
          <h1 className={styles.pageTitle}>Discharge Card & Summary</h1>
          <div className={styles.fieldGroup}>
            <span className={styles.headerInfoText}>Doctor:</span>
            <span className={styles.headerInfoText} style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formData.discharging_doctor_name}</span>
          </div>
        </div>

        {/* Patient Select Grid */}
        <div className={styles.infoGrid} style={{ marginTop: '12px' }}>
          <div className={`${styles.fieldGroup} ${styles.col4}`}>
            <label className={styles.label}>Select Admitted Patient *</label>
            <select
              className={styles.input}
              value={selectedAdmissionId}
              onChange={e => handleAdmissionSelect(e.target.value)}
            >
              <option value="">-- Choose Admitted Patient --</option>
              {admissions.map(a => (
                <option key={a.id} value={a.id}>
                  {a.patient_name} ({a.ipd_no} | Bed {a.bed_number} - {a.ward_name})
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>IPD No / Bed:</label>
            <input type="text" className={`${styles.input} ${styles.inputReadOnly}`} value={`${formData.ipd_no} (Bed ${formData.bed_number})`} readOnly />
          </div>

          <div className={`${styles.fieldGroup} ${styles.col5}`}>
            <label className={styles.label}>Patient Identity:</label>
            <div className={styles.patientNameBadge}>
              <UserCheck size={16} /> {formData.patient_name || '--'} ({formData.uhid || '--'})
            </div>
          </div>
        </div>

        {/* Dates Grid */}
        <div className={styles.infoGrid} style={{ marginBottom: 0 }}>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Admission Date:</label>
            <input type="text" className={`${styles.input} ${styles.inputReadOnly}`} value={formData.admission_date || 'N/A'} readOnly />
          </div>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Discharge Date *</label>
            <input
              type="date"
              className={styles.input}
              value={formData.discharge_date}
              onChange={e => setFormData({ ...formData, discharge_date: e.target.value })}
            />
          </div>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Discharge Time</label>
            <input
              type="time"
              className={styles.input}
              value={formData.discharge_time}
              onChange={e => setFormData({ ...formData, discharge_time: e.target.value })}
            />
          </div>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Condition on Discharge *</label>
            <select
              className={styles.input}
              value={formData.condition_on_discharge}
              onChange={e => setFormData({ ...formData, condition_on_discharge: e.target.value as any })}
            >
              <option value="Recovered">Recovered</option>
              <option value="Improved">Improved</option>
              <option value="LAMA">LAMA (Left Against Medical Advice)</option>
              <option value="Referred">Referred to Higher Center</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Clinical Content (Two Columns) */}
      <div className={styles.clinicalGrid}>
        {/* Left Column */}
        <div className={styles.clinicalSection}>
          <div className={styles.clinicalField}>
            <label className={styles.clinicalLabel}>Final Clinical Diagnosis *</label>
            <textarea
              className={styles.textarea}
              style={{ minHeight: '90px' }}
              value={formData.final_diagnosis}
              onChange={e => setFormData({ ...formData, final_diagnosis: e.target.value })}
              placeholder="e.g. Acute Calculous Cholecystitis - Laparoscopic Cholecystectomy performed"
            />
          </div>

          <div className={styles.clinicalField}>
            <label className={styles.clinicalLabel}>Treatment Given & Hospital Course</label>
            <textarea
              className={styles.textarea}
              style={{ minHeight: '120px' }}
              value={formData.treatment_summary}
              onChange={e => setFormData({ ...formData, treatment_summary: e.target.value })}
            />
          </div>

          <div className={styles.clinicalField}>
            <label className={styles.clinicalLabel}>Investigation Highlights & Pathology</label>
            <textarea
              className={styles.textarea}
              style={{ minHeight: '90px' }}
              value={formData.investigation_summary}
              onChange={e => setFormData({ ...formData, investigation_summary: e.target.value })}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.clinicalSection}>
          <div className={styles.clinicalField}>
            <label className={styles.clinicalLabel}>Surgical / Operative Notes (if any)</label>
            <textarea
              className={styles.textarea}
              style={{ minHeight: '90px' }}
              value={formData.operative_notes}
              onChange={e => setFormData({ ...formData, operative_notes: e.target.value })}
              placeholder="Procedure details, findings, implants used..."
            />
          </div>

          <div className={styles.clinicalField}>
            <label className={styles.clinicalLabel}>Discharge Medications (Rx)</label>
            <textarea
              className={styles.textarea}
              style={{ minHeight: '120px' }}
              value={formData.discharge_medications}
              onChange={e => setFormData({ ...formData, discharge_medications: e.target.value })}
            />
          </div>

          <div className={styles.clinicalField}>
            <label className={styles.clinicalLabel}>Follow-up Instructions & SOS Signs</label>
            <textarea
              className={styles.textarea}
              style={{ minHeight: '90px' }}
              value={formData.follow_up_instructions}
              onChange={e => setFormData({ ...formData, follow_up_instructions: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionGroup}>
          <button className={styles.secondaryBtn} onClick={handlePrint}>
            <Printer size={16} /> Print Discharge Card
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button
            className={styles.primaryBtn}
            onClick={handleSaveDischarge}
            disabled={loading}
            style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
          >
            <Save size={18} /> {loading ? 'Processing...' : 'Complete & Process Discharge'}
          </button>
          <button className={styles.secondaryBtn} onClick={loadData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default DischargeCard;
