import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2, ArrowDown
} from 'lucide-react';
import styles from './StandardPrescriptionMaster.module.css';
import { prescriptionTemplateApi, type PrescriptionTemplateRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface RxItem {
  medicine_name: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration_days: number;
}

const defaultTemplate: PrescriptionTemplateRecord = {
  id: '',
  name: '',
  diagnosis: '',
  items: [],
  instructions: '',
  is_active: true,
};

const StandardPrescriptionMaster: React.FC = () => {
  const [templates, setTemplates] = useState<PrescriptionTemplateRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<PrescriptionTemplateRecord>(defaultTemplate);
  const [loading, setLoading] = useState<boolean>(false);

  // New Rx row inputs
  const [medName, setMedName] = useState<string>('');
  const [dosage, setDosage] = useState<string>('1 Tab');
  const [frequency, setFrequency] = useState<string>('OD (Once Daily)');
  const [timing, setTiming] = useState<string>('After Food');
  const [duration, setDuration] = useState<number>(7);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await prescriptionTemplateApi.getAll();
      setTemplates(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
      } else {
        setFormData({ ...defaultTemplate });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load prescription templates.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNav = (target: number) => {
    if (templates.length === 0) return;
    const bounded = Math.max(0, Math.min(target, templates.length - 1));
    setCurrentIndex(bounded);
    setFormData(templates[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultTemplate,
      name: '',
      diagnosis: '',
      items: [],
    });
    setNotification({ type: 'info', message: 'Enter new standard prescription template.' });
  };

  const handleAddMedicine = () => {
    if (!medName.trim()) {
      setNotification({ type: 'warning', message: 'Please enter medicine name.' });
      return;
    }
    const newItem: RxItem = {
      medicine_name: medName,
      dosage: dosage,
      frequency: frequency,
      timing: timing,
      duration_days: Number(duration) || 5,
    };
    setFormData({
      ...formData,
      items: [...(formData.items || []), newItem],
    });
    setMedName('');
  };

  const handleRemoveMedicine = (idx: number) => {
    const updated = [...(formData.items || [])];
    updated.splice(idx, 1);
    setFormData({ ...formData, items: updated });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.diagnosis.trim()) {
      setNotification({ type: 'warning', message: 'Please enter Template Name and Diagnosis.' });
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        const updated = await prescriptionTemplateApi.update(formData.id, formData);
        setNotification({ type: 'success', message: `Template '${updated.name}' updated!` });
      } else {
        const created = await prescriptionTemplateApi.create(formData);
        setNotification({ type: 'success', message: `Template '${created.name}' created!` });
      }
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving prescription template.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    const ok = window.confirm(`Deactivate Prescription Template '${formData.name}'?`);
    if (!ok) return;

    try {
      setLoading(true);
      await prescriptionTemplateApi.delete(formData.id, false);
      setNotification({ type: 'success', message: `Template '${formData.name}' deactivated.` });
      await loadData();
    } catch {
      setNotification({ type: 'error', message: 'Failed to deactivate template.' });
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
            {templates.length > 0 ? `${currentIndex + 1} of ${templates.length}` : '0 of 0'}
          </span>
          <h1 className={styles.pageTitle}>Standard Prescription Protocol Master</h1>
        </div>
        <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className={styles.formContainer}>
        {/* Top Info */}
        <div className={styles.topSection}>
          <div className={styles.formRow}>
            <label className={styles.label}>Template Name *</label>
            <input
              type="text"
              className={`${styles.input} ${styles.highlightInput}`}
              value={formData.name}
              placeholder="e.g. Starter Anti-Hypertensive Protocol"
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className={styles.fullWidthRow}>
            <label className={styles.label}>Diagnosis *</label>
            <input
              type="text"
              className={styles.input}
              value={formData.diagnosis}
              placeholder="e.g. Essential Hypertension (Stage 1/2)"
              onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
            />
          </div>
          <div className={styles.fullWidthRow}>
            <label className={styles.label}>Instructions</label>
            <input
              type="text"
              className={styles.input}
              value={formData.instructions || ''}
              placeholder="e.g. Monitor BP weekly. Low salt diet."
              onChange={e => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>
        </div>

        {/* Rx Section */}
        <div className={styles.rxSection}>
          <div className={styles.rxHeader}>Protocol Medications (Rx Items)</div>

          <div className={styles.rxInputRow}>
            <input
              type="text"
              placeholder="Medicine Name (e.g. Telmisartan 40mg)"
              className={styles.input}
              style={{ flex: 3 }}
              value={medName}
              onChange={e => setMedName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Dosage (1 Tab)"
              className={styles.input}
              style={{ flex: 1.5 }}
              value={dosage}
              onChange={e => setDosage(e.target.value)}
            />
            <select
              className={styles.input}
              style={{ flex: 2 }}
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
            >
              <option value="OD (Once Daily)">OD (Once Daily)</option>
              <option value="BD (Twice Daily)">BD (Twice Daily)</option>
              <option value="TDS (Thrice Daily)">TDS (Thrice Daily)</option>
              <option value="QID (4 Times Daily)">QID (4 Times Daily)</option>
              <option value="SOS (As Needed)">SOS (As Needed)</option>
              <option value="HS (At Bedtime)">HS (At Bedtime)</option>
            </select>
            <input
              type="text"
              placeholder="Timing (After Food)"
              className={styles.input}
              style={{ flex: 2 }}
              value={timing}
              onChange={e => setTiming(e.target.value)}
            />
            <input
              type="number"
              min="1"
              placeholder="Days"
              className={styles.input}
              style={{ width: '80px', flex: 'none' }}
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
            />
            <button className={styles.iconBtn} onClick={handleAddMedicine} title="Add Medicine to Protocol">
              <ArrowDown size={18} />
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Timing</th>
                  <th>Duration (Days)</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {(formData.items || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                      No medications added yet to this protocol. Add one above.
                    </td>
                  </tr>
                ) : (
                  formData.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: '#1e3a8a' }}>{item.medicine_name}</td>
                      <td>{item.dosage}</td>
                      <td>{item.frequency}</td>
                      <td>{item.timing}</td>
                      <td>{item.duration_days} days</td>
                      <td>
                        <button
                          onClick={() => handleRemoveMedicine(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.navControls}>
          <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Protocol"><ChevronsLeft size={20} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Protocol"><ChevronLeft size={20} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Protocol"><ChevronRight size={20} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(templates.length - 1)} title="Last Protocol"><ChevronsRight size={20} /></button>
        </div>

        <div className={styles.middleActions}>
          <button className={styles.secondaryBtn} onClick={handleNew}>
            <Plus size={16} /> New Protocol Template
          </button>
          {formData.id && (
            <button className={styles.secondaryBtn} onClick={handleDelete} style={{ color: '#dc2626' }}>
              <Trash2 size={16} /> Deactivate
            </button>
          )}
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
            <Save size={18} /> {loading ? 'Saving...' : formData.id ? 'Update Protocol' : 'Create Protocol'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandardPrescriptionMaster;
