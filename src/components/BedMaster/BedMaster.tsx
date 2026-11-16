import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2
} from 'lucide-react';
import styles from './BedMaster.module.css';
import { bedApi, type BedRecord } from '../../api/hospitalApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

const defaultBed: BedRecord = {
  id: '',
  bed_number: '',
  ward_name: 'General Ward (Male)',
  room_type_id: 'RMT-000001',
  status: 'Vacant',
  daily_rate: 1000,
  is_active: true,
};

const BedMaster: React.FC = () => {
  const [beds, setBeds] = useState<BedRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<BedRecord>(defaultBed);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await bedApi.getBeds();
      setBeds(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
      } else {
        setFormData({ ...defaultBed });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load bed records.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNav = (target: number) => {
    if (beds.length === 0) return;
    const bounded = Math.max(0, Math.min(target, beds.length - 1));
    setCurrentIndex(bounded);
    setFormData(beds[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    const nextNo = beds.length > 0 ? String(beds.length + 101) : '101';
    setFormData({
      ...defaultBed,
      bed_number: nextNo,
    });
    setNotification({ type: 'info', message: 'Enter details for new bed.' });
  };

  const handleSave = async () => {
    if (!formData.bed_number.trim()) {
      setNotification({ type: 'warning', message: 'Please enter Bed Number.' });
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        // Update
        const updated = await bedApi.updateBed(formData.id, formData);
        setNotification({ type: 'success', message: `Bed ${updated.bed_number} updated!` });
      } else {
        // Create
        const created = await bedApi.createBed(formData);
        setNotification({ type: 'success', message: `Bed ${created.bed_number} created successfully!` });
      }
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving bed.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    if (formData.status === 'Occupied') {
      setNotification({ type: 'warning', message: 'Cannot deactivate an occupied bed. Discharge patient first.' });
      return;
    }
    const ok = window.confirm(`Deactivate Bed ${formData.bed_number}?`);
    if (!ok) return;

    try {
      setLoading(true);
      await bedApi.updateBed(formData.id, { is_active: false });
      setNotification({ type: 'success', message: `Bed ${formData.bed_number} deactivated.` });
      await loadData();
    } catch {
      setNotification({ type: 'error', message: 'Failed to deactivate bed.' });
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
            {beds.length > 0 ? `${currentIndex + 1} of ${beds.length}` : '0 of 0'}
          </span>
          <h1 className={styles.pageTitle}>Bed Master Management</h1>
        </div>
        <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Form Container */}
      <div className={styles.formContainer}>
        <div className={styles.topSection}>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ width: '90px' }}>Bed Number *</label>
              <input
                type="text"
                className={`${styles.input} ${styles.highlightInput}`}
                style={{ width: '120px' }}
                value={formData.bed_number}
                onChange={e => setFormData({ ...formData, bed_number: e.target.value })}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ width: '90px' }}>Ward Name *</label>
              <select
                className={styles.input}
                style={{ width: '200px' }}
                value={formData.ward_name}
                onChange={e => setFormData({ ...formData, ward_name: e.target.value })}
              >
                <option value="General Ward (Male)">General Ward (Male)</option>
                <option value="General Ward (Female)">General Ward (Female)</option>
                <option value="Semi-Special Ward">Semi-Special Ward</option>
                <option value="Special Room">Special Room</option>
                <option value="Deluxe AC Room">Deluxe AC Room</option>
                <option value="ICU / CCU">ICU / CCU</option>
                <option value="Day Care Ward">Day Care Ward</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ width: '80px' }}>Daily Rate *</label>
              <input
                type="number"
                min="0"
                step="50"
                className={styles.input}
                style={{ width: '130px' }}
                value={formData.daily_rate}
                onChange={e => setFormData({ ...formData, daily_rate: Number(e.target.value) })}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ width: '70px' }}>Status</label>
              <select
                className={styles.input}
                style={{ width: '130px' }}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Vacant">Vacant</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>
          </div>
        </div>

        {/* Beds Table */}
        <div className={styles.chargesSection}>
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Bed Number</th>
                  <th>Ward Name</th>
                  <th>Daily Rate (Rs.)</th>
                  <th>Current Status</th>
                  <th>Admission / Patient</th>
                </tr>
              </thead>
              <tbody>
                {beds.map((b, idx) => (
                  <tr
                    key={b.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setFormData(b);
                    }}
                    style={{ cursor: 'pointer', backgroundColor: b.id === formData.id ? '#eff6ff' : undefined }}
                  >
                    <td>{b.id}</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>Bed {b.bed_number}</td>
                    <td>{b.ward_name}</td>
                    <td style={{ fontWeight: 600 }}>Rs. {b.daily_rate}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: b.status === 'Occupied' ? '#fee2e2' : '#ecfdf5',
                        color: b.status === 'Occupied' ? '#991b1b' : '#065f46',
                      }}>
                        {b.status}
                      </span>
                    </td>
                    <td>{b.current_admission_id ? `${b.current_admission_id} (${b.current_patient_id || ''})` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.navControls}>
          <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Bed"><ChevronsLeft size={20} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Bed"><ChevronLeft size={20} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Bed"><ChevronRight size={20} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(beds.length - 1)} title="Last Bed"><ChevronsRight size={20} /></button>
        </div>

        <div className={styles.middleActions}>
          <button className={styles.secondaryBtn} onClick={handleNew}>
            <Plus size={16} /> New Bed
          </button>
          {formData.id && (
            <button className={styles.secondaryBtn} onClick={handleDelete} style={{ color: '#dc2626' }}>
              <Trash2 size={16} /> Deactivate
            </button>
          )}
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
            <Save size={18} /> {loading ? 'Saving...' : formData.id ? 'Update Bed' : 'Create Bed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BedMaster;
