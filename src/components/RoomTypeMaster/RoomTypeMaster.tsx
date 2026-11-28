import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2
} from 'lucide-react';
import styles from './RoomTypeMaster.module.css';
import { roomTypeApi, type RoomTypeRecord } from '../../api/hospitalApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';
import GlobalBottomActionBar from '../common/GlobalBottomActionBar';

const defaultRoomType: RoomTypeRecord = {
  id: '',
  name: '',
  code: '',
  daily_rate: 1000,
  ac_type: 'Non-AC',
  total_beds: 10,
  is_active: true,
};

const RoomTypeMaster: React.FC = () => {
  const [roomTypes, setRoomTypes] = useState<RoomTypeRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<RoomTypeRecord>(defaultRoomType);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await roomTypeApi.getRoomTypes();
      setRoomTypes(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
      } else {
        setFormData({ ...defaultRoomType });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load room types.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNav = (target: number) => {
    if (roomTypes.length === 0) return;
    const bounded = Math.max(0, Math.min(target, roomTypes.length - 1));
    setCurrentIndex(bounded);
    setFormData(roomTypes[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultRoomType,
      code: `RT-${roomTypes.length + 1}`,
    });
    setNotification({ type: 'info', message: 'Enter details for new Room Type.' });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      setNotification({ type: 'warning', message: 'Please enter Name and Code.' });
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        const updated = await roomTypeApi.updateRoomType(formData.id, formData);
        setNotification({ type: 'success', message: `Room Type '${updated.name}' updated!` });
      } else {
        const created = await roomTypeApi.createRoomType(formData);
        setNotification({ type: 'success', message: `Room Type '${created.name}' created!` });
      }
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving room type.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    const ok = window.confirm(`Deactivate Room Type '${formData.name}'?`);
    if (!ok) return;

    try {
      setLoading(true);
      await roomTypeApi.deleteRoomType(formData.id, false);
      setNotification({ type: 'success', message: `Room Type '${formData.name}' deactivated.` });
      await loadData();
    } catch {
      setNotification({ type: 'error', message: 'Failed to deactivate room type.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.pageContainer} hasBottomActionBar`}>
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
            {roomTypes.length > 0 ? `${currentIndex + 1} of ${roomTypes.length}` : '0 of 0'}
          </span>
          <h1 className={styles.pageTitle}>Room Type Master</h1>
        </div>
        <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className={styles.formContainer}>
        {/* Form Inputs */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Room Type Name *</label>
              <input
                type="text"
                className={styles.input}
                style={{ width: '100%' }}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Short Code *</label>
              <input
                type="text"
                className={styles.input}
                style={{ width: '100%' }}
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Daily Rate (Rs.) *</label>
              <input
                type="number"
                min="0"
                step="50"
                className={styles.input}
                style={{ width: '100%' }}
                value={formData.daily_rate}
                onChange={e => setFormData({ ...formData, daily_rate: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>AC / Non-AC</label>
              <select
                className={styles.input}
                style={{ width: '100%' }}
                value={formData.ac_type}
                onChange={e => setFormData({ ...formData, ac_type: e.target.value })}
              >
                <option value="Non-AC">Non-AC</option>
                <option value="Central AC">Central AC</option>
                <option value="Split AC">Split AC</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Total Beds</label>
              <input
                type="number"
                min="1"
                className={styles.input}
                style={{ width: '100%' }}
                value={formData.total_beds}
                onChange={e => setFormData({ ...formData, total_beds: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Room Types Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Room Type Name</th>
                <th>Code</th>
                <th>Daily Rate (Rs.)</th>
                <th>AC Type</th>
                <th>Beds Count</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {roomTypes.map((rt, idx) => (
                <tr
                  key={rt.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setFormData(rt);
                  }}
                  style={{ cursor: 'pointer', backgroundColor: rt.id === formData.id ? '#eff6ff' : undefined }}
                >
                  <td>{rt.id}</td>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>{rt.name}</td>
                  <td>{rt.code}</td>
                  <td style={{ fontWeight: 600 }}>Rs. {rt.daily_rate}</td>
                  <td>{rt.ac_type}</td>
                  <td>{rt.total_beds}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: rt.is_active ? '#ecfdf5' : '#fee2e2',
                      color: rt.is_active ? '#065f46' : '#991b1b',
                    }}>
                      {rt.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Bottom Action Bar */}
      <GlobalBottomActionBar
        onSave={handleSave}
        saveLabel={loading ? 'Saving...' : formData.id ? 'Update Room Type' : 'Create Room Type'}
        isSaving={loading}
        isDirty={Boolean(formData.name && (!formData.id || (currentIndex >= 0 && roomTypes[currentIndex] && roomTypes[currentIndex].name !== formData.name)))}
        dirtyMessage="Unsaved Room Type Changes"
        onCancel={handleNew}
        cancelLabel="New Room Type"
        onDelete={formData.id ? handleDelete : undefined}
        deleteLabel="Deactivate Room Type"
        statusMessage={`${formData.name || 'New Room Type'} (${formData.code || 'Code'}) • ${formData.ac_type} • Tariff: Rs. ${formData.daily_rate}/day`}
        extraActions={
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <button type="button" className={styles.navBtn} onClick={() => handleNav(0)} title="First Record"><ChevronsLeft size={16} /></button>
            <button type="button" className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record"><ChevronLeft size={16} /></button>
            <button type="button" className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record"><ChevronRight size={16} /></button>
            <button type="button" className={styles.navBtn} onClick={() => handleNav(roomTypes.length - 1)} title="Last Record"><ChevronsRight size={16} /></button>
          </div>
        }
      />
    </div>
  );
};

export default RoomTypeMaster;
