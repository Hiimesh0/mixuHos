import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Printer, Save, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import styles from './PatientHistory.module.css';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { patientVisitsApi, type PatientVisitRecord } from '../../api/clinicalApi';
import { doctorApi, type DoctorRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface HistoryFormData {
  patient_name: string;
  uhid: string;
  age: string;
  doctor: string;
  visit_date: string;
  visit_type: string;
  bp_sys: string;
  bp_dia: string;
  pulse: string;
  temp: string;
  spo2: string;
  weight: string;
  chief_complaint: string;
  past_history: string;
  clinical_notes: string;
}

const defaultFormData: HistoryFormData = {
  patient_name: '',
  uhid: '',
  age: '35',
  doctor: 'Dr. Nilesh Mahale',
  visit_date: new Date().toISOString().split('T')[0],
  visit_type: 'Follow-up',
  bp_sys: '120',
  bp_dia: '80',
  pulse: '76',
  temp: '98.4',
  spo2: '99',
  weight: '68',
  chief_complaint: 'Routine follow up examination. Mild epigastric discomfort since 2 days.',
  past_history: 'Hypertension on Telmisartan 40mg OD. No history of DM / Asthma.',
  clinical_notes: 'Chest clear, S1 S2 heard. Abdomen soft, non-tender. Advised dietary modifications.',
};

const PatientHistory: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [patientVisits, setPatientVisits] = useState<PatientVisitRecord[]>([]);
  const [currentVisitIndex, setCurrentVisitIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<HistoryFormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [patList, docList] = await Promise.all([
        patientApi.getPatients(),
        doctorApi.getDoctors({ active_only: true }),
      ]);
      setPatients(patList);
      setDoctors(docList.doctors || []);
      if (patList.length > 0 && !selectedPatientId) {
        populateFromPatient(patList[0]);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load patient history.' });
    } finally {
      setLoading(false);
    }
  }, [selectedPatientId, setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const populateFromPatient = async (pat: PatientRecord) => {
    setSelectedPatientId(pat.id);
    const uhid = pat.uhid || pat.id;
    try {
      const visits = await patientVisitsApi.getVisits(uhid);
      setPatientVisits(visits);
      if (visits.length > 0) {
        const lastVisit = visits[visits.length - 1];
        setCurrentVisitIndex(visits.length - 1);
        setFormData({
          patient_name: pat.name,
          uhid: uhid,
          age: pat.age ? String(pat.age) : '35',
          doctor: lastVisit.doctor || 'Dr. Nilesh Mahale',
          visit_date: lastVisit.visit_date.slice(0, 10),
          visit_type: lastVisit.visit_type || 'Follow-up',
          bp_sys: lastVisit.vitals?.bp ? lastVisit.vitals.bp.split('/')[0] : '120',
          bp_dia: lastVisit.vitals?.bp ? lastVisit.vitals.bp.split('/')[1] : '80',
          pulse: lastVisit.vitals?.pulse || '76',
          temp: lastVisit.vitals?.temp || '98.4',
          spo2: lastVisit.vitals?.spo2 || '99',
          weight: lastVisit.vitals?.weight || '68',
          chief_complaint: lastVisit.chief_complaint || '',
          past_history: 'Known case under treatment.',
          clinical_notes: lastVisit.notes || '',
        });
      } else {
        setCurrentVisitIndex(-1);
        setFormData(prev => ({
          ...prev,
          patient_name: pat.name,
          uhid: uhid,
          age: pat.age ? String(pat.age) : '35',
          visit_date: new Date().toISOString().split('T')[0],
        }));
      }
    } catch {}
  };

  const handlePatientSelect = (patId: string) => {
    const found = patients.find(p => p.id === patId);
    if (found) populateFromPatient(found);
  };

  const handleNav = (target: number) => {
    if (patientVisits.length === 0) return;
    const bounded = Math.max(0, Math.min(target, patientVisits.length - 1));
    setCurrentVisitIndex(bounded);
    const v = patientVisits[bounded];
    setFormData(prev => ({
      ...prev,
      doctor: v.doctor || prev.doctor,
      visit_date: v.visit_date.slice(0, 10),
      visit_type: v.visit_type || 'Follow-up',
      bp_sys: v.vitals?.bp ? v.vitals.bp.split('/')[0] : '120',
      bp_dia: v.vitals?.bp ? v.vitals.bp.split('/')[1] : '80',
      pulse: v.vitals?.pulse || '76',
      temp: v.vitals?.temp || '98.4',
      spo2: v.vitals?.spo2 || '99',
      weight: v.vitals?.weight || '68',
      chief_complaint: v.chief_complaint || '',
      clinical_notes: v.notes || '',
    }));
  };

  const handleNewVisit = () => {
    setCurrentVisitIndex(-1);
    setFormData(prev => ({
      ...prev,
      visit_date: new Date().toISOString().split('T')[0],
      visit_type: 'Follow-up Visit',
      chief_complaint: '',
      clinical_notes: '',
    }));
    setNotification({ type: 'info', message: 'Ready to record new clinical visit.' });
  };

  const handleSaveVisit = async () => {
    if (!formData.patient_name.trim()) {
      setNotification({ type: 'warning', message: 'Please select a patient.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<PatientVisitRecord> = {
        patient_name: formData.patient_name,
        doctor: formData.doctor,
        visit_date: formData.visit_date,
        visit_type: formData.visit_type,
        chief_complaint: formData.chief_complaint,
        vitals: {
          bp: `${formData.bp_sys}/${formData.bp_dia}`,
          pulse: formData.pulse,
          temp: `${formData.temp} F`,
          spo2: `${formData.spo2}%`,
          weight: `${formData.weight} kg`,
        },
        notes: formData.clinical_notes,
      };

      const result = await patientVisitsApi.createVisit(formData.uhid || 'UHID-1001', payload);
      setNotification({
        type: 'success',
        message: `Clinical Visit #${result.visit_no} for ${formData.patient_name} recorded!`,
      });

      const updatedVisits = await patientVisitsApi.getVisits(formData.uhid);
      setPatientVisits(updatedVisits);
      setCurrentVisitIndex(updatedVisits.length - 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error recording visit.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print history.');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Clinical History - ${formData.patient_name}</title>
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
          <div class="title">PATIENT CLINICAL ENCOUNTER HISTORY</div>
          <div>Patient: <strong>${formData.patient_name}</strong> | UHID: <strong>${formData.uhid}</strong> | Date: <strong>${formData.visit_date}</strong></div>
        </div>
        <div class="grid">
          <div><strong>Consultant:</strong> ${formData.doctor}</div>
          <div><strong>Visit Type:</strong> ${formData.visit_type}</div>
          <div><strong>Age / Gender:</strong> ${formData.age} Yrs</div>
          <div><strong>Vitals:</strong> BP: ${formData.bp_sys}/${formData.bp_dia} mmHg | PR: ${formData.pulse} bpm | Temp: ${formData.temp} F | SpO2: ${formData.spo2}% | Wt: ${formData.weight} kg</div>
        </div>
        <div class="section">Chief Complaints & Present Illness</div>
        <div class="box">${formData.chief_complaint || '-'}</div>
        <div class="section">Past Medical & Surgical History</div>
        <div class="box">${formData.past_history || '-'}</div>
        <div class="section">Clinical Findings & Examination</div>
        <div class="box">${formData.clinical_notes || '-'}</div>
        <div style="margin-top: 40px; text-align: right; padding-right: 20px;">
          <div style="border-top: 1px dashed #94a3b8; width: 220px; display: inline-block; text-align: center; padding-top: 6px;">
            <strong>${formData.doctor}</strong><br>Consulting Physician
          </div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
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
        <h1 className={styles.pageTitle}>Patient Longitudinal Clinical History & Vitals</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className={styles.input}
            style={{ width: '280px' }}
            value={selectedPatientId}
            onChange={e => handlePatientSelect(e.target.value)}
          >
            <option value="">-- Select Patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.uhid || p.id})</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formContainer}>
        {/* Top Info Group */}
        <div className={styles.sectionGroup}>
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 3 }}>
              <label className={styles.label}>Patient Name</label>
              <input type="text" className={styles.input} value={formData.patient_name} readOnly />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
              <label className={styles.label}>UHID</label>
              <input type="text" className={styles.input} value={formData.uhid} readOnly />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Age</label>
              <input type="number" className={styles.input} value={formData.age} readOnly />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 2 }}>
              <label className={styles.label}>Doctor *</label>
              <select className={styles.input} value={formData.doctor} onChange={e => setFormData({ ...formData, doctor: e.target.value })}>
                {doctors.map(d => (
                  <option key={d.id} value={d.drName}>{d.drName}</option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
              <label className={styles.label}>Visit Date</label>
              <input type="date" className={styles.input} value={formData.visit_date} onChange={e => setFormData({ ...formData, visit_date: e.target.value })} />
            </div>
          </div>

          {/* Vitals */}
          <div className={styles.vitalsRow} style={{ marginTop: '12px' }}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>BP (Sys / Dia)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input type="text" className={styles.input} style={{ width: '60px' }} value={formData.bp_sys} onChange={e => setFormData({ ...formData, bp_sys: e.target.value })} />
                <span>/</span>
                <input type="text" className={styles.input} style={{ width: '60px' }} value={formData.bp_dia} onChange={e => setFormData({ ...formData, bp_dia: e.target.value })} />
                <span style={{ fontSize: '11px', color: '#64748b' }}>mmHg</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Pulse</label>
              <input type="text" className={styles.input} style={{ width: '80px' }} value={formData.pulse} onChange={e => setFormData({ ...formData, pulse: e.target.value })} />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Temp (F)</label>
              <input type="text" className={styles.input} style={{ width: '80px' }} value={formData.temp} onChange={e => setFormData({ ...formData, temp: e.target.value })} />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>SpO2 (%)</label>
              <input type="text" className={styles.input} style={{ width: '80px' }} value={formData.spo2} onChange={e => setFormData({ ...formData, spo2: e.target.value })} />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Weight (kg)</label>
              <input type="text" className={styles.input} style={{ width: '80px' }} value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Clinical History Details */}
        <div className={styles.sectionGroup}>
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Chief Complaint & History of Present Illness *</label>
              <textarea
                className={styles.textarea}
                style={{ minHeight: '80px' }}
                value={formData.chief_complaint}
                onChange={e => setFormData({ ...formData, chief_complaint: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Past Medical / Surgical History</label>
              <textarea
                className={styles.textarea}
                style={{ minHeight: '60px' }}
                value={formData.past_history}
                onChange={e => setFormData({ ...formData, past_history: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Clinical Findings & Physical Examination</label>
              <textarea
                className={styles.textarea}
                style={{ minHeight: '80px' }}
                value={formData.clinical_notes}
                onChange={e => setFormData({ ...formData, clinical_notes: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.navGroup}>
            <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Visit"><ChevronsLeft size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(currentVisitIndex - 1)} title="Previous Visit"><ChevronLeft size={18} /></button>
            <span style={{ fontSize: '13px', fontWeight: 600, padding: '0 8px' }}>
              {patientVisits.length > 0 ? `Visit ${currentVisitIndex + 1} of ${patientVisits.length}` : 'New Visit'}
            </span>
            <button className={styles.navBtn} onClick={() => handleNav(currentVisitIndex + 1)} title="Next Visit"><ChevronRight size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(patientVisits.length - 1)} title="Latest Visit"><ChevronsRight size={18} /></button>
          </div>

          <div className={styles.actionGroup}>
            <button className={styles.secondaryBtn} onClick={handleNewVisit}>
              <Plus size={16} /> New Visit
            </button>
            <button className={styles.secondaryBtn} onClick={handlePrint}>
              <Printer size={16} /> Print Clinical Encounter
            </button>
            <button className={styles.primaryBtn} onClick={handleSaveVisit} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save Visit & Vitals'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
