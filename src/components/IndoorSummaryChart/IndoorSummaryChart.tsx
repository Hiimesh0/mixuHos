import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, X, MoreVertical, Search, FileText } from 'lucide-react';
import styles from './IndoorSummaryChart.module.css';
import { admissionApi, type AdmissionRecord } from '../../api/hospitalApi';
import { patientApi, type PatientBillRecord } from '../../api/patientApi';

interface IndoorSummaryRow {
  id: number;
  admId: string;
  uhid: string;
  indoor: string;
  patient: string;
  surgery: string;
  remark: string;
  dr: string;
  de: string;
  billRec: string;
  ot: string;
  dc: string;
  billNo: string;
  prefix: string;
  dod: string;
  mediclaim: string;
  mlc: string;
  cashless: string;
  recNo: string;
  status: 'green' | 'blue' | 'red' | 'black';
}

const IndoorSummaryChart: React.FC = () => {
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [bills, setBills] = useState<PatientBillRecord[]>([]);

  // Filters
  const [patientFilter, setPatientFilter] = useState<string>('');
  const [billNoFilter, setBillNoFilter] = useState<string>('');
  const [prefixFilter, setPrefixFilter] = useState<string>('All');
  const [recNoFilter, setRecNoFilter] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [adms, bList] = await Promise.all([
        admissionApi.getAdmissions(),
        patientApi.getAllBills(),
      ]);
      setAdmissions(Array.isArray(adms) ? adms : []);
      setBills(Array.isArray(bList) ? bList : []);
    } catch (err) {
      console.error('Failed to load indoor chart data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'green': return styles.statusGreen;
      case 'blue': return styles.statusBlue;
      case 'red': return styles.statusRed;
      default: return '';
    }
  };

  // Build rows from admissions and matching bills
  const rows: IndoorSummaryRow[] = useMemo(() => {
    return admissions.map((adm, idx) => {
      const matchBill = bills.find(b =>
        (b.uhid && adm.uhid && b.uhid.toLowerCase() === adm.uhid.toLowerCase()) ||
        (b.patientName && adm.patient_name && b.patientName.toLowerCase() === adm.patient_name.toLowerCase())
      );

      const hasBill = Boolean(matchBill && matchBill.billNo);
      const isDischarged = adm.status === 'Discharged';
      const hasReceipt = Boolean(matchBill && (matchBill.amountReceived || matchBill.paidAmount));

      let status: 'green' | 'blue' | 'red' | 'black' = 'black';
      if (hasBill && hasReceipt) {
        status = 'green';
      } else if (isDischarged && !hasBill) {
        status = 'blue';
      } else if (hasBill && !hasReceipt) {
        status = 'red';
      } else {
        status = 'black';
      }

      return {
        id: idx + 1,
        admId: adm.id,
        uhid: adm.uhid || '',
        indoor: adm.ipd_no || `IPD-${1000 + idx}`,
        patient: adm.patient_name || 'Patient',
        surgery: adm.department || adm.ward_name || 'General',
        remark: adm.provisional_diagnosis || '-',
        dr: adm.admitting_doctor || 'Dr. Nilesh Mahale',
        de: 'Yes',
        billRec: hasBill ? 'Gen' : 'No',
        ot: adm.department?.includes('Surg') ? 'Yes' : 'No',
        dc: isDischarged ? 'Yes' : 'No',
        billNo: matchBill?.billNo || '-',
        prefix: 'GEN',
        dod: adm.discharge_date || '-',
        mediclaim: adm.insurance_company ? 'Yes' : 'No',
        mlc: 'No',
        cashless: adm.insurance_company ? 'Yes' : 'No',
        recNo: matchBill ? `REC-${idx + 101}` : '-',
        status,
      };
    });
  }, [admissions, bills]);

  // Filter rows
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      if (patientFilter.trim() && !r.patient.toLowerCase().includes(patientFilter.toLowerCase().trim())) {
        return false;
      }
      if (billNoFilter.trim() && !r.billNo.toLowerCase().includes(billNoFilter.toLowerCase().trim())) {
        return false;
      }
      if (prefixFilter !== 'All' && r.prefix !== prefixFilter) {
        return false;
      }
      if (recNoFilter.trim() && !r.recNo.toLowerCase().includes(recNoFilter.toLowerCase().trim())) {
        return false;
      }
      return true;
    });
  }, [rows, patientFilter, billNoFilter, prefixFilter, recNoFilter]);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>Indoor Summary Chart</h1>
          <span className={styles.recordCount}>Total Admissions: {filteredRows.length}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn} onClick={loadData} disabled={loading}>
            <RefreshCw size={16} /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className={styles.actionBtn} onClick={() => navigate('/indoor-register')}>
            <X size={16} /> Exit
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Filters Top Row */}
        <div className={styles.filtersRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Patient Search</label>
            <input
              type="text"
              className={`${styles.input} ${styles.wPatient}`}
              placeholder="Filter by name..."
              value={patientFilter}
              onChange={e => setPatientFilter(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Bill No:</label>
            <input
              type="text"
              className={`${styles.input} ${styles.wBillNo}`}
              placeholder="e.g. BILL-1001"
              value={billNoFilter}
              onChange={e => setBillNoFilter(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Prefix:</label>
            <select
              className={`${styles.select} ${styles.wPrefix}`}
              value={prefixFilter}
              onChange={e => setPrefixFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="GEN">GEN</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Rec No:</label>
            <input
              type="text"
              className={`${styles.input} ${styles.wRecNo}`}
              placeholder="Rec #"
              value={recNoFilter}
              onChange={e => setRecNoFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Timeline Row */}
        <div className={styles.timelineRow}>
          <div className={styles.fieldGroup}>
            <input type="date" className={`${styles.input} ${styles.wDate}`} max="2099-12-31" />
          </div>

          <div className={styles.fieldGroup}>
            <select
              className={`${styles.select} ${styles.wYear}`}
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
            >
              <option value="All">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div className={styles.monthTabs}>
            {months.map(m => (
              <button
                key={m}
                className={`${styles.monthTab} ${m === selectedMonth ? styles.active : ''}`}
                onClick={() => setSelectedMonth(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Table List */}
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={styles.rowNum}>#</th>
                <th>Indoor</th>
                <th>Patient</th>
                <th>Ward / Dept</th>
                <th>Provisional Diagnosis</th>
                <th>Treating Doctor</th>
                <th>D.E.</th>
                <th>Bill Rec</th>
                <th>O.T.</th>
                <th>D.C.</th>
                <th>Bill No.</th>
                <th>Prefix</th>
                <th>DOD</th>
                <th>Mediclaim</th>
                <th>MLC</th>
                <th>CashLess</th>
                <th>RecNo</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={18} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    {loading ? 'Loading indoor admission records...' : 'No indoor admission records found.'}
                  </td>
                </tr>
              ) : (
                filteredRows.map(row => (
                  <tr key={row.id} className={getStatusClass(row.status)}>
                    <td className={styles.rowNum}>{row.id}</td>
                    <td style={{ fontWeight: 600 }}>{row.indoor}</td>
                    <td style={{ fontWeight: 600 }}>{row.patient}</td>
                    <td>{row.surgery}</td>
                    <td>{row.remark}</td>
                    <td>{row.dr}</td>
                    <td>{row.de}</td>
                    <td>{row.billRec}</td>
                    <td>{row.ot}</td>
                    <td>{row.dc}</td>
                    <td>{row.billNo}</td>
                    <td>{row.prefix}</td>
                    <td>{row.dod}</td>
                    <td>{row.mediclaim}</td>
                    <td>{row.mlc}</td>
                    <td>{row.cashless}</td>
                    <td>{row.recNo}</td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.actionMenuBtn}
                        onClick={e => toggleDropdown(e, row.id)}
                        aria-label="Row Actions"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openDropdownId === row.id && (
                        <div className={styles.dropdownMenu}>
                          <button className={styles.dropdownItem} onClick={() => navigate('/indoor-register')}>
                            Indoor Register
                          </button>
                          <button className={styles.dropdownItem} onClick={() => navigate(`/deposit-entry?id=${encodeURIComponent(row.uhid)}`)}>
                            Deposit Entry
                          </button>
                          <button className={styles.dropdownItem} onClick={() => navigate(`/patient-past-info?id=${encodeURIComponent(row.uhid)}`)}>
                            Patient Past History
                          </button>
                          <button className={styles.dropdownItem} onClick={() => navigate('/inpatient-bill')}>
                            Inpatient Bill
                          </button>
                          <button className={styles.dropdownItem} onClick={() => navigate('/inpatient-receipt')}>
                            Inpatient Receipt
                          </button>
                          <button className={styles.dropdownItem} onClick={() => navigate('/discharge-card')}>
                            Discharge Card
                          </button>
                          <button className={styles.dropdownItem} onClick={() => navigate('/ot-entry')}>
                            OT Entry
                          </button>
                          <button className={styles.dropdownItem} onClick={() => navigate('/investigation-ordered')}>
                            Investigation Ordered
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Legend / Footer */}
        <div className={styles.legendFooter}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotGreen}`}></div>
            <span className={styles.legendTextGreen}>Bills & Receipt Generated</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotBlue}`}></div>
            <span className={styles.legendTextBlue}>Discharged - Bill Not Generated</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotRed}`}></div>
            <span className={styles.legendTextRed}>Bill Generated But Receipt Not Generated</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.dotBlack}`}></div>
            <span className={styles.legendTextBlack}>Active Admitted (Bill Not Generated)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndoorSummaryChart;
