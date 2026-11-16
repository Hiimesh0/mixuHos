import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowDown, X, Printer, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { HOSPITAL_CONFIG } from '../../config/hospitalConfig';
import styles from './PartPayment.module.css';
import { depositApi, admissionApi, type DepositRecord, type AdmissionRecord } from '../../api/hospitalApi';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { openDepositReceiptPrint } from '../../utils/universalPrintGenerator';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface ServiceItem {
  id: string;
  details: string;
  charges: number;
  doctor: string;
}

const PartPayment: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [services, setServices] = useState<ServiceItem[]>([
    { id: '1', details: 'Bed Charges (General Ward)', charges: 3000, doctor: 'Dr. Nilesh Mahale' },
    { id: '2', details: 'Nursing & Monitoring Charges', charges: 1200, doctor: 'Nursing Staff' },
    { id: '3', details: 'Doctor Routine Inpatient Visit', charges: 1500, doctor: 'Dr. Nilesh Mahale' },
  ]);

  const [serviceDetail, setServiceDetail] = useState('');
  const [serviceCharge, setServiceCharge] = useState<number>(1000);
  const [serviceDoctor, setServiceDoctor] = useState('Dr. Nilesh Mahale');

  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountDoctor, setDiscountDoctor] = useState('Dr. Nilesh Mahale');

  // Receipt Modal State
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [nowPaidAmt, setNowPaidAmt] = useState<number>(2000);
  const [payType, setPayType] = useState<string>('Cash');
  const [payRemark, setPayRemark] = useState<string>('Part payment against indoor bill');
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [pats, adms, deps] = await Promise.all([
        patientApi.getPatients(),
        admissionApi.getAdmissions(),
        depositApi.getDeposits(),
      ]);
      const patList: PatientRecord[] = Array.isArray(pats) ? pats : ((pats as any)?.patients || []);
      setPatients(patList);
      setAdmissions(Array.isArray(adms) ? adms : []);
      setDeposits(Array.isArray(deps) ? deps : []);
      if (patList.length > 0 && !selectedPatientId) {
        setSelectedPatientId(patList[0].uhid || patList[0].id);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load billing records.' });
    } finally {
      setLoading(false);
    }
  }, [selectedPatientId, setNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId || p.uhid === selectedPatientId);
  }, [patients, selectedPatientId]);

  const grossTotal = useMemo(() => {
    return services.reduce((sum, s) => sum + Number(s.charges || 0), 0);
  }, [services]);

  const discountAmount = useMemo(() => {
    return Math.round((grossTotal * (discountPercent || 0)) / 100);
  }, [grossTotal, discountPercent]);

  const netTotal = grossTotal - discountAmount;

  const patientDeposits = useMemo(() => {
    if (!currentPatient) return [];
    return deposits.filter(d => (d.uhid || '').toLowerCase() === (currentPatient.uhid || currentPatient.id || '').toLowerCase());
  }, [deposits, currentPatient]);

  const totalPaid = useMemo(() => {
    return patientDeposits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  }, [patientDeposits]);

  const dueAmount = Math.max(0, netTotal - totalPaid);

  const handleAddService = () => {
    if (!serviceDetail.trim()) {
      setNotification({ type: 'warning', message: 'Please enter service details.' });
      return;
    }
    const newItem: ServiceItem = {
      id: String(Date.now()),
      details: serviceDetail,
      charges: Number(serviceCharge) || 0,
      doctor: serviceDoctor,
    };
    setServices([...services, newItem]);
    setServiceDetail('');
    setServiceCharge(1000);
    setNotification({ type: 'success', message: `Added service '${newItem.details}'.` });
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleRecordPayment = async () => {
    if (!currentPatient) {
      setNotification({ type: 'warning', message: 'Please select a patient.' });
      return;
    }
    if (nowPaidAmt <= 0) {
      setNotification({ type: 'warning', message: 'Payment amount must be greater than 0.' });
      return;
    }

    try {
      setLoading(true);
      const adm = admissions.find(a => (a.uhid || '').toLowerCase() === (currentPatient.uhid || currentPatient.id || '').toLowerCase());
      const payload: Partial<DepositRecord> = {
        uhid: currentPatient.uhid || currentPatient.id,
        patient_name: currentPatient.name,
        ipd_no: adm?.ipd_no || '',
        deposit_date: new Date().toISOString().split('T')[0],
        amount: Number(nowPaidAmt),
        payment_mode: payType,
        authorized_by: 'Admin / Accounts',
        remarks: payRemark,
      };

      const result = await depositApi.createDeposit(payload);
      setNotification({
        type: 'success',
        message: `Part payment receipt #${result.receipt_no} of Rs. ${result.amount} recorded successfully!`,
      });

      // Reload deposits
      const updatedDeps = await depositApi.getDeposits();
      setDeposits(updatedDeps);
      setNowPaidAmt(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error recording payment.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = (dep?: DepositRecord) => {
    const toPrint = dep || (patientDeposits.length > 0 ? patientDeposits[patientDeposits.length - 1] : undefined);
    if (!toPrint) {
      setNotification({ type: 'warning', message: 'No payment receipt available to print.' });
      return;
    }
    openDepositReceiptPrint(toPrint);
  };

  return (
    <div className={styles.pageContainer}>
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

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.patientName} style={{ margin: 0 }}>
            {currentPatient ? `${currentPatient.name} (${currentPatient.uhid || currentPatient.id})` : 'Select Patient'}
          </h1>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Age: {currentPatient?.age || 35} Yrs | Sex: {currentPatient?.gender || 'Male'} | Mobile: {currentPatient?.mobile || '-'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className={styles.input}
            style={{ width: '260px' }}
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
          >
            <option value="">-- Choose Patient ({patients.length} Registered) --</option>
            {patients.map(p => (
              <option key={p.uhid || p.id} value={p.uhid || p.id}>
                {p.name || [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ') || p.uhid} ({p.uhid})
              </option>
            ))}
          </select>
          <span className={styles.hospitalName}>{HOSPITAL_CONFIG.name}</span>
        </div>
      </div>

      <div className={styles.content}>
        {/* Service Entry Row */}
        <div className={styles.entryRow}>
          <div className={styles.fieldGroup} style={{ flex: 2 }}>
            <label className={styles.label}>Service / Charge Details *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. ICU Monitoring, Consultation, Dressing"
              value={serviceDetail}
              onChange={e => setServiceDetail(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Charges (Rs.) *</label>
            <input
              type="number"
              min="0"
              step="50"
              className={styles.input}
              value={serviceCharge}
              onChange={e => setServiceCharge(Number(e.target.value))}
            />
          </div>
          <div className={styles.fieldGroup} style={{ flex: 1.5 }}>
            <label className={styles.label}>Doctor / Department</label>
            <input
              type="text"
              className={styles.input}
              value={serviceDoctor}
              onChange={e => setServiceDoctor(e.target.value)}
            />
          </div>
          <button className={styles.iconBtn} onClick={handleAddService} aria-label="Add Service" title="Add Service Item">
            <Plus size={18} />
          </button>
        </div>

        {/* Main Grid: Services Table & Discount Section */}
        <div className={styles.mainGrid}>
          {/* Services Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Professional Fees To Dr</th>
                  <th style={{ textAlign: 'right' }}>Charges (Rs.)</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.details}</td>
                    <td>{s.doctor}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>Rs. {Number(s.charges).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteService(s.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Remove service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Discount & Totals Section */}
          <div className={styles.discountSection}>
            <div className={styles.discountRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Discount Auth By</label>
                <input
                  type="text"
                  className={styles.input}
                  value={discountDoctor}
                  onChange={e => setDiscountDoctor(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup} style={{ width: '80px' }}>
                <label className={styles.label}>Disc %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className={styles.input}
                  value={discountPercent}
                  onChange={e => setDiscountPercent(Number(e.target.value))}
                />
              </div>
              <div className={styles.fieldGroup} style={{ width: '110px' }}>
                <label className={styles.label}>Disc Amt</label>
                <input
                  type="text"
                  className={styles.input}
                  value={`Rs. ${discountAmount}`}
                  readOnly
                />
              </div>
            </div>

            {/* Financial Summary */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Gross Total:</span>
                <span style={{ fontWeight: 600 }}>Rs. {grossTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Discount ({discountPercent}%):</span>
                <span style={{ color: '#dc2626', fontWeight: 600 }}>- Rs. {discountAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid #cbd5e1', paddingTop: '6px' }}>
                <span style={{ fontWeight: 700, color: '#1e3a8a' }}>Net Payable:</span>
                <span style={{ fontWeight: 800, color: '#1e3a8a' }}>Rs. {netTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#16a34a' }}>Paid to Date:</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>Rs. {totalPaid.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', borderTop: '1px solid #cbd5e1', paddingTop: '6px' }}>
                <span style={{ fontWeight: 800, color: '#dc2626' }}>Balance Due:</span>
                <span style={{ fontWeight: 800, color: '#dc2626' }}>Rs. {dueAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.actionGroup}>
            <button
              className={`${styles.secondaryBtn} ${isReceiptModalOpen ? styles.active : ''}`}
              onClick={() => setIsReceiptModalOpen(true)}
              style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none' }}
            >
              + Record Part Payment / Receipt
            </button>
            <button className={styles.secondaryBtn} onClick={() => handlePrintReceipt()}>
              <Printer size={16} /> Print Latest Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Detail Modal */}
      {isReceiptModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Receive Part Payment - {currentPatient?.name}</h2>
              <button className={styles.closeBtn} onClick={() => setIsReceiptModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalEntryRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Balance Due Amt</label>
                  <input type="text" className={styles.input} value={`Rs. ${dueAmount.toFixed(2)}`} style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }} readOnly />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Now Paid Amt (Rs.) *</label>
                  <input
                    type="number"
                    min="1"
                    className={styles.input}
                    value={nowPaidAmt}
                    onChange={e => setNowPaidAmt(Number(e.target.value))}
                    style={{ textAlign: 'right', fontWeight: 700 }}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Pay Type</label>
                  <select className={styles.select} value={payType} onChange={e => setPayType(e.target.value)}>
                    <option value="Cash">Cash</option>
                    <option value="UPI / QR Code">UPI / QR Code</option>
                    <option value="Debit / Credit Card">Card</option>
                    <option value="Cheque">Cheque</option>
                    <option value="NEFT / RTGS">NEFT / RTGS</option>
                  </select>
                </div>
                <div className={styles.fieldGroup} style={{ flex: 2, minWidth: '200px' }}>
                  <label className={styles.label}>Remark</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={payRemark}
                    onChange={e => setPayRemark(e.target.value)}
                  />
                </div>
                <button
                  className={styles.iconBtn}
                  onClick={handleRecordPayment}
                  disabled={loading}
                  aria-label="Add Payment"
                  title="Save Receipt"
                >
                  <ArrowDown size={18} />
                </button>
              </div>

              <div className={styles.modalActionGroup}>
                <button className={styles.secondaryBtn} onClick={() => handlePrintReceipt()}>
                  <Printer size={16} /> Print Single Receipt
                </button>
                <button className={styles.secondaryBtn} onClick={() => setIsReceiptModalOpen(false)}>
                  Done
                </button>
              </div>

              {/* Patient Deposits Table */}
              <div className={styles.tableWrapper} style={{ marginTop: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Rec No</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Amount Paid</th>
                      <th>Pay Type</th>
                      <th>Remark</th>
                      <th style={{ width: '80px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientDeposits.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                          No payment receipts recorded yet for this patient.
                        </td>
                      </tr>
                    ) : (
                      patientDeposits.map(d => (
                        <tr key={d.id}>
                          <td style={{ fontWeight: 700, color: '#2563eb' }}>{d.receipt_no}</td>
                          <td>{d.deposit_date}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>Rs. {Number(d.amount).toFixed(2)}</td>
                          <td>{d.payment_mode}</td>
                          <td>{d.remarks || '-'}</td>
                          <td>
                            <button
                              onClick={() => handlePrintReceipt(d)}
                              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                            >
                              Print
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartPayment;
