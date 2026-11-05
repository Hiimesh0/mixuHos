import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{t}from"./chevron-left-pfH1G-ej.js";import{n,t as r}from"./chevrons-right-m5U0MOu0.js";import{i,r as a}from"./masterApi-DrERYV4V.js";import{n as o,t as s}from"./useAutoDismissNotification-DQtooB-U.js";import{t as c}from"./eye-Dg9D7K1J.js";import{t as l}from"./pen-CQMiP4W3.js";import{t as u}from"./plus-CIyt92LX.js";import{t as d}from"./printer-mld-8E2y.js";import{t as ee}from"./save-CsQVGAud.js";import{t as f}from"./search-qyb5mcJL.js";import{t as te}from"./shield-alert-CyJMFnbQ.js";import{n as ne,t as re}from"./square-mOcFIPhb.js";import{t as ie}from"./trash-BP-_k0XO.js";import{D as ae,T as p,f as oe,h as se,i as m,k as h,n as g,s as ce,t as _,y as le}from"./index-LyIh4O24.js";import{t as ue}from"./patientApi-DXolgTsK.js";import{n as de}from"./useFormKeyboardNavigation-DWOKT9vJ.js";var v={name:`list`,size:24,node:[[`path`,{d:`M3 5h.01`,key:`18ugdj`}],[`path`,{d:`M3 12h.01`,key:`nlz23k`}],[`path`,{d:`M3 19h.01`,key:`noohij`}],[`path`,{d:`M8 5h13`,key:`1pao27`}],[`path`,{d:`M8 12h13`,key:`1za7za`}],[`path`,{d:`M8 19h13`,key:`m83p4d`}]]};v.node;var fe=p(v),y={name:`pen-line`,size:24,node:[[`path`,{d:`M13 21h8`,key:`1jsn5i`}],[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}]],aliases:[`edit-3`]};y.node;var pe=p(y),b=e(h(),1),x=/^(IMPRESSION|CONCLUSION|COMMENTS|RECOMMENDATION|RECOMMENDATIONS|REMARKS?|OPINION)\s*[:\-]\s*(.*)$/i,S=/^[\s\t]*([•\-\*–—\u2022\u25CF\u25BA]|\d+[\.\)])\s*/,C=/^([A-Z0-9\s&/()_\-+]{2,35})\s*:\s*(.*)$/;function w(e){if(!e||!e.trim())return{items:[],impressionLines:[],rawText:``};let t=e.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),n=[],r=[],i,a=!1;return t.forEach((e,t)=>{let o=e.trim();if(!o)return;let s=o.match(x);if(s){a=!0,i=s[1].toUpperCase();let e=s[2].trim();e&&r.push(e);return}if(a){let e=o.replace(S,``).trim();e&&r.push(e);return}let c=o.replace(S,``).trim();if(!c)return;let l=c.match(C);if(l&&l[1].length<35){let e=l[1].trim()+`:`,r=l[2].trim();n.push({id:`bullet-${t}-${Date.now()}`,bulletText:c,label:e,content:r||c})}else n.push({id:`bullet-${t}-${Date.now()}`,bulletText:c,content:c})}),{items:n,impressionTitle:i,impressionLines:r,rawText:e}}function me(e){return e?e.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`).map(e=>{let t=e.trim();return t?x.test(t)||S.test(t)?t:`• ${t}`:``}).join(`
`):``}function he(e){if(!e)return new Date().toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`});try{let t=new Date(e);return isNaN(t.getTime())?e:t.toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`})}catch{return e}}function T(e,t){let n=t?.patient,r=t?.patientName||(n?`${n.firstName} ${n.middleName?`${n.middleName} `:``}${n.lastName}`.trim():`Patient Record`),i=t?.uhid||n?.uhid||e.id,a=t?.age||(n?`${n.age} ${n.ageUnit||`Yrs`}`:`Adult`),o=t?.sex||n?.sex||`Male`,s=t?.refDoctor||n?.hospitalDoctor||n?.referenceBy||`Consulting Physician`,c=t?.reportingDoctor||`Consultant Radiologist / Pathologist`,l=he(t?.reportDate),u=w(e.details);return`<!DOCTYPE html>
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
</html>`}function ge(e,t){let n=window.open(`about:blank`,`_blank`);if(!n){alert(`Please allow popups for this site to open the Report Print document.`);return}let r=T(e,t);n.document.open(),n.document.write(r),n.document.close()}var E={pageContainer:`_pageContainer_19cpz_1`,header:`_header_19cpz_14`,pageTitle:`_pageTitle_19cpz_22`,badge:`_badge_19cpz_31`,formContainer:`_formContainer_19cpz_44`,mainSection:`_mainSection_19cpz_51`,fieldGroup:`_fieldGroup_19cpz_62`,label:`_label_19cpz_69`,input:`_input_19cpz_79`,select:`_select_19cpz_92`,textarea:`_textarea_19cpz_110`,actionBar:`_actionBar_19cpz_132`,navControls:`_navControls_19cpz_143`,navBtn:`_navBtn_19cpz_148`,middleActions:`_middleActions_19cpz_167`,rightActions:`_rightActions_19cpz_173`,secondaryBtn:`_secondaryBtn_19cpz_179`,primaryBtn:`_primaryBtn_19cpz_200`,dangerBtn:`_dangerBtn_19cpz_220`,checkboxItem:`_checkboxItem_19cpz_240`,formCard:`_formCard_19cpz_259`,section:`_section_19cpz_259`,topHeader:`_topHeader_19cpz_260`,fieldGroupHorizontal:`_fieldGroupHorizontal_19cpz_261`,formRow:`_formRow_19cpz_261`,inputWithUnit:`_inputWithUnit_19cpz_261`,alertSuccess:`_alertSuccess_19cpz_278`,alertError:`_alertError_19cpz_292`,modalOverlay:`_modalOverlay_19cpz_328`,modalContent:`_modalContent_19cpz_340`,modalHeader:`_modalHeader_19cpz_353`,modalTitle:`_modalTitle_19cpz_362`,modalCloseBtn:`_modalCloseBtn_19cpz_372`,modalBody:`_modalBody_19cpz_389`,modalFooter:`_modalFooter_19cpz_397`,searchToolbar:`_searchToolbar_19cpz_408`,searchBox:`_searchBox_19cpz_414`,filterRow:`_filterRow_19cpz_434`,filterSelect:`_filterSelect_19cpz_441`,tableWrapper:`_tableWrapper_19cpz_452`,modalTable:`_modalTable_19cpz_459`,tableRow:`_tableRow_19cpz_481`,tableRowSelected:`_tableRowSelected_19cpz_490`,badgeActive:`_badgeActive_19cpz_494`,badgeInactive:`_badgeInactive_19cpz_504`,emptyState:`_emptyState_19cpz_514`,detailsHeaderRow:`_detailsHeaderRow_19cpz_526`,detailsToolbar:`_detailsToolbar_19cpz_534`,toolbarBtn:`_toolbarBtn_19cpz_540`,toolbarBtnActive:`_toolbarBtnActive_19cpz_561`,liveBulletPreviewBox:`_liveBulletPreviewBox_19cpz_568`,liveBulletItem:`_liveBulletItem_19cpz_580`,liveBulletDot:`_liveBulletDot_19cpz_589`,liveBulletLabel:`_liveBulletLabel_19cpz_598`,liveImpressionCard:`_liveImpressionCard_19cpz_604`,previewBackdrop:`_previewBackdrop_19cpz_614`,previewContainer:`_previewContainer_19cpz_628`,previewToolbar:`_previewToolbar_19cpz_637`,previewToolbarLeft:`_previewToolbarLeft_19cpz_650`,previewPatientSelect:`_previewPatientSelect_19cpz_656`,previewDocumentSheet:`_previewDocumentSheet_19cpz_673`,docDepartmentHeader:`_docDepartmentHeader_19cpz_685`,docDepartmentName:`_docDepartmentName_19cpz_692`,docDepartmentSub:`_docDepartmentSub_19cpz_701`,docPatientTable:`_docPatientTable_19cpz_709`,docInfoLabel:`_docInfoLabel_19cpz_725`,docInfoVal:`_docInfoVal_19cpz_731`,docTitleSection:`_docTitleSection_19cpz_735`,docMainTitle:`_docMainTitle_19cpz_740`,docSectionHeading:`_docSectionHeading_19cpz_750`,docBulletsContainer:`_docBulletsContainer_19cpz_762`,docBulletItem:`_docBulletItem_19cpz_766`,docBulletDot:`_docBulletDot_19cpz_775`,docBulletText:`_docBulletText_19cpz_784`,docBulletLabel:`_docBulletLabel_19cpz_788`,docImpressionBox:`_docImpressionBox_19cpz_794`,docImpressionTitle:`_docImpressionTitle_19cpz_804`,docImpressionLine:`_docImpressionLine_19cpz_813`,docSignaturesFooter:`_docSignaturesFooter_19cpz_824`,docSigBlock:`_docSigBlock_19cpz_832`,docSigTitle:`_docSigTitle_19cpz_836`,docSigSubtitle:`_docSigSubtitle_19cpz_842`},D=_(),O={id:``,groupName:`Sonography`,templateName:``,reportHeader:``,department:`Radiology & Imaging`,details:``,status:`active`},k=[`Sonography`,`Radiology`,`Pathology`,`Cardiology`,`Echo`,`Endoscopy`,`Biochemistry`,`General`],A=()=>{let e=ae(),[p,h]=(0,b.useState)([]),[_,v]=(0,b.useState)(0),[y,x]=(0,b.useState)(O),[S,C]=(0,b.useState)(!1),[he,T]=(0,b.useState)(!0),[A,j]=(0,b.useState)(!1),[M,_e]=(0,b.useState)(!0),[ve,N]=(0,b.useState)(!1),[P,F]=(0,b.useState)(``),[I,ye]=(0,b.useState)(`All`),[L,be]=(0,b.useState)(`All`),[xe,R]=(0,b.useState)(!1),[Se,z]=(0,b.useState)(!1),[B,Ce]=(0,b.useState)([]),[V,we]=(0,b.useState)(null),[H,U]=(0,b.useState)(`edit`),W=(0,b.useRef)(null),{formRef:Te,handleKeyDown:Ee}=de(),G=(0,b.useMemo)(()=>w(y.details),[y.details]),{notification:K,setNotification:q,dismissNotification:J}=s();(0,b.useEffect)(()=>{ue.getPatients().then(e=>{e.patients&&e.patients.length>0&&Ce(e.patients)}).catch(()=>{})},[]);let De=()=>{let e=W.current;if(!e){Z(`details`,(y.details?`${y.details}\n`:``)+`• `);return}let t=e.selectionStart,n=e.selectionEnd,r=y.details||``,i=r.substring(0,t),a=r.substring(n),o=i.length>0&&!i.endsWith(`
`)?`
• `:`• `,s=i+o+a;Z(`details`,s),setTimeout(()=>{e.focus();let n=t+o.length;e.setSelectionRange(n,n)},0)},Oe=()=>{let e=me(y.details);Z(`details`,e),q({type:`success`,message:`Report details formatted into clear bullet points.`})},ke=()=>{ge(y,{patient:V})},Y=(0,b.useCallback)(async()=>{T(!0);try{let e=(await a.getReportTemplates()).templates||[];h(e),e.length>0?(v(0),x(e[0]),C(!1)):(x(O),C(!0))}catch(e){let t=e instanceof Error?e.message:`Failed to connect to report templates storage.`;q({type:`error`,message:t})}finally{T(!1)}},[q]);(0,b.useEffect)(()=>{Y()},[Y]);let X=e=>{e>=0&&e<p.length&&(v(e),x(p[e]),C(!1),J())},Z=(e,t)=>{x(n=>({...n,[e]:t}))},Ae=()=>!y.groupName||!y.groupName.trim()?`Group Name is required.`:!y.templateName||y.templateName.trim().length<2?`Template Name is required and must be at least 2 characters.`:!y.details||!y.details.trim()?`Report Template Details/Content cannot be empty.`:null,je=async()=>{if(!S){C(!0);let e=`TPL-${String(p.length+1).padStart(3,`0`)}`;x({...O,id:e}),q({type:`success`,message:`New report template initialized. Enter template details and click "Save Template" to record.`});return}let e=Ae();if(e){q({type:`error`,message:e});return}j(!0);try{let e=await a.createReportTemplate(y);q({type:`success`,message:`Template "${e.template.templateName}" created successfully with ID ${e.template.id}.`});let t=[...p,e.template];h(t),v(t.length-1),x(e.template),C(!1)}catch(e){let t=e instanceof Error?e.message:`Failed to save template.`;q({type:`error`,message:t})}finally{j(!1)}},Me=async()=>{if(S){je();return}let e=Ae();if(e){q({type:`error`,message:e});return}j(!0);try{let e=await a.updateReportTemplate(y.id,y);q({type:`success`,message:`Template "${e.template.templateName}" (${e.template.id}) updated successfully.`});let t=[...p];t[_]=e.template,h(t),x(e.template)}catch(e){let t=e instanceof Error?e.message:`Failed to update template.`;q({type:`error`,message:t})}finally{j(!1)}},Q=async e=>{if(y.id){j(!0);try{let t=await a.deleteReportTemplate(y.id,e);if(q({type:`success`,message:t.message}),R(!1),t.action===`deleted`){let e=p.filter(e=>e.id!==y.id);if(h(e),e.length>0){let t=Math.min(_,e.length-1);v(t),x(e[t])}else x(O),C(!0)}else{let e=[...p];e[_]={...e[_],status:`inactive`},h(e),x(e=>({...e,status:`inactive`}))}}catch(e){let t=e instanceof Error?e.message:`Operation failed.`;q({type:`error`,message:t})}finally{j(!1)}}},$=(0,b.useMemo)(()=>p.filter(e=>{if(L!==`All`&&e.status!==L||I!==`All`&&e.groupName!==I)return!1;if(P.trim()){let t=P.toLowerCase().trim();if(!(e.templateName.toLowerCase().includes(t)||e.id.toLowerCase().includes(t)||e.reportHeader&&e.reportHeader.toLowerCase().includes(t)||e.groupName.toLowerCase().includes(t)||e.department&&e.department.toLowerCase().includes(t)||e.details.toLowerCase().includes(t)))return!1}return!0}),[p,P,I,L]);return(0,D.jsxs)(`div`,{className:E.pageContainer,children:[(0,D.jsxs)(`div`,{className:E.header,children:[(0,D.jsx)(`span`,{className:E.badge,children:S?`New (Total: ${p.length})`:`${p.length>0?_+1:0} Of ${p.length}`}),(0,D.jsx)(`h1`,{className:E.pageTitle,children:`Report Template`}),(0,D.jsxs)(`span`,{style:{fontSize:`13px`,fontWeight:600,color:`var(--primary)`,background:`var(--primary-soft, #e8f0fe)`,padding:`6px 12px`,borderRadius:`6px`},children:[`ID: `,S?`${y.id||`Pending`}`:y.id||`--`]})]}),K&&(0,D.jsxs)(`div`,{className:K.type===`success`?E.alertSuccess:E.alertError,role:`alert`,children:[(0,D.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[K.type===`success`?(0,D.jsx)(o,{size:18}):(0,D.jsx)(i,{size:18}),(0,D.jsx)(`span`,{children:K.message})]}),(0,D.jsx)(`button`,{type:`button`,onClick:J,style:{background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},"aria-label":`Dismiss notification`,children:(0,D.jsx)(m,{size:16})})]}),(0,D.jsx)(`form`,{ref:Te,onKeyDown:Ee,onSubmit:e=>{e.preventDefault(),Me()},className:E.formContainer,children:(0,D.jsxs)(`div`,{className:E.mainSection,children:[(0,D.jsxs)(`div`,{className:E.fieldGroup,children:[(0,D.jsx)(`label`,{className:E.label,children:`Group Name :`}),(0,D.jsx)(`select`,{className:E.select,style:{flex:1},value:y.groupName,onChange:e=>Z(`groupName`,e.target.value),children:k.map(e=>(0,D.jsx)(`option`,{value:e,children:e},e))}),(0,D.jsx)(`label`,{className:E.label,style:{width:`100px`},children:`Department :`}),(0,D.jsx)(`input`,{type:`text`,className:E.input,placeholder:`e.g. Radiology, Sonography`,value:y.department||``,onChange:e=>Z(`department`,e.target.value)})]}),(0,D.jsxs)(`div`,{className:E.fieldGroup,children:[(0,D.jsx)(`label`,{className:E.label,children:`TemplateName :`}),(0,D.jsx)(`input`,{type:`text`,className:E.input,placeholder:`e.g. COLOR DOPPLER BOTH UPPER LIMB`,value:y.templateName,onChange:e=>Z(`templateName`,e.target.value)})]}),(0,D.jsxs)(`div`,{className:E.fieldGroup,children:[(0,D.jsx)(`label`,{className:E.label,children:`ReportHeader :`}),(0,D.jsx)(`input`,{type:`text`,className:E.input,placeholder:`e.g. BILATERAL UPPER LIMB DOPPLER`,value:y.reportHeader||``,onChange:e=>Z(`reportHeader`,e.target.value)})]}),(0,D.jsxs)(`div`,{className:E.fieldGroup,style:{alignItems:`flex-start`,flexDirection:`column`},children:[(0,D.jsxs)(`div`,{className:E.detailsHeaderRow,children:[(0,D.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,D.jsx)(`label`,{className:E.label,style:{textAlign:`left`,width:`auto`,paddingTop:0},children:`Details of the Report :`}),(0,D.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`},children:[`(`,G.items.length,` Bullet Points)`]})]}),(0,D.jsxs)(`div`,{className:E.detailsToolbar,children:[(0,D.jsxs)(`button`,{type:`button`,className:E.toolbarBtn,onClick:De,title:`Insert a bullet point at cursor (•)`,children:[(0,D.jsx)(u,{size:13}),` Add Bullet`]}),(0,D.jsxs)(`button`,{type:`button`,className:E.toolbarBtn,onClick:Oe,title:`Automatically convert lines into bullet points`,children:[(0,D.jsx)(fe,{size:13}),` Format as Bullets`]}),(0,D.jsxs)(`button`,{type:`button`,className:`${E.toolbarBtn} ${H===`edit`?E.toolbarBtnActive:``}`,onClick:()=>U(`edit`),title:`Edit raw text`,children:[(0,D.jsx)(pe,{size:13}),` Edit Text`]}),(0,D.jsxs)(`button`,{type:`button`,className:`${E.toolbarBtn} ${H===`preview`?E.toolbarBtnActive:``}`,onClick:()=>U(`preview`),title:`Preview bullet points alignment`,children:[(0,D.jsx)(c,{size:13}),` Live Preview`]})]})]}),H===`edit`?(0,D.jsx)(`textarea`,{ref:W,className:E.textarea,rows:12,style:{width:`100%`,minHeight:`260px`,fontFamily:`monospace, sans-serif`,fontSize:`13px`,lineHeight:1.6},placeholder:`Enter structured findings, clinical remarks, observations, impressions... (Each line can start with • or SECTION:)`,value:y.details,onChange:e=>Z(`details`,e.target.value)}):(0,D.jsxs)(`div`,{className:E.liveBulletPreviewBox,children:[G.items.length===0?(0,D.jsx)(`div`,{style:{color:`var(--text-muted)`,fontSize:`13px`,padding:`24px 0`,textAlign:`center`},children:`No details entered yet. Type findings in edit mode to see live bullet formatting.`}):(0,D.jsx)(`div`,{children:G.items.map((e,t)=>(0,D.jsxs)(`div`,{className:E.liveBulletItem,children:[(0,D.jsx)(`span`,{className:E.liveBulletDot,children:`•`}),(0,D.jsxs)(`div`,{style:{flex:1},children:[e.label&&(0,D.jsxs)(`strong`,{className:E.liveBulletLabel,children:[e.label,` `]}),(0,D.jsx)(`span`,{children:e.content})]})]},e.id||t))}),G.impressionTitle&&(0,D.jsxs)(`div`,{className:E.liveImpressionCard,children:[(0,D.jsxs)(`div`,{style:{fontWeight:700,fontSize:`13px`,marginBottom:`4px`,color:`var(--text-main)`},children:[G.impressionTitle,`:`]}),G.impressionLines.map((e,t)=>(0,D.jsx)(`div`,{style:{fontSize:`12.5px`,color:`var(--text-secondary)`,marginBottom:`2px`},children:e},t))]})]})]}),(0,D.jsxs)(`div`,{className:E.fieldGroup,children:[(0,D.jsx)(`label`,{className:E.label,children:`Status :`}),(0,D.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`20px`},children:[(0,D.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,fontSize:`14px`,cursor:`pointer`},children:[(0,D.jsx)(`input`,{type:`radio`,name:`status`,checked:y.status===`active`,onChange:()=>Z(`status`,`active`)}),` Active`]}),(0,D.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:`6px`,fontSize:`14px`,cursor:`pointer`},children:[(0,D.jsx)(`input`,{type:`radio`,name:`status`,checked:y.status===`inactive`,onChange:()=>Z(`status`,`inactive`)}),` Inactive`]})]})]})]})}),(0,D.jsxs)(`div`,{className:E.actionBar,children:[(0,D.jsxs)(`div`,{className:E.navControls,children:[(0,D.jsx)(`button`,{type:`button`,className:E.navBtn,title:`First Record`,disabled:_===0||S,onClick:()=>X(0),children:(0,D.jsx)(n,{size:18})}),(0,D.jsx)(`button`,{type:`button`,className:E.navBtn,title:`Previous Record`,disabled:_===0||S,onClick:()=>X(_-1),children:(0,D.jsx)(t,{size:18})}),(0,D.jsx)(`button`,{type:`button`,className:E.navBtn,title:`Next Record`,disabled:_>=p.length-1||S,onClick:()=>X(_+1),children:(0,D.jsx)(le,{size:18})}),(0,D.jsx)(`button`,{type:`button`,className:E.navBtn,title:`Last Record`,disabled:_>=p.length-1||S,onClick:()=>X(p.length-1),children:(0,D.jsx)(r,{size:18})})]}),(0,D.jsxs)(`div`,{className:E.middleActions,children:[(0,D.jsxs)(`button`,{type:`button`,className:E.secondaryBtn,onClick:()=>z(!0),title:`Preview Template Print Layout`,children:[(0,D.jsx)(d,{size:16}),` Print Preview`]}),(0,D.jsx)(`div`,{className:E.checkboxItem,onClick:()=>_e(!M),style:{marginLeft:`8px`,marginRight:`16px`},children:M?(0,D.jsx)(ne,{size:18,color:`var(--primary)`}):(0,D.jsx)(re,{size:18,color:`var(--text-muted)`})}),(0,D.jsxs)(`button`,{type:`button`,className:E.secondaryBtn,title:`Particular Search (Binoculars)`,onClick:()=>N(!0),children:[(0,D.jsx)(f,{size:16}),` Search`]})]}),(0,D.jsxs)(`div`,{className:E.rightActions,children:[(0,D.jsxs)(`button`,{type:`button`,className:E.primaryBtn,disabled:A,onClick:je,children:[(0,D.jsx)(ee,{size:16}),` `,S?`Save Template`:`Add`]}),!S&&(0,D.jsxs)(`button`,{type:`button`,className:E.secondaryBtn,disabled:A,onClick:Me,children:[(0,D.jsx)(l,{size:16}),` Update`]}),!S&&(0,D.jsxs)(`button`,{type:`button`,className:E.dangerBtn,disabled:A,onClick:()=>R(!0),children:[(0,D.jsx)(ie,{size:16}),` Delete`]}),(0,D.jsxs)(`button`,{type:`button`,className:E.secondaryBtn,style:{marginLeft:`8px`},onClick:()=>e(`/`),children:[(0,D.jsx)(oe,{size:16}),` Exit`]})]})]}),ve&&(0,D.jsx)(`div`,{className:E.modalOverlay,onClick:()=>N(!1),children:(0,D.jsxs)(`div`,{className:E.modalContent,onClick:e=>e.stopPropagation(),children:[(0,D.jsxs)(`div`,{className:E.modalHeader,children:[(0,D.jsxs)(`h3`,{className:E.modalTitle,children:[(0,D.jsx)(f,{size:18,color:`var(--primary)`}),` Search Report Templates`]}),(0,D.jsx)(`button`,{type:`button`,className:E.modalCloseBtn,onClick:()=>N(!1),children:(0,D.jsx)(m,{size:18})})]}),(0,D.jsxs)(`div`,{className:E.modalBody,children:[(0,D.jsxs)(`div`,{className:E.searchToolbar,children:[(0,D.jsxs)(`div`,{className:E.searchBox,children:[(0,D.jsx)(f,{size:16,color:`var(--text-muted)`}),(0,D.jsx)(`input`,{type:`text`,placeholder:`Search by Template Name, Code, Group Name, or Header...`,value:P,onChange:e=>F(e.target.value),autoFocus:!0}),P&&(0,D.jsx)(`button`,{type:`button`,onClick:()=>F(``),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-muted)`},children:(0,D.jsx)(m,{size:14})})]}),(0,D.jsxs)(`div`,{className:E.filterRow,children:[(0,D.jsxs)(`select`,{className:E.filterSelect,value:I,onChange:e=>ye(e.target.value),children:[(0,D.jsx)(`option`,{value:`All`,children:`All Groups`}),k.map(e=>(0,D.jsx)(`option`,{value:e,children:e},e))]}),(0,D.jsxs)(`select`,{className:E.filterSelect,value:L,onChange:e=>be(e.target.value),children:[(0,D.jsx)(`option`,{value:`All`,children:`All Statuses`}),(0,D.jsx)(`option`,{value:`active`,children:`Active Only`}),(0,D.jsx)(`option`,{value:`inactive`,children:`Inactive Only`})]}),(0,D.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`,marginLeft:`auto`},children:[`Showing `,$.length,` of `,p.length,` templates`]})]})]}),(0,D.jsx)(`div`,{className:E.tableWrapper,children:(0,D.jsxs)(`table`,{className:E.modalTable,children:[(0,D.jsx)(`thead`,{children:(0,D.jsxs)(`tr`,{children:[(0,D.jsx)(`th`,{children:`Template Code`}),(0,D.jsx)(`th`,{children:`Template Name`}),(0,D.jsx)(`th`,{children:`Group Name`}),(0,D.jsx)(`th`,{children:`Report Header`}),(0,D.jsx)(`th`,{children:`Status`})]})}),(0,D.jsx)(`tbody`,{children:$.length===0?(0,D.jsx)(`tr`,{children:(0,D.jsx)(`td`,{colSpan:5,className:E.emptyState,children:`No report templates match your search criteria.`})}):$.map(e=>(0,D.jsxs)(`tr`,{className:`${E.tableRow} ${e.id===y.id?E.tableRowSelected:``}`,onClick:()=>{let t=p.findIndex(t=>t.id===e.id);t!==-1&&X(t),N(!1)},children:[(0,D.jsx)(`td`,{style:{fontWeight:600,color:`var(--primary)`},children:e.id}),(0,D.jsx)(`td`,{children:(0,D.jsx)(`strong`,{children:e.templateName})}),(0,D.jsx)(`td`,{children:e.groupName}),(0,D.jsx)(`td`,{children:e.reportHeader||`-`}),(0,D.jsx)(`td`,{children:e.status===`active`?(0,D.jsx)(`span`,{className:E.badgeActive,children:`Active`}):(0,D.jsx)(`span`,{className:E.badgeInactive,children:`Inactive`})})]},e.id))})]})})]}),(0,D.jsx)(`div`,{className:E.modalFooter,children:(0,D.jsx)(`button`,{type:`button`,className:E.secondaryBtn,onClick:()=>N(!1),children:`Close`})})]})}),xe&&(0,D.jsx)(`div`,{className:E.modalOverlay,onClick:()=>R(!1),children:(0,D.jsxs)(`div`,{className:E.modalContent,style:{maxWidth:`500px`},onClick:e=>e.stopPropagation(),children:[(0,D.jsxs)(`div`,{className:E.modalHeader,children:[(0,D.jsxs)(`h3`,{className:E.modalTitle,style:{color:`var(--danger)`},children:[(0,D.jsx)(te,{size:20}),` Delete or Deactivate Template`]}),(0,D.jsx)(`button`,{type:`button`,className:E.modalCloseBtn,onClick:()=>R(!1),children:(0,D.jsx)(m,{size:18})})]}),(0,D.jsxs)(`div`,{className:E.modalBody,children:[(0,D.jsxs)(`p`,{style:{margin:0,fontSize:`14px`,lineHeight:1.5},children:[`You are about to remove template `,(0,D.jsxs)(`strong`,{children:[y.templateName,` (`,y.id,`)`]}),`.`]}),(0,D.jsxs)(`div`,{style:{backgroundColor:`var(--warning-soft)`,padding:`12px`,borderRadius:`6px`,fontSize:`13px`,color:`var(--text-main)`},children:[(0,D.jsx)(`strong`,{children:`Clinical Documentation Integrity:`}),` Deactivation prevents future report selections while preserving patient reports that were generated using this template.`]})]}),(0,D.jsxs)(`div`,{className:E.modalFooter,children:[(0,D.jsx)(`button`,{type:`button`,className:E.secondaryBtn,onClick:()=>R(!1),children:`Cancel`}),(0,D.jsx)(`button`,{type:`button`,className:E.secondaryBtn,style:{borderColor:`var(--danger)`,color:`var(--danger)`},onClick:()=>Q(!1),children:`Deactivate (Safe)`}),(0,D.jsx)(`button`,{type:`button`,className:E.dangerBtn,onClick:()=>Q(!0),children:`Delete Permanently`})]})]})}),Se&&(0,D.jsx)(`div`,{className:E.previewBackdrop,onClick:()=>z(!1),children:(0,D.jsxs)(`div`,{className:E.previewContainer,onClick:e=>e.stopPropagation(),children:[(0,D.jsxs)(`div`,{className:E.previewToolbar,children:[(0,D.jsxs)(`div`,{className:E.previewToolbarLeft,children:[(0,D.jsx)(se,{size:18,color:`#60a5fa`}),(0,D.jsx)(`span`,{style:{fontWeight:600,fontSize:`13px`},children:`A4 Report Document Preview`}),(0,D.jsx)(`span`,{style:{color:`#94a3b8`,fontSize:`12px`},children:`|`}),(0,D.jsxs)(`label`,{style:{fontSize:`12px`,color:`#cbd5e1`,display:`flex`,alignItems:`center`,gap:`6px`},children:[(0,D.jsx)(ce,{size:14}),` Sample Patient Data:`,(0,D.jsxs)(`select`,{className:E.previewPatientSelect,value:V?.id||``,onChange:e=>{let t=B.find(t=>t.id===e.target.value);we(t||null)},children:[(0,D.jsx)(`option`,{value:``,children:`Clinical Verification Default`}),B.map(e=>(0,D.jsxs)(`option`,{value:e.id,children:[e.firstName,` `,e.lastName,` (`,e.uhid,`)`]},e.id))]})]})]}),(0,D.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[(0,D.jsxs)(`button`,{type:`button`,className:E.primaryBtn,onClick:ke,style:{background:`var(--primary)`,height:`34px`,fontSize:`12px`},children:[(0,D.jsx)(d,{size:15}),` Print Document (A4)`]}),(0,D.jsxs)(`button`,{type:`button`,className:E.secondaryBtn,onClick:()=>z(!1),style:{background:`#334155`,color:`#fff`,borderColor:`#475569`,height:`34px`,fontSize:`12px`},children:[(0,D.jsx)(m,{size:15}),` Close Preview`]})]})]}),(0,D.jsxs)(`div`,{className:E.previewDocumentSheet,children:[(0,D.jsxs)(`div`,{className:E.docDepartmentHeader,children:[(0,D.jsxs)(`h2`,{className:E.docDepartmentName,children:[`DEPARTMENT OF `,y.groupName.toUpperCase(),` & DIAGNOSTICS`]}),(0,D.jsxs)(`div`,{className:E.docDepartmentSub,children:[g.name,` • `,g.address]})]}),(0,D.jsx)(`table`,{className:E.docPatientTable,children:(0,D.jsxs)(`tbody`,{children:[(0,D.jsxs)(`tr`,{children:[(0,D.jsxs)(`td`,{style:{width:`50%`},children:[(0,D.jsx)(`span`,{className:E.docInfoLabel,children:`Patient Name:`}),(0,D.jsx)(`span`,{className:E.docInfoVal,children:V?`${V.firstName} ${V.middleName?`${V.middleName} `:``}${V.lastName}`.trim():`Sample Patient (Clinical Verification)`})]}),(0,D.jsxs)(`td`,{style:{width:`50%`},children:[(0,D.jsx)(`span`,{className:E.docInfoLabel,children:`Report Date:`}),(0,D.jsx)(`span`,{className:E.docInfoVal,children:new Date().toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`})})]})]}),(0,D.jsxs)(`tr`,{children:[(0,D.jsxs)(`td`,{children:[(0,D.jsx)(`span`,{className:E.docInfoLabel,children:`UHID / ID:`}),(0,D.jsx)(`span`,{className:E.docInfoVal,children:V?.uhid||y.id||`UHID-DEMO-01`})]}),(0,D.jsxs)(`td`,{children:[(0,D.jsx)(`span`,{className:E.docInfoLabel,children:`Age / Gender:`}),(0,D.jsx)(`span`,{className:E.docInfoVal,children:V?`${V.age} ${V.ageUnit||`Yrs`} / ${V.sex}`:`42 Yrs / Male`})]})]}),(0,D.jsxs)(`tr`,{children:[(0,D.jsxs)(`td`,{children:[(0,D.jsx)(`span`,{className:E.docInfoLabel,children:`Ref. Doctor:`}),(0,D.jsx)(`span`,{className:E.docInfoVal,children:V?.hospitalDoctor||V?.referenceBy||`Dr. S. K. Mehta, MD (Med)`})]}),(0,D.jsxs)(`td`,{children:[(0,D.jsx)(`span`,{className:E.docInfoLabel,children:`Reporting Unit:`}),(0,D.jsx)(`span`,{className:E.docInfoVal,children:y.department||`Radiology & Imaging`})]})]})]})}),(0,D.jsx)(`div`,{className:E.docTitleSection,children:(0,D.jsx)(`h3`,{className:E.docMainTitle,children:y.reportHeader||y.templateName||`INVESTIGATION REPORT`})}),(0,D.jsx)(`div`,{className:E.docSectionHeading,children:`DETAILS OF THE REPORT`}),(0,D.jsx)(`div`,{className:E.docBulletsContainer,children:G.items.length===0?(0,D.jsx)(`div`,{style:{color:`#64748b`,fontStyle:`italic`,fontSize:`13px`},children:`No template findings or observations recorded.`}):G.items.map((e,t)=>(0,D.jsxs)(`div`,{className:E.docBulletItem,children:[(0,D.jsx)(`span`,{className:E.docBulletDot,children:`•`}),(0,D.jsxs)(`div`,{className:E.docBulletText,children:[e.label&&(0,D.jsxs)(`strong`,{className:E.docBulletLabel,children:[e.label,` `]}),(0,D.jsx)(`span`,{children:e.content})]})]},e.id||t))}),G.impressionTitle&&(0,D.jsxs)(`div`,{className:E.docImpressionBox,children:[(0,D.jsxs)(`div`,{className:E.docImpressionTitle,children:[G.impressionTitle,`:`]}),G.impressionLines.map((e,t)=>(0,D.jsx)(`div`,{className:E.docImpressionLine,children:e},t))]}),(0,D.jsxs)(`div`,{className:E.docSignaturesFooter,children:[(0,D.jsxs)(`div`,{className:E.docSigBlock,children:[(0,D.jsx)(`div`,{className:E.docSigTitle,children:`Medical Transcriptionist`}),(0,D.jsx)(`div`,{className:E.docSigSubtitle,children:`Verified Diagnostic Format`})]}),(0,D.jsxs)(`div`,{className:E.docSigBlock,style:{textAlign:`right`},children:[(0,D.jsx)(`div`,{className:E.docSigTitle,children:`Consultant Radiologist / Pathologist`}),(0,D.jsx)(`div`,{className:E.docSigSubtitle,children:`Authorized Signatory`})]})]})]})]})})]})};export{A as default};