import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowDown, 
  Save, 
  Printer, 
  XCircle, 
  FileText, 
  History, 
  ShieldAlert, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { patientApi } from '../../api/patientApi';
import type { PatientRecord, PatientBillRecord } from '../../api/patientApi';
import { doctorApi } from '../../api/masterApi';
import { openPatientBillPdf } from '../../utils/patientBillGenerator';
import { HOSPITAL_CONFIG } from '../../config/hospitalConfig';
import { formatDoctorName } from '../../utils/doctorUtils';
import GlobalBottomActionBar from '../common/GlobalBottomActionBar';
import styles from './Billing.module.css';

interface BillChargeRow {
  id: string;
  details: string;
  rate: number;
  drFees: number;
  amount: number;
}

const Billing: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Patients & Selection
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);

  // Doctors & Masters
  const [doctorList, setDoctorList] = useState<string[]>([]);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [standardCharges, setStandardCharges] = useState<Array<{ name: string; amount: number }>>([
    { name: 'Consultation Charge', amount: 500 },
    { name: 'Registration Charge', amount: 100 },
    { name: 'Emergency / Casualty Charge', amount: 750 },
    { name: 'ECG / Diagnostic Procedure', amount: 350 },
    { name: 'Dressing / Nursing Charge', amount: 200 },
    { name: 'Minor Surgical Procedure', amount: 1200 },
  ]);

  // Entry Row State
  const [entryDetails, setEntryDetails] = useState('');
  const [entryCharges, setEntryCharges] = useState('');
  const [entryDrFees, setEntryDrFees] = useState('');

  // Table Items
  const [items, setItems] = useState<BillChargeRow[]>([]);

  // Discount Authority State
  const [discountAuthBy, setDiscountAuthBy] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');

  // Bottom Form State
  const [isIndoor, setIsIndoor] = useState(false);
  const [indoorNo, setIndoorNo] = useState('');
  const [roomType, setRoomType] = useState('General Ward');
  const [indoorRef, setIndoorRef] = useState('');
  const [referenceDr, setReferenceDr] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  const [receivedAmt, setReceivedAmt] = useState('');

  // UI & Feedback State
  const [savedBill, setSavedBill] = useState<PatientBillRecord | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Load patients and master doctors on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [pts, docRes] = await Promise.allSettled([
          patientApi.getPatients(),
          doctorApi.getDoctors({ active_only: true })
        ]);

        if (isMounted && pts.status === 'fulfilled') {
          const raw = pts.value as any;
          const pList = Array.isArray(raw) ? raw : (raw?.patients || []);
          setPatients(pList);
        }

        if (isMounted && docRes.status === 'fulfilled' && docRes.value?.doctors) {
          const names = docRes.value.doctors
            .map(d => formatDoctorName(d.title, d.drName || (d as any).doctor_name || (d as any).name))
            .filter(Boolean);
          setDoctorList(names);
        }

        // Fetch standard charges from backend if available
        try {
          const chargeRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/charges/`);
          if (chargeRes.ok) {
            const data = await chargeRes.json();
            if (isMounted && Array.isArray(data.charges) && data.charges.length > 0) {
              setStandardCharges(data.charges.map((c: any) => ({ name: c.name, amount: Number(c.amount) || 0 })));
            }
          }
        } catch {
          // Keep defaults
        }
      } catch {
        // Fallback gracefully
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  // Select patient handler
  const selectPatient = useCallback(async (p: PatientRecord) => {
    setSelectedPatient(p);
    setPatientSearch(`${p.name} (${p.uhid || p.id})`);
    setIsSearchingPatient(false);
    setReferenceDr(p.consultantDoctor || p.doctor || '');
    setIsIndoor(Boolean(p.ipdNo || p.ipd_no));
    setIndoorNo(p.ipdNo || p.ipd_no || '');

    // Fetch existing bill for patient if exists
    try {
      const existing = await patientApi.getPatientBill(p.uhid || p.id);
      if (existing) {
        setSavedBill(existing);
        if (existing.items && existing.items.length > 0) {
          setItems(existing.items.map((it, idx) => ({
            id: it.id || `item-${idx}-${Date.now()}`,
            details: it.details || it.name || `Service #${idx + 1}`,
            rate: it.rate ?? it.unitPrice ?? 0,
            drFees: 0,
            amount: it.amount ?? it.totalAmount ?? it.rate ?? 0
          })));
        }
        if (existing.discountAmount) {
          setDiscountAmount(String(existing.discountAmount));
        }
        if (existing.totalReceived) {
          setReceivedAmt(String(existing.totalReceived));
        }
      } else {
        // Auto add default consultation charge if brand new
        setItems([{
          id: `item-init-${Date.now()}`,
          details: 'Consultation Charge',
          rate: 500,
          drFees: 0,
          amount: 500
        }]);
      }
    } catch {
      // Default initial charge
      setItems([{
        id: `item-init-${Date.now()}`,
        details: 'Consultation Charge',
        rate: 500,
        drFees: 0,
        amount: 500
      }]);
    }
  }, []);

  // Handle URL query parameters (e.g. ?uhid=P123 or ?patientId=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const uhidParam = params.get('uhid') || params.get('patientId');
    if (uhidParam && patients.length > 0) {
      const match = patients.find(p => 
        (p.uhid || '').toLowerCase() === uhidParam.toLowerCase() ||
        (p.id || '').toLowerCase() === uhidParam.toLowerCase()
      );
      if (match) {
        selectPatient(match);
      }
    }
  }, [location.search, patients, selectPatient]);

  // Filter patients for search dropdown
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return [];
    const query = patientSearch.toLowerCase();
    return patients.filter(p => 
      (p.name || '').toLowerCase().includes(query) ||
      (p.uhid || '').toLowerCase().includes(query) ||
      (p.mobile || '').includes(query)
    ).slice(0, 8);
  }, [patients, patientSearch]);

  // Handle charge preset selection
  const handleDetailPreset = (name: string) => {
    setEntryDetails(name);
    const match = standardCharges.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (match) {
      setEntryCharges(String(match.amount));
    }
  };

  // Add Item to table
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const details = entryDetails.trim();
    if (!details) {
      setNotification({ type: 'error', message: 'Please enter bill item details.' });
      return;
    }
    const rate = parseFloat(entryCharges) || 0;
    const drFees = parseFloat(entryDrFees) || 0;
    const amount = rate;

    const newItem: BillChargeRow = {
      id: `chg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      details,
      rate,
      drFees,
      amount
    };

    setItems(prev => [...prev, newItem]);
    setEntryDetails('');
    setEntryCharges('');
    setEntryDrFees('');
    setNotification(null);
  };

  // Remove Item from table
  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  // Financial Computations
  const totalAmt = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.amount || 0), 0);
  }, [items]);

  const handleDiscountPercentChange = (val: string) => {
    setDiscountPercent(val);
    const num = parseFloat(val);
    if (!isNaN(num) && totalAmt > 0) {
      const disc = Math.round(((totalAmt * num) / 100) * 100) / 100;
      setDiscountAmount(String(disc));
    } else {
      setDiscountAmount('');
    }
  };

  const handleDiscountAmountChange = (val: string) => {
    setDiscountAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && totalAmt > 0) {
      const pct = Math.round(((num / totalAmt) * 100) * 10) / 10;
      setDiscountPercent(String(pct));
    } else {
      setDiscountPercent('');
    }
  };

  const netAmt = useMemo(() => {
    const disc = parseFloat(discountAmount) || 0;
    return Math.max(0, totalAmt - disc);
  }, [totalAmt, discountAmount]);

  // Sync default receivedAmt when netAmt changes if user hasn't explicitly customized it
  useEffect(() => {
    if (!receivedAmt || receivedAmt === '0') {
      setReceivedAmt(String(netAmt));
    }
  }, [netAmt, receivedAmt]);

  const balanceAmt = useMemo(() => {
    const rec = parseFloat(receivedAmt) || 0;
    return Math.max(0, netAmt - rec);
  }, [netAmt, receivedAmt]);

  // Save Bill
  const handleSave = async (): Promise<PatientBillRecord | null> => {
    if (!selectedPatient) {
      setNotification({ type: 'error', message: 'Please search and select a patient before saving the bill.' });
      return null;
    }
    if (items.length === 0) {
      setNotification({ type: 'error', message: 'Please add at least one charge item to the bill.' });
      return null;
    }

    setIsSaving(true);
    setNotification(null);

    try {
      const payload = {
        items: items.map(it => ({
          details: it.details,
          rate: it.rate,
          amount: it.amount
        })),
        discountAmount: parseFloat(discountAmount) || 0,
        discountType: discountPercent ? ('percentage' as const) : ('fixed' as const),
        discountAuthority: discountAuthBy.trim() || undefined,
        totalReceived: parseFloat(receivedAmt) || netAmt,
        remarks: notes.trim() || undefined,
        updateExisting: Boolean(savedBill)
      };

      const bill = await patientApi.createOrGetPatientBill(
        selectedPatient.uhid || selectedPatient.id,
        payload
      );

      setSavedBill(bill);
      setNotification({ 
        type: 'success', 
        message: `Bill saved successfully! Invoice #${bill.invoiceNo}` 
      });
      return bill;
    } catch (err: any) {
      setNotification({ 
        type: 'error', 
        message: err?.message || 'Failed to save patient bill. Please verify backend connection.' 
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Print Bill
  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      let billToPrint = savedBill;
      if (!billToPrint) {
        billToPrint = await handleSave();
      }
      if (billToPrint) {
        await openPatientBillPdf(billToPrint);
      }
    } catch (err: any) {
      setNotification({ 
        type: 'error', 
        message: err?.message || 'Failed to generate printable bill.' 
      });
    } finally {
      setIsPrinting(false);
    }
  };

  // Reset / Cancel Form
  const handleCancel = () => {
    setSelectedPatient(null);
    setPatientSearch('');
    setItems([]);
    setEntryDetails('');
    setEntryCharges('');
    setEntryDrFees('');
    setDiscountAuthBy('');
    setDiscountPercent('');
    setDiscountAmount('');
    setReceivedAmt('');
    setIndoorNo('');
    setNotes('');
    setSavedBill(null);
    setNotification(null);
  };

  return (
    <div className={`${styles.pageContainer} hasBottomActionBar`} style={{ paddingBottom: '100px' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div 
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: notification.type === 'success' ? '#e6f4ea' : '#fce8e6',
            color: notification.type === 'success' ? '#137333' : '#c5221f',
            border: `1px solid ${notification.type === 'success' ? '#ceead6' : '#fad2cf'}`,
            fontSize: '13.5px',
            fontWeight: 500
          }}
          role="alert"
        >
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Card with Patient Selector */}
      <div className={styles.headerCard}>
        <div style={{ maxWidth: '600px', margin: '0 auto 12px auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search patient by name, UHID, or mobile to load bill..."
              value={patientSearch}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setIsSearchingPatient(true);
              }}
              onFocus={() => setIsSearchingPatient(true)}
              className={styles.input}
              style={{ width: '100%', paddingLeft: '36px', height: '42px', fontSize: '13.5px' }}
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchingPatient && filteredPatients.length > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-md)',
                zIndex: 50,
                marginTop: '4px',
                maxHeight: '220px',
                overflowY: 'auto',
                textAlign: 'left'
              }}
            >
              {filteredPatients.map(p => (
                <div
                  key={p.uhid || p.id}
                  onClick={() => selectPatient(p)}
                  style={{
                    padding: '9px 14px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-soft)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    UHID: {p.uhid || p.id} | Age: {p.age || '--'} | Mob: {p.mobile || '--'} | Dr: {p.consultantDoctor || p.doctor || '--'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <h1 className={styles.patientNameTitle}>
          {selectedPatient ? selectedPatient.name : 'Patient Billing & Invoice Management'}
        </h1>
        <div className={styles.hospitalSubtitle}>
          {selectedPatient 
            ? `UHID: ${selectedPatient.uhid || selectedPatient.id} | Gender: ${selectedPatient.gender || '--'} | Age: ${selectedPatient.age || '--'} | Doctor: ${selectedPatient.consultantDoctor || selectedPatient.doctor || '--'}`
            : `${HOSPITAL_CONFIG.name} — OPD & IPD Encounter Billing`}
        </div>
      </div>

      {/* Entry Row */}
      <form onSubmit={handleAddItem} className={styles.entryCard}>
        <div className={styles.entryRow}>
          <div className={styles.fieldGroup} style={{ flex: '3' }}>
            <label className={styles.label}>Details / Procedure</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="e.g. Consultation Charge, ECG, Dressing..."
              value={entryDetails}
              onChange={(e) => handleDetailPreset(e.target.value)}
              list="standard-charges-list"
            />
            <datalist id="standard-charges-list">
              {standardCharges.map((c, i) => (
                <option key={i} value={c.name} />
              ))}
            </datalist>
          </div>
          <div className={styles.fieldGroup} style={{ flex: '1' }}>
            <label className={styles.label}>Charges (₹)</label>
            <input 
              type="number" 
              min="0" 
              step="0.01" 
              className={styles.input} 
              placeholder="0.00"
              value={entryCharges}
              onChange={(e) => setEntryCharges(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup} style={{ flex: '1' }}>
            <label className={styles.label}>Professional Fees To Dr.</label>
            <input 
              type="number" 
              min="0" 
              step="0.01" 
              className={styles.input} 
              placeholder="0.00"
              value={entryDrFees}
              onChange={(e) => setEntryDrFees(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className={styles.iconBtn} 
            style={{ marginBottom: '0', backgroundColor: 'var(--primary)', color: '#ffffff', borderColor: 'var(--primary)' }} 
            title="Add charge row to bill"
            aria-label="Add charge item"
          >
            <ArrowDown size={20} />
          </button>
        </div>
      </form>

      {/* Grids Area */}
      <div className={styles.gridsLayout}>
        
        {/* Left Table (Charges) */}
        <div className={styles.tableSection}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Details</th>
                <th style={{ width: '25%' }}>Prof. Fees (₹)</th>
                <th style={{ width: '20%' }}>Charges (₹)</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', height: '140px', verticalAlign: 'middle' }}>
                    No charge items added yet.<br />
                    <span style={{ fontSize: '12px' }}>Enter details above and click the arrow button to add charges to this bill.</span>
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ height: 'auto', padding: '10px 14px' }}>
                      <span style={{ fontWeight: 600 }}>{idx + 1}. </span>
                      {item.details}
                    </td>
                    <td style={{ height: 'auto', padding: '10px 14px' }}>
                      {item.drFees > 0 ? `₹${item.drFees.toFixed(2)}` : '--'}
                    </td>
                    <td style={{ height: 'auto', padding: '10px 14px', fontWeight: 600 }}>
                      ₹{item.rate.toFixed(2)}
                    </td>
                    <td style={{ height: 'auto', padding: '10px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--danger-hover)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Remove charge item"
                        aria-label={`Remove ${item.details}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right Table (Discount Authority) */}
        <div className={styles.tableSection}>
          <div className={styles.discountAuthTop}>
            <div className={styles.fieldGroup} style={{ flex: '2' }}>
              <label className={styles.label}>Discount Authority By</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Authorised Doctor / Admin"
                value={discountAuthBy}
                onChange={(e) => setDiscountAuthBy(e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: '1' }}>
              <label className={styles.label}>%</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                step="0.5" 
                className={styles.input} 
                placeholder="%"
                value={discountPercent}
                onChange={(e) => handleDiscountPercentChange(e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ flex: '1' }}>
              <label className={styles.label}>Amount (₹)</label>
              <input 
                type="number" 
                min="0" 
                step="0.01" 
                className={styles.input} 
                placeholder="₹"
                value={discountAmount}
                onChange={(e) => handleDiscountAmountChange(e.target.value)}
              />
            </div>
          </div>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th style={{ width: '45%' }}>Authorised Person</th>
                <th style={{ width: '25%' }}>Discount</th>
                <th style={{ width: '30%' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {parseFloat(discountAmount) > 0 ? (
                <tr>
                  <td style={{ height: 'auto', padding: '10px 14px' }}>1</td>
                  <td style={{ height: 'auto', padding: '10px 14px', fontWeight: 500 }}>
                    {discountAuthBy || 'Admin Authority'}
                  </td>
                  <td style={{ height: 'auto', padding: '10px 14px', fontWeight: 600, color: '#c5221f' }}>
                    -₹{parseFloat(discountAmount).toFixed(2)}
                  </td>
                  <td style={{ height: 'auto', padding: '10px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {new Date().toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', height: '100px', verticalAlign: 'middle', fontSize: '12px' }}>
                    No discounts authorized for this encounter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Bottom Forms Area */}
      <div className={styles.bottomFormsLayout}>
        
        {/* Column 1: Info */}
        <div className={styles.formColumn}>
          <div className={styles.checkboxGroup} style={{ marginLeft: '122px', marginBottom: '8px' }}>
            <input 
              type="checkbox" 
              className={styles.checkbox} 
              id="isIndoorPatientCheck"
              checked={isIndoor}
              onChange={(e) => setIsIndoor(e.target.checked)}
            />
            <label htmlFor="isIndoorPatientCheck" className={styles.label} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>
              Indoor Patient (IPD)
            </label>
          </div>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel}>Patient Name :</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.formRowInput}`} 
              value={selectedPatient?.name || ''} 
              readOnly 
              placeholder="Select patient above"
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel}>Indoor No :</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.formRowInput}`} 
              value={indoorNo}
              onChange={(e) => setIndoorNo(e.target.value)}
              placeholder="e.g. IPD-2026-081"
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel}>Room Type :</label>
            <select 
              className={`${styles.select} ${styles.formRowInput}`}
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="General Ward">General Ward</option>
              <option value="Semi-Private">Semi-Private Room</option>
              <option value="Private Deluxe">Private Deluxe</option>
              <option value="ICU / CCU">ICU / CCU</option>
            </select>
          </div>
        </div>

        {/* Column 2: Financials */}
        <div className={styles.formColumn}>
          <div className={styles.formRow}>
            <label className={styles.formRowLabel} style={{ width: '100px' }}>Total Amt :</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.formRowInput} ${styles.inputReadOnly}`} 
              value={`₹${totalAmt.toFixed(2)}`}
              readOnly 
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel} style={{ width: '100px' }}>Discount :</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.formRowInput} ${styles.inputReadOnly}`} 
              value={parseFloat(discountAmount) > 0 ? `₹${parseFloat(discountAmount).toFixed(2)}` : '₹0.00'}
              readOnly 
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel} style={{ width: '100px', fontWeight: 600, color: 'var(--text-main)' }}>Net Amt :</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.formRowInput} ${styles.inputReadOnly}`} 
              style={{ fontWeight: 700, color: 'var(--primary)' }}
              value={`₹${netAmt.toFixed(2)}`}
              readOnly 
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel} style={{ width: '100px' }}>Received Amt :</label>
            <input 
              type="number" 
              min="0" 
              step="0.01" 
              className={`${styles.input} ${styles.formRowInput}`} 
              value={receivedAmt}
              onChange={(e) => setReceivedAmt(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel} style={{ width: '100px', fontWeight: 600, color: balanceAmt > 0 ? 'var(--danger-hover)' : '#137333' }}>
              Balance Amt :
            </label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.formRowInput} ${styles.inputReadOnly}`} 
              style={{ fontWeight: 700, color: balanceAmt > 0 ? 'var(--danger-hover)' : '#137333' }}
              value={`₹${balanceAmt.toFixed(2)}`}
              readOnly 
            />
          </div>
        </div>

        {/* Column 3: References */}
        <div className={styles.formColumn}>
          <button 
            type="button"
            className={styles.secondaryBtn} 
            style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--warning-soft)', borderColor: 'var(--warning-soft)', color: 'var(--warning-hover)', cursor: 'pointer' }}
            onClick={() => setIsOtpModalOpen(true)}
            title="Batch delete test orders before payment settlement via OTP verification"
          >
            <ShieldAlert size={16} /> Delete Multiple Test By OTP Before Amount Received
          </button>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel}>Indoor Ref :</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.formRowInput}`} 
              value={indoorRef}
              onChange={(e) => setIndoorRef(e.target.value)}
              placeholder="Indoor Reference #"
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel}>Reference Dr :</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.formRowInput}`} 
              value={referenceDr}
              onChange={(e) => setReferenceDr(e.target.value)}
              list="doctors-datalist"
              placeholder="Consulting Doctor"
            />
            <datalist id="doctors-datalist">
              {doctorList.map((doc, idx) => (
                <option key={idx} value={doc} />
              ))}
            </datalist>
          </div>

          <div className={styles.formRow}>
            <label className={styles.formRowLabel}>Company Name :</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.formRowInput}`} 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="TPA / Corporate Insurance"
            />
          </div>
        </div>

        {/* Notes (Spans full width) */}
        <div className={styles.notesRow}>
          <label className={styles.notesLabel}>Notes :</label>
          <input 
            type="text" 
            className={styles.input} 
            style={{ flex: 1 }} 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Encounter billing remarks / admission diagnosis notes..."
          />
        </div>

      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionGroup}>
          <button 
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              if (selectedPatient) {
                navigate(`/patient-past-info?uhid=${encodeURIComponent(selectedPatient.uhid || selectedPatient.id)}`);
              } else {
                navigate('/patient-past-info');
              }
            }}
          >
            <History size={16} /> Patient Past Info
          </button>
          <button 
            type="button"
            className={styles.secondaryBtn} 
            onClick={() => {
              if (savedBill) {
                setNotification({ type: 'success', message: `Active invoice: ${savedBill.invoiceNo} dated ${savedBill.billDate}` });
              }
            }}
            disabled={!savedBill}
          >
            <FileText size={16} /> Receipt Detail
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button 
            type="button"
            className={styles.primaryBtn}
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save'}
          </button>
          
          <button 
            type="button"
            className={styles.secondaryBtn}
            onClick={handlePrint}
            disabled={isPrinting}
          >
            <Printer size={16} /> {isPrinting ? 'Printing...' : 'Print'}
          </button>
          
          <button 
            type="button"
            className={styles.secondaryBtn}
            onClick={handleCancel}
          >
            <XCircle size={16} /> Cancel
          </button>
        </div>
      </div>

      {/* OTP Deletion Security Dialog Modal */}
      {isOtpModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOtpModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '16px' }}>
                <ShieldAlert size={20} /> Batch Test Deletion — OTP Authorization
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsOtpModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', lineHeight: 1.5 }}>
              <div style={{ backgroundColor: 'var(--warning-soft)', border: '1px solid var(--warning-hover)', borderRadius: '6px', padding: '12px 14px', color: 'var(--text-main)' }}>
                <strong>NABH Clinical & Financial Audit Policy:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                  Mass deletion of pre-settlement investigation orders and bill items requires dual-custody verification via SMS OTP sent to the attending consultant or billing administrator.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>SMS/OTP Gateway Status:</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--warning-hover)', fontWeight: 600, fontSize: '13px' }}>
                  <AlertCircle size={15} /> Gateway Offline / SMS Service not provisioned in local environment.
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-muted)', borderRadius: '6px', padding: '12px 14px', fontSize: '13px' }}>
                <strong>Recommended Standard Workflow:</strong>
                <p style={{ margin: '4px 0 0 0' }}>
                  To remove individual charges or test items from this bill, use the individual <strong>Delete</strong> icon (<Trash2 size={13} style={{ verticalAlign: 'middle', margin: '0 2px' }} />) located in the Bill Items table above. For supervisor override, please contact the hospital IT administration desk.
                </p>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setIsOtpModalOpen(false)}
              >
                Understood / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Bottom Action Bar */}
      <GlobalBottomActionBar
        onSave={() => { handleSave(); }}
        saveLabel={isSaving ? 'Saving...' : 'Save Bill'}
        isSaving={isSaving}
        saveDisabled={!selectedPatient || items.length === 0}
        isDirty={items.length > 0}
        dirtyMessage={`${items.length} Pending Item${items.length > 1 ? 's' : ''}`}
        onPrint={handlePrint}
        printLabel={isPrinting ? 'Printing...' : 'Print Bill'}
        isPrinting={isPrinting}
        printDisabled={!selectedPatient}
        onCancel={handleCancel}
        cancelLabel="Reset Bill"
        statusMessage={
          selectedPatient
            ? `${selectedPatient.name} (${selectedPatient.uhid}) | Net: ₹${netAmt.toFixed(2)} | Balance Due: ₹${balanceAmt.toFixed(2)}`
            : 'Select patient to manage billing'
        }
      />
    </div>
  );
};

export default Billing;
