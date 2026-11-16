import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Trash2, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './DrVisitProcedure.module.css';
import { drVisitProcedureApi, admissionApi, type DrVisitProcedureRecord, type AdmissionRecord } from '../../api/hospitalApi';
import { doctorApi, type DoctorRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

const DrVisitProcedure: React.FC = () => {
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>('');
  const [entries, setEntries] = useState<DrVisitProcedureRecord[]>([]);
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true);

  // Form states
  const [entryType, setEntryType] = useState<'Doctor Visit' | 'Procedure' | 'Nursing'>('Doctor Visit');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState<string>('Dr. Nilesh Mahale');
  const [description, setDescription] = useState<string>('Daily Consultant Round & Patient Review');
  const [rate, setRate] = useState<number>(750);
  const [qty, setQty] = useState<number>(1);
  const [remark, setRemark] = useState<string>('General status stable. Vital monitoring continue.');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string>('');

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [adms, allEntries, docs] = await Promise.all([
        admissionApi.getAdmissions(),
        drVisitProcedureApi.getDrVisitProcedures(),
        doctorApi.getDoctors({ active_only: true }),
      ]);
      setAdmissions(adms);
      setEntries(allEntries);
      setDoctors(docs.doctors || []);

      if (adms.length > 0 && !selectedAdmissionId) {
        setSelectedAdmissionId(adms[adms.length - 1].id);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load visits & procedures.' });
    } finally {
      setLoading(false);
    }
  }, [selectedAdmissionId, setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedAdmission = useMemo(() => {
    return admissions.find(a => a.id === selectedAdmissionId);
  }, [admissions, selectedAdmissionId]);

  const filteredEntries = useMemo(() => {
    if (!selectedAdmission) return entries;
    return entries.filter(e => (e.uhid || '').toLowerCase() === (selectedAdmission.uhid || '').toLowerCase());
  }, [entries, selectedAdmission]);

  const totalCharges = useMemo(() => {
    return filteredEntries.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [filteredEntries]);

  const handleSaveEntry = async () => {
    if (!selectedAdmission) {
      setNotification({ type: 'warning', message: 'Please select an inpatient.' });
      return;
    }
    if (!description.trim()) {
      setNotification({ type: 'warning', message: 'Please enter a description.' });
      return;
    }

    try {
      setLoading(true);
      const amount = Number(rate) * Number(qty);
      const payload: Partial<DrVisitProcedureRecord> = {
        admission_id: selectedAdmission.id,
        ipd_no: selectedAdmission.ipd_no,
        uhid: selectedAdmission.uhid,
        patient_name: selectedAdmission.patient_name,
        entry_date: entryDate,
        entry_type: entryType,
        doctor_name: doctorName,
        head_description: description,
        rate: Number(rate),
        quantity: Number(qty),
        amount: amount,
        bed_number: selectedAdmission.bed_number,
        ward_name: selectedAdmission.ward_name,
        remark: remark,
      };

      const result = await drVisitProcedureApi.createDrVisitProcedure(payload);
      setNotification({
        type: 'success',
        message: `Saved ${result.entry_type}: '${result.head_description}' - Rs. ${result.amount}`,
      });

      // Reload
      const updatedEntries = await drVisitProcedureApi.getDrVisitProcedures();
      setEntries(updatedEntries);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving entry.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddVisit = () => {
    setEntryType('Doctor Visit');
    setDescription('Daily Consultant Round & Patient Review');
    setRate(750);
    setQty(1);
    setIsFormVisible(true);
  };

  const handleQuickAddProcedure = () => {
    setEntryType('Procedure');
    setDescription('Bedside Dressing / Catheterization');
    setRate(1200);
    setQty(1);
    setIsFormVisible(true);
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

      {/* Top Header */}
      <div className={styles.topHeader}>
        <h1 className={styles.pageTitle}>Inpatient Doctor Visits & Procedures Log</h1>
      </div>

      {/* Context & Actions Bar */}
      <div className={styles.contextBar}>
        <div className={styles.patientContext}>
          <div className={`${styles.contextBlock} ${styles.contextBlockName}`}>
            {selectedAdmission ? `${selectedAdmission.patient_name} (${selectedAdmission.uhid})` : 'Choose Patient'}
          </div>
          <div className={styles.contextBlock}>
            {selectedAdmission ? `IPD: ${selectedAdmission.ipd_no} | Bed: ${selectedAdmission.bed_number} (${selectedAdmission.ward_name})` : '--'}
          </div>
          <div className={styles.contextBlock}>
            Total Visits/Proc Charges: Rs. {totalCharges.toFixed(2)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className={styles.select}
            style={{ width: '240px' }}
            value={selectedAdmissionId}
            onChange={e => setSelectedAdmissionId(e.target.value)}
          >
            <option value="">-- Select Inpatient --</option>
            {admissions.map(a => (
              <option key={a.id} value={a.id}>{a.patient_name} ({a.ipd_no} | Bed {a.bed_number})</option>
            ))}
          </select>
          <button className={styles.primaryBtn} onClick={handleQuickAddVisit}>
            <Plus size={16} /> + Dr. Visit
          </button>
          <button className={styles.primaryBtn} onClick={handleQuickAddProcedure}>
            <Plus size={16} /> + Procedure
          </button>
          <button className={styles.secondaryBtn} onClick={loadData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Inline Form Card */}
      {isFormVisible && (
        <div className={styles.formCard}>
          <div className={styles.formCardHeader}>
            <span>Log {entryType} for {selectedAdmission?.patient_name || 'Patient'}</span>
          </div>

          <div className={styles.formGrid}>
            <div className={`${styles.fieldGroup} ${styles.col3}`}>
              <label className={styles.label}>Date *</label>
              <input
                type="date"
                className={styles.input}
                value={entryDate}
                onChange={e => setEntryDate(e.target.value)}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col3}`}>
              <label className={styles.label}>Entry Type</label>
              <select
                className={styles.select}
                value={entryType}
                onChange={e => setEntryType(e.target.value as any)}
              >
                <option value="Doctor Visit">Doctor Visit / Round</option>
                <option value="Procedure">Bedside Procedure</option>
                <option value="Nursing">Nursing / Dressing</option>
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.col6}`}>
              <label className={styles.label}>Doctor / Specialist *</label>
              <select
                className={styles.select}
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.drName}>{d.drName} ({d.speciality || d.department || 'Consultant'})</option>
                ))}
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.col12}`}>
              <label className={styles.label}>Description / Service Head *</label>
              <input
                type="text"
                className={styles.input}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>Rate (Rs.) *</label>
              <input
                type="number"
                min="0"
                step="50"
                className={styles.input}
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>Qty</label>
              <input
                type="number"
                min="1"
                className={styles.input}
                value={qty}
                onChange={e => setQty(Number(e.target.value))}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>Total Amount (Rs.)</label>
              <input
                type="text"
                className={styles.input}
                value={`Rs. ${(rate * qty).toFixed(2)}`}
                readOnly
                style={{ fontWeight: 700, color: '#1e3a8a' }}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col12}`}>
              <label className={styles.label}>Clinical Remark / Finding</label>
              <input
                type="text"
                className={styles.input}
                value={remark}
                onChange={e => setRemark(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.primaryBtn}
              onClick={handleSaveEntry}
              disabled={loading}
              style={{ backgroundColor: '#2563eb', color: '#fff' }}
            >
              <Save size={16} /> {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
      )}

      {/* Table Area */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Doctor</th>
                <th>Description</th>
                <th>Rate</th>
                <th>Qty</th>
                <th style={{ textAlign: 'right' }}>Amount (Rs.)</th>
                <th>Bed / Ward</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No doctor visit or procedure records logged for this patient yet. Use the form above to add an entry.
                  </td>
                </tr>
              ) : (
                filteredEntries.slice().reverse().map(e => (
                  <tr key={e.id}>
                    <td>{e.entry_date}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: e.entry_type === 'Doctor Visit' ? '#eff6ff' : '#fef3c7',
                        color: e.entry_type === 'Doctor Visit' ? '#1d4ed8' : '#92400e',
                      }}>
                        {e.entry_type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{e.doctor_name}</td>
                    <td>{e.head_description}</td>
                    <td>Rs. {e.rate}</td>
                    <td>{e.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#1e3a8a' }}>Rs. {Number(e.amount).toFixed(2)}</td>
                    <td>{e.bed_number ? `Bed ${e.bed_number}` : '-'} ({e.ward_name || '-'})</td>
                    <td>{e.remark || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DrVisitProcedure;
