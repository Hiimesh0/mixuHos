import{r as e}from"./rolldown-runtime-hePW80VL.js";import{t}from"./chevron-left-BXDrPa19.js";import{n,t as r}from"./chevrons-right-CrFLzPBX.js";import{i,r as a,t as o}from"./masterApi-Ds8m6_Ub.js";import{t as s}from"./circle-check-DkuuuLjl.js";import{t as c}from"./download-DIborEAc.js";import{t as l}from"./lock-DaOy9Anr.js";import{t as u}from"./pen-1cD6CspD.js";import{t as d}from"./plus-D7RkcULz.js";import{t as f}from"./printer-CnOIgzd-.js";import{t as p}from"./rotate-ccw-CpCD9uwH.js";import{t as m}from"./save-D8uO-J4X.js";import{t as h}from"./search-WEBMsVgg.js";import{t as g}from"./trash-LyzLm6It.js";import{D as _,T as v,f as ee,h as te,i as y,k as b,m as ne,n as x,s as S,t as C,y as re}from"./index-CKlU7-BO.js";import{t as w}from"./jspdf.es.min-B4Z7Vpim.js";import{n as T,t as ie}from"./patientApi--5Vhzzwx.js";import{t as ae}from"./useAutoDismissNotification-CUewW0-b.js";import{n as oe,t as se}from"./useFormKeyboardNavigation-9BuBWvDe.js";var E={name:`lock-open`,size:24,node:[[`rect`,{width:`18`,height:`11`,x:`3`,y:`11`,rx:`2`,ry:`2`,key:`1w4ew1`}],[`path`,{d:`M7 11V7a5 5 0 0 1 9.9-1`,key:`1mm8w8`}]],aliases:[`unlock`]};E.node;var ce=v(E),D={name:`sparkles`,size:24,node:[[`path`,{d:`M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,key:`1s2grr`}],[`path`,{d:`M20 2v4`,key:`1rf3ol`}],[`path`,{d:`M22 4h-4`,key:`gwowj6`}],[`circle`,{cx:`4`,cy:`20`,r:`2`,key:`6kqj1y`}]],aliases:[`stars`]};D.node;var le=v(D),O=e(b(),1);function k(e){if(!e)return A(new Date);try{let t=new Date(e);return isNaN(t.getTime())?e:A(t)}catch{return e}}function A(e){return`${String(e.getDate()).padStart(2,`0`)}-${[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`][e.getMonth()]}-${e.getFullYear()}`}function j(e){let t=k(e.reportDate),n=e.patientName?e.patientName.replace(/^DEMO:\s*/i,``):`Patient`,r=e.age?`${e.age} Yrs`:`--`,i=e.sex||`--`,a=e.referredBy||`DR. SAJID SHAIKH`,o=e.lvef||`40 %`;o&&!o.includes(`%`)&&(o=`${o} %`);let s=e.rwma?e.rwma:`present`,c=e.rvsp||`45 mmHg`;c&&!c.toLowerCase().includes(`mmhg`)&&(c=`${c} mmHg`);let l=e.ivs||`Intact`,u=e.ias||`Intact`,d=e.septum?`${e.septum} mm`:`10 mm`,f=e.pWall?`${e.pWall} mm`:`10 mm`,p=e.lvidd?`${e.lvidd} mm`:`44 mm`,m=e.lvids?`${e.lvids} mm`:`28 mm`,h=e.pericardium||`Normal`,g=e.dopplerStudy||`Mild MR, Mild TR`,_=(e.conclusion||`Mild LV systolic dysfunction. LVEF: 40%
RWMA Present
Grade I LV Diastolic Dysfunction.
Normal Size Cardiac Chambers
Mild PH, PASP = 45mmHg
No e/o Clot/Vegetation/Pericardial Effusion
IVC Congested (1.9 cm) < 50% collapsing.`).replace(/^\[Sample Record\]\s*/i,``).split(`
`).map(e=>e.trim()).filter(Boolean),v=e.consultantDr||`Dr. Devang Desai`;return`<!DOCTYPE html>
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
          <span class="meas-val">${h}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 96px;">Doppler Study</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${g}</span>
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
        ${_[0]||`Mild LV systolic dysfunction. LVEF:40%`}
      </div>
      ${_.length>1?`
        <div class="conclusion-list">
          ${_.slice(1).map(e=>`<div class="conclusion-list-item">${e}</div>`).join(``)}
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
        <div class="doc-name">${v}</div>
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
</html>`}function ue(e){let t=window.open(`about:blank`,`_blank`);if(!t){alert(`Please allow popups for this site to open the Echo Report print preview.`);return}let n=j(e);t.document.open(),t.document.write(n),t.document.close()}function de(e){let t=new w({orientation:`portrait`,unit:`mm`,format:`a4`}),n=e.patientName?e.patientName.replace(/^DEMO:\s*/i,``):`Patient`,r=k(e.reportDate),i=e.referredBy||`DR. SAJID SHAIKH`,a=e.age?`${e.age} Yrs`:`--`,o=e.sex||`--`;t.setFont(`helvetica`,`bold`),t.setFontSize(10.5),t.text(`Name`,16,20),t.text(`:`,55,20),t.setFont(`helvetica`,`normal`),t.text(`${n} .`,60,20),t.setFont(`helvetica`,`bold`),t.text(`Age / Sex`,130,20),t.text(`:`,155,20),t.setFont(`helvetica`,`normal`),t.text(`${a} / ${o}`,160,20),t.setFont(`helvetica`,`bold`),t.text(`Referred By Dr.`,16,26),t.text(`:`,55,26),t.setFont(`helvetica`,`normal`),t.text(i,60,26),t.setFont(`helvetica`,`bold`),t.text(`Date`,130,26),t.text(`:`,155,26),t.setFont(`helvetica`,`normal`),t.text(r,160,26),t.setFont(`helvetica`,`bold`),t.setFontSize(14);let s=`2D Echo Report`,c=t.getTextWidth(s),l=(210-c)/2;t.text(s,l,38),t.line(l,39,l+c,39),t.setFontSize(9.5);let u=48;[[`Mitral Valve`,e.mitralValve||`Structurally Normal, Mild MR`],[`Aortic Valve`,e.aorticValve||`Structurally Normal`],[`Aorta`,e.aorta||`Normal Sized`],[`Tricuspid Valve`,e.tricuspidValve||`Structurally Normal, Mild TR`],[`Pulmonary Valve`,e.pulmonaryValve||`Structurally Normal`],[`Left Atrium`,e.leftAtrium||`Normal Sized`],[`Left Ventricle`,e.leftVentricle||`Normal Sized, basal inferoposterior wall hypokinetic`],[`Right Atrium`,e.rightAtrium||`Normal Sized`],[`Right Ventricle`,e.rightVentricle||`Normal Sized`]].forEach(([e,n])=>{t.setFont(`helvetica`,`bold`),t.text(e,16,u),t.text(`:`,55,u),t.setFont(`helvetica`,`normal`);let r=t.splitTextToSize(n,75);t.text(r,60,u),u+=Math.max(5.5,r.length*4.5)}),t.setFont(`helvetica`,`bold`),t.text(`LVEF`,140,52),t.text(`:`,165,52),t.setFont(`helvetica`,`bold`),t.text(e.lvef||`40 %`,170,52),t.text(`RWMA ${e.rwma||`present`}`,140,58),t.text(`PASP/RVSP`,140,80),t.text(`:`,168,80),t.text(e.rvsp||`45 mmHg`,172,80),u=Math.max(u,106)+4,t.setFontSize(9),t.setFont(`helvetica`,`bold`),t.text(`IVS`,16,u),t.text(`:`,40,u),t.setFont(`helvetica`,`normal`),t.text(e.ivs||`Intact`,43,u),t.setFont(`helvetica`,`bold`),t.text(`IAS`,16,u+5),t.text(`:`,40,u+5),t.setFont(`helvetica`,`normal`),t.text(e.ias||`Intact`,43,u+5),t.setFont(`helvetica`,`bold`),t.text(`Pericardium`,16,u+12),t.text(`:`,40,u+12),t.setFont(`helvetica`,`normal`),t.text(e.pericardium||`Normal`,43,u+12),t.setFont(`helvetica`,`bold`),t.text(`Doppler Study`,16,u+18),t.text(`:`,40,u+18),t.setFont(`helvetica`,`normal`),t.text(e.dopplerStudy||`Mild MR, Mild TR`,43,u+18),t.setFont(`helvetica`,`bold`),t.text(`IVSD`,85,u),t.text(`:`,102,u),t.setFont(`helvetica`,`normal`),t.text(e.septum?`${e.septum} mm`:`10 mm`,105,u),t.setFont(`helvetica`,`bold`),t.text(`PWD`,85,u+5),t.text(`:`,102,u+5),t.setFont(`helvetica`,`normal`),t.text(e.pWall?`${e.pWall} mm`:`10 mm`,105,u+5),t.setFont(`helvetica`,`bold`),t.text(`LVIDd`,140,u),t.text(`:`,160,u),t.setFont(`helvetica`,`normal`),t.text(e.lvidd?`${e.lvidd} mm`:`44 mm`,164,u),t.setFont(`helvetica`,`bold`),t.text(`LVIDs`,140,u+5),t.text(`:`,160,u+5),t.setFont(`helvetica`,`normal`),t.text(e.lvids?`${e.lvids} mm`:`28 mm`,164,u+5),t.setFont(`helvetica`,`bold`),t.text(`AV Max`,140,u+11),t.text(`:`,160,u+11),t.setFont(`helvetica`,`normal`),t.text(`1.2 m/Sec`,164,u+11),t.setFont(`helvetica`,`bold`),t.text(`PV Max`,140,u+16),t.text(`:`,160,u+16),t.setFont(`helvetica`,`normal`),t.text(`1.1 m/Sec`,164,u+16),t.setFont(`helvetica`,`bold`),t.text(`MV E/A`,140,u+21),t.text(`:`,160,u+21),t.setFont(`helvetica`,`normal`),t.text(`> 1`,164,u+21),u+=30,t.setFont(`helvetica`,`bold`),t.text(`Conclusion`,16,u),t.text(`:`,38,u),t.setFont(`helvetica`,`normal`);let d=(e.conclusion||`Mild LV systolic dysfunction. LVEF: 40%
RWMA Present
Grade I LV Diastolic Dysfunction.
Normal Size Cardiac Chambers
Mild PH, PASP = 45mmHg
No e/o Clot/Vegetation/Pericardial Effusion
IVC Congested (1.9 cm) < 50% collapsing.`).replace(/^\[Sample Record\]\s*/i,``).split(`
`).map(e=>e.trim()).filter(Boolean);if(d.length>0){t.text(d[0],42,u),u+=5.5;for(let e=1;e<d.length;e++)t.text(d[e],42,u),u+=5}u=Math.max(u+12,240),t.setFont(`helvetica`,`bold`),t.setFontSize(10),t.text(`Dr. Dharmil Patel`,16,u),t.setFont(`helvetica`,`normal`),t.setFontSize(8.5),t.text(`DNB (Cardiology) Interventional Cardiologist`,16,u+4.5),t.text(`(FULL TIME)`,16,u+8.5);let f=e.consultantDr||`Dr. Devang Desai`;t.setFont(`helvetica`,`bold`),t.setFontSize(10),t.text(f,135,u),t.setFont(`helvetica`,`normal`),t.setFontSize(8.5),t.text(`D.M.(Cardiology), M.D(MED.); FACC`,135,u+4.5),t.text(`INTERVENTIONAL CARDIOLOGIST`,135,u+8.5),t.setFontSize(8),t.setFont(`helvetica`,`normal`);let p=`"This Report is not valid for medico-legal purpose."`,m=`"Normal echocardiography does not rule out coronary artery disease."`;return t.text(p,(210-t.getTextWidth(p))/2,275),t.text(m,(210-t.getTextWidth(m))/2,280),t.output(`blob`)}var M={pageContainer:`_pageContainer_1ryr6_1`,header:`_header_1ryr6_15`,titleArea:`_titleArea_1ryr6_25`,pageTitle:`_pageTitle_1ryr6_31`,reportIdBadge:`_reportIdBadge_1ryr6_41`,statusBadgeDraft:`_statusBadgeDraft_1ryr6_51`,statusBadgeFinalized:`_statusBadgeFinalized_1ryr6_65`,alertSuccess:`_alertSuccess_1ryr6_80`,fadeIn:`_fadeIn_1ryr6_1`,alertError:`_alertError_1ryr6_93`,patientChip:`_patientChip_1ryr6_112`,formContainer:`_formContainer_1ryr6_126`,section:`_section_1ryr6_133`,sectionHeader:`_sectionHeader_1ryr6_144`,sectionTitle:`_sectionTitle_1ryr6_153`,row:`_row_1ryr6_164`,fieldGroup:`_fieldGroup_1ryr6_171`,label:`_label_1ryr6_177`,labelRight:`_labelRight_1ryr6_184`,input:`_input_1ryr6_190`,inputReadOnly:`_inputReadOnly_1ryr6_208`,inputLocked:`_inputLocked_1ryr6_214`,textarea:`_textarea_1ryr6_221`,measurementGrid:`_measurementGrid_1ryr6_242`,measurementSubGrid:`_measurementSubGrid_1ryr6_248`,complexRow:`_complexRow_1ryr6_255`,unit:`_unit_1ryr6_262`,wSmall:`_wSmall_1ryr6_270`,wMedium:`_wMedium_1ryr6_271`,wLarge:`_wLarge_1ryr6_272`,wFull:`_wFull_1ryr6_273`,splitSection:`_splitSection_1ryr6_276`,templateBtn:`_templateBtn_1ryr6_283`,actionBar:`_actionBar_1ryr6_304`,navControls:`_navControls_1ryr6_318`,navBtn:`_navBtn_1ryr6_324`,middleActions:`_middleActions_1ryr6_349`,rightActions:`_rightActions_1ryr6_356`,btn:`_btn_1ryr6_364`,btnPrimary:`_btnPrimary_1ryr6_379`,btnSecondary:`_btnSecondary_1ryr6_390`,btnSuccess:`_btnSuccess_1ryr6_401`,btnDanger:`_btnDanger_1ryr6_412`,btnWarning:`_btnWarning_1ryr6_423`,modalOverlay:`_modalOverlay_1ryr6_439`,modalContent:`_modalContent_1ryr6_452`,modalHeader:`_modalHeader_1ryr6_465`,modalTitle:`_modalTitle_1ryr6_474`,modalBody:`_modalBody_1ryr6_484`,modalFooter:`_modalFooter_1ryr6_490`,dataTable:`_dataTable_1ryr6_500`,printContainer:`_printContainer_1ryr6_527`,printHeader:`_printHeader_1ryr6_538`,printHospitalName:`_printHospitalName_1ryr6_545`,printHospitalInfo:`_printHospitalInfo_1ryr6_554`,printTitleBanner:`_printTitleBanner_1ryr6_561`,printPatientGrid:`_printPatientGrid_1ryr6_574`,printPatientRow:`_printPatientRow_1ryr6_586`,printPatientLabel:`_printPatientLabel_1ryr6_591`,printPatientVal:`_printPatientVal_1ryr6_596`,printTable:`_printTable_1ryr6_601`,printBox:`_printBox_1ryr6_622`,printBoxTitle:`_printBoxTitle_1ryr6_629`,printBoxContent:`_printBoxContent_1ryr6_638`,printFooterSign:`_printFooterSign_1ryr6_645`,printOverlayActive:`_printOverlayActive_1ryr6_672`},N=C(),P={uhid:``,patientName:``,age:``,sex:``,reportDate:new Date().toISOString().split(`T`)[0],referredBy:``,c_o:``,mitralValve:``,tricuspidValve:``,aorta:``,leftVentricle:``,rwma:``,rightVentricle:``,ivc:``,aorticValve:``,pulmonaryValve:``,lvef:``,leftAtrium:``,rightAtrium:``,rvsp:``,ivs:``,septum:``,lvidd:``,ias:``,pWall:``,lvids:``,pericardium:``,dopplerStudy:``,conclusion:``,lvCompliance:``,tvi:``,leftAorticArchPdaCoarctation:``,consultantDr:``,status:`Draft`,finalizedAt:null,finalizedBy:null},F=()=>{let e=_(),[v,b]=(0,O.useState)(null),[C,w]=(0,O.useState)(P),[E,D]=(0,O.useState)([]),[k,A]=(0,O.useState)(-1),[j,F]=(0,O.useState)(!1),[fe,pe]=(0,O.useState)(!0),[I,L]=(0,O.useState)(!1),[R,me]=(0,O.useState)([]),[he,ge]=(0,O.useState)([]),[_e,ve]=(0,O.useState)([]),[ye,z]=(0,O.useState)(!1),[B,be]=(0,O.useState)(``),[xe,V]=(0,O.useState)(!1),[H,Se]=(0,O.useState)(``),[U,Ce]=(0,O.useState)(`All`),[W,we]=(0,O.useState)(`All`),[Te,G]=(0,O.useState)(!1),[Ee,K]=(0,O.useState)(!1),[De,q]=(0,O.useState)(!1),[Oe,J]=(0,O.useState)(!1),{notification:Y,setNotification:X,dismissNotification:ke}=ae(),{formRef:Ae,handleKeyDown:je}=oe({fieldOrder:se}),Me=()=>{if(!C.uhid){X({type:`error`,message:`Please select or enter a patient before printing.`});return}ue({id:v||`ECHO-PRINT`,...C})},Ne=()=>{if(!C.uhid){X({type:`error`,message:`Please select or enter a patient before exporting PDF.`});return}try{let e=de({id:v||`ECHO-PRINT`,...C}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`Echo_Report_${C.uhid||`patient`}_${C.reportDate||`date`}.pdf`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(t),X({type:`success`,message:`PDF downloaded successfully.`})}catch{X({type:`error`,message:`Failed to generate PDF.`})}},Pe=()=>{window.confirm(`Clear all fields on this Echo Report? Any unsaved edits will be discarded.`)&&(w(P),b(null),A(-1),F(!1),X({type:`success`,message:`Form cleared.`}))},Z=C.status===`Finalized`&&!j,Q=(0,O.useCallback)((e,t=-1)=>{b(e.id),w({uhid:e.uhid||``,patientName:e.patientName||``,age:e.age||``,sex:e.sex||``,reportDate:e.reportDate||``,referredBy:e.referredBy||``,c_o:e.c_o||``,mitralValve:e.mitralValve||``,tricuspidValve:e.tricuspidValve||``,aorta:e.aorta||``,leftVentricle:e.leftVentricle||``,rwma:e.rwma||``,rightVentricle:e.rightVentricle||``,ivc:e.ivc||``,aorticValve:e.aorticValve||``,pulmonaryValve:e.pulmonaryValve||``,lvef:e.lvef||``,leftAtrium:e.leftAtrium||``,rightAtrium:e.rightAtrium||``,rvsp:e.rvsp||``,ivs:e.ivs||``,septum:e.septum||``,lvidd:e.lvidd||``,ias:e.ias||``,pWall:e.pWall||``,lvids:e.lvids||``,pericardium:e.pericardium||``,dopplerStudy:e.dopplerStudy||``,conclusion:e.conclusion||``,lvCompliance:e.lvCompliance||``,tvi:e.tvi||``,leftAorticArchPdaCoarctation:e.leftAorticArchPdaCoarctation||``,consultantDr:e.consultantDr||``,status:e.status||`Draft`,finalizedAt:e.finalizedAt||null,finalizedBy:e.finalizedBy||null}),F(!1),t>=0&&A(t)},[]),Fe=(0,O.useCallback)(async()=>{try{pe(!0);let[e,t,n,r]=await Promise.all([T.getReports().catch(()=>({success:!0,count:0,reports:[]})),ie.getPatients().catch(()=>({success:!0,count:0,patients:[]})),o.getDoctors().catch(()=>({success:!0,count:0,doctors:[]})),(a.getReportTemplates?a.getReportTemplates():a.getTemplates()).catch(()=>({success:!0,count:0,templates:[]}))]),i=e.reports||[];D(i),me(t.patients||[]),ge(n.doctors||[]),ve(r.templates||[]),i.length>0&&Q(i[0],0)}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to load initial data.`})}finally{pe(!1)}},[Q,X]);(0,O.useEffect)(()=>{Fe()},[Fe]);let Ie=()=>{E.length>0&&Q(E[0],0)},Le=()=>{if(k>0){let e=k-1;Q(E[e],e)}},Re=()=>{if(k<E.length-1){let e=k+1;Q(E[e],e)}},ze=()=>{if(E.length>0){let e=E.length-1;Q(E[e],e)}},$=(e,t)=>{Z||w(n=>({...n,[e]:t}))},Be=()=>{b(null),A(-1),F(!1),w({...P,reportDate:new Date().toISOString().split(`T`)[0]}),X({type:`success`,message:`New Echo Report form ready. Please select a patient.`})},Ve=e=>{let t=[e.firstName,e.middleName,e.lastName].filter(Boolean).join(` `).trim();w(n=>({...n,uhid:e.uhid,patientName:t||e.firstName,age:e.age,sex:e.sex,referredBy:e.referenceBy||n.referredBy,consultantDr:e.hospitalDoctor||n.consultantDr})),z(!1),X({type:`success`,message:`Patient ${e.uhid} (${t}) loaded.`})},He=async()=>{if(!C.uhid){X({type:`error`,message:`Patient is required. Please search and select an existing patient.`}),z(!0);return}try{if(L(!0),v){let e=await T.updateReport(v,{...C,status:`Draft`},j);X({type:`success`,message:e.message||`Echo report '${v}' saved as Draft.`}),Q(e.report,k)}else{let e=await T.createReport({...C,status:`Draft`});X({type:`success`,message:e.message||`Echo report '${e.report.id}' created as Draft.`});let t=await T.getReports();D(t.reports),Q(e.report,0)}F(!1)}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to save Echo Report.`})}finally{L(!1)}},Ue=async()=>{if(!v){if(!C.uhid){X({type:`error`,message:`Patient selection is required before finalizing report.`});return}try{L(!0);let e=await T.createReport({...C,status:`Draft`}),t=await T.finalizeReport(e.report.id,C.consultantDr||`Consultant Physician`);X({type:`success`,message:`Echo report '${t.report.id}' finalized and locked.`});let n=await T.getReports();D(n.reports),Q(t.report,0)}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to finalize report.`})}finally{L(!1),q(!1)}return}try{L(!0),await T.updateReport(v,C,!0);let e=await T.finalizeReport(v,C.consultantDr||`Consultant Physician`);X({type:`success`,message:e.message||`Echo report '${v}' finalized and locked.`});let t=await T.getReports();D(t.reports),Q(e.report,k)}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to finalize report.`})}finally{L(!1),q(!1)}},We=async()=>{if(v)try{L(!0),await T.deleteReport(v),X({type:`success`,message:`Echo report '${v}' deleted successfully.`});let e=await T.getReports();D(e.reports),e.reports.length>0?Q(e.reports[0],0):Be()}catch(e){X({type:`error`,message:e instanceof Error?e.message:`Failed to delete Echo Report.`})}finally{L(!1),J(!1)}},Ge=e=>{w(t=>({...t,dopplerStudy:t.dopplerStudy?`${t.dopplerStudy}\n\n${e.details}`:e.details,conclusion:t.conclusion?t.conclusion:`Study consistent with findings from ${e.templateName}.`})),G(!1),X({type:`success`,message:`Template '${e.templateName}' loaded into Doppler Study.`})},Ke=(0,O.useMemo)(()=>{if(!B.trim())return R.slice(0,20);let e=B.toLowerCase();return R.filter(t=>t.uhid.toLowerCase().includes(e)||t.firstName.toLowerCase().includes(e)||t.lastName.toLowerCase().includes(e)||t.mobile.includes(e))},[R,B]),qe=(0,O.useMemo)(()=>{let e=E;if(U!==`All`&&(e=e.filter(e=>e.status.toLowerCase()===U.toLowerCase())),W!==`All`&&(e=e.filter(e=>e.consultantDr?.toLowerCase().includes(W.toLowerCase()))),H.trim()){let t=H.toLowerCase();e=e.filter(e=>e.id.toLowerCase().includes(t)||e.uhid.toLowerCase().includes(t)||e.patientName.toLowerCase().includes(t)||e.consultantDr.toLowerCase().includes(t)||e.conclusion.toLowerCase().includes(t))}return e},[E,U,W,H]);return(0,N.jsxs)(`div`,{className:M.pageContainer,children:[(0,N.jsxs)(`header`,{className:M.header,children:[(0,N.jsxs)(`div`,{className:M.titleArea,children:[(0,N.jsxs)(`h1`,{className:M.pageTitle,children:[(0,N.jsx)(ne,{size:24,color:`var(--primary)`,"aria-hidden":`true`}),`Echo Report`]}),v&&(0,N.jsx)(`span`,{className:M.reportIdBadge,children:v}),fe&&(0,N.jsx)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:`Loading...`}),C.status===`Finalized`?(0,N.jsxs)(`span`,{className:M.statusBadgeFinalized,title:`Finalized clinical document`,children:[(0,N.jsx)(l,{size:12}),` Finalized`]}):(0,N.jsxs)(`span`,{className:M.statusBadgeDraft,title:`Draft - editable`,children:[(0,N.jsx)(u,{size:12}),` Draft`]})]}),C.uhid&&(0,N.jsxs)(`div`,{className:M.patientChip,children:[(0,N.jsx)(S,{size:16}),(0,N.jsxs)(`span`,{children:[C.patientName,` (`,C.uhid,`) • `,C.age||`--`,` yrs / `,C.sex||`--`]}),(0,N.jsx)(`button`,{type:`button`,className:M.templateBtn,onClick:()=>z(!0),title:`Change patient`,children:`Change`})]})]}),Y&&(0,N.jsxs)(`div`,{className:Y.type===`success`?M.alertSuccess:M.alertError,role:`alert`,children:[(0,N.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[Y.type===`success`?(0,N.jsx)(s,{size:18}):(0,N.jsx)(i,{size:18}),(0,N.jsx)(`span`,{children:Y.message})]}),(0,N.jsx)(`button`,{type:`button`,onClick:ke,style:{background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},"aria-label":`Dismiss notification`,children:(0,N.jsx)(y,{size:16})})]}),C.status===`Finalized`&&(0,N.jsxs)(`div`,{style:{backgroundColor:j?`rgba(217, 119, 6, 0.1)`:`rgba(16, 185, 129, 0.08)`,border:j?`1px solid rgba(217, 119, 6, 0.3)`:`1px solid rgba(16, 185, 129, 0.3)`,padding:`8px 16px`,borderRadius:`6px`,fontSize:`13px`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`12px`,flexWrap:`wrap`},children:[(0,N.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[j?(0,N.jsx)(ce,{size:16,color:`#d97706`}):(0,N.jsx)(l,{size:16,color:`#059669`}),(0,N.jsx)(`span`,{children:j?`Amendment Mode Active: You are editing an authorized revision of this finalized report.`:`This report was finalized on ${C.finalizedAt?new Date(C.finalizedAt).toLocaleDateString():`earlier`} by ${C.finalizedBy||`Consultant`}. Fields are locked against accidental changes.`})]}),(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${j?M.btnSecondary:M.btnWarning}`,style:{height:`30px`,fontSize:`12px`,padding:`0 10px`},onClick:()=>F(e=>!e),children:j?`Exit Amendment`:`Authorize Amendment / Edit`})]}),(0,N.jsxs)(`form`,{className:M.formContainer,ref:Ae,onKeyDown:je,onSubmit:e=>e.preventDefault(),children:[(0,N.jsxs)(`section`,{className:M.section,"aria-label":`Patient Identification`,children:[(0,N.jsxs)(`div`,{className:M.sectionHeader,children:[(0,N.jsxs)(`span`,{className:M.sectionTitle,children:[(0,N.jsx)(S,{size:15}),` Patient & Study Details`]}),(0,N.jsxs)(`button`,{type:`button`,className:M.templateBtn,onClick:()=>z(!0),disabled:Z,children:[(0,N.jsx)(h,{size:13}),` Search Patient Directory`]})]}),(0,N.jsxs)(`div`,{className:M.row,children:[(0,N.jsxs)(`div`,{className:M.fieldGroup,style:{flex:`1.5 1 240px`},children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Patient's Name :`}),(0,N.jsx)(`input`,{type:`text`,name:`patientName`,className:`${M.input} ${M.wFull} ${Z?M.inputLocked:``}`,style:{backgroundColor:C.patientName?void 0:`var(--warning-soft)`},value:C.patientName,onChange:e=>$(`patientName`,e.target.value),placeholder:`Click 'Search Patient Directory'...`,readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.fieldGroup,style:{flex:`1 1 180px`},children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Pt.Code :`}),(0,N.jsxs)(`div`,{style:{display:`flex`,gap:`6px`,width:`100%`},children:[(0,N.jsx)(`input`,{type:`text`,name:`uhid`,className:`${M.input} ${M.wFull} ${Z?M.inputLocked:``}`,value:C.uhid,onChange:e=>$(`uhid`,e.target.value),placeholder:`UHID-XXXX`,readOnly:Z}),(0,N.jsx)(`button`,{type:`button`,className:M.btnSecondary,style:{height:`36px`,padding:`0 10px`},onClick:()=>z(!0),disabled:Z,title:`Search patient`,children:(0,N.jsx)(h,{size:14})})]})]}),(0,N.jsxs)(`div`,{className:M.fieldGroup,children:[(0,N.jsx)(`label`,{className:M.label,children:`Age :`}),(0,N.jsx)(`input`,{type:`text`,name:`age`,className:`${M.input} ${M.wSmall} ${Z?M.inputLocked:``}`,value:C.age,onChange:e=>$(`age`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.fieldGroup,children:[(0,N.jsx)(`label`,{className:M.label,children:`Sex :`}),(0,N.jsxs)(`select`,{name:`sex`,className:`${M.input} ${M.wSmall} ${Z?M.inputLocked:``}`,value:C.sex,onChange:e=>$(`sex`,e.target.value),disabled:Z,children:[(0,N.jsx)(`option`,{value:``}),(0,N.jsx)(`option`,{value:`Male`,children:`Male`}),(0,N.jsx)(`option`,{value:`Female`,children:`Female`}),(0,N.jsx)(`option`,{value:`Other`,children:`Other`})]})]}),(0,N.jsxs)(`div`,{className:M.fieldGroup,children:[(0,N.jsx)(`label`,{className:M.label,children:`Date :`}),(0,N.jsx)(`input`,{type:`date`,name:`reportDate`,className:`${M.input} ${M.wMedium} ${Z?M.inputLocked:``}`,value:C.reportDate,onChange:e=>$(`reportDate`,e.target.value),readOnly:Z,max:`2099-12-31`})]})]}),(0,N.jsxs)(`div`,{className:M.row,children:[(0,N.jsxs)(`div`,{className:M.fieldGroup,style:{flex:`1.5 1 240px`},children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Refered By :`}),(0,N.jsx)(`input`,{type:`text`,name:`referredBy`,className:`${M.input} ${M.wFull} ${Z?M.inputLocked:``}`,value:C.referredBy,onChange:e=>$(`referredBy`,e.target.value),placeholder:`Referring Physician / Hospital`,readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.fieldGroup,style:{flex:`2.5 1 300px`},children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`C/O :`}),(0,N.jsx)(`input`,{type:`text`,name:`c_o`,className:`${M.input} ${M.wFull} ${Z?M.inputLocked:``}`,value:C.c_o,onChange:e=>$(`c_o`,e.target.value),placeholder:`Clinical symptoms / Indications (e.g. Chest pain, Dyspnea on exertion)`,readOnly:Z})]})]})]}),(0,N.jsxs)(`section`,{className:M.section,"aria-label":`Echocardiographic Measurements`,children:[(0,N.jsxs)(`div`,{className:M.sectionHeader,children:[(0,N.jsxs)(`span`,{className:M.sectionTitle,children:[(0,N.jsx)(ne,{size:15}),` Chamber Dimensions & Valve Assessment`]}),(0,N.jsx)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:`Standard 2D Transthoracic Measurements`})]}),(0,N.jsxs)(`div`,{className:M.measurementGrid,children:[(0,N.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Mitral Valve :`}),(0,N.jsx)(`input`,{type:`text`,name:`mitralValve`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.mitralValve,onChange:e=>$(`mitralValve`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Tricuspid Valve :`}),(0,N.jsx)(`input`,{type:`text`,name:`tricuspidValve`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.tricuspidValve,onChange:e=>$(`tricuspidValve`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Aorta :`}),(0,N.jsx)(`input`,{type:`text`,name:`aorta`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.aorta,onChange:e=>$(`aorta`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Left Ventricle :`}),(0,N.jsx)(`input`,{type:`text`,name:`leftVentricle`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.leftVentricle,onChange:e=>$(`leftVentricle`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`RWMA :`}),(0,N.jsx)(`input`,{type:`text`,name:`rwma`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.rwma,onChange:e=>$(`rwma`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Right Ventricle :`}),(0,N.jsx)(`input`,{type:`text`,name:`rightVentricle`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.rightVentricle,onChange:e=>$(`rightVentricle`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`IVC :`}),(0,N.jsx)(`input`,{type:`text`,name:`ivc`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.ivc,onChange:e=>$(`ivc`,e.target.value),readOnly:Z})]})]}),(0,N.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Aortic Valve :`}),(0,N.jsx)(`input`,{type:`text`,name:`aorticValve`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.aorticValve,onChange:e=>$(`aorticValve`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Pulmonary Valve :`}),(0,N.jsxs)(`div`,{className:M.complexRow,children:[(0,N.jsx)(`input`,{type:`text`,name:`pulmonaryValve`,className:`${M.input} ${M.wFull} ${Z?M.inputLocked:``}`,value:C.pulmonaryValve,onChange:e=>$(`pulmonaryValve`,e.target.value),readOnly:Z}),(0,N.jsx)(`label`,{className:M.label,style:{marginLeft:`8px`},children:`LVEF :`}),(0,N.jsx)(`input`,{type:`text`,name:`lvef`,className:`${M.input} ${M.wMedium} ${Z?M.inputLocked:``}`,value:C.lvef,onChange:e=>$(`lvef`,e.target.value),placeholder:`e.g. 60%`,readOnly:Z})]})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Left Atrium :`}),(0,N.jsx)(`input`,{type:`text`,name:`leftAtrium`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.leftAtrium,onChange:e=>$(`leftAtrium`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Right Atrium :`}),(0,N.jsx)(`input`,{type:`text`,name:`rightAtrium`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.rightAtrium,onChange:e=>$(`rightAtrium`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`RVSP :`}),(0,N.jsx)(`input`,{type:`text`,name:`rvsp`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.rvsp,onChange:e=>$(`rvsp`,e.target.value),placeholder:`mmHg`,readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`IVS :`}),(0,N.jsxs)(`div`,{className:M.complexRow,children:[(0,N.jsx)(`input`,{type:`text`,name:`ivs`,className:`${M.input} ${M.wFull} ${Z?M.inputLocked:``}`,value:C.ivs,onChange:e=>$(`ivs`,e.target.value),readOnly:Z}),(0,N.jsx)(`label`,{className:M.label,style:{width:`50px`,textAlign:`right`},children:`Septum :`}),(0,N.jsx)(`input`,{type:`text`,name:`septum`,className:`${M.input} ${M.wSmall} ${Z?M.inputLocked:``}`,value:C.septum,onChange:e=>$(`septum`,e.target.value),readOnly:Z}),(0,N.jsx)(`span`,{className:M.unit,children:`mm`}),(0,N.jsx)(`label`,{className:M.label,style:{marginLeft:`6px`},children:`LVIDd :`}),(0,N.jsx)(`input`,{type:`text`,name:`lvidd`,className:`${M.input} ${M.wMedium} ${Z?M.inputLocked:``}`,value:C.lvidd,onChange:e=>$(`lvidd`,e.target.value),readOnly:Z})]})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`IAS :`}),(0,N.jsxs)(`div`,{className:M.complexRow,children:[(0,N.jsx)(`input`,{type:`text`,name:`ias`,className:`${M.input} ${M.wFull} ${Z?M.inputLocked:``}`,value:C.ias,onChange:e=>$(`ias`,e.target.value),readOnly:Z}),(0,N.jsx)(`label`,{className:M.label,style:{width:`50px`,textAlign:`right`},children:`P.Wall :`}),(0,N.jsx)(`input`,{type:`text`,name:`pWall`,className:`${M.input} ${M.wSmall} ${Z?M.inputLocked:``}`,value:C.pWall,onChange:e=>$(`pWall`,e.target.value),readOnly:Z}),(0,N.jsx)(`span`,{className:M.unit,children:`mm`}),(0,N.jsx)(`label`,{className:M.label,style:{marginLeft:`6px`},children:`LVIDs :`}),(0,N.jsx)(`input`,{type:`text`,name:`lvids`,className:`${M.input} ${M.wMedium} ${Z?M.inputLocked:``}`,value:C.lvids,onChange:e=>$(`lvids`,e.target.value),readOnly:Z})]})]})]})]})]}),(0,N.jsxs)(`section`,{className:M.section,"aria-label":`Clinical Observations and Conclusion`,children:[(0,N.jsxs)(`div`,{className:M.sectionHeader,children:[(0,N.jsxs)(`span`,{className:M.sectionTitle,children:[(0,N.jsx)(te,{size:15}),` Doppler Study & Clinical Conclusion`]}),(0,N.jsxs)(`button`,{type:`button`,className:M.templateBtn,onClick:()=>G(!0),disabled:Z,children:[(0,N.jsx)(le,{size:13}),` Load Report Template`]})]}),(0,N.jsxs)(`div`,{className:M.splitSection,children:[(0,N.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,N.jsxs)(`div`,{className:M.measurementSubGrid,children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Pericardium :`}),(0,N.jsx)(`input`,{type:`text`,name:`pericardium`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.pericardium,onChange:e=>$(`pericardium`,e.target.value),placeholder:`e.g. Normal, no pericardial effusion`,readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,style:{alignItems:`flex-start`},children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,style:{marginTop:`8px`},children:`Doppler Study :`}),(0,N.jsx)(`textarea`,{name:`dopplerStudy`,className:`${M.textarea} ${Z?M.inputLocked:``}`,style:{height:`80px`},value:C.dopplerStudy,onChange:e=>$(`dopplerStudy`,e.target.value),placeholder:`Valvular flow velocities, gradients, diastolic filling pattern...`,readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,style:{alignItems:`flex-start`},children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,style:{marginTop:`8px`},children:`Conclusion :`}),(0,N.jsx)(`textarea`,{name:`conclusion`,className:`${M.textarea} ${Z?M.inputLocked:``}`,style:{height:`80px`},value:C.conclusion,onChange:e=>$(`conclusion`,e.target.value),placeholder:`Clinical impression and summary...`,readOnly:Z})]})]}),(0,N.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`12px`},children:[(0,N.jsxs)(`div`,{className:M.measurementSubGrid,style:{gridTemplateColumns:`170px 1fr`},children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`LV. Compliance :`}),(0,N.jsx)(`input`,{type:`text`,name:`lvCompliance`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.lvCompliance,onChange:e=>$(`lvCompliance`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,style:{gridTemplateColumns:`170px 1fr`},children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`TVI :`}),(0,N.jsx)(`input`,{type:`text`,name:`tvi`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.tvi,onChange:e=>$(`tvi`,e.target.value),placeholder:`Time Velocity Integral`,readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,style:{gridTemplateColumns:`170px 1fr`},children:[(0,N.jsxs)(`label`,{className:`${M.label} ${M.labelRight}`,children:[`Left Aortic arch / PDA /`,(0,N.jsx)(`br`,{}),`Coarctation :`]}),(0,N.jsx)(`input`,{type:`text`,name:`leftAorticArchPdaCoarctation`,className:`${M.input} ${Z?M.inputLocked:``}`,value:C.leftAorticArchPdaCoarctation,onChange:e=>$(`leftAorticArchPdaCoarctation`,e.target.value),readOnly:Z})]}),(0,N.jsxs)(`div`,{className:M.measurementSubGrid,style:{gridTemplateColumns:`170px 1fr`},children:[(0,N.jsx)(`label`,{className:`${M.label} ${M.labelRight}`,children:`Consultant Dr. :`}),(0,N.jsxs)(`div`,{style:{display:`flex`,gap:`6px`,width:`100%`},children:[(0,N.jsx)(`input`,{type:`text`,name:`consultantDr`,className:`${M.input} ${M.wFull} ${Z?M.inputLocked:``}`,value:C.consultantDr,onChange:e=>$(`consultantDr`,e.target.value),placeholder:`Doctor Name`,readOnly:Z,list:`echo-doctors-list`}),(0,N.jsx)(`datalist`,{id:`echo-doctors-list`,children:he.map(e=>(0,N.jsx)(`option`,{value:`${e.title} ${e.drName}`,children:e.speciality?`(${e.speciality})`:``},e.id))})]})]})]})]})]})]}),(0,N.jsxs)(`footer`,{className:M.actionBar,children:[(0,N.jsxs)(`div`,{className:M.navControls,children:[(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,onClick:Ie,disabled:E.length===0||k===0,title:`First Record`,"aria-label":`First Record`,children:(0,N.jsx)(n,{size:18})}),(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,onClick:Le,disabled:E.length===0||k<=0,title:`Previous Record`,"aria-label":`Previous Record`,children:(0,N.jsx)(t,{size:18})}),(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,onClick:Re,disabled:E.length===0||k>=E.length-1,title:`Next Record`,"aria-label":`Next Record`,children:(0,N.jsx)(re,{size:18})}),(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,onClick:ze,disabled:E.length===0||k===E.length-1,title:`Last Record`,"aria-label":`Last Record`,children:(0,N.jsx)(r,{size:18})})]}),(0,N.jsxs)(`div`,{className:M.middleActions,children:[(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnPrimary}`,onClick:Me,disabled:!C.uhid,title:`Open dedicated print page matching reference standard`,children:[(0,N.jsx)(f,{size:16}),` PRINT`]}),(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>K(!0),disabled:!C.uhid,title:`Preview formatted A4 report`,children:[(0,N.jsx)(te,{size:15}),` Preview`]}),(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:Ne,disabled:!C.uhid,title:`Download report as PDF file`,children:[(0,N.jsx)(c,{size:15}),` Export PDF`]}),(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>V(!0),title:`Search past Echo Reports`,children:`Perticular Search`}),(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>z(!0),title:`Quick Patient Search`,children:[(0,N.jsx)(h,{size:16}),` Patient`]}),(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:Pe,title:`Clear form fields`,children:[(0,N.jsx)(p,{size:15}),` Clear`]})]}),(0,N.jsxs)(`div`,{className:M.rightActions,children:[(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:Be,disabled:I,children:[(0,N.jsx)(d,{size:16}),` Add (New)`]}),(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnPrimary}`,onClick:He,disabled:I||Z&&!j,children:[(0,N.jsx)(m,{size:16}),` `,v?`Update (Save)`:`Save Draft`]}),C.status!==`Finalized`&&(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnSuccess}`,onClick:()=>q(!0),disabled:I||!C.uhid,children:[(0,N.jsx)(l,{size:15}),` Finalize`]}),(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnDanger}`,onClick:()=>J(!0),disabled:I||!v,children:[(0,N.jsx)(g,{size:16}),` Delete`]}),(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>e(`/patient-registration`),style:{marginLeft:`4px`},children:[(0,N.jsx)(ee,{size:16}),` Exit`]})]})]}),ye&&(0,N.jsx)(`div`,{className:M.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,N.jsxs)(`div`,{className:M.modalContent,style:{maxWidth:`750px`},children:[(0,N.jsxs)(`div`,{className:M.modalHeader,children:[(0,N.jsxs)(`h2`,{className:M.modalTitle,children:[(0,N.jsx)(S,{size:20,color:`var(--primary)`}),`Select Existing Patient`]}),(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>z(!1),children:(0,N.jsx)(y,{size:18})})]}),(0,N.jsxs)(`div`,{className:M.modalBody,children:[(0,N.jsx)(`div`,{style:{marginBottom:`14px`},children:(0,N.jsx)(`input`,{type:`text`,className:M.input,style:{width:`100%`,height:`40px`,fontSize:`14px`},placeholder:`Search patient by Name, UHID, or Mobile Number...`,value:B,onChange:e=>be(e.target.value),autoFocus:!0})}),(0,N.jsx)(`div`,{style:{maxHeight:`380px`,overflowY:`auto`},children:(0,N.jsxs)(`table`,{className:M.dataTable,children:[(0,N.jsx)(`thead`,{children:(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`th`,{children:`UHID`}),(0,N.jsx)(`th`,{children:`Patient Name`}),(0,N.jsx)(`th`,{children:`Age / Sex`}),(0,N.jsx)(`th`,{children:`Mobile`}),(0,N.jsx)(`th`,{children:`Doctor`}),(0,N.jsx)(`th`,{children:`Action`})]})}),(0,N.jsx)(`tbody`,{children:Ke.length===0?(0,N.jsx)(`tr`,{children:(0,N.jsx)(`td`,{colSpan:6,style:{textAlign:`center`,padding:`24px`,color:`var(--text-muted)`},children:`No matching patients found.`})}):Ke.map(e=>{let t=[e.firstName,e.middleName,e.lastName].filter(Boolean).join(` `);return(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{style:{fontWeight:700,color:`var(--primary)`},children:e.uhid}),(0,N.jsx)(`td`,{style:{fontWeight:600},children:t}),(0,N.jsxs)(`td`,{children:[e.age,` yrs / `,e.sex]}),(0,N.jsx)(`td`,{children:e.mobile}),(0,N.jsx)(`td`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:e.hospitalDoctor||e.referenceBy||`--`}),(0,N.jsx)(`td`,{children:(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnPrimary}`,style:{height:`28px`,fontSize:`12px`,padding:`0 10px`},onClick:()=>Ve(e),children:`Select`})})]},e.uhid)})})]})})]}),(0,N.jsx)(`div`,{className:M.modalFooter,children:(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>z(!1),children:`Cancel`})})]})}),xe&&(0,N.jsx)(`div`,{className:M.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,N.jsxs)(`div`,{className:M.modalContent,style:{maxWidth:`900px`},children:[(0,N.jsxs)(`div`,{className:M.modalHeader,children:[(0,N.jsxs)(`h2`,{className:M.modalTitle,children:[(0,N.jsx)(h,{size:20,color:`var(--primary)`}),`Perticular Search — Echo Report Directory`]}),(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>V(!1),children:(0,N.jsx)(y,{size:18})})]}),(0,N.jsxs)(`div`,{className:M.modalBody,children:[(0,N.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,marginBottom:`14px`,flexWrap:`wrap`},children:[(0,N.jsx)(`input`,{type:`text`,className:M.input,style:{flex:`1 1 200px`},placeholder:`Search by Report ID, UHID, Patient Name, or Findings...`,value:H,onChange:e=>Se(e.target.value),autoFocus:!0}),(0,N.jsxs)(`select`,{className:M.input,style:{width:`130px`},value:U,onChange:e=>Ce(e.target.value),children:[(0,N.jsx)(`option`,{value:`All`,children:`All Status`}),(0,N.jsx)(`option`,{value:`Draft`,children:`Draft Only`}),(0,N.jsx)(`option`,{value:`Finalized`,children:`Finalized Only`})]}),(0,N.jsxs)(`select`,{className:M.input,style:{width:`180px`},value:W,onChange:e=>we(e.target.value),children:[(0,N.jsx)(`option`,{value:`All`,children:`All Doctors`}),he.map(e=>(0,N.jsxs)(`option`,{value:e.drName,children:[e.title,` `,e.drName]},e.id))]})]}),(0,N.jsx)(`div`,{style:{maxHeight:`400px`,overflowY:`auto`},children:(0,N.jsxs)(`table`,{className:M.dataTable,children:[(0,N.jsx)(`thead`,{children:(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`th`,{children:`Report ID`}),(0,N.jsx)(`th`,{children:`Date`}),(0,N.jsx)(`th`,{children:`Patient (UHID)`}),(0,N.jsx)(`th`,{children:`LVEF`}),(0,N.jsx)(`th`,{children:`Consultant Dr.`}),(0,N.jsx)(`th`,{children:`Status`}),(0,N.jsx)(`th`,{children:`Action`})]})}),(0,N.jsx)(`tbody`,{children:qe.length===0?(0,N.jsx)(`tr`,{children:(0,N.jsx)(`td`,{colSpan:7,style:{textAlign:`center`,padding:`24px`,color:`var(--text-muted)`},children:`No echo reports match your search criteria.`})}):qe.map((e,t)=>(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{style:{fontWeight:700,color:`var(--primary)`},children:e.id}),(0,N.jsx)(`td`,{children:e.reportDate}),(0,N.jsxs)(`td`,{children:[(0,N.jsx)(`strong`,{children:e.patientName}),` `,(0,N.jsxs)(`span`,{style:{color:`var(--text-muted)`},children:[`(`,e.uhid,`)`]})]}),(0,N.jsx)(`td`,{style:{fontWeight:600},children:e.lvef||`--`}),(0,N.jsx)(`td`,{style:{fontSize:`12px`},children:e.consultantDr||`--`}),(0,N.jsx)(`td`,{children:e.status===`Finalized`?(0,N.jsxs)(`span`,{className:M.statusBadgeFinalized,style:{fontSize:`11px`,padding:`2px 8px`},children:[(0,N.jsx)(l,{size:10}),` Finalized`]}):(0,N.jsx)(`span`,{className:M.statusBadgeDraft,style:{fontSize:`11px`,padding:`2px 8px`},children:`Draft`})}),(0,N.jsx)(`td`,{children:(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnPrimary}`,style:{height:`28px`,fontSize:`12px`,padding:`0 10px`},onClick:()=>{Q(e,t),V(!1)},children:`Open`})})]},e.id))})]})})]}),(0,N.jsx)(`div`,{className:M.modalFooter,children:(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>V(!1),children:`Close`})})]})}),Te&&(0,N.jsx)(`div`,{className:M.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,N.jsxs)(`div`,{className:M.modalContent,style:{maxWidth:`700px`},children:[(0,N.jsxs)(`div`,{className:M.modalHeader,children:[(0,N.jsxs)(`h2`,{className:M.modalTitle,children:[(0,N.jsx)(le,{size:20,color:`var(--primary)`}),`Load Findings from Report Template Master`]}),(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>G(!1),children:(0,N.jsx)(y,{size:18})})]}),(0,N.jsxs)(`div`,{className:M.modalBody,children:[(0,N.jsx)(`p`,{style:{fontSize:`13px`,color:`var(--text-muted)`,marginTop:0},children:`Select a standard echocardiography or cardiology report template from the Master database to populate Doppler Study and Conclusion:`}),(0,N.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`8px`,maxHeight:`380px`,overflowY:`auto`},children:_e.map(e=>(0,N.jsxs)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:`6px`,padding:`12px 14px`,backgroundColor:`var(--surface)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`12px`},children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`div`,{style:{fontWeight:700,fontSize:`13.5px`,color:`var(--text-main)`},children:e.templateName}),(0,N.jsxs)(`div`,{style:{fontSize:`11.5px`,color:`var(--text-muted)`,marginTop:`2px`},children:[`Group: `,e.groupName,` • Dept: `,e.department||`Cardiology`]})]}),(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnPrimary}`,style:{height:`30px`,fontSize:`12px`},onClick:()=>Ge(e),children:`Insert Text`})]},e.id))})]}),(0,N.jsx)(`div`,{className:M.modalFooter,children:(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>G(!1),children:`Cancel`})})]})}),Ee&&(0,N.jsx)(`div`,{className:`${M.modalOverlay} ${M.printOverlayActive}`,role:`dialog`,"aria-modal":`true`,children:(0,N.jsxs)(`div`,{className:M.modalContent,style:{maxWidth:`860px`,maxHeight:`95vh`},children:[(0,N.jsxs)(`div`,{className:M.modalHeader,children:[(0,N.jsxs)(`h2`,{className:M.modalTitle,children:[(0,N.jsx)(f,{size:18,color:`var(--primary)`}),`Printable Echo Report Preview (A4 Standard)`]}),(0,N.jsxs)(`div`,{style:{display:`flex`,gap:`8px`},children:[(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnPrimary}`,onClick:Me,children:[(0,N.jsx)(f,{size:15}),` Open Dedicated Print Tab`]}),(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>K(!1),children:(0,N.jsx)(y,{size:18})})]})]}),(0,N.jsx)(`div`,{className:M.modalBody,style:{backgroundColor:`#f1f5f9`,padding:`16px`},children:(0,N.jsxs)(`div`,{className:M.printContainer,id:`printable-echo-report`,children:[(0,N.jsxs)(`header`,{className:M.printHeader,children:[(0,N.jsx)(`h1`,{className:M.printHospitalName,children:x.name}),(0,N.jsxs)(`p`,{className:M.printHospitalInfo,children:[x.address,` | Phone: `,x.phone,` | Email: `,x.email]}),(0,N.jsx)(`div`,{className:M.printTitleBanner,children:`2D TRANSTHORACIC ECHOCARDIOGRAPHY & COLOR DOPPLER REPORT`})]}),(0,N.jsxs)(`section`,{className:M.printPatientGrid,"aria-label":`Patient details`,children:[(0,N.jsxs)(`div`,{className:M.printPatientRow,children:[(0,N.jsx)(`span`,{className:M.printPatientLabel,children:`Patient Name:`}),(0,N.jsx)(`span`,{className:M.printPatientVal,children:C.patientName||`--`})]}),(0,N.jsxs)(`div`,{className:M.printPatientRow,children:[(0,N.jsx)(`span`,{className:M.printPatientLabel,children:`Report Date:`}),(0,N.jsx)(`span`,{className:M.printPatientVal,children:C.reportDate})]}),(0,N.jsxs)(`div`,{className:M.printPatientRow,children:[(0,N.jsx)(`span`,{className:M.printPatientLabel,children:`UHID / Pt.Code:`}),(0,N.jsx)(`span`,{className:M.printPatientVal,children:C.uhid||`--`})]}),(0,N.jsxs)(`div`,{className:M.printPatientRow,children:[(0,N.jsx)(`span`,{className:M.printPatientLabel,children:`Age / Sex:`}),(0,N.jsxs)(`span`,{className:M.printPatientVal,children:[C.age,` Yrs / `,C.sex]})]}),(0,N.jsxs)(`div`,{className:M.printPatientRow,children:[(0,N.jsx)(`span`,{className:M.printPatientLabel,children:`Referred By:`}),(0,N.jsx)(`span`,{className:M.printPatientVal,children:C.referredBy||`Self / Consultant`})]}),(0,N.jsxs)(`div`,{className:M.printPatientRow,children:[(0,N.jsx)(`span`,{className:M.printPatientLabel,children:`Consultant:`}),(0,N.jsx)(`span`,{className:M.printPatientVal,children:C.consultantDr||`Dr. Nilesh Mahale`})]}),C.c_o&&(0,N.jsxs)(`div`,{className:M.printPatientRow,style:{gridColumn:`span 2`},children:[(0,N.jsx)(`span`,{className:M.printPatientLabel,children:`Clinical Indication (C/O):`}),(0,N.jsx)(`span`,{className:M.printPatientVal,children:C.c_o})]})]}),(0,N.jsxs)(`table`,{className:M.printTable,"aria-label":`Anatomical dimensions`,children:[(0,N.jsx)(`thead`,{children:(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`th`,{style:{width:`30%`},children:`Cardiac Structure / Parameter`}),(0,N.jsx)(`th`,{style:{width:`40%`},children:`Observed Finding`}),(0,N.jsx)(`th`,{style:{width:`30%`},children:`Reference / Notes`})]})}),(0,N.jsxs)(`tbody`,{children:[(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:(0,N.jsx)(`strong`,{children:`Left Ventricular Function (LVEF)`})}),(0,N.jsx)(`td`,{children:(0,N.jsx)(`strong`,{children:C.lvef||`--`})}),(0,N.jsx)(`td`,{children:`Normal: 55% - 70%`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`Mitral Valve`}),(0,N.jsx)(`td`,{children:C.mitralValve||`Normal morphology`}),(0,N.jsx)(`td`,{children:`Leaflets, subvalvular apparatus`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`Aortic Valve & Aorta`}),(0,N.jsxs)(`td`,{children:[C.aorticValve||`Trileaflet`,` • Aorta: `,C.aorta||`Normal`]}),(0,N.jsx)(`td`,{children:`No significant stenosis / regurgitation`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`Tricuspid Valve & RVSP`}),(0,N.jsxs)(`td`,{children:[C.tricuspidValve||`Normal`,` • RVSP: `,C.rvsp||`Normal`]}),(0,N.jsx)(`td`,{children:`PASP estimation`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`Pulmonary Valve`}),(0,N.jsx)(`td`,{children:C.pulmonaryValve||`Normal`}),(0,N.jsx)(`td`,{children:`Flow velocity`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`Atrial Dimensions`}),(0,N.jsxs)(`td`,{children:[`LA: `,C.leftAtrium||`Normal`,` • RA: `,C.rightAtrium||`Normal`]}),(0,N.jsx)(`td`,{children:`Chamber cavity size`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`Right Ventricle & IVC`}),(0,N.jsxs)(`td`,{children:[`RV: `,C.rightVentricle||`Normal`,` • IVC: `,C.ivc||`Normal`]}),(0,N.jsx)(`td`,{children:`Respiratory collapsibility`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`Septum & Posterior Wall`}),(0,N.jsxs)(`td`,{children:[`IVS: `,C.ivs||`--`,` (`,C.septum||`--`,` mm) • P.Wall: `,C.pWall||`--`,` mm`]}),(0,N.jsx)(`td`,{children:`Wall thickness`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`LV Internal Dimensions`}),(0,N.jsxs)(`td`,{children:[`LVIDd: `,C.lvidd||`--`,` mm • LVIDs: `,C.lvids||`--`,` mm`]}),(0,N.jsx)(`td`,{children:`End-diastole / End-systole`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`RWMA`}),(0,N.jsx)(`td`,{children:C.rwma||`No regional wall motion abnormality at rest`}),(0,N.jsx)(`td`,{children:`Segmental wall motion`})]}),(0,N.jsxs)(`tr`,{children:[(0,N.jsx)(`td`,{children:`Pericardium`}),(0,N.jsx)(`td`,{children:C.pericardium||`Normal, no effusion`}),(0,N.jsx)(`td`,{children:`Pericardial space`})]})]})]}),C.dopplerStudy&&(0,N.jsxs)(`div`,{className:M.printBox,children:[(0,N.jsx)(`div`,{className:M.printBoxTitle,children:`Color Doppler Study & Hemodynamics`}),(0,N.jsx)(`div`,{className:M.printBoxContent,children:C.dopplerStudy})]}),(0,N.jsxs)(`div`,{className:M.printBox,style:{border:`2px solid #0f172a`},children:[(0,N.jsx)(`div`,{className:M.printBoxTitle,children:`Conclusion / Impression`}),(0,N.jsx)(`div`,{className:M.printBoxContent,style:{fontWeight:600},children:C.conclusion||`Normal 2D Transthoracic Echocardiogram. Preserved LV systolic function.`})]}),(0,N.jsxs)(`footer`,{className:M.printFooterSign,children:[(0,N.jsx)(`div`,{children:(0,N.jsxs)(`div`,{style:{fontSize:`11px`,color:`#64748b`},children:[`Report Status: `,(0,N.jsx)(`strong`,{children:C.status.toUpperCase()}),C.finalizedAt&&` • Finalized on ${new Date(C.finalizedAt).toLocaleString()}`]})}),(0,N.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,N.jsx)(`div`,{style:{borderBottom:`1px solid #0f172a`,width:`200px`,marginBottom:`6px`}}),(0,N.jsx)(`strong`,{style:{fontSize:`13px`},children:C.consultantDr||`Consultant Cardiologist`}),(0,N.jsx)(`div`,{style:{fontSize:`11px`,color:`#475569`},children:`Reporting Consultant / Cardiologist`})]})]})]})}),(0,N.jsxs)(`div`,{className:M.modalFooter,children:[(0,N.jsxs)(`button`,{type:`button`,className:`${M.btn} ${M.btnPrimary}`,onClick:()=>window.print(),children:[(0,N.jsx)(f,{size:15}),` Print`]}),(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>K(!1),children:`Close Preview`})]})]})}),De&&(0,N.jsx)(`div`,{className:M.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,N.jsxs)(`div`,{className:M.modalContent,style:{maxWidth:`480px`},children:[(0,N.jsxs)(`div`,{className:M.modalHeader,children:[(0,N.jsxs)(`h2`,{className:M.modalTitle,style:{color:`#059669`},children:[(0,N.jsx)(l,{size:18}),` Finalize Echo Report`]}),(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>q(!1),children:(0,N.jsx)(y,{size:18})})]}),(0,N.jsxs)(`div`,{className:M.modalBody,children:[(0,N.jsxs)(`p`,{style:{fontSize:`14px`,lineHeight:1.5,color:`var(--text-main)`,marginTop:0},children:[`Are you sure you want to finalize this Echo Report for `,(0,N.jsx)(`strong`,{children:C.patientName}),` (`,C.uhid,`)?`]}),(0,N.jsx)(`div`,{style:{backgroundColor:`rgba(16, 185, 129, 0.08)`,border:`1px solid rgba(16, 185, 129, 0.3)`,padding:`10px 14px`,borderRadius:`6px`,fontSize:`12.5px`,color:`#065f46`},children:`Once finalized, findings become authoritative clinical documentation and will be protected from accidental modification.`})]}),(0,N.jsxs)(`div`,{className:M.modalFooter,children:[(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>q(!1),disabled:I,children:`Cancel`}),(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnSuccess}`,onClick:Ue,disabled:I,children:I?`Finalizing...`:`Yes, Finalize Report`})]})]})}),Oe&&(0,N.jsx)(`div`,{className:M.modalOverlay,role:`dialog`,"aria-modal":`true`,children:(0,N.jsxs)(`div`,{className:M.modalContent,style:{maxWidth:`460px`},children:[(0,N.jsxs)(`div`,{className:M.modalHeader,children:[(0,N.jsxs)(`h2`,{className:M.modalTitle,style:{color:`var(--danger)`},children:[(0,N.jsx)(g,{size:18}),` Delete Echo Report`]}),(0,N.jsx)(`button`,{type:`button`,className:M.navBtn,style:{width:`32px`,height:`32px`},onClick:()=>J(!1),children:(0,N.jsx)(y,{size:18})})]}),(0,N.jsxs)(`div`,{className:M.modalBody,children:[(0,N.jsxs)(`p`,{style:{fontSize:`14px`,lineHeight:1.5,color:`var(--text-main)`,marginTop:0},children:[`Are you sure you want to permanently delete Echo Report `,(0,N.jsx)(`strong`,{children:v}),` for patient `,(0,N.jsx)(`strong`,{children:C.patientName}),`?`]}),(0,N.jsx)(`p`,{style:{fontSize:`12.5px`,color:`var(--danger)`,margin:0},children:`This action cannot be undone.`})]}),(0,N.jsxs)(`div`,{className:M.modalFooter,children:[(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnSecondary}`,onClick:()=>J(!1),disabled:I,children:`Cancel`}),(0,N.jsx)(`button`,{type:`button`,className:`${M.btn} ${M.btnDanger}`,onClick:We,disabled:I,children:I?`Deleting...`:`Delete Permanently`})]})]})})]})};export{F as EchoReport,F as default};