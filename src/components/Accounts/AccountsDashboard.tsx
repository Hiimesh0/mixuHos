import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  RefreshCw,
  Download,
  IndianRupee,
  Receipt,
  Scale,
  Percent,
  BedDouble,
  Users,
  Calendar,
  AlertCircle
} from 'lucide-react';
import styles from './AccountsDashboard.module.css';
import {
  accountsApi,
  type AccountsSummaryData,
  type AccountsTransactionsResponse,
  type AccountsFilterParams
} from '../../api/accountsApi';
import FinancialOverview from './FinancialOverview';
import BedOccupancySection from './BedOccupancySection';
import TransactionLedgerTable from './TransactionLedgerTable';
import AccountsExportModal from './AccountsExportModal';
import GlobalBottomActionBar from '../common/GlobalBottomActionBar';

const PERIOD_PILLS: { id: AccountsFilterParams['period']; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last_7_days', label: 'Last 7 Days' },
  { id: 'last_30_days', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'previous_month', label: 'Previous Month' },
  { id: 'this_year', label: 'This Year' },
  { id: 'all', label: 'All Time' },
  { id: 'custom', label: 'Custom Range' }
];

export const AccountsDashboard: React.FC = () => {
  // Filters state
  const [selectedPeriod, setSelectedPeriod] = useState<AccountsFilterParams['period']>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [activeType, setActiveType] = useState<'all' | 'bill' | 'deposit'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Data states
  const [summaryData, setSummaryData] = useState<AccountsSummaryData | null>(null);
  const [transactionsData, setTransactionsData] = useState<AccountsTransactionsResponse | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Build filter params
  const buildFilterParams = useCallback((): AccountsFilterParams => {
    const params: AccountsFilterParams = {
      period: selectedPeriod,
      search: activeSearch || undefined,
      type: activeType,
      page: currentPage,
      page_size: 15
    };
    if (selectedPeriod === 'custom') {
      if (customStartDate) params.start_date = customStartDate;
      if (customEndDate) params.end_date = customEndDate;
    }
    return params;
  }, [selectedPeriod, customStartDate, customEndDate, activeSearch, activeType, currentPage]);

  // Load summary metrics
  const loadSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      setErrorMessage(null);
      const params = buildFilterParams();
      const res = await accountsApi.getSummary(params);
      if (res.success) {
        setSummaryData(res);
      } else {
        setErrorMessage('Failed to load accounts financial summary.');
      }
    } catch (err: any) {
      console.error('Accounts summary load error:', err);
      setErrorMessage('Error fetching accounts summary metrics.');
    } finally {
      setLoadingSummary(false);
    }
  }, [buildFilterParams]);

  // Load transactions list
  const loadTransactions = useCallback(async () => {
    try {
      setLoadingTransactions(true);
      const params = buildFilterParams();
      const res = await accountsApi.getTransactions(params);
      if (res.success) {
        setTransactionsData(res);
      }
    } catch (err: any) {
      console.error('Accounts transactions load error:', err);
    } finally {
      setLoadingTransactions(false);
    }
  }, [buildFilterParams]);

  // Initial load and filter change trigger
  useEffect(() => {
    loadSummary();
  }, [selectedPeriod, customStartDate, customEndDate]);

  useEffect(() => {
    loadTransactions();
  }, [selectedPeriod, customStartDate, customEndDate, activeSearch, activeType, currentPage]);

  const handlePeriodChange = (period: AccountsFilterParams['period']) => {
    setSelectedPeriod(period);
    setCurrentPage(1);
  };

  const handleApplyCustomDates = () => {
    setCurrentPage(1);
    loadSummary();
    loadTransactions();
  };

  const handleRefresh = () => {
    loadSummary();
    loadTransactions();
  };

  const totals = summaryData?.financial_totals || {
    total_billed: 0,
    total_gross: 0,
    total_discount: 0,
    bills_collected: 0,
    deposits_collected: 0,
    total_collected: 0,
    total_outstanding: 0,
    collection_rate_percent: 0,
    bills_count: 0,
    deposits_count: 0
  };

  return (
    <div className={`${styles.pageContainer} hasBottomActionBar`}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>
            <BarChart3 className={styles.titleIcon} size={28} />
            Accounts & Financial Reporting Intelligence
          </h1>
          <p className={styles.pageSubtitle}>
            Hospital-wide revenue reconciliation, payment receipts, double-entry ledger, and bed occupancy analytics
          </p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.actionBtn} onClick={handleRefresh} title="Refresh data">
            <RefreshCw size={15} className={loadingSummary ? styles.spinner : ''} />
            Refresh
          </button>
          <button
            className={`${styles.actionBtn} ${styles.primaryActionBtn}`}
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download size={15} />
            Export 8 Standard Reports
          </button>
        </div>
      </header>

      {/* Date Filter Toolbar */}
      <section className={styles.filterBar} aria-label="Date Range Filter">
        <div className={styles.pillGroup}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginRight: '6px' }}>
            Reporting Period:
          </span>
          {PERIOD_PILLS.map((pill) => (
            <button
              key={pill.id}
              type="button"
              className={`${styles.filterPill} ${selectedPeriod === pill.id ? styles.filterPillActive : ''}`}
              onClick={() => handlePeriodChange(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {selectedPeriod === 'custom' && (
          <div className={styles.customDateContainer}>
            <Calendar size={16} color="#0284c7" />
            <span>From:</span>
            <input
              type="date"
              className={styles.dateInput}
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
            />
            <span>To:</span>
            <input
              type="date"
              className={styles.dateInput}
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
            />
            <button type="button" className={styles.applyDateBtn} onClick={handleApplyCustomDates}>
              Apply Custom Range
            </button>
          </div>
        )}
      </section>

      {/* Error notification if any */}
      {errorMessage && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13.5px'
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <section className={styles.kpiGrid} aria-label="Key Performance Indicators">
        {/* Total Billed */}
        <div className={`${styles.kpiCard} ${styles.kpiBilled}`}>
          <div className={styles.kpiHeader}>
            <span>Total Billed Revenue</span>
            <div className={`${styles.kpiIcon} ${styles.iconBilled}`}>
              <IndianRupee size={16} />
            </div>
          </div>
          <div className={styles.kpiValue}>
            ₹{totals.total_billed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className={styles.kpiSubtext}>
            Across {totals.bills_count} finalized bills (Gross: ₹{totals.total_gross.toLocaleString('en-IN')})
          </div>
        </div>

        {/* Total Collected */}
        <div className={`${styles.kpiCard} ${styles.kpiCollected}`}>
          <div className={styles.kpiHeader}>
            <span>Total Realized Collections</span>
            <div className={`${styles.kpiIcon} ${styles.iconCollected}`}>
              <Receipt size={16} />
            </div>
          </div>
          <div className={styles.kpiValue}>
            ₹{totals.total_collected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className={styles.kpiSubtext}>
            Bill pay: ₹{totals.bills_collected.toLocaleString('en-IN')} | Advance: ₹{totals.deposits_collected.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Outstanding Balances */}
        <div className={`${styles.kpiCard} ${styles.kpiOutstanding}`}>
          <div className={styles.kpiHeader}>
            <span>Outstanding Receivable</span>
            <div className={`${styles.kpiIcon} ${styles.iconOutstanding}`}>
              <Scale size={16} />
            </div>
          </div>
          <div className={styles.kpiValue}>
            ₹{totals.total_outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className={styles.kpiSubtext}>
            Uncollected patient billing balance
          </div>
        </div>

        {/* Collection Efficiency */}
        <div className={`${styles.kpiCard} ${styles.kpiRatio}`}>
          <div className={styles.kpiHeader}>
            <span>Collection Efficiency</span>
            <div className={`${styles.kpiIcon} ${styles.iconRatio}`}>
              <Percent size={16} />
            </div>
          </div>
          <div className={styles.kpiValue}>
            {totals.collection_rate_percent}%
          </div>
          <div className={styles.kpiSubtext}>
            Collections realized relative to billed volume
          </div>
        </div>

        {/* Active Bed Occupancy */}
        <div className={`${styles.kpiCard} ${styles.kpiOccupancy}`}>
          <div className={styles.kpiHeader}>
            <span>Active Bed Occupancy</span>
            <div className={`${styles.kpiIcon} ${styles.iconOccupancy}`}>
              <BedDouble size={16} />
            </div>
          </div>
          <div className={styles.kpiValue}>
            {summaryData?.bed_metrics.occupancy_rate_percent || 0}%
          </div>
          <div className={styles.kpiSubtext}>
            {summaryData?.bed_metrics.occupied_beds || 0} occupied of {summaryData?.bed_metrics.total_beds || 0} total beds
          </div>
        </div>

        {/* Admissions & Patients */}
        <div className={`${styles.kpiCard} ${styles.kpiPatients}`}>
          <div className={styles.kpiHeader}>
            <span>Patient Volume</span>
            <div className={`${styles.kpiIcon} ${styles.iconPatients}`}>
              <Users size={16} />
            </div>
          </div>
          <div className={styles.kpiValue}>
            {summaryData?.admission_metrics.admissions_in_period || 0} Adm / {summaryData?.patient_metrics.new_registrations || 0} Reg
          </div>
          <div className={styles.kpiSubtext}>
            {summaryData?.admission_metrics.active_admissions || 0} currently admitted in hospital
          </div>
        </div>
      </section>

      {/* Financial Overview (Trends + Payment breakdown + Departments) */}
      <FinancialOverview summary={summaryData} />

      {/* Inpatient Bed Occupancy Breakdown */}
      <BedOccupancySection bedMetrics={summaryData?.bed_metrics} />

      {/* Transaction Ledger Table with Search, Type Filter, Pagination */}
      <TransactionLedgerTable
        data={transactionsData}
        loading={loadingTransactions}
        searchTerm={activeSearch}
        onSearchChange={(val) => {
          setActiveSearch(val);
          setCurrentPage(1);
        }}
        selectedType={activeType}
        onTypeChange={(type) => {
          setActiveType(type);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Export Reports Modal */}
      <AccountsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentFilter={buildFilterParams()}
      />

      {/* Global Bottom Action Bar */}
      <GlobalBottomActionBar
        onPrint={() => setIsExportModalOpen(true)}
        printLabel="Export Reports"
        statusMessage={
          totals
            ? `Billed: ₹${totals.total_billed.toLocaleString('en-IN')} | Realized: ₹${totals.total_collected.toLocaleString('en-IN')} | Due: ₹${totals.total_outstanding.toLocaleString('en-IN')}`
            : 'Accounts & Financial Intelligence'
        }
        extraActions={
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className={styles.secondaryHeaderBtn}
              onClick={handleRefresh}
              title="Refresh Accounts Metrics"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', fontSize: '13px' }}
            >
              <RefreshCw size={14} className={loadingSummary || loadingTransactions ? styles.spinning : ''} />
              <span>Refresh Data</span>
            </button>
            <button
              type="button"
              className={styles.primaryExportBtn}
              onClick={() => setIsExportModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px' }}
            >
              <Download size={14} />
              <span>PDF / Excel / CSV</span>
            </button>
          </div>
        }
      />
    </div>
  );
};
export default AccountsDashboard;
