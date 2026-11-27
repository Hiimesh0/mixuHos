import React, { useState } from 'react';
import { Download, Printer, X, FileText, CheckCircle2, FileSpreadsheet, Eye } from 'lucide-react';
import styles from './AccountsDashboard.module.css';
import { type AccountsFilterParams } from '../../api/accountsApi';
import { patientApi } from '../../api/patientApi';
import { admissionApi, depositApi, bedApi } from '../../api/hospitalApi';
import {
  buildPaymentWiseReport,
  buildPatientWiseReport,
  buildDateWiseCollectionReport,
  buildBedOccupancyReport,
  downloadReportPdf,
  downloadReportExcel,
  downloadReportCsv,
  printReportView,
  type UniversalReportData
} from '../../utils/universalReportEngine';

interface AccountsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: AccountsFilterParams;
}

const REPORT_OPTIONS = [
  {
    id: 'payment_wise',
    title: 'Payment Wise Collection Report',
    description: 'Hospital matrix: IPD Deposit, Lab, OPD, Echo, TMT, Packages vs Card, Cash, Cheque, UPI/QR, RTGS with row & column totals.'
  },
  {
    id: 'patient_wise',
    title: 'Patient Wise Billing & Ledger Report',
    description: 'Patient-by-patient financial breakdown with UHID, phone, consultant doctor, billed amount, received, and outstanding balance.'
  },
  {
    id: 'date_wise_collection',
    title: 'Date Wise Daily Collection Report',
    description: 'Daily cash counter and electronic collections log itemizing receipt numbers, payment modes, and daily grand totals.'
  },
  {
    id: 'bed_occupancy',
    title: 'Bed Utilization & Ward Occupancy Report',
    description: 'Real-time bed matrix across ICU, Deluxe, Special, and General wards with admitted patient details and utilization percentages.'
  },
  {
    id: 'opd_consultation',
    title: 'OPD Consultation & Procedure Report',
    description: 'Outpatient consultation revenue, doctor attributions, and procedure fee collections.'
  },
  {
    id: 'ipd_billing',
    title: 'Inpatient Billing & Deposit Report',
    description: 'Comprehensive inpatient bed charges, doctor visits, medicines, and advance deposit settlement ledger.'
  }
];

export const AccountsExportModal: React.FC<AccountsExportModalProps> = ({
  isOpen,
  onClose,
  currentFilter
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('payment_wise');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<UniversalReportData | null>(null);

  if (!isOpen) return null;

  const prepareReportData = async (): Promise<UniversalReportData> => {
    const [ptsRes, billsRes, depsRes, bedsRes, admsRes] = await Promise.allSettled([
      patientApi.getPatients(),
      patientApi.getAllBills(),
      depositApi.getDeposits(),
      bedApi.getBeds(),
      admissionApi.getAdmissions()
    ]);

    const patients = ptsRes.status === 'fulfilled' ? (Array.isArray(ptsRes.value) ? ptsRes.value : ((ptsRes.value as any)?.patients || [])) : [];
    const bills = billsRes.status === 'fulfilled' ? billsRes.value : [];
    const deposits = depsRes.status === 'fulfilled' ? depsRes.value : [];
    const beds = bedsRes.status === 'fulfilled' ? bedsRes.value : [];
    const admissions = admsRes.status === 'fulfilled' ? admsRes.value : [];

    const options = {
      periodLabel: currentFilter.period ? currentFilter.period.toUpperCase().replace(/_/g, ' ') : 'ALL TIME RECORDS',
      startDate: currentFilter.start_date,
      endDate: currentFilter.end_date
    };

    if (selectedReport === 'payment_wise') {
      return buildPaymentWiseReport(bills, deposits, options);
    } else if (selectedReport === 'patient_wise') {
      return buildPatientWiseReport(patients, bills, options);
    } else if (selectedReport === 'bed_occupancy') {
      return buildBedOccupancyReport(beds, admissions, options);
    } else {
      // date wise / transactions
      const transactions = [
        ...bills.map((b: any) => ({
          date: b.billDate || (b.createdAt ? b.createdAt.split('T')[0] : '2026-11-27'),
          reference_no: b.invoiceNo || b.id,
          type: 'Bill',
          uhid: b.uhid,
          patient_name: b.patientName,
          payment_mode: b.paymentType || 'Cash',
          amount: parseFloat(b.totalReceived) || parseFloat(b.netAmount) || 0,
          status: b.status || 'Paid'
        })),
        ...deposits.map((d: any) => ({
          date: d.deposit_date || (d.created_at ? d.created_at.split('T')[0] : '2026-11-27'),
          reference_no: d.receipt_no || d.id,
          type: 'Deposit',
          uhid: d.uhid,
          patient_name: d.patient_name,
          payment_mode: d.payment_mode || 'Online / UPI',
          amount: parseFloat(d.amount) || 0,
          status: 'Received'
        }))
      ];
      return buildDateWiseCollectionReport(transactions, options);
    }
  };

  const handlePreview = async () => {
    try {
      setIsExporting(true);
      const rep = await prepareReportData();
      setPreviewData(rep);
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg('Failed to build preview. Please check connection.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      const rep = await prepareReportData();
      downloadReportPdf(rep);
      setFeedbackMsg('High-resolution PDF report generated and downloaded.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg('Failed to generate PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setIsExporting(true);
      const rep = await prepareReportData();
      downloadReportExcel(rep);
      setFeedbackMsg('Excel spreadsheet (.xls) generated and downloaded.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg('Failed to generate Excel spreadsheet.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      setIsExporting(true);
      const rep = await prepareReportData();
      downloadReportCsv(rep);
      setFeedbackMsg('RFC-4180 CSV report generated and downloaded.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg('Failed to generate CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    try {
      const rep = await prepareReportData();
      printReportView(rep);
    } catch {
      window.print();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} style={{ maxWidth: previewData ? '900px' : '700px' }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#0284c7" />
            <h3 className={styles.modalTitle}>Multi-Format Financial Reporting Engine</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Generate reconciled institutional reports matching the official hospital Payment Wise matrix.
            All totals are calculated from live patient bills, advance deposits, and bed occupancy records for period:{' '}
            <strong style={{ color: '#0f172a' }}>{currentFilter.period || 'All Records'}</strong>.
          </p>

          {feedbackMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {previewData ? (
            <div style={{ maxHeight: '380px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#0f2b3c', fontSize: '15px' }}>{previewData.title}</h4>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Period: {previewData.periodLabel} | Generated: {previewData.generatedAt}</span>
                </div>
                <button
                  type="button"
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}
                  onClick={() => setPreviewData(null)}
                >
                  Back to Selection
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
                <thead>
                  <tr style={{ background: '#0f2b3c', color: '#ffffff' }}>
                    {previewData.columns.map((col, idx) => (
                      <th key={idx} style={{ padding: '6px 8px', textAlign: idx === 0 ? 'left' : 'right', border: '1px solid #94a3b8' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((row, rIdx) => (
                    <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} style={{ padding: '5px 8px', textAlign: cIdx === 0 ? 'left' : 'right', border: '1px solid #e2e8f0', fontWeight: cIdx === 0 ? 600 : 400 }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {previewData.grandTotal && (
                    <tr style={{ background: '#e2e8f0', fontWeight: 700, color: '#0f172a' }}>
                      {previewData.grandTotal.map((cell, cIdx) => (
                        <td key={cIdx} style={{ padding: '6px 8px', textAlign: cIdx === 0 ? 'left' : 'right', border: '1px solid #94a3b8' }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.reportOptionList}>
              {REPORT_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  className={`${styles.reportOptionItem} ${selectedReport === opt.id ? styles.reportOptionActive : ''}`}
                  onClick={() => setSelectedReport(opt.id)}
                >
                  <input
                    type="radio"
                    name="reportSelection"
                    checked={selectedReport === opt.id}
                    onChange={() => setSelectedReport(opt.id)}
                    style={{ marginTop: '2px', accentColor: '#0284c7', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{opt.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{opt.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalFooter} style={{ flexWrap: 'wrap', gap: '8px' }}>
          <button className={styles.actionBtn} onClick={onClose}>
            Close
          </button>
          {!previewData && (
            <button className={styles.actionBtn} onClick={handlePreview} disabled={isExporting}>
              <Eye size={15} />
              Preview Table
            </button>
          )}
          <button className={styles.actionBtn} onClick={handlePrint} disabled={isExporting}>
            <Printer size={15} />
            Print
          </button>
          <button className={styles.actionBtn} onClick={handleDownloadCsv} disabled={isExporting}>
            <Download size={15} />
            CSV
          </button>
          <button className={styles.actionBtn} onClick={handleDownloadExcel} disabled={isExporting}>
            <FileSpreadsheet size={15} color="#16a34a" />
            Excel (.xls)
          </button>
          <button
            className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
            onClick={handleDownloadPdf}
            disabled={isExporting}
          >
            <Download size={15} />
            {isExporting ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountsExportModal;
