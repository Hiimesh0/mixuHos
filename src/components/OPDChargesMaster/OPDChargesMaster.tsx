import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, Save, LogOut, CheckSquare, Square, Edit2, Trash2, ArrowDownCircle, CheckCircle2
} from 'lucide-react';
import styles from './OPDChargesMaster.module.css';

interface ChargeItem {
  id: string;
  name: string;
  group: string;
  shortName: string;
  priority: number;
  rate: number;
  active: boolean;
  isBio: boolean;
  concernDr: boolean;
  excludeRoomRate: boolean;
  outsideTest: boolean;
  testFor: 'Both' | 'Male' | 'Female';
  unit?: string;
  refRange?: string;
}

const INITIAL_CHARGES: ChargeItem[] = [
  { id: 'CHG-001', name: 'General Consultation Charge', group: 'OPD-GEN', shortName: 'CONS', priority: 1, rate: 500, active: true, isBio: false, concernDr: true, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'Visit' },
  { id: 'CHG-002', name: 'Follow-up Consultation', group: 'OPD-GEN', shortName: 'FUP', priority: 2, rate: 300, active: true, isBio: false, concernDr: true, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'Visit' },
  { id: 'CHG-003', name: 'Emergency / Casualty Triage', group: 'OPD-EMG', shortName: 'EMG', priority: 1, rate: 750, active: true, isBio: false, concernDr: true, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'Episode' },
  { id: 'CHG-004', name: 'Complete Blood Count (CBC)', group: 'OPD-BCH', shortName: 'CBC', priority: 1, rate: 350, active: true, isBio: true, concernDr: false, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'Report', refRange: 'Standard' },
  { id: 'CHG-005', name: 'Lipid Profile Comprehensive', group: 'OPD-BCH', shortName: 'LIPID', priority: 2, rate: 900, active: true, isBio: true, concernDr: false, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'mg/dL', refRange: 'Fasting' },
  { id: 'CHG-006', name: 'Liver Function Test (LFT)', group: 'OPD-BCH', shortName: 'LFT', priority: 2, rate: 800, active: true, isBio: true, concernDr: false, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'IU/L', refRange: 'Enzyme' },
  { id: 'CHG-007', name: 'Kidney Function Test (KFT)', group: 'OPD-BCH', shortName: 'KFT', priority: 2, rate: 750, active: true, isBio: true, concernDr: false, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'mg/dL', refRange: 'Urea/Creat' },
  { id: 'CHG-008', name: '12-Lead Electrocardiogram (ECG)', group: 'OPD-CARD', shortName: 'ECG', priority: 1, rate: 350, active: true, isBio: false, concernDr: true, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'Tracing' },
  { id: 'CHG-009', name: 'Chest X-Ray PA View', group: 'OPD-RAD', shortName: 'CXR', priority: 1, rate: 400, active: true, isBio: false, concernDr: false, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'Film' },
  { id: 'CHG-010', name: 'Urine Routine & Microscopy', group: 'OPD-PATH', shortName: 'URINE', priority: 3, rate: 200, active: true, isBio: true, concernDr: false, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'HPF' },
  { id: 'CHG-011', name: 'Minor Surgical Procedure / Suture', group: 'OPD-SURG', shortName: 'SUTR', priority: 3, rate: 1200, active: true, isBio: false, concernDr: true, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'Proc' },
  { id: 'CHG-012', name: 'Dressing & Wound Care', group: 'OPD-GEN', shortName: 'DRSS', priority: 4, rate: 200, active: true, isBio: false, concernDr: false, excludeRoomRate: false, outsideTest: false, testFor: 'Both', unit: 'Session' }
];

const OPDChargesMaster: React.FC = () => {
  const navigate = useNavigate();
  const [charges, setCharges] = useState<ChargeItem[]>(INITIAL_CHARGES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [listType, setListType] = useState<'all' | 'active' | 'inactive'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

  const filteredCharges = useMemo(() => {
    return charges.filter(c => {
      if (listType === 'active' && !c.active) return false;
      if (listType === 'inactive' && c.active) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.group.toLowerCase().includes(q);
      }
      return true;
    });
  }, [charges, listType, searchQuery]);

  const current = filteredCharges[currentIndex] || filteredCharges[0] || charges[0];

  const handleNav = (target: number) => {
    if (filteredCharges.length === 0) return;
    const bounded = Math.max(0, Math.min(target, filteredCharges.length - 1));
    setCurrentIndex(bounded);
  };

  const handleUpdateCurrent = (field: keyof ChargeItem, value: any) => {
    if (!current) return;
    setCharges(prev => prev.map(c => c.id === current.id ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    setNotification(`Charge item '${current.id} - ${current.name}' saved successfully!`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleAddNew = () => {
    const nextSeq = charges.length + 1;
    const newId = `CHG-${String(nextSeq).padStart(3, '0')}`;
    const newCharge: ChargeItem = {
      id: newId,
      name: 'New Diagnostics Charge',
      group: 'OPD-BCH',
      shortName: 'NEW',
      priority: 5,
      rate: 500,
      active: true,
      isBio: true,
      concernDr: false,
      excludeRoomRate: false,
      outsideTest: false,
      testFor: 'Both',
      unit: 'Test',
    };
    setCharges(prev => [...prev, newCharge]);
    setNotification(`New charge '${newId}' added!`);
    setTimeout(() => setNotification(''), 4000);
    setCurrentIndex(filteredCharges.length);
  };

  const handleDelete = () => {
    if (!current) return;
    setCharges(prev => prev.filter(c => c.id !== current.id));
    setNotification(`Charge '${current.id}' removed.`);
    setTimeout(() => setNotification(''), 4000);
    handleNav(Math.max(0, currentIndex - 1));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.badge}>
            {filteredCharges.length > 0 ? `${currentIndex + 1} of ${filteredCharges.length}` : '0 of 0'}
          </span>
          <span className={styles.badge} style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', borderColor: 'var(--primary-soft)' }}>
            Test ID: {current?.id || '--'}
          </span>
          <h1 className={styles.pageTitle}>OPD Charges / Diagnostics Master</h1>
        </div>
        <div className={styles.headerRight}>
          <label className={styles.label} style={{ width: 'auto' }}>Test For :</label>
          <select
            className={`${styles.input} ${styles.inputMedium}`}
            value={current?.testFor || 'Both'}
            onChange={e => handleUpdateCurrent('testFor', e.target.value)}
          >
            <option value="Both">Both</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {notification && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 14px', borderRadius: '6px', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Form Container */}
      <div className={styles.formContainer}>
        <div className={styles.mainSection}>
          {/* Row 1 */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Group :</label>
              <select
                className={`${styles.input} ${styles.inputMedium}`}
                value={current?.group || 'OPD-BCH'}
                onChange={e => handleUpdateCurrent('group', e.target.value)}
              >
                <option value="OPD-GEN">OPD-GEN (General)</option>
                <option value="OPD-BCH">OPD-BCH (Biochemistry)</option>
                <option value="OPD-PATH">OPD-PATH (Pathology)</option>
                <option value="OPD-CARD">OPD-CARD (Cardiology)</option>
                <option value="OPD-RAD">OPD-RAD (Radiology)</option>
                <option value="OPD-SURG">OPD-SURG (Surgical)</option>
                <option value="OPD-EMG">OPD-EMG (Emergency)</option>
              </select>
            </div>
            <div
              className={styles.checkboxItem}
              onClick={() => handleUpdateCurrent('concernDr', !current?.concernDr)}
              style={{ width: '180px', marginLeft: '16px', cursor: 'pointer' }}
            >
              {current?.concernDr ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} />}
              <span>Concern Dr Compulsory</span>
            </div>
            <div className={styles.fieldGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Search / Filter:</label>
              <input
                type="text"
                className={`${styles.input} ${styles.inputLarge}`}
                placeholder="Type to filter charges..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentIndex(0);
                }}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 2 }}>
              <label className={styles.label}>Test Name :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.inputLarge}`}
                value={current?.name || ''}
                onChange={e => handleUpdateCurrent('name', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ width: '80px' }}>Short Name :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.inputSmall}`}
                value={current?.shortName || ''}
                onChange={e => handleUpdateCurrent('shortName', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ width: '60px' }}>Priority :</label>
              <input
                type="number"
                className={`${styles.input} ${styles.inputSmall}`}
                value={current?.priority || 1}
                onChange={e => handleUpdateCurrent('priority', Number(e.target.value))}
              />
            </div>
            <div
              className={styles.checkboxItem}
              onClick={() => handleUpdateCurrent('isBio', !current?.isBio)}
              style={{ cursor: 'pointer' }}
            >
              {current?.isBio ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} color="var(--text-muted)" />}
              <span style={{ color: current?.isBio ? 'var(--text-main)' : 'var(--text-muted)' }}>BIO</span>
            </div>
            <div
              className={styles.checkboxItem}
              onClick={() => handleUpdateCurrent('active', !current?.active)}
              style={{ cursor: 'pointer' }}
            >
              {current?.active ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} />}
              <span>ACTIVE</span>
            </div>
          </div>

          {/* Row 3 */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Rate (₹) :</label>
              <input
                type="number"
                min="0"
                step="1"
                className={`${styles.input} ${styles.inputSmall} ${styles.inputYellow}`}
                value={current?.rate || 0}
                onChange={e => handleUpdateCurrent('rate', Number(e.target.value))}
                style={{ fontWeight: 700 }}
              />
            </div>
            <div className={styles.fieldGroup} style={{ marginLeft: '16px' }}>
              <label className={styles.label} style={{ width: '100px' }}>Unit / Scope :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.inputSmall}`}
                value={current?.unit || ''}
                onChange={e => handleUpdateCurrent('unit', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ marginLeft: '16px', flex: 1 }}>
              <label className={styles.label} style={{ width: '80px' }}>Ref Range :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.inputMedium}`}
                value={current?.refRange || 'Standard reference parameters'}
                onChange={e => handleUpdateCurrent('refRange', e.target.value)}
              />
            </div>
            <div
              className={styles.checkboxItem}
              onClick={() => handleUpdateCurrent('excludeRoomRate', !current?.excludeRoomRate)}
              style={{ marginLeft: '16px', cursor: 'pointer' }}
            >
              {current?.excludeRoomRate ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} color="var(--text-muted)" />}
              <span style={{ color: current?.excludeRoomRate ? 'var(--text-main)' : 'var(--text-muted)' }}>Exclude in Room Rate</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '14px 0' }} />

          {/* Table Data View of all charges */}
          <div className={styles.tableSection}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
              Active Charges Inventory ({filteredCharges.length} items)
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Code</th>
                    <th>Test / Charge Name</th>
                    <th style={{ width: '120px' }}>Group</th>
                    <th style={{ width: '90px' }}>Short</th>
                    <th style={{ width: '100px', textAlign: 'right' }}>Rate (₹)</th>
                    <th style={{ width: '80px' }}>Status</th>
                    <th style={{ width: '90px' }}>Scope</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCharges.map((item, idx) => (
                    <tr
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: idx === currentIndex ? '#eff6ff' : undefined,
                        fontWeight: idx === currentIndex ? 600 : 400
                      }}
                    >
                      <td style={{ color: '#2563eb', fontWeight: 600 }}>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.group}</td>
                      <td>{item.shortName}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: '#166534' }}>₹{item.rate.toLocaleString()}</td>
                      <td>
                        <span style={{
                          padding: '1px 6px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          background: item.active ? '#f0fdf4' : '#fef2f2',
                          color: item.active ? '#166534' : '#991b1b'
                        }}>
                          {item.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{item.testFor}</td>
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
            <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Record"><ChevronsLeft size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record"><ChevronLeft size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record"><ChevronRight size={18} /></button>
            <button className={styles.navBtn} onClick={() => handleNav(filteredCharges.length - 1)} title="Last Record"><ChevronsRight size={18} /></button>
          </div>

          <div className={styles.middleActions}>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input type="radio" name="filter" checked={listType === 'all'} onChange={() => { setListType('all'); setCurrentIndex(0); }} /> All
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="filter" checked={listType === 'active'} onChange={() => { setListType('active'); setCurrentIndex(0); }} /> Active
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="filter" checked={listType === 'inactive'} onChange={() => { setListType('inactive'); setCurrentIndex(0); }} /> InActive
              </label>
            </div>
          </div>

          <div className={styles.rightActions}>
            <button className={styles.primaryBtn} onClick={handleAddNew}>
              <Save size={16} /> Add New
            </button>
            <button className={styles.secondaryBtn} onClick={handleSave}>
              <Edit2 size={16} /> Save Changes
            </button>
            <button className={styles.dangerBtn} onClick={handleDelete}>
              <Trash2 size={16} /> Delete
            </button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/billing')}>
              <LogOut size={16} /> Exit to Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OPDChargesMaster;
