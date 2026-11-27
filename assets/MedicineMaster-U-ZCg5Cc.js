import{r as e}from"./rolldown-runtime-hePW80VL.js";import{t}from"./chevron-left-UdjAris-.js";import{n,t as ee}from"./chevrons-right-EgEfRNzx.js";import{t as r}from"./circle-alert-CMavx8O-.js";import{t as te}from"./circle-check-DNe6mN3Y.js";import{t as ne}from"./pen-tT1CD4t5.js";import{t as i}from"./printer-D6CmX7fu.js";import{t as a}from"./save-s1hk5rEL.js";import{t as o}from"./search-BZJOQpLU.js";import{t as re}from"./shield-alert-DP3zqIPx.js";import{t as ie}from"./trash-BdzeDtqH.js";import{C as s,I as c,N as l,h as u,i as d,r as f,t as p}from"./index-IkZdKeT5.js";import{o as m}from"./masterApi-JRUmigoj.js";import{t as ae}from"./useAutoDismissNotification-DcuI_SZO.js";import{n as h}from"./useFormKeyboardNavigation-mpzVcwT8.js";var g=e(c(),1);function _(e){let t=new Date().toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`});return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Medicine Record - ${e.brandName}</title>
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
        <div class="hosp-name">${p.name}</div>
        <div class="hosp-tag">Hospital Formulary & Pharmacy Master • ${p.address}</div>
      </div>
      <div class="med-meta-badge">
        <div><strong>Date:</strong> ${t}</div>
        <div><strong>Item Code:</strong> ${e.id}</div>
      </div>
    </header>

    <div class="profile-title-bar">
      <div>
        <div class="med-hero-name">${e.brandName}</div>
        <div class="med-hero-generic">${e.genericName} • ${e.strength||``} (${e.dosageForm||`Tablet`})</div>
      </div>
      <div class="med-status-pill">${e.status||`Active`}</div>
    </div>

    <div class="section-title">Clinical & Pharmaceutical Specifications</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Brand Name</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.brandName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Generic Name</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.genericName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Dosage Form</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.dosageForm||`Tablet`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Strength</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.strength||`--`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Pharmacology Group</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.medicineGroup||`General Medicine`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Default Frequency</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.frequency||`1-0-1 (Twice Daily)`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">For Patient Type</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.forPatient||`Both (OPD / IPD)`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Dispensing Unit</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.unit||`Strip / Box`}</span>
      </div>
    </div>

    <div class="section-title">Manufacturing & Batch Details</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Manufacturer</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.manufacturer||`Standard Pharmaceutical`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Batch Number</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.batchNo||`BATCH-2026-X`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Expiry Date</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.expiryDate||`2028-12-31`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Stock Availability</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.availability||`In Stock`}</span>
      </div>
    </div>

    <div class="section-title">Pricing, Inventory & Tax Structure</div>
    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Selling MRP</span>
        <span class="info-colon">:</span>
        <span class="info-val" style="font-weight: 700; color: #0284c7;">₹ ${e.sellingPrice===void 0?`120.00`:e.sellingPrice}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Purchase Rate</span>
        <span class="info-colon">:</span>
        <span class="info-val">₹ ${e.purchasePrice===void 0?`85.00`:e.purchasePrice}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Current Stock Qty</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.stockQty===void 0?`250`:e.stockQty} ${e.unit||`Units`}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Reorder Level</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.reorderLevel===void 0?`50`:e.reorderLevel}</span>
      </div>
      <div class="info-row">
        <span class="info-label">GST Rate</span>
        <span class="info-colon">:</span>
        <span class="info-val">${e.gst===void 0?`12`:e.gst} %</span>
      </div>
    </div>

    ${e.notes||e.remark1?`
      <div class="section-title">Clinical Notes & Administration Advisory</div>
      <div style="font-size: 12.5px; color: #334155; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 4px;">
        ${e.notes||e.remark1||``}
      </div>
    `:``}

    <footer class="print-footer">
      <div>Generated by <strong>Mixu Infosystem EMR</strong> • Medicine Master Record</div>
      <div>Hospital Pharmacy Department Verification</div>
    </footer>
  </div>
</body>
</html>`}function v(e){let t=window.open(`about:blank`,`_blank`);if(!t){alert(`Please allow popups to open the Medicine Record print preview.`);return}let n=_(e);t.document.open(),t.document.write(n),t.document.close()}var y={pageContainer:`_pageContainer_18cfz_1`,header:`_header_18cfz_14`,pageTitle:`_pageTitle_18cfz_22`,recordCounter:`_recordCounter_18cfz_29`,mainGrid:`_mainGrid_18cfz_40`,formSection:`_formSection_18cfz_49`,rightSection:`_rightSection_18cfz_60`,largeDisplayBox:`_largeDisplayBox_18cfz_66`,formRow:`_formRow_18cfz_80`,label:`_label_18cfz_86`,input:`_input_18cfz_95`,highlightInput:`_highlightInput_18cfz_113`,shortInput:`_shortInput_18cfz_117`,radioGroup:`_radioGroup_18cfz_121`,radioItem:`_radioItem_18cfz_131`,actionBar:`_actionBar_18cfz_141`,navControls:`_navControls_18cfz_152`,navBtn:`_navBtn_18cfz_157`,rightActions:`_rightActions_18cfz_176`,secondaryBtn:`_secondaryBtn_18cfz_182`,primaryBtn:`_primaryBtn_18cfz_203`,dangerBtn:`_dangerBtn_18cfz_223`,topHeader:`_topHeader_18cfz_254`,fieldGroup:`_fieldGroup_18cfz_256`,fieldGroupHorizontal:`_fieldGroupHorizontal_18cfz_256`,inputWithUnit:`_inputWithUnit_18cfz_256`,select:`_select_18cfz_259`,textarea:`_textarea_18cfz_259`,alertSuccess:`_alertSuccess_18cfz_273`,alertError:`_alertError_18cfz_287`,modalOverlay:`_modalOverlay_18cfz_323`,modalContent:`_modalContent_18cfz_335`,modalHeader:`_modalHeader_18cfz_348`,modalTitle:`_modalTitle_18cfz_357`,modalCloseBtn:`_modalCloseBtn_18cfz_367`,modalBody:`_modalBody_18cfz_384`,modalFooter:`_modalFooter_18cfz_392`,searchToolbar:`_searchToolbar_18cfz_403`,searchBox:`_searchBox_18cfz_409`,filterRow:`_filterRow_18cfz_429`,filterSelect:`_filterSelect_18cfz_436`,tableWrapper:`_tableWrapper_18cfz_447`,modalTable:`_modalTable_18cfz_454`,tableRow:`_tableRow_18cfz_476`,tableRowSelected:`_tableRowSelected_18cfz_485`,badgeActive:`_badgeActive_18cfz_489`,badgeInactive:`_badgeInactive_18cfz_499`,emptyState:`_emptyState_18cfz_509`},b=f(),x={id:``,brandName:``,genericName:``,medicineGroup:`General`,dosageForm:`Tablet`,strength:``,frequency:`1-0-1`,availability:`In Stock`,remark1:``,remark2:``,totalDays:5,notes:``,forPatient:`Both`,unit:`Strip`,manufacturer:``,batchNo:``,expiryDate:``,purchasePrice:0,sellingPrice:0,stockQty:100,reorderLevel:20,gst:12,status:`active`},S=()=>{let e=l(),[c,f]=(0,g.useState)([]),[_,S]=(0,g.useState)(0),[C,w]=(0,g.useState)(x),[T,E]=(0,g.useState)(!1),[oe,D]=(0,g.useState)(!0),[O,k]=(0,g.useState)(!1),[se,A]=(0,g.useState)(!1),[j,M]=(0,g.useState)(``),[N,P]=(0,g.useState)(`All`),[F,I]=(0,g.useState)(`All`),[L,R]=(0,g.useState)(!1),[z,B]=(0,g.useState)(!1),{formRef:V,handleKeyDown:H}=h(),{notification:U,setNotification:W,dismissNotification:G}=ae(),K=(0,g.useCallback)(async()=>{D(!0);try{let e=(await m.getMedicines()).medicines||[];f(e),e.length>0?(S(0),w(e[0]),E(!1)):(w(x),E(!0))}catch(e){let t=e instanceof Error?e.message:`Failed to connect to medicine storage.`;W({type:`error`,message:t})}finally{D(!1)}},[W]);(0,g.useEffect)(()=>{K()},[K]);let q=e=>{e>=0&&e<c.length&&(S(e),w(c[e]),E(!1),G())},J=(e,t)=>{w(n=>({...n,[e]:t}))},Y=()=>!C.brandName||C.brandName.trim().length<2?`Brand Name is required and must be at least 2 characters.`:!C.genericName||C.genericName.trim().length<2?`Generic Name is required.`:C.totalDays!==void 0&&C.totalDays<0?`Total Days cannot be negative.`:C.purchasePrice!==void 0&&C.purchasePrice<0?`Purchase Price cannot be negative.`:C.sellingPrice!==void 0&&C.sellingPrice<0?`Selling Price (MRP) cannot be negative.`:C.stockQty!==void 0&&C.stockQty<0?`Stock Quantity cannot be negative.`:C.reorderLevel!==void 0&&C.reorderLevel<0?`Reorder Level cannot be negative.`:C.gst!==void 0&&(C.gst<0||C.gst>100)?`GST percentage must be between 0% and 100%.`:null,X=async()=>{if(!T){E(!0);let e=`MED-${c.length+1001}`;w({...x,id:e}),W({type:`success`,message:`New medicine form initialized. Fill details and click "Save Medicine" to add to formulary.`});return}let e=Y();if(e){W({type:`error`,message:e});return}k(!0);try{let e=await m.createMedicine(C);W({type:`success`,message:`Medicine ${e.medicine.brandName} added successfully with ID ${e.medicine.id}.`});let t=[...c,e.medicine];f(t),S(t.length-1),w(e.medicine),E(!1)}catch(e){let t=e instanceof Error?e.message:`Failed to add medicine.`;W({type:`error`,message:t})}finally{k(!1)}},Z=async()=>{if(T){X();return}let e=Y();if(e){W({type:`error`,message:e});return}k(!0);try{let e=await m.updateMedicine(C.id,C);W({type:`success`,message:`Medicine ${e.medicine.brandName} (${e.medicine.id}) updated successfully.`});let t=[...c];t[_]=e.medicine,f(t),w(e.medicine)}catch(e){let t=e instanceof Error?e.message:`Failed to update medicine.`;W({type:`error`,message:t})}finally{k(!1)}},Q=async e=>{if(C.id){k(!0);try{let t=await m.deleteMedicine(C.id,e);if(W({type:`success`,message:t.message}),R(!1),t.action===`deleted`){let e=c.filter(e=>e.id!==C.id);if(f(e),e.length>0){let t=Math.min(_,e.length-1);S(t),w(e[t])}else w(x),E(!0)}else{let e=[...c];e[_]={...e[_],status:`inactive`},f(e),w(e=>({...e,status:`inactive`}))}}catch(e){let t=e instanceof Error?e.message:`Operation failed.`;W({type:`error`,message:t})}finally{k(!1)}}},ce=(0,g.useMemo)(()=>[`MEDICINE ID: ${C.id||`Pending`}`,`BRAND: ${C.brandName||`--`}`,`GENERIC: ${C.genericName||`--`}`,`GROUP: ${C.medicineGroup||`General`}`,`DOSAGE FORM: ${C.dosageForm||`Tablet`} | STRENGTH: ${C.strength||`--`}`,`FREQUENCY: ${C.frequency||`1-0-1`} | DURATION: ${C.totalDays||0} days`,`AVAILABILITY: ${C.availability||`In Stock`} | APPLICABLE FOR: ${C.forPatient||`Both`}`,`PRICE: MRP ₹ ${C.sellingPrice||0} (Purchase: ₹ ${C.purchasePrice||0})`,`CURRENT STOCK: ${C.stockQty||0} ${C.unit||`Units`} (Reorder Level: ${C.reorderLevel||0})`,C.batchNo?`BATCH: ${C.batchNo} | EXPIRY: ${C.expiryDate||`N/A`}`:``,C.remark1?`REMARK 1: ${C.remark1}`:``,C.remark2?`REMARK 2: ${C.remark2}`:``,C.notes?`NOTES: ${C.notes}`:``,`STATUS: ${(C.status||`active`).toUpperCase()}`].filter(Boolean).join(`
`),[C]),le=(0,g.useMemo)(()=>{let e=new Set;return c.forEach(t=>{t.medicineGroup&&e.add(t.medicineGroup)}),Array.from(e).sort()},[c]),$=(0,g.useMemo)(()=>c.filter(e=>{if(F!==`All`&&e.status!==F||N!==`All`&&e.medicineGroup!==N)return!1;if(j.trim()){let t=j.toLowerCase().trim();if(!(e.brandName.toLowerCase().includes(t)||e.genericName.toLowerCase().includes(t)||e.id.toLowerCase().includes(t)||e.medicineGroup&&e.medicineGroup.toLowerCase().includes(t)||e.dosageForm&&e.dosageForm.toLowerCase().includes(t)||e.batchNo&&e.batchNo.toLowerCase().includes(t)))return!1}return!0}),[c,j,N,F]);return(0,b.jsxs)(`div`,{className:y.pageContainer,children:[(0,b.jsxs)(`div`,{className:y.header,children:[(0,b.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`16px`},children:[(0,b.jsx)(`span`,{className:y.recordCounter,children:T?`New Medicine (Total: ${c.length})`:`${c.length>0?_+1:0} of ${c.length}`}),(0,b.jsxs)(`span`,{style:{fontSize:`13px`,fontWeight:600,color:`var(--primary)`,background:`var(--primary-soft, #e8f0fe)`,padding:`6px 12px`,borderRadius:`6px`},children:[`ID: `,T?`${C.id||`Pending`}`:C.id||`--`]}),(0,b.jsx)(`h1`,{className:y.pageTitle,children:`Medicine Master`})]}),C.status===`inactive`&&!T&&(0,b.jsx)(`span`,{className:y.badgeInactive,children:`Record Deactivated / Inactive`})]}),U&&(0,b.jsxs)(`div`,{className:U.type===`success`?y.alertSuccess:y.alertError,role:`alert`,children:[(0,b.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[U.type===`success`?(0,b.jsx)(te,{size:18}):(0,b.jsx)(r,{size:18}),(0,b.jsx)(`span`,{children:U.message})]}),(0,b.jsx)(`button`,{type:`button`,onClick:G,style:{background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},"aria-label":`Dismiss notification`,children:(0,b.jsx)(d,{size:16})})]}),(0,b.jsxs)(`form`,{ref:V,onKeyDown:H,onSubmit:e=>{e.preventDefault(),T?X():Z()},className:y.mainGrid,children:[(0,b.jsxs)(`div`,{className:y.formSection,children:[(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,children:`Brand Name :`}),(0,b.jsx)(`input`,{type:`text`,className:`${y.input} ${y.highlightInput}`,placeholder:`e.g. Paracetamol 650 (Dolo), Augmentin 625 Duo`,value:C.brandName,onChange:e=>J(`brandName`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,children:`Dosage Form :`}),(0,b.jsxs)(`select`,{className:y.input,value:C.dosageForm||`Tablet`,onChange:e=>J(`dosageForm`,e.target.value),children:[(0,b.jsx)(`option`,{value:`Tablet`,children:`Tablet`}),(0,b.jsx)(`option`,{value:`Capsule`,children:`Capsule`}),(0,b.jsx)(`option`,{value:`Syrup`,children:`Syrup`}),(0,b.jsx)(`option`,{value:`Injection`,children:`Injection`}),(0,b.jsx)(`option`,{value:`Ointment`,children:`Ointment / Gel`}),(0,b.jsx)(`option`,{value:`Drops`,children:`Eye/Ear Drops`}),(0,b.jsx)(`option`,{value:`Surgical Suture`,children:`Surgical Suture / Consumable`}),(0,b.jsx)(`option`,{value:`IV Fluid`,children:`IV Infusion / Fluid`}),(0,b.jsx)(`option`,{value:`Inhaler`,children:`Inhaler / Respules`})]}),(0,b.jsx)(`label`,{className:y.label,style:{width:`80px`},children:`Strength :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`e.g. 650 mg`,value:C.strength||``,onChange:e=>J(`strength`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,children:`Frequency :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`e.g. 1-0-1, TDS, SOS`,value:C.frequency||``,onChange:e=>J(`frequency`,e.target.value)}),(0,b.jsx)(`label`,{className:y.label,style:{width:`90px`},children:`Availability :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,style:{maxWidth:`120px`},value:C.availability||`In Stock`,onChange:e=>J(`availability`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,children:`Remark 1 :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`e.g. Take after food`,value:C.remark1||``,onChange:e=>J(`remark1`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,children:`Remark 2 :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`e.g. Complete full course`,value:C.remark2||``,onChange:e=>J(`remark2`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,children:`Total Days :`}),(0,b.jsx)(`input`,{type:`number`,min:`0`,className:`${y.input} ${y.shortInput}`,value:C.totalDays??0,onChange:e=>J(`totalDays`,parseInt(e.target.value,10)||0)}),(0,b.jsx)(`label`,{className:y.label,style:{width:`80px`},children:`For :`}),(0,b.jsxs)(`select`,{className:`${y.input} ${y.shortInput}`,value:C.forPatient||`Both`,onChange:e=>J(`forPatient`,e.target.value),children:[(0,b.jsx)(`option`,{value:`Both`,children:`Both (OPD & IPD)`}),(0,b.jsx)(`option`,{value:`OPD`,children:`OPD Only`}),(0,b.jsx)(`option`,{value:`IPD`,children:`IPD Only`}),(0,b.jsx)(`option`,{value:`Male`,children:`Male`}),(0,b.jsx)(`option`,{value:`Female`,children:`Female`})]})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,children:`Notes :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Clinical precautions or contraindications`,value:C.notes||``,onChange:e=>J(`notes`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,children:`Pricing (₹) :`}),(0,b.jsx)(`input`,{type:`number`,min:`0`,step:`0.01`,className:y.input,placeholder:`MRP / Selling Price`,value:C.sellingPrice??0,onChange:e=>J(`sellingPrice`,parseFloat(e.target.value)||0)}),(0,b.jsx)(`label`,{className:y.label,style:{width:`80px`},children:`Stock Qty :`}),(0,b.jsx)(`input`,{type:`number`,min:`0`,className:y.input,placeholder:`Units`,value:C.stockQty??0,onChange:e=>J(`stockQty`,parseInt(e.target.value,10)||0)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,children:`Status :`}),(0,b.jsxs)(`div`,{className:y.radioGroup,children:[(0,b.jsxs)(`label`,{className:y.radioItem,children:[(0,b.jsx)(`input`,{type:`radio`,name:`status`,checked:C.status===`active`,onChange:()=>J(`status`,`active`)}),` `,`Active`]}),(0,b.jsxs)(`label`,{className:y.radioItem,children:[(0,b.jsx)(`input`,{type:`radio`,name:`status`,checked:C.status===`inactive`,onChange:()=>J(`status`,`inactive`)}),` `,`Inactive`]})]})]})]}),(0,b.jsxs)(`div`,{className:y.rightSection,children:[(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,style:{width:`120px`},children:`Medicine Group :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`e.g. Antibiotics, Analgesics`,value:C.medicineGroup||``,onChange:e=>J(`medicineGroup`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,style:{width:`120px`},children:`Generic Name :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Chemical / Active Ingredient`,value:C.genericName,onChange:e=>J(`genericName`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,style:{width:`120px`},children:`Manufacturer :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Pharma Company`,value:C.manufacturer||``,onChange:e=>J(`manufacturer`,e.target.value)})]}),(0,b.jsxs)(`div`,{className:y.formRow,children:[(0,b.jsx)(`label`,{className:y.label,style:{width:`120px`},children:`Batch / Expiry :`}),(0,b.jsx)(`input`,{type:`text`,className:y.input,placeholder:`Batch No`,style:{maxWidth:`120px`},value:C.batchNo||``,onChange:e=>J(`batchNo`,e.target.value)}),(0,b.jsx)(`input`,{type:`date`,className:y.input,value:C.expiryDate||``,onChange:e=>J(`expiryDate`,e.target.value)})]}),(0,b.jsx)(`textarea`,{className:y.largeDisplayBox,readOnly:!0,value:ce,title:`Formulary Overview`})]})]}),(0,b.jsxs)(`div`,{className:y.actionBar,children:[(0,b.jsxs)(`div`,{className:y.navControls,children:[(0,b.jsx)(`button`,{type:`button`,className:y.navBtn,title:`First Record`,disabled:_===0||T,onClick:()=>q(0),children:(0,b.jsx)(n,{size:20})}),(0,b.jsx)(`button`,{type:`button`,className:y.navBtn,title:`Previous Record`,disabled:_===0||T,onClick:()=>q(_-1),children:(0,b.jsx)(t,{size:20})}),(0,b.jsx)(`button`,{type:`button`,className:y.navBtn,title:`Next Record`,disabled:_>=c.length-1||T,onClick:()=>q(_+1),children:(0,b.jsx)(s,{size:20})}),(0,b.jsx)(`button`,{type:`button`,className:y.navBtn,title:`Last Record`,disabled:_>=c.length-1||T,onClick:()=>q(c.length-1),children:(0,b.jsx)(ee,{size:20})})]}),(0,b.jsxs)(`div`,{className:y.rightActions,children:[(0,b.jsxs)(`button`,{type:`button`,className:y.secondaryBtn,onClick:()=>A(!0),children:[(0,b.jsx)(o,{size:18}),` Particular Search`]}),(0,b.jsxs)(`button`,{type:`button`,className:y.secondaryBtn,onClick:()=>v(C),children:[(0,b.jsx)(i,{size:18}),` Print`]}),(0,b.jsxs)(`button`,{type:`button`,className:y.primaryBtn,disabled:O,onClick:X,children:[(0,b.jsx)(a,{size:18}),` `,T?`Save Medicine`:`Add New`]}),!T&&(0,b.jsxs)(`button`,{type:`button`,className:y.secondaryBtn,disabled:O,onClick:Z,children:[(0,b.jsx)(ne,{size:18}),` Update`]}),!T&&(0,b.jsxs)(`button`,{type:`button`,className:y.dangerBtn,disabled:O,onClick:()=>R(!0),children:[(0,b.jsx)(ie,{size:18}),` Delete / Deactivate`]}),(0,b.jsxs)(`button`,{type:`button`,className:y.secondaryBtn,style:{marginLeft:`16px`},onClick:()=>e(`/`),children:[(0,b.jsx)(u,{size:18}),` Exit`]})]})]}),se&&(0,b.jsx)(`div`,{className:y.modalOverlay,onClick:()=>A(!1),children:(0,b.jsxs)(`div`,{className:y.modalContent,onClick:e=>e.stopPropagation(),children:[(0,b.jsxs)(`div`,{className:y.modalHeader,children:[(0,b.jsxs)(`h3`,{className:y.modalTitle,children:[(0,b.jsx)(o,{size:18,color:`var(--primary)`}),` Particular Search — Medicine Formulary`]}),(0,b.jsx)(`button`,{type:`button`,className:y.modalCloseBtn,onClick:()=>A(!1),children:(0,b.jsx)(d,{size:18})})]}),(0,b.jsxs)(`div`,{className:y.modalBody,children:[(0,b.jsxs)(`div`,{className:y.searchToolbar,children:[(0,b.jsxs)(`div`,{className:y.searchBox,children:[(0,b.jsx)(o,{size:16,color:`var(--text-muted)`}),(0,b.jsx)(`input`,{type:`text`,placeholder:`Instant search by Brand Name, Generic Name, Medicine Code, or Group...`,value:j,onChange:e=>M(e.target.value),autoFocus:!0}),j&&(0,b.jsx)(`button`,{type:`button`,onClick:()=>M(``),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-muted)`},children:(0,b.jsx)(d,{size:14})})]}),(0,b.jsxs)(`div`,{className:y.filterRow,children:[(0,b.jsxs)(`select`,{className:y.filterSelect,value:N,onChange:e=>P(e.target.value),children:[(0,b.jsx)(`option`,{value:`All`,children:`All Groups`}),le.map(e=>(0,b.jsx)(`option`,{value:e,children:e},e))]}),(0,b.jsxs)(`select`,{className:y.filterSelect,value:F,onChange:e=>I(e.target.value),children:[(0,b.jsx)(`option`,{value:`All`,children:`All Statuses`}),(0,b.jsx)(`option`,{value:`active`,children:`Active Only`}),(0,b.jsx)(`option`,{value:`inactive`,children:`Inactive Only`})]}),(0,b.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`,marginLeft:`auto`},children:[`Showing `,$.length,` of `,c.length,` medicines`]})]})]}),(0,b.jsx)(`div`,{className:y.tableWrapper,children:(0,b.jsxs)(`table`,{className:y.modalTable,children:[(0,b.jsx)(`thead`,{children:(0,b.jsxs)(`tr`,{children:[(0,b.jsx)(`th`,{children:`Code`}),(0,b.jsx)(`th`,{children:`Brand Name`}),(0,b.jsx)(`th`,{children:`Generic Name`}),(0,b.jsx)(`th`,{children:`Group`}),(0,b.jsx)(`th`,{children:`Dosage`}),(0,b.jsx)(`th`,{children:`MRP`}),(0,b.jsx)(`th`,{children:`Stock`}),(0,b.jsx)(`th`,{children:`Status`})]})}),(0,b.jsx)(`tbody`,{children:$.length===0?(0,b.jsx)(`tr`,{children:(0,b.jsx)(`td`,{colSpan:8,className:y.emptyState,children:`No medicines found matching the search criteria.`})}):$.map(e=>(0,b.jsxs)(`tr`,{className:`${y.tableRow} ${e.id===C.id?y.tableRowSelected:``}`,onClick:()=>{let t=c.findIndex(t=>t.id===e.id);t!==-1&&q(t),A(!1)},children:[(0,b.jsx)(`td`,{style:{fontWeight:600,color:`var(--primary)`},children:e.id}),(0,b.jsx)(`td`,{children:(0,b.jsx)(`strong`,{children:e.brandName})}),(0,b.jsx)(`td`,{children:e.genericName}),(0,b.jsx)(`td`,{children:e.medicineGroup||`-`}),(0,b.jsxs)(`td`,{children:[e.dosageForm,` `,e.strength]}),(0,b.jsxs)(`td`,{children:[`₹ `,e.sellingPrice||0]}),(0,b.jsx)(`td`,{children:e.stockQty||0}),(0,b.jsx)(`td`,{children:e.status===`active`?(0,b.jsx)(`span`,{className:y.badgeActive,children:`Active`}):(0,b.jsx)(`span`,{className:y.badgeInactive,children:`Inactive`})})]},e.id))})]})})]}),(0,b.jsx)(`div`,{className:y.modalFooter,children:(0,b.jsx)(`button`,{type:`button`,className:y.secondaryBtn,onClick:()=>A(!1),children:`Close`})})]})}),L&&(0,b.jsx)(`div`,{className:y.modalOverlay,onClick:()=>R(!1),children:(0,b.jsxs)(`div`,{className:y.modalContent,style:{maxWidth:`500px`},onClick:e=>e.stopPropagation(),children:[(0,b.jsxs)(`div`,{className:y.modalHeader,children:[(0,b.jsxs)(`h3`,{className:y.modalTitle,style:{color:`var(--danger)`},children:[(0,b.jsx)(re,{size:20}),` Delete or Deactivate Medicine`]}),(0,b.jsx)(`button`,{type:`button`,className:y.modalCloseBtn,onClick:()=>R(!1),children:(0,b.jsx)(d,{size:18})})]}),(0,b.jsxs)(`div`,{className:y.modalBody,children:[(0,b.jsxs)(`p`,{style:{margin:0,fontSize:`14px`,lineHeight:1.5},children:[`You are about to remove `,(0,b.jsxs)(`strong`,{children:[C.brandName,` (`,C.id,`)`]}),`.`]}),(0,b.jsxs)(`div`,{style:{backgroundColor:`var(--warning-soft)`,padding:`12px`,borderRadius:`6px`,fontSize:`13px`,color:`var(--text-main)`},children:[(0,b.jsx)(`strong`,{children:`Pharmacy & Clinical Safeguard:`}),` Deactivation preserves past prescription records, patient charts, and pharmacy audit trails while disabling this drug from new prescriptions.`]})]}),(0,b.jsxs)(`div`,{className:y.modalFooter,children:[(0,b.jsx)(`button`,{type:`button`,className:y.secondaryBtn,onClick:()=>R(!1),children:`Cancel`}),(0,b.jsx)(`button`,{type:`button`,className:y.secondaryBtn,style:{borderColor:`var(--danger)`,color:`var(--danger)`},onClick:()=>Q(!1),children:`Deactivate (Safe)`}),(0,b.jsx)(`button`,{type:`button`,className:y.dangerBtn,onClick:()=>Q(!0),children:`Delete Permanently`})]})]})}),z&&(0,b.jsx)(`div`,{className:y.modalOverlay,onClick:()=>B(!1),children:(0,b.jsxs)(`div`,{className:y.modalContent,style:{maxWidth:`600px`},onClick:e=>e.stopPropagation(),children:[(0,b.jsxs)(`div`,{className:y.modalHeader,children:[(0,b.jsxs)(`h3`,{className:y.modalTitle,children:[(0,b.jsx)(i,{size:18}),` Medicine Formulary Record — `,p.name]}),(0,b.jsx)(`button`,{type:`button`,className:y.modalCloseBtn,onClick:()=>B(!1),children:(0,b.jsx)(d,{size:18})})]}),(0,b.jsx)(`div`,{className:y.modalBody,children:(0,b.jsxs)(`div`,{style:{border:`2px solid var(--border)`,padding:`20px`,borderRadius:`8px`,background:`var(--surface)`},children:[(0,b.jsxs)(`div`,{style:{textAlign:`center`,borderBottom:`1px solid var(--border)`,paddingBottom:`10px`,marginBottom:`14px`},children:[(0,b.jsxs)(`h3`,{style:{margin:0,color:`var(--primary)`,fontSize:`18px`},children:[p.name,` — PHARMACY FORMULARY`]}),(0,b.jsx)(`p`,{style:{margin:`2px 0 0 0`,color:`var(--text-muted)`,fontSize:`12px`},children:p.address})]}),(0,b.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`10px`,fontSize:`13px`},children:[(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Drug Code:`}),` `,C.id]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Dosage Form:`}),` `,C.dosageForm]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Brand Name:`}),` `,C.brandName]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Strength:`}),` `,C.strength||`-`]}),(0,b.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,b.jsx)(`strong`,{children:`Generic Name:`}),` `,C.genericName]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Therapeutic Group:`}),` `,C.medicineGroup||`-`]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Standard Frequency:`}),` `,C.frequency]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Selling Price (MRP):`}),` ₹ `,C.sellingPrice||0]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Stock Balance:`}),` `,C.stockQty,` `,C.unit]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Manufacturer:`}),` `,C.manufacturer||`-`]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`strong`,{children:`Batch / Expiry:`}),` `,C.batchNo||`-`,` / `,C.expiryDate||`N/A`]}),(0,b.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,b.jsx)(`strong`,{children:`Instructions:`}),` `,C.remark1||`-`]})]})]})}),(0,b.jsxs)(`div`,{className:y.modalFooter,children:[(0,b.jsx)(`button`,{type:`button`,className:y.secondaryBtn,onClick:()=>B(!1),children:`Close`}),(0,b.jsxs)(`button`,{type:`button`,className:y.primaryBtn,onClick:()=>window.print(),children:[(0,b.jsx)(i,{size:16}),` Print Record`]})]})]})})]})};export{S as default};