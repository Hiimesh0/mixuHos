import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileText, Search, RefreshCw, Printer, User, Calendar, Activity,
  HeartPulse, Receipt, ArrowLeft, Stethoscope, AlertTriangle, CheckCircle2,
  Phone, MapPin, ShieldAlert, CreditCard
} from 'lucide-react';
import styles from './PatientPastInfo.module.css';
import { patientApi, type PatientRecord, type PatientBillRecord, getPatientFullName } from '../../api/patientApi';
import { patientVisitsApi, type PatientVisitRecord, investigationApi, type InvestigationRecord } from '../../api/clinicalApi';
import { admissionApi, type AdmissionRecord, depositApi, type DepositRecord } from '../../api/hospitalApi';
import { echoReportApi, type EchoReportRecord } from '../../api/echoReportApi';
import { openInvestigationPrint, openAdmissionPrint, openDepositReceiptPrint } from '../../utils/universalPrintGenerator';
import { openEchoReportPrintView } from '../../utils/echoReportPrintGenerator';
import { openPatientBillPdf } from '../../utils/patientBillGenerator';

type TabKey = 'all' | 'opd' | 'ipd' | 'investigations' | 'echo' | 'billing';

const PatientPastInfo: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(true);

  // Clinical & Administrative timeline datasets
  const [opdVisits, setOpdVisits] = useState<PatientVisitRecord[]>([]);
  const [ipdAdmissions, setIpdAdmissions] = useState<AdmissionRecord[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [echoReports, setEchoReports] = useState<EchoReportRecord[]>([]);
  const [bills, setBills] = useState<PatientBillRecord[]>([]);
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);

  // Load patient list and resolve patient from query params (?id= or ?uhid=)
  const loadPatients = useCallback(async () => {
    try {
      setLoadingPatients(true);
      const res = await patientApi.getPatients();
      const patList = Array.isArray(res) ? res : ((res as any)?.patients || []);
      setPatients(patList);

      const targetId = (searchParams.get('id') || searchParams.get('uhid') || '').trim().toLowerCase();
      let matched: PatientRecord | undefined;

      if (targetId) {
        matched = patList.find((p: PatientRecord) =>
          (p.uhid || '').toLowerCase() === targetId ||
          (p.id || '').toLowerCase() === targetId
        );
      }

      if (!matched && patList.length > 0) {
        matched = patList[0];
      }

      if (matched) {
        setSelectedPatient(matched);
        setSearchQuery(getPatientFullName(matched) || matched.name || matched.uhid);
      }
    } catch (err) {
      console.error('Failed to load patient catalog:', err);
    } finally {
      setLoadingPatients(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // When selected patient changes, fetch all timeline records
  const fetchPatientTimeline = useCallback(async (patient: PatientRecord) => {
    const uhid = (patient.uhid || patient.id || '').trim();
    if (!uhid) return;

    try {
      setLoading(true);

      const [visitsRes, admsRes, invsRes, echoRes, allBillsRes, depsRes] = await Promise.allSettled([
        patientVisitsApi.getVisits(uhid),
        admissionApi.getAdmissions({ uhid }),
        investigationApi.getInvestigations({ uhid }),
        echoReportApi.getReports(uhid),
        patientApi.getAllBills(),
        depositApi.getDeposits({ uhid }),
      ]);

      // 1. OPD Visits
      if (visitsRes.status === 'fulfilled' && Array.isArray(visitsRes.value)) {
        setOpdVisits(visitsRes.value);
      } else {
        setOpdVisits([]);
      }

      // 2. IPD Admissions
      if (admsRes.status === 'fulfilled' && Array.isArray(admsRes.value)) {
        setIpdAdmissions(admsRes.value);
      } else {
        setIpdAdmissions([]);
      }

      // 3. Investigations
      if (invsRes.status === 'fulfilled' && Array.isArray(invsRes.value)) {
        setInvestigations(invsRes.value);
      } else {
        setInvestigations([]);
      }

      // 4. Echo Reports
      if (echoRes.status === 'fulfilled') {
        const reps = echoRes.value.reports || [];
        const filteredEcho = reps.filter(r =>
          (r.uhid || '').trim().toLowerCase() === uhid.toLowerCase() ||
          (r.patientName || '').toLowerCase().includes((patient.firstName || '').toLowerCase())
        );
        setEchoReports(filteredEcho);
      } else {
        setEchoReports([]);
      }

      // 5. Bills
      if (allBillsRes.status === 'fulfilled' && Array.isArray(allBillsRes.value)) {
        const filteredBills = allBillsRes.value.filter(b =>
          (b.uhid || '').trim().toLowerCase() === uhid.toLowerCase() ||
          (b.patientName || '').toLowerCase().includes((patient.firstName || '').toLowerCase())
        );
        setBills(filteredBills);
      } else {
        setBills([]);
      }

      // 6. Deposits
      if (depsRes.status === 'fulfilled' && Array.isArray(depsRes.value)) {
        setDeposits(depsRes.value);
      } else {
        setDeposits([]);
      }
    } catch (err) {
      console.error('Error fetching clinical timeline:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientTimeline(selectedPatient);
    }
  }, [selectedPatient, fetchPatientTimeline]);

  // Handle switching patient
  const handleSelectPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setSearchQuery(getPatientFullName(patient) || patient.name || patient.uhid);
    setSearchParams({ id: patient.uhid || patient.id });
  };

  // Filtered dropdown options
  const matchingPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients.slice(0, 50);
    const q = searchQuery.toLowerCase().trim();
    return patients.filter(p =>
      (getPatientFullName(p) || p.name || '').toLowerCase().includes(q) ||
      (p.uhid || '').toLowerCase().includes(q) ||
      (p.mobile || '').includes(q)
    ).slice(0, 50);
  }, [patients, searchQuery]);

  const patientFullName = selectedPatient ? (getPatientFullName(selectedPatient) || selectedPatient.name || 'Unknown Patient') : '';

  return (
    <div className={styles.pageContainer}>
      {/* Header bar */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className={styles.pageTitle}>Patient Past Clinical Information & Encounter Timeline</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              Comprehensive longitudinal electronic health record (EHR) covering OPD, IPD, Diagnostic Lab, 2D Echo, and Billing history.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedPatient && (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => navigate(`/patient-registration?id=${encodeURIComponent(selectedPatient.uhid || selectedPatient.id)}`)}
                title="Open in Patient Registration"
              >
                <ArrowLeft size={16} /> Return to Registration
              </button>
            )}
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => selectedPatient && fetchPatientTimeline(selectedPatient)}
              disabled={loading}
              title="Refresh timeline records"
            >
              <RefreshCw size={16} className={loading ? styles.spinning : ''} />
              {loading ? 'Refreshing...' : 'Refresh Records'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Patient Selector Bar */}
        <div className={styles.searchSection}>
          <div className={styles.searchGrid}>
            <div className={`${styles.fieldGroup} ${styles.large}`}>
              <label className={styles.label}>Select Patient to View Clinical History</label>
              <select
                className={styles.input}
                value={selectedPatient?.id || selectedPatient?.uhid || ''}
                onChange={e => {
                  const p = patients.find(x => x.id === e.target.value || x.uhid === e.target.value);
                  if (p) handleSelectPatient(p);
                }}
                disabled={loadingPatients}
              >
                <option value="">-- Choose Patient ({patients.length} available) --</option>
                {patients.map(p => (
                  <option key={p.id || p.uhid} value={p.id || p.uhid}>
                    {getPatientFullName(p) || p.name} ({p.uhid}) • {p.age ? `${p.age}y` : ''} {p.gender || p.sex || ''} • {p.mobile || 'No Mobile'}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.medium}`}>
              <label className={styles.label}>Current UHID</label>
              <input
                type="text"
                className={styles.input}
                value={selectedPatient?.uhid || ''}
                readOnly
                placeholder="UHID-XXXX"
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.medium}`}>
              <label className={styles.label}>Registered Mobile</label>
              <input
                type="text"
                className={styles.input}
                value={selectedPatient?.mobile || 'Not recorded'}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Selected Patient Overview Card */}
        {selectedPatient ? (
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>Patient Name</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{patientFullName}</div>
              <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>UHID: {selectedPatient.uhid}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>Demographics</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                {selectedPatient.age || '—'} {selectedPatient.ageUnit || 'Years'} • {selectedPatient.gender || selectedPatient.sex || 'Unknown'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Blood Group: <strong style={{ color: '#dc2626' }}>{selectedPatient.bloodGroup || selectedPatient.blood_group || 'O+'}</strong>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>Location & Contact</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                {selectedPatient.mobile || 'No Phone'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {selectedPatient.city || selectedPatient.address || 'Nashik, MH'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>Clinical Classification</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                Category: <span style={{ color: '#0284c7' }}>{selectedPatient.category || 'General'}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Doctor: {selectedPatient.hospitalDoctor || selectedPatient.consultant_dr || 'Dr. Nilesh Mahale'}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <User size={36} color="#94a3b8" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>Please choose a patient above to view their past health records.</div>
          </div>
        )}

        {/* Tabbed Navigation Bar */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              color: activeTab === 'all' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'all' ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Activity size={15} /> All Encounters
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('opd')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              color: activeTab === 'opd' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'opd' ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Stethoscope size={15} /> OPD Visits ({opdVisits.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ipd')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              color: activeTab === 'ipd' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'ipd' ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Calendar size={15} /> IPD Admissions ({ipdAdmissions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('investigations')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              color: activeTab === 'investigations' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'investigations' ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={15} /> Lab Investigations ({investigations.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('echo')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              color: activeTab === 'echo' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'echo' ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <HeartPulse size={15} /> 2D Echo Reports ({echoReports.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              color: activeTab === 'billing' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'billing' ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Receipt size={15} /> Invoices & Receipts ({bills.length + deposits.length})
          </button>
        </div>

        {/* SECTION 1: OPD Clinical Visits */}
        {(activeTab === 'all' || activeTab === 'opd') && (
          <div className={styles.historySection}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className={styles.sectionTitle} style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                1. Outpatient (OPD) Visits & Clinical Vitals
              </span>
              <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                {opdVisits.length} Records
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Visit #</th>
                    <th style={{ width: '110px' }}>Date</th>
                    <th style={{ width: '130px' }}>Visit Type</th>
                    <th style={{ width: '180px' }}>Doctor</th>
                    <th>Chief Complaint</th>
                    <th style={{ width: '220px' }}>Vitals & Parameters</th>
                  </tr>
                </thead>
                <tbody>
                  {opdVisits.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                        No outpatient visits recorded for this patient.
                      </td>
                    </tr>
                  ) : (
                    opdVisits.map(v => (
                      <tr key={v.id || v.visit_no}>
                        <td style={{ fontWeight: 700, color: '#2563eb' }}>#{v.visit_no}</td>
                        <td>{v.visit_date}</td>
                        <td>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#eff6ff', fontSize: '11px', fontWeight: 600, color: '#1e40af' }}>
                            {v.visit_type || 'Routine Consultation'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{v.doctor || 'Hospital Doctor'}</td>
                        <td>{v.chief_complaint || 'General Checkup'}</td>
                        <td style={{ fontSize: '12px' }}>
                          {v.vitals ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {v.vitals.bp && <span style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '3px' }}>BP: {v.vitals.bp}</span>}
                              {v.vitals.pulse && <span style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '3px' }}>PR: {v.vitals.pulse} bpm</span>}
                              {v.vitals.spo2 && <span style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '3px' }}>SpO2: {v.vitals.spo2}%</span>}
                              {v.vitals.weight && <span style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '3px' }}>Wt: {v.vitals.weight}kg</span>}
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>Standard Vitals</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: IPD Admissions */}
        {(activeTab === 'all' || activeTab === 'ipd') && (
          <div className={styles.historySection} style={{ marginTop: '16px' }}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className={styles.sectionTitle} style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                2. Inpatient (IPD) Admissions & Discharges
              </span>
              <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                {ipdAdmissions.length} Records
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th style={{ width: '110px' }}>IPD No</th>
                    <th style={{ width: '110px' }}>Admission Date</th>
                    <th style={{ width: '130px' }}>Ward / Bed</th>
                    <th style={{ width: '180px' }}>Treating Doctor</th>
                    <th>Provisional / Discharge Diagnosis</th>
                    <th style={{ width: '100px' }}>Status</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ipdAdmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                        No inpatient admission records found for this patient.
                      </td>
                    </tr>
                  ) : (
                    ipdAdmissions.map(adm => (
                      <tr key={adm.id}>
                        <td style={{ fontWeight: 700, color: '#2563eb' }}>{adm.ipd_no}</td>
                        <td>{adm.admission_date}</td>
                        <td>Bed {adm.bed_number} ({adm.ward_name})</td>
                        <td style={{ fontWeight: 600 }}>{adm.admitting_doctor}</td>
                        <td>{adm.provisional_diagnosis || adm.final_diagnosis || 'Medical Management'}</td>
                        <td>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: adm.status === 'Admitted' ? '#fee2e2' : '#f0fdf4',
                            color: adm.status === 'Admitted' ? '#991b1b' : '#166534',
                          }}>
                            {adm.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => openAdmissionPrint(adm)}
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Print Admission Face Sheet"
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
        )}

        {/* SECTION 3: Diagnostic Lab Investigations */}
        {(activeTab === 'all' || activeTab === 'investigations') && (
          <div className={styles.historySection} style={{ marginTop: '16px' }}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className={styles.sectionTitle} style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                3. Diagnostic Laboratory & Radiology Reports
              </span>
              <span style={{ fontSize: '12px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                {investigations.length} Records
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Order No</th>
                    <th style={{ width: '110px' }}>Date</th>
                    <th>Test Name</th>
                    <th style={{ width: '140px' }}>Category</th>
                    <th>Impression / Results</th>
                    <th style={{ width: '110px' }}>Status</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {investigations.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                        No diagnostic investigation reports ordered for this patient yet.
                      </td>
                    </tr>
                  ) : (
                    investigations.map(inv => (
                      <tr key={inv.id}>
                        <td style={{ fontWeight: 700, color: '#2563eb' }}>{inv.order_no}</td>
                        <td>{inv.order_date}</td>
                        <td style={{ fontWeight: 600 }}>{inv.test_name}</td>
                        <td>
                          <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                            {inv.category}
                          </span>
                        </td>
                        <td>{inv.impression || `${(inv.results || []).length} parameters evaluated`}</td>
                        <td>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: inv.sample_status === 'Completed' || inv.sample_status === 'Delivered' ? '#f0fdf4' : '#fffbeb',
                            color: inv.sample_status === 'Completed' || inv.sample_status === 'Delivered' ? '#166534' : '#92400e'
                          }}>
                            {inv.sample_status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => openInvestigationPrint(inv)}
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Print Laboratory Report"
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
        )}

        {/* SECTION 4: 2D Echocardiography Reports */}
        {(activeTab === 'all' || activeTab === 'echo') && (
          <div className={styles.historySection} style={{ marginTop: '16px' }}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className={styles.sectionTitle} style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                4. 2D Echocardiography & Cardiac Reports
              </span>
              <span style={{ fontSize: '12px', background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                {echoReports.length} Reports
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Report ID</th>
                    <th style={{ width: '110px' }}>Date</th>
                    <th style={{ width: '160px' }}>Referred By</th>
                    <th style={{ width: '90px' }}>LVEF</th>
                    <th style={{ width: '110px' }}>RWMA</th>
                    <th>Cardiac Impression / Conclusion</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {echoReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                        No 2D Echo examination reports on record for this patient.
                      </td>
                    </tr>
                  ) : (
                    echoReports.map(rep => (
                      <tr key={rep.id}>
                        <td style={{ fontWeight: 700, color: '#2563eb' }}>{rep.id}</td>
                        <td>{rep.reportDate}</td>
                        <td>{rep.referredBy}</td>
                        <td><strong style={{ color: '#059669' }}>{rep.lvef || '60%'}</strong></td>
                        <td>{rep.rwma || 'Absent'}</td>
                        <td style={{ fontSize: '12px' }}>{rep.conclusion || 'Normal echocardiography study.'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => openEchoReportPrintView(rep)}
                            style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Print 2D Echo Report"
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
        )}

        {/* SECTION 5: Billing & Financial Encounters */}
        {(activeTab === 'all' || activeTab === 'billing') && (
          <div className={styles.historySection} style={{ marginTop: '16px' }}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className={styles.sectionTitle} style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                5. Billing Encounters & Payment Receipts
              </span>
              <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                {bills.length} Invoices • {deposits.length} Receipts
              </span>
            </div>

            {/* Invoices Sub-table */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Invoices & Encounters</div>
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}>Bill #</th>
                      <th style={{ width: '110px' }}>Date</th>
                      <th style={{ width: '110px' }}>Type</th>
                      <th>Total Amount</th>
                      <th>Discount</th>
                      <th>Net Payable</th>
                      <th>Received</th>
                      <th>Balance</th>
                      <th style={{ width: '90px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                          No hospital invoices generated for this patient.
                        </td>
                      </tr>
                    ) : (
                      bills.map(b => (
                        <tr key={b.id || b.billNo}>
                          <td style={{ fontWeight: 700, color: '#2563eb' }}>{b.billNo}</td>
                          <td>{b.billDate}</td>
                          <td>
                            <span style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '11px', background: '#f1f5f9', fontWeight: 600 }}>
                              {b.billType || 'OPD'}
                            </span>
                          </td>
                          <td>₹{Number(b.totalAmount || 0).toLocaleString()}</td>
                          <td>₹{Number(b.discountAmount || 0).toLocaleString()}</td>
                          <td><strong>₹{Number(b.netPayable || b.netAmount || 0).toLocaleString()}</strong></td>
                          <td style={{ color: '#166534' }}>₹{Number(b.amountReceived || b.paidAmount || 0).toLocaleString()}</td>
                          <td>
                            <span style={{ color: Number(b.balanceDue || 0) > 0 ? '#dc2626' : '#64748b', fontWeight: 600 }}>
                              ₹{Number(b.balanceDue || 0).toLocaleString()}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => openPatientBillPdf(b)}
                              style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              title="Print A4 Patient Invoice"
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

            {/* Deposits Sub-table */}
            {deposits.length > 0 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Part Payment & Advance Deposit Receipts</div>
                <div className={styles.tableWrapper}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th style={{ width: '120px' }}>Receipt #</th>
                        <th style={{ width: '110px' }}>Date</th>
                        <th style={{ width: '120px' }}>Amount</th>
                        <th style={{ width: '130px' }}>Payment Mode</th>
                        <th>Remarks / Transaction Ref</th>
                        <th style={{ width: '90px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deposits.map(dep => (
                        <tr key={dep.id}>
                          <td style={{ fontWeight: 700, color: '#2563eb' }}>{dep.receipt_no}</td>
                          <td>{dep.deposit_date || dep.payment_date}</td>
                          <td style={{ fontWeight: 700, color: '#166534' }}>₹{Number(dep.amount || 0).toLocaleString()}</td>
                          <td>
                            <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '3px', fontSize: '11px', fontWeight: 600 }}>
                              {dep.payment_mode}
                            </span>
                          </td>
                          <td>{dep.remarks || 'Advance deposit receipt.'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => openDepositReceiptPrint(dep)}
                              style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              title="Print Deposit Receipt"
                            >
                              <Printer size={12} /> Print
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPastInfo;
