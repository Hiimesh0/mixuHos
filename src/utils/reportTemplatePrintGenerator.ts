/**
 * Dedicated Investigation Report Print Generator
 * Generates an A4 portrait printable report document using professional healthcare standards.
 * Opens in a dedicated separate tab, eliminating application chrome, sidebar, and web UI buttons.
 * Supports bullet-pointed findings, structured patient headers, impression blocks, and signature sign-offs.
 */

import type { ReportTemplateRecord } from '../api/masterApi';
import type { PatientRecord } from '../api/patientApi';
import { parseReportDetails } from './reportDetailsFormatter';

export interface ReportPrintOptions {
  patient?: PatientRecord | null;
  patientName?: string;
  uhid?: string;
  age?: string;
  sex?: string;
  refDoctor?: string;
  reportingDoctor?: string;
  reportDate?: string;
}

export function formatReportPrintDate(dateStr?: string): string {
  if (!dateStr) {
    const d = new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function generateReportTemplatePrintHtml(
  template: ReportTemplateRecord,
  options?: ReportPrintOptions
): string {
  const patient = options?.patient;
  const patientName =
    options?.patientName ||
    (patient ? `${patient.firstName} ${patient.middleName ? `${patient.middleName} ` : ''}${patient.lastName}`.trim() : 'Patient Record');
  
  const uhid = options?.uhid || patient?.uhid || template.id;
  const age = options?.age || (patient ? `${patient.age} ${patient.ageUnit || 'Yrs'}` : 'Adult');
  const sex = options?.sex || patient?.sex || 'Male';
  const refDoctor = options?.refDoctor || patient?.hospitalDoctor || patient?.referenceBy || 'Consulting Physician';
  const reportingDoctor = options?.reportingDoctor || 'Consultant Radiologist / Pathologist';
  const reportDate = formatReportPrintDate(options?.reportDate);

  const parsed = parseReportDetails(template.details);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${template.reportHeader || template.templateName} - ${patientName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 16mm 15mm 16mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      color: #202124;
      font-size: 13px;
      line-height: 1.5;
    }
    .no-print {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #0f172a;
      color: #fff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .no-print-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .no-print-title {
      font-weight: 600;
      font-size: 14px;
    }
    .no-print-badge {
      background: #334155;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #94a3b8;
    }
    .print-btn {
      background: #4285F4;
      color: #fff;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13.5px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }
    .print-btn:hover { background: #3367D6; }
    .close-btn {
      background: #475569;
      color: #fff;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    .close-btn:hover { background: #334155; }

    /* A4 Document Sheet Layout */
    .report-document-sheet {
      width: 210mm;
      min-height: 297mm;
      margin: 20px auto;
      background: #fff;
      padding: 18mm 20mm 20mm 20mm;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* Print media overrides */
    @media print {
      body {
        background: #fff !important;
      }
      .no-print {
        display: none !important;
      }
      .report-document-sheet {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        width: 100% !important;
        min-height: auto !important;
      }
    }

    /* Department Header */
    .department-header {
      text-align: center;
      padding-bottom: 12px;
      margin-bottom: 14px;
      border-bottom: 2px solid #202124;
    }
    .department-name {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #202124;
      margin: 0;
    }
    .department-sub {
      font-size: 11px;
      color: #5f6368;
      margin-top: 3px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* Patient Information Grid */
    .patient-info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
    }
    .patient-info-table td {
      padding: 7px 12px;
      font-size: 12.5px;
      vertical-align: top;
      border: 1px solid #e2e8f0;
    }
    .info-label {
      font-weight: 700;
      color: #3c4043;
      margin-right: 6px;
    }
    .info-val {
      color: #202124;
    }

    /* Report Title */
    .report-title-section {
      text-align: center;
      margin: 16px 0 20px 0;
    }
    .report-main-title {
      font-size: 16px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-decoration: underline;
      color: #202124;
      margin: 0;
    }

    /* Section Heading */
    .section-heading-row {
      margin-top: 10px;
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
    }
    .section-heading-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #202124;
    }

    /* Bullet Points Container & Items */
    .report-bullets-container {
      margin-bottom: 22px;
    }
    .report-bullet-item {
      display: flex;
      align-items: baseline;
      margin-bottom: 9px;
      line-height: 1.6;
      font-size: 13px;
      color: #202124;
      page-break-inside: avoid;
    }
    .bullet-marker {
      font-size: 16px;
      line-height: 1;
      color: #4285F4;
      margin-right: 10px;
      flex-shrink: 0;
      user-select: none;
    }
    .bullet-text {
      flex: 1;
    }
    .bullet-label {
      font-weight: 700;
      color: #202124;
      margin-right: 4px;
    }

    /* Impression / Conclusion Box */
    .impression-container {
      margin-top: 18px;
      margin-bottom: 26px;
      padding: 12px 14px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #4285F4;
      border-radius: 4px;
      page-break-inside: avoid;
    }
    .impression-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #202124;
      margin-bottom: 6px;
    }
    .impression-line {
      font-size: 12.5px;
      line-height: 1.55;
      color: #202124;
      margin-bottom: 4px;
    }
    .impression-line:last-child {
      margin-bottom: 0;
    }

    /* Signatures Footer */
    .signatures-footer {
      margin-top: auto;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .sig-block {
      max-width: 260px;
    }
    .sig-title {
      font-weight: 700;
      font-size: 13px;
      color: #202124;
    }
    .sig-subtitle {
      font-size: 11.5px;
      color: #5f6368;
      margin-top: 2px;
    }

    /* Document Footer Note */
    .doc-footer-disclaimer {
      margin-top: 16px;
      padding-top: 8px;
      border-top: 1px dashed #cbd5e1;
      text-align: center;
      font-size: 10.5px;
      color: #80868b;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <!-- Non-printable top action bar -->
  <div class="no-print">
    <div class="no-print-left">
      <div class="no-print-title">${template.templateName}</div>
      <div class="no-print-badge">${template.groupName} • ${template.id}</div>
    </div>
    <div style="display: flex; gap: 8px;">
      <button type="button" class="close-btn" onclick="window.close()">Close Window</button>
      <button type="button" class="print-btn" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Print Report (A4)
      </button>
    </div>
  </div>

  <!-- Pure A4 Document Page Sheet -->
  <div class="report-document-sheet">
    <!-- Department Diagnostic Header -->
    <header class="department-header">
      <h1 class="department-name">DEPARTMENT OF ${(template.groupName || 'DIAGNOSTICS').toUpperCase()} & IMAGING</h1>
      <div class="department-sub">${template.department || 'Clinical Diagnostic Services'} • Investigation Report</div>
    </header>

    <!-- Patient Information Grid -->
    <table class="patient-info-table">
      <tr>
        <td style="width: 50%;">
          <span class="info-label">Patient Name:</span>
          <span class="info-val"><strong>${patientName}</strong></span>
        </td>
        <td style="width: 25%;">
          <span class="info-label">UHID:</span>
          <span class="info-val" style="font-weight: 700; color: #4285F4;">${uhid}</span>
        </td>
        <td style="width: 25%;">
          <span class="info-label">Date:</span>
          <span class="info-val">${reportDate}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="info-label">Ref. Doctor:</span>
          <span class="info-val">${refDoctor}</span>
        </td>
        <td>
          <span class="info-label">Age / Sex:</span>
          <span class="info-val">${age} / ${sex}</span>
        </td>
        <td>
          <span class="info-label">Modality:</span>
          <span class="info-val">${template.groupName}</span>
        </td>
      </tr>
    </table>

    <!-- Central Underlined Report Title -->
    <div class="report-title-section">
      <h2 class="report-main-title">${template.reportHeader || template.templateName}</h2>
    </div>

    <!-- Section Heading -->
    <div class="section-heading-row">
      <span class="section-heading-title">Details of the Report</span>
    </div>

    <!-- Bullet Points Findings Body -->
    <div class="report-bullets-container">
      ${parsed.items.length > 0 ? parsed.items.map(it => `
        <div class="report-bullet-item">
          <span class="bullet-marker">&#8226;</span>
          <div class="bullet-text">
            ${it.label ? `<strong class="bullet-label">${it.label}</strong>` : ''}
            <span>${it.content}</span>
          </div>
        </div>
      `).join('') : `
        <div style="padding: 12px; color: #5f6368; font-style: italic;">
          No specific report observations entered for this template.
        </div>
      `}
    </div>

    <!-- Impression / Conclusion Box (if present in template details) -->
    ${parsed.impressionLines.length > 0 ? `
      <div class="impression-container">
        <div class="impression-title">${parsed.impressionTitle || 'IMPRESSION / CONCLUSION'}:</div>
        <div class="impression-content">
          ${parsed.impressionLines.map(line => `
            <div class="impression-line">• ${line}</div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Signatures Block -->
    <footer class="signatures-footer">
      <div class="sig-block">
        <div class="sig-title">Prepared By</div>
        <div class="sig-subtitle">Medical Transcriptionist / Lab Technologist</div>
      </div>
      <div class="sig-block" style="text-align: right;">
        <div class="sig-title">${reportingDoctor}</div>
        <div class="sig-subtitle">Authorized Medical Signatory</div>
      </div>
    </footer>

    <!-- Medico-legal / Authentication Note -->
    <div class="doc-footer-disclaimer">
      This diagnostic report is electronically verified and generated via authorized hospital diagnostic protocols.
    </div>
  </div>

  <script>
    // Automatically trigger print dialog on page load
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;
}

/**
 * Opens dedicated Report Template print view in a separate tab
 */
export function openReportTemplatePrintView(
  template: ReportTemplateRecord,
  options?: ReportPrintOptions
): void {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Please allow popups for this site to open the Report Print document.');
    return;
  }
  const html = generateReportTemplatePrintHtml(template, options);
  win.document.open();
  win.document.write(html);
  win.document.close();
}
