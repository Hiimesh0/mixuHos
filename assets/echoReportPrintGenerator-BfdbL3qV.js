import{t as e}from"./jspdf.es.min-C9nDe8Wi.js";function t(e){if(!e)return n(new Date);try{let t=new Date(e);return isNaN(t.getTime())?e:n(t)}catch{return e}}function n(e){return`${String(e.getDate()).padStart(2,`0`)}-${[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`][e.getMonth()]}-${e.getFullYear()}`}function r(e){let n=t(e.reportDate),r=e.patientName?e.patientName.replace(/^DEMO:\s*/i,``):`Patient`,i=e.age?`${e.age} Yrs`:`--`,a=e.sex||`--`,o=e.referredBy||`DR. SAJID SHAIKH`,s=e.lvef!=null&&e.lvef!==``?`${e.lvef}`:`40 %`;s&&!s.includes(`%`)&&(s=`${s} %`);let c=e.rwma?e.rwma:`present`,l=e.rvsp!=null&&e.rvsp!==``?`${e.rvsp}`:`45 mmHg`;l&&!l.toLowerCase().includes(`mmhg`)&&(l=`${l} mmHg`);let u=e.ivs||`Intact`,d=e.ias||`Intact`,f=e.septum?`${e.septum} mm`:`10 mm`,p=e.pWall?`${e.pWall} mm`:`10 mm`,m=e.lvidd?`${e.lvidd} mm`:`44 mm`,h=e.lvids?`${e.lvids} mm`:`28 mm`,g=e.pericardium||`Normal`,_=e.dopplerStudy||`Mild MR, Mild TR`,v=(e.conclusion||`Mild LV systolic dysfunction. LVEF: 40%
RWMA Present
Grade I LV Diastolic Dysfunction.
Normal Size Cardiac Chambers
Mild PH, PASP = 45mmHg
No e/o Clot/Vegetation/Pericardial Effusion
IVC Congested (1.9 cm) < 50% collapsing.`).replace(/^\[Sample Record\]\s*/i,``).split(`
`).map(e=>e.trim()).filter(Boolean),y=e.consultantDr||`Dr. Devang Desai`;return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>2D Echo Report - ${r}</title>
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
          <span class="header-val" style="font-weight: 600;">${r} .</span>
        </td>
        <td style="width: 42%;">
          <span class="header-label">Age / Sex</span>
          <span class="header-label" style="margin-left: 8px;">:</span>
          <span class="header-val" style="font-weight: 600;">${i} / ${a}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="header-label">Referred By Dr.</span>
          <span class="header-label" style="margin-left: 4px;">:</span>
          <span class="header-val" style="font-weight: 600;">${o}</span>
        </td>
        <td>
          <span class="header-label">Date</span>
          <span class="header-label" style="margin-left: 36px;">:</span>
          <span class="header-val" style="font-weight: 600;">${n}</span>
        </td>
      </tr>
      ${e.c_o||e.indication?`
      <tr>
        <td colspan="2" style="padding-top: 2px;">
          <span class="header-label">Indication</span>
          <span class="header-label" style="margin-left: 45px;">:</span>
          <span class="header-val" style="font-weight: 500;">${e.c_o||e.indication}</span>
        </td>
      </tr>
      `:``}
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
            <span class="metric-val">${s}</span>
          </div>
          <div style="font-weight: 700; margin-top: 4px; padding-left: 2px;">
            RWMA ${c}
          </div>
        </div>

        <div class="metric-box" style="margin-top: 36px;">
          <div class="metric-row">
            <span class="metric-label" style="width: 95px;">PASP/RVSP</span>
            <span class="metric-colon">:</span>
            <span class="metric-val">${l}</span>
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
          <span class="meas-val">${u}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label">IAS</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${d}</span>
        </div>
        <div class="meas-item" style="margin-top: 8px;">
          <span class="meas-label" style="min-width: 82px;">Pericardium</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${g}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 96px;">Doppler Study</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${_}</span>
        </div>
      </div>

      <!-- Col 2 -->
      <div>
        <div class="meas-item">
          <span class="meas-label">IVSD</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${f}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label">PWD</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${p}</span>
        </div>
      </div>

      <!-- Col 3 -->
      <div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 68px;">LVIDd</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${m}</span>
        </div>
        <div class="meas-item">
          <span class="meas-label" style="min-width: 68px;">LVIDs</span>
          <span class="meas-colon">:</span>
          <span class="meas-val">${h}</span>
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
        ${v[0]||`Mild LV systolic dysfunction. LVEF:40%`}
      </div>
      ${v.length>1?`
        <div class="conclusion-list">
          ${v.slice(1).map(e=>`<div class="conclusion-list-item">${e}</div>`).join(``)}
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
        <div class="doc-name">${y}</div>
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
</html>`}function i(e){let t=window.open(`about:blank`,`_blank`);if(!t){alert(`Please allow popups for this site to open the Echo Report print preview.`);return}let n=r(e);t.document.open(),t.document.write(n),t.document.close()}function a(n){let r=new e({orientation:`portrait`,unit:`mm`,format:`a4`}),i=n.patientName?n.patientName.replace(/^DEMO:\s*/i,``):`Patient`,a=t(n.reportDate),o=n.referredBy||`DR. SAJID SHAIKH`,s=n.age?`${n.age} Yrs`:`--`,c=n.sex||`--`;r.setFont(`helvetica`,`bold`),r.setFontSize(10.5),r.text(`Name`,16,20),r.text(`:`,55,20),r.setFont(`helvetica`,`normal`),r.text(`${i} .`,60,20),r.setFont(`helvetica`,`bold`),r.text(`Age / Sex`,130,20),r.text(`:`,155,20),r.setFont(`helvetica`,`normal`),r.text(`${s} / ${c}`,160,20),r.setFont(`helvetica`,`bold`),r.text(`Referred By Dr.`,16,26),r.text(`:`,55,26),r.setFont(`helvetica`,`normal`),r.text(o,60,26),r.setFont(`helvetica`,`bold`),r.text(`Date`,130,26),r.text(`:`,155,26),r.setFont(`helvetica`,`normal`),r.text(a,160,26);let l=n.c_o||n.indication||``;l&&(r.setFont(`helvetica`,`bold`),r.text(`Indication`,16,31.5),r.text(`:`,55,31.5),r.setFont(`helvetica`,`normal`),r.text(r.splitTextToSize(l,135),60,31.5)),r.setFont(`helvetica`,`bold`),r.setFontSize(14);let u=`2D Echo Report`,d=r.getTextWidth(u),f=(210-d)/2;r.text(u,f,38),r.line(f,39,f+d,39);let p=n.lvef!=null&&n.lvef!==``?`${n.lvef}`:`40 %`;p&&!p.includes(`%`)&&(p=`${p} %`);let m=n.rvsp!=null&&n.rvsp!==``?`${n.rvsp}`:`45 mmHg`;m&&!m.toLowerCase().includes(`mmhg`)&&(m=`${m} mmHg`),r.setFontSize(9.5);let h=48;[[`Mitral Valve`,n.mitralValve||`Structurally Normal, Mild MR`],[`Aortic Valve`,n.aorticValve||`Structurally Normal`],[`Aorta`,n.aorta||`Normal Sized`],[`Tricuspid Valve`,n.tricuspidValve||`Structurally Normal, Mild TR`],[`Pulmonary Valve`,n.pulmonaryValve||`Structurally Normal`],[`Left Atrium`,n.leftAtrium||`Normal Sized`],[`Left Ventricle`,n.leftVentricle||`Normal Sized, basal inferoposterior wall hypokinetic`],[`Right Atrium`,n.rightAtrium||`Normal Sized`],[`Right Ventricle`,n.rightVentricle||`Normal Sized`]].forEach(([e,t])=>{r.setFont(`helvetica`,`bold`),r.text(e,16,h),r.text(`:`,55,h),r.setFont(`helvetica`,`normal`);let n=r.splitTextToSize(t,75);r.text(n,60,h),h+=Math.max(5.5,n.length*4.5)}),r.setFont(`helvetica`,`bold`),r.text(`LVEF`,140,52),r.text(`:`,165,52),r.setFont(`helvetica`,`bold`),r.text(p,170,52),r.text(`RWMA ${n.rwma||`present`}`,140,58),r.text(`PASP/RVSP`,140,80),r.text(`:`,168,80),r.text(m,172,80),h=Math.max(h,106)+4,r.setFontSize(9),r.setFont(`helvetica`,`bold`),r.text(`IVS`,16,h),r.text(`:`,40,h),r.setFont(`helvetica`,`normal`),r.text(n.ivs||`Intact`,43,h),r.setFont(`helvetica`,`bold`),r.text(`IAS`,16,h+5),r.text(`:`,40,h+5),r.setFont(`helvetica`,`normal`),r.text(n.ias||`Intact`,43,h+5),r.setFont(`helvetica`,`bold`),r.text(`Pericardium`,16,h+12),r.text(`:`,40,h+12),r.setFont(`helvetica`,`normal`),r.text(n.pericardium||`Normal`,43,h+12),r.setFont(`helvetica`,`bold`),r.text(`Doppler Study`,16,h+18),r.text(`:`,40,h+18),r.setFont(`helvetica`,`normal`),r.text(n.dopplerStudy||`Mild MR, Mild TR`,43,h+18),r.setFont(`helvetica`,`bold`),r.text(`IVSD`,85,h),r.text(`:`,102,h),r.setFont(`helvetica`,`normal`),r.text(n.septum?`${n.septum} mm`:`10 mm`,105,h),r.setFont(`helvetica`,`bold`),r.text(`PWD`,85,h+5),r.text(`:`,102,h+5),r.setFont(`helvetica`,`normal`),r.text(n.pWall?`${n.pWall} mm`:`10 mm`,105,h+5),r.setFont(`helvetica`,`bold`),r.text(`LVIDd`,140,h),r.text(`:`,160,h),r.setFont(`helvetica`,`normal`),r.text(n.lvidd?`${n.lvidd} mm`:`44 mm`,164,h),r.setFont(`helvetica`,`bold`),r.text(`LVIDs`,140,h+5),r.text(`:`,160,h+5),r.setFont(`helvetica`,`normal`),r.text(n.lvids?`${n.lvids} mm`:`28 mm`,164,h+5),r.setFont(`helvetica`,`bold`),r.text(`AV Max`,140,h+11),r.text(`:`,160,h+11),r.setFont(`helvetica`,`normal`),r.text(`1.2 m/Sec`,164,h+11),r.setFont(`helvetica`,`bold`),r.text(`PV Max`,140,h+16),r.text(`:`,160,h+16),r.setFont(`helvetica`,`normal`),r.text(`1.1 m/Sec`,164,h+16),r.setFont(`helvetica`,`bold`),r.text(`MV E/A`,140,h+21),r.text(`:`,160,h+21),r.setFont(`helvetica`,`normal`),r.text(`> 1`,164,h+21),h+=30,r.setFont(`helvetica`,`bold`),r.text(`Conclusion`,16,h),r.text(`:`,38,h),r.setFont(`helvetica`,`normal`);let g=(n.conclusion||`Mild LV systolic dysfunction. LVEF: 40%
RWMA Present
Grade I LV Diastolic Dysfunction.
Normal Size Cardiac Chambers
Mild PH, PASP = 45mmHg
No e/o Clot/Vegetation/Pericardial Effusion
IVC Congested (1.9 cm) < 50% collapsing.`).replace(/^\[Sample Record\]\s*/i,``).split(`
`).map(e=>e.trim()).filter(Boolean);if(g.length>0){r.text(g[0],42,h),h+=5.5;for(let e=1;e<g.length;e++)r.text(g[e],42,h),h+=5}h=Math.max(h+12,240),r.setFont(`helvetica`,`bold`),r.setFontSize(10),r.text(`Dr. Dharmil Patel`,16,h),r.setFont(`helvetica`,`normal`),r.setFontSize(8.5),r.text(`DNB (Cardiology) Interventional Cardiologist`,16,h+4.5),r.text(`(FULL TIME)`,16,h+8.5);let _=n.consultantDr||`Dr. Devang Desai`;r.setFont(`helvetica`,`bold`),r.setFontSize(10),r.text(_,135,h),r.setFont(`helvetica`,`normal`),r.setFontSize(8.5),r.text(`D.M.(Cardiology), M.D(MED.); FACC`,135,h+4.5),r.text(`INTERVENTIONAL CARDIOLOGIST`,135,h+8.5),r.setFontSize(8),r.setFont(`helvetica`,`normal`);let v=`"This Report is not valid for medico-legal purpose."`,y=`"Normal echocardiography does not rule out coronary artery disease."`;return r.text(v,(210-r.getTextWidth(v))/2,275),r.text(y,(210-r.getTextWidth(y))/2,280),r.output(`blob`)}export{i as n,a as t};