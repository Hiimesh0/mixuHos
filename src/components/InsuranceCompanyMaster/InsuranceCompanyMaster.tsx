import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2
} from 'lucide-react';
import styles from './InsuranceCompanyMaster.module.css';
import { insuranceCompanyApi, type InsuranceCompanyRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

const defaultCompany: InsuranceCompanyRecord = {
  id: '',
  name: '',
  code: '',
  tpa_name: '',
  phone: '',
  email: '',
  no_ipd_charges: false,
  is_active: true,
};

const InsuranceCompanyMaster: React.FC = () => {
  const [companies, setCompanies] = useState<InsuranceCompanyRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<InsuranceCompanyRecord>(defaultCompany);
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const list = await insuranceCompanyApi.getAll();
      setCompanies(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
      } else {
        setFormData({ ...defaultCompany });
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load insurance companies.' });
    } finally {
      setLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNav = (target: number) => {
    if (companies.length === 0) return;
    const bounded = Math.max(0, Math.min(target, companies.length - 1));
    setCurrentIndex(bounded);
    setFormData(companies[bounded]);
  };

  const handleNew = () => {
    setCurrentIndex(-1);
    setFormData({
      ...defaultCompany,
      code: `INS-0${companies.length + 1}`,
    });
    setNotification({ type: 'info', message: 'Enter new Insurance / TPA company details.' });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      setNotification({ type: 'warning', message: 'Please enter Company Name and Code.' });
      return;
    }

    try {
      setLoading(true);
      if (formData.id) {
        const updated = await insuranceCompanyApi.update(formData.id, formData);
        setNotification({ type: 'success', message: `Insurance company '${updated.name}' updated!` });
      } else {
        const created = await insuranceCompanyApi.create(formData);
        setNotification({ type: 'success', message: `Insurance company '${created.name}' created!` });
      }
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving company.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    const ok = window.confirm(`Deactivate '${formData.name}'?`);
    if (!ok) return;

    try {
      setLoading(true);
      await insuranceCompanyApi.delete(formData.id, false);
      setNotification({ type: 'success', message: `Insurance company '${formData.name}' deactivated.` });
      await loadData();
    } catch {
      setNotification({ type: 'error', message: 'Failed to deactivate company.' });
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
        <div className={styles.headerLeft}>
          <span className={styles.recordCounter}>
            {companies.length > 0 ? `${currentIndex + 1} of ${companies.length}` : '0 of 0'}
          </span>
          <h1 className={styles.pageTitle}>Insurance / TPA Cashless Master</h1>
        </div>
        <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.section}>
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Company Code *</label>
              <input
                type="text"
                className={styles.input}
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 2 }}>
              <label className={styles.label}>Company Name *</label>
              <input
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
              <label className={styles.label}>TPA Name</label>
              <input
                type="text"
                className={styles.input}
                value={formData.tpa_name || ''}
                onChange={e => setFormData({ ...formData, tpa_name: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Phone / Helplines</label>
              <input
                type="text"
                className={styles.input}
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>TPA Desk Email</label>
              <input
                type="email"
                className={styles.input}
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Company List Table */}
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>ID</th>
                <th style={{ padding: '8px 12px' }}>Code</th>
                <th style={{ padding: '8px 12px' }}>Company Name</th>
                <th style={{ padding: '8px 12px' }}>TPA Name</th>
                <th style={{ padding: '8px 12px' }}>Phone</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c, idx) => (
                <tr
                  key={c.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setFormData(c);
                  }}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    backgroundColor: c.id === formData.id ? '#eff6ff' : undefined,
                  }}
                >
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{c.id}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 700, color: '#2563eb' }}>{c.code}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: '8px 12px' }}>{c.tpa_name || '-'}</td>
                  <td style={{ padding: '8px 12px' }}>{c.phone || '-'}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: c.is_active ? '#ecfdf5' : '#fee2e2',
                      color: c.is_active ? '#065f46' : '#991b1b',
                    }}>
                      {c.is_active ? 'Active' : 'Inactive'}
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
          <button className={styles.navBtn} onClick={() => handleNav(companies.length - 1)} title="Last Record"><ChevronsRight size={20} /></button>
        </div>

        <div className={styles.middleActions}>
          <button className={styles.secondaryBtn} onClick={handleNew}>
            <Plus size={16} /> New Company
          </button>
          {formData.id && (
            <button className={styles.secondaryBtn} onClick={handleDelete} style={{ color: '#dc2626' }}>
              <Trash2 size={16} /> Deactivate
            </button>
          )}
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleSave} disabled={loading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
            <Save size={18} /> {loading ? 'Saving...' : formData.id ? 'Update Company' : 'Create Company'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCompanyMaster;
