import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, Save, LogOut, CheckSquare, Square, Edit2, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react';
import styles from './VisitProcedureHeaderMaster.module.css';
import { visitProcedureHeaderApi, type VisitProcedureHeaderRecord } from '../../api/masterApi';

type VisitHeaderItem = VisitProcedureHeaderRecord;

const INITIAL_HEADERS: VisitHeaderItem[] = [
  { id: '1', headerFor: 'Visiting Charge', headerName: 'Consultant Routine Visit', description: 'Standard daily inpatient bedside rounds', priority: 1, status: 'Active', notCalcService: false, notCalcUnderCare: false, isPackage: false, notCalcInRef: false },
  { id: '2', headerFor: 'Visiting Charge', headerName: 'Emergency Night Visit', description: 'After-hours call / emergency bedside round', priority: 2, status: 'Active', notCalcService: false, notCalcUnderCare: false, isPackage: false, notCalcInRef: false },
  { id: '3', headerFor: 'Visiting Charge', headerName: 'Cross Consultation Special', description: 'Super-specialist opinion and treatment review', priority: 3, status: 'Active', notCalcService: false, notCalcUnderCare: false, isPackage: false, notCalcInRef: false },
  { id: '4', headerFor: 'Visiting Charge', headerName: 'ICU Intensivist Round', description: 'Critical care physician intensive monitoring', priority: 1, status: 'Active', notCalcService: false, notCalcUnderCare: false, isPackage: false, notCalcInRef: false },
  { id: '5', headerFor: 'Other Charge', headerName: 'Minor Bedside Procedure', description: 'Wound dressing, catheterization, Ryle tube insertion', priority: 4, status: 'Active', notCalcService: false, notCalcUnderCare: false, isPackage: false, notCalcInRef: false },
  { id: '6', headerFor: 'Other Charge', headerName: 'Central Venous Line Insertion', description: 'Triple lumen CVC insertion under ultrasound', priority: 5, status: 'Active', notCalcService: true, notCalcUnderCare: false, isPackage: false, notCalcInRef: false },
  { id: '7', headerFor: 'Other Charge', headerName: 'Endotracheal Intubation', description: 'Emergency airway control and ventilator connection', priority: 5, status: 'Active', notCalcService: true, notCalcUnderCare: false, isPackage: false, notCalcInRef: false },
  { id: '8', headerFor: 'Other Charge', headerName: 'Lumbar Puncture (CSF Study)', description: 'Diagnostic or therapeutic spinal fluid tapping', priority: 6, status: 'Active', notCalcService: false, notCalcUnderCare: false, isPackage: false, notCalcInRef: false },
];

const VisitProcedureHeaderMaster: React.FC = () => {
  const navigate = useNavigate();
  const [headers, setHeaders] = useState<VisitHeaderItem[]>(INITIAL_HEADERS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [notification, setNotification] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const loadHeaders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await visitProcedureHeaderApi.getAll();
      const list = res.headers || (Array.isArray(res) ? res : []);
      if (list && list.length > 0) {
        setHeaders(list);
      }
    } catch (err: any) {
      console.warn('Could not fetch visit headers from backend, using default list:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHeaders();
  }, [loadHeaders]);

  const current = headers[currentIndex] || headers[0];

  const handleNav = (target: number) => {
    if (headers.length === 0) return;
    const bounded = Math.max(0, Math.min(target, headers.length - 1));
    setCurrentIndex(bounded);
  };

  const handleUpdateCurrent = (field: keyof VisitHeaderItem, value: any) => {
    if (!current) return;
    setHeaders(prev => prev.map(h => h.id === current.id ? { ...h, [field]: value } : h));
  };

  const handleSave = async () => {
    if (!current) return;
    try {
      setLoading(true);
      setErrorMessage('');
      let saved: VisitHeaderItem;
      try {
        saved = await visitProcedureHeaderApi.update(current.id, current);
      } catch {
        saved = await visitProcedureHeaderApi.create(current);
      }
      setHeaders(prev => prev.map(h => h.id === current.id ? (saved || current) : h));
      setNotification(`Header '${current.headerName}' updated persistently in hospital master!`);
      setTimeout(() => setNotification(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to persist visit header to backend.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async () => {
    const nextSeq = headers.length + 1;
    const nextId = `VPH-${String(nextSeq).padStart(3, '0')}`;
    const newH: VisitHeaderItem = {
      id: nextId,
      headerFor: 'Visiting Charge',
      headerName: 'New Procedure Header',
      description: 'Description of clinical visit or procedure',
      priority: 5,
      status: 'Active',
      notCalcService: false,
      notCalcUnderCare: false,
      isPackage: false,
      notCalcInRef: false,
    };
    try {
      const created = await visitProcedureHeaderApi.create(newH);
      setHeaders(prev => [...prev, created || newH]);
      setNotification(`New Header '${nextId}' created persistently!`);
    } catch {
      setHeaders(prev => [...prev, newH]);
      setNotification(`New Header created!`);
    }
    setTimeout(() => setNotification(''), 4000);
    setCurrentIndex(headers.length);
  };

  const handleDelete = async () => {
    if (headers.length <= 1 || !current) return;
    try {
      await visitProcedureHeaderApi.delete(current.id, true);
    } catch (e) {
      console.warn('Backend delete failed, removing locally:', e);
    }
    setHeaders(prev => prev.filter(h => h.id !== current.id));
    setNotification(`Header '${current.headerName}' removed.`);
    setTimeout(() => setNotification(''), 4000);
    handleNav(Math.max(0, currentIndex - 1));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className={styles.recordCounter}>{currentIndex + 1} of {headers.length}</span>
          <h1 className={styles.pageTitle}>Visit & Procedure Master Taxonomy</h1>
        </div>
      </div>

      {notification && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 14px', borderRadius: '6px', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {errorMessage && (
        <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '8px 14px', borderRadius: '6px', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <AlertCircle size={16} /> {errorMessage}
        </div>
      )}

      {/* Form Container */}
      <div className={styles.formContainer}>
        <div className={styles.topSection}>
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1, maxWidth: '400px' }}>
              <label className={styles.label}>Header For :</label>
              <select
                className={styles.input}
                value={current?.headerFor || 'Visiting Charge'}
                onChange={e => handleUpdateCurrent('headerFor', e.target.value)}
              >
                <option value="Visiting Charge">Visiting Charge</option>
                <option value="Other Charge">Other Charge / Procedure</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Header Name :</label>
              <input
                type="text"
                className={styles.input}
                value={current?.headerName || ''}
                onChange={e => handleUpdateCurrent('headerName', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Description :</label>
              <input
                type="text"
                className={styles.input}
                value={current?.description || ''}
                onChange={e => handleUpdateCurrent('description', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ maxWidth: '380px', width: '100%' }}>
              <label className={styles.label}>Priority :</label>
              <input
                type="number"
                className={styles.input}
                value={current?.priority || 1}
                onChange={e => handleUpdateCurrent('priority', Number(e.target.value))}
              />
            </div>

            <div className={styles.statusGroup}>
              <label className={styles.label} style={{ width: 'auto', marginRight: '8px' }}>Status :</label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="status"
                  checked={current?.status === 'Active'}
                  onChange={() => handleUpdateCurrent('status', 'Active')}
                /> Active
              </label>
              <label className={styles.radioLabel} style={{ marginLeft: '12px' }}>
                <input
                  type="radio"
                  name="status"
                  checked={current?.status === 'Inactive'}
                  onChange={() => handleUpdateCurrent('status', 'Inactive')}
                /> Inactive
              </label>
            </div>
          </div>

          <div className={styles.checkboxGrid}>
            <div
              className={styles.checkboxItem}
              onClick={() => handleUpdateCurrent('notCalcService', !current?.notCalcService)}
              style={{ cursor: 'pointer' }}
            >
              {current?.notCalcService ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} />}
              <span>Not Calculate Service Charge</span>
            </div>
            <div
              className={styles.checkboxItem}
              onClick={() => handleUpdateCurrent('notCalcUnderCare', !current?.notCalcUnderCare)}
              style={{ cursor: 'pointer' }}
            >
              {current?.notCalcUnderCare ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} />}
              <span>Not Calculate In Under Care Reference Report</span>
            </div>
            <div
              className={styles.checkboxItem}
              onClick={() => handleUpdateCurrent('isPackage', !current?.isPackage)}
              style={{ marginTop: '16px', cursor: 'pointer' }}
            >
              {current?.isPackage ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} />}
              <span>Package Procedure</span>
            </div>
          </div>
        </div>

        {/* Headers Table */}
        <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
            Registered Procedure & Visit Taxonomy Headers
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>
                <th style={{ padding: '8px 12px', width: '40px' }}>#</th>
                <th style={{ padding: '8px 12px', width: '140px' }}>Classification</th>
                <th style={{ padding: '8px 12px' }}>Header Name</th>
                <th style={{ padding: '8px 12px' }}>Clinical Description</th>
                <th style={{ padding: '8px 12px', width: '80px', textAlign: 'center' }}>Priority</th>
                <th style={{ padding: '8px 12px', width: '90px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {headers.map((h, idx) => (
                <tr
                  key={h.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    backgroundColor: idx === currentIndex ? '#eff6ff' : undefined,
                    fontWeight: idx === currentIndex ? 600 : 400
                  }}
                >
                  <td style={{ padding: '10px 12px' }}>{idx + 1}</td>
                  <td style={{ padding: '10px 12px', color: '#2563eb' }}>{h.headerFor}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{h.headerName}</td>
                  <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '12px' }}>{h.description}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{h.priority}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ padding: '1px 6px', borderRadius: '3px', fontSize: '11px', background: '#f0fdf4', color: '#166534' }}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.navControls}>
          <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Record"><ChevronsLeft size={20} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record"><ChevronLeft size={20} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record"><ChevronRight size={20} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(headers.length - 1)} title="Last Record"><ChevronsRight size={20} /></button>
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleAddNew}>
            <Save size={18} /> Add Header
          </button>
          <button className={styles.secondaryBtn} onClick={handleSave}>
            <Edit2 size={18} /> Save Header
          </button>
          <button className={styles.dangerBtn} onClick={handleDelete} style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '0 16px', borderRadius: '6px', height: '38px', cursor: 'pointer', fontWeight: 500 }}>
            <Trash2 size={16} /> Delete
          </button>
          <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }} onClick={() => navigate('/dr-visit-procedure')}>
            <LogOut size={18} /> Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitProcedureHeaderMaster;
