/**
 * Dedicated Doctor Profile Print Generator
 * Generates an A4 portrait printable Doctor Profile document.
 * Opens in a dedicated separate tab, hiding application navigation and chrome.
 */

import { HOSPITAL_CONFIG } from '../config/hospitalConfig';
import type { DoctorRecord } from '../api/masterApi';

export function generateDoctorPrintHtml(doctor: DoctorRecord): string {
  const doctorName = `${doctor.title ? `${doctor.title} ` : ''}${doctor.drName}`;
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const fullAddress = [
    doctor.address,
    doctor.area,
    doctor.city,
    doctor.state,
    doctor.pin
  ].filter(Boolean).join(', ') || 'Not specified';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Doctor Profile - ${doctorName}</title>
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
      background: #0d9488;
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
    .print-btn:hover { background: #0f766e; }
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
      border-bottom: 2px solid #0d9488;
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
    .doc-meta-badge {
      text-align: right;
      font-size: 12px;
      color: #475569;
    }

    /* Profile Badge */
    .profile-title-bar {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0d9488;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dr-hero-name {
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
    }
    .dr-hero-degree {
      font-size: 13px;
      font-weight: 600;
      color: #0d9488;
      margin-top: 2px;
    }
    .dr-status-pill {
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
    <div style="font-weight: 600;">Doctor Master Profile Print View</div>
    <div style="display: flex; gap: 8px;">
      <button class="print-btn" onclick="window.print()">Print Document</button>
      <button class="close-btn" onclick="window.close()">Close</button>
    </div>
  </div>

  <div class="page-sheet">
    <header class="hospital-header">
      <div>
        <div class="hosp-name">${HOSPITAL_CONFIG.name}</div>
        <div class="hosp-tag">${HOSPITAL_CONFIG.address} | Phone: ${HOSPITAL_CONFIG.phone}</div>
      </div>
      <div class="doc-meta-badge">
        <div><strong>Date:</strong> ${currentDate}</div>
        <div><strong>Doctor ID:</strong> ${doctor.id}</div>
      </div>
    </header>

    <div class="profile-title-bar">
      <div>
        <div class="dr-hero-name">${doctorName}</div>
        <div class="dr-hero-degree">${doctor.degree || 'Medical Practitioner'} • ${doctor.speciality || 'General Medicine'}</div>
      </div>
      <div class="dr-status-pill">${doctor.status || 'Active'}</div>
    </div>

    <div class="section-title">Professional Credentials & Affiliation</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Doctor Type / Role</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.drHosRef || 'Hospital Doctor'} (${doctor.drType || 'Full Time'})</span>
      </div>
      <div class="info-row">
        <span class="info-label">Speciality</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.speciality || '--'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Medical Reg. No</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.drRegNo || 'Pending Verification'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Department</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.department || '--'}</span>
      </div>
    </div>

    <div class="section-title">Contact & Communication</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Mobile Number</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.mobileNo || '--'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email Address</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.email || '--'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Residence Phone</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.phNoR || '--'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Clinic Phone</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.clinicPhNo || '--'}</span>
      </div>
    </div>

    <div class="section-title">Clinic & Practice Location</div>
    <div class="info-grid">
      <div class="info-row" style="grid-column: span 2;">
        <span class="info-label">Clinic / Hospital Name</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.clinicName || HOSPITAL_CONFIG.name}</span>
      </div>
      <div class="info-row" style="grid-column: span 2;">
        <span class="info-label">Practice Address</span>
        <span class="info-colon">:</span>
        <span class="info-val">${fullAddress}</span>
      </div>
    </div>

    <div class="section-title">Consultation & Financial Schedule</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Consultation Fee</span>
        <span class="info-colon">:</span>
        <span class="info-val">₹ ${doctor.consultationFee !== undefined ? doctor.consultationFee : '500'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Follow-up Fee</span>
        <span class="info-colon">:</span>
        <span class="info-val">₹ ${doctor.followupFee !== undefined ? doctor.followupFee : '300'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">PAN Number</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.panNo || '--'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Aadhar Number</span>
        <span class="info-colon">:</span>
        <span class="info-val">${doctor.adharNo || '--'}</span>
      </div>
    </div>

    <footer class="print-footer">
      <div>Generated by <strong>Mixu Infosystem EMR</strong> • Doctor Master Record</div>
      <div>Authorized Medical Administration</div>
    </footer>
  </div>
</body>
</html>`;
}

export function openDoctorPrintView(doctor: DoctorRecord): void {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Please allow popups to open the Doctor Profile print preview.');
    return;
  }
  const html = generateDoctorPrintHtml(doctor);
  win.document.open();
  win.document.write(html);
  win.document.close();
}
