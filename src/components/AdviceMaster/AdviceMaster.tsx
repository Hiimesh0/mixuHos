import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2
} from 'lucide-react';
import styles from './AdviceMaster.module.css';
import { adviceApi, type AdviceRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

const defaultAdvice: AdviceRecord = {
  id: '',
  title: '',
  instructions: '',
  category: 'General',
  is_active: true,
};

const AdviceMaster: React.FC = () => {
  const [advices, setAdvices] = useState<AdviceRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<AdviceRecord>(defaultAdvice);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await adviceApi.getAll();
      setAdvices(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
      } else {
        setFormData({ ...defaultAdvice });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load advice records.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNav = (target: number) => {
    if (advices.length === 0) return;
    const bounded = Math.max(0, Math.min(target, advices.length - 1));
    setCurrentIndex(bounded);
    setFormData(advices[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultAdvice,
      title: '',
      instructions: '',
    });
    setNotification({ type: 'info', message: 'Enter new patient clinical advice template.' });
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.instructions.trim()) {
      setNotification({ type: 'warning', message: 'Please enter Title and Instructions.' });
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        const updated = await adviceApi.update(formData.id, formData);
        setNotification({ type: 'success', message: `Advice '${updated.title}' updated!` });
      } else {
        const created = await adviceApi.create(formData);
        setNotification({ type: 'success', message: `Advice '${created.title}' created!` });
      }
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving advice.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    const ok = window.confirm(`Deactivate Advice '${formData.title}'?`);
    if (!ok) return;

    try {
      setLoading(true);
      await adviceApi.delete(formData.id, false);
      setNotification({ type: 'success', message: `Advice '${formData.title}' deactivated.` });
      await loadData();
    } catch {
      setNotification({ type: 'error', message: 'Failed to deactivate advice.' });
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
            {advices.length > 0 ? `${currentIndex + 1} of ${advices.length}` : '0 of 0'}
          </span>
          <h1 className={styles.pageTitle}>Clinical Advice & Instructions Master</h1>
        </div>
        <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formRow}>
          <label className={styles.label}>Advice Title *</label>
          <input
            type="text"
            className={styles.input}
            value={formData.title}
            placeholder="e.g. Hypertension Dietary Advice"
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Category</label>
          <input
            type="text"
            className={styles.input}
            value={formData.category || 'General'}
            placeholder="e.g. Diet & Lifestyle, Surgical, Endocrine"
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>Instructions / Text *</label>
          <textarea
            className={styles.input}
            style={{ width: '100%', height: '80px', padding: '8px' }}
            value={formData.instructions}
            onChange={e => setFormData({ ...formData, instructions: e.target.value })}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '220px' }}>Advice Title</th>
                <th style={{ width: '140px' }}>Category</th>
                <th>Instructions & Details</th>
                <th style={{ width: '90px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {advices.map((adv, idx) => (
                <tr
                  key={adv.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setFormData(adv);
                  }}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: adv.id === formData.id ? '#eff6ff' : undefined,
                  }}
                >
                  <td>{adv.id}</td>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>{adv.title}</td>
                  <td>{adv.category || 'General'}</td>
                  <td>{adv.instructions}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: adv.is_active ? '#ecfdf5' : '#fee2e2',
                      color: adv.is_active ? '#065f46' : '#991b1b',
                    }}>
                      {adv.is_active ? 'Active' : 'Inactive'}
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
          <button className={styles.navBtn} onClick={() => handleNav(advices.length - 1)} title="Last Record"><ChevronsRight size={20} /></button>
        </div>

        <div className={styles.middleActions}>
          <button className={styles.secondaryBtn} onClick={handleNew}>
            <Plus size={16} /> New Advice
          </button>
          {formData.id && (
            <button className={styles.secondaryBtn} onClick={handleDelete} style={{ color: '#dc2626' }}>
              <Trash2 size={16} /> Deactivate
            </button>
          )}
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
            <Save size={18} /> {loading ? 'Saving...' : formData.id ? 'Update Advice' : 'Create Advice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdviceMaster;
