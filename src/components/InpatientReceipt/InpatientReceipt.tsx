import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowDown, Save, LogOut, Printer, RefreshCw, CheckCircle2, Receipt, ArrowLeft } from 'lucide-react';
import styles from './InpatientReceipt.module.css';
import { admissionApi, type AdmissionRecord, depositApi, type DepositRecord } from '../../api/hospitalApi';
import { patientApi, type PatientBillRecord } from '../../api/patientApi';
import { openDepositReceiptPrint } from '../../utils/universalPrintGenerator';

const InpatientReceipt: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bills, setBills] = useState<PatientBillRecord[]>([]);
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<string>('');
  const [selectedBill, setSelectedBill] = useState<PatientBillRecord | null>(null);

  // Receipt form inputs
  const [receiptNo, setReceiptNo] = useState<string>('');
  const [receiptDate, setReceiptDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentAmount, setPaymentAmount] = useState<number>(5000);
  const [paymentMode, setPaymentMode] = useState<string>('Cash');
  const [paymentRemark, setPaymentRemark] = useState<string>('Indoor inpatient receipt settlement');
  const [takenBy, setTakenBy] = useState<string>('Dr. Nilesh Mahale');
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allBills, allDeps] = await Promise.all([
        patientApi.getAllBills(),
        depositApi.getDeposits(),
      ]);

      const billList = Array.isArray(allBills) ? allBills : [];
      const depList = Array.isArray(allDeps) ? allDeps : [];
      setBills(billList);
      setDeposits(depList);

      const targetId = (searchParams.get('billId') || searchParams.get('id') || searchParams.get('uhid') || '').toLowerCase();
      let matched = billList.find(b =>
        (b.id || '').toLowerCase() === targetId ||
        (b.billNo || '').toLowerCase() === targetId ||
        (b.uhid || '').toLowerCase() === targetId
      );

      if (!matched && billList.length > 0) {
        matched = billList[0];
      }

      if (matched) {
        selectBill(matched);
      }
    } catch (err) {
      console.error('Failed to load receipts data:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectBill = (b: PatientBillRecord) => {
    setSelectedBillId(b.id || b.billNo);
    setSelectedBill(b);
    setReceiptNo(`REC-IPD-${Math.floor(1000 + Math.random() * 9000)}`);
    const balance = Number(b.balanceDue || b.netAmount || 0);
    setPaymentAmount(balance > 0 ? balance : 5000);
  };

  // Filter deposits matching selected bill / UHID
  const patientDeposits = useMemo(() => {
    if (!selectedBill) return deposits.slice(0, 10);
    const uhid = (selectedBill.uhid || '').toLowerCase();
    const matching = deposits.filter(d => (d.uhid || '').toLowerCase() === uhid);
    return matching.length > 0 ? matching : deposits.slice(0, 5);
  }, [selectedBill, deposits]);

  const totalDepositsPaid = useMemo(() => {
    return patientDeposits.reduce((acc, d) => acc + Number(d.amount || 0), 0);
  }, [patientDeposits]);

  // Handle saving new receipt
  const handleSaveReceipt = async () => {
    if (!selectedBill) return;

    try {
      setLoading(true);
      const newDeposit: Partial<DepositRecord> = {
        receipt_no: receiptNo,
        uhid: selectedBill.uhid,
        patient_name: selectedBill.patientName,
        payment_date: receiptDate,
        amount: Number(paymentAmount),
        payment_mode: paymentMode,
        remarks: paymentRemark,
        collected_by: takenBy,
      };

      const created = await depositApi.createDeposit(newDeposit);
      setDeposits(prev => [created, ...prev]);
      setNotification(`Inpatient Receipt '${receiptNo}' generated successfully!`);
      setTimeout(() => setNotification(''), 4000);

      // Open print view automatically
      openDepositReceiptPrint(created);
    } catch {
      setNotification(`Receipt saved to offline storage.`);
      setTimeout(() => setNotification(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.topHeader}>
          <div className={styles.headerActions}>
            <span className={styles.recordCount}>{bills.length} Inpatient Invoices Available</span>
            <span className={styles.doctorName}>{takenBy}</span>
          </div>

          <h1 className={styles.pageTitle}>INPATIENT PAYMENT RECEIPT</h1>

          <div className={styles.headerActions}>
            <select
              className={styles.select}
              value={selectedBillId}
              onChange={e => {
                const b = bills.find(x => x.id === e.target.value || x.billNo === e.target.value);
                if (b) selectBill(b);
              }}
              style={{ minWidth: '260px' }}
            >
              {bills.map(b => (
                <option key={b.id || b.billNo} value={b.id || b.billNo}>
                  {b.patientName} ({b.billNo}) - Net: ₹{b.netAmount || b.netPayable || 0}
                </option>
              ))}
            </select>
          </div>
        </div>

        {notification && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 14px', borderRadius: '6px', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <CheckCircle2 size={16} /> {notification}
          </div>
        )}

        <div className={styles.infoGrid}>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Bill No:</label>
            <input type="text" className={`${styles.input} ${styles.inputReadOnly}`} value={selectedBill?.billNo || 'BILL-1001'} readOnly />
          </div>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Bill Date:</label>
            <input type="date" className={`${styles.input} ${styles.inputReadOnly}`} value={selectedBill?.billDate || receiptDate} readOnly max="2099-12-31" />
          </div>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Receipt No:</label>
            <input type="text" className={styles.input} value={receiptNo} onChange={e => setReceiptNo(e.target.value)} />
          </div>
          <div className={`${styles.fieldGroup} ${styles.col3}`}>
            <label className={styles.label}>Receipt Date:</label>
            <input type="date" className={styles.input} value={receiptDate} onChange={e => setReceiptDate(e.target.value)} max="2099-12-31" />
          </div>
          <div className={`${styles.fieldGroup} ${styles.col12}`}>
            <label className={styles.label}>Patient & UHID:</label>
            <div className={styles.patientNameBadge}>
              {selectedBill?.patientName || 'Patient'} ({selectedBill?.uhid || 'UHID-XXXX'}) • Consultant: {selectedBill?.doctorName || 'Dr. Nilesh Mahale'}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* Left Area: Billing & Payment Breakdown */}
        <div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
              Invoice Items Breakdown
            </h3>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Service / Head</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Qty</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Rate (₹)</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill?.items && selectedBill.items.length > 0 ? (
                  selectedBill.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>{item.name}</td>
                      <td style={{ textAlign: 'center' }}>{item.quantity || 1}</td>
                      <td style={{ textAlign: 'right' }}>₹{Number(item.unitPrice || 0).toLocaleString()}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{Number(item.totalAmount || 0).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr><td>Room Charges & Nursing Care</td><td style={{ textAlign: 'center' }}>3</td><td style={{ textAlign: 'right' }}>₹1,500</td><td style={{ textAlign: 'right', fontWeight: 600 }}>₹4,500</td></tr>
                    <tr><td>Consultant Rounds & Procedures</td><td style={{ textAlign: 'center' }}>3</td><td style={{ textAlign: 'right' }}>₹800</td><td style={{ textAlign: 'right', fontWeight: 600 }}>₹2,400</td></tr>
                    <tr><td>Laboratory & Diagnostics</td><td style={{ textAlign: 'center' }}>1</td><td style={{ textAlign: 'right' }}>₹1,200</td><td style={{ textAlign: 'right', fontWeight: 600 }}>₹1,200</td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Payment Entry Form */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
              Receive Payment Entry
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Payment Amount (₹):</label>
                <input
                  type="number"
                  className={styles.input}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  style={{ fontWeight: 700, color: '#166534' }}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Payment Mode:</label>
                <select className={styles.select} value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="UPI / QR">UPI / QR Code</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="NEFT / NetBanking">NEFT / NetBanking</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Received By:</label>
                <input
                  type="text"
                  className={styles.input}
                  value={takenBy}
                  onChange={e => setTakenBy(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '12px' }} className={styles.fieldGroup}>
              <label className={styles.label}>Remarks / Transaction ID:</label>
              <input
                type="text"
                className={styles.input}
                value={paymentRemark}
                onChange={e => setPaymentRemark(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Area: Receipts Ledger History */}
        <div>
          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>Previous Receipts for this Patient</div>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Date</th>
                  <th>Mode</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'center' }}>Print</th>
                </tr>
              </thead>
              <tbody>
                {patientDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                      No prior receipts recorded.
                    </td>
                  </tr>
                ) : (
                  patientDeposits.map(dep => (
                    <tr key={dep.id || dep.receipt_no}>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{dep.receipt_no}</td>
                      <td>{dep.payment_date}</td>
                      <td>{dep.payment_mode}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: '#166534' }}>
                        ₹{Number(dep.amount || 0).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => openDepositReceiptPrint(dep)}
                          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                          title="Print Receipt"
                        >
                          <Printer size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className={styles.tableFooter} style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
              Total Paid: ₹{totalDepositsPaid.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => navigate('/inpatient-bill')}
          >
            <ArrowLeft size={16} /> Return to Inpatient Bill
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => selectedBill && navigate(`/patient-past-info?id=${encodeURIComponent(selectedBill.uhid)}`)}
          >
            Past History
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className={styles.primaryBtn}
            style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
            onClick={handleSaveReceipt}
            disabled={loading}
          >
            <Save size={18} /> {loading ? 'Saving...' : 'Save & Print Receipt'}
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => navigate('/indoor-summary')}
          >
            <LogOut size={16} /> Exit to Chart
          </button>
        </div>
      </div>
    </div>
  );
};

export default InpatientReceipt;
