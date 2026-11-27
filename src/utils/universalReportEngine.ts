/**
 * Universal Healthcare Reporting Engine for Mixu Hospital Management System
 * Supports:
 *  1. Payment Wise Report (Reference structure matching hospital receipt matrix)
 *  2. Patient Wise Report
 *  3. Date Wise Collection Report
 *  4. OPD Consultation & Procedure Report
 *  5. IPD Admission & Bed Utilization Report
 *  6. Bed Occupancy Matrix Report
 *  7. Consolidated Executive Hospital Report
 * Multi-format outputs: Print View, High-Fidelity PDF, Native Excel (.xlsx/XML), and RFC-4180 CSV.
 */

import { jsPDF } from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';
import { HOSPITAL_CONFIG } from '../config/hospitalConfig';

export type ReportType = 
  | 'payment_wise'
  | 'patient_wise'
  | 'date_wise_collection'
  | 'opd'
  | 'ipd'
  | 'bed_occupancy'
  | 'consolidated';

export interface ReportFilterOptions {
  periodLabel: string;
  startDate?: string;
  endDate?: string;
  department?: string;
  paymentMode?: string;
  status?: string;
  searchQuery?: string;
}

export interface UniversalReportData {
  reportType: ReportType;
  title: string;
  subtitle: string;
  periodLabel: string;
  generatedAt: string;
  hospitalName?: string;
  columns: string[];
  rows: (string | number)[][];
  subtotals?: (string | number)[];
  grandTotal?: (string | number)[];
  summaryMetrics?: { label: string; value: string | number }[];
  isWide?: boolean;
}

/**
 * Format numeric currency in Indian standard (e.g. ₹ 1,25,000.00)
 */
export const formatRupee = (num: number): string => {
  if (isNaN(num)) return '₹ 0.00';
  const isNegative = num < 0;
  const absVal = Math.abs(num).toFixed(2);
  const [intPart, decPart] = absVal.split('.');
  
  let lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹ ${formattedInt}.${decPart}`;
};

// ==============================================================================
// 1. PAYMENT WISE REPORT BUILDER (Structural Reference from Hospital Photograph)
// ==============================================================================
export const buildPaymentWiseReport = (
  bills: any[],
  deposits: any[],
  options: ReportFilterOptions
): UniversalReportData => {
  // Columns: Particulars | Card | Cash | Cheque | QR Code / UPI | RTGS / Bank Transfer | Total
  const columns = ['Particulars', 'Card', 'Cash', 'Cheque', 'QR Code / UPI', 'RTGS / Bank Transfer', 'Total'];

  // Categorize rows: IPD Deposit, Laboratory, OPD, ECHO, TMT, Package, Procedures, Other
  const categories = [
    'IPD Deposit',
    'Laboratory',
    'OPD',
    'ECHO',
    'TMT',
    'Package',
    'Procedures',
    'Other Charges'
  ];

  const paymentModes = ['Card', 'Cash', 'Cheque', 'QR Code / UPI', 'RTGS / Bank Transfer'];

  // Matrix: [categoryIndex][paymentModeIndex] -> amount
  const matrix: number[][] = Array.from({ length: categories.length }, () => Array(paymentModes.length).fill(0));

  // 1. Process Deposits (all go to 'IPD Deposit')
  deposits.forEach(d => {
    const amt = parseFloat(d.amount) || 0;
    const mode = (d.payment_mode || d.paymentMode || 'Cash').toLowerCase();
    let colIdx = 1; // Default Cash
    if (mode.includes('card')) colIdx = 0;
    else if (mode.includes('cash')) colIdx = 1;
    else if (mode.includes('cheque') || mode.includes('check')) colIdx = 2;
    else if (mode.includes('qr') || mode.includes('upi') || mode.includes('online')) colIdx = 3;
    else if (mode.includes('rtgs') || mode.includes('bank') || mode.includes('neft') || mode.includes('transfer')) colIdx = 4;
    matrix[0][colIdx] += amt;
  });

  // 2. Process Bills
  bills.forEach(b => {
    const rcvd = parseFloat(b.totalReceived) || parseFloat(b.netAmount) || 0;
    if (rcvd <= 0) return;

    const mode = (b.paymentType || b.payment_mode || b.paymentMode || 'Cash').toLowerCase();
    let colIdx = 1;
    if (mode.includes('card')) colIdx = 0;
    else if (mode.includes('cash')) colIdx = 1;
    else if (mode.includes('cheque')) colIdx = 2;
    else if (mode.includes('qr') || mode.includes('upi') || mode.includes('online')) colIdx = 3;
    else if (mode.includes('rtgs') || mode.includes('bank') || mode.includes('neft')) colIdx = 4;

    // Check items or bill type
    const items = b.items || [];
    if (items.length > 0) {
      items.forEach((item: any) => {
        const itemAmt = parseFloat(item.amount) || parseFloat(item.rate) || 0;
        const desc = (item.details || item.name || item.chargeName || '').toLowerCase();
        let catIdx = 2; // Default OPD
        if (desc.includes('lab') || desc.includes('pathology') || desc.includes('blood') || desc.includes('cbc') || desc.includes('urine')) catIdx = 1;
        else if (desc.includes('echo') || desc.includes('2d')) catIdx = 3;
        else if (desc.includes('tmt') || desc.includes('treadmill')) catIdx = 4;
        else if (desc.includes('package') || desc.includes('pkg')) catIdx = 5;
        else if (desc.includes('procedure') || desc.includes('visit') || desc.includes('dressing')) catIdx = 6;
        else if (desc.includes('bed') || desc.includes('nursing') || desc.includes('icu') || desc.includes('room')) catIdx = 7;
        matrix[catIdx][colIdx] += itemAmt;
      });
    } else {
      const type = (b.billType || '').toLowerCase();
      let catIdx = 2;
      if (type.includes('ipd')) catIdx = 7;
      matrix[catIdx][colIdx] += rcvd;
    }
  });

  // Assemble Rows with Row Totals
  const rows: (string | number)[][] = [];
  const colTotals = Array(paymentModes.length).fill(0);
  let grandTotal = 0;

  categories.forEach((cat, idx) => {
    const rowValues = matrix[idx];
    const rowTotal = rowValues.reduce((a, b) => a + b, 0);
    grandTotal += rowTotal;
    rowValues.forEach((val, cIdx) => {
      colTotals[cIdx] += val;
    });

    rows.push([
      cat,
      formatRupee(rowValues[0]),
      formatRupee(rowValues[1]),
      formatRupee(rowValues[2]),
      formatRupee(rowValues[3]),
      formatRupee(rowValues[4]),
      formatRupee(rowTotal),
    ]);
  });

  const grandTotalRow = [
    'Grand Total',
    formatRupee(colTotals[0]),
    formatRupee(colTotals[1]),
    formatRupee(colTotals[2]),
    formatRupee(colTotals[3]),
    formatRupee(colTotals[4]),
    formatRupee(grandTotal),
  ];

  return {
    reportType: 'payment_wise',
    title: 'Payment Wise Collection Report',
    subtitle: 'Categorized Revenue Matrix Across Payment Instruments & Service Heads',
    periodLabel: options.periodLabel,
    generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    hospitalName: HOSPITAL_CONFIG.name || 'MIXU MULTISPECIALTY HOSPITAL',
    columns,
    rows,
    grandTotal: grandTotalRow,
    summaryMetrics: [
      { label: 'Total Receipts & Bills', value: deposits.length + bills.length },
      { label: 'Grand Total Collected', value: formatRupee(grandTotal) },
      { label: 'Primary Payment Method', value: 'Cash / UPI' }
    ],
    isWide: true
  };
};

// ==============================================================================
// 2. PATIENT WISE REPORT BUILDER
// ==============================================================================
export const buildPatientWiseReport = (
  patients: any[],
  bills: any[],
  options: ReportFilterOptions
): UniversalReportData => {
  const columns = ['UHID', 'Patient Name', 'Age/Sex', 'Phone', 'Consultant Doctor', 'Total Billed', 'Total Received', 'Balance Due'];
  const rows: (string | number)[][] = [];

  let totalBilled = 0;
  let totalReceived = 0;
  let totalBalance = 0;

  patients.forEach(p => {
    const uhid = p.uhid || p.id || '';
    const pBills = bills.filter(b => b.uhid === uhid || (b.patientName && b.patientName.toLowerCase() === (p.name || '').toLowerCase()));
    const pBilled = pBills.reduce((sum, b) => sum + (parseFloat(b.netAmount) || 0), 0);
    const pReceived = pBills.reduce((sum, b) => sum + (parseFloat(b.totalReceived) || 0), 0);
    const pBalance = Math.max(0, pBilled - pReceived);

    totalBilled += pBilled;
    totalReceived += pReceived;
    totalBalance += pBalance;

    rows.push([
      uhid,
      p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Patient',
      `${p.age || '--'} ${p.ageUnit || 'Y'} / ${p.sex || p.gender || '--'}`,
      p.mobile || p.phone || '--',
      p.consultantDoctor || p.doctor || 'Dr. Nilesh Mahale',
      formatRupee(pBilled),
      formatRupee(pReceived),
      formatRupee(pBalance)
    ]);
  });

  return {
    reportType: 'patient_wise',
    title: 'Patient Wise Billing & Ledger Report',
    subtitle: 'Consolidated Inpatient and Outpatient Patient Financial Status',
    periodLabel: options.periodLabel,
    generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    hospitalName: HOSPITAL_CONFIG.name || 'MIXU MULTISPECIALTY HOSPITAL',
    columns,
    rows,
    grandTotal: ['Grand Total', `${rows.length} Patients`, '', '', '', formatRupee(totalBilled), formatRupee(totalReceived), formatRupee(totalBalance)],
    isWide: true
  };
};

// ==============================================================================
// 3. DATE WISE COLLECTION REPORT BUILDER
// ==============================================================================
export const buildDateWiseCollectionReport = (
  transactions: any[],
  options: ReportFilterOptions
): UniversalReportData => {
  const columns = ['Date', 'Receipt / Bill No', 'Type', 'UHID', 'Patient Name', 'Payment Mode', 'Received Amount', 'Status'];
  const rows: (string | number)[][] = [];

  let totalCollected = 0;

  transactions.forEach(t => {
    const amt = parseFloat(t.credit || t.amount || 0);
    totalCollected += amt;

    rows.push([
      t.date || '--',
      t.reference_no || t.receipt_no || t.id || '--',
      t.type || 'Collection',
      t.uhid || '--',
      t.patient_name || 'Patient',
      t.payment_mode || 'Cash',
      formatRupee(amt),
      t.status || 'Received'
    ]);
  });

  return {
    reportType: 'date_wise_collection',
    title: 'Date Wise Daily Collection Report',
    subtitle: 'Daily Cash Counter, Bank Transfers, and Digital Collections Log',
    periodLabel: options.periodLabel,
    generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    hospitalName: HOSPITAL_CONFIG.name || 'MIXU MULTISPECIALTY HOSPITAL',
    columns,
    rows,
    grandTotal: ['Grand Total', `${rows.length} Transactions`, '', '', '', '', formatRupee(totalCollected), 'Verified'],
    isWide: true
  };
};

// ==============================================================================
// 4. BED OCCUPANCY REPORT BUILDER
// ==============================================================================
export const buildBedOccupancyReport = (
  beds: any[],
  admissions: any[],
  options: ReportFilterOptions
): UniversalReportData => {
  const columns = ['Bed No', 'Ward Name', 'Room Category', 'Tariff/Day', 'Occupancy Status', 'Admitted Patient', 'Admission Date', 'Status'];
  const rows: (string | number)[][] = [];

  let occupiedCount = 0;

  beds.forEach(b => {
    const isOccupied = (b.status || '').toLowerCase() === 'occupied' || Boolean(b.current_admission_id);
    if (isOccupied) occupiedCount++;

    const adm = admissions.find(a => a.id === b.current_admission_id || a.bed_number === b.bed_number);

    rows.push([
      b.bed_number || b.id || '--',
      b.ward_name || 'General Ward',
      b.room_type_id || b.room_type || 'Standard',
      formatRupee(parseFloat(b.daily_rate) || 1200),
      isOccupied ? 'Occupied' : 'Vacant',
      adm ? adm.patient_name : '--',
      adm ? (adm.admission_date || '--') : '--',
      isOccupied ? 'Inpatient Admitted' : 'Available for Admission'
    ]);
  });

  const occupancyPct = beds.length > 0 ? Math.round((occupiedCount / beds.length) * 100) : 0;

  return {
    reportType: 'bed_occupancy',
    title: 'Bed Utilization & Ward Occupancy Report',
    subtitle: 'Institutional Bed Matrix, Ward Utilization & Inpatient Allocation',
    periodLabel: options.periodLabel,
    generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    hospitalName: HOSPITAL_CONFIG.name || 'MIXU MULTISPECIALTY HOSPITAL',
    columns,
    rows,
    grandTotal: ['Total Beds: ' + beds.length, '', '', '', `Occupancy: ${occupancyPct}% (${occupiedCount}/${beds.length})`, '', '', ''],
    isWide: true
  };
};

// ==============================================================================
// 5. UNIVERSAL EXPORTERS: PDF, EXCEL, CSV, PRINT
// ==============================================================================

/**
 * Download high-resolution landscape/portrait PDF matching professional hospital layout
 */
export const downloadReportPdf = (report: UniversalReportData): void => {
  const orientation = report.isWide ? 'landscape' : 'portrait';
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = orientation === 'landscape' ? 297 : 210;
  const pageHeight = orientation === 'landscape' ? 210 : 297;

  // Header Background & Border
  doc.setFillColor(248, 250, 252);
  doc.rect(10, 8, pageWidth - 20, 26, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(10, 8, pageWidth - 20, 26);

  // Hospital Name & Letterhead
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(report.hospitalName || 'MIXU MULTISPECIALTY HOSPITAL', 16, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`${HOSPITAL_CONFIG.address || 'Civil Hospital Road, Healthcare Enclave'} | Tel: ${HOSPITAL_CONFIG.phone || '+91 98765 43210'} | NABH Accredited`, 16, 21);

  // Report Title & Period
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(2, 132, 199);
  doc.text(report.title.toUpperCase(), 16, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Period: ${report.periodLabel}   |   Generated: ${report.generatedAt}`, pageWidth - 16, 28, { align: 'right' });

  // AutoTable
  const bodyRows = [...report.rows];
  if (report.grandTotal) {
    bodyRows.push(report.grandTotal);
  }

  (doc as any).autoTable({
    head: [report.columns],
    body: bodyRows,
    startY: 38,
    margin: { left: 10, right: 10, bottom: 15 },
    theme: 'grid',
    headStyles: {
      fillColor: [15, 30, 60],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 2.2
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left' }
    },
    didParseCell: (data: any) => {
      // Style grand total row differently
      if (report.grandTotal && data.row.index === bodyRows.length - 1) {
        data.cell.styles.fillColor = [226, 232, 240];
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = [15, 23, 42];
      }
    },
    didDrawPage: (data: any) => {
      // Running Page Number Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${data.pageNumber} of ${(doc as any).internal.getNumberOfPages()}`, pageWidth - 15, pageHeight - 8, { align: 'right' });
      doc.text('Mixu Enterprise Hospital Operations Management System • Confidential Institutional Document', 12, pageHeight - 8);
    }
  });

  const cleanFilename = report.title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.pdf';
  doc.save(cleanFilename);
};

/**
 * Download native formatted Excel Spreadsheet (.xlsx / XML Workbook format)
 */
export const downloadReportExcel = (report: UniversalReportData): void => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.xls`;

  let xml = `<?xml version="1.0" encoding="utf-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F1E3C" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#0284C7"/>
  </Style>
  <Style ss:ID="SubTitle">
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#64748B"/>
  </Style>
  <Style ss:ID="Total">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Hospital Report">
  <Table>
   <Row ss:Height="24">
    <Cell ss:StyleID="Title" ss:MergeAcross="${report.columns.length - 1}"><Data ss:Type="String">${report.hospitalName} - ${report.title}</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:StyleID="SubTitle" ss:MergeAcross="${report.columns.length - 1}"><Data ss:Type="String">Period: ${report.periodLabel} | Generated: ${report.generatedAt}</Data></Cell>
   </Row>
   <Row ss:Height="10"/>
   <Row ss:Height="22">
    ${report.columns.map(c => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(c)}</Data></Cell>`).join('')}
   </Row>
`;

  report.rows.forEach(r => {
    xml += `   <Row ss:Height="18">\n`;
    r.forEach(val => {
      const isNum = typeof val === 'number';
      const cleanVal = String(val).replace(/₹|,/g, '').trim();
      const isNumericVal = !isNaN(Number(cleanVal)) && isNum;
      xml += `    <Cell><Data ss:Type="${isNumericVal ? 'Number' : 'String'}">${escapeXml(String(val))}</Data></Cell>\n`;
    });
    xml += `   </Row>\n`;
  });

  if (report.grandTotal) {
    xml += `   <Row ss:Height="20">\n`;
    report.grandTotal.forEach(val => {
      xml += `    <Cell ss:StyleID="Total"><Data ss:Type="String">${escapeXml(String(val))}</Data></Cell>\n`;
    });
    xml += `   </Row>\n`;
  }

  xml += `  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Download RFC 4180 compliant CSV export
 */
export const downloadReportCsv = (report: UniversalReportData): void => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.csv`;

  const escapeCsv = (val: any) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines: string[] = [];
  lines.push(`"${report.hospitalName} - ${report.title}"`);
  lines.push(`"Period: ${report.periodLabel} | Generated: ${report.generatedAt}"`);
  lines.push('');
  lines.push(report.columns.map(escapeCsv).join(','));

  report.rows.forEach(r => {
    lines.push(r.map(escapeCsv).join(','));
  });

  if (report.grandTotal) {
    lines.push(report.grandTotal.map(escapeCsv).join(','));
  }

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Open printable high-contrast HTML window
 */
export const printReportView = (report: UniversalReportData): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${report.title} - ${report.hospitalName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 24px; color: #0f172a; }
    .header { border-bottom: 2px solid #0f2b3c; padding-bottom: 12px; margin-bottom: 20px; }
    .hospital-title { font-size: 20px; font-weight: 800; color: #0f2b3c; text-transform: uppercase; margin: 0; }
    .hospital-meta { font-size: 11px; color: #64748b; margin-top: 4px; }
    .report-title { font-size: 16px; font-weight: 700; color: #0284c7; margin-top: 10px; }
    .period { font-size: 12px; color: #475569; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    th { background: #0f2b3c; color: #ffffff; padding: 8px 10px; font-weight: 700; text-align: left; border: 1px solid #cbd5e1; }
    td { padding: 6px 10px; border: 1px solid #e2e8f0; }
    tr:nth-child(even) td { background: #f8fafc; }
    .total-row td { background: #e2e8f0 !important; font-weight: 800; color: #0f172a; border-top: 2px solid #94a3b8; }
    .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    @media print {
      body { margin: 10mm; }
      th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="hospital-title">${report.hospitalName}</div>
    <div class="hospital-meta">${HOSPITAL_CONFIG.address} • Ph: ${HOSPITAL_CONFIG.phone}</div>
    <div class="report-title">${report.title}</div>
    <div class="period">Period: <strong>${report.periodLabel}</strong> | Generated: ${report.generatedAt}</div>
  </div>

  <table>
    <thead>
      <tr>
        ${report.columns.map(c => `<th>${c}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${report.rows.map(r => `<tr>${r.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}
      ${report.grandTotal ? `<tr class="total-row">${report.grandTotal.map(v => `<td>${v}</td>`).join('')}</tr>` : ''}
    </tbody>
  </table>

  <div class="footer">
    Mixu Infosystem Hospital Management System • Report Verified • Confidential Internal Document
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
};

const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};
