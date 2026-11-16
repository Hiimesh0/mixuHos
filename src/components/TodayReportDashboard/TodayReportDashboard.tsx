import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, Search, Printer, CheckCircle2 } from 'lucide-react';
import styles from './TodayReportDashboard.module.css';
import { investigationApi, type InvestigationRecord } from '../../api/clinicalApi';
import { openInvestigationPrint } from '../../utils/universalPrintGenerator';

const TodayReportDashboard: React.FC = () => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'INDOOR' | 'PENDING'>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const all = await investigationApi.getInvestigations();
      setInvestigations(all);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    return investigations.filter(row => {
      if (filterMode === 'PENDING' && row.sample_status === 'Completed') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (row.patient_name || '').toLowerCase().includes(q);
        const matchesUhid = (row.uhid || '').toLowerCase().includes(q);
        const matchesTest = (row.test_name || '').toLowerCase().includes(q);
        const matchesOrder = (row.order_no || '').toLowerCase().includes(q);
        if (!matchesName && !matchesUhid && !matchesTest && !matchesOrder) return false;
      }
      return true;
    });
  }, [investigations, filterMode, searchQuery]);

  const handlePrint = (row: InvestigationRecord) => {
    openInvestigationPrint(row);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.leftControls}>
          <input
            type="date"
            className={styles.datePicker}
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />

          <button
            className={`${styles.actionBtn} ${filterMode === 'PENDING' ? styles.active : ''}`}
            onClick={() => setFilterMode(filterMode === 'PENDING' ? 'ALL' : 'PENDING')}
          >
            Pending
          </button>

          <div className={styles.buttonGroup}>
            <button className={styles.groupBtn} onClick={loadData} disabled={loading}>
              <RefreshCw size={14} className={loading ? styles.spin : ''} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'text-bottom' }} /> Refresh
            </button>
            <button
              className={`${styles.groupBtn} ${filterMode === 'ALL' ? styles.active : ''}`}
              onClick={() => setFilterMode('ALL')}
            >
              ALL ({investigations.length})
            </button>
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={`${styles.groupBtn} ${filterMode === 'ALL' ? styles.active : ''}`}
              onClick={() => setFilterMode('ALL')}
            >
              OPD
            </button>
            <button
              className={`${styles.groupBtn} ${filterMode === 'INDOOR' ? styles.active : ''}`}
              onClick={() => setFilterMode('INDOOR')}
            >
              INDOOR
            </button>
          </div>
        </div>

        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Laboratory Workload & Reports</h1>
        </div>

        <div className={styles.rightControls}>
          <label className={styles.searchLabel}>Search</label>
          <div className={styles.searchContainer}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Patient, UHID, Test..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '40px' }}>#</th>
                <th className={styles.th} style={{ width: '130px' }}>Order No</th>
                <th className={styles.th}>Patient Name</th>
                <th className={`${styles.th} ${styles.alignCenter}`}>Status</th>
                <th className={`${styles.th} ${styles.alignCenter}`}>Date</th>
                <th className={styles.th}>Treating Doctor</th>
                <th className={styles.th}>Test Ordered</th>
                <th className={styles.th} style={{ width: '100px' }}>Lab ID</th>
                <th className={`${styles.th} ${styles.alignCenter}`} style={{ width: '90px' }}>Print</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No laboratory records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr key={row.id} className={styles.tr}>
                    <td className={`${styles.td} ${styles.textMuted}`}>{idx + 1}</td>
                    <td className={`${styles.td} ${styles.textBlue}`} style={{ fontWeight: 700 }}>{row.order_no}</td>
                    <td className={`${styles.td}`} style={{ fontWeight: 600 }}>{row.patient_name} ({row.uhid})</td>
                    <td className={`${styles.td} ${styles.alignCenter}`}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: row.sample_status === 'Completed' ? '#ecfdf5' : '#fef3c7',
                        color: row.sample_status === 'Completed' ? '#065f46' : '#92400e',
                      }}>
                        {row.sample_status}
                      </span>
                    </td>
                    <td className={`${styles.td} ${styles.alignCenter}`}>{row.order_date}</td>
                    <td className={`${styles.td}`}>{row.doctor_name}</td>
                    <td className={`${styles.td}`}>
                      <div className={styles.truncate} title={row.test_name} style={{ fontWeight: 600 }}>
                        {row.test_name}
                      </div>
                    </td>
                    <td className={`${styles.td}`}>{row.lab_id || 'LAB'}</td>
                    <td className={`${styles.td} ${styles.alignCenter}`}>
                      <button
                        onClick={() => handlePrint(row)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                        }}
                        title="Print Report Document"
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
    </div>
  );
};

export default TodayReportDashboard;
