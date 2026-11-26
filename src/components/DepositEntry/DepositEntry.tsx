import React, { useState, useEffect, useCallback } from 'react';
import { Printer, Plus, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import styles from './DepositEntry.module.css';
import { depositApi, admissionApi, type DepositRecord, type AdmissionRecord } from '../../api/hospitalApi';
import { openDepositReceiptPrint } from '../../utils/universalPrintGenerator';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';
import GlobalBottomActionBar from '../common/GlobalBottomActionBar';

const DepositEntry: React.FC = () => {
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>('');
  const [depositDate, setDepositDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<number>(5000);
  const [paymentMode, setPaymentMode] = useState<string>('Cash');
  const [remarks, setRemarks] = useState<string>('Advance deposit for inpatient stay');
  const [authorizedBy, setAuthorizedBy] = useState<string>('Admin Desk');
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [depList, admList] = await Promise.all([
        depositApi.getDeposits(),
        admissionApi.getAdmissions(),
      ]);
      setDeposits(depList);
      setAdmissions(admList);
      if (admList.length > 0 && !selectedAdmissionId) {
        setSelectedAdmissionId(admList[admList.length - 1].id);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load deposits.' });
    } finally {
      setLoading(false);
    }
  }, [selectedAdmissionId, setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedAdmission = admissions.find(a => a.id === selectedAdmissionId);

  const handleAddDeposit = async () => {
    if (!selectedAdmission) {
      setNotification({ type: 'warning', message: 'Please select an inpatient.' });
      return;
    }
    if (amount <= 0) {
      setNotification({ type: 'warning', message: 'Deposit amount must be greater than zero.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<DepositRecord> = {
        uhid: selectedAdmission.uhid,
        patient_name: selectedAdmission.patient_name,
        ipd_no: selectedAdmission.ipd_no,
        deposit_date: depositDate,
        amount: Number(amount),
        payment_mode: paymentMode,
        authorized_by: authorizedBy,
        remarks: remarks,
      };

      const result = await depositApi.createDeposit(payload);
      setNotification({
        type: 'success',
        message: `Deposit receipt #${result.receipt_no} of Rs. ${result.amount} recorded!`,
      });

      // Reload
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error recording deposit.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (dep?: DepositRecord) => {
    const toPrint = dep || (deposits.length > 0 ? deposits[deposits.length - 1] : undefined);
    if (!toPrint) {
      setNotification({ type: 'warning', message: 'No deposit record to print.' });
      return;
    }
    openDepositReceiptPrint(toPrint);
  };

  const totalPatientDeposits = deposits
    .filter(d => selectedAdmission && (d.uhid === selectedAdmission.uhid || d.ipd_no === selectedAdmission.ipd_no))
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  return (
    <div className={`${styles.pageContainer} hasBottomActionBar`}>
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

      {/* Top Header */}
      <div className={styles.topHeader}>
        <h1 className={styles.pageTitle}>Indoor Deposit & Part Payment Entry</h1>
      </div>

      {/* Main Form Card */}
      <div className={styles.formCard}>
        {/* Patient Context Bar */}
        <div className={styles.contextBar}>
          <div className={`${styles.contextBlock} ${styles.contextBlockName}`}>
            {selectedAdmission ? `${selectedAdmission.patient_name} (${selectedAdmission.uhid})` : 'Select Patient'}
          </div>
          <div className={styles.contextBlock}>
            {selectedAdmission ? `IPD: ${selectedAdmission.ipd_no} | Bed: ${selectedAdmission.bed_number}` : '--'}
          </div>
          <div className={styles.contextBlock}>
            Cumulative Paid: Rs. {totalPatientDeposits.toFixed(2)}
          </div>
          <div className={styles.contextBlock}>
            Admitted: {selectedAdmission?.admission_date || '--'}
          </div>
        </div>

        {/* Data Entry Form Row */}
        <div className={styles.entryForm}>
          <div className={styles.fieldGroup} style={{ flex: '0 0 240px' }}>
            <label className={styles.label}>Select Inpatient *</label>
            <select
              className={styles.select}
              value={selectedAdmissionId}
              onChange={e => setSelectedAdmissionId(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">-- Choose Patient --</option>
              {admissions.map(a => (
                <option key={a.id} value={a.id}>
                  {a.patient_name} ({a.ipd_no} | Bed {a.bed_number})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup} style={{ flex: '0 0 140px' }}>
            <label className={styles.label}>Date *</label>
            <input
              type="date"
              className={styles.input}
              value={depositDate}
              onChange={e => setDepositDate(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup} style={{ flex: '0 0 120px' }}>
            <label className={styles.label}>Payment Mode *</label>
            <select
              className={styles.select}
              value={paymentMode}
              onChange={e => setPaymentMode(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI / QR">UPI / QR</option>
              <option value="Credit / Debit Card">Card</option>
              <option value="Cheque">Cheque</option>
              <option value="NEFT / Bank Transfer">NEFT</option>
            </select>
          </div>

          <div className={styles.fieldGroup} style={{ flex: '0 0 130px' }}>
            <label className={styles.label}>Amount (Rs.) *</label>
            <input
              type="number"
              min="1"
              step="100"
              className={styles.input}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
            />
          </div>

          <div className={styles.fieldGroup} style={{ flex: '1' }}>
            <label className={styles.label}>Remarks / Ref</label>
            <input
              type="text"
              className={styles.input}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
          </div>

          <div className={styles.actionGroup}>
            <button
              className={styles.primaryBtn}
              onClick={handleAddDeposit}
              disabled={loading}
              style={{ backgroundColor: '#2563eb', color: '#fff' }}
            >
              <Plus size={16} /> Add Deposit
            </button>
            <button className={styles.secondaryBtn} onClick={() => handlePrint()}>
              <Printer size={16} /> Print Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className={styles.tableCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e3a8a' }}>Deposit Receipt Ledger</h3>
          <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#2563eb' }}>
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Receipt No</th>
                <th style={{ width: '110px' }}>Date</th>
                <th style={{ width: '120px' }}>Amount (Rs.)</th>
                <th style={{ width: '110px' }}>Payment Mode</th>
                <th style={{ width: '200px' }}>Patient</th>
                <th style={{ width: '120px' }}>UHID / IPD</th>
                <th style={{ width: '180px' }}>Remarks</th>
                <th style={{ width: '110px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No deposit records found. Record a deposit above.
                  </td>
                </tr>
              ) : (
                deposits.slice().reverse().map(dep => (
                  <tr key={dep.id}>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{dep.receipt_no}</td>
                    <td>{dep.deposit_date}</td>
                    <td style={{ fontWeight: 700 }}>Rs. {Number(dep.amount).toFixed(2)}</td>
                    <td><span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#eff6ff', fontSize: '11px', fontWeight: 600 }}>{dep.payment_mode}</span></td>
                    <td style={{ fontWeight: 600 }}>{dep.patient_name}</td>
                    <td>{dep.uhid} {dep.ipd_no ? `(${dep.ipd_no})` : ''}</td>
                    <td>{dep.remarks || '-'}</td>
                    <td>
                      <button
                        onClick={() => handlePrint(dep)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                        }}
                      >
                        <Printer size={12} /> Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GlobalBottomActionBar
        onSave={handleAddDeposit}
        saveLabel={loading ? 'Saving...' : 'Add Deposit'}
        isSaving={loading}
        saveDisabled={!selectedAdmissionId || amount <= 0}
        onPrint={() => handlePrint()}
        printLabel="Print Receipt"
        printDisabled={deposits.length === 0}
        statusMessage={
          selectedAdmission
            ? `Advance Deposit | ${selectedAdmission.patient_name} (${selectedAdmission.uhid}) | Amount: Rs. ${amount.toFixed(2)}`
            : 'Select inpatient admission to record advance deposit'
        }
      />
    </div>
  );
};

export default DepositEntry;
