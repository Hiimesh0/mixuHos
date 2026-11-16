import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, Search, RefreshCw, Printer } from 'lucide-react';
import styles from './PatientPastInfo.module.css';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { patientVisitsApi, type PatientVisitRecord, investigationApi, type InvestigationRecord } from '../../api/clinicalApi';
import { admissionApi, type AdmissionRecord } from '../../api/hospitalApi';
import { openInvestigationPrint, openAdmissionPrint } from '../../utils/universalPrintGenerator';

const PatientPastInfo: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [patientSearch, setPatientSearch] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');

  const [opdVisits, setOpdVisits] = useState<PatientVisitRecord[]>([]);
  const [ipdAdmissions, setIpdAdmissions] = useState<AdmissionRecord[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPatients = useCallback(async () => {
    try {
      const pats = await patientApi.getPatients();
      setPatients(pats);
      if (pats.length > 0 && !selectedPatientId) {
        selectPatient(pats[0]);
      }
    } catch {}
  }, [selectedPatientId]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const selectPatient = async (pat: PatientRecord) => {
    setSelectedPatientId(pat.id);
    setPatientSearch(pat.name);
    setPatientId(pat.uhid || pat.id);
    setMobile(pat.mobile || '');

    const uhid = pat.uhid || pat.id;
    try {
      setLoading(true);
      const [visits, adms, invs] = await Promise.all([
        patientVisitsApi.getVisits(uhid),
        admissionApi.getAdmissions({ uhid }),
        investigationApi.getInvestigations({ uhid }),
      ]);
      setOpdVisits(visits);
      setIpdAdmissions(adms);
      setInvestigations(invs);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (term: string) => {
    setPatientSearch(term);
    const q = term.toLowerCase().trim();
    if (!q) return;
    const match = patients.find(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.uhid || p.id || '').toLowerCase().includes(q) ||
      (p.mobile || '').includes(q)
    );
    if (match) selectPatient(match);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Patient Past Clinical Information & Encounter Timeline</h1>
      </div>

      <div className={styles.content}>
        {/* Patient Search Context */}
        <div className={styles.searchSection}>
          <div className={styles.searchGrid}>
            <div className={`${styles.fieldGroup} ${styles.large}`}>
              <label className={styles.label}>Select / Search Patient</label>
              <select
                className={styles.input}
                value={selectedPatientId}
                onChange={e => {
                  const p = patients.find(x => x.id === e.target.value);
                  if (p) selectPatient(p);
                }}
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.uhid || p.id}) - {p.mobile || 'No Mobile'}</option>
                ))}
              </select>
            </div>

            <div className={`${styles.fieldGroup} ${styles.medium}`}>
              <label className={styles.label}>UHID</label>
              <input
                type="text"
                className={styles.input}
                value={patientId}
                readOnly
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.medium}`}>
              <label className={styles.label}>Mobile</label>
              <input
                type="text"
                className={styles.input}
                value={mobile}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Longitudinal Summary Badges */}
        <div style={{ display: 'flex', gap: '12px', margin: '14px 0', flexWrap: 'wrap' }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#1e40af' }}>
            Total OPD Visits: {opdVisits.length}
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#166534' }}>
            Total Inpatient Admissions: {ipdAdmissions.length}
          </div>
          <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#854d0e' }}>
            Diagnostic & Lab Investigations: {investigations.length}
          </div>
        </div>

        {/* OPD History Section */}
        <div className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>OPD Clinical Encounters & Visits</span>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Visit #</th>
                  <th style={{ width: '130px' }}>Date</th>
                  <th style={{ width: '120px' }}>Visit Type</th>
                  <th style={{ width: '200px' }}>Doctor</th>
                  <th>Chief Complaint / Vitals</th>
                </tr>
              </thead>
              <tbody>
                {opdVisits.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                      No OPD visits logged for this patient.
                    </td>
                  </tr>
                ) : (
                  opdVisits.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 700, color: '#2563eb' }}>#{v.visit_no}</td>
                      <td>{v.visit_date}</td>
                      <td><span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#eff6ff', fontSize: '11px', fontWeight: 600 }}>{v.visit_type}</span></td>
                      <td style={{ fontWeight: 600 }}>{v.doctor}</td>
                      <td>{v.chief_complaint || 'Routine consultation'} {v.vitals?.bp ? `(BP: ${v.vitals.bp}, PR: ${v.vitals.pulse})` : ''}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* IPD History Section */}
        <div className={styles.historySection} style={{ marginTop: '20px' }}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Inpatient (IPD) Admissions History</span>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>IPD No</th>
                  <th style={{ width: '120px' }}>Admission Date</th>
                  <th style={{ width: '120px' }}>Ward / Bed</th>
                  <th style={{ width: '180px' }}>Treating Doctor</th>
                  <th>Provisional Diagnosis</th>
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '90px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {ipdAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                      No IPD admission records found for this patient.
                    </td>
                  </tr>
                ) : (
                  ipdAdmissions.map(adm => (
                    <tr key={adm.id}>
                      <td style={{ fontWeight: 700, color: '#2563eb' }}>{adm.ipd_no}</td>
                      <td>{adm.admission_date}</td>
                      <td>Bed {adm.bed_number} ({adm.ward_name})</td>
                      <td style={{ fontWeight: 600 }}>{adm.admitting_doctor}</td>
                      <td>{adm.provisional_diagnosis || '-'}</td>
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
                      <td>
                        <button
                          onClick={() => openAdmissionPrint(adm)}
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

        {/* Diagnostic Investigations History */}
        <div className={styles.historySection} style={{ marginTop: '20px' }}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Diagnostic Laboratory & Radiology Reports</span>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Order No</th>
                  <th style={{ width: '120px' }}>Date</th>
                  <th>Test Name</th>
                  <th style={{ width: '140px' }}>Category</th>
                  <th>Impression</th>
                  <th style={{ width: '90px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {investigations.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                      No investigation reports ordered for this patient yet.
                    </td>
                  </tr>
                ) : (
                  investigations.map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 700, color: '#2563eb' }}>{inv.order_no}</td>
                      <td>{inv.order_date}</td>
                      <td style={{ fontWeight: 600 }}>{inv.test_name}</td>
                      <td>{inv.category}</td>
                      <td>{inv.impression || 'Parameters reported.'}</td>
                      <td>
                        <button
                          onClick={() => openInvestigationPrint(inv)}
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
  );
};

export default PatientPastInfo;
