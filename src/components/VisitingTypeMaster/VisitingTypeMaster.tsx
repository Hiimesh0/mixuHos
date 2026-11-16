import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2
} from 'lucide-react';
import styles from './VisitingTypeMaster.module.css';
import { visitingTypeApi, type VisitingTypeRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

const defaultVisitingType: VisitingTypeRecord = {
  id: '',
  name: '',
  default_rate: 500,
  is_active: true,
};

const VisitingTypeMaster: React.FC = () => {
  const [visitingTypes, setVisitingTypes] = useState<VisitingTypeRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<VisitingTypeRecord>(defaultVisitingType);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await visitingTypeApi.getAll();
      setVisitingTypes(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
      } else {
        setFormData({ ...defaultVisitingType });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load visiting types.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNav = (target: number) => {
    if (visitingTypes.length === 0) return;
    const bounded = Math.max(0, Math.min(target, visitingTypes.length - 1));
    setCurrentIndex(bounded);
    setFormData(visitingTypes[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultVisitingType,
      name: '',
    });
    setNotification({ type: 'info', message: 'Enter new visiting type details.' });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setNotification({ type: 'warning', message: 'Please enter Visiting Type Name.' });
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        const updated = await visitingTypeApi.update(formData.id, formData);
        setNotification({ type: 'success', message: `Visiting type '${updated.name}' updated!` });
      } else {
        const created = await visitingTypeApi.create(formData);
        setNotification({ type: 'success', message: `Visiting type '${created.name}' created!` });
      }
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving visiting type.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    const ok = window.confirm(`Deactivate Visiting Type '${formData.name}'?`);
    if (!ok) return;

    try {
      setLoading(true);
      await visitingTypeApi.delete(formData.id, false);
      setNotification({ type: 'success', message: `Visiting type '${formData.name}' deactivated.` });
      await loadData();
    } catch {
      setNotification({ type: 'error', message: 'Failed to deactivate visiting type.' });
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
          <span className={styles.recordCounter}>
            {visitingTypes.length > 0 ? `${currentIndex + 1} of ${visitingTypes.length}` : '0 of 0'}
          </span>
          <h1 className={styles.pageTitle}>Consultation & Visiting Type Master</h1>
        </div>
        <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.topSection}>
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 2 }}>
              <label className={styles.label}>Visiting / Consultation Name *</label>
              <input
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Default Rate (Rs.) *</label>
              <input
                type="number"
                min="0"
                step="50"
                className={styles.input}
                value={formData.default_rate}
                onChange={e => setFormData({ ...formData, default_rate: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* List Table */}
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>ID</th>
                <th style={{ padding: '8px 12px' }}>Visiting / Consultation Type</th>
                <th style={{ padding: '8px 12px' }}>Default Rate (Rs.)</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitingTypes.map((vt, idx) => (
                <tr
                  key={vt.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setFormData(vt);
                  }}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    backgroundColor: vt.id === formData.id ? '#eff6ff' : undefined,
                  }}
                >
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{vt.id}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 700, color: '#2563eb' }}>{vt.name}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>Rs. {vt.default_rate}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: vt.is_active ? '#ecfdf5' : '#fee2e2',
                      color: vt.is_active ? '#065f46' : '#991b1b',
                    }}>
                      {vt.is_active ? 'Active' : 'Inactive'}
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
          <button className={styles.navBtn} onClick={() => handleNav(visitingTypes.length - 1)} title="Last Record"><ChevronsRight size={20} /></button>
        </div>

        <div className={styles.middleActions}>
          <button className={styles.secondaryBtn} onClick={handleNew}>
            <Plus size={16} /> New Visiting Type
          </button>
          {formData.id && (
            <button className={styles.secondaryBtn} onClick={handleDelete} style={{ color: '#dc2626' }}>
              <Trash2 size={16} /> Deactivate
            </button>
          )}
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
            <Save size={18} /> {loading ? 'Saving...' : formData.id ? 'Update Type' : 'Create Type'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitingTypeMaster;
