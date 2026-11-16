import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Edit2, Trash2, LogOut, Printer, CheckCircle2, PhoneCall } from 'lucide-react';
import styles from './IntercommDisplay.module.css';
import { contactApi, type ContactRecord } from '../../api/masterApi';

interface IntercomRow {
  id: string;
  location: string;
  intercommNo: string;
  department: string;
}

const DEFAULT_INTERCOMS: IntercomRow[] = [
  { id: '1', location: 'Dr. Nilesh Mahale (Chief Consultant)', intercommNo: '101', department: 'Cardiology' },
  { id: '2', location: 'Dr. Snehal Mahale (Senior Surgeon)', intercommNo: '102', department: 'Surgery' },
  { id: '3', location: 'Emergency & Casualty Triage Desk', intercommNo: '105', department: 'Casualty' },
  { id: '4', location: 'ICU Incharge & Monitoring Station', intercommNo: '201', department: 'Intensive Care Unit' },
  { id: '5', location: 'NICU / Pediatric Ward Desk', intercommNo: '205', department: 'Pediatrics' },
  { id: '6', location: 'Operation Theatre (OT 1 & 2) Complex', intercommNo: '301', department: 'OT Complex' },
  { id: '7', location: 'Central Pharmacy & Medication Store', intercommNo: '401', department: 'Pharmacy' },
  { id: '8', location: 'Diagnostics Laboratory (Pathology & Bio)', intercommNo: '405', department: 'Laboratory' },
  { id: '9', location: 'Billing, TPA Cashless & Insurance Desk', intercommNo: '501', department: 'Billing' },
  { id: '10', location: 'Patient Registration & Reception Desk', intercommNo: '502', department: 'Front Desk' },
  { id: '11', location: '2D Echocardiography & ECG Station', intercommNo: '601', department: 'Cardiology Lab' },
  { id: '12', location: 'Radiology & X-Ray Examination Room', intercommNo: '605', department: 'Radiology' },
];

const IntercommDisplay: React.FC = () => {
  const navigate = useNavigate();
  const [intercoms, setIntercoms] = useState<IntercomRow[]>(DEFAULT_INTERCOMS);
  const [selectedId, setSelectedId] = useState<string>('1');

  // Form fields
  const [location, setLocation] = useState<string>('');
  const [intercommNo, setIntercommNo] = useState<string>('');
  const [isNoWise, setIsNoWise] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    contactApi.getAll().then(res => {
      if (res && res.length > 0) {
        const mapped: IntercomRow[] = res.map((c, i) => ({
          id: c.id || String(i + 1),
          location: `${c.name} (${c.department || 'Hospital'})`,
          intercommNo: c.intercomm || String(100 + i),
          department: c.department || 'General',
        }));
        setIntercoms(mapped);
        setLocation(mapped[0].location);
        setIntercommNo(mapped[0].intercommNo);
        setSelectedId(mapped[0].id);
      } else {
        setLocation(DEFAULT_INTERCOMS[0].location);
        setIntercommNo(DEFAULT_INTERCOMS[0].intercommNo);
      }
    }).catch(() => {
      setLocation(DEFAULT_INTERCOMS[0].location);
      setIntercommNo(DEFAULT_INTERCOMS[0].intercommNo);
    });
  }, []);

  const handleSelectRow = (row: IntercomRow) => {
    setSelectedId(row.id);
    setLocation(row.location);
    setIntercommNo(row.intercommNo);
  };

  const handleSave = () => {
    if (!location.trim() || !intercommNo.trim()) return;
    const existing = intercoms.find(i => i.id === selectedId);
    if (existing) {
      setIntercoms(prev => prev.map(i => i.id === selectedId ? { ...i, location, intercommNo } : i));
      setNotification(`Intercom extension '${intercommNo}' updated successfully!`);
    } else {
      const newRow: IntercomRow = {
        id: String(Date.now()),
        location: location.trim(),
        intercommNo: intercommNo.trim(),
        department: 'General',
      };
      setIntercoms(prev => [...prev, newRow]);
      setSelectedId(newRow.id);
      setNotification(`Intercom extension '${intercommNo}' added!`);
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDelete = () => {
    if (intercoms.length <= 1) return;
    setIntercoms(prev => prev.filter(i => i.id !== selectedId));
    setNotification('Extension removed.');
    setTimeout(() => setNotification(''), 4000);
    if (intercoms.length > 1) {
      handleSelectRow(intercoms[0]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Sorted list
  const displayList = useMemo(() => {
    const list = [...intercoms];
    if (isNoWise) {
      return list.sort((a, b) => Number(a.intercommNo || 0) - Number(b.intercommNo || 0));
    }
    return list.sort((a, b) => a.location.localeCompare(b.location));
  }, [intercoms, isNoWise]);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PhoneCall size={24} color="#2563eb" />
          <h1 className={styles.pageTitle}>Hospital Intercom & Extension Directory</h1>
        </div>
      </div>

      {notification && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 14px', borderRadius: '6px', margin: '14px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Top Section */}
      <div className={styles.topSection}>
        {/* Form Inputs */}
        <div className={styles.formArea}>
          <div className={styles.fieldGroup} style={{ flex: 2 }}>
            <label className={styles.label}>Location / Department / Doctor Desk</label>
            <input
              type="text"
              className={styles.input}
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. ICU Station 1"
            />
          </div>
          <div className={styles.fieldGroup} style={{ flex: 1, maxWidth: '200px' }}>
            <label className={styles.label}>Intercomm Extension #</label>
            <input
              type="text"
              className={styles.input}
              value={intercommNo}
              onChange={e => setIntercommNo(e.target.value)}
              placeholder="e.g. 201"
              style={{ fontWeight: 700, color: '#2563eb' }}
            />
          </div>
        </div>

        {/* Actions Area */}
        <div className={styles.actionsArea}>
          <div className={styles.buttonRow}>
            <button className={styles.primaryBtn} onClick={handleSave}>
              <Save size={16} /> Save Entry
            </button>
            <button className={styles.dangerBtn} onClick={handleDelete}>
              <Trash2 size={16} /> Delete
            </button>
          </div>

          <div className={styles.buttonRow}>
            <button className={styles.secondaryBtn} onClick={handlePrint}>
              <Printer size={16} /> Print Directory
            </button>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="noWise"
                className={styles.checkbox}
                checked={isNoWise}
                onChange={e => setIsNoWise(e.target.checked)}
              />
              <label htmlFor="noWise" className={styles.checkboxLabel} style={{ cursor: 'pointer' }}>Sort No. Wise</label>
            </div>
            <button className={styles.secondaryBtn} onClick={() => navigate('/contact-list')}>
              <LogOut size={16} /> Exit
            </button>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Location / Clinical Department</th>
                <th style={{ width: '180px', textAlign: 'center' }}>Intercomm Extension No</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((row, idx) => (
                <tr
                  key={row.id}
                  onClick={() => handleSelectRow(row)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: row.id === selectedId ? '#eff6ff' : undefined,
                    fontWeight: row.id === selectedId ? 600 : 400
                  }}
                >
                  <td>{idx + 1}</td>
                  <td>{row.location}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: '#2563eb' }}>
                    {row.intercommNo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IntercommDisplay;
