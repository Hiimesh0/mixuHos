import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{t}from"./chevron-left-pfH1G-ej.js";import{n,t as r}from"./chevrons-right-m5U0MOu0.js";import{i,r as a,t as o}from"./masterApi-DrERYV4V.js";import{n as s,t as c}from"./useAutoDismissNotification-DQtooB-U.js";import{t as l}from"./download-C1c99UyS.js";import{t as u}from"./lock-Bet7tUf2.js";import{t as d}from"./pen-CQMiP4W3.js";import{t as f}from"./plus-CIyt92LX.js";import{t as p}from"./printer-mld-8E2y.js";import{t as m}from"./rotate-ccw-Bagtrt2-.js";import{t as ee}from"./save-CsQVGAud.js";import{t as h}from"./search-qyb5mcJL.js";import{t as g}from"./trash-BP-_k0XO.js";import{D as te,T as _,f as ne,h as re,i as v,k as y,m as ie,n as b,s as x,t as S,y as ae}from"./index-LyIh4O24.js";import{t as C}from"./jspdf.es.min-45i4qGuj.js";import{n as w,t as oe}from"./patientApi-DXolgTsK.js";import{n as se,t as ce}from"./useFormKeyboardNavigation-DWOKT9vJ.js";var T={name:`lock-open`,size:24,node:[[`rect`,{width:`18`,height:`11`,x:`3`,y:`11`,rx:`2`,ry:`2`,key:`1w4ew1`}],[`path`,{d:`M7 11V7a5 5 0 0 1 9.9-1`,key:`1mm8w8`}]],aliases:[`unlock`]};T.node;var le=_(T),E={name:`sparkles`,size:24,node:[[`path`,{d:`M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,key:`1s2grr`}],[`path`,{d:`M20 2v4`,key:`1rf3ol`}],[`path`,{d:`M22 4h-4`,key:`gwowj6`}],[`circle`,{cx:`4`,cy:`20`,r:`2`,key:`6kqj1y`}]],aliases:[`stars`]};E.node;var ue=_(E),D=e(y(),1);function O(e){if(!e)return k(new Date);try{let t=new Date(e);return isNaN(t.getTime())?e:k(t)}catch{return e}}function k(e){return`${String(e.getDate()).padStart(2,`0`)}-${[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`][e.getMonth()]}-${e.getFullYear()}`}function A(e){let t=O(e.reportDate),n=e.patientName?e.patientName.replace(/^DEMO:\s*/i,``):`Patient`,r=e.age?`${e.age} Yrs`:`--`,i=e.sex||`--`,a=e.referredBy||`DR. SAJID SHAIKH`,o=e.lvef||`40 %`;o&&!o.includes(`%`)&&(o=`${o} %`);let s=e.rwma?e.rwma:`present`,c=e.rvsp||`45 mmHg`;c&&!c.toLowerCase().includes(`mmhg`)&&(c=`${c} mmHg`);let l=e.ivs||`Intact`,u=e.ias||`Intact`,d=e.septum?`${e.septum} mm`:`10 mm`,f=e.pWall?`${e.pWall} mm`:`10 mm`,p=e.lvidd?`${e.lvidd} mm`:`44 mm`,m=e.lvids?`${e.lvids} mm`:`28 mm`,ee=e.pericardium||`Normal`,h=e.dopplerStudy||`Mild MR, Mild TR`,g=(e.conclusion||`Mild LV systolic dysfunction. LVEF: 40%
RWMA Present
Grade I LV Diastolic Dysfunction.
Normal Size Cardiac Chambers
Mild PH, PASP = 45mmHg
No e/o Clot/Vegetation/Pericardial Effusion
IVC Congested (1.9 cm) < 50% collapsing.`).replace(/^\[Sample Record\]\s*/i,``).split(`
`).map(e=>e.trim()).filter(Boolean),te=e.consultantDr||`Dr. Devang Desai`;return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>2D Echo Report - ${n}</title>
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
          <span class="header-val" style="font-weight: 600;">${n} .</span>
        </td>
        <td style="width: 42%;">
          <span class="header-label">Age / Sex</span>
          <span class="header-label" style="margin-left: 8px;">:</span>
          <span class="header-val" style="font-weight: 600;">${r} / ${i}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="header-label">Referred By Dr.</span>
          <span class="header-label" style="margin-left: 4px;">:</span>
          <span class="header-val" style="font-weight: 600;">${a}</span>
        </td>
        <td>
          <span class="header-label">Date</span>
          <span class="header-label" style="margin-left: 36px;">:</span>
          <span class="header-val" style="font-weight: 600;">${t}</span>
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
          <span class="finding-value">${e.mitralValve||`Structurally Normal, Mild MR`}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Aortic Valve</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${e.aorticValve||`Structurally Normal`}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Aorta</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${e.aorta||`Normal Sized`}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Tricuspid Valve</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${e.tricuspidValve||`Structurally Normal, Mild TR`}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Pulmonary Valve</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${e.pulmonaryValve||`Structurally Normal`}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Left Atrium</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${e.leftAtrium||`Normal Sized`}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Left Ventricle</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${e.leftVentricle||`Normal Sized, basal inferoposterior wall hypokinetic`}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Right Atrium</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${e.rightAtrium||`Normal Sized`}</span>
        </div>
        <div class="finding-row">
          <span class="finding-label">Right Ventricle</span>
          <span class="finding-colon">:</span>
          <span class="finding-value">${e.rightVentricle||`Normal Sized`}</span>
        </div>
      </div>

      <div class="findings-right">
        <div class="metric-box">
          <div class="metric-row">
            <span class="metric-label">LVEF</span>
            <span class="metric-colon">:</span>
            <span class="metric-val">${o}</span>
          </div>
          <div style="font-weight: 700; margin-top: 4px; padding-left: 2px;">
            RWMA ${s}
          </div>
        </div>

        <div class="metric-box" style="margin-top: 36px;">
          <div class="metric-row">
            <span class="metric-label" style="width: 95px;">PASP/RVSP</span>
            <span class="metric-colon">:</span>
            <span class="metric-val">${c}</span>
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
          <span class="meas-val">${l}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label">IAS</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${u}</span>
        </div>
        <div class="meas-item" style="margin-top: 8px;">
          <span class="meas-label" style="min-width: 82px;">Pericardium</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${ee}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 96px;">Doppler Study</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${h}</span>
        </div>
      </div>

      <!-- Col 2 -->
      <div>
        <div class="meas-item">
          <span class="meas-label">IVSD</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${d}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label">PWD</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${f}</span>
        </div>
      </div>

      <!-- Col 3 -->
      <div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 68px;">LVIDd</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${p}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 68px;">LVIDs</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${m}</span>
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
        ${g[0]||`Mild LV systolic dysfunction. LVEF:40%`}
      </div>
      ${g.length>1?`
        <div class="conclusion-list">
          ${g.slice(1).map(e=>`<div class="conclusion-list-item">${e}</div>`).join(``)}
        </div>
      `:``}
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
        <div class="doc-name">${te}</div>
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
  <\/script>
</body>
</html>`}function de(e){let t=window.open(`about:blank`,`_blank`);if(!t){alert(`Please allow popups for this site to open the Echo Report print preview.`);return}let n=A(e);t.document.open(),t.document.write(n),t.document.close()}function fe(e){let t=new C({orientation:`portrait`,unit:`mm`,format:`a4`}),n=e.patientName?e.patientName.replace(/^DEMO:\s*/i,``):`Patient`,r=O(e.reportDate),i=e.referredBy||`DR. SAJID SHAIKH`,a=e.age?`${e.age} Yrs`:`--`,o=e.sex||`--`;t.setFont(`helvetica`,`bold`),t.setFontSize(10.5),t.text(`Name`,16,20),t.text(`:`,55,20),t.setFont(`helvetica`,`normal`),t.text(`${n} .`,60,20),t.setFont(`helvetica`,`bold`),t.text(`Age / Sex`,130,20),t.text(`:`,155,20),t.setFont(`helvetica`,`normal`),t.text(`${a} / ${o}`,160,20),t.setFont(`helvetica`,`bold`),t.text(`Referred By Dr.`,16,26),t.text(`:`,55,26),t.setFont(`helvetica`,`normal`),t.text(i,60,26),t.setFont(`helvetica`,`bold`),t.text(`Date`,130,26),t.text(`:`,155,26),t.setFont(`helvetica`,`normal`),t.text(r,160,26),t.setFont(`helvetica`,`bold`),t.setFontSize(14);let s=`2D Echo Report`,c=t.getTextWidth(s),l=(210-c)/2;t.text(s,l,38),t.line(l,39,l+c,39),t.setFontSize(9.5);let u=48;[[`Mitral Valve`,e.mitralValve||`Structurally Normal, Mild MR`],[`Aortic Valve`,e.aorticValve||`Structurally Normal`],[`Aorta`,e.aorta||`Normal Sized`],[`Tricuspid Valve`,e.tricuspidValve||`Structurally Normal, Mild TR`],[`Pulmonary Valve`,e.pulmonaryValve||`Structurally Normal`],[`Left Atrium`,e.leftAtrium||`Normal Sized`],[`Left Ventricle`,e.leftVentricle||`Normal Sized, basal inferoposterior wall hypokinetic`],[`Right Atrium`,e.rightAtrium||`Normal Sized`],[`Right Ventricle`,e.rightVentricle||`Normal Sized`]].forEach(([e,n])=>{t.setFont(`helvetica`,`bold`),t.text(e,16,u),t.text(`:`,55,u),t.setFont(`helvetica`,`normal`);let r=t.splitTextToSize(n,75);t.text(r,60,u),u+=Math.max(5.5,r.length*4.5)}),t.setFont(`helvetica`,`bold`),t.text(`LVEF`,140,52),t.text(`:`,165,52),t.setFont(`helvetica`,`bold`),t.text(e.lvef||`40 %`,170,52),t.text(`RWMA ${e.rwma||`present`}`,140,58),t.text(`PASP/RVSP`,140,80),t.text(`:`,168,80),t.text(e.rvsp||`45 mmHg`,172,80),u=Math.max(u,106)+4,t.setFontSize(9),t.setFont(`helvetica`,`bold`),t.text(`IVS`,16,u),t.text(`:`,40,u),t.setFont(`helvetica`,`normal`),t.text(e.ivs||`Intact`,43,u),t.setFont(`helvetica`,`bold`),t.text(`IAS`,16,u+5),t.text(`:`,40,u+5),t.setFont(`helvetica`,`normal`),t.text(e.ias||`Intact`,43,u+5),t.setFont(`helvetica`,`bold`),t.text(`Pericardium`,16,u+12),t.text(`:`,40,u+12),t.setFont(`helvetica`,`normal`),t.text(e.pericardium||`Normal`,43,u+12),t.setFont(`helvetica`,`bold`),t.text(`Doppler Study`,16,u+18),t.text(`:`,40,u+18),t.setFont(`helvetica`,`normal`),t.text(e.dopplerStudy||`Mild MR, Mild TR`,43,u+18),t.setFont(`helvetica`,`bold`),t.text(`IVSD`,85,u),t.text(`:`,102,u),t.setFont(`helvetica`,`normal`),t.text(e.septum?`${e.septum} mm`:`10 mm`,105,u),t.setFont(`helvetica`,`bold`),t.text(`PWD`,85,u+5),t.text(`:`,102,u+5),t.setFont(`helvetica`,`normal`),t.text(e.pWall?`${e.pWall} mm`:`10 mm`,105,u+5),t.setFont(`helvetica`,`bold`),t.text(`LVIDd`,140,u),t.text(`:`,160,u),t.setFont(`helvetica`,`normal`),t.text(e.lvidd?`${e.lvidd} mm`:`44 mm`,164,u),t.setFont(`helvetica`,`bold`),t.text(`LVIDs`,140,u+5),t.text(`:`,160,u+5),t.setFont(`helvetica`,`normal`),t.text(e.lvids?`${e.lvids} mm`:`28 mm`,164,u+5),t.setFont(`helvetica`,`bold`),t.text(`AV Max`,140,u+11),t.text(`:`,160,u+11),t.setFont(`helvetica`,`normal`),t.text(`1.2 m/Sec`,164,u+11),t.setFont(`helvetica`,`bold`),t.text(`PV Max`,140,u+16),t.text(`:`,160,u+16),t.setFont(`helvetica`,`normal`),t.text(`1.1 m/Sec`,164,u+16),t.setFont(`helvetica`,`bold`),t.text(`MV E/A`,140,u+21),t.text(`:`,160,u+21),t.setFont(`helvetica`,`normal`),t.text(`> 1`,164,u+21),u+=30,t.setFont(`helvetica`,`bold`),t.text(`Conclusion`,16,u),t.text(`:`,38,u),t.setFont(`helvetica`,`normal`);let d=(e.conclusion||`Mild LV systolic dysfunction. LVEF: 40%
RWMA Present
Grade I LV Diastolic Dysfunction.
Normal Size Cardiac Chambers
Mild PH, PASP = 45mmHg
No e/o Clot/Vegetation/Pericardial Effusion
IVC Congested (1.9 cm) < 50% collapsing.`).replace(/^\[Sample Record\]\s*/i,``).split(`
`).map(e=>e.trim()).filter(Boolean);if(d.length>0){t.text(d[0],42,u),u+=5.5;for(let e=1;e<d.length;e++)t.text(d[e],42,u),u+=5}u=Math.max(u+12,240),t.setFont(`helvetica`,`bold`),t.setFontSize(10),t.text(`Dr. Dharmil Patel`,16,u),t.setFont(`helvetica`,`normal`),t.setFontSize(8.5),t.text(`DNB (Cardiology) Interventional Cardiologist`,16,u+4.5),t.text(`(FULL TIME)`,16,u+8.5);let f=e.consultantDr||`Dr. Devang Desai`;t.setFont(`helvetica`,`bold`),t.setFontSize(10),t.text(f,135,u),t.setFont(`helvetica`,`normal`),t.setFontSize(8.5),t.text(`D.M.(Cardiology), M.D(MED.); FACC`,135,u+4.5),t.text(`INTERVENTIONAL CARDIOLOGIST`,135,u+8.5),t.setFontSize(8),t.setFont(`helvetica`,`normal`);let p=`"This Report is not valid for medico-legal purpose."`,m=`"Normal echocardiography does not rule out coronary artery disease."`;return t.text(p,(210-t.getTextWidth(p))/2,275),t.text(m,(210-t.getTextWidth(m))/2,280),t.output(`blob`)}var j={pageContainer:`_pageContainer_1ryr6_1`,header:`_header_1ryr6_15`,titleArea:`_titleArea_1ryr6_25`,pageTitle:`_pageTitle_1ryr6_31`,reportIdBadge:`_reportIdBadge_1ryr6_41`,statusBadgeDraft:`_statusBadgeDraft_1ryr6_51`,statusBadgeFinalized:`_statusBadgeFinalized_1ryr6_65`,alertSuccess:`_alertSuccess_1ryr6_80`,fadeIn:`_fadeIn_1ryr6_1`,alertError:`_alertError_1ryr6_93`,patientChip:`_patientChip_1ryr6_112`,formContainer:`_formContainer_1ryr6_126`,section:`_section_1ryr6_133`,sectionHeader:`_sectionHeader_1ryr6_144`,sectionTitle:`_sectionTitle_1ryr6_153`,row:`_row_1ryr6_164`,fieldGroup:`_fieldGroup_1ryr6_171`,label:`_label_1ryr6_177`,labelRight:`_labelRight_1ryr6_184`,input:`_input_1ryr6_190`,inputReadOnly:`_inputReadOnly_1ryr6_208`,inputLocked:`_inputLocked_1ryr6_214`,textarea:`_textarea_1ryr6_221`,measurementGrid:`_measurementGrid_1ryr6_242`,measurementSubGrid:`_measurementSubGrid_1ryr6_248`,complexRow:`_complexRow_1ryr6_255`,unit:`_unit_1ryr6_262`,wSmall:`_wSmall_1ryr6_270`,wMedium:`_wMedium_1ryr6_271`,wLarge:`_wLarge_1ryr6_272`,wFull:`_wFull_1ryr6_273`,splitSection:`_splitSection_1ryr6_276`,templateBtn:`_templateBtn_1ryr6_283`,actionBar:`_actionBar_1ryr6_304`,navControls:`_navControls_1ryr6_318`,navBtn:`_navBtn_1ryr6_324`,middleActions:`_middleActions_1ryr6_349`,rightActions:`_rightActions_1ryr6_356`,btn:`_btn_1ryr6_364`,btnPrimary:`_btnPrimary_1ryr6_379`,btnSecondary:`_btnSecondary_1ryr6_390`,btnSuccess:`_btnSuccess_1ryr6_401`,btnDanger:`_btnDanger_1ryr6_412`,btnWarning:`_btnWarning_1ryr6_423`,modalOverlay:`_modalOverlay_1ryr6_439`,modalContent:`_modalContent_1ryr6_452`,modalHeader:`_modalHeader_1ryr6_465`,modalTitle:`_modalTitle_1ryr6_474`,modalBody:`_modalBody_1ryr6_484`,modalFooter:`_modalFooter_1ryr6_490`,dataTable:`_dataTable_1ryr6_500`,printContainer:`_printContainer_1ryr6_527`,printHeader:`_printHeader_1ryr6_538`,printHospitalName:`_printHospitalName_1ryr6_545`,printHospitalInfo:`_printHospitalInfo_1ryr6_554`,printTitleBanner:`_printTitleBanner_1ryr6_561`,printPatientGrid:`_printPatientGrid_1ryr6_574`,printPatientRow:`_printPatientRow_1ryr6_586`,printPatientLabel:`_printPatientLabel_1ryr6_591`,printPatientVal:`_printPatientVal_1ryr6_596`,printTable:`_printTable_1ryr6_601`,printBox:`_printBox_1ryr6_622`,printBoxTitle:`_printBoxTitle_1ryr6_629`,printBoxContent:`_printBoxContent_1ryr6_638`,printFooterSign:`_printFooterSign_1ryr6_645`,printOverlayActive:`_printOverlayActive_1ryr6_672`},M=S(),N={uhid:``,patientName:``,age:``,sex:``,reportDate:new Date().toISOString().split(`T`)[0],referredBy:``,c_o:``,mitralValve:``,tricuspidValve:``,aorta:``,leftVentricle:``,rwma:``,rightVentricle:``,ivc:``,aorticValve:``,pulmonaryValve:``,lvef:``,leftAtrium:``,rightAtrium:``,rvsp:``,ivs:``,septum:``,lvidd:``,ias:``,pWall:``,lvids:``,pericardium:``,dopplerStudy:``,conclusion:``,lvCompliance:``,tvi:``,leftAorticArchPdaCoarctation:``,consultantDr:``,status:`Draft`,finalizedAt:null,finalizedBy:null},P=()=>{let e=te(),[_,y]=(0,D.useState)(null),[S,C]=(0,D.useState)(N),[T,E]=(0,D.useState)([]),[O,k]=(0,D.useState)(-1),[A,P]=(0,D.useState)(!1),[pe,F]=(0,D.useState)(!0),[I,L]=(0,D.useState)(!1),[R,me]=(0,D.useState)([]),[he,ge]=(0,D.useState)([]),[_e,ve]=(0,D.useState)([]),[ye,z]=(0,D.useState)(!1),[B,be]=(0,D.useState)(``),[xe,V]=(0,D.useState)(!1),[H,Se]=(0,D.useState)(``),[U,Ce]=(0,D.useState)(`All`),[W,we]=(0,D.useState)(`All`),[Te,G]=(0,D.useState)(!1),[Ee,K]=(0,D.useState)(!1),[De,q]=(0,D.useState)(!1),[Oe,J]=(0,D.useState)(!1),{notification:Y,setNotification:X,dismissNotification:ke}=c(),{formRef:Ae,handleKeyDown:je}=se({fieldOrder:ce}),Me=()=>{if(!S.uhid){X({type:`error`,message:`Please select or enter a patient before printing.`});return}de({id:_||`ECHO-PRINT`,...S})},Ne=()=>{if(!S.uhid){X({type:`error`,message:`Please select or enter a patient before exporting PDF.`});return}try{let e=fe({id:_||`ECHO-PRINT`,...S}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`Echo_Report_${S.uhid||`patient`}_${S.reportDate||`date`}.pdf`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(t),X({type:`success`,message:`PDF downloaded successfully.`})}catch{X({type:`error`,message:`Failed to generate PDF.`})}},Pe=()=>{window.confirm(`Clear all fields on this Echo Report? Any unsaved edits will be discarded.`)&&(C(N),y(null),k(-1),P(!1),X({type:`success`,message:`Form cleared.`}))},Z=S.status===`Finalized`&&!A,Q=(0,D.useCallback)((e,t=-1)=>{y(e.id),C({uhid:e.uhid||``,patientName:e.patientName||``,age:e.age||``,sex:e.sex||``,reportDate:e.reportDate||``,referredBy:e.referredBy||``,c_o:e.c_o||``,mitralValve:e.mitralValve||``,tricuspidValve:e.tricuspidValve||``,aorta:e.aorta||``,leftVentricle:e.leftVentricle||``,rwma:e.rwma||``,rightVentricle:e.rightVentricle||``,ivc:e.ivc||``,aorticValve:e.aorticValve||``,pulmonaryValve:e.pulmonaryValve||``,lvef:e.lvef||``,leftAtrium:e.leftAtrium||``,rightAtrium:e.rightAtrium||``,rvsp:e.rvsp||``,ivs:e.ivs||``,septum:e.septum||``,lvidd:e.lvidd||``,ias:e.ias||``,pWall:e.pWall||``,lvids:e.lvids||``,pericardium:e.pericardium||``,dopplerStudy:e.dopplerStudy||``,conclusion:e.conclusion||``,lvCompliance:e.lvCompliance||``,tvi:e.tvi||``,leftAorticArchPdaCoarctation:e.leftAorticArchPdaCoarctation||``,consultantDr:e.consultantDr||``,status:e.status||`Draft`,finalizedAt:e.finalizedAt||null,finalizedBy:e.finalizedBy||null}),P(!1),t>=0&&k(t)},[]),Fe=(0,D.useCallback)(async()=>{try{F(!0);let[e,t,n,r]=await Promise.all([w.getReports().catch(()=>({success:!0,count:0,reports:[]})),oe.getPatients().catch(()=>({success:!0,count:0,patients:[]})),o.getDoctors().catch(()=>({success:!0,count:0,doctors:[]})),(a.getReportTemplates?a.getReportTemplates():a.getTemplates()).catch(()=>({success:!0,count:0,templates:[]}))]),i=e.reports||[];E(i),me(t.patients||[]),ge(n.doctors||[]),ve(r.templates||[]),i.length>0&&Q(i[0],0)}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to load initial data.`})}finally{F(!1)}},[Q,X]);(0,D.useEffect)(()=>{Fe()},[Fe]);let Ie=()=>{T.length>0&&Q(T[0],0)},Le=()=>{if(O>0){let e=O-1;Q(T[e],e)}},Re=()=>{if(O<T.length-1){let e=O+1;Q(T[e],e)}},ze=()=>{if(T.length>0){let e=T.length-1;Q(T[e],e)}},$=(e,t)=>{Z||C(n=>({...n,[e]:t}))},Be=()=>{y(null),k(-1),P(!1),C({...N,reportDate:new Date().toISOString().split(`T`)[0]}),X({type:`success`,message:`New Echo Report form ready. Please select a patient.`})},Ve=e=>{let t=[e.firstName,e.middleName,e.lastName].filter(Boolean).join(` `).trim();C(n=>({...n,uhid:e.uhid,patientName:t||e.firstName,age:e.age,sex:e.sex,referredBy:e.referenceBy||n.referredBy,consultantDr:e.hospitalDoctor||n.consultantDr})),z(!1),X({type:`success`,message:`Patient ${e.uhid} (${t}) loaded.`})},He=async()=>{if(!S.uhid){X({type:`error`,message:`Patient is required. Please search and select an existing patient.`}),z(!0);return}try{if(L(!0),_){let e=await w.updateReport(_,{...S,status:`Draft`},A);X({type:`success`,message:e.message||`Echo report '${_}' saved as Draft.`}),Q(e.report,O)}else{let e=await w.createReport({...S,status:`Draft`});X({type:`success`,message:e.message||`Echo report '${e.report.id}' created as Draft.`});let t=await w.getReports();E(t.reports),Q(e.report,0)}P(!1)}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to save Echo Report.`})}finally{L(!1)}},Ue=async()=>{if(!_){if(!S.uhid){X({type:`error`,message:`Patient selection is required before finalizing report.`});return}try{L(!0);let e=await w.createReport({...S,status:`Draft`}),t=await w.finalizeReport(e.report.id,S.consultantDr||`Consultant Physician`);X({type:`success`,message:`Echo report '${t.report.id}' finalized and locked.`});let n=await w.getReports();E(n.reports),Q(t.report,0)}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to finalize report.`})}finally{L(!1),q(!1)}return}try{L(!0),await w.updateReport(_,S,!0);let e=await w.finalizeReport(_,S.consultantDr||`Consultant Physician`);X({type:`success`,message:e.message||`Echo report '${_}' finalized and locked.`});let t=await w.getReports();E(t.reports),Q(e.report,O)}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to finalize report.`})}finally{L(!1),q(!1)}},We=async()=>{if(_)try{L(!0),await w.deleteReport(_),X({type:`success`,message:`Echo report '${_}' deleted successfully.`});let e=await w.getReports();E(e.reports),e.reports.length>0?Q(e.reports[0],0):Be()}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to delete Echo Report.`})}finally{L(!1),J(!1)}},Ge=e=>{C(t=>({...t,dopplerStudy:t.dopplerStudy?`${t.dopplerStudy}\n\n${e.details}`:e.details,conclusion:t.conclusion?t.conclusion:`Study consistent with findings from ${e.templateName}.`})),G(!1),X({type:`success`,message:`Template '${e.templateName}' loaded into Doppler Study.`})},Ke=(0,D.useMemo)(()=>{if(!B.trim())return R.slice(0,20);let e=B.toLowerCase();return R.filter(t=>t.uhid.toLowerCase().includes(e)||t.firstName.toLowerCase().includes(e)||t.lastName.toLowerCase().includes(e)||t.mobile.includes(e))},[R,B]),qe=(0,D.useMemo)(()=>{let e=T;if(U!==`All`&&(e=e.filter(e=>e.status.toLowerCase()===U.toLowerCase())),W!==`All`&&(e=e.filter(e=>e.consultantDr?.toLowerCase().includes(W.toLowerCase()))),H.trim()){let t=H.toLowerCase();e=e.filter(e=>e.id.toLowerCase().includes(t)||e.uhid.toLowerCase().includes(t)||e.patientName.toLowerCase().includes(t)||e.consultantDr.toLowerCase().includes(t)||e.conclusion.toLowerCase().includes(t))}return e},[T,U,W,H]);return(0,M.jsxs)(`div`,{className:j.pageContainer,children:[(0,M.jsxs)(`header`,{className:j.header,children:[(0,M.jsxs)(`div`,{className:j.titleArea,children:[(0,M.jsxs)(`h1`,{className:j.pageTitle,children:[(0,M.jsx)(ie,{size:24,color:`var(--primary)`,"aria-hidden":`true`}),`Echo Report`]}),_&&(0,M.jsx)(`span`,{className:j.reportIdBadge,children:_}),pe&&(0,M.jsx)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:`Loading...`}),S.status===`Finalized`?(0,M.jsxs)(`span`,{className:j.statusBadgeFinalized,title:`Finalized clinical document`,children:[(0,M.jsx)(u,{size:12}),` Finalized`]}):(0,M.jsxs)(`span`,{className:j.statusBadgeDraft,title:`Draft - editable`,children:[(0,M.jsx)(d,{size:12}),` Draft`]})]}),S.uhid&&(0,M.jsxs)(`div`,{className:j.patientChip,children:[(0,M.jsx)(x,{size:16}),(0,M.jsxs)(`span`,{children:[S.patientName,` (`,S.uhid,`) • `,S.age||`--`,` yrs / `,S.sex||`--`]}),(0,M.jsx)(`button`,{type:`button`,className:j.templateBtn,onClick:()=>z(!0),title:`Change patient`,children:`Change`})]})]}),Y&&(0,M.jsxs)(`div`,{className:Y.type===`success`?j.alertSuccess:j.alertError,role:`alert`,children:[(0,M.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[Y.type===`success`?(0,M.jsx)(s,{size:18}):(0,M.jsx)(i,{size:18}),(0,M.jsx)(`span`,{children:Y.message})]}),(0,M.jsx)(`button`,{type:`button`,onClick:ke,style:{background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},"aria-label":`Dismiss notification`,children:(0,M.jsx)(v,{size:16})})]}),S.status===`Finalized`&&(0,M.jsxs)(`div`,{style:{backgroundColor:A?`rgba(217, 119, 6, 0.1)`:`rgba(16, 185, 129, 0.08)`,border:A?`1px solid rgba(217, 119, 6, 0.3)`:`1px solid rgba(16, 185, 129, 0.3)`,padding:`8px 16px`,borderRadius:`6px`,fontSize:`13px`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`12px`,flexWrap:`wrap`},children:[(0,M.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[A?(0,M.jsx)(le,{size:16,color:`#d97706`}):(0,M.jsx)(u,{size:16,color:`#059669`}),(0,M.jsx)(`span`,{children:A?`Amendment Mode Active: You are editing an authorized revision of this finalized report.`:`This report was finalized on ${S.finalizedAt?new Date(S.finalizedAt).toLocaleDateString():`earlier`} by ${S.finalizedBy||`Consultant`}. Fields are locked against accidental changes.`})]}),(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${A?j.btnSecondary:j.btnWarning}`,style:{height:`30px`,fontSize:`12px`,padding:`0 10px`},onClick:()=>P(e=>!e),children:A?`Exit Amendment`:`Authorize Amendment / Edit`})]}),(0,M.jsxs)(`form`,{className:j.formContainer,ref:Ae,onKeyDown:je,onSubmit:e=>e.preventDefault(),children:[(0,M.jsxs)(`section`,{className:j.section,"aria-label":`Patient Identification`,children:[(0,M.jsxs)(`div`,{className:j.sectionHeader,children:[(0,M.jsxs)(`span`,{className:j.sectionTitle,children:[(0,M.jsx)(x,{size:15}),` Patient & Study Details`]}),(0,M.jsxs)(`button`,{type:`button`,className:j.templateBtn,onClick:()=>z(!0),disabled:Z,children:[(0,M.jsx)(h,{size:13}),` Search Patient Directory`]})]}),(0,M.jsxs)(`div`,{className:j.row,children:[(0,M.jsxs)(`div`,{className:j.fieldGroup,style:{flex:`1.5 1 240px`},children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Patient's Name :`}),(0,M.jsx)(`input`,{type:`text`,name:`patientName`,className:`${j.input} ${j.wFull} ${Z?j.inputLocked:``}`,style:{backgroundColor:S.patientName?void 0:`var(--warning-soft)`},value:S.patientName,onChange:e=>$(`patientName`,e.target.value),placeholder:`Click 'Search Patient Directory'...`,readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.fieldGroup,style:{flex:`1 1 180px`},children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Pt.Code :`}),(0,M.jsxs)(`div`,{style:{display:`flex`,gap:`6px`,width:`100%`},children:[(0,M.jsx)(`input`,{type:`text`,name:`uhid`,className:`${j.input} ${j.wFull} ${Z?j.inputLocked:``}`,value:S.uhid,onChange:e=>$(`uhid`,e.target.value),placeholder:`UHID-XXXX`,readOnly:Z}),(0,M.jsx)(`button`,{type:`button`,className:j.btnSecondary,style:{height:`36px`,padding:`0 10px`},onClick:()=>z(!0),disabled:Z,title:`Search patient`,children:(0,M.jsx)(h,{size:14})})]})]}),(0,M.jsxs)(`div`,{className:j.fieldGroup,children:[(0,M.jsx)(`label`,{className:j.label,children:`Age :`}),(0,M.jsx)(`input`,{type:`text`,name:`age`,className:`${j.input} ${j.wSmall} ${Z?j.inputLocked:``}`,value:S.age,onChange:e=>$(`age`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.fieldGroup,children:[(0,M.jsx)(`label`,{className:j.label,children:`Sex :`}),(0,M.jsxs)(`select`,{name:`sex`,className:`${j.input} ${j.wSmall} ${Z?j.inputLocked:``}`,value:S.sex,onChange:e=>$(`sex`,e.target.value),disabled:Z,children:[(0,M.jsx)(`option`,{value:``}),(0,M.jsx)(`option`,{value:`Male`,children:`Male`}),(0,M.jsx)(`option`,{value:`Female`,children:`Female`}),(0,M.jsx)(`option`,{value:`Other`,children:`Other`})]})]}),(0,M.jsxs)(`div`,{className:j.fieldGroup,children:[(0,M.jsx)(`label`,{className:j.label,children:`Date :`}),(0,M.jsx)(`input`,{type:`date`,name:`reportDate`,className:`${j.input} ${j.wMedium} ${Z?j.inputLocked:``}`,value:S.reportDate,onChange:e=>$(`reportDate`,e.target.value),readOnly:Z,max:`2099-12-31`})]})]}),(0,M.jsxs)(`div`,{className:j.row,children:[(0,M.jsxs)(`div`,{className:j.fieldGroup,style:{flex:`1.5 1 240px`},children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Refered By :`}),(0,M.jsx)(`input`,{type:`text`,name:`referredBy`,className:`${j.input} ${j.wFull} ${Z?j.inputLocked:``}`,value:S.referredBy,onChange:e=>$(`referredBy`,e.target.value),placeholder:`Referring Physician / Hospital`,readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.fieldGroup,style:{flex:`2.5 1 300px`},children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`C/O :`}),(0,M.jsx)(`input`,{type:`text`,name:`c_o`,className:`${j.input} ${j.wFull} ${Z?j.inputLocked:``}`,value:S.c_o,onChange:e=>$(`c_o`,e.target.value),placeholder:`Clinical symptoms / Indications (e.g. Chest pain, Dyspnea on exertion)`,readOnly:Z})]})]})]}),(0,M.jsxs)(`section`,{className:j.section,"aria-label":`Echocardiographic Measurements`,children:[(0,M.jsxs)(`div`,{className:j.sectionHeader,children:[(0,M.jsxs)(`span`,{className:j.sectionTitle,children:[(0,M.jsx)(ie,{size:15}),` Chamber Dimensions & Valve Assessment`]}),(0,M.jsx)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:`Standard 2D Transthoracic Measurements`})]}),(0,M.jsxs)(`div`,{className:j.measurementGrid,children:[(0,M.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Mitral Valve :`}),(0,M.jsx)(`input`,{type:`text`,name:`mitralValve`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.mitralValve,onChange:e=>$(`mitralValve`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Tricuspid Valve :`}),(0,M.jsx)(`input`,{type:`text`,name:`tricuspidValve`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.tricuspidValve,onChange:e=>$(`tricuspidValve`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Aorta :`}),(0,M.jsx)(`input`,{type:`text`,name:`aorta`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.aorta,onChange:e=>$(`aorta`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Left Ventricle :`}),(0,M.jsx)(`input`,{type:`text`,name:`leftVentricle`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.leftVentricle,onChange:e=>$(`leftVentricle`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`RWMA :`}),(0,M.jsx)(`input`,{type:`text`,name:`rwma`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.rwma,onChange:e=>$(`rwma`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Right Ventricle :`}),(0,M.jsx)(`input`,{type:`text`,name:`rightVentricle`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.rightVentricle,onChange:e=>$(`rightVentricle`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`IVC :`}),(0,M.jsx)(`input`,{type:`text`,name:`ivc`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.ivc,onChange:e=>$(`ivc`,e.target.value),readOnly:Z})]})]}),(0,M.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Aortic Valve :`}),(0,M.jsx)(`input`,{type:`text`,name:`aorticValve`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.aorticValve,onChange:e=>$(`aorticValve`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Pulmonary Valve :`}),(0,M.jsxs)(`div`,{className:j.complexRow,children:[(0,M.jsx)(`input`,{type:`text`,name:`pulmonaryValve`,className:`${j.input} ${j.wFull} ${Z?j.inputLocked:``}`,value:S.pulmonaryValve,onChange:e=>$(`pulmonaryValve`,e.target.value),readOnly:Z}),(0,M.jsx)(`label`,{className:j.label,style:{marginLeft:`8px`},children:`LVEF :`}),(0,M.jsx)(`input`,{type:`text`,name:`lvef`,className:`${j.input} ${j.wMedium} ${Z?j.inputLocked:``}`,value:S.lvef,onChange:e=>$(`lvef`,e.target.value),placeholder:`e.g. 60%`,readOnly:Z})]})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Left Atrium :`}),(0,M.jsx)(`input`,{type:`text`,name:`leftAtrium`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.leftAtrium,onChange:e=>$(`leftAtrium`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Right Atrium :`}),(0,M.jsx)(`input`,{type:`text`,name:`rightAtrium`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.rightAtrium,onChange:e=>$(`rightAtrium`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`RVSP :`}),(0,M.jsx)(`input`,{type:`text`,name:`rvsp`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.rvsp,onChange:e=>$(`rvsp`,e.target.value),placeholder:`mmHg`,readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`IVS :`}),(0,M.jsxs)(`div`,{className:j.complexRow,children:[(0,M.jsx)(`input`,{type:`text`,name:`ivs`,className:`${j.input} ${j.wFull} ${Z?j.inputLocked:``}`,value:S.ivs,onChange:e=>$(`ivs`,e.target.value),readOnly:Z}),(0,M.jsx)(`label`,{className:j.label,style:{width:`50px`,textAlign:`right`},children:`Septum :`}),(0,M.jsx)(`input`,{type:`text`,name:`septum`,className:`${j.input} ${j.wSmall} ${Z?j.inputLocked:``}`,value:S.septum,onChange:e=>$(`septum`,e.target.value),readOnly:Z}),(0,M.jsx)(`span`,{className:j.unit,children:`mm`}),(0,M.jsx)(`label`,{className:j.label,style:{marginLeft:`6px`},children:`LVIDd :`}),(0,M.jsx)(`input`,{type:`text`,name:`lvidd`,className:`${j.input} ${j.wMedium} ${Z?j.inputLocked:``}`,value:S.lvidd,onChange:e=>$(`lvidd`,e.target.value),readOnly:Z})]})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`IAS :`}),(0,M.jsxs)(`div`,{className:j.complexRow,children:[(0,M.jsx)(`input`,{type:`text`,name:`ias`,className:`${j.input} ${j.wFull} ${Z?j.inputLocked:``}`,value:S.ias,onChange:e=>$(`ias`,e.target.value),readOnly:Z}),(0,M.jsx)(`label`,{className:j.label,style:{width:`50px`,textAlign:`right`},children:`P.Wall :`}),(0,M.jsx)(`input`,{type:`text`,name:`pWall`,className:`${j.input} ${j.wSmall} ${Z?j.inputLocked:``}`,value:S.pWall,onChange:e=>$(`pWall`,e.target.value),readOnly:Z}),(0,M.jsx)(`span`,{className:j.unit,children:`mm`}),(0,M.jsx)(`label`,{className:j.label,style:{marginLeft:`6px`},children:`LVIDs :`}),(0,M.jsx)(`input`,{type:`text`,name:`lvids`,className:`${j.input} ${j.wMedium} ${Z?j.inputLocked:``}`,value:S.lvids,onChange:e=>$(`lvids`,e.target.value),readOnly:Z})]})]})]})]})]}),(0,M.jsxs)(`section`,{className:j.section,"aria-label":`Clinical Observations and Conclusion`,children:[(0,M.jsxs)(`div`,{className:j.sectionHeader,children:[(0,M.jsxs)(`span`,{className:j.sectionTitle,children:[(0,M.jsx)(re,{size:15}),` Doppler Study & Clinical Conclusion`]}),(0,M.jsxs)(`button`,{type:`button`,className:j.templateBtn,onClick:()=>G(!0),disabled:Z,children:[(0,M.jsx)(ue,{size:13}),` Load Report Template`]})]}),(0,M.jsxs)(`div`,{className:j.splitSection,children:[(0,M.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,M.jsxs)(`div`,{className:j.measurementSubGrid,children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Pericardium :`}),(0,M.jsx)(`input`,{type:`text`,name:`pericardium`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.pericardium,onChange:e=>$(`pericardium`,e.target.value),placeholder:`e.g. Normal, no pericardial effusion`,readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,style:{alignItems:`flex-start`},children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,style:{marginTop:`8px`},children:`Doppler Study :`}),(0,M.jsx)(`textarea`,{name:`dopplerStudy`,className:`${j.textarea} ${Z?j.inputLocked:``}`,style:{height:`80px`},value:S.dopplerStudy,onChange:e=>$(`dopplerStudy`,e.target.value),placeholder:`Valvular flow velocities, gradients, diastolic filling pattern...`,readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,style:{alignItems:`flex-start`},children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,style:{marginTop:`8px`},children:`Conclusion :`}),(0,M.jsx)(`textarea`,{name:`conclusion`,className:`${j.textarea} ${Z?j.inputLocked:``}`,style:{height:`80px`},value:S.conclusion,onChange:e=>$(`conclusion`,e.target.value),placeholder:`Clinical impression and summary...`,readOnly:Z})]})]}),(0,M.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,M.jsxs)(`div`,{className:j.measurementSubGrid,style:{gridTemplateColumns:`170px 1fr`},children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`LV. Compliance :`}),(0,M.jsx)(`input`,{type:`text`,name:`lvCompliance`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.lvCompliance,onChange:e=>$(`lvCompliance`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,style:{gridTemplateColumns:`170px 1fr`},children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`TVI :`}),(0,M.jsx)(`input`,{type:`text`,name:`tvi`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.tvi,onChange:e=>$(`tvi`,e.target.value),placeholder:`Time Velocity Integral`,readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,style:{gridTemplateColumns:`170px 1fr`},children:[(0,M.jsxs)(`label`,{className:`${j.label} ${j.labelRight}`,children:[`Left Aortic arch / PDA /`,(0,M.jsx)(`br`,{}),`Coarctation :`]}),(0,M.jsx)(`input`,{type:`text`,name:`leftAorticArchPdaCoarctation`,className:`${j.input} ${Z?j.inputLocked:``}`,value:S.leftAorticArchPdaCoarctation,onChange:e=>$(`leftAorticArchPdaCoarctation`,e.target.value),readOnly:Z})]}),(0,M.jsxs)(`div`,{className:j.measurementSubGrid,style:{gridTemplateColumns:`170px 1fr`},children:[(0,M.jsx)(`label`,{className:`${j.label} ${j.labelRight}`,children:`Consultant Dr. :`}),(0,M.jsxs)(`div`,{style:{display:`flex`,gap:`6px`,width:`100%`},children:[(0,M.jsx)(`input`,{type:`text`,name:`consultantDr`,className:`${j.input} ${j.wFull} ${Z?j.inputLocked:``}`,value:S.consultantDr,onChange:e=>$(`consultantDr`,e.target.value),placeholder:`Doctor Name`,readOnly:Z,list:`echo-doctors-list`}),(0,M.jsx)(`datalist`,{id:`echo-doctors-list`,children:he.map(e=>(0,M.jsx)(`option`,{value:`${e.title} ${e.drName}`,children:e.speciality?`(${e.speciality})`:``},e.id))})]})]})]})]})]})]}),(0,M.jsxs)(`footer`,{className:j.actionBar,children:[(0,M.jsxs)(`div`,{className:j.navControls,children:[(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,onClick:Ie,disabled:T.length===0||O===0,title:`First Record`,"aria-label":`First Record`,children:(0,M.jsx)(n,{size:18})}),(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,onClick:Le,disabled:T.length===0||O<=0,title:`Previous Record`,"aria-label":`Previous Record`,children:(0,M.jsx)(t,{size:18})}),(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,onClick:Re,disabled:T.length===0||O>=T.length-1,title:`Next Record`,"aria-label":`Next Record`,children:(0,M.jsx)(ae,{size:18})}),(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,onClick:ze,disabled:T.length===0||O===T.length-1,title:`Last Record`,"aria-label":`Last Record`,children:(0,M.jsx)(r,{size:18})})]}),(0,M.jsxs)(`div`,{className:j.middleActions,children:[(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnPrimary}`,onClick:Me,disabled:!S.uhid,title:`Open dedicated print page matching reference standard`,children:[(0,M.jsx)(p,{size:16}),` PRINT`]}),(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>K(!0),disabled:!S.uhid,title:`Preview formatted A4 report`,children:[(0,M.jsx)(re,{size:15}),` Preview`]}),(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:Ne,disabled:!S.uhid,title:`Download report as PDF file`,children:[(0,M.jsx)(l,{size:15}),` Export PDF`]}),(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>V(!0),title:`Search past Echo Reports`,children:`Perticular Search`}),(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>z(!0),title:`Quick Patient Search`,children:[(0,M.jsx)(h,{size:16}),` Patient`]}),(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:Pe,title:`Clear form fields`,children:[(0,M.jsx)(m,{size:15}),` Clear`]})]}),(0,M.jsxs)(`div`,{className:j.rightActions,children:[(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:Be,disabled:I,children:[(0,M.jsx)(f,{size:16}),` Add (New)`]}),(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnPrimary}`,onClick:He,disabled:I||Z&&!A,children:[(0,M.jsx)(ee,{size:16}),` `,_?`Update (Save)`:`Save Draft`]}),S.status!==`Finalized`&&(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnSuccess}`,onClick:()=>q(!0),disabled:I||!S.uhid,children:[(0,M.jsx)(u,{size:15}),` Finalize`]}),(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnDanger}`,onClick:()=>J(!0),disabled:I||!_,children:[(0,M.jsx)(g,{size:16}),` Delete`]}),(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>e(`/patient-registration`),style:{marginLeft:`4px`},children:[(0,M.jsx)(ne,{size:16}),` Exit`]})]})]}),ye&&(0,M.jsx)(`div`,{className:j.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,M.jsxs)(`div`,{className:j.modalContent,style:{maxWidth:`750px`},children:[(0,M.jsxs)(`div`,{className:j.modalHeader,children:[(0,M.jsxs)(`h2`,{className:j.modalTitle,children:[(0,M.jsx)(x,{size:20,color:`var(--primary)`}),`Select Existing Patient`]}),(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>z(!1),children:(0,M.jsx)(v,{size:18})})]}),(0,M.jsxs)(`div`,{className:j.modalBody,children:[(0,M.jsx)(`div`,{style:{marginBottom:`14px`},children:(0,M.jsx)(`input`,{type:`text`,className:j.input,style:{width:`100%`,height:`40px`,fontSize:`14px`},placeholder:`Search patient by Name, UHID, or Mobile Number...`,value:B,onChange:e=>be(e.target.value),autoFocus:!0})}),(0,M.jsx)(`div`,{style:{maxHeight:`380px`,overflowY:`auto`},children:(0,M.jsxs)(`table`,{className:j.dataTable,children:[(0,M.jsx)(`thead`,{children:(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`th`,{children:`UHID`}),(0,M.jsx)(`th`,{children:`Patient Name`}),(0,M.jsx)(`th`,{children:`Age / Sex`}),(0,M.jsx)(`th`,{children:`Mobile`}),(0,M.jsx)(`th`,{children:`Doctor`}),(0,M.jsx)(`th`,{children:`Action`})]})}),(0,M.jsx)(`tbody`,{children:Ke.length===0?(0,M.jsx)(`tr`,{children:(0,M.jsx)(`td`,{colSpan:6,style:{textAlign:`center`,padding:`24px`,color:`var(--text-muted)`},children:`No matching patients found.`})}):Ke.map(e=>{let t=[e.firstName,e.middleName,e.lastName].filter(Boolean).join(` `);return(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{style:{fontWeight:700,color:`var(--primary)`},children:e.uhid}),(0,M.jsx)(`td`,{style:{fontWeight:600},children:t}),(0,M.jsxs)(`td`,{children:[e.age,` yrs / `,e.sex]}),(0,M.jsx)(`td`,{children:e.mobile}),(0,M.jsx)(`td`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:e.hospitalDoctor||e.referenceBy||`--`}),(0,M.jsx)(`td`,{children:(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnPrimary}`,style:{height:`28px`,fontSize:`12px`,padding:`0 10px`},onClick:()=>Ve(e),children:`Select`})})]},e.uhid)})})]})})]}),(0,M.jsx)(`div`,{className:j.modalFooter,children:(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>z(!1),children:`Cancel`})})]})}),xe&&(0,M.jsx)(`div`,{className:j.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,M.jsxs)(`div`,{className:j.modalContent,style:{maxWidth:`900px`},children:[(0,M.jsxs)(`div`,{className:j.modalHeader,children:[(0,M.jsxs)(`h2`,{className:j.modalTitle,children:[(0,M.jsx)(h,{size:20,color:`var(--primary)`}),`Perticular Search — Echo Report Directory`]}),(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>V(!1),children:(0,M.jsx)(v,{size:18})})]}),(0,M.jsxs)(`div`,{className:j.modalBody,children:[(0,M.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,marginBottom:`14px`,flexWrap:`wrap`},children:[(0,M.jsx)(`input`,{type:`text`,className:j.input,style:{flex:`1 1 200px`},placeholder:`Search by Report ID, UHID, Patient Name, or Findings...`,value:H,onChange:e=>Se(e.target.value),autoFocus:!0}),(0,M.jsxs)(`select`,{className:j.input,style:{width:`130px`},value:U,onChange:e=>Ce(e.target.value),children:[(0,M.jsx)(`option`,{value:`All`,children:`All Status`}),(0,M.jsx)(`option`,{value:`Draft`,children:`Draft Only`}),(0,M.jsx)(`option`,{value:`Finalized`,children:`Finalized Only`})]}),(0,M.jsxs)(`select`,{className:j.input,style:{width:`180px`},value:W,onChange:e=>we(e.target.value),children:[(0,M.jsx)(`option`,{value:`All`,children:`All Doctors`}),he.map(e=>(0,M.jsxs)(`option`,{value:e.drName,children:[e.title,` `,e.drName]},e.id))]})]}),(0,M.jsx)(`div`,{style:{maxHeight:`400px`,overflowY:`auto`},children:(0,M.jsxs)(`table`,{className:j.dataTable,children:[(0,M.jsx)(`thead`,{children:(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`th`,{children:`Report ID`}),(0,M.jsx)(`th`,{children:`Date`}),(0,M.jsx)(`th`,{children:`Patient (UHID)`}),(0,M.jsx)(`th`,{children:`LVEF`}),(0,M.jsx)(`th`,{children:`Consultant Dr.`}),(0,M.jsx)(`th`,{children:`Status`}),(0,M.jsx)(`th`,{children:`Action`})]})}),(0,M.jsx)(`tbody`,{children:qe.length===0?(0,M.jsx)(`tr`,{children:(0,M.jsx)(`td`,{colSpan:7,style:{textAlign:`center`,padding:`24px`,color:`var(--text-muted)`},children:`No echo reports match your search criteria.`})}):qe.map((e,t)=>(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{style:{fontWeight:700,color:`var(--primary)`},children:e.id}),(0,M.jsx)(`td`,{children:e.reportDate}),(0,M.jsxs)(`td`,{children:[(0,M.jsx)(`strong`,{children:e.patientName}),` `,(0,M.jsxs)(`span`,{style:{color:`var(--text-muted)`},children:[`(`,e.uhid,`)`]})]}),(0,M.jsx)(`td`,{style:{fontWeight:600},children:e.lvef||`--`}),(0,M.jsx)(`td`,{style:{fontSize:`12px`},children:e.consultantDr||`--`}),(0,M.jsx)(`td`,{children:e.status===`Finalized`?(0,M.jsxs)(`span`,{className:j.statusBadgeFinalized,style:{fontSize:`11px`,padding:`2px 8px`},children:[(0,M.jsx)(u,{size:10}),` Finalized`]}):(0,M.jsx)(`span`,{className:j.statusBadgeDraft,style:{fontSize:`11px`,padding:`2px 8px`},children:`Draft`})}),(0,M.jsx)(`td`,{children:(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnPrimary}`,style:{height:`28px`,fontSize:`12px`,padding:`0 10px`},onClick:()=>{Q(e,t),V(!1)},children:`Open`})})]},e.id))})]})})]}),(0,M.jsx)(`div`,{className:j.modalFooter,children:(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>V(!1),children:`Close`})})]})}),Te&&(0,M.jsx)(`div`,{className:j.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,M.jsxs)(`div`,{className:j.modalContent,style:{maxWidth:`700px`},children:[(0,M.jsxs)(`div`,{className:j.modalHeader,children:[(0,M.jsxs)(`h2`,{className:j.modalTitle,children:[(0,M.jsx)(ue,{size:20,color:`var(--primary)`}),`Load Findings from Report Template Master`]}),(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>G(!1),children:(0,M.jsx)(v,{size:18})})]}),(0,M.jsxs)(`div`,{className:j.modalBody,children:[(0,M.jsx)(`p`,{style:{fontSize:`13px`,color:`var(--text-muted)`,marginTop:0},children:`Select a standard echocardiography or cardiology report template from the Master database to populate Doppler Study and Conclusion:`}),(0,M.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`,maxHeight:`380px`,overflowY:`auto`},children:_e.map(e=>(0,M.jsxs)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:`6px`,padding:`12px 14px`,backgroundColor:`var(--surface)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`12px`},children:[(0,M.jsxs)(`div`,{children:[(0,M.jsx)(`div`,{style:{fontWeight:700,fontSize:`13.5px`,color:`var(--text-main)`},children:e.templateName}),(0,M.jsxs)(`div`,{style:{fontSize:`11.5px`,color:`var(--text-muted)`,marginTop:`2px`},children:[`Group: `,e.groupName,` • Dept: `,e.department||`Cardiology`]})]}),(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnPrimary}`,style:{height:`30px`,fontSize:`12px`},onClick:()=>Ge(e),children:`Insert Text`})]},e.id))})]}),(0,M.jsx)(`div`,{className:j.modalFooter,children:(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>G(!1),children:`Cancel`})})]})}),Ee&&(0,M.jsx)(`div`,{className:`${j.modalOverlay} ${j.printOverlayActive}`,role:`dialog`,"aria-modal":`true`,children:(0,M.jsxs)(`div`,{className:j.modalContent,style:{maxWidth:`860px`,maxHeight:`95vh`},children:[(0,M.jsxs)(`div`,{className:j.modalHeader,children:[(0,M.jsxs)(`h2`,{className:j.modalTitle,children:[(0,M.jsx)(p,{size:18,color:`var(--primary)`}),`Printable Echo Report Preview (A4 Standard)`]}),(0,M.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnPrimary}`,onClick:Me,children:[(0,M.jsx)(p,{size:15}),` Open Dedicated Print Tab`]}),(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>K(!1),children:(0,M.jsx)(v,{size:18})})]})]}),(0,M.jsx)(`div`,{className:j.modalBody,style:{backgroundColor:`#f1f5f9`,padding:`16px`},children:(0,M.jsxs)(`div`,{className:j.printContainer,id:`printable-echo-report`,children:[(0,M.jsxs)(`header`,{className:j.printHeader,children:[(0,M.jsx)(`h1`,{className:j.printHospitalName,children:b.name}),(0,M.jsxs)(`p`,{className:j.printHospitalInfo,children:[b.address,` | Phone: `,b.phone,` | Email: `,b.email]}),(0,M.jsx)(`div`,{className:j.printTitleBanner,children:`2D TRANSTHORACIC ECHOCARDIOGRAPHY & COLOR DOPPLER REPORT`})]}),(0,M.jsxs)(`section`,{className:j.printPatientGrid,"aria-label":`Patient details`,children:[(0,M.jsxs)(`div`,{className:j.printPatientRow,children:[(0,M.jsx)(`span`,{className:j.printPatientLabel,children:`Patient Name:`}),(0,M.jsx)(`span`,{className:j.printPatientVal,children:S.patientName||`--`})]}),(0,M.jsxs)(`div`,{className:j.printPatientRow,children:[(0,M.jsx)(`span`,{className:j.printPatientLabel,children:`Report Date:`}),(0,M.jsx)(`span`,{className:j.printPatientVal,children:S.reportDate})]}),(0,M.jsxs)(`div`,{className:j.printPatientRow,children:[(0,M.jsx)(`span`,{className:j.printPatientLabel,children:`UHID / Pt.Code:`}),(0,M.jsx)(`span`,{className:j.printPatientVal,children:S.uhid||`--`})]}),(0,M.jsxs)(`div`,{className:j.printPatientRow,children:[(0,M.jsx)(`span`,{className:j.printPatientLabel,children:`Age / Sex:`}),(0,M.jsxs)(`span`,{className:j.printPatientVal,children:[S.age,` Yrs / `,S.sex]})]}),(0,M.jsxs)(`div`,{className:j.printPatientRow,children:[(0,M.jsx)(`span`,{className:j.printPatientLabel,children:`Referred By:`}),(0,M.jsx)(`span`,{className:j.printPatientVal,children:S.referredBy||`Self / Consultant`})]}),(0,M.jsxs)(`div`,{className:j.printPatientRow,children:[(0,M.jsx)(`span`,{className:j.printPatientLabel,children:`Consultant:`}),(0,M.jsx)(`span`,{className:j.printPatientVal,children:S.consultantDr||`Dr. Nilesh Mahale`})]}),S.c_o&&(0,M.jsxs)(`div`,{className:j.printPatientRow,style:{gridColumn:`span 2`},children:[(0,M.jsx)(`span`,{className:j.printPatientLabel,children:`Clinical Indication (C/O):`}),(0,M.jsx)(`span`,{className:j.printPatientVal,children:S.c_o})]})]}),(0,M.jsxs)(`table`,{className:j.printTable,"aria-label":`Anatomical dimensions`,children:[(0,M.jsx)(`thead`,{children:(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`th`,{style:{width:`30%`},children:`Cardiac Structure / Parameter`}),(0,M.jsx)(`th`,{style:{width:`40%`},children:`Observed Finding`}),(0,M.jsx)(`th`,{style:{width:`30%`},children:`Reference / Notes`})]})}),(0,M.jsxs)(`tbody`,{children:[(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:(0,M.jsx)(`strong`,{children:`Left Ventricular Function (LVEF)`})}),(0,M.jsx)(`td`,{children:(0,M.jsx)(`strong`,{children:S.lvef||`--`})}),(0,M.jsx)(`td`,{children:`Normal: 55% - 70%`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`Mitral Valve`}),(0,M.jsx)(`td`,{children:S.mitralValve||`Normal morphology`}),(0,M.jsx)(`td`,{children:`Leaflets, subvalvular apparatus`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`Aortic Valve & Aorta`}),(0,M.jsxs)(`td`,{children:[S.aorticValve||`Trileaflet`,` • Aorta: `,S.aorta||`Normal`]}),(0,M.jsx)(`td`,{children:`No significant stenosis / regurgitation`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`Tricuspid Valve & RVSP`}),(0,M.jsxs)(`td`,{children:[S.tricuspidValve||`Normal`,` • RVSP: `,S.rvsp||`Normal`]}),(0,M.jsx)(`td`,{children:`PASP estimation`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`Pulmonary Valve`}),(0,M.jsx)(`td`,{children:S.pulmonaryValve||`Normal`}),(0,M.jsx)(`td`,{children:`Flow velocity`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`Atrial Dimensions`}),(0,M.jsxs)(`td`,{children:[`LA: `,S.leftAtrium||`Normal`,` • RA: `,S.rightAtrium||`Normal`]}),(0,M.jsx)(`td`,{children:`Chamber cavity size`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`Right Ventricle & IVC`}),(0,M.jsxs)(`td`,{children:[`RV: `,S.rightVentricle||`Normal`,` • IVC: `,S.ivc||`Normal`]}),(0,M.jsx)(`td`,{children:`Respiratory collapsibility`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`Septum & Posterior Wall`}),(0,M.jsxs)(`td`,{children:[`IVS: `,S.ivs||`--`,` (`,S.septum||`--`,` mm) • P.Wall: `,S.pWall||`--`,` mm`]}),(0,M.jsx)(`td`,{children:`Wall thickness`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`LV Internal Dimensions`}),(0,M.jsxs)(`td`,{children:[`LVIDd: `,S.lvidd||`--`,` mm • LVIDs: `,S.lvids||`--`,` mm`]}),(0,M.jsx)(`td`,{children:`End-diastole / End-systole`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`RWMA`}),(0,M.jsx)(`td`,{children:S.rwma||`No regional wall motion abnormality at rest`}),(0,M.jsx)(`td`,{children:`Segmental wall motion`})]}),(0,M.jsxs)(`tr`,{children:[(0,M.jsx)(`td`,{children:`Pericardium`}),(0,M.jsx)(`td`,{children:S.pericardium||`Normal, no effusion`}),(0,M.jsx)(`td`,{children:`Pericardial space`})]})]})]}),S.dopplerStudy&&(0,M.jsxs)(`div`,{className:j.printBox,children:[(0,M.jsx)(`div`,{className:j.printBoxTitle,children:`Color Doppler Study & Hemodynamics`}),(0,M.jsx)(`div`,{className:j.printBoxContent,children:S.dopplerStudy})]}),(0,M.jsxs)(`div`,{className:j.printBox,style:{border:`2px solid #0f172a`},children:[(0,M.jsx)(`div`,{className:j.printBoxTitle,children:`Conclusion / Impression`}),(0,M.jsx)(`div`,{className:j.printBoxContent,style:{fontWeight:600},children:S.conclusion||`Normal 2D Transthoracic Echocardiogram. Preserved LV systolic function.`})]}),(0,M.jsxs)(`footer`,{className:j.printFooterSign,children:[(0,M.jsx)(`div`,{children:(0,M.jsxs)(`div`,{style:{fontSize:`11px`,color:`#64748b`},children:[`Report Status: `,(0,M.jsx)(`strong`,{children:S.status.toUpperCase()}),S.finalizedAt&&` • Finalized on ${new Date(S.finalizedAt).toLocaleString()}`]})}),(0,M.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,M.jsx)(`div`,{style:{borderBottom:`1px solid #0f172a`,width:`200px`,marginBottom:`6px`}}),(0,M.jsx)(`strong`,{style:{fontSize:`13px`},children:S.consultantDr||`Consultant Cardiologist`}),(0,M.jsx)(`div`,{style:{fontSize:`11px`,color:`#475569`},children:`Reporting Consultant / Cardiologist`})]})]})]})}),(0,M.jsxs)(`div`,{className:j.modalFooter,children:[(0,M.jsxs)(`button`,{type:`button`,className:`${j.btn} ${j.btnPrimary}`,onClick:()=>window.print(),children:[(0,M.jsx)(p,{size:15}),` Print`]}),(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>K(!1),children:`Close Preview`})]})]})}),De&&(0,M.jsx)(`div`,{className:j.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,M.jsxs)(`div`,{className:j.modalContent,style:{maxWidth:`480px`},children:[(0,M.jsxs)(`div`,{className:j.modalHeader,children:[(0,M.jsxs)(`h2`,{className:j.modalTitle,style:{color:`#059669`},children:[(0,M.jsx)(u,{size:18}),` Finalize Echo Report`]}),(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>q(!1),children:(0,M.jsx)(v,{size:18})})]}),(0,M.jsxs)(`div`,{className:j.modalBody,children:[(0,M.jsxs)(`p`,{style:{fontSize:`14px`,lineHeight:1.5,color:`var(--text-main)`,marginTop:0},children:[`Are you sure you want to finalize this Echo Report for `,(0,M.jsx)(`strong`,{children:S.patientName}),` (`,S.uhid,`)?`]}),(0,M.jsx)(`div`,{style:{backgroundColor:`rgba(16, 185, 129, 0.08)`,border:`1px solid rgba(16, 185, 129, 0.3)`,padding:`10px 14px`,borderRadius:`6px`,fontSize:`12.5px`,color:`#065f46`},children:`Once finalized, findings become authoritative clinical documentation and will be protected from accidental modification.`})]}),(0,M.jsxs)(`div`,{className:j.modalFooter,children:[(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>q(!1),disabled:I,children:`Cancel`}),(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnSuccess}`,onClick:Ue,disabled:I,children:I?`Finalizing...`:`Yes, Finalize Report`})]})]})}),Oe&&(0,M.jsx)(`div`,{className:j.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,M.jsxs)(`div`,{className:j.modalContent,style:{maxWidth:`460px`},children:[(0,M.jsxs)(`div`,{className:j.modalHeader,children:[(0,M.jsxs)(`h2`,{className:j.modalTitle,style:{color:`var(--danger)`},children:[(0,M.jsx)(g,{size:18}),` Delete Echo Report`]}),(0,M.jsx)(`button`,{type:`button`,className:j.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>J(!1),children:(0,M.jsx)(v,{size:18})})]}),(0,M.jsxs)(`div`,{className:j.modalBody,children:[(0,M.jsxs)(`p`,{style:{fontSize:`14px`,lineHeight:1.5,color:`var(--text-main)`,marginTop:0},children:[`Are you sure you want to permanently delete Echo Report `,(0,M.jsx)(`strong`,{children:_}),` for patient `,(0,M.jsx)(`strong`,{children:S.patientName}),`?`]}),(0,M.jsx)(`p`,{style:{fontSize:`12.5px`,color:`var(--danger)`,margin:0},children:`This action cannot be undone.`})]}),(0,M.jsxs)(`div`,{className:j.modalFooter,children:[(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnSecondary}`,onClick:()=>J(!1),disabled:I,children:`Cancel`}),(0,M.jsx)(`button`,{type:`button`,className:`${j.btn} ${j.btnDanger}`,onClick:We,disabled:I,children:I?`Deleting...`:`Delete Permanently`})]})]})})]})};export{P as EchoReport,P as default};