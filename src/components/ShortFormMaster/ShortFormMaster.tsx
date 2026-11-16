import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2
} from 'lucide-react';
import styles from './ShortFormMaster.module.css';
import { shortFormApi, type ShortFormRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

const defaultShortForm: ShortFormRecord = {
  id: '',
  abbreviation: '',
  full_form: '',
  category: 'General',
  is_active: true,
};

const ShortFormMaster: React.FC = () => {
  const [shortForms, setShortForms] = useState<ShortFormRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<ShortFormRecord>(defaultShortForm);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await shortFormApi.getAll();
      setShortForms(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
      } else {
        setFormData({ ...defaultShortForm });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load short forms.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNav = (target: number) => {
    if (shortForms.length === 0) return;
    const bounded = Math.max(0, Math.min(target, shortForms.length - 1));
    setCurrentIndex(bounded);
    setFormData(shortForms[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultShortForm,
      abbreviation: '',
    });
    setNotification({ type: 'info', message: 'Enter new medical abbreviation / short form.' });
  };

  const handleSave = async () => {
    if (!formData.abbreviation.trim() || !formData.full_form.trim()) {
      setNotification({ type: 'warning', message: 'Please enter Abbreviation and Full Form.' });
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        const updated = await shortFormApi.update(formData.id, formData);
        setNotification({ type: 'success', message: `Short form '${updated.abbreviation}' updated!` });
      } else {
        const created = await shortFormApi.create(formData);
        setNotification({ type: 'success', message: `Short form '${created.abbreviation}' created!` });
      }
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving short form.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    const ok = window.confirm(`Deactivate Short Form '${formData.abbreviation}'?`);
    if (!ok) return;

    try {
      setLoading(true);
      await shortFormApi.delete(formData.id, false);
      setNotification({ type: 'success', message: `Short Form '${formData.abbreviation}' deactivated.` });
      await loadData();
    } catch {
      setNotification({ type: 'error', message: 'Failed to deactivate short form.' });
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
        <span className={styles.badge}>
          {shortForms.length > 0 ? `${currentIndex + 1} of ${shortForms.length}` : '0 of 0'}
        </span>
        <h1 className={styles.pageTitle}>Medical Short Forms & Abbreviations Master</h1>
        <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.mainSection}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Abbreviation / Short Name *</label>
            <input
              type="text"
              className={styles.input}
              value={formData.abbreviation}
              placeholder="e.g. ECG, ECHO, BP, CXR, USG"
              onChange={e => setFormData({ ...formData, abbreviation: e.target.value })}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Full Form / Clinical Description *</label>
            <textarea
              className={styles.textarea}
              value={formData.full_form}
              placeholder="e.g. 12-Lead Electrocardiogram"
              onChange={e => setFormData({ ...formData, full_form: e.target.value })}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Category</label>
            <input
              type="text"
              className={styles.input}
              value={formData.category || 'General'}
              placeholder="e.g. Cardiology / Vitals / Radiology"
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
        </div>

        {/* Short Forms Table */}
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>ID</th>
                <th style={{ padding: '8px 12px' }}>Short Form</th>
                <th style={{ padding: '8px 12px' }}>Full Form</th>
                <th style={{ padding: '8px 12px' }}>Category</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shortForms.map((sf, idx) => (
                <tr
                  key={sf.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setFormData(sf);
                  }}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    backgroundColor: sf.id === formData.id ? '#eff6ff' : undefined,
                  }}
                >
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{sf.id}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 700, color: '#2563eb' }}>{sf.abbreviation}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{sf.full_form}</td>
                  <td style={{ padding: '8px 12px' }}>{sf.category || 'General'}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: sf.is_active ? '#ecfdf5' : '#fee2e2',
                      color: sf.is_active ? '#065f46' : '#991b1b',
                    }}>
                      {sf.is_active ? 'Active' : 'Inactive'}
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
          <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Record"><ChevronsLeft size={18} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record"><ChevronLeft size={18} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record"><ChevronRight size={18} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(shortForms.length - 1)} title="Last Record"><ChevronsRight size={18} /></button>
        </div>

        <div className={styles.middleActions}>
          <button className={styles.secondaryBtn} onClick={handleNew}>
            <Plus size={16} /> New Short Form
          </button>
          {formData.id && (
            <button className={styles.secondaryBtn} onClick={handleDelete} style={{ color: '#dc2626' }}>
              <Trash2 size={16} /> Deactivate
            </button>
          )}
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
            <Save size={16} /> {loading ? 'Saving...' : formData.id ? 'Update' : 'Add Short Form'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortFormMaster;
