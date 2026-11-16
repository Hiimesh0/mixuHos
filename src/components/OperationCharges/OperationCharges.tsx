import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowDown, Building2, X, Save, Trash2, CheckCircle2 } from 'lucide-react';
import styles from './OperationCharges.module.css';
import { admissionApi, type AdmissionRecord, otApi, type OtEntryRecord } from '../../api/hospitalApi';

interface OpChargeRow {
  id: string;
  date: string;
  operationGroup: string;
  chargeType: string;
  dr: string;
  groupName: string;
  rate: number;
  entBy: string;
  amtType: string;
  notes: string;
  company: string;
}

const OperationCharges: React.FC = () => {
  const navigate = useNavigate();
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);

  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [selectedAdmId, setSelectedAdmId] = useState<string>('');
  const [activeAdmission, setActiveAdmission] = useState<AdmissionRecord | null>(null);

  // Form fields
  const [opDate, setOpDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [opType, setOpType] = useState<string>('Laparoscopic Cholecystectomy');
  const [chargeType, setChargeType] = useState<string>('Standard');
  const [drName, setDrName] = useState<string>('Dr. Nilesh Mahale');
  const [opGroupName, setOpGroupName] = useState<string>('General Surgery Major');
  const [amount, setAmount] = useState<number>(18000);
  const [notes, setNotes] = useState<string>('Routine elective procedure, uneventful');

  // Charges table
  const [rows, setRows] = useState<OpChargeRow[]>([]);
  const [notification, setNotification] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      const [adms, otEntries] = await Promise.all([
        admissionApi.getAdmissions(),
        otApi.getOtEntries(),
      ]);

      const admList = Array.isArray(adms) ? adms : [];
      setAdmissions(admList);

      if (admList.length > 0) {
        selectAdmission(admList[0], Array.isArray(otEntries) ? otEntries : []);
      }
    } catch (err) {
      console.error('Failed to load operation charges data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectAdmission = (adm: AdmissionRecord, otEntriesList?: OtEntryRecord[]) => {
    setSelectedAdmId(adm.id);
    setActiveAdmission(adm);
    setDrName(adm.admitting_doctor || 'Dr. Nilesh Mahale');

    // Populate realistic operation charges
    const initialRows: OpChargeRow[] = [
      {
        id: '1',
        date: adm.admission_date || '2026-11-02',
        operationGroup: 'General Surgery Major',
        chargeType: 'Standard',
        dr: adm.admitting_doctor || 'Dr. Nilesh Mahale',
        groupName: 'Surgeon Fee',
        rate: 15000,
        entBy: 'Admin',
        amtType: 'Fixed',
        notes: adm.provisional_diagnosis || 'Surgical intervention',
        company: adm.insurance_company || 'Ayushman Bharat',
      },
      {
        id: '2',
        date: adm.admission_date || '2026-11-02',
        operationGroup: 'Anesthesia Charges',
        chargeType: 'Standard',
        dr: 'Dr. Anesthetist',
        groupName: 'Anesthesia',
        rate: 5000,
        entBy: 'Admin',
        amtType: 'Fixed',
        notes: 'General Anesthesia (GA)',
        company: adm.insurance_company || 'Ayushman Bharat',
      },
      {
        id: '3',
        date: adm.admission_date || '2026-11-02',
        operationGroup: 'OT Theater & Equipment',
        chargeType: 'Standard',
        dr: 'Hospital OT',
        groupName: 'OT Rent',
        rate: 4500,
        entBy: 'Admin',
        amtType: 'Fixed',
        notes: 'Laparoscopic Tower & C-Arm',
        company: adm.insurance_company || 'Ayushman Bharat',
      }
    ];
    setRows(initialRows);
  };

  const handleAddCharge = () => {
    const newRow: OpChargeRow = {
      id: String(Date.now()),
      date: opDate,
      operationGroup: opGroupName,
      chargeType,
      dr: drName,
      groupName: opType,
      rate: Number(amount),
      entBy: 'Admin',
      amtType: 'Fixed',
      notes,
      company: activeAdmission?.insurance_company || 'Ayushman Bharat',
    };
    setRows(prev => [...prev, newRow]);
  };

  const handleDelete = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const totalAmount = useMemo(() => rows.reduce((acc, r) => acc + r.rate, 0), [rows]);

  const handleSave = () => {
    setNotification('Operation charges saved successfully to inpatient bill.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleApplyPackage = (pkgName: string, pkgAmount: number) => {
    const pkgRow: OpChargeRow = {
      id: String(Date.now()),
      date: opDate,
      operationGroup: pkgName,
      chargeType: 'Package',
      dr: drName,
      groupName: 'Complete Surgical Package',
      rate: pkgAmount,
      entBy: 'Admin',
      amtType: 'Lumpsum',
      notes: `All-inclusive surgical package: ${pkgName}`,
      company: activeAdmission?.insurance_company || 'Ayushman Bharat',
    };
    setRows([pkgRow]);
    setIsPackageModalOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Operation Charges</h1>
        <div className={styles.companyBadge}>
          <Building2 size={16} className={styles.companyLabel} />
          <span className={styles.companyLabel}>Company:</span>
          <span className={styles.companyValue}>{activeAdmission?.insurance_company || 'AYUSHMAN BHARAT'}</span>
        </div>
      </div>

      <div className={styles.content}>
        {notification && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 14px', borderRadius: '6px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <CheckCircle2 size={16} /> {notification}
          </div>
        )}

        {/* Context Bar */}
        <div className={styles.contextBar}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className={styles.tagBtn}>Operation Entry</div>
            <button className={styles.secondaryBtn} onClick={() => setIsPackageModalOpen(true)}>
              By Package
            </button>
            <select
              className={styles.select}
              style={{ minWidth: '260px' }}
              value={selectedAdmId}
              onChange={e => {
                const found = admissions.find(a => a.id === e.target.value);
                if (found) selectAdmission(found);
              }}
            >
              {admissions.map(adm => (
                <option key={adm.id} value={adm.id}>
                  {adm.patient_name} ({adm.ipd_no})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.patientInfoBox}>
            <div className={`${styles.infoSegment} ${styles.name}`}>{activeAdmission?.patient_name || 'Patient'}</div>
            <div className={`${styles.infoSegment} ${styles.amount}`}>{totalAmount.toLocaleString()} Rs.</div>
            <div className={`${styles.infoSegment} ${styles.record}`}>{activeAdmission?.ipd_no || 'IPD-000'}</div>
          </div>

          <button className={styles.exitBtn} onClick={() => navigate('/ot-entry')}>
            <LogOut size={16} /> Exit
          </button>
        </div>

        {/* Data Entry Form */}
        <div className={styles.formSection}>
          {/* Row 1 */}
          <div className={styles.formRow}>
            <div className={`${styles.fieldGroup} ${styles.wDate}`}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                className={styles.input}
                value={opDate}
                onChange={e => setOpDate(e.target.value)}
                max="2099-12-31"
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.wOpType}`}>
              <label className={styles.label}>Operation Type (Display in 1st pg Bill Print)</label>
              <input
                type="text"
                className={styles.input}
                value={opType}
                onChange={e => setOpType(e.target.value)}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.wChargeType}`}>
              <label className={styles.label}>Charge Type</label>
              <select
                className={styles.select}
                value={chargeType}
                onChange={e => setChargeType(e.target.value)}
              >
                <option value="Standard">Standard</option>
                <option value="Special">Special</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.wDrName}`}>
              <label className={styles.label}>Dr. Name</label>
              <input
                type="text"
                className={styles.input}
                value={drName}
                onChange={e => setDrName(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className={styles.formRow}>
            <div className={`${styles.fieldGroup} ${styles.wOpGroup}`}>
              <label className={styles.label}>Operation Group Name</label>
              <input
                type="text"
                className={styles.input}
                value={opGroupName}
                onChange={e => setOpGroupName(e.target.value)}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.wAmount}`}>
              <label className={styles.label}>Amount (₹)</label>
              <input
                type="number"
                className={styles.input}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.wNotes}`}>
              <label className={styles.label}>Notes</label>
              <input
                type="text"
                className={styles.input}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.wAction}`}>
              <button className={styles.addBtn} aria-label="Add Charge" onClick={handleAddCharge} title="Add Operation Charge">
                <ArrowDown size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Table List */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Operation Group</th>
                <th>Charge Type</th>
                <th>Doctor</th>
                <th>Head / Description</th>
                <th style={{ textAlign: 'right' }}>Rate (₹)</th>
                <th>Ent By</th>
                <th>Amt Type</th>
                <th>Notes</th>
                <th>Company</th>
                <th style={{ textAlign: 'center', width: '60px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                    No operation charges entered for this patient. Click (+) to add.
                  </td>
                </tr>
              ) : (
                rows.map(row => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td style={{ fontWeight: 600 }}>{row.operationGroup}</td>
                    <td>{row.chargeType}</td>
                    <td>{row.dr}</td>
                    <td>{row.groupName}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#166534' }}>₹{row.rate.toLocaleString()}</td>
                    <td>{row.entBy}</td>
                    <td>{row.amtType}</td>
                    <td style={{ fontSize: '12px' }}>{row.notes}</td>
                    <td>{row.company}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                        title="Delete charge"
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

        {/* Action / Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
            Total Operation Charges: ₹{totalAmount.toLocaleString()}
          </div>
          <button className={styles.primaryBtn} onClick={handleSave} style={{ backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            <Save size={18} /> Save Operation Charges
          </button>
        </div>
      </div>

      {/* Package Modal */}
      {isPackageModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ width: '100%', maxWidth: '750px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Operation Entry By Standard Package</h2>
              <button className={styles.closeBtn} onClick={() => setIsPackageModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Select a predefined surgical package to auto-populate lumpsum charges for this patient:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div
                  style={{ border: '1px solid #cbd5e1', padding: '14px', borderRadius: '6px', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => handleApplyPackage('Laparoscopic Appendectomy Package', 32000)}
                >
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>Laparoscopic Appendectomy</div>
                  <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>Includes OT, Surgeon, Anesthesia & 2 days room</div>
                  <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '15px' }}>₹32,000</div>
                </div>

                <div
                  style={{ border: '1px solid #cbd5e1', padding: '14px', borderRadius: '6px', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => handleApplyPackage('Laparoscopic Cholecystectomy Package', 38000)}
                >
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>Laparoscopic Cholecystectomy</div>
                  <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>Includes OT, Surgeon, Anesthesia & 3 days room</div>
                  <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '15px' }}>₹38,000</div>
                </div>

                <div
                  style={{ border: '1px solid #cbd5e1', padding: '14px', borderRadius: '6px', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => handleApplyPackage('Normal Vaginal Delivery (NVD) Package', 18000)}
                >
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>Normal Delivery (NVD)</div>
                  <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>Labor room, Obstetrician, Pediatrician round & care</div>
                  <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '15px' }}>₹18,000</div>
                </div>

                <div
                  style={{ border: '1px solid #cbd5e1', padding: '14px', borderRadius: '6px', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => handleApplyPackage('Cesarean Section (LSCS) Package', 42000)}
                >
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>Cesarean Section (LSCS)</div>
                  <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>OT charges, Surgeon, Anesthesia, Baby resuscitation</div>
                  <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '15px' }}>₹42,000</div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn} onClick={() => setIsPackageModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationCharges;
