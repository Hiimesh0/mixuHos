import{r as e}from"./rolldown-runtime-hePW80VL.js";import{t}from"./chevron-left-C1_daB5d.js";import{n,t as r}from"./chevrons-right-B2DsBAWZ.js";import{t as ee}from"./circle-alert-CEu4KGa3.js";import{t as i}from"./circle-check-C-vZ2p2M.js";import{t as te}from"./pen-CFof5M-9.js";import{t as a}from"./plus-BNOhdFmJ.js";import{t as o}from"./printer-CfdrcsZM.js";import{t as s}from"./save-5FEzQHNn.js";import{t as c}from"./search-bWB7sLHl.js";import{t as ne}from"./shield-alert-lS5AWRjX.js";import{n as l,t as u}from"./square-M_gRYhu0.js";import{t as re}from"./trash-BpItNb1j.js";import{C as ie,I as d,N as ae,h as f,i as p,r as m,t as h}from"./index-DYtxE2cW.js";import{i as g}from"./masterApi-JRUmigoj.js";import{t as _}from"./GlobalBottomActionBar-BiILOAco.js";import{t as v}from"./useAutoDismissNotification-BkX8aenO.js";import{t as y}from"./doctorUtils-CVwNhBrP.js";import{n as oe}from"./useFormKeyboardNavigation-DL7kJs_P.js";var b=e(d(),1);function x(e){let t=`${e.title?`${e.title} `:``}${e.drName}`,n=new Date().toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`}),r=[e.address,e.area,e.city,e.state,e.pin].filter(Boolean).join(`, `)||`Not specified`;return`<!DOCTYPE html>
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
</html>`}function se(e){let t=window.open(`about:blank`,`_blank`);if(!t){alert(`Please allow popups to open the Doctor Profile print preview.`);return}let n=x(e);t.document.open(),t.document.write(n),t.document.close()}var S={pageContainer:`_pageContainer_1d9rj_1`,header:`_header_1d9rj_14`,pageTitle:`_pageTitle_1d9rj_22`,headerLeft:`_headerLeft_1d9rj_29`,recordCounter:`_recordCounter_1d9rj_35`,idBadge:`_idBadge_1d9rj_45`,formContainer:`_formContainer_1d9rj_56`,section:`_section_1d9rj_64`,sectionTitle:`_sectionTitle_1d9rj_74`,row:`_row_1d9rj_84`,col:`_col_1d9rj_91`,fieldGroup:`_fieldGroup_1d9rj_99`,fieldGroupVertical:`_fieldGroupVertical_1d9rj_105`,label:`_label_1d9rj_112`,input:`_input_1d9rj_126`,helperText:`_helperText_1d9rj_144`,checkboxItem:`_checkboxItem_1d9rj_151`,radioGroup:`_radioGroup_1d9rj_161`,radioLabel:`_radioLabel_1d9rj_172`,actionBar:`_actionBar_1d9rj_183`,navControls:`_navControls_1d9rj_194`,navBtn:`_navBtn_1d9rj_199`,middleActions:`_middleActions_1d9rj_218`,printBtn:`_printBtn_1d9rj_224`,rightActions:`_rightActions_1d9rj_244`,secondaryBtn:`_secondaryBtn_1d9rj_250`,primaryBtn:`_primaryBtn_1d9rj_271`,formCard:`_formCard_1d9rj_300`,mainSection:`_mainSection_1d9rj_300`,topHeader:`_topHeader_1d9rj_301`,headerRight:`_headerRight_1d9rj_302`,titleArea:`_titleArea_1d9rj_302`,headerActions:`_headerActions_1d9rj_302`,fieldGroupHorizontal:`_fieldGroupHorizontal_1d9rj_304`,formRow:`_formRow_1d9rj_304`,inputWithUnit:`_inputWithUnit_1d9rj_304`,select:`_select_1d9rj_306`,textarea:`_textarea_1d9rj_306`,alertSuccess:`_alertSuccess_1d9rj_321`,alertError:`_alertError_1d9rj_335`,dangerBtn:`_dangerBtn_1d9rj_349`,modalOverlay:`_modalOverlay_1d9rj_371`,modalContent:`_modalContent_1d9rj_383`,modalHeader:`_modalHeader_1d9rj_396`,modalTitle:`_modalTitle_1d9rj_405`,modalCloseBtn:`_modalCloseBtn_1d9rj_415`,modalBody:`_modalBody_1d9rj_432`,modalFooter:`_modalFooter_1d9rj_440`,searchToolbar:`_searchToolbar_1d9rj_451`,searchBox:`_searchBox_1d9rj_457`,filterRow:`_filterRow_1d9rj_477`,filterSelect:`_filterSelect_1d9rj_484`,tableWrapper:`_tableWrapper_1d9rj_495`,modalTable:`_modalTable_1d9rj_502`,tableRow:`_tableRow_1d9rj_524`,tableRowSelected:`_tableRowSelected_1d9rj_533`,badgeActive:`_badgeActive_1d9rj_537`,badgeInactive:`_badgeInactive_1d9rj_547`,emptyState:`_emptyState_1d9rj_557`},C=m(),w={id:``,drHosRef:`Hospital Doctor`,drType:`Consultant Physician`,title:`Dr.`,drName:``,degree:``,speciality:``,department:``,drRegNo:``,hospitalName:!0,birthDate:``,wedding:``,panNo:``,adharNo:``,mobileNo:``,phNoR:``,email:``,consultationFee:500,followupFee:300,clinicName:``,address:``,area:``,city:`SURAT`,pin:``,state:`GUJARAT`,country:`INDIA`,clinicPhNo:``,status:`active`},T=()=>{let e=ae(),[d,m]=(0,b.useState)([]),[x,T]=(0,b.useState)(0),[E,D]=(0,b.useState)(w),[O,k]=(0,b.useState)(!1),[ce,A]=(0,b.useState)(!0),[j,M]=(0,b.useState)(!1),[N,le]=(0,b.useState)(!1),{formRef:ue,handleKeyDown:de}=oe(),[fe,P]=(0,b.useState)(!1),[F,I]=(0,b.useState)(``),[L,R]=(0,b.useState)(`All`),[z,B]=(0,b.useState)(`All`),[pe,V]=(0,b.useState)(!1),[me,H]=(0,b.useState)(!1),{notification:U,setNotification:W,dismissNotification:G}=v(),K=(0,b.useCallback)(async()=>{A(!0);try{let e=(await g.getDoctors()).doctors||[];m(e),e.length>0?(T(0),D(e[0]),k(!1)):(D(w),k(!0))}catch(e){let t=e instanceof Error?e.message:`Failed to connect to doctors storage.`;W({type:`error`,message:t})}finally{A(!1)}},[W]);(0,b.useEffect)(()=>{K()},[K]);let q=e=>{e>=0&&e<d.length&&(T(e),D(d[e]),k(!1),G())},J=(e,t)=>{D(n=>({...n,[e]:t}))},Y=()=>{if(!E.drName||E.drName.trim().length<2)return`Doctor Name is required and must be at least 2 characters.`;if(!E.mobileNo||!E.mobileNo.trim())return`Mobile Number is required.`;let e=E.mobileNo.replace(/[^0-9]/g,``);return e.length<10||e.length>15?`Please provide a valid 10-15 digit mobile number.`:E.email&&E.email.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(E.email.trim())?`Please enter a valid email address.`:E.consultationFee!==void 0&&E.consultationFee<0?`Consultation Fee cannot be negative.`:E.followupFee!==void 0&&E.followupFee<0?`Follow-up Fee cannot be negative.`:null},X=async()=>{if(!O){k(!0);let e=`DR-${d.length+101}`;D({...w,id:e}),W({type:`success`,message:`New doctor form initialized. Fill details and click "Save Doctor" to record.`});return}let e=Y();if(e){W({type:`error`,message:e});return}M(!0);try{let e=await g.createDoctor(E);W({type:`success`,message:`Doctor ${e.doctor.drName} created successfully with ID ${e.doctor.id}.`});let t=[...d,e.doctor];m(t),T(t.length-1),D(e.doctor),k(!1)}catch(e){let t=e instanceof Error?e.message:`Failed to save doctor.`;W({type:`error`,message:t})}finally{M(!1)}},Z=async()=>{if(O){X();return}let e=Y();if(e){W({type:`error`,message:e});return}M(!0);try{let e=await g.updateDoctor(E.id,E);W({type:`success`,message:`Doctor ${e.doctor.drName} (${e.doctor.id}) updated successfully.`});let t=[...d];t[x]=e.doctor,m(t),D(e.doctor)}catch(e){let t=e instanceof Error?e.message:`Failed to update doctor.`;W({type:`error`,message:t})}finally{M(!1)}},Q=async e=>{if(E.id){M(!0);try{let t=await g.deleteDoctor(E.id,e);if(W({type:`success`,message:t.message}),V(!1),t.action===`deleted`){let e=d.filter(e=>e.id!==E.id);if(m(e),e.length>0){let t=Math.min(x,e.length-1);T(t),D(e[t])}else D(w),k(!0)}else{let e=[...d];e[x]={...e[x],status:`inactive`},m(e),D(e=>({...e,status:`inactive`}))}}catch(e){let t=e instanceof Error?e.message:`Operation failed.`;W({type:`error`,message:t})}finally{M(!1)}}},he=(0,b.useMemo)(()=>{let e=new Set;return d.forEach(t=>{t.speciality&&e.add(t.speciality)}),Array.from(e).sort()},[d]),$=(0,b.useMemo)(()=>d.filter(e=>{if(z!==`All`&&e.status!==z||L!==`All`&&e.speciality!==L)return!1;if(F.trim()){let t=F.toLowerCase().trim();if(!(y(e.title,e.drName).toLowerCase().includes(t)||e.id.toLowerCase().includes(t)||e.drRegNo&&e.drRegNo.toLowerCase().includes(t)||e.mobileNo.includes(t)||e.speciality&&e.speciality.toLowerCase().includes(t)||e.department&&e.department.toLowerCase().includes(t)))return!1}return!0}),[d,F,L,z]);return(0,C.jsxs)(`div`,{className:`${S.pageContainer} hasBottomActionBar`,children:[(0,C.jsxs)(`div`,{className:S.header,children:[(0,C.jsxs)(`div`,{className:S.headerLeft,children:[(0,C.jsx)(`span`,{className:S.recordCounter,children:O?`New Record (Total: ${d.length})`:`${d.length>0?x+1:0} of ${d.length}`}),(0,C.jsxs)(`span`,{className:S.idBadge,children:[`Dr ID: `,O?`${E.id||`Pending`}`:E.id||`--`]}),(0,C.jsx)(`h1`,{className:S.pageTitle,children:`Doctor Master`})]}),E.status===`inactive`&&!O&&(0,C.jsx)(`span`,{className:S.badgeInactive,children:`Record Deactivated / Inactive`})]}),U&&(0,C.jsxs)(`div`,{className:U.type===`success`?S.alertSuccess:S.alertError,role:`alert`,children:[(0,C.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[U.type===`success`?(0,C.jsx)(i,{size:18}):(0,C.jsx)(ee,{size:18}),(0,C.jsx)(`span`,{children:U.message})]}),(0,C.jsx)(`button`,{type:`button`,onClick:G,style:{background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},"aria-label":`Dismiss notification`,children:(0,C.jsx)(p,{size:16})})]}),(0,C.jsxs)(`form`,{ref:ue,onKeyDown:de,onSubmit:e=>{e.preventDefault(),O?X():Z()},className:S.formContainer,children:[(0,C.jsxs)(`div`,{className:S.section,children:[(0,C.jsx)(`h2`,{className:S.sectionTitle,children:`General Information`}),(0,C.jsxs)(`div`,{className:S.row,children:[(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1.5},children:[(0,C.jsx)(`label`,{className:S.label,children:`Dr Hos/Ref :`}),(0,C.jsxs)(`select`,{className:S.input,style:{backgroundColor:`var(--primary)`,color:`white`,borderColor:`var(--primary)`,fontWeight:600},value:E.drHosRef,onChange:e=>J(`drHosRef`,e.target.value),children:[(0,C.jsx)(`option`,{value:`Hospital Doctor`,children:`Hospital Doctor`}),(0,C.jsx)(`option`,{value:`Reference Doctor`,children:`Reference Doctor`}),(0,C.jsx)(`option`,{value:`Both`,children:`Both`})]})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1.5},children:[(0,C.jsx)(`label`,{className:S.label,children:`Dr Type :`}),(0,C.jsxs)(`select`,{className:S.input,value:E.drType,onChange:e=>J(`drType`,e.target.value),children:[(0,C.jsx)(`option`,{value:`Consultant Physician`,children:`Consultant Physician`}),(0,C.jsx)(`option`,{value:`Consultant Surgeon`,children:`Consultant Surgeon`}),(0,C.jsx)(`option`,{value:`Cardiologist`,children:`Cardiologist`}),(0,C.jsx)(`option`,{value:`Pediatrician`,children:`Pediatrician`}),(0,C.jsx)(`option`,{value:`Radiologist`,children:`Radiologist`}),(0,C.jsx)(`option`,{value:`Reference Doctor`,children:`Reference Doctor`}),(0,C.jsx)(`option`,{value:`Gynecologist`,children:`Gynecologist`}),(0,C.jsx)(`option`,{value:`General Practitioner`,children:`General Practitioner`}),(0,C.jsx)(`option`,{value:`Resident Doctor`,children:`Resident Doctor`}),(0,C.jsx)(`option`,{value:`Visiting Doctor`,children:`Visiting Doctor`})]})]}),(0,C.jsx)(`div`,{className:S.fieldGroup,style:{flex:1,justifyContent:`flex-end`},children:(0,C.jsxs)(`div`,{className:S.radioGroup,children:[(0,C.jsxs)(`label`,{className:S.radioLabel,children:[(0,C.jsx)(`input`,{type:`radio`,name:`status`,checked:E.status===`active`,onChange:()=>J(`status`,`active`)}),` `,`Active`]}),(0,C.jsxs)(`label`,{className:S.radioLabel,children:[(0,C.jsx)(`input`,{type:`radio`,name:`status`,checked:E.status===`inactive`,onChange:()=>J(`status`,`inactive`)}),` `,`Inactive`]})]})})]}),(0,C.jsxs)(`div`,{className:S.row,style:{alignItems:`flex-start`},children:[(0,C.jsx)(`div`,{className:S.col,style:{flex:2},children:(0,C.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`4px`},children:[(0,C.jsxs)(`div`,{className:S.fieldGroup,children:[(0,C.jsx)(`label`,{className:S.label,children:`Dr.Name :`}),(0,C.jsxs)(`select`,{className:S.input,style:{flex:`0 0 80px`},value:E.title,onChange:e=>J(`title`,e.target.value),children:[(0,C.jsx)(`option`,{value:`Dr.`,children:`Dr.`}),(0,C.jsx)(`option`,{value:`Mr.`,children:`Mr.`}),(0,C.jsx)(`option`,{value:`Mrs.`,children:`Mrs.`}),(0,C.jsx)(`option`,{value:`Ms.`,children:`Ms.`})]}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`First Middle Last`,value:E.drName,onChange:e=>J(`drName`,e.target.value)})]}),(0,C.jsx)(`div`,{className:S.helperText,children:`Format : first middle last - degree`})]})}),(0,C.jsx)(`div`,{className:S.col,style:{flex:1.2,justifyContent:`center`,paddingTop:`10px`},children:(0,C.jsxs)(`div`,{className:S.checkboxItem,onClick:()=>J(`hospitalName`,!E.hospitalName),children:[E.hospitalName?(0,C.jsx)(l,{size:16,color:`var(--primary)`}):(0,C.jsx)(u,{size:16,color:`var(--text-muted)`}),(0,C.jsx)(`span`,{style:{color:E.hospitalName?`var(--text-main)`:`var(--text-muted)`},children:`Hospital Name`})]})}),(0,C.jsx)(`div`,{className:S.col,style:{flex:1.5},children:(0,C.jsxs)(`div`,{className:S.fieldGroup,children:[(0,C.jsx)(`label`,{className:S.label,children:`Degree :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`e.g. MBBS, MD, MS`,value:E.degree||``,onChange:e=>J(`degree`,e.target.value)})]})})]}),(0,C.jsxs)(`div`,{className:S.row,children:[(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1.2},children:[(0,C.jsx)(`label`,{className:S.label,children:`Speciality :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`e.g. Cardiology, Surgery`,value:E.speciality||``,onChange:e=>J(`speciality`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1.2},children:[(0,C.jsx)(`label`,{className:S.label,children:`Department :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`e.g. Medicine, OPD, Surgery`,value:E.department||``,onChange:e=>J(`department`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Dr. Reg No :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`Medical Council Reg`,value:E.drRegNo||``,onChange:e=>J(`drRegNo`,e.target.value)})]})]}),(0,C.jsxs)(`div`,{className:S.row,children:[(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Birth Date :`}),(0,C.jsx)(`input`,{type:`date`,className:S.input,max:`2099-12-31`,value:E.birthDate||``,onChange:e=>J(`birthDate`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Wedding :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`e.g. 24-Dec`,value:E.wedding||``,onChange:e=>J(`wedding`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`PanNo :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`PAN Number`,value:E.panNo||``,onChange:e=>J(`panNo`,e.target.value.toUpperCase())})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,style:{width:`80px`},children:`Adhar No :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`Aadhaar Card No`,value:E.adharNo||``,onChange:e=>J(`adharNo`,e.target.value)})]})]}),(0,C.jsxs)(`div`,{className:S.row,children:[(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Mobile No. :`}),(0,C.jsx)(`input`,{type:`tel`,className:S.input,placeholder:`10-digit mobile`,value:E.mobileNo,onChange:e=>J(`mobileNo`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Ph.No.(R) :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`Residence Phone`,value:E.phNoR||``,onChange:e=>J(`phNoR`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1.5},children:[(0,C.jsx)(`label`,{className:S.label,children:`E-Mail :`}),(0,C.jsx)(`input`,{type:`email`,className:S.input,placeholder:`doctor@hospital.com`,value:E.email||``,onChange:e=>J(`email`,e.target.value)})]})]}),(0,C.jsxs)(`div`,{className:S.row,children:[(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Consultation Fee :`}),(0,C.jsx)(`input`,{type:`number`,min:`0`,className:S.input,placeholder:`₹ 500`,value:E.consultationFee??``,onChange:e=>J(`consultationFee`,parseFloat(e.target.value)||0)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Follow-up Fee :`}),(0,C.jsx)(`input`,{type:`number`,min:`0`,className:S.input,placeholder:`₹ 300`,value:E.followupFee??``,onChange:e=>J(`followupFee`,parseFloat(e.target.value)||0)})]}),(0,C.jsx)(`div`,{style:{flex:1.5}})]})]}),(0,C.jsxs)(`div`,{className:S.section,children:[(0,C.jsx)(`h2`,{className:S.sectionTitle,children:`Clinic Detail`}),(0,C.jsx)(`div`,{className:S.row,children:(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Clinic Name :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`Clinic / Hospital Branch Name`,value:E.clinicName||``,onChange:e=>J(`clinicName`,e.target.value)})]})}),(0,C.jsx)(`div`,{className:S.row,children:(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Address :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`Street Address, Building, Landmark`,value:E.address||``,onChange:e=>J(`address`,e.target.value)})]})}),(0,C.jsxs)(`div`,{className:S.row,children:[(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Area :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`Area / Locality`,value:E.area||``,onChange:e=>J(`area`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`City :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,value:E.city||`SURAT`,onChange:e=>J(`city`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Pin :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`PIN Code`,value:E.pin||``,onChange:e=>J(`pin`,e.target.value)})]})]}),(0,C.jsxs)(`div`,{className:S.row,children:[(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`State :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,value:E.state||`GUJARAT`,onChange:e=>J(`state`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Country :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,value:E.country||`INDIA`,onChange:e=>J(`country`,e.target.value)})]}),(0,C.jsxs)(`div`,{className:S.fieldGroup,style:{flex:1},children:[(0,C.jsx)(`label`,{className:S.label,children:`Clinic Ph.No. :`}),(0,C.jsx)(`input`,{type:`text`,className:S.input,placeholder:`Clinic Phone / Landline`,value:E.clinicPhNo||``,onChange:e=>J(`clinicPhNo`,e.target.value)})]})]})]})]}),(0,C.jsxs)(`div`,{className:S.actionBar,children:[(0,C.jsxs)(`div`,{className:S.navControls,children:[(0,C.jsx)(`button`,{type:`button`,className:S.navBtn,title:`First Record`,disabled:x===0||O,onClick:()=>q(0),children:(0,C.jsx)(n,{size:20})}),(0,C.jsx)(`button`,{type:`button`,className:S.navBtn,title:`Previous Record`,disabled:x===0||O,onClick:()=>q(x-1),children:(0,C.jsx)(t,{size:20})}),(0,C.jsx)(`button`,{type:`button`,className:S.navBtn,title:`Next Record`,disabled:x>=d.length-1||O,onClick:()=>q(x+1),children:(0,C.jsx)(ie,{size:20})}),(0,C.jsx)(`button`,{type:`button`,className:S.navBtn,title:`Last Record`,disabled:x>=d.length-1||O,onClick:()=>q(d.length-1),children:(0,C.jsx)(r,{size:20})})]}),(0,C.jsxs)(`div`,{className:S.middleActions,children:[(0,C.jsxs)(`div`,{className:S.printBtn,onClick:()=>{le(!N),se(E)},children:[N?(0,C.jsx)(l,{size:18,color:`var(--primary)`}):(0,C.jsx)(u,{size:18}),(0,C.jsx)(`span`,{children:`Print Profile`})]}),(0,C.jsxs)(`button`,{type:`button`,className:S.secondaryBtn,onClick:()=>P(!0),style:{marginLeft:`16px`},children:[(0,C.jsx)(c,{size:18}),` Particular Search`]})]}),(0,C.jsxs)(`div`,{className:S.rightActions,children:[(0,C.jsxs)(`button`,{type:`button`,className:S.primaryBtn,disabled:j,onClick:X,children:[(0,C.jsx)(s,{size:18}),` `,O?`Save Doctor`:`Add New`]}),!O&&(0,C.jsxs)(`button`,{type:`button`,className:S.secondaryBtn,disabled:j,onClick:Z,children:[(0,C.jsx)(te,{size:18}),` Update`]}),!O&&(0,C.jsxs)(`button`,{type:`button`,className:S.dangerBtn,disabled:j,onClick:()=>V(!0),children:[(0,C.jsx)(re,{size:18}),` Delete / Deactivate`]}),(0,C.jsxs)(`button`,{type:`button`,className:S.secondaryBtn,style:{marginLeft:`16px`},onClick:()=>e(`/`),children:[(0,C.jsx)(f,{size:18}),` Exit`]})]})]}),fe&&(0,C.jsx)(`div`,{className:S.modalOverlay,onClick:()=>P(!1),children:(0,C.jsxs)(`div`,{className:S.modalContent,onClick:e=>e.stopPropagation(),children:[(0,C.jsxs)(`div`,{className:S.modalHeader,children:[(0,C.jsxs)(`h3`,{className:S.modalTitle,children:[(0,C.jsx)(c,{size:18,color:`var(--primary)`}),` Particular Search — Doctor Directory`]}),(0,C.jsx)(`button`,{type:`button`,className:S.modalCloseBtn,onClick:()=>P(!1),children:(0,C.jsx)(p,{size:18})})]}),(0,C.jsxs)(`div`,{className:S.modalBody,children:[(0,C.jsxs)(`div`,{className:S.searchToolbar,children:[(0,C.jsxs)(`div`,{className:S.searchBox,children:[(0,C.jsx)(c,{size:16,color:`var(--text-muted)`}),(0,C.jsx)(`input`,{type:`text`,placeholder:`Instant search by Doctor Name, ID, Reg No, Mobile, or Speciality...`,value:F,onChange:e=>I(e.target.value),autoFocus:!0}),F&&(0,C.jsx)(`button`,{type:`button`,onClick:()=>I(``),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-muted)`},children:(0,C.jsx)(p,{size:14})})]}),(0,C.jsxs)(`div`,{className:S.filterRow,children:[(0,C.jsxs)(`select`,{className:S.filterSelect,value:L,onChange:e=>R(e.target.value),children:[(0,C.jsx)(`option`,{value:`All`,children:`All Specialities`}),he.map(e=>(0,C.jsx)(`option`,{value:e,children:e},e))]}),(0,C.jsxs)(`select`,{className:S.filterSelect,value:z,onChange:e=>B(e.target.value),children:[(0,C.jsx)(`option`,{value:`All`,children:`All Statuses`}),(0,C.jsx)(`option`,{value:`active`,children:`Active Only`}),(0,C.jsx)(`option`,{value:`inactive`,children:`Inactive Only`})]}),(0,C.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`,marginLeft:`auto`},children:[`Showing `,$.length,` of `,d.length,` doctors`]})]})]}),(0,C.jsx)(`div`,{className:S.tableWrapper,children:(0,C.jsxs)(`table`,{className:S.modalTable,children:[(0,C.jsx)(`thead`,{children:(0,C.jsxs)(`tr`,{children:[(0,C.jsx)(`th`,{children:`Doctor ID`}),(0,C.jsx)(`th`,{children:`Doctor Name`}),(0,C.jsx)(`th`,{children:`Speciality`}),(0,C.jsx)(`th`,{children:`Department`}),(0,C.jsx)(`th`,{children:`Mobile`}),(0,C.jsx)(`th`,{children:`Status`})]})}),(0,C.jsx)(`tbody`,{children:$.length===0?(0,C.jsx)(`tr`,{children:(0,C.jsx)(`td`,{colSpan:6,className:S.emptyState,children:`No doctors found matching the search criteria.`})}):$.map(e=>(0,C.jsxs)(`tr`,{className:`${S.tableRow} ${e.id===E.id?S.tableRowSelected:``}`,onClick:()=>{let t=d.findIndex(t=>t.id===e.id);t!==-1&&q(t),P(!1)},children:[(0,C.jsx)(`td`,{style:{fontWeight:600,color:`var(--primary)`},children:e.id}),(0,C.jsxs)(`td`,{children:[(0,C.jsx)(`strong`,{children:y(e.title,e.drName)}),e.degree&&(0,C.jsxs)(`span`,{style:{color:`var(--text-muted)`,fontSize:`12px`,marginLeft:`6px`},children:[`(`,e.degree,`)`]})]}),(0,C.jsx)(`td`,{children:e.speciality||`-`}),(0,C.jsx)(`td`,{children:e.department||`-`}),(0,C.jsx)(`td`,{children:e.mobileNo}),(0,C.jsx)(`td`,{children:e.status===`active`?(0,C.jsx)(`span`,{className:S.badgeActive,children:`Active`}):(0,C.jsx)(`span`,{className:S.badgeInactive,children:`Inactive`})})]},e.id))})]})})]}),(0,C.jsx)(`div`,{className:S.modalFooter,children:(0,C.jsx)(`button`,{type:`button`,className:S.secondaryBtn,onClick:()=>P(!1),children:`Close`})})]})}),pe&&(0,C.jsx)(`div`,{className:S.modalOverlay,onClick:()=>V(!1),children:(0,C.jsxs)(`div`,{className:S.modalContent,style:{maxWidth:`500px`},onClick:e=>e.stopPropagation(),children:[(0,C.jsxs)(`div`,{className:S.modalHeader,children:[(0,C.jsxs)(`h3`,{className:S.modalTitle,style:{color:`var(--danger)`},children:[(0,C.jsx)(ne,{size:20}),` Delete or Deactivate Doctor`]}),(0,C.jsx)(`button`,{type:`button`,className:S.modalCloseBtn,onClick:()=>V(!1),children:(0,C.jsx)(p,{size:18})})]}),(0,C.jsxs)(`div`,{className:S.modalBody,children:[(0,C.jsxs)(`p`,{style:{margin:0,fontSize:`14px`,lineHeight:1.5},children:[`You are about to remove `,(0,C.jsxs)(`strong`,{children:[y(E.title,E.drName),` (`,E.id,`)`]}),`.`]}),(0,C.jsxs)(`div`,{style:{backgroundColor:`var(--warning-soft)`,padding:`12px`,borderRadius:`6px`,fontSize:`13px`,color:`var(--text-main)`},children:[(0,C.jsx)(`strong`,{children:`Healthcare Best Practice:`}),` We recommend `,(0,C.jsx)(`em`,{children:`Deactivating`}),` the doctor instead of permanent deletion. This preserves historical patient registrations, prescriptions, and billing receipts while preventing future selections.`]})]}),(0,C.jsxs)(`div`,{className:S.modalFooter,children:[(0,C.jsx)(`button`,{type:`button`,className:S.secondaryBtn,onClick:()=>V(!1),children:`Cancel`}),(0,C.jsx)(`button`,{type:`button`,className:S.secondaryBtn,style:{borderColor:`var(--danger)`,color:`var(--danger)`},onClick:()=>Q(!1),children:`Deactivate (Safe)`}),(0,C.jsx)(`button`,{type:`button`,className:S.dangerBtn,onClick:()=>Q(!0),children:`Delete Permanently`})]})]})}),me&&(0,C.jsx)(`div`,{className:S.modalOverlay,onClick:()=>H(!1),children:(0,C.jsxs)(`div`,{className:S.modalContent,style:{maxWidth:`650px`},onClick:e=>e.stopPropagation(),children:[(0,C.jsxs)(`div`,{className:S.modalHeader,children:[(0,C.jsxs)(`h3`,{className:S.modalTitle,children:[(0,C.jsx)(o,{size:18}),` Doctor Profile Preview — `,h.name]}),(0,C.jsx)(`button`,{type:`button`,className:S.modalCloseBtn,onClick:()=>H(!1),children:(0,C.jsx)(p,{size:18})})]}),(0,C.jsx)(`div`,{className:S.modalBody,id:`doctor-print-area`,children:(0,C.jsxs)(`div`,{style:{border:`2px solid var(--border)`,padding:`24px`,borderRadius:`8px`,background:`var(--surface)`},children:[(0,C.jsxs)(`div`,{style:{textAlign:`center`,borderBottom:`1px solid var(--border)`,paddingBottom:`12px`,marginBottom:`16px`},children:[(0,C.jsx)(`h2`,{style:{margin:0,color:`var(--primary)`,fontSize:`20px`},children:h.name}),(0,C.jsx)(`p`,{style:{margin:`4px 0 0 0`,color:`var(--text-muted)`,fontSize:`12px`},children:h.address}),(0,C.jsxs)(`p`,{style:{margin:`2px 0 0 0`,color:`var(--text-muted)`,fontSize:`12px`},children:[`Phone: `,h.phone,` | Email: `,h.email]})]}),(0,C.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`12px`,fontSize:`13px`},children:[(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Doctor ID:`}),` `,E.id]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Doctor Type:`}),` `,E.drType]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Full Name:`}),` `,y(E.title,E.drName)]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Degree:`}),` `,E.degree||`-`]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Speciality:`}),` `,E.speciality||`-`]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Department:`}),` `,E.department||`-`]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Medical Reg No:`}),` `,E.drRegNo||`-`]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Status:`}),` `,E.status.toUpperCase()]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Mobile:`}),` `,E.mobileNo]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Email:`}),` `,E.email||`-`]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Consultation Fee:`}),` ₹ `,E.consultationFee||0]}),(0,C.jsxs)(`div`,{children:[(0,C.jsx)(`strong`,{children:`Follow-up Fee:`}),` ₹ `,E.followupFee||0]}),(0,C.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,C.jsx)(`strong`,{children:`Clinic / Branch:`}),` `,E.clinicName||`-`]}),(0,C.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,C.jsx)(`strong`,{children:`Clinic Address:`}),` `,E.address||`-`,`, `,E.city,` - `,E.pin]})]})]})}),(0,C.jsxs)(`div`,{className:S.modalFooter,children:[(0,C.jsx)(`button`,{type:`button`,className:S.secondaryBtn,onClick:()=>H(!1),children:`Close`}),(0,C.jsxs)(`button`,{type:`button`,className:S.primaryBtn,onClick:()=>window.print(),children:[(0,C.jsx)(o,{size:16}),` Print Document`]})]})]})}),(0,C.jsx)(_,{onSave:O?X:Z,saveLabel:j?`Saving...`:O?`Save Doctor`:`Update Doctor`,isSaving:j,isDirty:O&&!!E.drName,dirtyMessage:`New Entry Unsaved`,onEdit:O?void 0:Z,editLabel:`Update Doctor`,onPrint:()=>H(!0),printLabel:`Print Profile`,onDelete:O?void 0:()=>V(!0),deleteLabel:`Delete / Deactivate`,onCancel:O&&d.length>0?()=>{k(!1),D(d[x]||w)}:void 0,cancelLabel:`Cancel Add`,statusMessage:E.drName?`Dr. ${E.drName} (${E.id||`New`}) | ${E.speciality||`General`}`:`Doctor Master Directory`,extraActions:O?null:(0,C.jsxs)(`button`,{type:`button`,className:S.secondaryBtn,onClick:()=>{D(w),k(!0)},style:{display:`inline-flex`,alignItems:`center`,gap:`6px`,padding:`8px 14px`},children:[(0,C.jsx)(a,{size:15}),` Add New`]})})]})};export{T as default};