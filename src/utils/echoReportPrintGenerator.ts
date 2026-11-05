/**
 * Echo (Echocardiography) Report Print & PDF Generator
 * Matches the exact visual structure, sections, typography, and alignment of 'echo report print.jpeg'.
 * 
 * Strict specifications from user requirements:
 * - Do NOT include hospital name, hospital header, logos, or watermarks.
 * - Dedicated print document layout (A4 portrait).
 * - Exact section order:
 *   1. Patient details (Name, Age/Sex, Referred By Dr., Date)
 *   2. Title: 2D Echo Report (underlined & centered)
 *   3. Left column (Valves & Chambers) + Right column metrics (LVEF, RWMA, PASP/RVSP)
 *   4. Three-column dimensions & Doppler measurements
 *   5. Conclusion block
 *   6. Consultant Cardiologist sign-offs (Left & Right)
 *   7. Dual medico-legal disclaimers at bottom
 */

import { jsPDF } from 'jspdf';
import type { EchoReportRecord } from '../api/echoReportApi';

/**
 * Format date to standard medical report format: DD-Mon-YYYY (e.g. 26-Oct-2026)
 */
export function formatEchoReportDate(dateStr?: string): string {
  if (!dateStr) {
    const now = new Date();
    return formatNativeDate(now);
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return formatNativeDate(d);
  } catch {
    return dateStr;
  }
}

function formatNativeDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Generate printable standalone HTML matching 'echo report print.jpeg'
 */
export function generateEchoReportHtml(report: EchoReportRecord): string {
  const reportDateFormatted = formatEchoReportDate(report.reportDate);
  const patientName = report.patientName ? report.patientName.replace(/^DEMO:\s*/i, '') : 'Patient';
  const age = report.age ? `${report.age} Yrs` : '--';
  const sex = report.sex || '--';
  const referredBy = report.referredBy || 'DR. SAJID SHAIKH';

  // LVEF clean formatting
  let lvefDisplay = report.lvef || '40 %';
  if (lvefDisplay && !lvefDisplay.includes('%')) {
    lvefDisplay = `${lvefDisplay} %`;
  }

  // RWMA clean formatting
  const rwmaDisplay = report.rwma ? report.rwma : 'present';

  // RVSP / PASP clean formatting
  let paspDisplay = report.rvsp || '45 mmHg';
  if (paspDisplay && !paspDisplay.toLowerCase().includes('mmhg')) {
    paspDisplay = `${paspDisplay} mmHg`;
  }

  // Measurements
  const ivs = report.ivs || 'Intact';
  const ias = report.ias || 'Intact';
  const ivsd = report.septum ? `${report.septum} mm` : '10 mm';
  const pwd = report.pWall ? `${report.pWall} mm` : '10 mm';
  const lvidd = report.lvidd ? `${report.lvidd} mm` : '44 mm';
  const lvids = report.lvids ? `${report.lvids} mm` : '28 mm';
  const pericardium = report.pericardium || 'Normal';
  const dopplerStudy = report.dopplerStudy || 'Mild MR, Mild TR';

  // Conclusion formatted into distinct bullet lines
  const conclusionRaw = report.conclusion || 
    'Mild LV systolic dysfunction. LVEF: 40%\nRWMA Present\nGrade I LV Diastolic Dysfunction.\nNormal Size Cardiac Chambers\nMild PH, PASP = 45mmHg\nNo e/o Clot/Vegetation/Pericardial Effusion\nIVC Congested (1.9 cm) < 50% collapsing.';
  
  const conclusionLines = conclusionRaw
    .replace(/^\[Sample Record\]\s*/i, '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const consultantName = report.consultantDr || 'Dr. Devang Desai';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>2D Echo Report - ${patientName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 16mm 14mm 16mm;
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
      color: #000;
      font-size: 13px;
      line-height: 1.45;
    }
    .no-print {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #1e293b;
      color: #fff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .no-print-btns {
      display: flex;
      gap: 10px;
    }
    .print-btn {
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover { background: #0369a1; }
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
    
    .page-sheet {
      width: 210mm;
      min-height: 297mm;
      margin: 20px auto;
      background: #fff;
      padding: 16mm 18mm;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      position: relative;
    }

    @media print {
      body { background: #fff; }
      .no-print { display: none !important; }
      .page-sheet {
        width: 100%;
        min-height: auto;
        margin: 0;
        padding: 0;
        box-shadow: none;
      }
    }

    /* Reference Header Layout */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 13.5px;
    }
    .header-table td {
      padding: 3px 0;
      vertical-align: top;
    }
    .header-label {
      font-weight: 700;
      color: #111;
      white-space: nowrap;
    }
    .header-val {
      color: #000;
      padding-left: 6px;
    }

    /* Centered Title */
    .report-title-container {
      text-align: center;
      margin: 14px 0 16px 0;
    }
    .report-title {
      display: inline-block;
      font-size: 18px;
      font-weight: 800;
      text-decoration: underline;
      text-underline-offset: 4px;
      letter-spacing: 0.5px;
      color: #000;
    }

    /* Findings Grid: Left Valve findings + Right LVEF/PASP metrics */
    .findings-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 14px;
    }
    .findings-left {
      width: 65%;
    }
    .findings-right {
      width: 32%;
      padding-top: 20px;
    }
    .finding-row {
      display: flex;
      margin-bottom: 4px;
      font-size: 13px;
    }
    .finding-label {
      width: 140px;
      font-weight: 700;
      flex-shrink: 0;
      color: #111;
    }
    .finding-colon {
      margin-right: 8px;
      font-weight: 700;
    }
    .finding-value {
      flex: 1;
      color: #000;
    }

    .metric-box {
      margin-bottom: 24px;
      font-size: 13.5px;
    }
    .metric-row {
      display: flex;
      align-items: baseline;
      margin-bottom: 4px;
    }
    .metric-label {
      font-weight: 700;
      width: 90px;
    }
    .metric-colon {
      margin-right: 8px;
      font-weight: 700;
    }
    .metric-val {
      font-weight: 700;
      font-size: 14px;
    }

    /* 3-Column Dimensions & Doppler measurements */
    .measurements-grid {
      display: grid;
      grid-template-columns: 2.2fr 1.6fr 1.8fr;
      column-gap: 16px;
      row-gap: 4px;
      margin-top: 10px;
      margin-bottom: 18px;
      font-size: 13px;
    }
    .meas-item {
      display: flex;
      align-items: baseline;
      margin-bottom: 3px;
    }
    .meas-label {
      font-weight: 700;
      min-width: 60px;
    }
    .meas-colon {
      margin: 0 6px 0 2px;
      font-weight: 700;
    }
    .meas-val {
      color: #000;
    }

    /* Conclusion Section */
    .conclusion-section {
      margin-top: 14px;
      margin-bottom: 30px;
      font-size: 13px;
      line-height: 1.5;
    }
    .conclusion-header {
      font-weight: 800;
      text-decoration: underline;
      display: inline-block;
      margin-right: 8px;
    }
    .conclusion-content {
      display: inline;
    }
    .conclusion-list {
      margin: 6px 0 0 0;
      padding-left: 105px;
    }
    .conclusion-list-item {
      margin-bottom: 3px;
    }

    /* Doctors & Sign-offs Footer */
    .doctors-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 40px;
      padding-top: 10px;
    }
    .doc-block {
      width: 45%;
      font-size: 11.5px;
      line-height: 1.35;
    }
    .doc-name {
      font-size: 13.5px;
      font-weight: 800;
      color: #000;
      margin-bottom: 2px;
    }
    .doc-qual {
      color: #222;
      font-weight: 600;
    }
    .doc-role {
      color: #444;
      text-transform: uppercase;
      font-size: 10.5px;
      letter-spacing: 0.3px;
    }

    /* Disclaimers */
    .disclaimers-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 11px;
      font-style: normal;
      color: #333;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="no-print">
    <div style="font-weight: 600;">Echo Report Print Preview (Matches Reference Standard)</div>
    <div class="no-print-btns">
      <button class="print-btn" onclick="window.print()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print Report
      </button>
      <button class="close-btn" onclick="window.close()">Close</button>
    </div>
  </div>

  <div class="page-sheet">
    <!-- Top Patient Header Details matching Reference -->
    <table class="header-table">
      <tr>
        <td style="width: 58%;">
          <span class="header-label">Name</span>
          <span class="header-label" style="margin-left: 42px;">:</span>
          <span class="header-val" style="font-weight: 600;">${patientName} .</span>
        </td>
        <td style="width: 42%;">
          <span class="header-label">Age / Sex</span>
          <span class="header-label" style="margin-left: 8px;">:</span>
          <span class="header-val" style="font-weight: 600;">${age} / ${sex}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="header-label">Referred By Dr.</span>
          <span class="header-label" style="margin-left: 4px;">:</span>
          <span class="header-val" style="font-weight: 600;">${referredBy}</span>
        </td>
        <td>
          <span class="header-label">Date</span>
          <span class="header-label" style="margin-left: 36px;">:</span>
          <span class="header-val" style="font-weight: 600;">${reportDateFormatted}</span>
        </td>
      </tr>
    </table>

    <!-- Underlined Centered Title -->
    <div class="report-title-container">
      <div class="report-title">2D Echo Report</div>
    </div>

    <!-- Findings & Metrics -->
    <div class="findings-container">
      <div class="findings-left">
        <div class="finding-row">
          <span class="finding-label">Mitral Valve</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${report.mitralValve || 'Structurally Normal, Mild MR'}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Aortic Valve</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${report.aorticValve || 'Structurally Normal'}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Aorta</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${report.aorta || 'Normal Sized'}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Tricuspid Valve</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${report.tricuspidValve || 'Structurally Normal, Mild TR'}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Pulmonary Valve</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${report.pulmonaryValve || 'Structurally Normal'}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Left Atrium</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${report.leftAtrium || 'Normal Sized'}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Left Ventricle</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${report.leftVentricle || 'Normal Sized, basal inferoposterior wall hypokinetic'}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Right Atrium</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${report.rightAtrium || 'Normal Sized'}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Right Ventricle</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${report.rightVentricle || 'Normal Sized'}</span>
        </div>
      </div>

      <div class="findings-right">
        <div class="metric-box">
          <div class="metric-row">
            <span class="metric-label">LVEF</span>
            <span class="metric-colon">:</span>
            <span class="metric-val">${lvefDisplay}</span>
          </div>
          <div style="font-weight: 700; margin-top: 4px; padding-left: 2px;">
            RWMA ${rwmaDisplay}
          </div>
        </div>

        <div class="metric-box" style="margin-top: 36px;">
          <div class="metric-row">
            <span class="metric-label" style="width: 95px;">PASP/RVSP</span>
            <span class="metric-colon">:</span>
            <span class="metric-val">${paspDisplay}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3-Column Measurements Grid matching Reference -->
    <div class="measurements-grid">
      <!-- Col 1 -->
      <div>
        <div class="meas-item">
          <span class="meas-label">IVS</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${ivs}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label">IAS</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${ias}</span>
        </div>
        <div class="meas-item" style="margin-top: 8px;">
          <span class="meas-label" style="min-width: 82px;">Pericardium</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${pericardium}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 96px;">Doppler Study</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${dopplerStudy}</span>
        </div>
      </div>

      <!-- Col 2 -->
      <div>
        <div class="meas-item">
          <span class="meas-label">IVSD</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${ivsd}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label">PWD</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${pwd}</span>
        </div>
      </div>

      <!-- Col 3 -->
      <div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 68px;">LVIDd</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${lvidd}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 68px;">LVIDs</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${lvids}</span>
        </div>
        <div class="meas-item" style="margin-top: 6px;">
          <span class="meas-label" style="min-width: 68px;">AV Max</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">1.2 m/Sec</span>
        </div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 68px;">PV Max</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">1.1 m/Sec</span>
        </div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 68px;">MV E/A</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">&gt; 1</span>
        </div>
      </div>
    </div>

    <!-- Conclusion Section -->
    <div class="conclusion-section">
      <span class="conclusion-header">Conclusion</span>
      <span style="font-weight: 700; margin-right: 6px;">:</span>
      <div class="conclusion-content">
        ${conclusionLines[0] || 'Mild LV systolic dysfunction. LVEF:40%'}
      </div>
      ${conclusionLines.length > 1 ? `
        <div class="conclusion-list">
          ${conclusionLines.slice(1).map(l => `<div class="conclusion-list-item">${l}</div>`).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Doctors Signatures Footer matching Reference -->
    <div class="doctors-footer">
      <div class="doc-block">
        <div class="doc-name">Dr. Dharmil Patel</div>
        <div class="doc-qual">DNB (Cardiology) Interventional</div>
        <div class="doc-qual">Cardiologist</div>
        <div class="doc-role">(FULL TIME)</div>
      </div>

      <div class="doc-block" style="text-align: right;">
        <div class="doc-name">${consultantName}</div>
        <div class="doc-qual">D.M.(Cardiology), M.D(MED.); FACC</div>
        <div class="doc-role">INTERVENTIONAL CARDIOLOGIST</div>
        <div class="doc-role">DIRECTOR- CARDIAC CARE</div>
      </div>
    </div>

    <!-- Dual Medico-Legal Disclaimers matching Reference -->
    <div class="disclaimers-footer">
      <div>"This Report is not valid for medico-legal purpose."</div>
      <div>"Normal echocardiography does not rule out coronary artery disease."</div>
    </div>
  </div>

  <script>
    // Focus and prepare print
    window.onload = function() {
      // Auto trigger print option on load if requested
    };
  </script>
</body>
</html>`;
}

/**
 * Opens dedicated Echo Report print view in a separate tab
 */
export function openEchoReportPrintView(report: EchoReportRecord): void {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Please allow popups for this site to open the Echo Report print preview.');
    return;
  }
  const html = generateEchoReportHtml(report);
  win.document.open();
  win.document.write(html);
  win.document.close();
}

/**
 * Generate client-side PDF Blob for Echo Report matching the layout via jsPDF
 */
export function generateEchoReportPdfBlob(report: EchoReportRecord): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const patientName = report.patientName ? report.patientName.replace(/^DEMO:\s*/i, '') : 'Patient';
  const reportDate = formatEchoReportDate(report.reportDate);
  const referredBy = report.referredBy || 'DR. SAJID SHAIKH';
  const age = report.age ? `${report.age} Yrs` : '--';
  const sex = report.sex || '--';

  // Fonts & styling
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);

  // Patient Header
  doc.text('Name', 16, 20);
  doc.text(':', 55, 20);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patientName} .`, 60, 20);

  doc.setFont('helvetica', 'bold');
  doc.text('Age / Sex', 130, 20);
  doc.text(':', 155, 20);
  doc.setFont('helvetica', 'normal');
  doc.text(`${age} / ${sex}`, 160, 20);

  doc.setFont('helvetica', 'bold');
  doc.text('Referred By Dr.', 16, 26);
  doc.text(':', 55, 26);
  doc.setFont('helvetica', 'normal');
  doc.text(referredBy, 60, 26);

  doc.setFont('helvetica', 'bold');
  doc.text('Date', 130, 26);
  doc.text(':', 155, 26);
  doc.setFont('helvetica', 'normal');
  doc.text(reportDate, 160, 26);

  // Title: 2D Echo Report (underlined & centered)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const title = '2D Echo Report';
  const titleWidth = doc.getTextWidth(title);
  const titleX = (210 - titleWidth) / 2;
  doc.text(title, titleX, 38);
  doc.line(titleX, 39, titleX + titleWidth, 39);

  // Valve findings (Left)
  doc.setFontSize(9.5);
  let y = 48;
  const leftItems = [
    ['Mitral Valve', report.mitralValve || 'Structurally Normal, Mild MR'],
    ['Aortic Valve', report.aorticValve || 'Structurally Normal'],
    ['Aorta', report.aorta || 'Normal Sized'],
    ['Tricuspid Valve', report.tricuspidValve || 'Structurally Normal, Mild TR'],
    ['Pulmonary Valve', report.pulmonaryValve || 'Structurally Normal'],
    ['Left Atrium', report.leftAtrium || 'Normal Sized'],
    ['Left Ventricle', report.leftVentricle || 'Normal Sized, basal inferoposterior wall hypokinetic'],
    ['Right Atrium', report.rightAtrium || 'Normal Sized'],
    ['Right Ventricle', report.rightVentricle || 'Normal Sized']
  ];

  leftItems.forEach(([lbl, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(lbl, 16, y);
    doc.text(':', 55, y);
    doc.setFont('helvetica', 'normal');
    const splitVal = doc.splitTextToSize(val, 75);
    doc.text(splitVal, 60, y);
    y += Math.max(5.5, splitVal.length * 4.5);
  });

  // Right Metrics: LVEF, RWMA, PASP
  doc.setFont('helvetica', 'bold');
  doc.text('LVEF', 140, 52);
  doc.text(':', 165, 52);
  doc.setFont('helvetica', 'bold');
  doc.text(report.lvef || '40 %', 170, 52);

  doc.text(`RWMA ${report.rwma || 'present'}`, 140, 58);

  doc.text('PASP/RVSP', 140, 80);
  doc.text(':', 168, 80);
  doc.text(report.rvsp || '45 mmHg', 172, 80);

  // 3-Column Measurements Grid
  y = Math.max(y, 106) + 4;
  doc.setFontSize(9);

  // Column 1
  doc.setFont('helvetica', 'bold');
  doc.text('IVS', 16, y);
  doc.text(':', 40, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.ivs || 'Intact', 43, y);

  doc.setFont('helvetica', 'bold');
  doc.text('IAS', 16, y + 5);
  doc.text(':', 40, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(report.ias || 'Intact', 43, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Pericardium', 16, y + 12);
  doc.text(':', 40, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(report.pericardium || 'Normal', 43, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Doppler Study', 16, y + 18);
  doc.text(':', 40, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(report.dopplerStudy || 'Mild MR, Mild TR', 43, y + 18);

  // Column 2
  doc.setFont('helvetica', 'bold');
  doc.text('IVSD', 85, y);
  doc.text(':', 102, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.septum ? `${report.septum} mm` : '10 mm', 105, y);

  doc.setFont('helvetica', 'bold');
  doc.text('PWD', 85, y + 5);
  doc.text(':', 102, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(report.pWall ? `${report.pWall} mm` : '10 mm', 105, y + 5);

  // Column 3
  doc.setFont('helvetica', 'bold');
  doc.text('LVIDd', 140, y);
  doc.text(':', 160, y);
  doc.setFont('helvetica', 'normal');
  doc.text(report.lvidd ? `${report.lvidd} mm` : '44 mm', 164, y);

  doc.setFont('helvetica', 'bold');
  doc.text('LVIDs', 140, y + 5);
  doc.text(':', 160, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(report.lvids ? `${report.lvids} mm` : '28 mm', 164, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('AV Max', 140, y + 11);
  doc.text(':', 160, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.text('1.2 m/Sec', 164, y + 11);

  doc.setFont('helvetica', 'bold');
  doc.text('PV Max', 140, y + 16);
  doc.text(':', 160, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.text('1.1 m/Sec', 164, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('MV E/A', 140, y + 21);
  doc.text(':', 160, y + 21);
  doc.setFont('helvetica', 'normal');
  doc.text('> 1', 164, y + 21);

  // Conclusion
  y = y + 30;
  doc.setFont('helvetica', 'bold');
  doc.text('Conclusion', 16, y);
  doc.text(':', 38, y);
  doc.setFont('helvetica', 'normal');

  const conclusionRaw = report.conclusion || 
    'Mild LV systolic dysfunction. LVEF: 40%\nRWMA Present\nGrade I LV Diastolic Dysfunction.\nNormal Size Cardiac Chambers\nMild PH, PASP = 45mmHg\nNo e/o Clot/Vegetation/Pericardial Effusion\nIVC Congested (1.9 cm) < 50% collapsing.';
  
  const conclusionLines = conclusionRaw
    .replace(/^\[Sample Record\]\s*/i, '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  if (conclusionLines.length > 0) {
    doc.text(conclusionLines[0], 42, y);
    y += 5.5;
    for (let i = 1; i < conclusionLines.length; i++) {
      doc.text(conclusionLines[i], 42, y);
      y += 5;
    }
  }

  // Doctor Signatures Footer
  y = Math.max(y + 12, 240);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Dr. Dharmil Patel', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('DNB (Cardiology) Interventional Cardiologist', 16, y + 4.5);
  doc.text('(FULL TIME)', 16, y + 8.5);

  const consultantName = report.consultantDr || 'Dr. Devang Desai';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(consultantName, 135, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('D.M.(Cardiology), M.D(MED.); FACC', 135, y + 4.5);
  doc.text('INTERVENTIONAL CARDIOLOGIST', 135, y + 8.5);

  // Medico-Legal Disclaimers
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const d1 = '"This Report is not valid for medico-legal purpose."';
  const d2 = '"Normal echocardiography does not rule out coronary artery disease."';
  doc.text(d1, (210 - doc.getTextWidth(d1)) / 2, 275);
  doc.text(d2, (210 - doc.getTextWidth(d2)) / 2, 280);

  return doc.output('blob');
}

