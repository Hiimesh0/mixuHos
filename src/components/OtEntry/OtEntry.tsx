import React, { useState, useEffect, useCallback } from 'react';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, Save, Printer, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import GlobalBottomActionBar from '../common/GlobalBottomActionBar';
import styles from './OtEntry.module.css';
import { otApi, admissionApi, type OtEntryRecord, type AdmissionRecord } from '../../api/hospitalApi';
import { doctorApi, type DoctorRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface OtFormData {
  id?: string;
  ot_no: string;
  uhid: string;
  ipd_no: string;
  patient_name: string;
  age: string;
  gender: string;
  lead_surgeon: string;
  assistant_surgeon: string;
  anesthetist: string;
  anesthesia_type: string;
  surgery_date: string;
  start_time: string;
  end_time: string;
  duration_hrs: string;
  operation_group: string;
  procedure_name: string;
  pre_op_diagnosis: string;
  post_op_diagnosis: string;
  surgical_note: string;
  charges: number;
}

const defaultFormData: OtFormData = {
  ot_no: '',
  uhid: '',
  ipd_no: '',
  patient_name: '',
  age: '35',
  gender: 'Male',
  lead_surgeon: 'Dr. Snehal Mahale',
  assistant_surgeon: 'Dr. Nilesh Mahale',
  anesthetist: 'Dr. R. K. Patel',
  anesthesia_type: 'General Anesthesia (GA)',
  surgery_date: new Date().toISOString().split('T')[0],
  start_time: '09:00',
  end_time: '10:30',
  duration_hrs: '1.5',
  operation_group: 'General Surgery',
  procedure_name: 'Laparoscopic Appendectomy',
  pre_op_diagnosis: 'Acute Appendicitis',
  post_op_diagnosis: 'Acute Phlegmonous Appendicitis',
  surgical_note: 'Standard 3-port laparoscopic technique. Mesoappendix coagulated and transected. Appendix base ligated with Endoloop and removed in endobag. Hemostasis secured.',
  charges: 25000,
};

const OtEntry: React.FC = () => {
  const [entries, setEntries] = useState<OtEntryRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>('');
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [formData, setFormData] = useState<OtFormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allEntries, adms, docs] = await Promise.all([
        otApi.getOtEntries(),
        admissionApi.getAdmissions(),
        doctorApi.getDoctors({ active_only: true }),
      ]);
      setEntries(allEntries);
      setAdmissions(adms);
      setDoctors(docs.doctors || []);

      if (allEntries.length > 0) {
        setCurrentIndex(allEntries.length - 1);
        populateFromRecord(allEntries[allEntries.length - 1]);
      } else if (adms.length > 0) {
        populateFromAdmission(adms[0]);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load OT records.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const populateFromRecord = (rec: OtEntryRecord) => {
    setFormData({
      id: rec.id,
      ot_no: rec.ot_no || '',
      uhid: rec.uhid,
      ipd_no: rec.ipd_no || '',
      patient_name: rec.patient_name,
      age: '35',
      gender: 'Male',
      lead_surgeon: rec.lead_surgeon,
      assistant_surgeon: rec.assistant_surgeon || '',
      anesthetist: rec.anesthetist || '',
      anesthesia_type: rec.anesthesia_type || 'General Anesthesia (GA)',
      surgery_date: rec.surgery_date,
      start_time: rec.start_time || '09:00',
      end_time: rec.end_time || '10:30',
      duration_hrs: '1.5',
      operation_group: rec.operation_group || 'General Surgery',
      procedure_name: rec.procedure_name,
      pre_op_diagnosis: rec.pre_op_diagnosis || '',
      post_op_diagnosis: rec.post_op_diagnosis || '',
      surgical_note: '',
      charges: rec.charges || 25000,
    });
  };

  const populateFromAdmission = (adm: AdmissionRecord) => {
    setSelectedAdmissionId(adm.id);
    setFormData(prev => ({
      ...prev,
      uhid: adm.uhid,
      ipd_no: adm.ipd_no,
      patient_name: adm.patient_name,
      age: adm.age || '35',
      gender: adm.gender || 'Male',
      lead_surgeon: adm.admitting_doctor || prev.lead_surgeon,
      pre_op_diagnosis: adm.provisional_diagnosis || prev.pre_op_diagnosis,
    }));
  };

  const handleAdmissionChange = (admId: string) => {
    const found = admissions.find(a => a.id === admId);
    if (found) populateFromAdmission(found);
  };

  const handleNav = (target: number) => {
    if (entries.length === 0) return;
    const bounded = Math.max(0, Math.min(target, entries.length - 1));
    setCurrentIndex(bounded);
    populateFromRecord(entries[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultFormData,
      surgery_date: new Date().toISOString().split('T')[0],
    });
    setNotification({ type: 'info', message: 'Ready for new OT surgery record.' });
  };

  const handleSave = async () => {
    if (!formData.procedure_name.trim()) {
      setNotification({ type: 'warning', message: 'Please enter procedure/surgery name.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<OtEntryRecord> = {
        uhid: formData.uhid || 'UHID-1001',
        ipd_no: formData.ipd_no,
        patient_name: formData.patient_name || 'Patient',
        surgery_date: formData.surgery_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        operation_group: formData.operation_group,
        procedure_name: formData.procedure_name,
        lead_surgeon: formData.lead_surgeon,
        assistant_surgeon: formData.assistant_surgeon,
        anesthetist: formData.anesthetist,
        anesthesia_type: formData.anesthesia_type,
        pre_op_diagnosis: formData.pre_op_diagnosis,
        post_op_diagnosis: formData.post_op_diagnosis,
        charges: Number(formData.charges),
      };

      const result = await otApi.createOtEntry(payload);
      setNotification({
        type: 'success',
        message: `OT Surgery record #${result.ot_no} logged successfully!`,
      });

      const updated = await otApi.getOtEntries();
      setEntries(updated);
      setCurrentIndex(updated.length - 1);
      populateFromRecord(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving OT record.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print OT report.');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OT Surgery Record - ${formData.ot_no || 'DRAFT'}</title>
        <style>
          body { font-family: sans-serif; padding: 24px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: bold; color: #1e3a8a; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; margin-bottom: 16px; }
          .section { font-weight: bold; font-size: 14px; color: #1e40af; border-bottom: 1px solid #cbd5e1; margin: 12px 0 6px 0; }
          .box { border: 1px solid #cbd5e1; padding: 8px 12px; background: #fff; margin-bottom: 12px; white-space: pre-wrap; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">OPERATION THEATRE SURGERY NOTE</div>
          <div>OT Log No: <strong>${formData.ot_no || 'DRAFT'}</strong> | Date: <strong>${formData.surgery_date}</strong></div>
        </div>
        <div class="grid">
          <div><strong>Patient:</strong> ${formData.patient_name} (${formData.uhid})</div>
          <div><strong>IPD No:</strong> ${formData.ipd_no || 'N/A'}</div>
          <div><strong>Surgeon:</strong> ${formData.lead_surgeon}</div>
          <div><strong>Assistant:</strong> ${formData.assistant_surgeon || 'None'}</div>
          <div><strong>Anesthetist:</strong> ${formData.anesthetist} (${formData.anesthesia_type})</div>
          <div><strong>Timing:</strong> ${formData.start_time} to ${formData.end_time}</div>
        </div>
        <div class="section">Pre-operative Diagnosis</div>
        <div class="box">${formData.pre_op_diagnosis || '-'}</div>
        <div class="section">Procedure Performed</div>
        <div class="box"><strong>${formData.procedure_name}</strong> (${formData.operation_group})</div>
        <div class="section">Post-operative Diagnosis</div>
        <div class="box">${formData.post_op_diagnosis || '-'}</div>
        <div class="section">Operative Findings & Technique</div>
        <div class="box">${formData.surgical_note || 'Standard aseptic operative protocol followed.'}</div>
        <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 10px;">
          <div style="border-top: 1px dashed #94a3b8; width: 200px; text-align: center;">Anesthetist Signature</div>
          <div style="border-top: 1px dashed #94a3b8; width: 200px; text-align: center;">Lead Surgeon Signature</div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`${styles.pageContainer} hasBottomActionBar`}>
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

      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Operation Theatre (OT) Surgery Register</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className={styles.select}
            style={{ width: '260px' }}
            value={selectedAdmissionId}
            onChange={e => handleAdmissionChange(e.target.value)}
          >
            <option value="">-- Choose Inpatient --</option>
            {admissions.map(a => (
              <option key={a.id} value={a.id}>{a.patient_name} ({a.ipd_no} | Bed {a.bed_number})</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.content}>
        {/* Section 1: Patient Identity */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Patient Identity</h2>
          <div className={`${styles.gridRow} ${styles.patientGrid}`}>
            <div className={`${styles.fieldGroup} ${styles.col2}`}>
              <label className={styles.label}>UHID</label>
              <input type="text" className={styles.input} value={formData.uhid} readOnly />
            </div>
            <div className={`${styles.fieldGroup} ${styles.col2}`}>
              <label className={styles.label}>Indoor No.</label>
              <input type="text" className={styles.input} value={formData.ipd_no} readOnly />
            </div>
            <div className={`${styles.fieldGroup} ${styles.col5}`}>
              <label className={styles.label}>Patient Name</label>
              <input type="text" className={styles.input} value={formData.patient_name} onChange={e => setFormData({ ...formData, patient_name: e.target.value })} />
            </div>
            <div className={`${styles.fieldGroup} ${styles.col3}`}>
              <label className={styles.label}>OT Entry No.</label>
              <input type="text" className={styles.input} value={formData.ot_no || 'Auto-generated on Save'} readOnly />
            </div>
          </div>
        </div>

        {/* Section 2: Surgical Team */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Surgical & Anesthesia Team</h2>
          <div className={`${styles.gridRow} ${styles.teamGrid}`}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Lead Surgeon *</label>
              <select className={styles.select} value={formData.lead_surgeon} onChange={e => setFormData({ ...formData, lead_surgeon: e.target.value })}>
                {doctors.map(d => (
                  <option key={d.id} value={d.drName}>{d.drName}</option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Assistant Surgeon</label>
              <input type="text" className={styles.input} value={formData.assistant_surgeon} onChange={e => setFormData({ ...formData, assistant_surgeon: e.target.value })} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Anesthetist Name</label>
              <input type="text" className={styles.input} value={formData.anesthetist} onChange={e => setFormData({ ...formData, anesthetist: e.target.value })} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Anesthesia Type</label>
              <select className={styles.select} value={formData.anesthesia_type} onChange={e => setFormData({ ...formData, anesthesia_type: e.target.value })}>
                <option value="General Anesthesia (GA)">General Anesthesia (GA)</option>
                <option value="Spinal Anesthesia (SA)">Spinal Anesthesia (SA)</option>
                <option value="Epidural Anesthesia">Epidural Anesthesia</option>
                <option value="Local Anesthesia (LA)">Local Anesthesia (LA)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Operation Timing & Charges */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Operation Timing & Charges</h2>
          <div className={`${styles.gridRow} ${styles.timeGrid}`}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date of Operation *</label>
              <input type="date" className={styles.input} value={formData.surgery_date} onChange={e => setFormData({ ...formData, surgery_date: e.target.value })} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Start Time</label>
              <input type="time" className={styles.input} value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>End Time</label>
              <input type="time" className={styles.input} value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>OT Charges (Rs.) *</label>
              <input type="number" min="0" step="500" className={styles.input} value={formData.charges} onChange={e => setFormData({ ...formData, charges: Number(e.target.value) })} />
            </div>
          </div>
        </div>

        {/* Section 4: Clinical & Operative Notes */}
        <div className={styles.section}>
          <h2 className={styles.sectionHeading}>Clinical & Operative Notes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Surgery / Procedure Name *</label>
              <input type="text" className={styles.input} value={formData.procedure_name} onChange={e => setFormData({ ...formData, procedure_name: e.target.value })} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Pre-operative Diagnosis</label>
              <input type="text" className={styles.input} value={formData.pre_op_diagnosis} onChange={e => setFormData({ ...formData, pre_op_diagnosis: e.target.value })} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Post-operative Diagnosis</label>
              <input type="text" className={styles.input} value={formData.post_op_diagnosis} onChange={e => setFormData({ ...formData, post_op_diagnosis: e.target.value })} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Surgical Notes & Operative Findings</label>
              <textarea className={styles.textarea} style={{ minHeight: '90px' }} value={formData.surgical_note} onChange={e => setFormData({ ...formData, surgical_note: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.navGroup}>
            <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Record"><ChevronFirst size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record"><ChevronLeft size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record"><ChevronRight size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(entries.length - 1)} title="Last Record"><ChevronLast size={18} /></button>
          </div>

          <div className={styles.actionGroup}>
            <button className={styles.secondaryBtn} onClick={handleNew}>
              <Plus size={16} /> New OT Entry
            </button>
            <button className={styles.secondaryBtn} onClick={handlePrint}>
              <Printer size={16} /> Print Surgery Note
            </button>
            <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save OT Record'}
            </button>
          </div>
        </div>
      </div>

      {/* Global Bottom Action Bar */}
      <GlobalBottomActionBar
        onSave={handleSave}
        saveLabel={loading ? 'Saving...' : 'Save OT Record'}
        isSaving={loading}
        isDirty={Boolean(formData.procedure_name || formData.lead_surgeon)}
        dirtyMessage="Unsaved OT Entry"
        onPrint={handlePrint}
        printLabel="Print Surgery Note"
        onCancel={handleNew}
        cancelLabel="New OT Entry"
        statusMessage={
          formData.ot_no
            ? `OT: ${formData.ot_no} | ${formData.patient_name} (${formData.uhid}) | ${formData.procedure_name}`
            : 'Operation Theatre Surgery Register'
        }
        extraActions={
          entries.length > 0 ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '6px' }}>
              <button type="button" className={styles.navBtn} onClick={() => handleNav(0)} title="First Record"><ChevronFirst size={16} /></button>
              <button type="button" className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record"><ChevronLeft size={16} /></button>
              <button type="button" className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record"><ChevronRight size={16} /></button>
              <button type="button" className={styles.navBtn} onClick={() => handleNav(entries.length - 1)} title="Last Record"><ChevronLast size={16} /></button>
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default OtEntry;
