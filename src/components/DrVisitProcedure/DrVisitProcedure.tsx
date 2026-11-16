import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Pencil, Save, RefreshCw, CheckCircle2, AlertCircle, X, Search, FileText } from 'lucide-react';
import styles from './DrVisitProcedure.module.css';
import { drVisitProcedureApi, admissionApi, type DrVisitProcedureRecord, type AdmissionRecord } from '../../api/hospitalApi';
import { doctorApi, type DoctorRecord } from '../../api/masterApi';
import { formatDoctorName } from '../../utils/doctorUtils';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

const FALLBACK_DOCTORS = [
  { id: 'DOC-001', name: 'Dr. Nilesh Mahale', speciality: 'Physician' },
  { id: 'DOC-002', name: 'Dr. Suresh Patil', speciality: 'General Surgeon' },
  { id: 'DOC-003', name: 'Dr. Rahul Sharma', speciality: 'Cardiologist' },
  { id: 'DOC-004', name: 'Dr. Sneha Joshi', speciality: 'Pediatrician' },
  { id: 'DOC-005', name: 'Dr. Anita Kulkarni', speciality: 'Gynecologist' },
];

const DrVisitProcedure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>('');
  const [patientSearchTerm, setPatientSearchTerm] = useState<string>('');
  const [entries, setEntries] = useState<DrVisitProcedureRecord[]>([]);
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true);

  // Form states
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [entryType, setEntryType] = useState<'Doctor Visit' | 'Procedure' | 'Nursing'>('Doctor Visit');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState<string>('Dr. Nilesh Mahale');
  const [description, setDescription] = useState<string>('Daily Consultant Round & Patient Review');
  const [rate, setRate] = useState<number>(750);
  const [qty, setQty] = useState<number>(1);
  const [remark, setRemark] = useState<string>('General status stable. Vital monitoring continue.');
  const [loading, setLoading] = useState<boolean>(false);

  // Table filtering states
  const [tableSearchText, setTableSearchText] = useState<string>('');
  const [tableTypeFilter, setTableTypeFilter] = useState<string>('All');

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [admsRes, entriesRes, docsRes] = await Promise.allSettled([
        admissionApi.getAdmissions(),
        drVisitProcedureApi.getDrVisitProcedures(),
        doctorApi.getDoctors({ active_only: true }),
      ]);

      const adms: AdmissionRecord[] = admsRes.status === 'fulfilled' && Array.isArray(admsRes.value) ? admsRes.value : [];
      const allEntries: DrVisitProcedureRecord[] = entriesRes.status === 'fulfilled' && Array.isArray(entriesRes.value) ? entriesRes.value : [];
      const docsList: DoctorRecord[] = docsRes.status === 'fulfilled' && docsRes.value && Array.isArray(docsRes.value.doctors) ? docsRes.value.doctors : [];

      setAdmissions(adms);
      setEntries(allEntries);
      setDoctors(docsList);

      // Auto-select doctor if current doctorName is not set or default
      if (docsList.length > 0 && doctorName === 'Dr. Nilesh Mahale') {
        const found = docsList.find(d => d.drName.toLowerCase().includes('nilesh'));
        if (found) {
          setDoctorName(formatDoctorName(found.title, found.drName));
        } else if (docsList[0]) {
          setDoctorName(formatDoctorName(docsList[0].title, docsList[0].drName));
        }
      }

      const queryAdmId = searchParams.get('admId');
      const queryUhid = searchParams.get('uhid') || searchParams.get('id');
      const queryIpd = searchParams.get('ipd');

      let targetAdm = null;
      if (queryAdmId) {
        targetAdm = adms.find(a => a.id === queryAdmId);
      }
      if (!targetAdm && queryIpd) {
        targetAdm = adms.find(a => (a.ipd_no || '').toLowerCase() === queryIpd.toLowerCase());
      }
      if (!targetAdm && queryUhid) {
        targetAdm = adms.find(a => (a.uhid || '').toLowerCase() === queryUhid.toLowerCase());
      }
      if (!targetAdm && adms.length > 0) {
        targetAdm = adms.find(a => a.status === 'Admitted') || adms[0];
      }

      if (targetAdm) {
        setSelectedAdmissionId(targetAdm.id);
      }
    } catch (err: unknown) {
      console.error('Failed to load visits & procedures:', err);
      const msg = err instanceof Error ? err.message : 'Failed to load visits & procedures.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }, [searchParams, doctorName, setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Selected inpatient record
  const selectedAdmission = useMemo(() => {
    return admissions.find(a => a.id === selectedAdmissionId);
  }, [admissions, selectedAdmissionId]);

  // Search filtered admissions dropdown
  const selectableAdmissions = useMemo(() => {
    if (!patientSearchTerm.trim()) return admissions;
    const q = patientSearchTerm.toLowerCase().trim();
    return admissions.filter(a =>
      (a.patient_name || '').toLowerCase().includes(q) ||
      (a.uhid || '').toLowerCase().includes(q) ||
      (a.ipd_no || '').toLowerCase().includes(q) ||
      (a.bed_number || '').toLowerCase().includes(q)
    );
  }, [admissions, patientSearchTerm]);

  // All entries belonging to the currently selected patient
  const patientEntries = useMemo(() => {
    if (!selectedAdmission) return entries;
    const admId = selectedAdmission.id;
    const admUhid = (selectedAdmission.uhid || '').toLowerCase();
    const admIpd = (selectedAdmission.ipd_no || '').toLowerCase();

    return entries.filter(e => {
      if (e.admission_id && e.admission_id === admId) return true;
      if (e.ipd_no && admIpd && e.ipd_no.toLowerCase() === admIpd) return true;
      if (e.uhid && admUhid && e.uhid.toLowerCase() === admUhid) return true;
      return false;
    });
  }, [entries, selectedAdmission]);

  // Table search & category filtered entries
  const displayEntries = useMemo(() => {
    return patientEntries.filter(e => {
      if (tableTypeFilter !== 'All') {
        const eType = (e.entry_type || '').toLowerCase();
        if (tableTypeFilter === 'Doctor Visit' && !eType.includes('visit')) return false;
        if (tableTypeFilter === 'Procedure' && !eType.includes('procedure')) return false;
        if (tableTypeFilter === 'Nursing' && !eType.includes('nurs')) return false;
      }
      if (tableSearchText.trim()) {
        const q = tableSearchText.toLowerCase().trim();
        const matchDesc = (e.head_description || e.procedure_title || e.head || '').toLowerCase().includes(q);
        const matchDoc = (e.doctor_name || '').toLowerCase().includes(q);
        const matchRemark = (e.remark || e.notes || '').toLowerCase().includes(q);
        const matchBed = (e.bed_number || e.bed_no || '').toLowerCase().includes(q);
        if (!matchDesc && !matchDoc && !matchRemark && !matchBed) return false;
      }
      return true;
    });
  }, [patientEntries, tableTypeFilter, tableSearchText]);

  const totalCharges = useMemo(() => {
    return patientEntries.reduce((sum, e) => sum + Number(e.amount ?? e.charges ?? 0), 0);
  }, [patientEntries]);

  // Quick Action Buttons
  const handleQuickAddVisit = () => {
    setEditingEntryId(null);
    setEntryType('Doctor Visit');
    setDescription('Daily Consultant Round & Patient Review');
    setRate(750);
    setQty(1);
    setRemark('General status stable. Vital monitoring continue.');
    setIsFormVisible(true);
  };

  const handleQuickAddProcedure = () => {
    setEditingEntryId(null);
    setEntryType('Procedure');
    setDescription('Bedside Dressing / Catheterization');
    setRate(1200);
    setQty(1);
    setRemark('Aseptic procedure performed without complications.');
    setIsFormVisible(true);
  };

  // Edit an existing record
  const handleEditEntry = (entry: DrVisitProcedureRecord) => {
    setEditingEntryId(entry.id);
    setEntryDate(entry.entry_date || entry.visit_date || entry.date || new Date().toISOString().split('T')[0]);
    const normType = entry.entry_type?.toLowerCase().includes('procedure')
      ? 'Procedure'
      : entry.entry_type?.toLowerCase().includes('nurs')
      ? 'Nursing'
      : 'Doctor Visit';
    setEntryType(normType);
    setDoctorName(entry.doctor_name || 'Dr. Nilesh Mahale');
    setDescription(entry.head_description || entry.procedure_title || entry.head || '');
    setRate(Number(entry.rate ?? entry.charges ?? 0));
    setQty(Number(entry.quantity ?? 1));
    setRemark(entry.remark || entry.notes || '');
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingEntryId(null);
    handleQuickAddVisit();
  };

  // Save new or updated record
  const handleSaveEntry = async () => {
    if (!selectedAdmission) {
      setNotification({ type: 'warning', message: 'Please select an inpatient first.' });
      return;
    }
    if (!description.trim()) {
      setNotification({ type: 'warning', message: 'Please enter a description / service head.' });
      return;
    }
    if (rate < 0) {
      setNotification({ type: 'warning', message: 'Rate cannot be negative.' });
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
        visit_date: entryDate,
        date: entryDate,
        entry_type: entryType,
        doctor_name: doctorName,
        head_description: description,
        procedure_title: description,
        head: description,
        rate: Number(rate),
        quantity: Number(qty),
        amount: amount,
        charges: amount,
        bed_number: selectedAdmission.bed_number,
        bed_no: selectedAdmission.bed_number,
        ward_name: selectedAdmission.ward_name,
        remark: remark,
        notes: remark,
      };

      if (editingEntryId) {
        const updated = await drVisitProcedureApi.updateDrVisitProcedure(editingEntryId, payload);
        setEntries(prev => prev.map(e => e.id === editingEntryId ? updated : e));
        setNotification({
          type: 'success',
          message: `Updated ${updated.entry_type || 'record'}: '${updated.head_description}' - Rs. ${Number(updated.amount).toFixed(2)}`,
        });
        setEditingEntryId(null);
      } else {
        const result = await drVisitProcedureApi.createDrVisitProcedure(payload);
        setEntries(prev => [...prev, result]);
        setNotification({
          type: 'success',
          message: `Saved ${result.entry_type || 'record'}: '${result.head_description}' - Rs. ${Number(result.amount).toFixed(2)}`,
        });
      }

      // Sync fresh records
      const updatedEntries = await drVisitProcedureApi.getDrVisitProcedures();
      setEntries(updatedEntries);
    } catch (err: unknown) {
      console.error('Error saving doctor visit / procedure:', err);
      const msg = err instanceof Error ? err.message : 'Error saving record.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  // Delete record
  const handleDeleteEntry = async (entry: DrVisitProcedureRecord) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this record?\n\nDate: ${entry.entry_date || entry.date}\nType: ${entry.entry_type}\nDescription: ${entry.head_description || entry.procedure_title}\nAmount: Rs. ${entry.amount}`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await drVisitProcedureApi.deleteDrVisitProcedure(entry.id);
      setEntries(prev => prev.filter(e => e.id !== entry.id));
      if (editingEntryId === entry.id) {
        setEditingEntryId(null);
        handleQuickAddVisit();
      }
      setNotification({
        type: 'success',
        message: `Deleted record '${entry.head_description || entry.id}' successfully.`,
      });
    } catch (err: unknown) {
      console.error('Error deleting doctor visit / procedure:', err);
      const msg = err instanceof Error ? err.message : 'Error deleting record.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
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
            marginBottom: '16px',
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
        <div>
          <h1 className={styles.pageTitle}>Inpatient Doctor Visits & Procedures Log</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Manage consultant doctor visits, daily clinical rounds, and bedside procedures for admitted inpatients.
          </p>
        </div>
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
          <div className={styles.contextBlock} style={{ color: '#1e3a8a', fontWeight: 700 }}>
            Total Charges: Rs. {totalCharges.toFixed(2)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Patient Quick Filter */}
          <input
            type="text"
            placeholder="Filter patients..."
            value={patientSearchTerm}
            onChange={e => setPatientSearchTerm(e.target.value)}
            className={styles.input}
            style={{ width: '150px', height: '38px', fontSize: '13px' }}
            title="Filter admitted patients list"
          />

          <select
            className={styles.select}
            style={{ width: '230px' }}
            value={selectedAdmissionId}
            onChange={e => setSelectedAdmissionId(e.target.value)}
          >
            <option value="">-- Select Inpatient --</option>
            {selectableAdmissions.map(a => (
              <option key={a.id} value={a.id}>{a.patient_name} ({a.ipd_no} | Bed {a.bed_number})</option>
            ))}
          </select>

          <button className={styles.primaryBtn} onClick={handleQuickAddVisit}>
            <Plus size={16} /> + Dr. Visit
          </button>
          <button className={styles.primaryBtn} onClick={handleQuickAddProcedure}>
            <Plus size={16} /> + Procedure
          </button>
          <button className={styles.secondaryBtn} onClick={loadData} disabled={loading}>
            <RefreshCw size={16} className={loading ? styles.spin : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Inline Form Card */}
      {isFormVisible && (
        <div className={styles.formCard} style={editingEntryId ? { border: '2px solid #2563eb', backgroundColor: '#f8fafc' } : {}}>
          <div className={styles.formCardHeader}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {editingEntryId ? (
                <>
                  <Pencil size={18} color="#2563eb" />
                  <strong>Edit Entry:</strong> {description} <span style={{ fontSize: '12px', color: '#64748b' }}>({editingEntryId})</span>
                </>
              ) : (
                <>
                  <FileText size={18} color="#2563eb" />
                  <span>Log {entryType} for <strong>{selectedAdmission?.patient_name || 'Patient'}</strong></span>
                </>
              )}
            </span>
            {editingEntryId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  background: 'none',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#64748b',
                }}
              >
                ✕ Cancel Edit
              </button>
            )}
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
                {doctors.length > 0 ? (
                  doctors.map(d => {
                    const formatted = formatDoctorName(d.title, d.drName);
                    return (
                      <option key={d.id} value={formatted}>{formatted} ({d.speciality || d.department || 'Consultant'})</option>
                    );
                  })
                ) : (
                  FALLBACK_DOCTORS.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.speciality})</option>
                  ))
                )}
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.col12}`}>
              <label className={styles.label}>Description / Service Head *</label>
              <input
                type="text"
                className={styles.input}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Daily Consultant Round, Bedside Dressing, Ryle's Tube Insertion..."
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
                onChange={e => setQty(Math.max(1, Number(e.target.value)))}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>Total Amount (Rs.)</label>
              <input
                type="text"
                className={styles.input}
                value={`Rs. ${(rate * qty).toFixed(2)}`}
                readOnly
                style={{ fontWeight: 700, color: '#1e3a8a', backgroundColor: '#f1f5f9' }}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.col12}`}>
              <label className={styles.label}>Clinical Remark / Finding</label>
              <input
                type="text"
                className={styles.input}
                value={remark}
                onChange={e => setRemark(e.target.value)}
                placeholder="e.g. Patient stable, wound clean, advised dressing change tomorrow..."
              />
            </div>
          </div>

          <div className={styles.formActions}>
            {editingEntryId && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleCancelEdit}
                style={{ marginRight: '8px' }}
              >
                <X size={16} /> Cancel Edit
              </button>
            )}
            <button
              className={styles.primaryBtn}
              onClick={handleSaveEntry}
              disabled={loading}
              style={{ backgroundColor: editingEntryId ? '#15803d' : '#2563eb', color: '#fff' }}
            >
              <Save size={16} /> {loading ? 'Saving...' : editingEntryId ? 'Update Record' : 'Save Entry'}
            </button>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className={styles.tableCard}>
        {/* Table Filter Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '260px' }}>
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search in history (description, doctor, remark)..."
              value={tableSearchText}
              onChange={e => setTableSearchText(e.target.value)}
              className={styles.input}
              style={{ height: '34px', maxWidth: '320px', fontSize: '13px' }}
            />
            <select
              value={tableTypeFilter}
              onChange={e => setTableTypeFilter(e.target.value)}
              className={styles.select}
              style={{ height: '34px', width: '150px', fontSize: '13px' }}
            >
              <option value="All">All Types</option>
              <option value="Doctor Visit">Doctor Visits</option>
              <option value="Procedure">Procedures</option>
              <option value="Nursing">Nursing</option>
            </select>
            {(tableSearchText || tableTypeFilter !== 'All') && (
              <button
                type="button"
                onClick={() => { setTableSearchText(''); setTableTypeFilter('All'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                Clear Filter
              </button>
            )}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            Showing <strong>{displayEntries.length}</strong> of <strong>{patientEntries.length}</strong> recorded entries for selected patient
          </div>
        </div>

        {/* Table Content */}
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
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayEntries.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    {selectedAdmission ? (
                      <>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>No records found matching current criteria.</div>
                        <div style={{ fontSize: '12px' }}>Use '+ Dr. Visit' or '+ Procedure' above to record consultant visits and bedside care.</div>
                      </>
                    ) : (
                      'Please select an inpatient above to view visit and procedure history.'
                    )}
                  </td>
                </tr>
              ) : (
                displayEntries.slice().reverse().map(e => (
                  <tr key={e.id} style={editingEntryId === e.id ? { backgroundColor: '#eff6ff' } : {}}>
                    <td>{e.entry_date || e.visit_date || e.date}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: (e.entry_type === 'Doctor Visit' || e.entry_type === 'VISIT') ? '#eff6ff' : '#fef3c7',
                        color: (e.entry_type === 'Doctor Visit' || e.entry_type === 'VISIT') ? '#1d4ed8' : '#92400e',
                      }}>
                        {e.entry_type || 'Doctor Visit'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{e.doctor_name}</td>
                    <td>{e.head_description || e.procedure_title || e.head || 'Visiting Charge'}</td>
                    <td>Rs. {e.rate ?? e.charges ?? 0}</td>
                    <td>{e.quantity ?? 1}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#1e3a8a' }}>Rs. {Number(e.amount ?? e.charges ?? 0).toFixed(2)}</td>
                    <td>{e.bed_number || e.bed_no ? `Bed ${e.bed_number || e.bed_no}` : '-'} ({e.ward_name || '-'})</td>
                    <td>{e.remark || e.notes || '-'}</td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          title="Edit this entry"
                          onClick={() => handleEditEntry(e)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#2563eb',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          title="Delete this entry"
                          onClick={() => handleDeleteEntry(e)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#dc2626',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
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
