import React, { useState } from 'react';
import { Download, Printer, X, FileText, CheckCircle2 } from 'lucide-react';
import styles from './AccountsDashboard.module.css';
import { accountsApi, type AccountsFilterParams } from '../../api/accountsApi';

interface AccountsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: AccountsFilterParams;
}

const REPORT_OPTIONS = [
  {
    id: 'daily_collection',
    title: 'Daily Collection Summary',
    description: 'Itemized cash, UPI, card, and advance collections with patient UHID and reference numbers.'
  },
  {
    id: 'monthly_revenue',
    title: 'Monthly Revenue Reconciliation',
    description: 'Comprehensive month-wise billed vs collected revenue comparison, discounts, and net intake.'
  },
  {
    id: 'bed_occupancy',
    title: 'Inpatient Bed Occupancy & Tariff Report',
    description: 'Current and historical bed occupancy percentages by ward, vacant beds, and tariff accruals.'
  },
  {
    id: 'outstanding_balances',
    title: 'Outstanding Patient Balances Report',
    description: 'Unpaid inpatient and outpatient balances categorized by patient, contact, and admission date.'
  },
  {
    id: 'payment_modes',
    title: 'Payment Mode Distribution (Cash / UPI / Card)',
    description: 'Audit breakdown of all payment instruments received across bills, deposits, and part payments.'
  },
  {
    id: 'doctor_billing',
    title: 'Doctor & Consultant Billing Report',
    description: 'Revenue attribution across visiting consultants, inpatient rounds, procedures, and surgeries.'
  },
  {
    id: 'patient_ledger',
    title: 'Comprehensive Patient Ledger',
    description: 'Complete double-entry debit, credit, and running balance ledger for all financial transactions.'
  },
  {
    id: 'audit_reconciliation',
    title: 'Audit Trail & Financial Reconciliation',
    description: 'System-wide audit trail with timestamped entries, user actions, bill IDs, and deposit receipts.'
  }
];

export const AccountsExportModal: React.FC<AccountsExportModalProps> = ({
  isOpen,
  onClose,
  currentFilter
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('daily_collection');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadCsv = async () => {
    try {
      setIsExporting(true);
      setFeedbackMsg(null);
      await accountsApi.exportReport(selectedReport, {
        ...currentFilter,
        format: 'csv'
      });
      setFeedbackMsg('Report CSV generated and download started successfully.');
      setTimeout(() => {
        setFeedbackMsg(null);
      }, 3500);
    } catch (err: any) {
      console.error('Export CSV error:', err);
      setFeedbackMsg('Export failed. Please check network and try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#0284c7" />
            <h3 className={styles.modalTitle}>Financial Reports & Export Center</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Select from the 8 verified financial reporting schedules below. Exports reconcile with all
            recorded patient bills, advance deposits, and bed occupancy records for period:{' '}
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
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.actionBtn} onClick={onClose}>
            Close
          </button>
          <button className={styles.actionBtn} onClick={handlePrint}>
            <Printer size={15} />
            Print View
          </button>
          <button
            className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
            onClick={handleDownloadCsv}
            disabled={isExporting}
          >
            <Download size={15} />
            {isExporting ? 'Generating CSV...' : 'Download CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AccountsExportModal;
