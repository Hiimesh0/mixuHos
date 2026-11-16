import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, Save, LogOut, CheckSquare, Square, Edit2, Trash2, ArrowDownCircle, X, CheckCircle2
} from 'lucide-react';
import styles from './OPDChargesProfile.module.css';

interface SubTestItem {
  id: string;
  group: string;
  testName: string;
  priority: number;
}

interface TestProfile {
  id: string;
  profileName: string;
  group: string;
  shortName: string;
  priority: number;
  rate: number;
  active: boolean;
  isBio: boolean;
  concernDr: boolean;
  testFor: 'Both' | 'Male' | 'Female';
  subTests: SubTestItem[];
}

const INITIAL_PROFILES: TestProfile[] = [
  {
    id: 'PRF-001',
    profileName: 'Lipid Profile Comprehensive',
    group: 'OPD-BCH',
    shortName: 'LIPID',
    priority: 1,
    rate: 900,
    active: true,
    isBio: true,
    concernDr: false,
    testFor: 'Both',
    subTests: [
      { id: '1', group: 'OPD-BCH', testName: 'Serum Total Cholesterol', priority: 1 },
      { id: '2', group: 'OPD-BCH', testName: 'Serum Triglycerides', priority: 2 },
      { id: '3', group: 'OPD-BCH', testName: 'Serum HDL Cholesterol (Good)', priority: 3 },
      { id: '4', group: 'OPD-BCH', testName: 'Serum LDL Cholesterol (Bad)', priority: 4 },
      { id: '5', group: 'OPD-BCH', testName: 'Serum VLDL Cholesterol', priority: 5 },
      { id: '6', group: 'OPD-BCH', testName: 'Total Cholesterol / HDL Ratio', priority: 6 },
    ]
  },
  {
    id: 'PRF-002',
    profileName: 'Complete Blood Count (CBC) Profile',
    group: 'OPD-HEM',
    shortName: 'CBC',
    priority: 1,
    rate: 350,
    active: true,
    isBio: true,
    concernDr: false,
    testFor: 'Both',
    subTests: [
      { id: '1', group: 'OPD-HEM', testName: 'Hemoglobin (Hb)', priority: 1 },
      { id: '2', group: 'OPD-HEM', testName: 'Total RBC Count', priority: 2 },
      { id: '3', group: 'OPD-HEM', testName: 'Total Leukocyte Count (TLC/WBC)', priority: 3 },
      { id: '4', group: 'OPD-HEM', testName: 'Platelet Count', priority: 4 },
      { id: '5', group: 'OPD-HEM', testName: 'Hematocrit (PCV)', priority: 5 },
      { id: '6', group: 'OPD-HEM', testName: 'Erythrocyte Sedimentation Rate (ESR)', priority: 6 },
    ]
  },
  {
    id: 'PRF-003',
    profileName: 'Liver Function Test (LFT) Profile',
    group: 'OPD-BCH',
    shortName: 'LFT',
    priority: 2,
    rate: 800,
    active: true,
    isBio: true,
    concernDr: false,
    testFor: 'Both',
    subTests: [
      { id: '1', group: 'OPD-BCH', testName: 'Serum Bilirubin Total', priority: 1 },
      { id: '2', group: 'OPD-BCH', testName: 'Serum Bilirubin Direct', priority: 2 },
      { id: '3', group: 'OPD-BCH', testName: 'Serum SGOT / AST', priority: 3 },
      { id: '4', group: 'OPD-BCH', testName: 'Serum SGPT / ALT', priority: 4 },
      { id: '5', group: 'OPD-BCH', testName: 'Serum Alkaline Phosphatase (ALP)', priority: 5 },
      { id: '6', group: 'OPD-BCH', testName: 'Serum Total Proteins & Albumin', priority: 6 },
    ]
  },
  {
    id: 'PRF-004',
    profileName: 'Renal Function Profile (KFT)',
    group: 'OPD-BCH',
    shortName: 'KFT',
    priority: 2,
    rate: 750,
    active: true,
    isBio: true,
    concernDr: false,
    testFor: 'Both',
    subTests: [
      { id: '1', group: 'OPD-BCH', testName: 'Blood Urea Nitrogen (BUN)', priority: 1 },
      { id: '2', group: 'OPD-BCH', testName: 'Serum Creatinine', priority: 2 },
      { id: '3', group: 'OPD-BCH', testName: 'Serum Uric Acid', priority: 3 },
      { id: '4', group: 'OPD-BCH', testName: 'Serum Sodium & Potassium (Electrolytes)', priority: 4 },
    ]
  },
  {
    id: 'PRF-005',
    profileName: 'Comprehensive Diabetic Evaluation Panel',
    group: 'OPD-BCH',
    shortName: 'DIAB',
    priority: 3,
    rate: 1100,
    active: true,
    isBio: true,
    concernDr: false,
    testFor: 'Both',
    subTests: [
      { id: '1', group: 'OPD-BCH', testName: 'Fasting Blood Sugar (FBS)', priority: 1 },
      { id: '2', group: 'OPD-BCH', testName: 'Post Prandial Blood Sugar (PPBS)', priority: 2 },
      { id: '3', group: 'OPD-BCH', testName: 'Glycated Hemoglobin (HbA1c)', priority: 3 },
      { id: '4', group: 'OPD-BCH', testName: 'Urine Microalbumin / Creatinine Ratio', priority: 4 },
    ]
  }
];

const OPDChargesProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<TestProfile[]>(INITIAL_PROFILES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [listType, setListType] = useState<'all' | 'active' | 'inactive'>('active');
  const [notification, setNotification] = useState<string>('');

  // Subtest add inputs
  const [newSubGroup, setNewSubGroup] = useState<string>('OPD-BCH');
  const [newSubName, setNewSubName] = useState<string>('');
  const [newSubPriority, setNewSubPriority] = useState<number>(1);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      if (listType === 'active' && !p.active) return false;
      if (listType === 'inactive' && p.active) return false;
      return true;
    });
  }, [profiles, listType]);

  const current = filteredProfiles[currentIndex] || filteredProfiles[0] || profiles[0];

  const handleNav = (target: number) => {
    if (filteredProfiles.length === 0) return;
    const bounded = Math.max(0, Math.min(target, filteredProfiles.length - 1));
    setCurrentIndex(bounded);
  };

  const handleUpdateCurrent = (field: keyof TestProfile, value: any) => {
    if (!current) return;
    setProfiles(prev => prev.map(p => p.id === current.id ? { ...p, [field]: value } : p));
  };

  const handleAddSubTest = () => {
    if (!newSubName.trim() || !current) return;
    const newItem: SubTestItem = {
      id: String(Date.now()),
      group: newSubGroup,
      testName: newSubName.trim(),
      priority: Number(newSubPriority),
    };
    handleUpdateCurrent('subTests', [...current.subTests, newItem]);
    setNewSubName('');
    setNewSubPriority(current.subTests.length + 2);
  };

  const handleDeleteSubTest = (id: string) => {
    if (!current) return;
    handleUpdateCurrent('subTests', current.subTests.filter(s => s.id !== id));
  };

  const handleSave = () => {
    setNotification(`Test profile '${current.id} - ${current.profileName}' saved successfully!`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleAddNewProfile = () => {
    const nextSeq = profiles.length + 1;
    const newId = `PRF-${String(nextSeq).padStart(3, '0')}`;
    const newP: TestProfile = {
      id: newId,
      profileName: 'New Diagnostic Panel',
      group: 'OPD-BCH',
      shortName: 'PANEL',
      priority: 5,
      rate: 950,
      active: true,
      isBio: true,
      concernDr: false,
      testFor: 'Both',
      subTests: [
        { id: '1', group: 'OPD-BCH', testName: 'Parameter 1', priority: 1 }
      ]
    };
    setProfiles(prev => [...prev, newP]);
    setNotification(`New Profile '${newId}' created!`);
    setTimeout(() => setNotification(''), 4000);
    setCurrentIndex(filteredProfiles.length);
  };

  const handleDeleteProfile = () => {
    if (!current) return;
    setProfiles(prev => prev.filter(p => p.id !== current.id));
    setNotification(`Profile '${current.id}' removed.`);
    setTimeout(() => setNotification(''), 4000);
    handleNav(Math.max(0, currentIndex - 1));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.badge}>
            {filteredProfiles.length > 0 ? `${currentIndex + 1} of ${filteredProfiles.length}` : '0 of 0'}
          </span>
          <span className={styles.badge} style={{ backgroundColor: 'var(--primary-soft)', color: 'var(--primary)', borderColor: 'var(--primary-soft)' }}>
            Profile ID: {current?.id || '--'}
          </span>
          <h1 className={styles.pageTitle}>Diagnostic Test Profiles & Bundles</h1>
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
                <option value="OPD-BCH">OPD-BCH (Biochemistry)</option>
                <option value="OPD-HEM">OPD-HEM (Hematology)</option>
                <option value="OPD-PATH">OPD-PATH (Pathology)</option>
                <option value="OPD-CARD">OPD-CARD (Cardiology)</option>
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
              <label className={styles.label}>Package Tariff (₹) :</label>
              <input
                type="number"
                className={styles.input}
                value={current?.rate || 0}
                onChange={e => handleUpdateCurrent('rate', Number(e.target.value))}
                style={{ fontWeight: 700, color: '#166534', maxWidth: '160px' }}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className={styles.row}>
            <div className={styles.fieldGroup} style={{ flex: 2 }}>
              <label className={styles.label}>Profile Name :</label>
              <input
                type="text"
                className={styles.input}
                value={current?.profileName || ''}
                onChange={e => handleUpdateCurrent('profileName', e.target.value)}
                style={{ flex: 1 }}
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
              {current?.active ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} color="var(--text-muted)" />}
              <span style={{ color: current?.active ? 'var(--text-main)' : 'var(--text-muted)' }}>ACTIVE</span>
            </div>
          </div>

          {/* Table Section: Sub-tests in profile */}
          <div className={styles.tableSection}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
              Sub-Tests Included in this Profile ({current?.subTests?.length || 0} tests)
            </div>

            <div className={styles.entryRow}>
              <div className={styles.entryCol} style={{ width: '150px' }}>
                <span className={styles.entryLabel}>Group Name</span>
                <select
                  className={`${styles.input} ${styles.entryInput}`}
                  value={newSubGroup}
                  onChange={e => setNewSubGroup(e.target.value)}
                >
                  <option value="OPD-BCH">OPD-BCH</option>
                  <option value="OPD-HEM">OPD-HEM</option>
                  <option value="OPD-PATH">OPD-PATH</option>
                  <option value="OPD-CARD">OPD-CARD</option>
                </select>
              </div>
              <div className={styles.entryCol} style={{ flex: 1 }}>
                <span className={styles.entryLabel}>Test / Parameter Name</span>
                <input
                  type="text"
                  className={styles.entryInput}
                  placeholder="e.g. Serum Total Cholesterol"
                  value={newSubName}
                  onChange={e => setNewSubName(e.target.value)}
                />
              </div>
              <div className={styles.entryCol} style={{ width: '80px' }}>
                <span className={styles.entryLabel}>Priority</span>
                <input
                  type="number"
                  className={styles.entryInput}
                  value={newSubPriority}
                  onChange={e => setNewSubPriority(Number(e.target.value))}
                />
              </div>
              <div className={styles.entryCol} style={{ width: '100px', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '2px' }}>
                <button className={styles.iconBtn} onClick={handleAddSubTest} title="Add Subtest to Profile">
                  <ArrowDownCircle size={18} />
                </button>
                <button className={styles.iconBtn} style={{ marginLeft: '8px' }} onClick={() => setNewSubName('')} title="Clear">
                  <X size={18} />
                </button>
              </div>
            </div>

            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '36px' }}>#</th>
                  <th style={{ width: '160px' }}>Group</th>
                  <th>Test Parameter Name</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Priority</th>
                  <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {!current?.subTests || current.subTests.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                      No sub-tests assigned to this profile yet.
                    </td>
                  </tr>
                ) : (
                  current.subTests.map((sub, idx) => (
                    <tr key={sub.id}>
                      <td>{idx + 1}</td>
                      <td>{sub.group}</td>
                      <td style={{ fontWeight: 600 }}>{sub.testName}</td>
                      <td style={{ textAlign: 'center' }}>{sub.priority}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubTest(sub.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                          title="Remove subtest"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
            <button className={styles.navBtn} onClick={() => handleNav(filteredProfiles.length - 1)} title="Last Record"><ChevronsRight size={18} /></button>
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
            <button className={styles.primaryBtn} onClick={handleAddNewProfile}>
              <Save size={16} /> Add New Profile
            </button>
            <button className={styles.secondaryBtn} onClick={handleSave}>
              <Edit2 size={16} /> Save Profile
            </button>
            <button className={styles.dangerBtn} onClick={handleDeleteProfile}>
              <Trash2 size={16} /> Delete
            </button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/opd-charges-master')}>
              <LogOut size={16} /> Exit to Master
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OPDChargesProfile;
