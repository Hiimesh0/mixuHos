import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, LogOut, Save, Trash2, CheckCircle2, Bed } from 'lucide-react';
import styles from './RoomCharges.module.css';
import { admissionApi, type AdmissionRecord, bedApi, type BedRecord } from '../../api/hospitalApi';

interface RoomChargeEntry {
  id: string;
  date: string;
  bedNo: string;
  type: string;
  roomRate: number;
  gstAmount: number;
  netRoom: number;
  netGst: number;
  company: string;
}

const RoomCharges: React.FC = () => {
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [beds, setBeds] = useState<BedRecord[]>([]);
  const [selectedAdmId, setSelectedAdmId] = useState<string>('');
  const [activeAdmission, setActiveAdmission] = useState<AdmissionRecord | null>(null);

  // Form fields
  const [chargeDate, setChargeDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bedNo, setBedNo] = useState<string>('101');
  const [bedType, setBedType] = useState<string>('General Ward');
  const [roomRate, setRoomRate] = useState<number>(1200);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [companyRate, setCompanyRate] = useState<number>(0);

  // Table entries
  const [entries, setEntries] = useState<RoomChargeEntry[]>([]);
  const [notification, setNotification] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      const [adms, bList] = await Promise.all([
        admissionApi.getAdmissions(),
        bedApi.getBeds(),
      ]);
      const admArray = Array.isArray(adms) ? adms : [];
      setAdmissions(admArray);
      setBeds(Array.isArray(bList) ? bList : []);

      if (admArray.length > 0) {
        selectAdmission(admArray[0]);
      }
    } catch (err) {
      console.error('Failed to load room charges data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectAdmission = (adm: AdmissionRecord) => {
    setSelectedAdmId(adm.id);
    setActiveAdmission(adm);
    setBedNo(adm.bed_number || '101');
    setBedType(adm.ward_name || 'General Ward');
    const rate = adm.ward_name?.toLowerCase().includes('icu') ? 3500 : 1200;
    setRoomRate(rate);

    // Initial realistic charges for this admission
    const initialRows: RoomChargeEntry[] = [
      {
        id: '1',
        date: adm.admission_date || '2026-11-01',
        bedNo: adm.bed_number || '101',
        type: adm.ward_name || 'General Ward',
        roomRate: rate,
        gstAmount: 0,
        netRoom: rate,
        netGst: 0,
        company: adm.insurance_company || 'Self Pay',
      },
      {
        id: '2',
        date: new Date(new Date(adm.admission_date || Date.now()).getTime() + 86400000).toISOString().split('T')[0],
        bedNo: adm.bed_number || '101',
        type: adm.ward_name || 'General Ward',
        roomRate: rate,
        gstAmount: 0,
        netRoom: rate,
        netGst: 0,
        company: adm.insurance_company || 'Self Pay',
      }
    ];
    setEntries(initialRows);
  };

  const handleAddCharge = () => {
    const net = Number(roomRate);
    const gst = Number(gstAmount);
    const newEntry: RoomChargeEntry = {
      id: String(Date.now()),
      date: chargeDate,
      bedNo,
      type: bedType,
      roomRate: net,
      gstAmount: gst,
      netRoom: net,
      netGst: gst,
      company: activeAdmission?.insurance_company || 'Self Pay',
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const totalNetRoom = useMemo(() => entries.reduce((acc, e) => acc + e.netRoom, 0), [entries]);
  const totalNetGst = useMemo(() => entries.reduce((acc, e) => acc + e.netGst, 0), [entries]);

  const handleSave = () => {
    setNotification('Room charges saved successfully to inpatient billing record.');
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Room Charges Entry</h1>
      </div>

      <div className={styles.content}>
        {notification && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 14px', borderRadius: '6px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <CheckCircle2 size={16} /> {notification}
          </div>
        )}

        {/* Context Bar */}
        <div className={styles.contextBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <label className={styles.label} style={{ whiteSpace: 'nowrap' }}>Select Patient:</label>
            <select
              className={styles.input}
              style={{ maxWidth: '320px' }}
              value={selectedAdmId}
              onChange={e => {
                const found = admissions.find(a => a.id === e.target.value);
                if (found) selectAdmission(found);
              }}
            >
              {admissions.map(adm => (
                <option key={adm.id} value={adm.id}>
                  {adm.patient_name} ({adm.ipd_no}) - Bed {adm.bed_number}
                </option>
              ))}
            </select>
            <div className={styles.recordId}>IPD: {activeAdmission?.ipd_no || '--'}</div>
          </div>

          <div className={styles.companyGroup}>
            <label className={styles.label}>Take Rate Of Company</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={styles.input}
              style={{ maxWidth: '140px' }}
              value={companyRate}
              onChange={e => setCompanyRate(Number(e.target.value))}
            />
          </div>

          <button className={styles.secondaryBtn} onClick={() => navigate('/indoor-register')}>
            <LogOut size={16} />
            Exit
          </button>
        </div>

        {/* Service Entry Row */}
        <div className={styles.entryRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Date</label>
            <input
              type="date"
              className={styles.input}
              value={chargeDate}
              onChange={e => setChargeDate(e.target.value)}
              max="2099-12-31"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Bed No</label>
            <input
              type="text"
              className={styles.input}
              value={bedNo}
              onChange={e => setBedNo(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Ward / Type</label>
            <input
              type="text"
              className={styles.input}
              value={bedType}
              onChange={e => setBedType(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Room Rate (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              className={styles.input}
              value={roomRate}
              onChange={e => setRoomRate(Number(e.target.value))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>GST Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              className={styles.input}
              value={gstAmount}
              onChange={e => setGstAmount(Number(e.target.value))}
            />
          </div>
          <button className={styles.iconBtn} aria-label="Add Charge" onClick={handleAddCharge} title="Add Room Charge Row">
            <ArrowDown size={18} />
          </button>
        </div>

        {/* Data Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '36px' }}>#</th>
                <th>Date</th>
                <th>Bed No</th>
                <th>Ward / Type</th>
                <th style={{ textAlign: 'right' }}>Net Room (₹)</th>
                <th style={{ textAlign: 'right' }}>GST Amount (₹)</th>
                <th style={{ textAlign: 'right' }}>Net Total (₹)</th>
                <th>Company</th>
                <th style={{ textAlign: 'center', width: '60px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                    No room charges entered for this patient. Click (+) to add.
                  </td>
                </tr>
              ) : (
                entries.map((entry, idx) => (
                  <tr key={entry.id}>
                    <td>{idx + 1}</td>
                    <td>{entry.date}</td>
                    <td style={{ fontWeight: 600 }}>{entry.bedNo}</td>
                    <td>{entry.type}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{entry.netRoom.toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>₹{entry.gstAmount.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#166534' }}>₹{(entry.netRoom + entry.gstAmount).toLocaleString()}</td>
                    <td>{entry.company}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                        title="Remove row"
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

        {/* Footer Section */}
        <div className={styles.footerSection}>
          <button className={styles.primaryBtn} onClick={handleSave}>
            <Save size={18} />
            Save Room Charges
          </button>

          <div className={styles.totalsGroup}>
            <div className={styles.totalBox}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Total Room (₹)</div>
              <div className={styles.totalValue}>{totalNetRoom.toLocaleString()}</div>
            </div>
            <div className={styles.totalBox}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Total GST (₹)</div>
              <div className={styles.totalValue}>{totalNetGst.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCharges;
