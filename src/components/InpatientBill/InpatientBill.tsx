import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, Printer, Lock, Calculator, Package, RefreshCw, Trash2, XCircle, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './InpatientBill.module.css';
import { admissionApi, type AdmissionRecord, depositApi, type DepositRecord } from '../../api/hospitalApi';
import { patientApi, type PatientBillRecord, type BillItem } from '../../api/patientApi';
import { openPatientBillPdf } from '../../utils/patientBillGenerator';
import GlobalBottomActionBar from '../common/GlobalBottomActionBar';

const InpatientBill: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [selectedAdmId, setSelectedAdmId] = useState<string>('');
  const [activeAdmission, setActiveAdmission] = useState<AdmissionRecord | null>(null);

  const [billPrefix, setBillPrefix] = useState<string>('GEN');
  const [billNo, setBillNo] = useState<string>('');
  const [billDate, setBillDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [doa, setDoa] = useState<string>('');
  const [dod, setDod] = useState<string>('');
  const [totalDays, setTotalDays] = useState<number>(1);

  // Charges breakdown
  const [roomRate, setRoomRate] = useState<number>(1500);
  const [nursingRate, setNursingRate] = useState<number>(300);
  const [doctorVisitRate, setDoctorVisitRate] = useState<number>(800);
  const [operationRate, setOperationRate] = useState<number>(0);
  const [investigationRate, setInvestigationRate] = useState<number>(1200);

  // Financial fields
  const [maintPercent, setMaintPercent] = useState<number>(5);
  const [flatDiscount, setFlatDiscount] = useState<number>(0);
  const [authDiscount, setAuthDiscount] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const tabs = [
    'Room Charges',
    'Operation Charges',
    'Additional Charges',
    'Dr. Visit/Procedure',
    'Deposit',
    'Diagnostics',
    'Discount Authority',
    'Notes'
  ];
  const [activeTab, setActiveTab] = useState<string>('Room Charges');

  // Load admissions on mount
  const loadAdmissions = useCallback(async () => {
    try {
      setLoading(true);
      const adms = await admissionApi.getAdmissions();
      const admList = Array.isArray(adms) ? adms : [];
      setAdmissions(admList);

      const targetId = (searchParams.get('admId') || searchParams.get('id') || searchParams.get('uhid') || '').toLowerCase();
      let matched = admList.find(a =>
        a.id.toLowerCase() === targetId ||
        (a.uhid || '').toLowerCase() === targetId ||
        (a.ipd_no || '').toLowerCase() === targetId
      );

      if (!matched && admList.length > 0) {
        matched = admList[0];
      }

      if (matched) {
        selectAdmission(matched);
      }
    } catch (err) {
      console.error('Failed to load admissions for billing:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadAdmissions();
  }, [loadAdmissions]);

  const selectAdmission = async (adm: AdmissionRecord) => {
    setSelectedAdmId(adm.id);
    setActiveAdmission(adm);

    setBillNo(`BILL-IPD-${adm.ipd_no.replace(/[^0-9]/g, '') || Math.floor(1000 + Math.random() * 9000)}`);
    setDoa(adm.admission_date || new Date().toISOString().split('T')[0]);
    const dischargeD = adm.discharge_date || new Date().toISOString().split('T')[0];
    setDod(dischargeD);

    // Calculate days
    const d1 = new Date(adm.admission_date || Date.now());
    const d2 = new Date(dischargeD);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    setTotalDays(days);

    // Query deposits for this patient
    try {
      const deps = await depositApi.getDeposits({ uhid: adm.uhid });
      const totalDep = (Array.isArray(deps) ? deps : []).reduce((acc, d) => acc + Number(d.amount || 0), 0);
      setDepositAmount(totalDep);
    } catch {
      setDepositAmount(0);
    }
  };

  // Re-calculate days on date change
  const handleDatesChange = (newDoa: string, newDod: string) => {
    setDoa(newDoa);
    setDod(newDod);
    const d1 = new Date(newDoa);
    const d2 = new Date(newDod);
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setTotalDays(days);
    }
  };

  // Calculations
  const roomTotal = useMemo(() => roomRate * totalDays, [roomRate, totalDays]);
  const nursingTotal = useMemo(() => nursingRate * totalDays, [nursingRate, totalDays]);
  const drVisitTotal = useMemo(() => doctorVisitRate * totalDays, [doctorVisitRate, totalDays]);

  const subTotal = useMemo(() => {
    return roomTotal + nursingTotal + drVisitTotal + operationRate + investigationRate;
  }, [roomTotal, nursingTotal, drVisitTotal, operationRate, investigationRate]);

  const maintCharges = useMemo(() => {
    return Math.round((subTotal * (maintPercent || 0)) / 100);
  }, [subTotal, maintPercent]);

  const grossBillAmount = useMemo(() => {
    return subTotal + maintCharges;
  }, [subTotal, maintCharges]);

  const totalDiscount = useMemo(() => {
    return Number(flatDiscount || 0) + Number(authDiscount || 0);
  }, [flatDiscount, authDiscount]);

  const netPayable = useMemo(() => {
    return Math.max(0, grossBillAmount - totalDiscount);
  }, [grossBillAmount, totalDiscount]);

  const finalPayable = useMemo(() => {
    return Math.max(0, netPayable - Number(depositAmount || 0));
  }, [netPayable, depositAmount]);

  // Construct current bill record object
  const currentBillRecord: PatientBillRecord = useMemo(() => {
    const items: BillItem[] = [
      { id: '1', name: `Bed & Room Tariff (${totalDays} days @ ₹${roomRate}/day)`, chargeMasterId: 'RM', unitPrice: roomRate, quantity: totalDays, totalAmount: roomTotal },
      { id: '2', name: `Nursing & Patient Care (${totalDays} days @ ₹${nursingRate}/day)`, chargeMasterId: 'NUR', unitPrice: nursingRate, quantity: totalDays, totalAmount: nursingTotal },
      { id: '3', name: `Consultant Round & Care (${totalDays} days @ ₹${doctorVisitRate}/day)`, chargeMasterId: 'DR', unitPrice: doctorVisitRate, quantity: totalDays, totalAmount: drVisitTotal },
      { id: '4', name: 'Diagnostics & Laboratory Services', chargeMasterId: 'LAB', unitPrice: investigationRate, quantity: 1, totalAmount: investigationRate },
    ];
    if (operationRate > 0) {
      items.push({ id: '5', name: 'OT & Procedure Charges', chargeMasterId: 'OT', unitPrice: operationRate, quantity: 1, totalAmount: operationRate });
    }

    return {
      id: billNo || `IPD-BILL-${Date.now()}`,
      billNo: billNo || `BILL-${Date.now()}`,
      invoiceNo: billNo || `BILL-${Date.now()}`,
      uhid: activeAdmission?.uhid || 'UHID-GEN',
      patientId: activeAdmission?.uhid || 'UHID-GEN',
      admission_id: activeAdmission?.id,
      ipd_no: activeAdmission?.ipd_no,
      patientName: activeAdmission?.patient_name || 'Patient',
      billDate,
      billType: 'IPD',
      items,
      subtotal: subTotal + maintCharges,
      totalAmount: subTotal + maintCharges,
      discountAmount: totalDiscount,
      netAmount: netPayable,
      netPayable: netPayable,
      amountReceived: depositAmount,
      totalReceived: depositAmount,
      balanceDue: finalPayable,
      balanceAmount: finalPayable,
      paymentMode: 'Cash / Card / Online',
      status: finalPayable === 0 ? 'Settled' : 'Pending',
      treatingDoctor: activeAdmission?.admitting_doctor || 'Dr. Nilesh Mahale',
      doctorName: activeAdmission?.admitting_doctor || 'Dr. Nilesh Mahale',
    };
  }, [billNo, activeAdmission, billDate, totalDays, roomRate, roomTotal, nursingRate, nursingTotal, doctorVisitRate, drVisitTotal, investigationRate, operationRate, subTotal, maintCharges, totalDiscount, netPayable, depositAmount, finalPayable]);

  // Save bill
  const handleSaveBill = async () => {
    if (!activeAdmission) {
      setErrorMessage('Please select an active inpatient admission before saving the bill.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    if (loading) return;

    try {
      setLoading(true);
      setErrorMessage('');
      setSavedSuccess('');

      const saved = await patientApi.createBill(currentBillRecord);
      const generatedBillNo = saved.invoiceNo || saved.billNo || billNo;
      setSavedSuccess(`Inpatient Bill '${generatedBillNo}' saved successfully to permanent hospital records!`);
      const newNo = saved.invoiceNo || saved.billNo;
      if (newNo) {
        setBillNo(newNo);
      }
      setTimeout(() => setSavedSuccess(''), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to persist inpatient bill. Please check backend connection.');
      setTimeout(() => setErrorMessage(''), 6000);
    } finally {
      setLoading(false);
    }
  };

  // Print bill
  const handlePrint = async () => {
    await openPatientBillPdf(currentBillRecord);
  };

  return (
    <div className={`${styles.pageContainer} hasBottomActionBar`}>
      {/* Top Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.topHeader}>
          <span className={styles.doctorName}>{activeAdmission?.admitting_doctor || 'Dr. Nilesh Mahale'}</span>
          <h1 className={styles.pageTitle}>Inpatient Bill Generator</h1>
          <span className={styles.recordCount}>{admissions.length} Admissions</span>
        </div>

        {savedSuccess && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 14px', borderRadius: '6px', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <CheckCircle2 size={16} /> {savedSuccess}
          </div>
        )}

        {errorMessage && (
          <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '8px 14px', borderRadius: '6px', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <AlertCircle size={16} /> {errorMessage}
          </div>
        )}

        <div className={styles.infoGrid}>
          <div className={`${styles.fieldGroup} ${styles.col2}`}>
            <label className={styles.label}>Prefix:</label>
            <select className={styles.select} value={billPrefix} onChange={e => setBillPrefix(e.target.value)}>
              <option value="GEN">GEN</option>
              <option value="IPD">IPD</option>
            </select>
          </div>

          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Bill No:</label>
            <input
              type="text"
              className={styles.input}
              value={billNo}
              onChange={e => setBillNo(e.target.value)}
              placeholder="e.g. BILL-IPD-1001"
            />
          </div>

          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Bill Date:</label>
            <input
              type="date"
              className={styles.input}
              value={billDate}
              onChange={e => setBillDate(e.target.value)}
              max="2099-12-31"
            />
          </div>

          <div className={`${styles.fieldGroup} ${styles.col4}`}>
            <label className={styles.label}>Select Inpatient:</label>
            <select
              className={styles.select}
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={styles.tabBtn}
            style={activeTab === tab ? { backgroundColor: 'var(--primary-soft)', borderColor: 'var(--primary-soft)', color: 'var(--primary-hover)', fontWeight: 600 } : {}}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.mainLayout}>
        {/* Left Area: Details */}
        <div>
          {/* Sub Header (DOA/DOD) */}
          <div className={styles.infoGrid} style={{ marginBottom: '20px' }}>
            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>DOA (Date of Admission):</label>
              <input
                type="date"
                className={styles.input}
                value={doa}
                onChange={e => handleDatesChange(e.target.value, dod)}
                max="2099-12-31"
              />
            </div>
            <div className={`${styles.fieldGroup} ${styles.col4}`}>
              <label className={styles.label}>DOD (Discharge Date):</label>
              <input
                type="date"
                className={styles.input}
                value={dod}
                onChange={e => handleDatesChange(doa, e.target.value)}
                max="2099-12-31"
              />
            </div>
            <div className={`${styles.fieldGroup} ${styles.col3}`}>
              <label className={styles.label}>Total Days:</label>
              <input
                type="number"
                min="1"
                className={styles.input}
                value={totalDays}
                onChange={e => setTotalDays(Math.max(1, Number(e.target.value)))}
              />
            </div>
            <div className={`${styles.fieldGroup} ${styles.col1}`}>
              <label className={styles.label}>Ward:</label>
              <input
                type="text"
                className={styles.input}
                value={activeAdmission?.ward_name || 'ICU / General'}
                readOnly
              />
            </div>
          </div>

          {/* Charges Breakdown Panel */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
              Service Item Rates & Tariffs
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Room Tariff / Day (₹):</label>
                <input
                  type="number"
                  className={styles.input}
                  value={roomRate}
                  onChange={e => setRoomRate(Number(e.target.value))}
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Total: ₹{roomTotal}</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nursing / Care / Day (₹):</label>
                <input
                  type="number"
                  className={styles.input}
                  value={nursingRate}
                  onChange={e => setNursingRate(Number(e.target.value))}
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Total: ₹{nursingTotal}</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Doctor Consultation / Day (₹):</label>
                <input
                  type="number"
                  className={styles.input}
                  value={doctorVisitRate}
                  onChange={e => setDoctorVisitRate(Number(e.target.value))}
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Total: ₹{drVisitTotal}</span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Diagnostics / Lab Total (₹):</label>
                <input
                  type="number"
                  className={styles.input}
                  value={investigationRate}
                  onChange={e => setInvestigationRate(Number(e.target.value))}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>OT & Surgical Procedures (₹):</label>
                <input
                  type="number"
                  className={styles.input}
                  value={operationRate}
                  onChange={e => setOperationRate(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={e => setIsLocked(e.target.checked)}
                />
                <Lock size={14} /> Lock Inpatient Bill Against Modifications
              </label>
            </div>
          </div>
        </div>

        {/* Right Area: Financial Summary */}
        <div>
          <div className={styles.summaryPanel}>
            <div className={styles.summaryHeader}>Financial Summary</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Sub Total (=)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueHigh}`} value={`₹${subTotal.toLocaleString()}`} readOnly />
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Maintenance ({maintPercent}%) (+)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueHigh}`} value={`₹${maintCharges.toLocaleString()}`} readOnly />
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Gross Bill Amount (=)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueWarning}`} value={`₹${grossBillAmount.toLocaleString()}`} readOnly />
              </div>

              <div className={styles.divider}></div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Flat Discount (-)</span>
                <input
                  type="number"
                  className={`${styles.input} ${styles.summaryValue}`}
                  value={flatDiscount}
                  onChange={e => setFlatDiscount(Number(e.target.value))}
                />
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Auth Discount (-)</span>
                <input
                  type="number"
                  className={`${styles.input} ${styles.summaryValue}`}
                  value={authDiscount}
                  onChange={e => setAuthDiscount(Number(e.target.value))}
                />
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel} style={{ fontWeight: 600, color: 'var(--text-main)' }}>Net Payable (=)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue}`} style={{ fontWeight: 700 }} value={`₹${netPayable.toLocaleString()}`} readOnly />
              </div>

              <div className={styles.divider}></div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Advance Deposit (-)</span>
                <input
                  type="number"
                  className={`${styles.input} ${styles.summaryValue}`}
                  value={depositAmount}
                  onChange={e => setDepositAmount(Number(e.target.value))}
                />
              </div>

              <div className={styles.summaryRow} style={{ marginTop: '8px' }}>
                <span className={styles.summaryLabel} style={{ fontWeight: 700, color: '#166534' }}>Balance Payable (=)</span>
                <input type="text" className={`${styles.input} ${styles.summaryValue} ${styles.summaryValueSuccess}`} style={{ fontWeight: 700 }} value={`₹${finalPayable.toLocaleString()}`} readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionGroup}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => navigate('/inpatient-receipt')}
          >
            Inpatient Receipt
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => activeAdmission && navigate(`/patient-past-info?id=${encodeURIComponent(activeAdmission.uhid)}`)}
          >
            Past History
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handlePrint}
          >
            <Printer size={16} /> Print Bill (A4 PDF)
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button
            type="button"
            className={styles.primaryBtn}
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            onClick={handleSaveBill}
            disabled={loading}
          >
            <Save size={18} /> {loading ? 'Saving...' : 'Save Bill'}
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => navigate('/indoor-summary')}
          >
            <XCircle size={16} /> Return to Chart
          </button>
        </div>
      </div>

      <GlobalBottomActionBar
        onSave={handleSaveBill}
        saveLabel={loading ? 'Saving...' : 'Save Inpatient Bill'}
        isSaving={loading}
        saveDisabled={!activeAdmission}
        onPrint={handlePrint}
        printLabel="Print Bill (PDF)"
        printDisabled={!activeAdmission}
        onCancel={() => navigate('/indoor-summary')}
        cancelLabel="Return to Chart"
        statusMessage={
          activeAdmission
            ? `${activeAdmission.patient_name} (${activeAdmission.uhid}) | Net Payable: ₹${netPayable.toFixed(2)}`
            : 'Select an admitted inpatient to prepare bill'
        }
      />
    </div>
  );
};

export default InpatientBill;
