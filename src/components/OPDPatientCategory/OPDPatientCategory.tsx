import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, Save, LogOut, CheckSquare, Square, Edit2, Trash2, CheckCircle2, Users
} from 'lucide-react';
import styles from './OPDPatientCategory.module.css';
import { patientApi, type PatientRecord } from '../../api/patientApi';

interface PatientCategoryItem {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  active: boolean;
}

const INITIAL_CATEGORIES: PatientCategoryItem[] = [
  { id: '1', code: 'GEN', description: 'General Private Patient', discountPercent: 0, active: true },
  { id: '2', code: 'SR-CIT', description: 'Senior Citizen (60+ Years)', discountPercent: 10, active: true },
  { id: '3', code: 'PMJAY', description: 'Ayushman Bharat / PMJAY Beneficiary', discountPercent: 0, active: true },
  { id: '4', code: 'STAFF', description: 'Hospital Staff & Immediate Dependents', discountPercent: 50, active: true },
  { id: '5', code: 'TPA', description: 'Corporate & Insurance TPA Cashless', discountPercent: 0, active: true },
  { id: '6', code: 'MJPJAY', description: 'Mahatma Jyotiba Phule Jan Arogya Yojana', discountPercent: 0, active: true },
  { id: '7', code: 'BPL', description: 'Below Poverty Line / Concessional Care', discountPercent: 25, active: true },
  { id: '8', code: 'TRUST', description: 'Hospital Trust & VIP Dignitaries', discountPercent: 100, active: true },
];

const OPDPatientCategory: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<PatientCategoryItem[]>(INITIAL_CATEGORIES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [notification, setNotification] = useState<string>('');
  const [print, setPrint] = useState<boolean>(false);

  useEffect(() => {
    patientApi.getPatients().then(res => {
      const pList = Array.isArray(res) ? res : ((res as any)?.patients || []);
      setPatients(pList);
    }).catch(() => {});
  }, []);

  const current = categories[currentIndex] || categories[0];

  const handleNav = (target: number) => {
    if (categories.length === 0) return;
    const bounded = Math.max(0, Math.min(target, categories.length - 1));
    setCurrentIndex(bounded);
  };

  const handleUpdateCurrent = (field: keyof PatientCategoryItem, value: any) => {
    if (!current) return;
    setCategories(prev => prev.map(c => c.id === current.id ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    setNotification(`Patient category '${current.code}' updated successfully!`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleAddNew = () => {
    const nextId = String(categories.length + 1);
    const newCat: PatientCategoryItem = {
      id: nextId,
      code: `CAT-${nextId}`,
      description: 'New Patient Category',
      discountPercent: 0,
      active: true,
    };
    setCategories(prev => [...prev, newCat]);
    setNotification(`New Category 'CAT-${nextId}' created!`);
    setTimeout(() => setNotification(''), 4000);
    setCurrentIndex(categories.length);
  };

  const handleDelete = () => {
    if (categories.length <= 1) return;
    setCategories(prev => prev.filter(c => c.id !== current.id));
    setNotification(`Category '${current.code}' removed.`);
    setTimeout(() => setNotification(''), 4000);
    handleNav(Math.max(0, currentIndex - 1));
  };

  // Compute patient count per category
  const getPatientCount = (desc: string, code: string) => {
    return patients.filter(p =>
      (p.category || '').toLowerCase() === desc.toLowerCase() ||
      (p.category || '').toLowerCase() === code.toLowerCase()
    ).length;
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className={styles.recordCounter}>{currentIndex + 1} of {categories.length}</span>
          <h1 className={styles.pageTitle}>OPD Patient Category Classification Master</h1>
        </div>
      </div>

      {notification && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 14px', borderRadius: '6px', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Form Container */}
      <div className={styles.formContainer}>
        <div className={styles.topSection}>
          <div className={styles.row}>
            <label className={styles.label}>Category Short Code :</label>
            <input
              type="text"
              className={styles.input}
              value={current?.code || ''}
              onChange={e => handleUpdateCurrent('code', e.target.value)}
              style={{ fontWeight: 700, maxWidth: '180px' }}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label}>Description / Full Name :</label>
            <input
              type="text"
              className={styles.input}
              value={current?.description || ''}
              onChange={e => handleUpdateCurrent('description', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label}>Default Discount (%):</label>
            <input
              type="number"
              min="0"
              max="100"
              className={styles.input}
              value={current?.discountPercent || 0}
              onChange={e => handleUpdateCurrent('discountPercent', Number(e.target.value))}
              style={{ maxWidth: '120px' }}
            />
          </div>
        </div>

        {/* Categories Table */}
        <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
            All Configured Patient Categories
          </div>
          <table className={styles.dataTable} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>
                <th style={{ padding: '8px 12px', width: '40px' }}>#</th>
                <th style={{ padding: '8px 12px', width: '100px' }}>Code</th>
                <th style={{ padding: '8px 12px' }}>Description</th>
                <th style={{ padding: '8px 12px', width: '120px', textAlign: 'center' }}>Discount</th>
                <th style={{ padding: '8px 12px', width: '140px', textAlign: 'center' }}>Registered Patients</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr
                  key={cat.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    backgroundColor: idx === currentIndex ? '#eff6ff' : undefined,
                    fontWeight: idx === currentIndex ? 600 : 400
                  }}
                >
                  <td style={{ padding: '10px 12px' }}>{idx + 1}</td>
                  <td style={{ padding: '10px 12px', color: '#2563eb', fontWeight: 600 }}>{cat.code}</td>
                  <td style={{ padding: '10px 12px' }}>{cat.description}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{cat.discountPercent}%</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: '#047857', fontWeight: 600 }}>
                    {getPatientCount(cat.description, cat.code)} Patients
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
          <button className={styles.navBtn} onClick={() => handleNav(categories.length - 1)} title="Last Record"><ChevronsRight size={20} /></button>
        </div>

        <div className={styles.middleActions}>
          <div className={styles.checkboxItem} onClick={() => setPrint(!print)} style={{ cursor: 'pointer' }}>
            {print ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} />}
            <span>Print Layout</span>
          </div>
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleAddNew}>
            <Save size={18} /> Add Category
          </button>
          <button className={styles.secondaryBtn} onClick={handleSave}>
            <Edit2 size={18} /> Save Changes
          </button>
          <button className={styles.dangerBtn} onClick={handleDelete} style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '0 16px', borderRadius: '6px', height: '38px', cursor: 'pointer', fontWeight: 500 }}>
            <Trash2 size={16} /> Delete
          </button>
          <button className={styles.secondaryBtn} style={{ marginLeft: '16px' }} onClick={() => navigate('/patient-registration')}>
            <LogOut size={18} /> Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default OPDPatientCategory;
