import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Save, LogOut, Edit2, Trash2, Printer, Square, CheckSquare, CheckCircle2, User
} from 'lucide-react';
import styles from './CertificateTemplate.module.css';
import { patientApi, type PatientRecord, getPatientFullName } from '../../api/patientApi';
import { openCertificatePrint } from '../../utils/universalPrintGenerator';
import type { CertificateRecord } from '../../api/clinicalApi';

interface TemplateItem {
  id: string;
  templateName: string;
  reportHeader: string;
  details: string;
  defaultCertType: 'MEDICAL' | 'FITNESS' | 'MLC';
}

const DEFAULT_TEMPLATES: TemplateItem[] = [
  {
    id: 'TPL-001',
    templateName: 'Medical Leave & Rest Recommendation',
    reportHeader: 'MEDICAL CERTIFICATE FOR ABSENCE FROM WORK / DUTY',
    details: 'This is to certify that [PATIENT_NAME], aged [AGE] years, residing at [ADDRESS], is suffering from Acute Bronchitis and severe chest congestion with low grade pyrexia. The patient was examined and is medically advised complete bed rest and clinical isolation for a period of 7 (seven) days from [START_DATE] to [END_DATE].',
    defaultCertType: 'MEDICAL',
  },
  {
    id: 'TPL-002',
    templateName: 'Medical Fitness to Resume Duty',
    reportHeader: 'CERTIFICATE OF MEDICAL FITNESS TO RESUME DUTY',
    details: 'This is to certify that [PATIENT_NAME], aged [AGE] years, has been under my treatment and medical surveillance. Upon comprehensive clinical re-examination on [DATE], the patient has completely recovered from the illness, exhibits normal vital signs, and is found physically and mentally FIT to resume duty and daily normal activities without restrictions.',
    defaultCertType: 'FITNESS',
  },
  {
    id: 'TPL-003',
    templateName: 'Minor Surgical Day-Care Clearance',
    reportHeader: 'CERTIFICATE OF DAY-CARE CLINICAL INTERVENTION',
    details: 'This is to certify that [PATIENT_NAME], aged [AGE] years, underwent an uneventful minor surgical excision and wound closure under local anesthesia on [DATE]. The patient remained hemodynamically stable throughout the procedure and observation period, and was discharged in stable clinical condition with post-operative care instructions.',
    defaultCertType: 'MEDICAL',
  },
  {
    id: 'TPL-004',
    templateName: 'General Clinical Health Clearance',
    reportHeader: 'ANNUAL HEALTH CHECKUP CLEARANCE CERTIFICATE',
    details: 'This is to certify that [PATIENT_NAME], aged [AGE] years, underwent routine clinical and cardiovascular evaluation at this institution on [DATE]. Systematic examination reveals no evident infectious, communicable, or incapacitating medical ailment. Visual acuity, cardiovascular status, and respiratory parameters are within normal clinical thresholds.',
    defaultCertType: 'FITNESS',
  }
];

const CertificateTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateItem[]>(DEFAULT_TEMPLATES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  // Form fields
  const [patientName, setPatientName] = useState<string>('');
  const [uhid, setUhid] = useState<string>('');
  const [age, setAge] = useState<string>('35');
  const [sex, setSex] = useState<string>('Male');
  const [certDate, setCertDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reportHeader, setReportHeader] = useState<string>('');
  const [detailsText, setDetailsText] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

  const [isCheckedH, setIsCheckedH] = useState(false);
  const [blankCheck, setBlankCheck] = useState(true);

  // Load patients and setup template
  useEffect(() => {
    patientApi.getPatients().then(res => {
      const pList = Array.isArray(res) ? res : ((res as any)?.patients || []);
      setPatients(pList);
      if (pList.length > 0) {
        populatePatient(pList[0]);
      }
    }).catch(() => {});
  }, []);

  const currentTemplate = templates[currentIndex] || templates[0];

  useEffect(() => {
    if (currentTemplate) {
      setReportHeader(currentTemplate.reportHeader);
      // Replace placeholders
      let txt = currentTemplate.details;
      txt = txt.replace(/\[PATIENT_NAME\]/g, patientName || 'Patient');
      txt = txt.replace(/\[AGE\]/g, age || '35');
      txt = txt.replace(/\[DATE\]/g, certDate);
      txt = txt.replace(/\[START_DATE\]/g, certDate);
      txt = txt.replace(/\[END_DATE\]/g, new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0]);
      setDetailsText(txt);
    }
  }, [currentIndex, currentTemplate, patientName, age, certDate]);

  const populatePatient = (p: PatientRecord) => {
    setSelectedPatientId(p.id);
    const fullName = getPatientFullName(p) || p.name || 'Patient';
    setPatientName(fullName);
    setUhid(p.uhid || p.id);
    setAge(p.age ? String(p.age) : '35');
    setSex(p.gender || p.sex || 'Male');
  };

  const handleNav = (target: number) => {
    if (templates.length === 0) return;
    const bounded = Math.max(0, Math.min(target, templates.length - 1));
    setCurrentIndex(bounded);
  };

  const handleSave = () => {
    setNotification(`Template '${currentTemplate.templateName}' saved successfully!`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handlePrint = () => {
    const certRecord: CertificateRecord = {
      id: `CERT-TPL-${Date.now()}`,
      cert_type: currentTemplate.defaultCertType,
      certificate_no: `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patient_id: selectedPatientId,
      uhid: uhid || 'UHID-GEN',
      patient_name: patientName,
      age,
      gender: sex,
      doctor_name: 'Dr. Nilesh Mahale',
      issue_date: certDate,
      diagnosis: detailsText,
      fitness_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      is_active: true,
    };
    openCertificatePrint(certRecord);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Form Container */}
      <div className={styles.formContainer}>
        {notification && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '8px 14px', borderRadius: '6px', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <CheckCircle2 size={16} /> {notification}
          </div>
        )}

        <div className={styles.mainSection}>
          {/* Patient Context Bar */}
          <div className={styles.patientContextBar}>
            <div className={styles.fieldGroup} style={{ maxWidth: '280px' }}>
              <select
                className={styles.input}
                value={selectedPatientId}
                onChange={e => {
                  const p = patients.find(x => x.id === e.target.value);
                  if (p) populatePatient(p);
                }}
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{getPatientFullName(p) || p.name} ({p.uhid})</option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroupFlex}>
              <label className={styles.label}>Name :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.inputYellow}`}
                style={{ flex: 1 }}
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
              />
            </div>

            <div className={styles.pageTitle} style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
              Template {currentIndex + 1} of {templates.length}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Age :</label>
              <input
                type="number"
                min="0"
                max="150"
                className={`${styles.input} ${styles.inlineInput}`}
                value={age}
                onChange={e => setAge(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Sex :</label>
              <input
                type="text"
                className={`${styles.input} ${styles.inlineInput}`}
                value={sex}
                onChange={e => setSex(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date :</label>
              <input
                type="date"
                className={styles.input}
                value={certDate}
                onChange={e => setCertDate(e.target.value)}
                max="2099-12-31"
              />
            </div>
          </div>

          {/* Editor Area */}
          <div className={styles.editorArea}>
            <div className={styles.editorRow}>
              <label className={styles.editorLabel}>Report Header :</label>
              <input
                type="text"
                className={styles.input}
                style={{ flex: 1, fontWeight: 700 }}
                value={reportHeader}
                onChange={e => setReportHeader(e.target.value)}
              />
            </div>

            <div className={styles.editorRow} style={{ flex: 1, display: 'flex' }}>
              <label className={styles.editorLabel}>Details :</label>
              <textarea
                className={styles.textarea}
                value={detailsText}
                onChange={e => setDetailsText(e.target.value)}
                style={{ minHeight: '180px', lineHeight: '1.6', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>

          {/* Template List Selector */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {templates.map((tpl, idx) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: idx === currentIndex ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: idx === currentIndex ? '#eff6ff' : '#ffffff',
                  fontWeight: idx === currentIndex ? 600 : 400,
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: idx === currentIndex ? '#1d4ed8' : '#334155'
                }}
              >
                {tpl.templateName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.navControls}>
          <button className={styles.navBtn} onClick={() => handleNav(0)} title="First Record"><ChevronsLeft size={18} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex - 1)} title="Previous Record"><ChevronLeft size={18} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(currentIndex + 1)} title="Next Record"><ChevronRight size={18} /></button>
          <button className={styles.navBtn} onClick={() => handleNav(templates.length - 1)} title="Last Record"><ChevronsRight size={18} /></button>
        </div>

        <div className={styles.middleActions}>
          <button className={styles.secondaryBtn} onClick={handlePrint}>
            <Printer size={16} /> Print Certificate
          </button>
        </div>

        <div className={styles.rightActions}>
          <button className={styles.primaryBtn} onClick={handleSave}>
            <Save size={16} /> Save Template
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/medical-certificate')}>
            <LogOut size={16} /> Exit to Certificates
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
