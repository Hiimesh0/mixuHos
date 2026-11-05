import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{t}from"./chevron-left-DFSAIqKd.js";import{n,t as r}from"./chevrons-right-B91geiqR.js";import{i,t as a}from"./masterApi-Cv-x-0XI.js";import{n as o,t as ee}from"./useAutoDismissNotification-Cc1OW-fs.js";import{t as te}from"./pen-gUDXyM--.js";import{t as s}from"./printer-Q3iCrJRU.js";import{t as c}from"./save-BOvjpQa-.js";import{t as l}from"./search-DsmryQBl.js";import{t as ne}from"./shield-alert-C7aiN9Z5.js";import{n as u,t as d}from"./square-BWF617vT.js";import{t as re}from"./trash-CfgiS5zZ.js";import{D as ie,f,i as p,k as m,n as h,t as g,y as ae}from"./index-BJ-KJ3GI.js";import{n as _}from"./useFormKeyboardNavigation-DflRluCr.js";var v=e(m(),1);function y(e){let t=`${e.title?`${e.title} `:``}${e.drName}`,n=new Date().toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`}),r=[e.address,e.area,e.city,e.state,e.pin].filter(Boolean).join(`, `)||`Not specified`;return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Doctor Profile - ${t}</title>
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
        <div class="hosp-name">${h.name}</div>
        <div class="hosp-tag">${h.address} | Phone: ${h.phone}</div>
      </div>
      <div class="doc-meta-badge">
        <div><strong>Date:</strong> ${n}</div>
        <div><strong>Doctor ID:</strong> ${e.id}</div>
      </div>
    </header>

    <div class="profile-title-bar">
      <div>
        <div class="dr-hero-name">${t}</div>
        <div class="dr-hero-degree">${e.degree||`Medical Practitioner`} • ${e.speciality||`General Medicine`}</div>
      </div>
      <div class="dr-status-pill">${e.status||`Active`}</div>
    </div>

    <div class="section-title">Professional Credentials & Affiliation</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Doctor Type / Role</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.drHosRef||`Hospital Doctor`} (${e.drType||`Full Time`})</span>
      </div>
      <div class="info-row">
        <span class="info-label">Speciality</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.speciality||`--`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Medical Reg. No</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.drRegNo||`Pending Verification`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Department</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.department||`--`}</span>
      </div>
    </div>

    <div class="section-title">Contact & Communication</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Mobile Number</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.mobileNo||`--`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email Address</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.email||`--`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Residence Phone</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.phNoR||`--`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Clinic Phone</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.clinicPhNo||`--`}</span>
      </div>
    </div>

    <div class="section-title">Clinic & Practice Location</div>
    <div class="info-grid">
      <div class="info-row" style="grid-column: span 2;">
        <span class="info-label">Clinic / Hospital Name</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.clinicName||h.name}</span>
      </div>
      <div class="info-row" style="grid-column: span 2;">
        <span class="info-label">Practice Address</span>
        <span class="info-colon">:</span>
        <span class="info-val">${r}</span>
      </div>
    </div>

    <div class="section-title">Consultation & Financial Schedule</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Consultation Fee</span>
        <span class="info-colon">:</span>
        <span class="info-val">₹ ${e.consultationFee===void 0?`500`:e.consultationFee}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Follow-up Fee</span>
        <span class="info-colon">:</span>
        <span class="info-val">₹ ${e.followupFee===void 0?`300`:e.followupFee}</span>
      </div>
      <div class="info-row">
        <span class="info-label">PAN Number</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.panNo||`--`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Aadhar Number</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.adharNo||`--`}</span>
      </div>
    </div>

    <footer class="print-footer">
      <div>Generated by <strong>Mixu Infosystem EMR</strong> • Doctor Master Record</div>
      <div>Authorized Medical Administration</div>
    </footer>
  </div>
</body>
</html>`}function b(e){let t=window.open(`about:blank`,`_blank`);if(!t){alert(`Please allow popups to open the Doctor Profile print preview.`);return}let n=y(e);t.document.open(),t.document.write(n),t.document.close()}var x={pageContainer:`_pageContainer_1d9rj_1`,header:`_header_1d9rj_14`,pageTitle:`_pageTitle_1d9rj_22`,headerLeft:`_headerLeft_1d9rj_29`,recordCounter:`_recordCounter_1d9rj_35`,idBadge:`_idBadge_1d9rj_45`,formContainer:`_formContainer_1d9rj_56`,section:`_section_1d9rj_64`,sectionTitle:`_sectionTitle_1d9rj_74`,row:`_row_1d9rj_84`,col:`_col_1d9rj_91`,fieldGroup:`_fieldGroup_1d9rj_99`,fieldGroupVertical:`_fieldGroupVertical_1d9rj_105`,label:`_label_1d9rj_112`,input:`_input_1d9rj_126`,helperText:`_helperText_1d9rj_144`,checkboxItem:`_checkboxItem_1d9rj_151`,radioGroup:`_radioGroup_1d9rj_161`,radioLabel:`_radioLabel_1d9rj_172`,actionBar:`_actionBar_1d9rj_183`,navControls:`_navControls_1d9rj_194`,navBtn:`_navBtn_1d9rj_199`,middleActions:`_middleActions_1d9rj_218`,printBtn:`_printBtn_1d9rj_224`,rightActions:`_rightActions_1d9rj_244`,secondaryBtn:`_secondaryBtn_1d9rj_250`,primaryBtn:`_primaryBtn_1d9rj_271`,formCard:`_formCard_1d9rj_300`,mainSection:`_mainSection_1d9rj_300`,topHeader:`_topHeader_1d9rj_301`,headerRight:`_headerRight_1d9rj_302`,titleArea:`_titleArea_1d9rj_302`,headerActions:`_headerActions_1d9rj_302`,fieldGroupHorizontal:`_fieldGroupHorizontal_1d9rj_304`,formRow:`_formRow_1d9rj_304`,inputWithUnit:`_inputWithUnit_1d9rj_304`,select:`_select_1d9rj_306`,textarea:`_textarea_1d9rj_306`,alertSuccess:`_alertSuccess_1d9rj_321`,alertError:`_alertError_1d9rj_335`,dangerBtn:`_dangerBtn_1d9rj_349`,modalOverlay:`_modalOverlay_1d9rj_371`,modalContent:`_modalContent_1d9rj_383`,modalHeader:`_modalHeader_1d9rj_396`,modalTitle:`_modalTitle_1d9rj_405`,modalCloseBtn:`_modalCloseBtn_1d9rj_415`,modalBody:`_modalBody_1d9rj_432`,modalFooter:`_modalFooter_1d9rj_440`,searchToolbar:`_searchToolbar_1d9rj_451`,searchBox:`_searchBox_1d9rj_457`,filterRow:`_filterRow_1d9rj_477`,filterSelect:`_filterSelect_1d9rj_484`,tableWrapper:`_tableWrapper_1d9rj_495`,modalTable:`_modalTable_1d9rj_502`,tableRow:`_tableRow_1d9rj_524`,tableRowSelected:`_tableRowSelected_1d9rj_533`,badgeActive:`_badgeActive_1d9rj_537`,badgeInactive:`_badgeInactive_1d9rj_547`,emptyState:`_emptyState_1d9rj_557`},S=g(),C={id:``,drHosRef:`Hospital Doctor`,drType:`Consultant Physician`,title:`Dr.`,drName:``,degree:``,speciality:``,department:``,drRegNo:``,hospitalName:!0,birthDate:``,wedding:``,panNo:``,adharNo:``,mobileNo:``,phNoR:``,email:``,consultationFee:500,followupFee:300,clinicName:``,address:``,area:``,city:`SURAT`,pin:``,state:`GUJARAT`,country:`INDIA`,clinicPhNo:``,status:`active`},w=()=>{let e=ie(),[m,g]=(0,v.useState)([]),[y,w]=(0,v.useState)(0),[T,E]=(0,v.useState)(C),[D,O]=(0,v.useState)(!1),[oe,k]=(0,v.useState)(!0),[A,j]=(0,v.useState)(!1),[M,se]=(0,v.useState)(!1),{formRef:ce,handleKeyDown:le}=_(),[ue,N]=(0,v.useState)(!1),[P,F]=(0,v.useState)(``),[I,L]=(0,v.useState)(`All`),[R,z]=(0,v.useState)(`All`),[B,V]=(0,v.useState)(!1),[H,U]=(0,v.useState)(!1),{notification:W,setNotification:G,dismissNotification:K}=ee(),q=(0,v.useCallback)(async()=>{k(!0);try{let e=(await a.getDoctors()).doctors||[];g(e),e.length>0?(w(0),E(e[0]),O(!1)):(E(C),O(!0))}catch(e){let t=e instanceof Error?e.message:`Failed to connect to doctors storage.`;G({type:`error`,message:t})}finally{k(!1)}},[G]);(0,v.useEffect)(()=>{q()},[q]);let J=e=>{e>=0&&e<m.length&&(w(e),E(m[e]),O(!1),K())},Y=(e,t)=>{E(n=>({...n,[e]:t}))},X=()=>{if(!T.drName||T.drName.trim().length<2)return`Doctor Name is required and must be at least 2 characters.`;if(!T.mobileNo||!T.mobileNo.trim())return`Mobile Number is required.`;let e=T.mobileNo.replace(/[^0-9]/g,``);return e.length<10||e.length>15?`Please provide a valid 10-15 digit mobile number.`:T.email&&T.email.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(T.email.trim())?`Please enter a valid email address.`:T.consultationFee!==void 0&&T.consultationFee<0?`Consultation Fee cannot be negative.`:T.followupFee!==void 0&&T.followupFee<0?`Follow-up Fee cannot be negative.`:null},Z=async()=>{if(!D){O(!0);let e=`DR-${m.length+101}`;E({...C,id:e}),G({type:`success`,message:`New doctor form initialized. Fill details and click "Save Doctor" to record.`});return}let e=X();if(e){G({type:`error`,message:e});return}j(!0);try{let e=await a.createDoctor(T);G({type:`success`,message:`Doctor ${e.doctor.drName} created successfully with ID ${e.doctor.id}.`});let t=[...m,e.doctor];g(t),w(t.length-1),E(e.doctor),O(!1)}catch(e){let t=e instanceof Error?e.message:`Failed to save doctor.`;G({type:`error`,message:t})}finally{j(!1)}},de=async()=>{if(D){Z();return}let e=X();if(e){G({type:`error`,message:e});return}j(!0);try{let e=await a.updateDoctor(T.id,T);G({type:`success`,message:`Doctor ${e.doctor.drName} (${e.doctor.id}) updated successfully.`});let t=[...m];t[y]=e.doctor,g(t),E(e.doctor)}catch(e){let t=e instanceof Error?e.message:`Failed to update doctor.`;G({type:`error`,message:t})}finally{j(!1)}},Q=async e=>{if(T.id){j(!0);try{let t=await a.deleteDoctor(T.id,e);if(G({type:`success`,message:t.message}),V(!1),t.action===`deleted`){let e=m.filter(e=>e.id!==T.id);if(g(e),e.length>0){let t=Math.min(y,e.length-1);w(t),E(e[t])}else E(C),O(!0)}else{let e=[...m];e[y]={...e[y],status:`inactive`},g(e),E(e=>({...e,status:`inactive`}))}}catch(e){let t=e instanceof Error?e.message:`Operation failed.`;G({type:`error`,message:t})}finally{j(!1)}}},fe=(0,v.useMemo)(()=>{let e=new Set;return m.forEach(t=>{t.speciality&&e.add(t.speciality)}),Array.from(e).sort()},[m]),$=(0,v.useMemo)(()=>m.filter(e=>{if(R!==`All`&&e.status!==R||I!==`All`&&e.speciality!==I)return!1;if(P.trim()){let t=P.toLowerCase().trim();if(!(`${e.title} ${e.drName}`.toLowerCase().includes(t)||e.id.toLowerCase().includes(t)||e.drRegNo&&e.drRegNo.toLowerCase().includes(t)||e.mobileNo.includes(t)||e.speciality&&e.speciality.toLowerCase().includes(t)||e.department&&e.department.toLowerCase().includes(t)))return!1}return!0}),[m,P,I,R]);return(0,S.jsxs)(`div`,{className:x.pageContainer,children:[(0,S.jsxs)(`div`,{className:x.header,children:[(0,S.jsxs)(`div`,{className:x.headerLeft,children:[(0,S.jsx)(`span`,{className:x.recordCounter,children:D?`New Record (Total: ${m.length})`:`${m.length>0?y+1:0} of ${m.length}`}),(0,S.jsxs)(`span`,{className:x.idBadge,children:[`Dr ID: `,D?`${T.id||`Pending`}`:T.id||`--`]}),(0,S.jsx)(`h1`,{className:x.pageTitle,children:`Doctor Master`})]}),T.status===`inactive`&&!D&&(0,S.jsx)(`span`,{className:x.badgeInactive,children:`Record Deactivated / Inactive`})]}),W&&(0,S.jsxs)(`div`,{className:W.type===`success`?x.alertSuccess:x.alertError,role:`alert`,children:[(0,S.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[W.type===`success`?(0,S.jsx)(o,{size:18}):(0,S.jsx)(i,{size:18}),(0,S.jsx)(`span`,{children:W.message})]}),(0,S.jsx)(`button`,{type:`button`,onClick:K,style:{background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},"aria-label":`Dismiss notification`,children:(0,S.jsx)(p,{size:16})})]}),(0,S.jsxs)(`form`,{ref:ce,onKeyDown:le,onSubmit:e=>{e.preventDefault(),handleSave()},className:x.formContainer,children:[(0,S.jsxs)(`div`,{className:x.section,children:[(0,S.jsx)(`h2`,{className:x.sectionTitle,children:`General Information`}),(0,S.jsxs)(`div`,{className:x.row,children:[(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1.5},children:[(0,S.jsx)(`label`,{className:x.label,children:`Dr Hos/Ref :`}),(0,S.jsxs)(`select`,{className:x.input,style:{backgroundColor:`var(--primary)`,color:`white`,borderColor:`var(--primary)`,fontWeight:600},value:T.drHosRef,onChange:e=>Y(`drHosRef`,e.target.value),children:[(0,S.jsx)(`option`,{value:`Hospital Doctor`,children:`Hospital Doctor`}),(0,S.jsx)(`option`,{value:`Reference Doctor`,children:`Reference Doctor`}),(0,S.jsx)(`option`,{value:`Both`,children:`Both`})]})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1.5},children:[(0,S.jsx)(`label`,{className:x.label,children:`Dr Type :`}),(0,S.jsxs)(`select`,{className:x.input,value:T.drType,onChange:e=>Y(`drType`,e.target.value),children:[(0,S.jsx)(`option`,{value:`Consultant Physician`,children:`Consultant Physician`}),(0,S.jsx)(`option`,{value:`Consultant Surgeon`,children:`Consultant Surgeon`}),(0,S.jsx)(`option`,{value:`Cardiologist`,children:`Cardiologist`}),(0,S.jsx)(`option`,{value:`Pediatrician`,children:`Pediatrician`}),(0,S.jsx)(`option`,{value:`Radiologist`,children:`Radiologist`}),(0,S.jsx)(`option`,{value:`Reference Doctor`,children:`Reference Doctor`}),(0,S.jsx)(`option`,{value:`Gynecologist`,children:`Gynecologist`}),(0,S.jsx)(`option`,{value:`General Practitioner`,children:`General Practitioner`}),(0,S.jsx)(`option`,{value:`Resident Doctor`,children:`Resident Doctor`}),(0,S.jsx)(`option`,{value:`Visiting Doctor`,children:`Visiting Doctor`})]})]}),(0,S.jsx)(`div`,{className:x.fieldGroup,style:{flex:1,justifyContent:`flex-end`},children:(0,S.jsxs)(`div`,{className:x.radioGroup,children:[(0,S.jsxs)(`label`,{className:x.radioLabel,children:[(0,S.jsx)(`input`,{type:`radio`,name:`status`,checked:T.status===`active`,onChange:()=>Y(`status`,`active`)}),` `,`Active`]}),(0,S.jsxs)(`label`,{className:x.radioLabel,children:[(0,S.jsx)(`input`,{type:`radio`,name:`status`,checked:T.status===`inactive`,onChange:()=>Y(`status`,`inactive`)}),` `,`Inactive`]})]})})]}),(0,S.jsxs)(`div`,{className:x.row,style:{alignItems:`flex-start`},children:[(0,S.jsx)(`div`,{className:x.col,style:{flex:2},children:(0,S.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`4px`},children:[(0,S.jsxs)(`div`,{className:x.fieldGroup,children:[(0,S.jsx)(`label`,{className:x.label,children:`Dr.Name :`}),(0,S.jsxs)(`select`,{className:x.input,style:{flex:`0 0 80px`},value:T.title,onChange:e=>Y(`title`,e.target.value),children:[(0,S.jsx)(`option`,{value:`Dr.`,children:`Dr.`}),(0,S.jsx)(`option`,{value:`Mr.`,children:`Mr.`}),(0,S.jsx)(`option`,{value:`Mrs.`,children:`Mrs.`}),(0,S.jsx)(`option`,{value:`Ms.`,children:`Ms.`})]}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`First Middle Last`,value:T.drName,onChange:e=>Y(`drName`,e.target.value)})]}),(0,S.jsx)(`div`,{className:x.helperText,children:`Format : first middle last - degree`})]})}),(0,S.jsx)(`div`,{className:x.col,style:{flex:1.2,justifyContent:`center`,paddingTop:`10px`},children:(0,S.jsxs)(`div`,{className:x.checkboxItem,onClick:()=>Y(`hospitalName`,!T.hospitalName),children:[T.hospitalName?(0,S.jsx)(u,{size:16,color:`var(--primary)`}):(0,S.jsx)(d,{size:16,color:`var(--text-muted)`}),(0,S.jsx)(`span`,{style:{color:T.hospitalName?`var(--text-main)`:`var(--text-muted)`},children:`Hospital Name`})]})}),(0,S.jsx)(`div`,{className:x.col,style:{flex:1.5},children:(0,S.jsxs)(`div`,{className:x.fieldGroup,children:[(0,S.jsx)(`label`,{className:x.label,children:`Degree :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`e.g. MBBS, MD, MS`,value:T.degree||``,onChange:e=>Y(`degree`,e.target.value)})]})})]}),(0,S.jsxs)(`div`,{className:x.row,children:[(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1.2},children:[(0,S.jsx)(`label`,{className:x.label,children:`Speciality :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`e.g. Cardiology, Surgery`,value:T.speciality||``,onChange:e=>Y(`speciality`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1.2},children:[(0,S.jsx)(`label`,{className:x.label,children:`Department :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`e.g. Medicine, OPD, Surgery`,value:T.department||``,onChange:e=>Y(`department`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Dr. Reg No :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`Medical Council Reg`,value:T.drRegNo||``,onChange:e=>Y(`drRegNo`,e.target.value)})]})]}),(0,S.jsxs)(`div`,{className:x.row,children:[(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Birth Date :`}),(0,S.jsx)(`input`,{type:`date`,className:x.input,max:`2099-12-31`,value:T.birthDate||``,onChange:e=>Y(`birthDate`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Wedding :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`e.g. 24-Dec`,value:T.wedding||``,onChange:e=>Y(`wedding`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`PanNo :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`PAN Number`,value:T.panNo||``,onChange:e=>Y(`panNo`,e.target.value.toUpperCase())})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,style:{width:`80px`},children:`Adhar No :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`Aadhaar Card No`,value:T.adharNo||``,onChange:e=>Y(`adharNo`,e.target.value)})]})]}),(0,S.jsxs)(`div`,{className:x.row,children:[(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Mobile No. :`}),(0,S.jsx)(`input`,{type:`tel`,className:x.input,placeholder:`10-digit mobile`,value:T.mobileNo,onChange:e=>Y(`mobileNo`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Ph.No.(R) :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`Residence Phone`,value:T.phNoR||``,onChange:e=>Y(`phNoR`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1.5},children:[(0,S.jsx)(`label`,{className:x.label,children:`E-Mail :`}),(0,S.jsx)(`input`,{type:`email`,className:x.input,placeholder:`doctor@hospital.com`,value:T.email||``,onChange:e=>Y(`email`,e.target.value)})]})]}),(0,S.jsxs)(`div`,{className:x.row,children:[(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Consultation Fee :`}),(0,S.jsx)(`input`,{type:`number`,min:`0`,className:x.input,placeholder:`₹ 500`,value:T.consultationFee??``,onChange:e=>Y(`consultationFee`,parseFloat(e.target.value)||0)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Follow-up Fee :`}),(0,S.jsx)(`input`,{type:`number`,min:`0`,className:x.input,placeholder:`₹ 300`,value:T.followupFee??``,onChange:e=>Y(`followupFee`,parseFloat(e.target.value)||0)})]}),(0,S.jsx)(`div`,{style:{flex:1.5}})]})]}),(0,S.jsxs)(`div`,{className:x.section,children:[(0,S.jsx)(`h2`,{className:x.sectionTitle,children:`Clinic Detail`}),(0,S.jsx)(`div`,{className:x.row,children:(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Clinic Name :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`Clinic / Hospital Branch Name`,value:T.clinicName||``,onChange:e=>Y(`clinicName`,e.target.value)})]})}),(0,S.jsx)(`div`,{className:x.row,children:(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Address :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`Street Address, Building, Landmark`,value:T.address||``,onChange:e=>Y(`address`,e.target.value)})]})}),(0,S.jsxs)(`div`,{className:x.row,children:[(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Area :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`Area / Locality`,value:T.area||``,onChange:e=>Y(`area`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`City :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,value:T.city||`SURAT`,onChange:e=>Y(`city`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Pin :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`PIN Code`,value:T.pin||``,onChange:e=>Y(`pin`,e.target.value)})]})]}),(0,S.jsxs)(`div`,{className:x.row,children:[(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`State :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,value:T.state||`GUJARAT`,onChange:e=>Y(`state`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Country :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,value:T.country||`INDIA`,onChange:e=>Y(`country`,e.target.value)})]}),(0,S.jsxs)(`div`,{className:x.fieldGroup,style:{flex:1},children:[(0,S.jsx)(`label`,{className:x.label,children:`Clinic Ph.No. :`}),(0,S.jsx)(`input`,{type:`text`,className:x.input,placeholder:`Clinic Phone / Landline`,value:T.clinicPhNo||``,onChange:e=>Y(`clinicPhNo`,e.target.value)})]})]})]})]}),(0,S.jsxs)(`div`,{className:x.actionBar,children:[(0,S.jsxs)(`div`,{className:x.navControls,children:[(0,S.jsx)(`button`,{type:`button`,className:x.navBtn,title:`First Record`,disabled:y===0||D,onClick:()=>J(0),children:(0,S.jsx)(n,{size:20})}),(0,S.jsx)(`button`,{type:`button`,className:x.navBtn,title:`Previous Record`,disabled:y===0||D,onClick:()=>J(y-1),children:(0,S.jsx)(t,{size:20})}),(0,S.jsx)(`button`,{type:`button`,className:x.navBtn,title:`Next Record`,disabled:y>=m.length-1||D,onClick:()=>J(y+1),children:(0,S.jsx)(ae,{size:20})}),(0,S.jsx)(`button`,{type:`button`,className:x.navBtn,title:`Last Record`,disabled:y>=m.length-1||D,onClick:()=>J(m.length-1),children:(0,S.jsx)(r,{size:20})})]}),(0,S.jsxs)(`div`,{className:x.middleActions,children:[(0,S.jsxs)(`div`,{className:x.printBtn,onClick:()=>{se(!M),b(T)},children:[M?(0,S.jsx)(u,{size:18,color:`var(--primary)`}):(0,S.jsx)(d,{size:18}),(0,S.jsx)(`span`,{children:`Print Profile`})]}),(0,S.jsxs)(`button`,{type:`button`,className:x.secondaryBtn,onClick:()=>N(!0),style:{marginLeft:`16px`},children:[(0,S.jsx)(l,{size:18}),` Particular Search`]})]}),(0,S.jsxs)(`div`,{className:x.rightActions,children:[(0,S.jsxs)(`button`,{type:`button`,className:x.primaryBtn,disabled:A,onClick:Z,children:[(0,S.jsx)(c,{size:18}),` `,D?`Save Doctor`:`Add New`]}),!D&&(0,S.jsxs)(`button`,{type:`button`,className:x.secondaryBtn,disabled:A,onClick:de,children:[(0,S.jsx)(te,{size:18}),` Update`]}),!D&&(0,S.jsxs)(`button`,{type:`button`,className:x.dangerBtn,disabled:A,onClick:()=>V(!0),children:[(0,S.jsx)(re,{size:18}),` Delete / Deactivate`]}),(0,S.jsxs)(`button`,{type:`button`,className:x.secondaryBtn,style:{marginLeft:`16px`},onClick:()=>e(`/`),children:[(0,S.jsx)(f,{size:18}),` Exit`]})]})]}),ue&&(0,S.jsx)(`div`,{className:x.modalOverlay,onClick:()=>N(!1),children:(0,S.jsxs)(`div`,{className:x.modalContent,onClick:e=>e.stopPropagation(),children:[(0,S.jsxs)(`div`,{className:x.modalHeader,children:[(0,S.jsxs)(`h3`,{className:x.modalTitle,children:[(0,S.jsx)(l,{size:18,color:`var(--primary)`}),` Particular Search — Doctor Directory`]}),(0,S.jsx)(`button`,{type:`button`,className:x.modalCloseBtn,onClick:()=>N(!1),children:(0,S.jsx)(p,{size:18})})]}),(0,S.jsxs)(`div`,{className:x.modalBody,children:[(0,S.jsxs)(`div`,{className:x.searchToolbar,children:[(0,S.jsxs)(`div`,{className:x.searchBox,children:[(0,S.jsx)(l,{size:16,color:`var(--text-muted)`}),(0,S.jsx)(`input`,{type:`text`,placeholder:`Instant search by Doctor Name, ID, Reg No, Mobile, or Speciality...`,value:P,onChange:e=>F(e.target.value),autoFocus:!0}),P&&(0,S.jsx)(`button`,{type:`button`,onClick:()=>F(``),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-muted)`},children:(0,S.jsx)(p,{size:14})})]}),(0,S.jsxs)(`div`,{className:x.filterRow,children:[(0,S.jsxs)(`select`,{className:x.filterSelect,value:I,onChange:e=>L(e.target.value),children:[(0,S.jsx)(`option`,{value:`All`,children:`All Specialities`}),fe.map(e=>(0,S.jsx)(`option`,{value:e,children:e},e))]}),(0,S.jsxs)(`select`,{className:x.filterSelect,value:R,onChange:e=>z(e.target.value),children:[(0,S.jsx)(`option`,{value:`All`,children:`All Statuses`}),(0,S.jsx)(`option`,{value:`active`,children:`Active Only`}),(0,S.jsx)(`option`,{value:`inactive`,children:`Inactive Only`})]}),(0,S.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`,marginLeft:`auto`},children:[`Showing `,$.length,` of `,m.length,` doctors`]})]})]}),(0,S.jsx)(`div`,{className:x.tableWrapper,children:(0,S.jsxs)(`table`,{className:x.modalTable,children:[(0,S.jsx)(`thead`,{children:(0,S.jsxs)(`tr`,{children:[(0,S.jsx)(`th`,{children:`Doctor ID`}),(0,S.jsx)(`th`,{children:`Doctor Name`}),(0,S.jsx)(`th`,{children:`Speciality`}),(0,S.jsx)(`th`,{children:`Department`}),(0,S.jsx)(`th`,{children:`Mobile`}),(0,S.jsx)(`th`,{children:`Status`})]})}),(0,S.jsx)(`tbody`,{children:$.length===0?(0,S.jsx)(`tr`,{children:(0,S.jsx)(`td`,{colSpan:6,className:x.emptyState,children:`No doctors found matching the search criteria.`})}):$.map(e=>(0,S.jsxs)(`tr`,{className:`${x.tableRow} ${e.id===T.id?x.tableRowSelected:``}`,onClick:()=>{let t=m.findIndex(t=>t.id===e.id);t!==-1&&J(t),N(!1)},children:[(0,S.jsx)(`td`,{style:{fontWeight:600,color:`var(--primary)`},children:e.id}),(0,S.jsxs)(`td`,{children:[(0,S.jsxs)(`strong`,{children:[e.title,` `,e.drName]}),e.degree&&(0,S.jsxs)(`span`,{style:{color:`var(--text-muted)`,fontSize:`12px`,marginLeft:`6px`},children:[`(`,e.degree,`)`]})]}),(0,S.jsx)(`td`,{children:e.speciality||`-`}),(0,S.jsx)(`td`,{children:e.department||`-`}),(0,S.jsx)(`td`,{children:e.mobileNo}),(0,S.jsx)(`td`,{children:e.status===`active`?(0,S.jsx)(`span`,{className:x.badgeActive,children:`Active`}):(0,S.jsx)(`span`,{className:x.badgeInactive,children:`Inactive`})})]},e.id))})]})})]}),(0,S.jsx)(`div`,{className:x.modalFooter,children:(0,S.jsx)(`button`,{type:`button`,className:x.secondaryBtn,onClick:()=>N(!1),children:`Close`})})]})}),B&&(0,S.jsx)(`div`,{className:x.modalOverlay,onClick:()=>V(!1),children:(0,S.jsxs)(`div`,{className:x.modalContent,style:{maxWidth:`500px`},onClick:e=>e.stopPropagation(),children:[(0,S.jsxs)(`div`,{className:x.modalHeader,children:[(0,S.jsxs)(`h3`,{className:x.modalTitle,style:{color:`var(--danger)`},children:[(0,S.jsx)(ne,{size:20}),` Delete or Deactivate Doctor`]}),(0,S.jsx)(`button`,{type:`button`,className:x.modalCloseBtn,onClick:()=>V(!1),children:(0,S.jsx)(p,{size:18})})]}),(0,S.jsxs)(`div`,{className:x.modalBody,children:[(0,S.jsxs)(`p`,{style:{margin:0,fontSize:`14px`,lineHeight:1.5},children:[`You are about to remove `,(0,S.jsxs)(`strong`,{children:[T.title,` `,T.drName,` (`,T.id,`)`]}),`.`]}),(0,S.jsxs)(`div`,{style:{backgroundColor:`var(--warning-soft)`,padding:`12px`,borderRadius:`6px`,fontSize:`13px`,color:`var(--text-main)`},children:[(0,S.jsx)(`strong`,{children:`Healthcare Best Practice:`}),` We recommend `,(0,S.jsx)(`em`,{children:`Deactivating`}),` the doctor instead of permanent deletion. This preserves historical patient registrations, prescriptions, and billing receipts while preventing future selections.`]})]}),(0,S.jsxs)(`div`,{className:x.modalFooter,children:[(0,S.jsx)(`button`,{type:`button`,className:x.secondaryBtn,onClick:()=>V(!1),children:`Cancel`}),(0,S.jsx)(`button`,{type:`button`,className:x.secondaryBtn,style:{borderColor:`var(--danger)`,color:`var(--danger)`},onClick:()=>Q(!1),children:`Deactivate (Safe)`}),(0,S.jsx)(`button`,{type:`button`,className:x.dangerBtn,onClick:()=>Q(!0),children:`Delete Permanently`})]})]})}),H&&(0,S.jsx)(`div`,{className:x.modalOverlay,onClick:()=>U(!1),children:(0,S.jsxs)(`div`,{className:x.modalContent,style:{maxWidth:`650px`},onClick:e=>e.stopPropagation(),children:[(0,S.jsxs)(`div`,{className:x.modalHeader,children:[(0,S.jsxs)(`h3`,{className:x.modalTitle,children:[(0,S.jsx)(s,{size:18}),` Doctor Profile Preview — `,h.name]}),(0,S.jsx)(`button`,{type:`button`,className:x.modalCloseBtn,onClick:()=>U(!1),children:(0,S.jsx)(p,{size:18})})]}),(0,S.jsx)(`div`,{className:x.modalBody,id:`doctor-print-area`,children:(0,S.jsxs)(`div`,{style:{border:`2px solid var(--border)`,padding:`24px`,borderRadius:`8px`,background:`var(--surface)`},children:[(0,S.jsxs)(`div`,{style:{textAlign:`center`,borderBottom:`1px solid var(--border)`,paddingBottom:`12px`,marginBottom:`16px`},children:[(0,S.jsx)(`h2`,{style:{margin:0,color:`var(--primary)`,fontSize:`20px`},children:h.name}),(0,S.jsx)(`p`,{style:{margin:`4px 0 0 0`,color:`var(--text-muted)`,fontSize:`12px`},children:h.address}),(0,S.jsxs)(`p`,{style:{margin:`2px 0 0 0`,color:`var(--text-muted)`,fontSize:`12px`},children:[`Phone: `,h.phone,` | Email: `,h.email]})]}),(0,S.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`12px`,fontSize:`13px`},children:[(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Doctor ID:`}),` `,T.id]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Doctor Type:`}),` `,T.drType]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Full Name:`}),` `,T.title,` `,T.drName]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Degree:`}),` `,T.degree||`-`]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Speciality:`}),` `,T.speciality||`-`]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Department:`}),` `,T.department||`-`]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Medical Reg No:`}),` `,T.drRegNo||`-`]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Status:`}),` `,T.status.toUpperCase()]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Mobile:`}),` `,T.mobileNo]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Email:`}),` `,T.email||`-`]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Consultation Fee:`}),` ₹ `,T.consultationFee||0]}),(0,S.jsxs)(`div`,{children:[(0,S.jsx)(`strong`,{children:`Follow-up Fee:`}),` ₹ `,T.followupFee||0]}),(0,S.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,S.jsx)(`strong`,{children:`Clinic / Branch:`}),` `,T.clinicName||`-`]}),(0,S.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,S.jsx)(`strong`,{children:`Clinic Address:`}),` `,T.address||`-`,`, `,T.city,` - `,T.pin]})]})]})}),(0,S.jsxs)(`div`,{className:x.modalFooter,children:[(0,S.jsx)(`button`,{type:`button`,className:x.secondaryBtn,onClick:()=>U(!1),children:`Close`}),(0,S.jsxs)(`button`,{type:`button`,className:x.primaryBtn,onClick:()=>window.print(),children:[(0,S.jsx)(s,{size:16}),` Print Document`]})]})]})})]})};export{w as default};