/**
 * Dedicated Medicine Formulary Print Generator
 * Generates an A4 portrait printable Medicine Record document.
 * Opens in a dedicated separate tab, hiding application navigation and chrome.
 */

import { HOSPITAL_CONFIG } from '../config/hospitalConfig';
import type { MedicineRecord } from '../api/masterApi';

export function generateMedicinePrintHtml(medicine: MedicineRecord): string {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Medicine Record - ${medicine.brandName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
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
      background: #f1f5f9;
      color: #1e293b;
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
    .print-btn {
      background: #0284c7;
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
      padding: 20mm;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
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

    /* Hospital Header */
    .hospital-header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .hosp-name {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .hosp-tag {
      font-size: 11.5px;
      color: #64748b;
      margin-top: 3px;
    }
    .med-meta-badge {
      text-align: right;
      font-size: 12px;
      color: #475569;
    }

    /* Profile Badge */
    .profile-title-bar {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-left: 4px solid #0284c7;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .med-hero-name {
      font-size: 20px;
      font-weight: 800;
      color: #0369a1;
    }
    .med-hero-generic {
      font-size: 13.5px;
      font-weight: 600;
      color: #475569;
      margin-top: 2px;
    }
    .med-status-pill {
      background: #dcfce7;
      color: #15803d;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Sections */
    .section-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 24px;
      row-gap: 8px;
      font-size: 12.5px;
    }
    .info-row {
      display: flex;
    }
    .info-label {
      width: 140px;
      font-weight: 700;
      color: #475569;
      flex-shrink: 0;
    }
    .info-colon {
      margin-right: 8px;
      font-weight: 700;
      color: #64748b;
    }
    .info-val {
      color: #0f172a;
      font-weight: 500;
    }

    /* Footer Sign-off */
    .print-footer {
      position: absolute;
      bottom: 18mm;
      left: 20mm;
      right: 20mm;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="no-print">
    <div style="font-weight: 600;">Medicine Master Formulary Print View</div>
    <div style="display: flex; gap: 8px;">
      <button class="print-btn" onclick="window.print()">Print Document</button>
      <button class="close-btn" onclick="window.close()">Close</button>
    </div>
  </div>

  <div class="page-sheet">
    <header class="hospital-header">
      <div>
        <div class="hosp-name">${HOSPITAL_CONFIG.name}</div>
        <div class="hosp-tag">Hospital Formulary & Pharmacy Master • ${HOSPITAL_CONFIG.address}</div>
      </div>
      <div class="med-meta-badge">
        <div><strong>Date:</strong> ${currentDate}</div>
        <div><strong>Item Code:</strong> ${medicine.id}</div>
      </div>
    </header>

    <div class="profile-title-bar">
      <div>
        <div class="med-hero-name">${medicine.brandName}</div>
        <div class="med-hero-generic">${medicine.genericName} • ${medicine.strength || ''} (${medicine.dosageForm || 'Tablet'})</div>
      </div>
      <div class="med-status-pill">${medicine.status || 'Active'}</div>
    </div>

    <div class="section-title">Clinical & Pharmaceutical Specifications</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Brand Name</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.brandName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Generic Name</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.genericName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Dosage Form</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.dosageForm || 'Tablet'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Strength</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.strength || '--'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Pharmacology Group</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.medicineGroup || 'General Medicine'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Default Frequency</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.frequency || '1-0-1 (Twice Daily)'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">For Patient Type</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.forPatient || 'Both (OPD / IPD)'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Dispensing Unit</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.unit || 'Strip / Box'}</span>
      </div>
    </div>

    <div class="section-title">Manufacturing & Batch Details</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Manufacturer</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.manufacturer || 'Standard Pharmaceutical'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Batch Number</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.batchNo || 'BATCH-2026-X'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Expiry Date</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.expiryDate || '2028-12-31'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Stock Availability</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.availability || 'In Stock'}</span>
      </div>
    </div>

    <div class="section-title">Pricing, Inventory & Tax Structure</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Selling MRP</span>
        <span class="info-colon">:</span>
        <span class="info-val" style="font-weight: 700; color: #0284c7;">₹ ${medicine.sellingPrice !== undefined ? medicine.sellingPrice : '120.00'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Purchase Rate</span>
        <span class="info-colon">:</span>
        <span class="info-val">₹ ${medicine.purchasePrice !== undefined ? medicine.purchasePrice : '85.00'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Current Stock Qty</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.stockQty !== undefined ? medicine.stockQty : '250'} ${medicine.unit || 'Units'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reorder Level</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.reorderLevel !== undefined ? medicine.reorderLevel : '50'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">GST Rate</span>
        <span class="info-colon">:</span>
        <span class="info-val">${medicine.gst !== undefined ? medicine.gst : '12'} %</span>
      </div>
    </div>

    ${medicine.notes || medicine.remark1 ? `
      <div class="section-title">Clinical Notes & Administration Advisory</div>
      <div style="font-size: 12.5px; color: #334155; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 4px;">
        ${medicine.notes || medicine.remark1 || ''}
      </div>
    ` : ''}

    <footer class="print-footer">
      <div>Generated by <strong>Mixu Infosystem EMR</strong> • Medicine Master Record</div>
      <div>Hospital Pharmacy Department Verification</div>
    </footer>
  </div>
</body>
</html>`;
}

export function openMedicinePrintView(medicine: MedicineRecord): void {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Please allow popups to open the Medicine Record print preview.');
    return;
  }
  const html = generateMedicinePrintHtml(medicine);
  win.document.open();
  win.document.write(html);
  win.document.close();
}
