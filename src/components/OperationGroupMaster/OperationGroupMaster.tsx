import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2
} from 'lucide-react';
import styles from './OperationGroupMaster.module.css';
import { operationGroupApi, type OperationGroupRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

const defaultGroup: OperationGroupRecord = {
  id: '',
  code: '',
  name: '',
  description: '',
  is_active: true,
};

const OperationGroupMaster: React.FC = () => {
  const [groups, setGroups] = useState<OperationGroupRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<OperationGroupRecord>(defaultGroup);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await operationGroupApi.getAll();
      setGroups(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
      } else {
        setFormData({ ...defaultGroup });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load operation groups.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNav = (target: number) => {
    if (groups.length === 0) return;
    const bounded = Math.max(0, Math.min(target, groups.length - 1));
    setCurrentIndex(bounded);
    setFormData(groups[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultGroup,
      code: `OPG-0${groups.length + 1}`,
    });
    setNotification({ type: 'info', message: 'Enter new operation group details.' });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      setNotification({ type: 'warning', message: 'Please enter Group Name and Code.' });
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        const updated = await operationGroupApi.update(formData.id, formData);
        setNotification({ type: 'success', message: `Group '${updated.name}' updated!` });
      } else {
        const created = await operationGroupApi.create(formData);
        setNotification({ type: 'success', message: `Group '${created.name}' created!` });
      }
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving operation group.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    const ok = window.confirm(`Deactivate Operation Group '${formData.name}'?`);
    if (!ok) return;

    try {
      setLoading(true);
      await operationGroupApi.delete(formData.id, false);
      setNotification({ type: 'success', message: `Operation Group '${formData.name}' deactivated.` });
      await loadData();
    } catch {
      setNotification({ type: 'error', message: 'Failed to deactivate operation group.' });
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
            {groups.length > 0 ? `${currentIndex + 1} of ${groups.length}` : '0 of 0'}
          </span>
          <h1 className={styles.pageTitle}>Operation Group Master</h1>
        </div>
        <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.topSection}>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ width: '120px' }}>Group Code *</label>
              <input
                type="text"
                className={styles.input}
                style={{ width: '140px' }}
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label} style={{ width: '120px' }}>Group Name *</label>
              <input
                type="text"
                className={styles.input}
                style={{ width: '100%' }}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label} style={{ width: '120px' }}>Description</label>
              <input
                type="text"
                className={styles.input}
                style={{ width: '100%' }}
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Groups List */}
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>ID</th>
                <th style={{ padding: '8px 12px' }}>Code</th>
                <th style={{ padding: '8px 12px' }}>Group Name</th>
                <th style={{ padding: '8px 12px' }}>Description</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g, idx) => (
                <tr
                  key={g.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setFormData(g);
                  }}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    backgroundColor: g.id === formData.id ? '#eff6ff' : undefined,
                  }}
                >
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{g.id}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 700, color: '#2563eb' }}>{g.code}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{g.name}</td>
                  <td style={{ padding: '8px 12px' }}>{g.description || '-'}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: g.is_active ? '#ecfdf5' : '#fee2e2',
                      color: g.is_active ? '#065f46' : '#991b1b',
                    }}>
                      {g.is_active ? 'Active' : 'Inactive'}
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
          <button className={styles.navBtn} onClick={() => handleNav(groups.length - 1)} title="Last Record"><ChevronsRight size={20} /></button>
        </div>

        <div className={styles.middleActions}>
          <button className={styles.secondaryBtn} onClick={handleNew}>
            <Plus size={16} /> New Operation Group
          </button>
          {formData.id && (
            <button className={styles.secondaryBtn} onClick={handleDelete} style={{ color: '#dc2626' }}>
              <Trash2 size={16} /> Deactivate
            </button>
          )}
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
            <Save size={18} /> {loading ? 'Saving...' : formData.id ? 'Update Group' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperationGroupMaster;
