import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  CreditCard, 
  Activity, 
  PlusCircle, 
  Bed, 
  RefreshCcw, 
  Receipt, 
  History, 
  MessageSquare, 
  Stethoscope, 
  FileOutput, 
  Image as ImageIcon, 
  Pill, 
  Scissors, 
  Calculator, 
  ClipboardSignature, 
  Printer,
  ChevronDown
} from 'lucide-react';
import styles from './IndoorOption.module.css';
import { admissionApi, type AdmissionRecord } from '../../api/hospitalApi';
import { patientApi, type PatientRecord } from '../../api/patientApi';
import { formatDoctorName } from '../../utils/doctorUtils';

interface ActionCardProps {
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  subtitle?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, icon: Icon, onClick, subtitle }) => (
  <button 
    type="button" 
    className={styles.actionCard} 
    onClick={onClick}
    title={subtitle || title}
  >
    <div className={styles.iconWrapper}>
      <Icon size={18} />
    </div>
    <span className={styles.actionTitle}>{title}</span>
  </button>
);

const IndoorOption: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [activeAdmission, setActiveAdmission] = useState<AdmissionRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [adms, patsRes] = await Promise.all([
        admissionApi.getAdmissions(),
        patientApi.getPatients()
      ]);

      const admList = Array.isArray(adms) ? adms : [];
      const patList = Array.isArray(patsRes) ? patsRes : ((patsRes as any)?.patients || []);
      setAdmissions(admList);
      setPatients(patList);

      const targetQuery = (searchParams.get('id') || searchParams.get('uhid') || searchParams.get('ipd') || '').toLowerCase().trim();
      let matched = admList.find(a =>
        a.id.toLowerCase() === targetQuery ||
        (a.uhid || '').toLowerCase() === targetQuery ||
        (a.ipd_no || '').toLowerCase() === targetQuery
      );

      // Default to first active admission if available, or first admission
      if (!matched && admList.length > 0) {
        matched = admList.find(a => a.status === 'Admitted') || admList[0];
      }

      setActiveAdmission(matched || null);
    } catch (err) {
      console.error('Failed to load Indoor Option data:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectAdmission = (admId: string) => {
    const selected = admissions.find(a => a.id === admId);
    if (selected) {
      setActiveAdmission(selected);
      setSearchParams({ ipd: selected.ipd_no, uhid: selected.uhid });
    }
  };

  const uhid = activeAdmission?.uhid || '';
  const ipd = activeAdmission?.ipd_no || '';
  const patientName = activeAdmission?.patient_name || 'No Inpatient Selected';

  // Navigation helpers passing patient context
  const navWithContext = (route: string) => {
    const params = new URLSearchParams();
    if (uhid) params.append('uhid', uhid);
    if (uhid) params.append('id', uhid);
    if (ipd) params.append('ipd', ipd);
    if (activeAdmission?.id) params.append('admId', activeAdmission.id);
    navigate(`${route}?${params.toString()}`);
  };

  const initialLetter = patientName ? patientName.trim().charAt(0).toUpperCase() : 'P';

  return (
    <div className={styles.pageContainer}>
      {/* Context Header */}
      <div className={styles.patientHeader}>
        <div className={styles.patientIdentity}>
          <div className={styles.avatar}>{initialLetter}</div>
          <div>
            <h1 className={styles.patientName}>{patientName}</h1>
            <div className={styles.patientDetails}>
              <span><strong>IPD:</strong>&nbsp;{ipd || '--'}</span>
              <span><strong>UHID:</strong>&nbsp;{uhid || '--'}</span>
              <span><strong>Bed:</strong>&nbsp;{activeAdmission?.bed_number || 'General Ward'}</span>
              <span><strong>Doctor:</strong>&nbsp;{formatDoctorName(undefined, activeAdmission?.admitting_doctor || 'Dr. Nilesh Mahale')}</span>
              <span><strong>Status:</strong>&nbsp;{activeAdmission?.status || 'Admitted'}</span>
            </div>
          </div>
        </div>

        {/* Patient Switcher */}
        {admissions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Select Inpatient:</label>
            <select
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
              value={activeAdmission?.id || ''}
              onChange={e => handleSelectAdmission(e.target.value)}
            >
              {admissions.map(a => (
                <option key={a.id} value={a.id}>
                  {a.ipd_no} - {a.patient_name} ({a.bed_number || 'Bed'}) - {a.status}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Group 1: Registration & Core Info */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Registration & Information</h2>
        <div className={styles.grid}>
          <ActionCard 
            title="Indoor Register" 
            icon={FileText} 
            onClick={() => navWithContext('/indoor-register')}
            subtitle="View or edit inpatient admission register"
          />
          <ActionCard 
            title="Patient Past Info" 
            icon={History} 
            onClick={() => navWithContext('/patient-past-info')}
            subtitle="Longitudinal medical and visit history"
          />
          <ActionCard 
            title="Patient Room Transfer Detail" 
            icon={RefreshCcw} 
            onClick={() => navWithContext('/room-status')}
            subtitle="Bed management and ward allocation status"
          />
          <ActionCard 
            title="Room & Room GST" 
            icon={Bed} 
            onClick={() => navWithContext('/room-charges')}
            subtitle="Inpatient daily room rates and GST tariffs"
          />
        </div>
      </div>

      {/* Group 2: Billing & Finance */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Billing & Finance</h2>
        <div className={styles.grid}>
          <ActionCard 
            title="Deposit Entry" 
            icon={CreditCard} 
            onClick={() => navWithContext('/deposit-entry')}
            subtitle="Collect advance or interim deposits"
          />
          <ActionCard 
            title="Inpatient Bill" 
            icon={Receipt} 
            onClick={() => navWithContext('/inpatient-bill')}
            subtitle="Generate final inpatient settlement bill"
          />
          <ActionCard 
            title="Inpatient Receipt" 
            icon={Receipt} 
            onClick={() => navWithContext('/inpatient-receipt')}
            subtitle="Issue payment and advance receipts"
          />
          <ActionCard 
            title="Part Payment" 
            icon={Calculator} 
            onClick={() => navWithContext('/part-payment')}
            subtitle="Manage running inpatient part payments"
          />
          <ActionCard 
            title="Operation Charges" 
            icon={PlusCircle} 
            onClick={() => navWithContext('/operation-charges')}
            subtitle="Surgical and theatre fee allocation"
          />
        </div>
      </div>

      {/* Group 3: Clinical & Procedures */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Clinical & Procedures</h2>
        <div className={styles.grid}>
          <ActionCard 
            title="Dr Visit & Procedure" 
            icon={Stethoscope} 
            onClick={() => navWithContext('/dr-visit-procedure')}
            subtitle="Log daily bedside rounds and doctor visits"
          />
          <ActionCard 
            title="OT Entry" 
            icon={Activity} 
            onClick={() => navWithContext('/ot-entry')}
            subtitle="Operation theatre surgical notes and team"
          />
          <ActionCard 
            title="Investigation (To Be Ordered)" 
            icon={FileText} 
            onClick={() => navWithContext('/investigation-ordered')}
            subtitle="Order pathology, radiology and clinical tests"
          />
          <ActionCard 
            title="Clinical Notes / History" 
            icon={ClipboardSignature} 
            onClick={() => navWithContext('/patient-history')}
            subtitle="Consultation notes, symptoms and encounter history"
          />
          <ActionCard 
            title="Daily Investigation Dashboard" 
            icon={Activity} 
            onClick={() => navWithContext('/today-report-dashboard')}
            subtitle="Review pending and verified daily lab results"
          />
          <ActionCard 
            title="Medicine Master" 
            icon={Pill} 
            onClick={() => navWithContext('/medicine-master')}
            subtitle="Hospital pharmacy formulary and drug catalogue"
          />
        </div>
      </div>

      {/* Group 4: Documents & Forms */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Documents & Forms</h2>
        <div className={styles.grid}>
          <ActionCard 
            title="Discharge Card" 
            icon={FileOutput} 
            onClick={() => navWithContext('/discharge-card')}
            subtitle="Generate patient clinical discharge summary"
          />
          <ActionCard 
            title="Certificate Template" 
            icon={ClipboardSignature} 
            onClick={() => navWithContext('/certificate-template')}
            subtitle="Institutional certificates and consent formats"
          />
          <ActionCard 
            title="Echo Report" 
            icon={ImageIcon} 
            onClick={() => navWithContext('/echo-report')}
            subtitle="2D Echocardiography study and Doppler report"
          />
          <ActionCard 
            title="Medical Certificate" 
            icon={FileText} 
            onClick={() => navWithContext('/medical-certificate')}
            subtitle="Medical fitness and sick leave certificate"
          />
          <ActionCard 
            title="MLC Certificate" 
            icon={MessageSquare} 
            onClick={() => navWithContext('/mlc-certificate')}
            subtitle="Medico-legal case injury certificate"
          />
        </div>
      </div>

    </div>
  );
};

export default IndoorOption;