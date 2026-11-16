/**
 * Universal Healthcare Print Document Generator.
 * Provides professional, minimal, high-aesthetic printable documents with
 * Mixu logo colors (#4285F4, #EA4335, #FBBC05, #34A853), hospital header branding,
 * structured tables, and clean @media print stylesheet.
 */

import { HOSPITAL_CONFIG } from '../config/hospitalConfig';
import type { AdmissionRecord, DischargeRecord, DepositRecord } from '../api/hospitalApi';
import type { InvestigationRecord, CertificateRecord } from '../api/clinicalApi';

function getPrintBaseStyles(): string {
  return `
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 15mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 12px;
      line-height: 1.45;
      color: #1e293b;
      background: #f8fafc;
      padding: 20px;
    }
    .print-container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      padding: 24px 30px;
      position: relative;
    }
    .hospital-header {
      text-align: center;
      border-bottom: 2px solid #4285F4;
      padding-bottom: 12px;
      margin-bottom: 16px;
      position: relative;
    }
    .hospital-title {
      font-size: 22px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .hospital-sub {
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
    }
    .accent-bar {
      height: 3px;
      width: 100%;
      background: linear-gradient(90deg, #4285F4 0%, #34A853 33%, #FBBC05 66%, #EA4335 100%);
      margin-top: 8px;
      border-radius: 2px;
    }
    .doc-badge {
      display: inline-block;
      padding: 4px 14px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.8px;
      border-radius: 4px;
      text-transform: uppercase;
      margin: 10px auto;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 24px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 16px;
    }
    .info-row {
      display: flex;
      font-size: 11.5px;
    }
    .info-label {
      width: 130px;
      font-weight: 600;
      color: #64748b;
    }
    .info-value {
      flex: 1;
      font-weight: 600;
      color: #0f172a;
    }
    .section-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #1e40af;
      text-transform: uppercase;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin: 16px 0 8px 0;
      letter-spacing: 0.4px;
    }
    .content-box {
      border: 1px solid #e2e8f0;
      background: #ffffff;
      padding: 10px 14px;
      border-radius: 4px;
      font-size: 11.5px;
      color: #334155;
      margin-bottom: 12px;
      white-space: pre-wrap;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5px;
      margin: 10px 0 16px 0;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
    }
    table.data-table td {
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      color: #1e293b;
    }
    table.data-table tr:nth-child(even) td {
      background: #f8fafc;
    }
    .signature-area {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 10px;
    }
    .sign-box {
      text-align: center;
      width: 200px;
      border-top: 1px dashed #94a3b8;
      padding-top: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
    }
    .footer-note {
      text-align: center;
      font-size: 9.5px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      margin-top: 24px;
      padding-top: 8px;
    }
    .btn-bar {
      max-width: 820px;
      margin: 0 auto 12px auto;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn-print {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-print:hover { background: #1d4ed8; }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .btn-bar { display: none !important; }
      .print-container {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
    }
  `;
}

function openHtmlPrintWindow(title: string, bodyContent: string): void {
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow popups to open the print preview.');
    return;
  }
  win.document.open();
  win.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>${getPrintBaseStyles()}</style>
    </head>
    <body>
      <div class="btn-bar">
        <button class="btn-print" onclick="window.print()">Print Document</button>
      </div>
      <div class="print-container">
        <div class="hospital-header">
          <div class="hospital-title">${HOSPITAL_CONFIG.name || 'XYZ HOSPITAL & HEALTHCARE'}</div>
          <div class="hospital-sub">${HOSPITAL_CONFIG.address || 'Civil Hospital Road, Surat, Gujarat - 395001'} | Ph: ${HOSPITAL_CONFIG.phone || '+91 98250 12345'}</div>
          <div class="accent-bar"></div>
        </div>
        ${bodyContent}
        <div class="footer-note">
          Generated via Mixu Infosystem EMR Cloud | Document authenticated for hospital record purposes.
        </div>
      </div>
      <script>
        window.addEventListener('load', () => {
          setTimeout(() => { window.print(); }, 400);
        });
      </script>
    </body>
    </html>
  `);
  win.document.close();
}

/**
 * 1. INDOOR ADMISSION SHEET / FACE SHEET PRINT
 */
export function openAdmissionPrint(admission: AdmissionRecord): void {
  const body = `
    <div style="text-align: center;">
      <span class="doc-badge">INDOOR ADMISSION RECORD / FACE SHEET</span>
    </div>

    <div class="info-grid">
      <div class="info-row"><span class="info-label">IPD Number:</span><span class="info-value" style="color: #2563eb;">${admission.ipd_no}</span></div>
      <div class="info-row"><span class="info-label">UHID:</span><span class="info-value">${admission.uhid}</span></div>
      <div class="info-row"><span class="info-label">Patient Name:</span><span class="info-value">${admission.patient_name}</span></div>
      <div class="info-row"><span class="info-label">Age / Gender:</span><span class="info-value">${admission.age || '35'} Yrs / ${admission.gender || 'Male'}</span></div>
      <div class="info-row"><span class="info-label">Admission Date:</span><span class="info-value">${admission.admission_date} ${admission.admission_time || ''}</span></div>
      <div class="info-row"><span class="info-label">Ward / Bed No:</span><span class="info-value">${admission.ward_name} / <strong>${admission.bed_number}</strong> (${admission.room_type})</span></div>
      <div class="info-row"><span class="info-label">Consultant Doctor:</span><span class="info-value">${admission.admitting_doctor}</span></div>
      <div class="info-row"><span class="info-label">Ref Doctor / TPA:</span><span class="info-value">${admission.reference_doctor || 'Self'} / ${admission.insurance_company || 'Cash / Private'}</span></div>
      <div class="info-row"><span class="info-label">Daily Bed Rate:</span><span class="info-value">Rs. ${admission.daily_bed_charge || 1500}</span></div>
      <div class="info-row"><span class="info-label">Initial Deposit:</span><span class="info-value">Rs. ${admission.initial_deposit || 0}</span></div>
    </div>

    <div class="section-title">Provisional Diagnosis on Admission</div>
    <div class="content-box">${admission.provisional_diagnosis || 'Under evaluation and clinical workup.'}</div>

    <div class="section-title">Consent & Undertaking</div>
    <div class="content-box" style="font-size: 10.5px; color: #475569;">
      I/We hereby consent to the administration of medical, surgical and diagnostic procedures deemed necessary by the treating medical staff during this admission. The hospital rules and estimated charges have been explained and agreed upon.
    </div>

    <div class="signature-area">
      <div class="sign-box">Patient / Attendant Signature</div>
      <div class="sign-box">Admission Desk Officer</div>
      <div class="sign-box">Treating Consultant Doctor</div>
    </div>
  `;
  openHtmlPrintWindow(`Admission_Sheet_${admission.ipd_no}`, body);
}

/**
 * 2. DISCHARGE CARD / CLINICAL SUMMARY PRINT
 */
export function openDischargePrint(discharge: DischargeRecord): void {
  const body = `
    <div style="text-align: center;">
      <span class="doc-badge">DISCHARGE CARD & CLINICAL SUMMARY</span>
    </div>

    <div class="info-grid">
      <div class="info-row"><span class="info-label">Discharge No:</span><span class="info-value" style="color: #16a34a;">${discharge.discharge_no}</span></div>
      <div class="info-row"><span class="info-label">IPD / UHID:</span><span class="info-value">${discharge.ipd_no} / ${discharge.uhid}</span></div>
      <div class="info-row"><span class="info-label">Patient Name:</span><span class="info-value">${discharge.patient_name}</span></div>
      <div class="info-row"><span class="info-label">Age / Gender:</span><span class="info-value">${discharge.age || '35'} Yrs / ${discharge.gender || 'Male'}</span></div>
      <div class="info-row"><span class="info-label">Admission Date:</span><span class="info-value">${discharge.admission_date || 'N/A'}</span></div>
      <div class="info-row"><span class="info-label">Discharge Date:</span><span class="info-value">${discharge.discharge_date} ${discharge.discharge_time || ''}</span></div>
      <div class="info-row"><span class="info-label">Condition:</span><span class="info-value"><strong>${discharge.condition_on_discharge}</strong></span></div>
      <div class="info-row"><span class="info-label">Discharging Doctor:</span><span class="info-value">${discharge.discharging_doctor_name}</span></div>
    </div>

    <div class="section-title">Final Clinical Diagnosis</div>
    <div class="content-box" style="font-weight: 600; color: #1e3a8a;">${discharge.final_diagnosis}</div>

    <div class="section-title">Treatment Given & Hospital Course</div>
    <div class="content-box">${discharge.treatment_summary || 'Standard inpatient medical management administered with vital monitoring and symptomatic improvement.'}</div>

    ${discharge.operative_notes ? `
      <div class="section-title">Surgical / Operative Notes</div>
      <div class="content-box">${discharge.operative_notes}</div>
    ` : ''}

    <div class="section-title">Discharge Medications & Advice</div>
    <div class="content-box">${discharge.discharge_medications || 'Continue regular diet, avoid strenuous exertion. Take medications as prescribed on prescription slip.'}</div>

    <div class="section-title">Follow-Up Instructions & SOS Warnings</div>
    <div class="content-box" style="border-left: 3px solid #dc2626;">
      <strong>Review Date:</strong> ${discharge.follow_up_date || 'After 7 days'} in OPD.<br>
      <strong>Instructions:</strong> ${discharge.follow_up_instructions || 'Take light diet. In case of high fever, acute chest pain, persistent vomiting, or breathing difficulty, report immediately to Casualty/Emergency Desk.'}
    </div>

    <div class="signature-area">
      <div class="sign-box">Resident Medical Officer</div>
      <div class="sign-box">Attendant Acknowledgement</div>
      <div class="sign-box">Consultant In-Charge</div>
    </div>
  `;
  openHtmlPrintWindow(`Discharge_Card_${discharge.discharge_no}`, body);
}

/**
 * 3. ADVANCE DEPOSIT / PART PAYMENT RECEIPT PRINT
 */
export function openDepositReceiptPrint(deposit: DepositRecord): void {
  const body = `
    <div style="text-align: center;">
      <span class="doc-badge">ADVANCE DEPOSIT / PART PAYMENT RECEIPT</span>
    </div>

    <div class="info-grid">
      <div class="info-row"><span class="info-label">Receipt No:</span><span class="info-value" style="color: #2563eb;">${deposit.receipt_no}</span></div>
      <div class="info-row"><span class="info-label">Receipt Date:</span><span class="info-value">${deposit.deposit_date}</span></div>
      <div class="info-row"><span class="info-label">Patient Name:</span><span class="info-value">${deposit.patient_name}</span></div>
      <div class="info-row"><span class="info-label">UHID / IPD:</span><span class="info-value">${deposit.uhid} ${deposit.ipd_no ? ` / ${deposit.ipd_no}` : ''}</span></div>
      <div class="info-row"><span class="info-label">Payment Mode:</span><span class="info-value">${deposit.payment_mode}</span></div>
      <div class="info-row"><span class="info-label">Txn Reference:</span><span class="info-value">${deposit.transaction_ref || 'Cash / Direct'}</span></div>
      <div class="info-row"><span class="info-label">Authorized By:</span><span class="info-value">${deposit.authorized_by || 'Admin / Cashier'}</span></div>
      <div class="info-row"><span class="info-label">Remarks:</span><span class="info-value">${deposit.remarks || 'Advance deposit against indoor treatment charges'}</span></div>
    </div>

    <div style="background: #eff6ff; border: 2px solid #bfdbfe; padding: 14px 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
      <div style="font-size: 12px; color: #1e40af; text-transform: uppercase; font-weight: 700;">Amount Received</div>
      <div style="font-size: 26px; font-weight: 800; color: #1d4ed8; margin: 4px 0;">Rs. ${Number(deposit.amount).toFixed(2)}</div>
      <div style="font-size: 11px; color: #475569; font-style: italic;">(Payment accepted subject to realization in bank for cheque/online transactions)</div>
    </div>

    <div class="signature-area">
      <div class="sign-box">Depositor Signature</div>
      <div class="sign-box">Authorized Cashier / Accountant</div>
    </div>
  `;
  openHtmlPrintWindow(`Receipt_${deposit.receipt_no}`, body);
}

/**
 * 4. LABORATORY INVESTIGATION REPORT PRINT
 */
export function openInvestigationPrint(inv: InvestigationRecord): void {
  const resultRows = (inv.results || []).map(r => `
    <tr>
      <td style="font-weight: 600;">${r.parameter}</td>
      <td style="font-weight: 700; color: ${r.flag === 'High' ? '#dc2626' : r.flag === 'Low' ? '#2563eb' : '#0f172a'};">${r.value}</td>
      <td>${r.unit || '-'}</td>
      <td>${r.ref_range || '-'}</td>
      <td><span style="font-weight: 600; color: ${r.flag === 'High' ? '#dc2626' : r.flag === 'Low' ? '#2563eb' : '#16a34a'};">${r.flag || 'Normal'}</span></td>
    </tr>
  `).join('');

  const body = `
    <div style="text-align: center;">
      <span class="doc-badge">DEPARTMENT OF LABORATORY MEDICINE</span>
    </div>

    <div class="info-grid">
      <div class="info-row"><span class="info-label">Order / Lab No:</span><span class="info-value" style="color: #2563eb;">${inv.order_no} (${inv.lab_id || 'LAB'})</span></div>
      <div class="info-row"><span class="info-label">UHID:</span><span class="info-value">${inv.uhid}</span></div>
      <div class="info-row"><span class="info-label">Patient Name:</span><span class="info-value">${inv.patient_name}</span></div>
      <div class="info-row"><span class="info-label">Order Date:</span><span class="info-value">${inv.order_date}</span></div>
      <div class="info-row"><span class="info-label">Referring Doctor:</span><span class="info-value">${inv.doctor_name}</span></div>
      <div class="info-row"><span class="info-label">Test / Category:</span><span class="info-value"><strong>${inv.test_name}</strong> (${inv.category})</span></div>
    </div>

    <div class="section-title">Investigation Results</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Investigation Parameter</th>
          <th>Observed Value</th>
          <th>Units</th>
          <th>Biological Reference Range</th>
          <th>Flag</th>
        </tr>
      </thead>
      <tbody>
        ${resultRows || '<tr><td colspan="5" style="text-align:center;">No specific parameters listed.</td></tr>'}
      </tbody>
    </table>

    <div class="section-title">Clinical Impression / Comments</div>
    <div class="content-box">${inv.impression || 'Results are correlated clinically with patient status.'}</div>

    <div class="signature-area">
      <div class="sign-box">Medical Lab Technologist</div>
      <div class="sign-box">Consultant Pathologist / Biochemist</div>
    </div>
  `;
  openHtmlPrintWindow(`Investigation_${inv.order_no}`, body);
}

/**
 * 5. MEDICAL / MLC / DEATH CERTIFICATES PRINT
 */
export function openCertificatePrint(cert: CertificateRecord): void {
  const isMlc = cert.cert_type === 'MLC';
  const isDeath = cert.cert_type === 'DEATH';

  let title = 'MEDICAL FITNESS / LEAVE CERTIFICATE';
  if (isMlc) title = 'MEDICO-LEGAL EXAMINATION CERTIFICATE (MLC)';
  if (isDeath) title = 'MEDICAL CERTIFICATE OF CAUSE OF DEATH';

  let specificContent = '';
  if (isMlc) {
    specificContent = `
      <div class="info-grid">
        <div class="info-row"><span class="info-label">Police Station:</span><span class="info-value">${cert.police_station || 'Umra Police Station'}</span></div>
        <div class="info-row"><span class="info-label">PC / Buckle No:</span><span class="info-value">${cert.buckle_no || 'PC-4022'}</span></div>
        <div class="info-row"><span class="info-label">Brought By:</span><span class="info-value">${cert.brought_by || 'Police Escort / Relatives'}</span></div>
        <div class="info-row"><span class="info-label">Exam Time:</span><span class="info-value">${cert.examination_time || '14:30 IST'}</span></div>
      </div>
      <div class="section-title">Identification Marks</div>
      <div class="content-box">${cert.identification_marks || '1. Mole on left cheek. 2. Scar mark on right forearm.'}</div>
      <div class="section-title">Details of Injuries / Findings</div>
      <div class="content-box">${cert.injury_details || cert.diagnosis || 'Blunt trauma with soft tissue contusion. Vital signs stable.'}</div>
    `;
  } else if (isDeath) {
    specificContent = `
      <div class="info-grid">
        <div class="info-row"><span class="info-label">Date of Death:</span><span class="info-value">${cert.date_of_death || cert.issue_date}</span></div>
        <div class="info-row"><span class="info-label">Time of Death:</span><span class="info-value">${cert.time_of_death || '06:15 AM'}</span></div>
      </div>
      <div class="section-title">Immediate Cause of Death</div>
      <div class="content-box" style="font-weight: 700; color: #dc2626;">${cert.cause_of_death_immediate || 'Cardio-Respiratory Arrest'}</div>
      <div class="section-title">Antecedent / Underlying Cause</div>
      <div class="content-box">${cert.cause_of_death_antecedent || cert.diagnosis || 'Severe Sepsis with Multi-Organ Dysfunction'}</div>
    `;
  } else {
    specificContent = `
      <div class="content-box" style="font-size: 12.5px; line-height: 1.8; padding: 18px 24px;">
        This is to certify that <strong>${cert.patient_name}</strong>, age <strong>${cert.age || '35'}</strong> years, ${cert.gender || 'Male'},
        has been under my medical treatment for <strong>${cert.diagnosis || 'Acute Medical Condition'}</strong>.<br><br>
        ${cert.rest_from ? `In my clinical opinion, he/she required absolute medical rest from <strong>${cert.rest_from}</strong> to <strong>${cert.rest_to || cert.rest_from}</strong>.<br>` : ''}
        ${cert.fitness_date ? `He/She is examined today and found clinically fit to resume regular duties with effect from <strong>${cert.fitness_date}</strong>.<br><br>` : ''}
        This certificate is issued for legitimate official/medical leave purposes only.
      </div>
    `;
  }

  const body = `
    <div style="text-align: center;">
      <span class="doc-badge">${title}</span>
    </div>

    <div class="info-grid">
      <div class="info-row"><span class="info-label">Certificate No:</span><span class="info-value" style="color: #2563eb;">${cert.certificate_no}</span></div>
      <div class="info-row"><span class="info-label">Issue Date:</span><span class="info-value">${cert.issue_date}</span></div>
      <div class="info-row"><span class="info-label">Patient Name:</span><span class="info-value">${cert.patient_name}</span></div>
      <div class="info-row"><span class="info-label">UHID:</span><span class="info-value">${cert.uhid}</span></div>
      <div class="info-row"><span class="info-label">Age / Gender:</span><span class="info-value">${cert.age || '35'} Yrs / ${cert.gender || 'Male'}</span></div>
      <div class="info-row"><span class="info-label">Examining Doctor:</span><span class="info-value">${cert.doctor_name}</span></div>
    </div>

    ${specificContent}

    <div class="signature-area">
      <div class="sign-box">Hospital Seal / Stamp</div>
      <div class="sign-box">
        <strong>${cert.doctor_name}</strong><br>
        Consultant Physician / Surgeon<br>
        Reg. No: G-24891
      </div>
    </div>
  `;
  openHtmlPrintWindow(`Certificate_${cert.certificate_no}`, body);
}

