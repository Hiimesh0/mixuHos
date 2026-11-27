import{r as e}from"./rolldown-runtime-hePW80VL.js";import{t}from"./chevron-left-9kkuPC4y.js";import{n,t as r}from"./chevrons-right-CMwd6mE8.js";import{t as i}from"./circle-alert-CxoVZpVE.js";import{t as a}from"./circle-check-C19swxpF.js";import{t as o}from"./eye-BKNQubUB.js";import{t as s}from"./pen-line-W3aE37PP.js";import{t as c}from"./pen-w5kFA6I4.js";import{t as l}from"./plus-DCTjc7Du.js";import{t as u}from"./printer-BCmAqtLE.js";import{t as ee}from"./save-4G_r61St.js";import{t as d}from"./search-DTw4Wblj.js";import{t as te}from"./shield-alert-GXub3PhH.js";import{n as ne,t as re}from"./square-O7i7-suv.js";import{t as ie}from"./trash-BNuPVG6y.js";import{A as f,F as p,M as ae,S as oe,i as m,m as se,r as h,s as ce,t as g,v as le}from"./index-DCbsonLI.js";import{d as _}from"./masterApi-JRUmigoj.js";import{n as ue}from"./patientApi-B4kdWJTo.js";import{t as de}from"./useAutoDismissNotification-DpNKSYIs.js";import{n as fe}from"./useFormKeyboardNavigation-DrLiWUKv.js";var v={name:`list`,size:24,node:[[`path`,{d:`M3 5h.01`,key:`18ugdj`}],[`path`,{d:`M3 12h.01`,key:`nlz23k`}],[`path`,{d:`M3 19h.01`,key:`noohij`}],[`path`,{d:`M8 5h13`,key:`1pao27`}],[`path`,{d:`M8 12h13`,key:`1za7za`}],[`path`,{d:`M8 19h13`,key:`m83p4d`}]]};v.node;var pe=f(v),y=e(p(),1),b=/^(IMPRESSION|CONCLUSION|COMMENTS|RECOMMENDATION|RECOMMENDATIONS|REMARKS?|OPINION)\s*[:-]\s*(.*)$/i,x=/^[\s\t]*([•\-*–—\u2022\u25CF\u25BA]|\d+[.)])\s*/,S=/^([A-Z0-9\s&/()_\-+]{2,35})\s*:\s*(.*)$/;function C(e){if(!e||!e.trim())return{items:[],impressionLines:[],rawText:``};let t=e.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),n=[],r=[],i,a=!1;return t.forEach((e,t)=>{let o=e.trim();if(!o)return;let s=o.match(b);if(s){a=!0,i=s[1].toUpperCase();let e=s[2].trim();e&&r.push(e);return}if(a){let e=o.replace(x,``).trim();e&&r.push(e);return}let c=o.replace(x,``).trim();if(!c)return;let l=c.match(S);if(l&&l[1].length<35){let e=l[1].trim()+`:`,r=l[2].trim();n.push({id:`bullet-${t}-${Date.now()}`,bulletText:c,label:e,content:r||c})}else n.push({id:`bullet-${t}-${Date.now()}`,bulletText:c,content:c})}),{items:n,impressionTitle:i,impressionLines:r,rawText:e}}function me(e){return e?e.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`).map(e=>{let t=e.trim();return t?b.test(t)||x.test(t)?t:`• ${t}`:``}).join(`
`):``}function w(e){if(!e)return new Date().toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`});try{let t=new Date(e);return isNaN(t.getTime())?e:t.toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`})}catch{return e}}function he(e,t){let n=t?.patient,r=t?.patientName||(n?`${n.firstName} ${n.middleName?`${n.middleName} `:``}${n.lastName}`.trim():`Patient Record`),i=t?.uhid||n?.uhid||e.id,a=t?.age||(n?`${n.age} ${n.ageUnit||`Yrs`}`:`Adult`),o=t?.sex||n?.sex||`Male`,s=t?.refDoctor||n?.hospitalDoctor||n?.referenceBy||`Consulting Physician`,c=t?.reportingDoctor||`Consultant Radiologist / Pathologist`,l=w(t?.reportDate),u=C(e.details);return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${e.reportHeader||e.templateName} - ${r}</title>
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
      <div class="no-print-title">${e.templateName}</div>
      <div class="no-print-badge">${e.groupName} • ${e.id}</div>
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
      <h1 class="department-name">DEPARTMENT OF ${(e.groupName||`DIAGNOSTICS`).toUpperCase()} & IMAGING</h1>
      <div class="department-sub">${e.department||`Clinical Diagnostic Services`} • Investigation Report</div>
    </header>

    <!-- Patient Information Grid -->
    <table class="patient-info-table">
      <tr>
        <td style="width: 50%;">
          <span class="info-label">Patient Name:</span>
          <span class="info-val"><strong>${r}</strong></span>
        </td>
        <td style="width: 25%;">
          <span class="info-label">UHID:</span>
          <span class="info-val" style="font-weight: 700; color: #4285F4;">${i}</span>
        </td>
        <td style="width: 25%;">
          <span class="info-label">Date:</span>
          <span class="info-val">${l}</span>
        </td>
      </tr>
      <tr>
        <td>
          <span class="info-label">Ref. Doctor:</span>
          <span class="info-val">${s}</span>
        </td>
        <td>
          <span class="info-label">Age / Sex:</span>
          <span class="info-val">${a} / ${o}</span>
        </td>
        <td>
          <span class="info-label">Modality:</span>
          <span class="info-val">${e.groupName}</span>
        </td>
      </tr>
    </table>

    <!-- Central Underlined Report Title -->
    <div class="report-title-section">
      <h2 class="report-main-title">${e.reportHeader||e.templateName}</h2>
    </div>

    <!-- Section Heading -->
    <div class="section-heading-row">
      <span class="section-heading-title">Details of the Report</span>
    </div>

    <!-- Bullet Points Findings Body -->
    <div class="report-bullets-container">
      ${u.items.length>0?u.items.map(e=>`
        <div class="report-bullet-item">
          <span class="bullet-marker">&#8226;</span>
          <div class="bullet-text">
            ${e.label?`<strong class="bullet-label">${e.label}</strong>`:``}
            <span>${e.content}</span>
          </div>
        </div>
      `).join(``):`
        <div style="padding: 12px; color: #5f6368; font-style: italic;">
          No specific report observations entered for this template.
        </div>
      `}
    </div>

    <!-- Impression / Conclusion Box (if present in template details) -->
    ${u.impressionLines.length>0?`
      <div class="impression-container">
        <div class="impression-title">${u.impressionTitle||`IMPRESSION / CONCLUSION`}:</div>
        <div class="impression-content">
          ${u.impressionLines.map(e=>`
            <div class="impression-line">• ${e}</div>
          `).join(``)}
        </div>
      </div>
    `:``}

    <!-- Signatures Block -->
    <footer class="signatures-footer">
      <div class="sig-block">
        <div class="sig-title">Prepared By</div>
        <div class="sig-subtitle">Medical Transcriptionist / Lab Technologist</div>
      </div>
      <div class="sig-block" style="text-align: right;">
        <div class="sig-title">${c}</div>
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
  <\/script>
</body>
</html>`}function ge(e,t){let n=window.open(`about:blank`,`_blank`);if(!n){alert(`Please allow popups for this site to open the Report Print document.`);return}let r=he(e,t);n.document.open(),n.document.write(r),n.document.close()}var T={pageContainer:`_pageContainer_19cpz_1`,header:`_header_19cpz_14`,pageTitle:`_pageTitle_19cpz_22`,badge:`_badge_19cpz_31`,formContainer:`_formContainer_19cpz_44`,mainSection:`_mainSection_19cpz_51`,fieldGroup:`_fieldGroup_19cpz_62`,label:`_label_19cpz_69`,input:`_input_19cpz_79`,select:`_select_19cpz_92`,textarea:`_textarea_19cpz_110`,actionBar:`_actionBar_19cpz_132`,navControls:`_navControls_19cpz_143`,navBtn:`_navBtn_19cpz_148`,middleActions:`_middleActions_19cpz_167`,rightActions:`_rightActions_19cpz_173`,secondaryBtn:`_secondaryBtn_19cpz_179`,primaryBtn:`_primaryBtn_19cpz_200`,dangerBtn:`_dangerBtn_19cpz_220`,checkboxItem:`_checkboxItem_19cpz_240`,formCard:`_formCard_19cpz_259`,section:`_section_19cpz_259`,topHeader:`_topHeader_19cpz_260`,fieldGroupHorizontal:`_fieldGroupHorizontal_19cpz_261`,formRow:`_formRow_19cpz_261`,inputWithUnit:`_inputWithUnit_19cpz_261`,alertSuccess:`_alertSuccess_19cpz_278`,alertError:`_alertError_19cpz_292`,modalOverlay:`_modalOverlay_19cpz_328`,modalContent:`_modalContent_19cpz_340`,modalHeader:`_modalHeader_19cpz_353`,modalTitle:`_modalTitle_19cpz_362`,modalCloseBtn:`_modalCloseBtn_19cpz_372`,modalBody:`_modalBody_19cpz_389`,modalFooter:`_modalFooter_19cpz_397`,searchToolbar:`_searchToolbar_19cpz_408`,searchBox:`_searchBox_19cpz_414`,filterRow:`_filterRow_19cpz_434`,filterSelect:`_filterSelect_19cpz_441`,tableWrapper:`_tableWrapper_19cpz_452`,modalTable:`_modalTable_19cpz_459`,tableRow:`_tableRow_19cpz_481`,tableRowSelected:`_tableRowSelected_19cpz_490`,badgeActive:`_badgeActive_19cpz_494`,badgeInactive:`_badgeInactive_19cpz_504`,emptyState:`_emptyState_19cpz_514`,detailsHeaderRow:`_detailsHeaderRow_19cpz_526`,detailsToolbar:`_detailsToolbar_19cpz_534`,toolbarBtn:`_toolbarBtn_19cpz_540`,toolbarBtnActive:`_toolbarBtnActive_19cpz_561`,liveBulletPreviewBox:`_liveBulletPreviewBox_19cpz_568`,liveBulletItem:`_liveBulletItem_19cpz_580`,liveBulletDot:`_liveBulletDot_19cpz_589`,liveBulletLabel:`_liveBulletLabel_19cpz_598`,liveImpressionCard:`_liveImpressionCard_19cpz_604`,previewBackdrop:`_previewBackdrop_19cpz_614`,previewContainer:`_previewContainer_19cpz_628`,previewToolbar:`_previewToolbar_19cpz_637`,previewToolbarLeft:`_previewToolbarLeft_19cpz_650`,previewPatientSelect:`_previewPatientSelect_19cpz_656`,previewDocumentSheet:`_previewDocumentSheet_19cpz_673`,docDepartmentHeader:`_docDepartmentHeader_19cpz_685`,docDepartmentName:`_docDepartmentName_19cpz_692`,docDepartmentSub:`_docDepartmentSub_19cpz_701`,docPatientTable:`_docPatientTable_19cpz_709`,docInfoLabel:`_docInfoLabel_19cpz_725`,docInfoVal:`_docInfoVal_19cpz_731`,docTitleSection:`_docTitleSection_19cpz_735`,docMainTitle:`_docMainTitle_19cpz_740`,docSectionHeading:`_docSectionHeading_19cpz_750`,docBulletsContainer:`_docBulletsContainer_19cpz_762`,docBulletItem:`_docBulletItem_19cpz_766`,docBulletDot:`_docBulletDot_19cpz_775`,docBulletText:`_docBulletText_19cpz_784`,docBulletLabel:`_docBulletLabel_19cpz_788`,docImpressionBox:`_docImpressionBox_19cpz_794`,docImpressionTitle:`_docImpressionTitle_19cpz_804`,docImpressionLine:`_docImpressionLine_19cpz_813`,docSignaturesFooter:`_docSignaturesFooter_19cpz_824`,docSigBlock:`_docSigBlock_19cpz_832`,docSigTitle:`_docSigTitle_19cpz_836`,docSigSubtitle:`_docSigSubtitle_19cpz_842`},E=h(),D={id:``,groupName:`Sonography`,templateName:``,reportHeader:``,department:`Radiology & Imaging`,details:``,status:`active`},O=[`Sonography`,`Radiology`,`Pathology`,`Cardiology`,`Echo`,`Endoscopy`,`Biochemistry`,`General`],k=()=>{let e=ae(),[f,p]=(0,y.useState)([]),[h,v]=(0,y.useState)(0),[b,x]=(0,y.useState)(D),[S,w]=(0,y.useState)(!1),[he,k]=(0,y.useState)(!0),[A,j]=(0,y.useState)(!1),[M,_e]=(0,y.useState)(!0),[ve,N]=(0,y.useState)(!1),[P,F]=(0,y.useState)(``),[I,ye]=(0,y.useState)(`All`),[L,be]=(0,y.useState)(`All`),[xe,R]=(0,y.useState)(!1),[Se,z]=(0,y.useState)(!1),[B,Ce]=(0,y.useState)([]),[V,we]=(0,y.useState)(null),[H,U]=(0,y.useState)(`edit`),W=(0,y.useRef)(null),{formRef:Te,handleKeyDown:Ee}=fe(),G=(0,y.useMemo)(()=>C(b.details),[b.details]),{notification:K,setNotification:q,dismissNotification:J}=de();(0,y.useEffect)(()=>{ue.getPatients().then(e=>{e.patients&&e.patients.length>0&&Ce(e.patients)}).catch(()=>{})},[]);let De=()=>{let e=W.current;if(!e){Z(`details`,(b.details?`${b.details}\n`:``)+`• `);return}let t=e.selectionStart,n=e.selectionEnd,r=b.details||``,i=r.substring(0,t),a=r.substring(n),o=i.length>0&&!i.endsWith(`
`)?`
• `:`• `,s=i+o+a;Z(`details`,s),setTimeout(()=>{e.focus();let n=t+o.length;e.setSelectionRange(n,n)},0)},Oe=()=>{let e=me(b.details);Z(`details`,e),q({type:`success`,message:`Report details formatted into clear bullet points.`})},ke=()=>{ge(b,{patient:V})},Y=(0,y.useCallback)(async()=>{k(!0);try{let e=(await _.getReportTemplates()).templates||[];p(e),e.length>0?(v(0),x(e[0]),w(!1)):(x(D),w(!0))}catch(e){let t=e instanceof Error?e.message:`Failed to connect to report templates storage.`;q({type:`error`,message:t})}finally{k(!1)}},[q]);(0,y.useEffect)(()=>{Y()},[Y]);let X=e=>{e>=0&&e<f.length&&(v(e),x(f[e]),w(!1),J())},Z=(e,t)=>{x(n=>({...n,[e]:t}))},Q=()=>!b.groupName||!b.groupName.trim()?`Group Name is required.`:!b.templateName||b.templateName.trim().length<2?`Template Name is required and must be at least 2 characters.`:!b.details||!b.details.trim()?`Report Template Details/Content cannot be empty.`:null,Ae=async()=>{if(!S){w(!0);let e=`TPL-${String(f.length+1).padStart(3,`0`)}`;x({...D,id:e}),q({type:`success`,message:`New report template initialized. Enter template details and click "Save Template" to record.`});return}let e=Q();if(e){q({type:`error`,message:e});return}j(!0);try{let e=await _.createReportTemplate(b);q({type:`success`,message:`Template "${e.template.templateName}" created successfully with ID ${e.template.id}.`});let t=[...f,e.template];p(t),v(t.length-1),x(e.template),w(!1)}catch(e){let t=e instanceof Error?e.message:`Failed to save template.`;q({type:`error`,message:t})}finally{j(!1)}},je=async()=>{if(S){Ae();return}let e=Q();if(e){q({type:`error`,message:e});return}j(!0);try{let e=await _.updateReportTemplate(b.id,b);q({type:`success`,message:`Template "${e.template.templateName}" (${e.template.id}) updated successfully.`});let t=[...f];t[h]=e.template,p(t),x(e.template)}catch(e){let t=e instanceof Error?e.message:`Failed to update template.`;q({type:`error`,message:t})}finally{j(!1)}},Me=async e=>{if(b.id){j(!0);try{let t=await _.deleteReportTemplate(b.id,e);if(q({type:`success`,message:t.message}),R(!1),t.action===`deleted`){let e=f.filter(e=>e.id!==b.id);if(p(e),e.length>0){let t=Math.min(h,e.length-1);v(t),x(e[t])}else x(D),w(!0)}else{let e=[...f];e[h]={...e[h],status:`inactive`},p(e),x(e=>({...e,status:`inactive`}))}}catch(e){let t=e instanceof Error?e.message:`Operation failed.`;q({type:`error`,message:t})}finally{j(!1)}}},$=(0,y.useMemo)(()=>f.filter(e=>{if(L!==`All`&&e.status!==L||I!==`All`&&e.groupName!==I)return!1;if(P.trim()){let t=P.toLowerCase().trim();if(!(e.templateName.toLowerCase().includes(t)||e.id.toLowerCase().includes(t)||e.reportHeader&&e.reportHeader.toLowerCase().includes(t)||e.groupName.toLowerCase().includes(t)||e.department&&e.department.toLowerCase().includes(t)||e.details.toLowerCase().includes(t)))return!1}return!0}),[f,P,I,L]);return(0,E.jsxs)(`div`,{className:T.pageContainer,children:[(0,E.jsxs)(`div`,{className:T.header,children:[(0,E.jsx)(`span`,{className:T.badge,children:S?`New (Total: ${f.length})`:`${f.length>0?h+1:0} Of ${f.length}`}),(0,E.jsx)(`h1`,{className:T.pageTitle,children:`Report Template`}),(0,E.jsxs)(`span`,{style:{fontSize:`13px`,fontWeight:600,color:`var(--primary)`,background:`var(--primary-soft, #e8f0fe)`,padding:`6px 12px`,borderRadius:`6px`},children:[`ID: `,S?`${b.id||`Pending`}`:b.id||`--`]})]}),K&&(0,E.jsxs)(`div`,{className:K.type===`success`?T.alertSuccess:T.alertError,role:`alert`,children:[(0,E.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[K.type===`success`?(0,E.jsx)(a,{size:18}):(0,E.jsx)(i,{size:18}),(0,E.jsx)(`span`,{children:K.message})]}),(0,E.jsx)(`button`,{type:`button`,onClick:J,style:{background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},"aria-label":`Dismiss notification`,children:(0,E.jsx)(m,{size:16})})]}),(0,E.jsx)(`form`,{ref:Te,onKeyDown:Ee,onSubmit:e=>{e.preventDefault(),je()},className:T.formContainer,children:(0,E.jsxs)(`div`,{className:T.mainSection,children:[(0,E.jsxs)(`div`,{className:T.fieldGroup,children:[(0,E.jsx)(`label`,{className:T.label,children:`Group Name :`}),(0,E.jsx)(`select`,{className:T.select,style:{flex:1},value:b.groupName,onChange:e=>Z(`groupName`,e.target.value),children:O.map(e=>(0,E.jsx)(`option`,{value:e,children:e},e))}),(0,E.jsx)(`label`,{className:T.label,style:{width:`100px`},children:`Department :`}),(0,E.jsx)(`input`,{type:`text`,className:T.input,placeholder:`e.g. Radiology, Sonography`,value:b.department||``,onChange:e=>Z(`department`,e.target.value)})]}),(0,E.jsxs)(`div`,{className:T.fieldGroup,children:[(0,E.jsx)(`label`,{className:T.label,children:`TemplateName :`}),(0,E.jsx)(`input`,{type:`text`,className:T.input,placeholder:`e.g. COLOR DOPPLER BOTH UPPER LIMB`,value:b.templateName,onChange:e=>Z(`templateName`,e.target.value)})]}),(0,E.jsxs)(`div`,{className:T.fieldGroup,children:[(0,E.jsx)(`label`,{className:T.label,children:`ReportHeader :`}),(0,E.jsx)(`input`,{type:`text`,className:T.input,placeholder:`e.g. BILATERAL UPPER LIMB DOPPLER`,value:b.reportHeader||``,onChange:e=>Z(`reportHeader`,e.target.value)})]}),(0,E.jsxs)(`div`,{className:T.fieldGroup,style:{alignItems:`flex-start`,flexDirection:`column`},children:[(0,E.jsxs)(`div`,{className:T.detailsHeaderRow,children:[(0,E.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,E.jsx)(`label`,{className:T.label,style:{textAlign:`left`,width:`auto`,paddingTop:0},children:`Details of the Report :`}),(0,E.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:[`(`,G.items.length,` Bullet Points)`]})]}),(0,E.jsxs)(`div`,{className:T.detailsToolbar,children:[(0,E.jsxs)(`button`,{type:`button`,className:T.toolbarBtn,onClick:De,title:`Insert a bullet point at cursor (•)`,children:[(0,E.jsx)(l,{size:13}),` Add Bullet`]}),(0,E.jsxs)(`button`,{type:`button`,className:T.toolbarBtn,onClick:Oe,title:`Automatically convert lines into bullet points`,children:[(0,E.jsx)(pe,{size:13}),` Format as Bullets`]}),(0,E.jsxs)(`button`,{type:`button`,className:`${T.toolbarBtn} ${H===`edit`?T.toolbarBtnActive:``}`,onClick:()=>U(`edit`),title:`Edit raw text`,children:[(0,E.jsx)(s,{size:13}),` Edit Text`]}),(0,E.jsxs)(`button`,{type:`button`,className:`${T.toolbarBtn} ${H===`preview`?T.toolbarBtnActive:``}`,onClick:()=>U(`preview`),title:`Preview bullet points alignment`,children:[(0,E.jsx)(o,{size:13}),` Live Preview`]})]})]}),H===`edit`?(0,E.jsx)(`textarea`,{ref:W,className:T.textarea,rows:12,style:{width:`100%`,minHeight:`260px`,fontFamily:`monospace, sans-serif`,fontSize:`13px`,lineHeight:1.6},placeholder:`Enter structured findings, clinical remarks, observations, impressions... (Each line can start with • or SECTION:)`,value:b.details,onChange:e=>Z(`details`,e.target.value)}):(0,E.jsxs)(`div`,{className:T.liveBulletPreviewBox,children:[G.items.length===0?(0,E.jsx)(`div`,{style:{color:`var(--text-muted)`,fontSize:`13px`,padding:`24px 0`,textAlign:`center`},children:`No details entered yet. Type findings in edit mode to see live bullet formatting.`}):(0,E.jsx)(`div`,{children:G.items.map((e,t)=>(0,E.jsxs)(`div`,{className:T.liveBulletItem,children:[(0,E.jsx)(`span`,{className:T.liveBulletDot,children:`•`}),(0,E.jsxs)(`div`,{style:{flex:1},children:[e.label&&(0,E.jsxs)(`strong`,{className:T.liveBulletLabel,children:[e.label,` `]}),(0,E.jsx)(`span`,{children:e.content})]})]},e.id||t))}),G.impressionTitle&&(0,E.jsxs)(`div`,{className:T.liveImpressionCard,children:[(0,E.jsxs)(`div`,{style:{fontWeight:700,fontSize:`13px`,marginBottom:`4px`,color:`var(--text-main)`},children:[G.impressionTitle,`:`]}),G.impressionLines.map((e,t)=>(0,E.jsx)(`div`,{style:{fontSize:`12.5px`,color:`var(--text-secondary)`,marginBottom:`2px`},children:e},t))]})]})]}),(0,E.jsxs)(`div`,{className:T.fieldGroup,children:[(0,E.jsx)(`label`,{className:T.label,children:`Status :`}),(0,E.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`20px`},children:[(0,E.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,fontSize:`14px`,cursor:`pointer`},children:[(0,E.jsx)(`input`,{type:`radio`,name:`status`,checked:b.status===`active`,onChange:()=>Z(`status`,`active`)}),` Active`]}),(0,E.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,fontSize:`14px`,cursor:`pointer`},children:[(0,E.jsx)(`input`,{type:`radio`,name:`status`,checked:b.status===`inactive`,onChange:()=>Z(`status`,`inactive`)}),` Inactive`]})]})]})]})}),(0,E.jsxs)(`div`,{className:T.actionBar,children:[(0,E.jsxs)(`div`,{className:T.navControls,children:[(0,E.jsx)(`button`,{type:`button`,className:T.navBtn,title:`First Record`,disabled:h===0||S,onClick:()=>X(0),children:(0,E.jsx)(n,{size:18})}),(0,E.jsx)(`button`,{type:`button`,className:T.navBtn,title:`Previous Record`,disabled:h===0||S,onClick:()=>X(h-1),children:(0,E.jsx)(t,{size:18})}),(0,E.jsx)(`button`,{type:`button`,className:T.navBtn,title:`Next Record`,disabled:h>=f.length-1||S,onClick:()=>X(h+1),children:(0,E.jsx)(oe,{size:18})}),(0,E.jsx)(`button`,{type:`button`,className:T.navBtn,title:`Last Record`,disabled:h>=f.length-1||S,onClick:()=>X(f.length-1),children:(0,E.jsx)(r,{size:18})})]}),(0,E.jsxs)(`div`,{className:T.middleActions,children:[(0,E.jsxs)(`button`,{type:`button`,className:T.secondaryBtn,onClick:()=>z(!0),title:`Preview Template Print Layout`,children:[(0,E.jsx)(u,{size:16}),` Print Preview`]}),(0,E.jsx)(`div`,{className:T.checkboxItem,onClick:()=>_e(!M),style:{marginLeft:`8px`,marginRight:`16px`},children:M?(0,E.jsx)(ne,{size:18,color:`var(--primary)`}):(0,E.jsx)(re,{size:18,color:`var(--text-muted)`})}),(0,E.jsxs)(`button`,{type:`button`,className:T.secondaryBtn,title:`Particular Search (Binoculars)`,onClick:()=>N(!0),children:[(0,E.jsx)(d,{size:16}),` Search`]})]}),(0,E.jsxs)(`div`,{className:T.rightActions,children:[(0,E.jsxs)(`button`,{type:`button`,className:T.primaryBtn,disabled:A,onClick:Ae,children:[(0,E.jsx)(ee,{size:16}),` `,S?`Save Template`:`Add`]}),!S&&(0,E.jsxs)(`button`,{type:`button`,className:T.secondaryBtn,disabled:A,onClick:je,children:[(0,E.jsx)(c,{size:16}),` Update`]}),!S&&(0,E.jsxs)(`button`,{type:`button`,className:T.dangerBtn,disabled:A,onClick:()=>R(!0),children:[(0,E.jsx)(ie,{size:16}),` Delete`]}),(0,E.jsxs)(`button`,{type:`button`,className:T.secondaryBtn,style:{marginLeft:`8px`},onClick:()=>e(`/`),children:[(0,E.jsx)(se,{size:16}),` Exit`]})]})]}),ve&&(0,E.jsx)(`div`,{className:T.modalOverlay,onClick:()=>N(!1),children:(0,E.jsxs)(`div`,{className:T.modalContent,onClick:e=>e.stopPropagation(),children:[(0,E.jsxs)(`div`,{className:T.modalHeader,children:[(0,E.jsxs)(`h3`,{className:T.modalTitle,children:[(0,E.jsx)(d,{size:18,color:`var(--primary)`}),` Search Report Templates`]}),(0,E.jsx)(`button`,{type:`button`,className:T.modalCloseBtn,onClick:()=>N(!1),children:(0,E.jsx)(m,{size:18})})]}),(0,E.jsxs)(`div`,{className:T.modalBody,children:[(0,E.jsxs)(`div`,{className:T.searchToolbar,children:[(0,E.jsxs)(`div`,{className:T.searchBox,children:[(0,E.jsx)(d,{size:16,color:`var(--text-muted)`}),(0,E.jsx)(`input`,{type:`text`,placeholder:`Search by Template Name, Code, Group Name, or Header...`,value:P,onChange:e=>F(e.target.value),autoFocus:!0}),P&&(0,E.jsx)(`button`,{type:`button`,onClick:()=>F(``),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-muted)`},children:(0,E.jsx)(m,{size:14})})]}),(0,E.jsxs)(`div`,{className:T.filterRow,children:[(0,E.jsxs)(`select`,{className:T.filterSelect,value:I,onChange:e=>ye(e.target.value),children:[(0,E.jsx)(`option`,{value:`All`,children:`All Groups`}),O.map(e=>(0,E.jsx)(`option`,{value:e,children:e},e))]}),(0,E.jsxs)(`select`,{className:T.filterSelect,value:L,onChange:e=>be(e.target.value),children:[(0,E.jsx)(`option`,{value:`All`,children:`All Statuses`}),(0,E.jsx)(`option`,{value:`active`,children:`Active Only`}),(0,E.jsx)(`option`,{value:`inactive`,children:`Inactive Only`})]}),(0,E.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`,marginLeft:`auto`},children:[`Showing `,$.length,` of `,f.length,` templates`]})]})]}),(0,E.jsx)(`div`,{className:T.tableWrapper,children:(0,E.jsxs)(`table`,{className:T.modalTable,children:[(0,E.jsx)(`thead`,{children:(0,E.jsxs)(`tr`,{children:[(0,E.jsx)(`th`,{children:`Template Code`}),(0,E.jsx)(`th`,{children:`Template Name`}),(0,E.jsx)(`th`,{children:`Group Name`}),(0,E.jsx)(`th`,{children:`Report Header`}),(0,E.jsx)(`th`,{children:`Status`})]})}),(0,E.jsx)(`tbody`,{children:$.length===0?(0,E.jsx)(`tr`,{children:(0,E.jsx)(`td`,{colSpan:5,className:T.emptyState,children:`No report templates match your search criteria.`})}):$.map(e=>(0,E.jsxs)(`tr`,{className:`${T.tableRow} ${e.id===b.id?T.tableRowSelected:``}`,onClick:()=>{let t=f.findIndex(t=>t.id===e.id);t!==-1&&X(t),N(!1)},children:[(0,E.jsx)(`td`,{style:{fontWeight:600,color:`var(--primary)`},children:e.id}),(0,E.jsx)(`td`,{children:(0,E.jsx)(`strong`,{children:e.templateName})}),(0,E.jsx)(`td`,{children:e.groupName}),(0,E.jsx)(`td`,{children:e.reportHeader||`-`}),(0,E.jsx)(`td`,{children:e.status===`active`?(0,E.jsx)(`span`,{className:T.badgeActive,children:`Active`}):(0,E.jsx)(`span`,{className:T.badgeInactive,children:`Inactive`})})]},e.id))})]})})]}),(0,E.jsx)(`div`,{className:T.modalFooter,children:(0,E.jsx)(`button`,{type:`button`,className:T.secondaryBtn,onClick:()=>N(!1),children:`Close`})})]})}),xe&&(0,E.jsx)(`div`,{className:T.modalOverlay,onClick:()=>R(!1),children:(0,E.jsxs)(`div`,{className:T.modalContent,style:{maxWidth:`500px`},onClick:e=>e.stopPropagation(),children:[(0,E.jsxs)(`div`,{className:T.modalHeader,children:[(0,E.jsxs)(`h3`,{className:T.modalTitle,style:{color:`var(--danger)`},children:[(0,E.jsx)(te,{size:20}),` Delete or Deactivate Template`]}),(0,E.jsx)(`button`,{type:`button`,className:T.modalCloseBtn,onClick:()=>R(!1),children:(0,E.jsx)(m,{size:18})})]}),(0,E.jsxs)(`div`,{className:T.modalBody,children:[(0,E.jsxs)(`p`,{style:{margin:0,fontSize:`14px`,lineHeight:1.5},children:[`You are about to remove template `,(0,E.jsxs)(`strong`,{children:[b.templateName,` (`,b.id,`)`]}),`.`]}),(0,E.jsxs)(`div`,{style:{backgroundColor:`var(--warning-soft)`,padding:`12px`,borderRadius:`6px`,fontSize:`13px`,color:`var(--text-main)`},children:[(0,E.jsx)(`strong`,{children:`Clinical Documentation Integrity:`}),` Deactivation prevents future report selections while preserving patient reports that were generated using this template.`]})]}),(0,E.jsxs)(`div`,{className:T.modalFooter,children:[(0,E.jsx)(`button`,{type:`button`,className:T.secondaryBtn,onClick:()=>R(!1),children:`Cancel`}),(0,E.jsx)(`button`,{type:`button`,className:T.secondaryBtn,style:{borderColor:`var(--danger)`,color:`var(--danger)`},onClick:()=>Me(!1),children:`Deactivate (Safe)`}),(0,E.jsx)(`button`,{type:`button`,className:T.dangerBtn,onClick:()=>Me(!0),children:`Delete Permanently`})]})]})}),Se&&(0,E.jsx)(`div`,{className:T.previewBackdrop,onClick:()=>z(!1),children:(0,E.jsxs)(`div`,{className:T.previewContainer,onClick:e=>e.stopPropagation(),children:[(0,E.jsxs)(`div`,{className:T.previewToolbar,children:[(0,E.jsxs)(`div`,{className:T.previewToolbarLeft,children:[(0,E.jsx)(le,{size:18,color:`#60a5fa`}),(0,E.jsx)(`span`,{style:{fontWeight:600,fontSize:`13px`},children:`A4 Report Document Preview`}),(0,E.jsx)(`span`,{style:{color:`#94a3b8`,fontSize:`12px`},children:`|`}),(0,E.jsxs)(`label`,{style:{fontSize:`12px`,color:`#cbd5e1`,display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,E.jsx)(ce,{size:14}),` Sample Patient Data:`,(0,E.jsxs)(`select`,{className:T.previewPatientSelect,value:V?.id||``,onChange:e=>{let t=B.find(t=>t.id===e.target.value);we(t||null)},children:[(0,E.jsx)(`option`,{value:``,children:`Clinical Verification Default`}),B.map(e=>(0,E.jsxs)(`option`,{value:e.id,children:[e.firstName,` `,e.lastName,` (`,e.uhid,`)`]},e.id))]})]})]}),(0,E.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,E.jsxs)(`button`,{type:`button`,className:T.primaryBtn,onClick:ke,style:{background:`var(--primary)`,height:`34px`,fontSize:`12px`},children:[(0,E.jsx)(u,{size:15}),` Print Document (A4)`]}),(0,E.jsxs)(`button`,{type:`button`,className:T.secondaryBtn,onClick:()=>z(!1),style:{background:`#334155`,color:`#fff`,borderColor:`#475569`,height:`34px`,fontSize:`12px`},children:[(0,E.jsx)(m,{size:15}),` Close Preview`]})]})]}),(0,E.jsxs)(`div`,{className:T.previewDocumentSheet,children:[(0,E.jsxs)(`div`,{className:T.docDepartmentHeader,children:[(0,E.jsxs)(`h2`,{className:T.docDepartmentName,children:[`DEPARTMENT OF `,b.groupName.toUpperCase(),` & DIAGNOSTICS`]}),(0,E.jsxs)(`div`,{className:T.docDepartmentSub,children:[g.name,` • `,g.address]})]}),(0,E.jsx)(`table`,{className:T.docPatientTable,children:(0,E.jsxs)(`tbody`,{children:[(0,E.jsxs)(`tr`,{children:[(0,E.jsxs)(`td`,{style:{width:`50%`},children:[(0,E.jsx)(`span`,{className:T.docInfoLabel,children:`Patient Name:`}),(0,E.jsx)(`span`,{className:T.docInfoVal,children:V?`${V.firstName} ${V.middleName?`${V.middleName} `:``}${V.lastName}`.trim():`Sample Patient (Clinical Verification)`})]}),(0,E.jsxs)(`td`,{style:{width:`50%`},children:[(0,E.jsx)(`span`,{className:T.docInfoLabel,children:`Report Date:`}),(0,E.jsx)(`span`,{className:T.docInfoVal,children:new Date().toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`})})]})]}),(0,E.jsxs)(`tr`,{children:[(0,E.jsxs)(`td`,{children:[(0,E.jsx)(`span`,{className:T.docInfoLabel,children:`UHID / ID:`}),(0,E.jsx)(`span`,{className:T.docInfoVal,children:V?.uhid||b.id||`UHID-DEMO-01`})]}),(0,E.jsxs)(`td`,{children:[(0,E.jsx)(`span`,{className:T.docInfoLabel,children:`Age / Gender:`}),(0,E.jsx)(`span`,{className:T.docInfoVal,children:V?`${V.age} ${V.ageUnit||`Yrs`} / ${V.sex}`:`42 Yrs / Male`})]})]}),(0,E.jsxs)(`tr`,{children:[(0,E.jsxs)(`td`,{children:[(0,E.jsx)(`span`,{className:T.docInfoLabel,children:`Ref. Doctor:`}),(0,E.jsx)(`span`,{className:T.docInfoVal,children:V?.hospitalDoctor||V?.referenceBy||`Dr. S. K. Mehta, MD (Med)`})]}),(0,E.jsxs)(`td`,{children:[(0,E.jsx)(`span`,{className:T.docInfoLabel,children:`Reporting Unit:`}),(0,E.jsx)(`span`,{className:T.docInfoVal,children:b.department||`Radiology & Imaging`})]})]})]})}),(0,E.jsx)(`div`,{className:T.docTitleSection,children:(0,E.jsx)(`h3`,{className:T.docMainTitle,children:b.reportHeader||b.templateName||`INVESTIGATION REPORT`})}),(0,E.jsx)(`div`,{className:T.docSectionHeading,children:`DETAILS OF THE REPORT`}),(0,E.jsx)(`div`,{className:T.docBulletsContainer,children:G.items.length===0?(0,E.jsx)(`div`,{style:{color:`#64748b`,fontStyle:`italic`,fontSize:`13px`},children:`No template findings or observations recorded.`}):G.items.map((e,t)=>(0,E.jsxs)(`div`,{className:T.docBulletItem,children:[(0,E.jsx)(`span`,{className:T.docBulletDot,children:`•`}),(0,E.jsxs)(`div`,{className:T.docBulletText,children:[e.label&&(0,E.jsxs)(`strong`,{className:T.docBulletLabel,children:[e.label,` `]}),(0,E.jsx)(`span`,{children:e.content})]})]},e.id||t))}),G.impressionTitle&&(0,E.jsxs)(`div`,{className:T.docImpressionBox,children:[(0,E.jsxs)(`div`,{className:T.docImpressionTitle,children:[G.impressionTitle,`:`]}),G.impressionLines.map((e,t)=>(0,E.jsx)(`div`,{className:T.docImpressionLine,children:e},t))]}),(0,E.jsxs)(`div`,{className:T.docSignaturesFooter,children:[(0,E.jsxs)(`div`,{className:T.docSigBlock,children:[(0,E.jsx)(`div`,{className:T.docSigTitle,children:`Medical Transcriptionist`}),(0,E.jsx)(`div`,{className:T.docSigSubtitle,children:`Verified Diagnostic Format`})]}),(0,E.jsxs)(`div`,{className:T.docSigBlock,style:{textAlign:`right`},children:[(0,E.jsx)(`div`,{className:T.docSigTitle,children:`Consultant Radiologist / Pathologist`}),(0,E.jsx)(`div`,{className:T.docSigSubtitle,children:`Authorized Signatory`})]})]})]})]})})]})};export{k as default};