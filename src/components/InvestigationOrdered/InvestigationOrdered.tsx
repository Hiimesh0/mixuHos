import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowDown, Printer, Save, CheckCircle2, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import styles from './InvestigationOrdered.module.css';
import { investigationApi, type InvestigationRecord } from '../../api/clinicalApi';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { admissionApi, type AdmissionRecord } from '../../api/hospitalApi';
import { openInvestigationPrint } from '../../utils/universalPrintGenerator';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';

interface OrderedTestItem {
  id: string;
  parameter: string;
  value: string;
  unit: string;
  ref_range: string;
  flag?: 'Normal' | 'High' | 'Low';
}

const COMMON_TESTS = [
  { name: 'Complete Blood Count (CBC) with ESR', category: 'Hematology', params: [
    { parameter: 'Hemoglobin', value: '13.5', unit: 'g/dL', ref_range: '13.0 - 17.0', flag: 'Normal' as const },
    { parameter: 'Total Leukocyte Count (TLC)', value: '7400', unit: '/cu.mm', ref_range: '4000 - 11000', flag: 'Normal' as const },
    { parameter: 'Platelet Count', value: '250000', unit: '/cu.mm', ref_range: '150000 - 450000', flag: 'Normal' as const },
    { parameter: 'ESR', value: '10', unit: 'mm/1st hr', ref_range: '0 - 15', flag: 'Normal' as const },
  ]},
  { name: 'Renal Function Test (RFT)', category: 'Biochemistry', params: [
    { parameter: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', ref_range: '0.6 - 1.2', flag: 'Normal' as const },
    { parameter: 'Blood Urea', value: '24', unit: 'mg/dL', ref_range: '15 - 40', flag: 'Normal' as const },
    { parameter: 'Serum Sodium (Na+)', value: '139', unit: 'mEq/L', ref_range: '135 - 145', flag: 'Normal' as const },
    { parameter: 'Serum Potassium (K+)', value: '4.2', unit: 'mEq/L', ref_range: '3.5 - 5.0', flag: 'Normal' as const },
  ]},
  { name: 'Liver Function Test (LFT)', category: 'Biochemistry', params: [
    { parameter: 'Serum Bilirubin Total', value: '0.8', unit: 'mg/dL', ref_range: '0.2 - 1.2', flag: 'Normal' as const },
    { parameter: 'SGPT / ALT', value: '32', unit: 'U/L', ref_range: '10 - 45', flag: 'Normal' as const },
    { parameter: 'SGOT / AST', value: '28', unit: 'U/L', ref_range: '10 - 40', flag: 'Normal' as const },
    { parameter: 'Alkaline Phosphatase (ALP)', value: '88', unit: 'U/L', ref_range: '40 - 130', flag: 'Normal' as const },
  ]},
  { name: 'Blood Glucose (Random / RBS)', category: 'Biochemistry', params: [
    { parameter: 'Random Blood Sugar', value: '110', unit: 'mg/dL', ref_range: '70 - 140', flag: 'Normal' as const },
  ]},
  { name: 'Lipid Profile', category: 'Biochemistry', params: [
    { parameter: 'Total Cholesterol', value: '175', unit: 'mg/dL', ref_range: '< 200', flag: 'Normal' as const },
    { parameter: 'Serum Triglycerides', value: '140', unit: 'mg/dL', ref_range: '< 150', flag: 'Normal' as const },
    { parameter: 'HDL Cholesterol', value: '46', unit: 'mg/dL', ref_range: '> 40', flag: 'Normal' as const },
    { parameter: 'LDL Cholesterol', value: '101', unit: 'mg/dL', ref_range: '< 100', flag: 'Normal' as const },
  ]},
];

const InvestigationOrdered: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [orderTime, setOrderTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [doctorName, setDoctorName] = useState<string>('Dr. Nilesh Mahale');
  const [selectedTestName, setSelectedTestName] = useState<string>('Complete Blood Count (CBC) with ESR');
  const [category, setCategory] = useState<string>('Hematology');
  const [testItems, setTestItems] = useState<OrderedTestItem[]>(COMMON_TESTS[0].params.map((p, i) => ({ ...p, id: String(i) })));
  const [impression, setImpression] = useState<string>('Normal biological parameters. No significant abnormality detected.');
  const [loading, setLoading] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [patList, admList, invList] = await Promise.all([
        patientApi.getPatients(),
        admissionApi.getAdmissions(),
        investigationApi.getInvestigations(),
      ]);
      setPatients(patList);
      setAdmissions(admList);
      setInvestigations(invList);
      if (patList.length > 0 && !selectedPatientId) {
        setSelectedPatientId(patList[0].id);
      }
    } catch {
      setNotification({ type: 'error', message: 'Failed to load investigations.' });
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

  const currentAdmission = useMemo(() => {
    if (!currentPatient) return undefined;
    return admissions.find(a => (a.uhid || '').toLowerCase() === (currentPatient.uhid || currentPatient.id || '').toLowerCase() && a.status === 'Admitted');
  }, [admissions, currentPatient]);

  const handleTestSelection = (testName: string) => {
    setSelectedTestName(testName);
    const found = COMMON_TESTS.find(t => t.name === testName);
    if (found) {
      setCategory(found.category);
      setTestItems(found.params.map((p, i) => ({ ...p, id: String(i) })));
    }
  };

  const handleSave = async () => {
    if (!currentPatient) {
      setNotification({ type: 'warning', message: 'Please select a patient.' });
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<InvestigationRecord> = {
        uhid: currentPatient.uhid || currentPatient.id,
        patient_name: currentPatient.name,
        order_date: orderDate,
        doctor_name: doctorName,
        test_name: selectedTestName,
        category: category,
        sample_status: 'Completed',
        lab_id: `LAB-${Math.floor(100 + Math.random() * 900)}`,
        results: testItems.map(({ parameter, value, unit, ref_range, flag }) => ({ parameter, value, unit, ref_range, flag })),
        impression: impression,
        is_active: true,
      };

      const result = await investigationApi.createInvestigation(payload);
      setNotification({
        type: 'success',
        message: `Investigation report #${result.order_no} created and verified!`,
      });

      const updated = await investigationApi.getInvestigations();
      setInvestigations(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating investigation.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (inv?: InvestigationRecord) => {
    const toPrint = inv || (investigations.length > 0 ? investigations[investigations.length - 1] : undefined);
    if (!toPrint) {
      const draft: InvestigationRecord = {
        id: 'DRAFT',
        order_no: 'ORD-2026-DRAFT',
        patient_id: currentPatient?.uhid || 'UHID-0000',
        uhid: currentPatient?.uhid || 'UHID-0000',
        patient_name: currentPatient?.name || 'Patient',
        order_date: orderDate,
        doctor_name: doctorName,
        test_name: selectedTestName,
        category: category,
        sample_status: 'Completed',
        results: testItems,
        impression: impression,
        is_active: true,
      };
      openInvestigationPrint(draft);
      return;
    }
    openInvestigationPrint(toPrint);
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

      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Laboratory & Diagnostic Investigations Order</h1>
          <button onClick={loadData} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563eb' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className={styles.content}>
          {/* Top Form */}
          <div className={styles.topForm}>
            <div className={styles.formRow}>
              <div className={styles.fieldGroup} style={{ flex: 2 }}>
                <label className={styles.label}>Select Patient *</label>
                <select
                  className={styles.input}
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.uhid || p.id})</option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>UHID:</label>
                <input type="text" className={styles.input} value={currentPatient?.uhid || currentPatient?.id || ''} readOnly />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Indoor No:</label>
                <input type="text" className={styles.input} value={currentAdmission?.ipd_no || 'OPD'} readOnly />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Date:</label>
                <input type="date" className={styles.input} value={orderDate} onChange={e => setOrderDate(e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Doctor:</label>
                <input type="text" className={styles.input} value={doctorName} onChange={e => setDoctorName(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Lower Section (Entry + Table & Actions) */}
          <div className={styles.lowerSection}>
            <div className={styles.mainArea}>
              <div className={styles.investigationEntry}>
                <label className={styles.label}>Select Test Profile / Panel *</label>
                <div className={styles.entryRow}>
                  <select
                    className={styles.input}
                    value={selectedTestName}
                    onChange={e => handleTestSelection(e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {COMMON_TESTS.map(t => (
                      <option key={t.name} value={t.name}>{t.name} ({t.category})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Investigation Parameter</th>
                      <th style={{ width: '130px' }}>Observed Value</th>
                      <th style={{ width: '100px' }}>Units</th>
                      <th style={{ width: '130px' }}>Reference Range</th>
                      <th style={{ width: '100px' }}>Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.parameter}</td>
                        <td>
                          <input
                            type="text"
                            value={item.value}
                            onChange={e => {
                              const updated = [...testItems];
                              updated[idx].value = e.target.value;
                              setTestItems(updated);
                            }}
                            className={styles.input}
                            style={{ height: '30px', fontWeight: 700 }}
                          />
                        </td>
                        <td>{item.unit}</td>
                        <td style={{ color: '#64748b' }}>{item.ref_range}</td>
                        <td>
                          <select
                            value={item.flag || 'Normal'}
                            onChange={e => {
                              const updated = [...testItems];
                              updated[idx].flag = e.target.value as any;
                              setTestItems(updated);
                            }}
                            className={styles.input}
                            style={{ height: '30px' }}
                          >
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Low">Low</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '12px' }}>
                <label className={styles.label}>Clinical Impression / Remarks</label>
                <textarea
                  className={styles.input}
                  style={{ width: '100%', height: '60px', padding: '8px' }}
                  value={impression}
                  onChange={e => setImpression(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.actionsSide}>
              <button
                className={styles.primaryBtn}
                onClick={handleSave}
                disabled={loading}
                style={{ backgroundColor: '#2563eb', color: '#fff' }}
              >
                <Save size={16} /> {loading ? 'Saving...' : 'Save Report'}
              </button>

              <button className={styles.secondaryBtn} onClick={() => handlePrint()}>
                <Printer size={16} /> Print Report
              </button>

              <div style={{ margin: '12px 0', borderTop: '1px solid #cbd5e1' }}></div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Recent Orders</span>
              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {investigations.slice(-4).reverse().map(inv => (
                  <div
                    key={inv.id}
                    onClick={() => handlePrint(inv)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '4px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                    title="Click to print this report"
                  >
                    <strong>{inv.order_no}</strong> ({inv.test_name})<br />
                    {inv.patient_name} - {inv.order_date}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationOrdered;
