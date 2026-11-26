import React from 'react';
import { Search, FileSpreadsheet, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './AccountsDashboard.module.css';
import type { AccountsTransactionsResponse, AccountTransactionRecord } from '../../api/accountsApi';

interface TransactionLedgerTableProps {
  data: AccountsTransactionsResponse | null;
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: 'all' | 'bill' | 'deposit';
  onTypeChange: (type: 'all' | 'bill' | 'deposit') => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const TransactionLedgerTable: React.FC<TransactionLedgerTableProps> = ({
  data,
  loading,
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  currentPage,
  onPageChange
}) => {
  const transactions: AccountTransactionRecord[] = data?.transactions || [];
  const totalCount = data?.total_count || 0;
  const totalPages = data?.total_pages || 1;
  const summary = data?.summary || { total_debit: 0, total_credit: 0, total_balance: 0 };

  return (
    <div className={styles.ledgerContainer}>
      <div className={styles.sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSpreadsheet size={20} color="#0284c7" />
          <h4 className={styles.sectionTitle}>Financial Transaction Ledger & Audit Journal</h4>
        </div>
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          Total Logged Transactions: <strong>{totalCount}</strong>
        </div>
      </div>

      {/* Toolbar: Search & Type Tabs */}
      <div className={styles.ledgerToolbar}>
        <div className={styles.searchBox}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by UHID, patient name, bill or receipt number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className={styles.typeFilterTabs}>
          <button
            type="button"
            className={`${styles.typeTab} ${selectedType === 'all' ? styles.typeTabActive : ''}`}
            onClick={() => onTypeChange('all')}
          >
            All Transactions
          </button>
          <button
            type="button"
            className={`${styles.typeTab} ${selectedType === 'bill' ? styles.typeTabActive : ''}`}
            onClick={() => onTypeChange('bill')}
          >
            Bills Only
          </button>
          <button
            type="button"
            className={`${styles.typeTab} ${selectedType === 'deposit' ? styles.typeTabActive : ''}`}
            onClick={() => onTypeChange('deposit')}
          >
            Advance Deposits Only
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.ledgerTable}>
          <thead>
            <tr>
              <th>Date / Time</th>
              <th>Type</th>
              <th>Ref No.</th>
              <th>UHID</th>
              <th>Patient Name</th>
              <th>Particulars / Description</th>
              <th>Mode</th>
              <th style={{ textAlign: 'right' }}>Debit (Billed)</th>
              <th style={{ textAlign: 'right' }}>Credit (Collected)</th>
              <th style={{ textAlign: 'right' }}>Balance</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className={styles.loadingState}>
                  <div className={styles.spinner} />
                  <div>Loading financial transactions...</div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={11} className={styles.emptyState}>
                  No financial transactions match the current filter and search criteria.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={`${tx.type}-${tx.id}`}>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>
                    {tx.date} <span style={{ color: '#94a3b8' }}>{tx.datetime?.split(' ')[1] || ''}</span>
                  </td>
                  <td>
                    <span className={`${styles.typeBadge} ${tx.type === 'Bill' ? styles.badgeBill : styles.badgeDeposit}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{tx.reference_no}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0369a1' }}>{tx.uhid}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{tx.patient_name}</td>
                  <td style={{ color: '#475569', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tx.particulars}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '11.5px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: '#f1f5f9',
                      color: '#475569',
                      fontWeight: 500
                    }}>
                      {tx.payment_mode}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: tx.debit > 0 ? '#0284c7' : '#94a3b8' }}>
                    {tx.debit > 0 ? `₹${tx.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: tx.credit > 0 ? '#10b981' : '#94a3b8' }}>
                    {tx.credit > 0 ? `₹${tx.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: tx.balance > 0 ? '#d97706' : '#10b981' }}>
                    ₹{tx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`${styles.statusBadge} ${
                      tx.status.toLowerCase().includes('paid')
                        ? styles.statusPaid
                        : tx.status.toLowerCase().includes('partial')
                        ? styles.statusPartial
                        : styles.statusConfirmed
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {transactions.length > 0 && (
            <tfoot>
              <tr style={{ background: '#f8fafc', fontWeight: 700, borderTop: '2px solid #cbd5e1' }}>
                <td colSpan={7} style={{ textAlign: 'right', padding: '12px 14px' }}>
                  Page Totals Summary:
                </td>
                <td style={{ textAlign: 'right', color: '#0284c7', padding: '12px 14px' }}>
                  ₹{summary.total_debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ textAlign: 'right', color: '#10b981', padding: '12px 14px' }}>
                  ₹{summary.total_credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ textAlign: 'right', color: '#d97706', padding: '12px 14px' }}>
                  ₹{summary.total_balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Bar */}
      <div className={styles.paginationBar}>
        <div>
          Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalCount} total entries)
        </div>
        <div className={styles.paginationControls}>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default TransactionLedgerTable;
