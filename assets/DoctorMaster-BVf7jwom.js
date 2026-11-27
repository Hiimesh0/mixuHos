import{r as e}from"./rolldown-runtime-hePW80VL.js";import{t}from"./chevron-left-CyjIC0uN.js";import{n,t as r}from"./chevrons-right-BeZ99kbs.js";import{t as ee}from"./circle-alert-DjZ5QzMQ.js";import{t as te}from"./circle-check-CVBIu3em.js";import{t as i}from"./pen-CjewdnQw.js";import{t as a}from"./printer-D6C-de1Z.js";import{t as ne}from"./save-CYV0WmAA.js";import{t as o}from"./search-Ce38hQqE.js";import{t as re}from"./shield-alert-BeWZUXo7.js";import{n as s,t as c}from"./square-y1amKiDv.js";import{t as ie}from"./trash-CF94As3z.js";import{C as ae,I as l,N as oe,h as se,i as u,r as d,t as f}from"./index-JFcwgG8N.js";import{i as p}from"./masterApi-JRUmigoj.js";import{t as ce}from"./useAutoDismissNotification-CDR8WkzQ.js";import{t as m}from"./doctorUtils-CVwNhBrP.js";import{n as h}from"./useFormKeyboardNavigation-DYScU3L7.js";var g=e(l(),1);function _(e){let t=`${e.title?`${e.title} `:``}${e.drName}`,n=new Date().toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`}),r=[e.address,e.area,e.city,e.state,e.pin].filter(Boolean).join(`, `)||`Not specified`;return`<!DOCTYPE html>
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
        <div class="hosp-name">${f.name}</div>
        <div class="hosp-tag">${f.address} | Phone: ${f.phone}</div>
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
        <span class="info-val">${e.clinicName||f.name}</span>
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
</html>`}function v(e){let t=window.open(`about:blank`,`_blank`);if(!t){alert(`Please allow popups to open the Doctor Profile print preview.`);return}let n=_(e);t.document.open(),t.document.write(n),t.document.close()}var y={pageContainer:`_pageContainer_1d9rj_1`,header:`_header_1d9rj_14`,pageTitle:`_pageTitle_1d9rj_22`,headerLeft:`_headerLeft_1d9rj_29`,recordCounter:`_recordCounter_1d9rj_35`,idBadge:`_idBadge_1d9rj_45`,formContainer:`_formContainer_1d9rj_56`,section:`_section_1d9rj_64`,sectionTitle:`_sectionTitle_1d9rj_74`,row:`_row_1d9rj_84`,col:`_col_1d9rj_91`,fieldGroup:`_fieldGroup_1d9rj_99`,fieldGroupVertical:`_fieldGroupVertical_1d9rj_105`,label:`_label_1d9rj_112`,input:`_input_1d9rj_126`,helperText:`_helperText_1d9rj_144`,checkboxItem:`_checkboxItem_1d9rj_151`,radioGroup:`_radioGroup_1d9rj_161`,radioLabel:`_radioLabel_1d9rj_172`,actionBar:`_actionBar_1d9rj_183`,navControls:`_navControls_1d9rj_194`,navBtn:`_navBtn_1d9rj_199`,middleActions:`_middleActions_1d9rj_218`,printBtn:`_printBtn_1d9rj_224`,rightActions:`_rightActions_1d9rj_244`,secondaryBtn:`_secondaryBtn_1d9rj_250`,primaryBtn:`_primaryBtn_1d9rj_271`,formCard:`_formCard_1d9rj_300`,mainSection:`_mainSection_1d9rj_300`,topHeader:`_topHeader_1d9rj_301`,headerRight:`_headerRight_1d9rj_302`,titleArea:`_titleArea_1d9rj_302`,headerActions:`_headerActions_1d9rj_302`,fieldGroupHorizontal:`_fieldGroupHorizontal_1d9rj_304`,formRow:`_formRow_1d9rj_304`,inputWithUnit:`_inputWithUnit_1d9rj_304`,select:`_select_1d9rj_306`,textarea:`_textarea_1d9rj_306`,alertSuccess:`_alertSuccess_1d9rj_321`,alertError:`_alertError_1d9rj_335`,dangerBtn:`_dangerBtn_1d9rj_349`,modalOverlay:`_modalOverlay_1d9rj_371`,modalContent:`_modalContent_1d9rj_383`,modalHeader:`_modalHeader_1d9rj_396`,modalTitle:`_modalTitle_1d9rj_405`,modalCloseBtn:`_modalCloseBtn_1d9rj_415`,modalBody:`_modalBody_1d9rj_432`,modalFooter:`_modalFooter_1d9rj_440`,searchToolbar:`_searchToolbar_1d9rj_451`,searchBox:`_searchBox_1d9rj_457`,filterRow:`_filterRow_1d9rj_477`,filterSelect:`_filterSelect_1d9rj_484`,tableWrapper:`_tableWrapper_1d9rj_495`,modalTable:`_modalTable_1d9rj_502`,tableRow:`_tableRow_1d9rj_524`,tableRowSelected:`_tableRowSelected_1d9rj_533`,badgeActive:`_badgeActive_1d9rj_537`,badgeInactive:`_badgeInactive_1d9rj_547`,emptyState:`_emptyState_1d9rj_557`},b=d(),x={id:``,drHosRef:`Hospital Doctor`,drType:`Consultant Physician`,title:`Dr.`,drName:``,degree:``,speciality:``,department:``,drRegNo:``,hospitalName:!0,birthDate:``,wedding:``,panNo:``,adharNo:``,mobileNo:``,phNoR:``,email:``,consultationFee:500,followupFee:300,clinicName:``,address:``,area:``,city:`SURAT`,pin:``,state:`GUJARAT`,country:`INDIA`,clinicPhNo:``,status:`active`},S=()=>{let e=oe(),[l,d]=(0,g.useState)([]),[_,S]=(0,g.useState)(0),[C,w]=(0,g.useState)(x),[T,E]=(0,g.useState)(!1),[le,D]=(0,g.useState)(!0),[O,k]=(0,g.useState)(!1),[A,j]=(0,g.useState)(!1),{formRef:ue,handleKeyDown:de}=h(),[fe,M]=(0,g.useState)(!1),[N,P]=(0,g.useState)(``),[F,I]=(0,g.useState)(`All`),[L,R]=(0,g.useState)(`All`),[z,B]=(0,g.useState)(!1),[V,H]=(0,g.useState)(!1),{notification:U,setNotification:W,dismissNotification:G}=ce(),K=(0,g.useCallback)(async()=>{D(!0);try{let e=(await p.getDoctors()).doctors||[];d(e),e.length>0?(S(0),w(e[0]),E(!1)):(w(x),E(!0))}catch(e){let t=e instanceof Error?e.message:`Failed to connect to doctors storage.`;W({type:`error`,message:t})}finally{D(!1)}},[W]);(0,g.useEffect)(()=>{K()},[K]);let q=e=>{e>=0&&e<l.length&&(S(e),w(l[e]),E(!1),G())},J=(e,t)=>{w(n=>({...n,[e]:t}))},Y=()=>{if(!C.drName||C.drName.trim().length<2)return`Doctor Name is required and must be at least 2 characters.`;if(!C.mobileNo||!C.mobileNo.trim())return`Mobile Number is required.`;let e=C.mobileNo.replace(/[^0-9]/g,``);return e.length<10||e.length>15?`Please provide a valid 10-15 digit mobile number.`:C.email&&C.email.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(C.email.trim())?`Please enter a valid email address.`:C.consultationFee!==void 0&&C.consultationFee<0?`Consultation Fee cannot be negative.`:C.followupFee!==void 0&&C.followupFee<0?`Follow-up Fee cannot be negative.`:null},X=async()=>{if(!T){E(!0);let e=`DR-${l.length+101}`;w({...x,id:e}),W({type:`success`,message:`New doctor form initialized. Fill details and click "Save Doctor" to record.`});return}let e=Y();if(e){W({type:`error`,message:e});return}k(!0);try{let e=await p.createDoctor(C);W({type:`success`,message:`Doctor ${e.doctor.drName} created successfully with ID ${e.doctor.id}.`});let t=[...l,e.doctor];d(t),S(t.length-1),w(e.doctor),E(!1)}catch(e){let t=e instanceof Error?e.message:`Failed to save doctor.`;W({type:`error`,message:t})}finally{k(!1)}},Z=async()=>{if(T){X();return}let e=Y();if(e){W({type:`error`,message:e});return}k(!0);try{let e=await p.updateDoctor(C.id,C);W({type:`success`,message:`Doctor ${e.doctor.drName} (${e.doctor.id}) updated successfully.`});let t=[...l];t[_]=e.doctor,d(t),w(e.doctor)}catch(e){let t=e instanceof Error?e.message:`Failed to update doctor.`;W({type:`error`,message:t})}finally{k(!1)}},Q=async e=>{if(C.id){k(!0);try{let t=await p.deleteDoctor(C.id,e);if(W({type:`success`,message:t.message}),B(!1),t.action===`deleted`){let e=l.filter(e=>e.id!==C.id);if(d(e),e.length>0){let t=Math.min(_,e.length-1);S(t),w(e[t])}else w(x),E(!0)}else{let e=[...l];e[_]={...e[_],status:`inactive`},d(e),w(e=>({...e,status:`inactive`}))}}catch(e){let t=e instanceof Error?e.message:`Operation failed.`;W({type:`error`,message:t})}finally{k(!1)}}},pe=(0,g.useMemo)(()=>{let e=new Set;return l.forEach(t=>{t.speciality&&e.add(t.speciality)}),Array.from(e).sort()},[l]),$=(0,g.useMemo)(()=>l.filter(e=>{if(L!==`All`&&e.status!==L||F!==`All`&&e.speciality!==F)return!1;if(N.trim()){let t=N.toLowerCase().trim();if(!(m(e.title,e.drName).toLowerCase().includes(t)||e.id.toLowerCase().includes(t)||e.drRegNo&&e.drRegNo.toLowerCase().includes(t)||e.mobileNo.includes(t)||e.speciality&&e.speciality.toLowerCase().includes(t)||e.department&&e.department.toLowerCase().includes(t)))return!1}return!0}),[l,N,F,L]);return(0,b.jsxs)(`div`,{className:y.pageContainer,children:[(0,b.jsxs)(`div`,{className:y.header,children:[(0,b.jsxs)(`div`,{className:y.headerLeft,children:[(0,b.jsx)(`span`,{className:y.recordCounter,children:T?`New Record (Total: ${l.length})`:`${l.length>0?_+1:0} of ${l.length}`}),(0,b.jsxs)(`span`,{className:y.idBadge,children:[`Dr ID: `,T?`${C.id||`Pending`}`:C.id||`--`]}),(0,b.jsx)(`h1`,{className:y.pageTitle,children:`Doctor Master`})]}),C.status===`inactive`&&!T&&(0,b.jsx)(`span`,{className:y.badgeInactive,children:`Record Deactivated / Inactive`})]}),U&&(0,b.jsxs)(`div`,{className:U.type===`success`?y.alertSuccess:y.alertError,role:`alert`,children:[(0,b.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[U.type===`success`?(0,b.jsx)(te,{size:18}):(0,b.jsx)(ee,{size:18}),(0,b.jsx)(`span`,{children:U.message})]}),(0,b.jsx)(`button`,{type:`button`,onClick:G,style:{background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},"aria-label":`Dismiss notification`,children:(0,b.jsx)(u,{size:16})})]}),(0,b.jsxs)(`form`,{ref:ue,onKeyDown:de,onSubmit:e=>{e.preventDefault(),T?X():Z()},className:y.formContainer,children:[(0,b.jsxs)(`div`,{className:y.section,children:[(0,b.jsx)(`h2`,{className:y.sectionTitle,children:`General Information`}),(0,b.jsxs)(`div`,{className:y.row,children:[(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1.5},children:[(0,b.jsx)(`label`,{className:y.label,children:`Dr Hos/Ref :`}),(0,b.jsxs)(`select`,{className:y.input,style:{backgroundColor:`var(--primary)`,color:`white`,borderColor:`var(--primary)`,fontWeight:600},value:C.drHosRef,onChange:e=>J(`drHosRef`,e.target.value),children:[(0,b.jsx)(`option`,{value:`Hospital Doctor`,children:`Hospital Doctor`}),(0,b.jsx)(`option`,{value:`Reference Doctor`,children:`Reference Doctor`}),(0,b.jsx)(`option`,{value:`Both`,children:`Both`})]})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1.5},children:[(0,b.jsx)(`label`,{className:y.label,children:`Dr Type :`}),(0,b.jsxs)(`select`,{className:y.input,value:C.drType,onChange:e=>J(`drType`,e.target.value),children:[(0,b.jsx)(`option`,{value:`Consultant Physician`,children:`Consultant Physician`}),(0,b.jsx)(`option`,{value:`Consultant Surgeon`,children:`Consultant Surgeon`}),(0,b.jsx)(`option`,{value:`Cardiologist`,children:`Cardiologist`}),(0,b.jsx)(`option`,{value:`Pediatrician`,children:`Pediatrician`}),(0,b.jsx)(`option`,{value:`Radiologist`,children:`Radiologist`}),(0,b.jsx)(`option`,{value:`Reference Doctor`,children:`Reference Doctor`}),(0,b.jsx)(`option`,{value:`Gynecologist`,children:`Gynecologist`}),(0,b.jsx)(`option`,{value:`General Practitioner`,children:`General Practitioner`}),(0,b.jsx)(`option`,{value:`Resident Doctor`,children:`Resident Doctor`}),(0,b.jsx)(`option`,{value:`Visiting Doctor`,children:`Visiting Doctor`})]})]}),(0,b.jsx)(`div`,{className:y.fieldGroup,style:{flex:1,justifyContent:`flex-end`},children:(0,b.jsxs)(`div`,{className:y.radioGroup,children:[(0,b.jsxs)(`label`,{className:y.radioLabel,children:[(0,b.jsx)(`input`,{type:`radio`,name:`status`,checked:C.status===`active`,onChange:()=>J(`status`,`active`)}),` `,`Active`]}),(0,b.jsxs)(`label`,{className:y.radioLabel,children:[(0,b.jsx)(`input`,{type:`radio`,name:`status`,checked:C.status===`inactive`,onChange:()=>J(`status`,`inactive`)}),` `,`Inactive`]})]})})]}),(0,b.jsxs)(`div`,{className:y.row,style:{alignItems:`flex-start`},children:[(0,b.jsx)(`div`,{className:y.col,style:{flex:2},children:(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`4px`},children:[(0,b.jsxs)(`div`,{className:y.fieldGroup,children:[(0,b.jsx)(`label`,{className:y.label,children:`Dr.Name :`}),(0,b.jsxs)(`select`,{className:y.input,style:{flex:`0 0 80px`},value:C.title,onChange:e=>J(`title`,e.target.value),children:[(0,b.jsx)(`option`,{value:`Dr.`,children:`Dr.`}),(0,b.jsx)(`option`,{value:`Mr.`,children:`Mr.`}),(0,b.jsx)(`option`,{value:`Mrs.`,children:`Mrs.`}),(0,b.jsx)(`option`,{value:`Ms.`,children:`Ms.`})]}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`First Middle Last`,value:C.drName,onChange:e=>J(`drName`,e.target.value)})]}),(0,b.jsx)(`div`,{className:y.helperText,children:`Format : first middle last - degree`})]})}),(0,b.jsx)(`div`,{className:y.col,style:{flex:1.2,justifyContent:`center`,paddingTop:`10px`},children:(0,b.jsxs)(`div`,{className:y.checkboxItem,onClick:()=>J(`hospitalName`,!C.hospitalName),children:[C.hospitalName?(0,b.jsx)(s,{size:16,color:`var(--primary)`}):(0,b.jsx)(c,{size:16,color:`var(--text-muted)`}),(0,b.jsx)(`span`,{style:{color:C.hospitalName?`var(--text-main)`:`var(--text-muted)`},children:`Hospital Name`})]})}),(0,b.jsx)(`div`,{className:y.col,style:{flex:1.5},children:(0,b.jsxs)(`div`,{className:y.fieldGroup,children:[(0,b.jsx)(`label`,{className:y.label,children:`Degree :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`e.g. MBBS, MD, MS`,value:C.degree||``,onChange:e=>J(`degree`,e.target.value)})]})})]}),(0,b.jsxs)(`div`,{className:y.row,children:[(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1.2},children:[(0,b.jsx)(`label`,{className:y.label,children:`Speciality :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`e.g. Cardiology, Surgery`,value:C.speciality||``,onChange:e=>J(`speciality`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1.2},children:[(0,b.jsx)(`label`,{className:y.label,children:`Department :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`e.g. Medicine, OPD, Surgery`,value:C.department||``,onChange:e=>J(`department`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Dr. Reg No :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Medical Council Reg`,value:C.drRegNo||``,onChange:e=>J(`drRegNo`,e.target.value)})]})]}),(0,b.jsxs)(`div`,{className:y.row,children:[(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Birth Date :`}),(0,b.jsx)(`input`,{type:`date`,className:y.input,max:`2099-12-31`,value:C.birthDate||``,onChange:e=>J(`birthDate`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Wedding :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`e.g. 24-Dec`,value:C.wedding||``,onChange:e=>J(`wedding`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`PanNo :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`PAN Number`,value:C.panNo||``,onChange:e=>J(`panNo`,e.target.value.toUpperCase())})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,style:{width:`80px`},children:`Adhar No :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Aadhaar Card No`,value:C.adharNo||``,onChange:e=>J(`adharNo`,e.target.value)})]})]}),(0,b.jsxs)(`div`,{className:y.row,children:[(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Mobile No. :`}),(0,b.jsx)(`input`,{type:`tel`,className:y.input,placeholder:`10-digit mobile`,value:C.mobileNo,onChange:e=>J(`mobileNo`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Ph.No.(R) :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Residence Phone`,value:C.phNoR||``,onChange:e=>J(`phNoR`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1.5},children:[(0,b.jsx)(`label`,{className:y.label,children:`E-Mail :`}),(0,b.jsx)(`input`,{type:`email`,className:y.input,placeholder:`doctor@hospital.com`,value:C.email||``,onChange:e=>J(`email`,e.target.value)})]})]}),(0,b.jsxs)(`div`,{className:y.row,children:[(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Consultation Fee :`}),(0,b.jsx)(`input`,{type:`number`,min:`0`,className:y.input,placeholder:`₹ 500`,value:C.consultationFee??``,onChange:e=>J(`consultationFee`,parseFloat(e.target.value)||0)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Follow-up Fee :`}),(0,b.jsx)(`input`,{type:`number`,min:`0`,className:y.input,placeholder:`₹ 300`,value:C.followupFee??``,onChange:e=>J(`followupFee`,parseFloat(e.target.value)||0)})]}),(0,b.jsx)(`div`,{style:{flex:1.5}})]})]}),(0,b.jsxs)(`div`,{className:y.section,children:[(0,b.jsx)(`h2`,{className:y.sectionTitle,children:`Clinic Detail`}),(0,b.jsx)(`div`,{className:y.row,children:(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Clinic Name :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Clinic / Hospital Branch Name`,value:C.clinicName||``,onChange:e=>J(`clinicName`,e.target.value)})]})}),(0,b.jsx)(`div`,{className:y.row,children:(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Address :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Street Address, Building, Landmark`,value:C.address||``,onChange:e=>J(`address`,e.target.value)})]})}),(0,b.jsxs)(`div`,{className:y.row,children:[(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Area :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Area / Locality`,value:C.area||``,onChange:e=>J(`area`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`City :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,value:C.city||`SURAT`,onChange:e=>J(`city`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Pin :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`PIN Code`,value:C.pin||``,onChange:e=>J(`pin`,e.target.value)})]})]}),(0,b.jsxs)(`div`,{className:y.row,children:[(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`State :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,value:C.state||`GUJARAT`,onChange:e=>J(`state`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Country :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,value:C.country||`INDIA`,onChange:e=>J(`country`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.fieldGroup,style:{flex:1},children:[(0,b.jsx)(`label`,{className:y.label,children:`Clinic Ph.No. :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Clinic Phone / Landline`,value:C.clinicPhNo||``,onChange:e=>J(`clinicPhNo`,e.target.value)})]})]})]})]}),(0,b.jsxs)(`div`,{className:y.actionBar,children:[(0,b.jsxs)(`div`,{className:y.navControls,children:[(0,b.jsx)(`button`,{type:`button`,className:y.navBtn,title:`First Record`,disabled:_===0||T,onClick:()=>q(0),children:(0,b.jsx)(n,{size:20})}),(0,b.jsx)(`button`,{type:`button`,className:y.navBtn,title:`Previous Record`,disabled:_===0||T,onClick:()=>q(_-1),children:(0,b.jsx)(t,{size:20})}),(0,b.jsx)(`button`,{type:`button`,className:y.navBtn,title:`Next Record`,disabled:_>=l.length-1||T,onClick:()=>q(_+1),children:(0,b.jsx)(ae,{size:20})}),(0,b.jsx)(`button`,{type:`button`,className:y.navBtn,title:`Last Record`,disabled:_>=l.length-1||T,onClick:()=>q(l.length-1),children:(0,b.jsx)(r,{size:20})})]}),(0,b.jsxs)(`div`,{className:y.middleActions,children:[(0,b.jsxs)(`div`,{className:y.printBtn,onClick:()=>{j(!A),v(C)},children:[A?(0,b.jsx)(s,{size:18,color:`var(--primary)`}):(0,b.jsx)(c,{size:18}),(0,b.jsx)(`span`,{children:`Print Profile`})]}),(0,b.jsxs)(`button`,{type:`button`,className:y.secondaryBtn,onClick:()=>M(!0),style:{marginLeft:`16px`},children:[(0,b.jsx)(o,{size:18}),` Particular Search`]})]}),(0,b.jsxs)(`div`,{className:y.rightActions,children:[(0,b.jsxs)(`button`,{type:`button`,className:y.primaryBtn,disabled:O,onClick:X,children:[(0,b.jsx)(ne,{size:18}),` `,T?`Save Doctor`:`Add New`]}),!T&&(0,b.jsxs)(`button`,{type:`button`,className:y.secondaryBtn,disabled:O,onClick:Z,children:[(0,b.jsx)(i,{size:18}),` Update`]}),!T&&(0,b.jsxs)(`button`,{type:`button`,className:y.dangerBtn,disabled:O,onClick:()=>B(!0),children:[(0,b.jsx)(ie,{size:18}),` Delete / Deactivate`]}),(0,b.jsxs)(`button`,{type:`button`,className:y.secondaryBtn,style:{marginLeft:`16px`},onClick:()=>e(`/`),children:[(0,b.jsx)(se,{size:18}),` Exit`]})]})]}),fe&&(0,b.jsx)(`div`,{className:y.modalOverlay,onClick:()=>M(!1),children:(0,b.jsxs)(`div`,{className:y.modalContent,onClick:e=>e.stopPropagation(),children:[(0,b.jsxs)(`div`,{className:y.modalHeader,children:[(0,b.jsxs)(`h3`,{className:y.modalTitle,children:[(0,b.jsx)(o,{size:18,color:`var(--primary)`}),` Particular Search — Doctor Directory`]}),(0,b.jsx)(`button`,{type:`button`,className:y.modalCloseBtn,onClick:()=>M(!1),children:(0,b.jsx)(u,{size:18})})]}),(0,b.jsxs)(`div`,{className:y.modalBody,children:[(0,b.jsxs)(`div`,{className:y.searchToolbar,children:[(0,b.jsxs)(`div`,{className:y.searchBox,children:[(0,b.jsx)(o,{size:16,color:`var(--text-muted)`}),(0,b.jsx)(`input`,{type:`text`,placeholder:`Instant search by Doctor Name, ID, Reg No, Mobile, or Speciality...`,value:N,onChange:e=>P(e.target.value),autoFocus:!0}),N&&(0,b.jsx)(`button`,{type:`button`,onClick:()=>P(``),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-muted)`},children:(0,b.jsx)(u,{size:14})})]}),(0,b.jsxs)(`div`,{className:y.filterRow,children:[(0,b.jsxs)(`select`,{className:y.filterSelect,value:F,onChange:e=>I(e.target.value),children:[(0,b.jsx)(`option`,{value:`All`,children:`All Specialities`}),pe.map(e=>(0,b.jsx)(`option`,{value:e,children:e},e))]}),(0,b.jsxs)(`select`,{className:y.filterSelect,value:L,onChange:e=>R(e.target.value),children:[(0,b.jsx)(`option`,{value:`All`,children:`All Statuses`}),(0,b.jsx)(`option`,{value:`active`,children:`Active Only`}),(0,b.jsx)(`option`,{value:`inactive`,children:`Inactive Only`})]}),(0,b.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`,marginLeft:`auto`},children:[`Showing `,$.length,` of `,l.length,` doctors`]})]})]}),(0,b.jsx)(`div`,{className:y.tableWrapper,children:(0,b.jsxs)(`table`,{className:y.modalTable,children:[(0,b.jsx)(`thead`,{children:(0,b.jsxs)(`tr`,{children:[(0,b.jsx)(`th`,{children:`Doctor ID`}),(0,b.jsx)(`th`,{children:`Doctor Name`}),(0,b.jsx)(`th`,{children:`Speciality`}),(0,b.jsx)(`th`,{children:`Department`}),(0,b.jsx)(`th`,{children:`Mobile`}),(0,b.jsx)(`th`,{children:`Status`})]})}),(0,b.jsx)(`tbody`,{children:$.length===0?(0,b.jsx)(`tr`,{children:(0,b.jsx)(`td`,{colSpan:6,className:y.emptyState,children:`No doctors found matching the search criteria.`})}):$.map(e=>(0,b.jsxs)(`tr`,{className:`${y.tableRow} ${e.id===C.id?y.tableRowSelected:``}`,onClick:()=>{let t=l.findIndex(t=>t.id===e.id);t!==-1&&q(t),M(!1)},children:[(0,b.jsx)(`td`,{style:{fontWeight:600,color:`var(--primary)`},children:e.id}),(0,b.jsxs)(`td`,{children:[(0,b.jsx)(`strong`,{children:m(e.title,e.drName)}),e.degree&&(0,b.jsxs)(`span`,{style:{color:`var(--text-muted)`,fontSize:`12px`,marginLeft:`6px`},children:[`(`,e.degree,`)`]})]}),(0,b.jsx)(`td`,{children:e.speciality||`-`}),(0,b.jsx)(`td`,{children:e.department||`-`}),(0,b.jsx)(`td`,{children:e.mobileNo}),(0,b.jsx)(`td`,{children:e.status===`active`?(0,b.jsx)(`span`,{className:y.badgeActive,children:`Active`}):(0,b.jsx)(`span`,{className:y.badgeInactive,children:`Inactive`})})]},e.id))})]})})]}),(0,b.jsx)(`div`,{className:y.modalFooter,children:(0,b.jsx)(`button`,{type:`button`,className:y.secondaryBtn,onClick:()=>M(!1),children:`Close`})})]})}),z&&(0,b.jsx)(`div`,{className:y.modalOverlay,onClick:()=>B(!1),children:(0,b.jsxs)(`div`,{className:y.modalContent,style:{maxWidth:`500px`},onClick:e=>e.stopPropagation(),children:[(0,b.jsxs)(`div`,{className:y.modalHeader,children:[(0,b.jsxs)(`h3`,{className:y.modalTitle,style:{color:`var(--danger)`},children:[(0,b.jsx)(re,{size:20}),` Delete or Deactivate Doctor`]}),(0,b.jsx)(`button`,{type:`button`,className:y.modalCloseBtn,onClick:()=>B(!1),children:(0,b.jsx)(u,{size:18})})]}),(0,b.jsxs)(`div`,{className:y.modalBody,children:[(0,b.jsxs)(`p`,{style:{margin:0,fontSize:`14px`,lineHeight:1.5},children:[`You are about to remove `,(0,b.jsxs)(`strong`,{children:[m(C.title,C.drName),` (`,C.id,`)`]}),`.`]}),(0,b.jsxs)(`div`,{style:{backgroundColor:`var(--warning-soft)`,padding:`12px`,borderRadius:`6px`,fontSize:`13px`,color:`var(--text-main)`},children:[(0,b.jsx)(`strong`,{children:`Healthcare Best Practice:`}),` We recommend `,(0,b.jsx)(`em`,{children:`Deactivating`}),` the doctor instead of permanent deletion. This preserves historical patient registrations, prescriptions, and billing receipts while preventing future selections.`]})]}),(0,b.jsxs)(`div`,{className:y.modalFooter,children:[(0,b.jsx)(`button`,{type:`button`,className:y.secondaryBtn,onClick:()=>B(!1),children:`Cancel`}),(0,b.jsx)(`button`,{type:`button`,className:y.secondaryBtn,style:{borderColor:`var(--danger)`,color:`var(--danger)`},onClick:()=>Q(!1),children:`Deactivate (Safe)`}),(0,b.jsx)(`button`,{type:`button`,className:y.dangerBtn,onClick:()=>Q(!0),children:`Delete Permanently`})]})]})}),V&&(0,b.jsx)(`div`,{className:y.modalOverlay,onClick:()=>H(!1),children:(0,b.jsxs)(`div`,{className:y.modalContent,style:{maxWidth:`650px`},onClick:e=>e.stopPropagation(),children:[(0,b.jsxs)(`div`,{className:y.modalHeader,children:[(0,b.jsxs)(`h3`,{className:y.modalTitle,children:[(0,b.jsx)(a,{size:18}),` Doctor Profile Preview — `,f.name]}),(0,b.jsx)(`button`,{type:`button`,className:y.modalCloseBtn,onClick:()=>H(!1),children:(0,b.jsx)(u,{size:18})})]}),(0,b.jsx)(`div`,{className:y.modalBody,id:`doctor-print-area`,children:(0,b.jsxs)(`div`,{style:{border:`2px solid var(--border)`,padding:`24px`,borderRadius:`8px`,background:`var(--surface)`},children:[(0,b.jsxs)(`div`,{style:{textAlign:`center`,borderBottom:`1px solid var(--border)`,paddingBottom:`12px`,marginBottom:`16px`},children:[(0,b.jsx)(`h2`,{style:{margin:0,color:`var(--primary)`,fontSize:`20px`},children:f.name}),(0,b.jsx)(`p`,{style:{margin:`4px 0 0 0`,color:`var(--text-muted)`,fontSize:`12px`},children:f.address}),(0,b.jsxs)(`p`,{style:{margin:`2px 0 0 0`,color:`var(--text-muted)`,fontSize:`12px`},children:[`Phone: `,f.phone,` | Email: `,f.email]})]}),(0,b.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`12px`,fontSize:`13px`},children:[(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Doctor ID:`}),` `,C.id]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Doctor Type:`}),` `,C.drType]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Full Name:`}),` `,m(C.title,C.drName)]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Degree:`}),` `,C.degree||`-`]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Speciality:`}),` `,C.speciality||`-`]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Department:`}),` `,C.department||`-`]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Medical Reg No:`}),` `,C.drRegNo||`-`]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Status:`}),` `,C.status.toUpperCase()]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Mobile:`}),` `,C.mobileNo]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Email:`}),` `,C.email||`-`]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Consultation Fee:`}),` ₹ `,C.consultationFee||0]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Follow-up Fee:`}),` ₹ `,C.followupFee||0]}),(0,b.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,b.jsx)(`strong`,{children:`Clinic / Branch:`}),` `,C.clinicName||`-`]}),(0,b.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,b.jsx)(`strong`,{children:`Clinic Address:`}),` `,C.address||`-`,`, `,C.city,` - `,C.pin]})]})]})}),(0,b.jsxs)(`div`,{className:y.modalFooter,children:[(0,b.jsx)(`button`,{type:`button`,className:y.secondaryBtn,onClick:()=>H(!1),children:`Close`}),(0,b.jsxs)(`button`,{type:`button`,className:y.primaryBtn,onClick:()=>window.print(),children:[(0,b.jsx)(a,{size:16}),` Print Document`]})]})]})})]})};export{S as default};