import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{t}from"./chevron-left-pfH1G-ej.js";import{n,t as ee}from"./chevrons-right-m5U0MOu0.js";import{i as te,n as r}from"./masterApi-DrERYV4V.js";import{n as ne,t as i}from"./useAutoDismissNotification-DQtooB-U.js";import{t as a}from"./pen-CQMiP4W3.js";import{t as o}from"./printer-mld-8E2y.js";import{t as re}from"./save-CsQVGAud.js";import{t as s}from"./search-qyb5mcJL.js";import{t as c}from"./shield-alert-CyJMFnbQ.js";import{t as l}from"./trash-BP-_k0XO.js";import{D as u,f as d,i as f,k as p,n as m,t as h,y as ie}from"./index-LyIh4O24.js";import{n as g}from"./useFormKeyboardNavigation-DWOKT9vJ.js";var _=e(p(),1);function v(e){let t=new Date().toLocaleDateString(`en-GB`,{day:`2-digit`,month:`short`,year:`numeric`});return`<!DOCTYPE html>
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
        <div class="hosp-name">${m.name}</div>
        <div class="hosp-tag">Hospital Formulary & Pharmacy Master • ${m.address}</div>
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
</html>`}function y(e){let t=window.open(`about:blank`,`_blank`);if(!t){alert(`Please allow popups to open the Medicine Record print preview.`);return}let n=v(e);t.document.open(),t.document.write(n),t.document.close()}var b={pageContainer:`_pageContainer_18cfz_1`,header:`_header_18cfz_14`,pageTitle:`_pageTitle_18cfz_22`,recordCounter:`_recordCounter_18cfz_29`,mainGrid:`_mainGrid_18cfz_40`,formSection:`_formSection_18cfz_49`,rightSection:`_rightSection_18cfz_60`,largeDisplayBox:`_largeDisplayBox_18cfz_66`,formRow:`_formRow_18cfz_80`,label:`_label_18cfz_86`,input:`_input_18cfz_95`,highlightInput:`_highlightInput_18cfz_113`,shortInput:`_shortInput_18cfz_117`,radioGroup:`_radioGroup_18cfz_121`,radioItem:`_radioItem_18cfz_131`,actionBar:`_actionBar_18cfz_141`,navControls:`_navControls_18cfz_152`,navBtn:`_navBtn_18cfz_157`,rightActions:`_rightActions_18cfz_176`,secondaryBtn:`_secondaryBtn_18cfz_182`,primaryBtn:`_primaryBtn_18cfz_203`,dangerBtn:`_dangerBtn_18cfz_223`,topHeader:`_topHeader_18cfz_254`,fieldGroup:`_fieldGroup_18cfz_256`,fieldGroupHorizontal:`_fieldGroupHorizontal_18cfz_256`,inputWithUnit:`_inputWithUnit_18cfz_256`,select:`_select_18cfz_259`,textarea:`_textarea_18cfz_259`,alertSuccess:`_alertSuccess_18cfz_273`,alertError:`_alertError_18cfz_287`,modalOverlay:`_modalOverlay_18cfz_323`,modalContent:`_modalContent_18cfz_335`,modalHeader:`_modalHeader_18cfz_348`,modalTitle:`_modalTitle_18cfz_357`,modalCloseBtn:`_modalCloseBtn_18cfz_367`,modalBody:`_modalBody_18cfz_384`,modalFooter:`_modalFooter_18cfz_392`,searchToolbar:`_searchToolbar_18cfz_403`,searchBox:`_searchBox_18cfz_409`,filterRow:`_filterRow_18cfz_429`,filterSelect:`_filterSelect_18cfz_436`,tableWrapper:`_tableWrapper_18cfz_447`,modalTable:`_modalTable_18cfz_454`,tableRow:`_tableRow_18cfz_476`,tableRowSelected:`_tableRowSelected_18cfz_485`,badgeActive:`_badgeActive_18cfz_489`,badgeInactive:`_badgeInactive_18cfz_499`,emptyState:`_emptyState_18cfz_509`},x=h(),S={id:``,brandName:``,genericName:``,medicineGroup:`General`,dosageForm:`Tablet`,strength:``,frequency:`1-0-1`,availability:`In Stock`,remark1:``,remark2:``,totalDays:5,notes:``,forPatient:`Both`,unit:`Strip`,manufacturer:``,batchNo:``,expiryDate:``,purchasePrice:0,sellingPrice:0,stockQty:100,reorderLevel:20,gst:12,status:`active`},C=()=>{let e=u(),[p,h]=(0,_.useState)([]),[v,C]=(0,_.useState)(0),[w,T]=(0,_.useState)(S),[E,D]=(0,_.useState)(!1),[ae,O]=(0,_.useState)(!0),[k,A]=(0,_.useState)(!1),[oe,j]=(0,_.useState)(!1),[M,N]=(0,_.useState)(``),[P,F]=(0,_.useState)(`All`),[I,L]=(0,_.useState)(`All`),[R,z]=(0,_.useState)(!1),[B,V]=(0,_.useState)(!1),{formRef:H,handleKeyDown:U}=g(),{notification:W,setNotification:G,dismissNotification:K}=i(),q=(0,_.useCallback)(async()=>{O(!0);try{let e=(await r.getMedicines()).medicines||[];h(e),e.length>0?(C(0),T(e[0]),D(!1)):(T(S),D(!0))}catch(e){let t=e instanceof Error?e.message:`Failed to connect to medicine storage.`;G({type:`error`,message:t})}finally{O(!1)}},[G]);(0,_.useEffect)(()=>{q()},[q]);let J=e=>{e>=0&&e<p.length&&(C(e),T(p[e]),D(!1),K())},Y=(e,t)=>{T(n=>({...n,[e]:t}))},X=()=>!w.brandName||w.brandName.trim().length<2?`Brand Name is required and must be at least 2 characters.`:!w.genericName||w.genericName.trim().length<2?`Generic Name is required.`:w.totalDays!==void 0&&w.totalDays<0?`Total Days cannot be negative.`:w.purchasePrice!==void 0&&w.purchasePrice<0?`Purchase Price cannot be negative.`:w.sellingPrice!==void 0&&w.sellingPrice<0?`Selling Price (MRP) cannot be negative.`:w.stockQty!==void 0&&w.stockQty<0?`Stock Quantity cannot be negative.`:w.reorderLevel!==void 0&&w.reorderLevel<0?`Reorder Level cannot be negative.`:w.gst!==void 0&&(w.gst<0||w.gst>100)?`GST percentage must be between 0% and 100%.`:null,Z=async()=>{if(!E){D(!0);let e=`MED-${p.length+1001}`;T({...S,id:e}),G({type:`success`,message:`New medicine form initialized. Fill details and click "Save Medicine" to add to formulary.`});return}let e=X();if(e){G({type:`error`,message:e});return}A(!0);try{let e=await r.createMedicine(w);G({type:`success`,message:`Medicine ${e.medicine.brandName} added successfully with ID ${e.medicine.id}.`});let t=[...p,e.medicine];h(t),C(t.length-1),T(e.medicine),D(!1)}catch(e){let t=e instanceof Error?e.message:`Failed to add medicine.`;G({type:`error`,message:t})}finally{A(!1)}},se=async()=>{if(E){Z();return}let e=X();if(e){G({type:`error`,message:e});return}A(!0);try{let e=await r.updateMedicine(w.id,w);G({type:`success`,message:`Medicine ${e.medicine.brandName} (${e.medicine.id}) updated successfully.`});let t=[...p];t[v]=e.medicine,h(t),T(e.medicine)}catch(e){let t=e instanceof Error?e.message:`Failed to update medicine.`;G({type:`error`,message:t})}finally{A(!1)}},Q=async e=>{if(w.id){A(!0);try{let t=await r.deleteMedicine(w.id,e);if(G({type:`success`,message:t.message}),z(!1),t.action===`deleted`){let e=p.filter(e=>e.id!==w.id);if(h(e),e.length>0){let t=Math.min(v,e.length-1);C(t),T(e[t])}else T(S),D(!0)}else{let e=[...p];e[v]={...e[v],status:`inactive`},h(e),T(e=>({...e,status:`inactive`}))}}catch(e){let t=e instanceof Error?e.message:`Operation failed.`;G({type:`error`,message:t})}finally{A(!1)}}},ce=(0,_.useMemo)(()=>[`MEDICINE ID: ${w.id||`Pending`}`,`BRAND: ${w.brandName||`--`}`,`GENERIC: ${w.genericName||`--`}`,`GROUP: ${w.medicineGroup||`General`}`,`DOSAGE FORM: ${w.dosageForm||`Tablet`} | STRENGTH: ${w.strength||`--`}`,`FREQUENCY: ${w.frequency||`1-0-1`} | DURATION: ${w.totalDays||0} days`,`AVAILABILITY: ${w.availability||`In Stock`} | APPLICABLE FOR: ${w.forPatient||`Both`}`,`PRICE: MRP ₹ ${w.sellingPrice||0} (Purchase: ₹ ${w.purchasePrice||0})`,`CURRENT STOCK: ${w.stockQty||0} ${w.unit||`Units`} (Reorder Level: ${w.reorderLevel||0})`,w.batchNo?`BATCH: ${w.batchNo} | EXPIRY: ${w.expiryDate||`N/A`}`:``,w.remark1?`REMARK 1: ${w.remark1}`:``,w.remark2?`REMARK 2: ${w.remark2}`:``,w.notes?`NOTES: ${w.notes}`:``,`STATUS: ${(w.status||`active`).toUpperCase()}`].filter(Boolean).join(`
`),[w]),le=(0,_.useMemo)(()=>{let e=new Set;return p.forEach(t=>{t.medicineGroup&&e.add(t.medicineGroup)}),Array.from(e).sort()},[p]),$=(0,_.useMemo)(()=>p.filter(e=>{if(I!==`All`&&e.status!==I||P!==`All`&&e.medicineGroup!==P)return!1;if(M.trim()){let t=M.toLowerCase().trim();if(!(e.brandName.toLowerCase().includes(t)||e.genericName.toLowerCase().includes(t)||e.id.toLowerCase().includes(t)||e.medicineGroup&&e.medicineGroup.toLowerCase().includes(t)||e.dosageForm&&e.dosageForm.toLowerCase().includes(t)||e.batchNo&&e.batchNo.toLowerCase().includes(t)))return!1}return!0}),[p,M,P,I]);return(0,x.jsxs)(`div`,{className:b.pageContainer,children:[(0,x.jsxs)(`div`,{className:b.header,children:[(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`16px`},children:[(0,x.jsx)(`span`,{className:b.recordCounter,children:E?`New Medicine (Total: ${p.length})`:`${p.length>0?v+1:0} of ${p.length}`}),(0,x.jsxs)(`span`,{style:{fontSize:`13px`,fontWeight:600,color:`var(--primary)`,background:`var(--primary-soft, #e8f0fe)`,padding:`6px 12px`,borderRadius:`6px`},children:[`ID: `,E?`${w.id||`Pending`}`:w.id||`--`]}),(0,x.jsx)(`h1`,{className:b.pageTitle,children:`Medicine Master`})]}),w.status===`inactive`&&!E&&(0,x.jsx)(`span`,{className:b.badgeInactive,children:`Record Deactivated / Inactive`})]}),W&&(0,x.jsxs)(`div`,{className:W.type===`success`?b.alertSuccess:b.alertError,role:`alert`,children:[(0,x.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:[W.type===`success`?(0,x.jsx)(ne,{size:18}):(0,x.jsx)(te,{size:18}),(0,x.jsx)(`span`,{children:W.message})]}),(0,x.jsx)(`button`,{type:`button`,onClick:K,style:{background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},"aria-label":`Dismiss notification`,children:(0,x.jsx)(f,{size:16})})]}),(0,x.jsxs)(`form`,{ref:H,onKeyDown:U,onSubmit:e=>{e.preventDefault(),handleSave()},className:b.mainGrid,children:[(0,x.jsxs)(`div`,{className:b.formSection,children:[(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,children:`Brand Name :`}),(0,x.jsx)(`input`,{type:`text`,className:`${b.input} ${b.highlightInput}`,placeholder:`e.g. Paracetamol 650 (Dolo), Augmentin 625 Duo`,value:w.brandName,onChange:e=>Y(`brandName`,e.target.value)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,children:`Dosage Form :`}),(0,x.jsxs)(`select`,{className:b.input,value:w.dosageForm||`Tablet`,onChange:e=>Y(`dosageForm`,e.target.value),children:[(0,x.jsx)(`option`,{value:`Tablet`,children:`Tablet`}),(0,x.jsx)(`option`,{value:`Capsule`,children:`Capsule`}),(0,x.jsx)(`option`,{value:`Syrup`,children:`Syrup`}),(0,x.jsx)(`option`,{value:`Injection`,children:`Injection`}),(0,x.jsx)(`option`,{value:`Ointment`,children:`Ointment / Gel`}),(0,x.jsx)(`option`,{value:`Drops`,children:`Eye/Ear Drops`}),(0,x.jsx)(`option`,{value:`Surgical Suture`,children:`Surgical Suture / Consumable`}),(0,x.jsx)(`option`,{value:`IV Fluid`,children:`IV Infusion / Fluid`}),(0,x.jsx)(`option`,{value:`Inhaler`,children:`Inhaler / Respules`})]}),(0,x.jsx)(`label`,{className:b.label,style:{width:`80px`},children:`Strength :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,placeholder:`e.g. 650 mg`,value:w.strength||``,onChange:e=>Y(`strength`,e.target.value)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,children:`Frequency :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,placeholder:`e.g. 1-0-1, TDS, SOS`,value:w.frequency||``,onChange:e=>Y(`frequency`,e.target.value)}),(0,x.jsx)(`label`,{className:b.label,style:{width:`90px`},children:`Availability :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,style:{maxWidth:`120px`},value:w.availability||`In Stock`,onChange:e=>Y(`availability`,e.target.value)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,children:`Remark 1 :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,placeholder:`e.g. Take after food`,value:w.remark1||``,onChange:e=>Y(`remark1`,e.target.value)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,children:`Remark 2 :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,placeholder:`e.g. Complete full course`,value:w.remark2||``,onChange:e=>Y(`remark2`,e.target.value)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,children:`Total Days :`}),(0,x.jsx)(`input`,{type:`number`,min:`0`,className:`${b.input} ${b.shortInput}`,value:w.totalDays??0,onChange:e=>Y(`totalDays`,parseInt(e.target.value,10)||0)}),(0,x.jsx)(`label`,{className:b.label,style:{width:`80px`},children:`For :`}),(0,x.jsxs)(`select`,{className:`${b.input} ${b.shortInput}`,value:w.forPatient||`Both`,onChange:e=>Y(`forPatient`,e.target.value),children:[(0,x.jsx)(`option`,{value:`Both`,children:`Both (OPD & IPD)`}),(0,x.jsx)(`option`,{value:`OPD`,children:`OPD Only`}),(0,x.jsx)(`option`,{value:`IPD`,children:`IPD Only`}),(0,x.jsx)(`option`,{value:`Male`,children:`Male`}),(0,x.jsx)(`option`,{value:`Female`,children:`Female`})]})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,children:`Notes :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,placeholder:`Clinical precautions or contraindications`,value:w.notes||``,onChange:e=>Y(`notes`,e.target.value)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,children:`Pricing (₹) :`}),(0,x.jsx)(`input`,{type:`number`,min:`0`,step:`0.01`,className:b.input,placeholder:`MRP / Selling Price`,value:w.sellingPrice??0,onChange:e=>Y(`sellingPrice`,parseFloat(e.target.value)||0)}),(0,x.jsx)(`label`,{className:b.label,style:{width:`80px`},children:`Stock Qty :`}),(0,x.jsx)(`input`,{type:`number`,min:`0`,className:b.input,placeholder:`Units`,value:w.stockQty??0,onChange:e=>Y(`stockQty`,parseInt(e.target.value,10)||0)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,children:`Status :`}),(0,x.jsxs)(`div`,{className:b.radioGroup,children:[(0,x.jsxs)(`label`,{className:b.radioItem,children:[(0,x.jsx)(`input`,{type:`radio`,name:`status`,checked:w.status===`active`,onChange:()=>Y(`status`,`active`)}),` `,`Active`]}),(0,x.jsxs)(`label`,{className:b.radioItem,children:[(0,x.jsx)(`input`,{type:`radio`,name:`status`,checked:w.status===`inactive`,onChange:()=>Y(`status`,`inactive`)}),` `,`Inactive`]})]})]})]}),(0,x.jsxs)(`div`,{className:b.rightSection,children:[(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,style:{width:`120px`},children:`Medicine Group :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,placeholder:`e.g. Antibiotics, Analgesics`,value:w.medicineGroup||``,onChange:e=>Y(`medicineGroup`,e.target.value)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,style:{width:`120px`},children:`Generic Name :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,placeholder:`Chemical / Active Ingredient`,value:w.genericName,onChange:e=>Y(`genericName`,e.target.value)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,style:{width:`120px`},children:`Manufacturer :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,placeholder:`Pharma Company`,value:w.manufacturer||``,onChange:e=>Y(`manufacturer`,e.target.value)})]}),(0,x.jsxs)(`div`,{className:b.formRow,children:[(0,x.jsx)(`label`,{className:b.label,style:{width:`120px`},children:`Batch / Expiry :`}),(0,x.jsx)(`input`,{type:`text`,className:b.input,placeholder:`Batch No`,style:{maxWidth:`120px`},value:w.batchNo||``,onChange:e=>Y(`batchNo`,e.target.value)}),(0,x.jsx)(`input`,{type:`date`,className:b.input,value:w.expiryDate||``,onChange:e=>Y(`expiryDate`,e.target.value)})]}),(0,x.jsx)(`textarea`,{className:b.largeDisplayBox,readOnly:!0,value:ce,title:`Formulary Overview`})]})]}),(0,x.jsxs)(`div`,{className:b.actionBar,children:[(0,x.jsxs)(`div`,{className:b.navControls,children:[(0,x.jsx)(`button`,{type:`button`,className:b.navBtn,title:`First Record`,disabled:v===0||E,onClick:()=>J(0),children:(0,x.jsx)(n,{size:20})}),(0,x.jsx)(`button`,{type:`button`,className:b.navBtn,title:`Previous Record`,disabled:v===0||E,onClick:()=>J(v-1),children:(0,x.jsx)(t,{size:20})}),(0,x.jsx)(`button`,{type:`button`,className:b.navBtn,title:`Next Record`,disabled:v>=p.length-1||E,onClick:()=>J(v+1),children:(0,x.jsx)(ie,{size:20})}),(0,x.jsx)(`button`,{type:`button`,className:b.navBtn,title:`Last Record`,disabled:v>=p.length-1||E,onClick:()=>J(p.length-1),children:(0,x.jsx)(ee,{size:20})})]}),(0,x.jsxs)(`div`,{className:b.rightActions,children:[(0,x.jsxs)(`button`,{type:`button`,className:b.secondaryBtn,onClick:()=>j(!0),children:[(0,x.jsx)(s,{size:18}),` Particular Search`]}),(0,x.jsxs)(`button`,{type:`button`,className:b.secondaryBtn,onClick:()=>y(w),children:[(0,x.jsx)(o,{size:18}),` Print`]}),(0,x.jsxs)(`button`,{type:`button`,className:b.primaryBtn,disabled:k,onClick:Z,children:[(0,x.jsx)(re,{size:18}),` `,E?`Save Medicine`:`Add New`]}),!E&&(0,x.jsxs)(`button`,{type:`button`,className:b.secondaryBtn,disabled:k,onClick:se,children:[(0,x.jsx)(a,{size:18}),` Update`]}),!E&&(0,x.jsxs)(`button`,{type:`button`,className:b.dangerBtn,disabled:k,onClick:()=>z(!0),children:[(0,x.jsx)(l,{size:18}),` Delete / Deactivate`]}),(0,x.jsxs)(`button`,{type:`button`,className:b.secondaryBtn,style:{marginLeft:`16px`},onClick:()=>e(`/`),children:[(0,x.jsx)(d,{size:18}),` Exit`]})]})]}),oe&&(0,x.jsx)(`div`,{className:b.modalOverlay,onClick:()=>j(!1),children:(0,x.jsxs)(`div`,{className:b.modalContent,onClick:e=>e.stopPropagation(),children:[(0,x.jsxs)(`div`,{className:b.modalHeader,children:[(0,x.jsxs)(`h3`,{className:b.modalTitle,children:[(0,x.jsx)(s,{size:18,color:`var(--primary)`}),` Particular Search — Medicine Formulary`]}),(0,x.jsx)(`button`,{type:`button`,className:b.modalCloseBtn,onClick:()=>j(!1),children:(0,x.jsx)(f,{size:18})})]}),(0,x.jsxs)(`div`,{className:b.modalBody,children:[(0,x.jsxs)(`div`,{className:b.searchToolbar,children:[(0,x.jsxs)(`div`,{className:b.searchBox,children:[(0,x.jsx)(s,{size:16,color:`var(--text-muted)`}),(0,x.jsx)(`input`,{type:`text`,placeholder:`Instant search by Brand Name, Generic Name, Medicine Code, or Group...`,value:M,onChange:e=>N(e.target.value),autoFocus:!0}),M&&(0,x.jsx)(`button`,{type:`button`,onClick:()=>N(``),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-muted)`},children:(0,x.jsx)(f,{size:14})})]}),(0,x.jsxs)(`div`,{className:b.filterRow,children:[(0,x.jsxs)(`select`,{className:b.filterSelect,value:P,onChange:e=>F(e.target.value),children:[(0,x.jsx)(`option`,{value:`All`,children:`All Groups`}),le.map(e=>(0,x.jsx)(`option`,{value:e,children:e},e))]}),(0,x.jsxs)(`select`,{className:b.filterSelect,value:I,onChange:e=>L(e.target.value),children:[(0,x.jsx)(`option`,{value:`All`,children:`All Statuses`}),(0,x.jsx)(`option`,{value:`active`,children:`Active Only`}),(0,x.jsx)(`option`,{value:`inactive`,children:`Inactive Only`})]}),(0,x.jsxs)(`span`,{style:{fontSize:`12px`,color:`var(--text-muted)`,marginLeft:`auto`},children:[`Showing `,$.length,` of `,p.length,` medicines`]})]})]}),(0,x.jsx)(`div`,{className:b.tableWrapper,children:(0,x.jsxs)(`table`,{className:b.modalTable,children:[(0,x.jsx)(`thead`,{children:(0,x.jsxs)(`tr`,{children:[(0,x.jsx)(`th`,{children:`Code`}),(0,x.jsx)(`th`,{children:`Brand Name`}),(0,x.jsx)(`th`,{children:`Generic Name`}),(0,x.jsx)(`th`,{children:`Group`}),(0,x.jsx)(`th`,{children:`Dosage`}),(0,x.jsx)(`th`,{children:`MRP`}),(0,x.jsx)(`th`,{children:`Stock`}),(0,x.jsx)(`th`,{children:`Status`})]})}),(0,x.jsx)(`tbody`,{children:$.length===0?(0,x.jsx)(`tr`,{children:(0,x.jsx)(`td`,{colSpan:8,className:b.emptyState,children:`No medicines found matching the search criteria.`})}):$.map(e=>(0,x.jsxs)(`tr`,{className:`${b.tableRow} ${e.id===w.id?b.tableRowSelected:``}`,onClick:()=>{let t=p.findIndex(t=>t.id===e.id);t!==-1&&J(t),j(!1)},children:[(0,x.jsx)(`td`,{style:{fontWeight:600,color:`var(--primary)`},children:e.id}),(0,x.jsx)(`td`,{children:(0,x.jsx)(`strong`,{children:e.brandName})}),(0,x.jsx)(`td`,{children:e.genericName}),(0,x.jsx)(`td`,{children:e.medicineGroup||`-`}),(0,x.jsxs)(`td`,{children:[e.dosageForm,` `,e.strength]}),(0,x.jsxs)(`td`,{children:[`₹ `,e.sellingPrice||0]}),(0,x.jsx)(`td`,{children:e.stockQty||0}),(0,x.jsx)(`td`,{children:e.status===`active`?(0,x.jsx)(`span`,{className:b.badgeActive,children:`Active`}):(0,x.jsx)(`span`,{className:b.badgeInactive,children:`Inactive`})})]},e.id))})]})})]}),(0,x.jsx)(`div`,{className:b.modalFooter,children:(0,x.jsx)(`button`,{type:`button`,className:b.secondaryBtn,onClick:()=>j(!1),children:`Close`})})]})}),R&&(0,x.jsx)(`div`,{className:b.modalOverlay,onClick:()=>z(!1),children:(0,x.jsxs)(`div`,{className:b.modalContent,style:{maxWidth:`500px`},onClick:e=>e.stopPropagation(),children:[(0,x.jsxs)(`div`,{className:b.modalHeader,children:[(0,x.jsxs)(`h3`,{className:b.modalTitle,style:{color:`var(--danger)`},children:[(0,x.jsx)(c,{size:20}),` Delete or Deactivate Medicine`]}),(0,x.jsx)(`button`,{type:`button`,className:b.modalCloseBtn,onClick:()=>z(!1),children:(0,x.jsx)(f,{size:18})})]}),(0,x.jsxs)(`div`,{className:b.modalBody,children:[(0,x.jsxs)(`p`,{style:{margin:0,fontSize:`14px`,lineHeight:1.5},children:[`You are about to remove `,(0,x.jsxs)(`strong`,{children:[w.brandName,` (`,w.id,`)`]}),`.`]}),(0,x.jsxs)(`div`,{style:{backgroundColor:`var(--warning-soft)`,padding:`12px`,borderRadius:`6px`,fontSize:`13px`,color:`var(--text-main)`},children:[(0,x.jsx)(`strong`,{children:`Pharmacy & Clinical Safeguard:`}),` Deactivation preserves past prescription records, patient charts, and pharmacy audit trails while disabling this drug from new prescriptions.`]})]}),(0,x.jsxs)(`div`,{className:b.modalFooter,children:[(0,x.jsx)(`button`,{type:`button`,className:b.secondaryBtn,onClick:()=>z(!1),children:`Cancel`}),(0,x.jsx)(`button`,{type:`button`,className:b.secondaryBtn,style:{borderColor:`var(--danger)`,color:`var(--danger)`},onClick:()=>Q(!1),children:`Deactivate (Safe)`}),(0,x.jsx)(`button`,{type:`button`,className:b.dangerBtn,onClick:()=>Q(!0),children:`Delete Permanently`})]})]})}),B&&(0,x.jsx)(`div`,{className:b.modalOverlay,onClick:()=>V(!1),children:(0,x.jsxs)(`div`,{className:b.modalContent,style:{maxWidth:`600px`},onClick:e=>e.stopPropagation(),children:[(0,x.jsxs)(`div`,{className:b.modalHeader,children:[(0,x.jsxs)(`h3`,{className:b.modalTitle,children:[(0,x.jsx)(o,{size:18}),` Medicine Formulary Record — `,m.name]}),(0,x.jsx)(`button`,{type:`button`,className:b.modalCloseBtn,onClick:()=>V(!1),children:(0,x.jsx)(f,{size:18})})]}),(0,x.jsx)(`div`,{className:b.modalBody,children:(0,x.jsxs)(`div`,{style:{border:`2px solid var(--border)`,padding:`20px`,borderRadius:`8px`,background:`var(--surface)`},children:[(0,x.jsxs)(`div`,{style:{textAlign:`center`,borderBottom:`1px solid var(--border)`,paddingBottom:`10px`,marginBottom:`14px`},children:[(0,x.jsxs)(`h3`,{style:{margin:0,color:`var(--primary)`,fontSize:`18px`},children:[m.name,` — PHARMACY FORMULARY`]}),(0,x.jsx)(`p`,{style:{margin:`2px 0 0 0`,color:`var(--text-muted)`,fontSize:`12px`},children:m.address})]}),(0,x.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`10px`,fontSize:`13px`},children:[(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Drug Code:`}),` `,w.id]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Dosage Form:`}),` `,w.dosageForm]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Brand Name:`}),` `,w.brandName]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Strength:`}),` `,w.strength||`-`]}),(0,x.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,x.jsx)(`strong`,{children:`Generic Name:`}),` `,w.genericName]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Therapeutic Group:`}),` `,w.medicineGroup||`-`]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Standard Frequency:`}),` `,w.frequency]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Selling Price (MRP):`}),` ₹ `,w.sellingPrice||0]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Stock Balance:`}),` `,w.stockQty,` `,w.unit]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Manufacturer:`}),` `,w.manufacturer||`-`]}),(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`strong`,{children:`Batch / Expiry:`}),` `,w.batchNo||`-`,` / `,w.expiryDate||`N/A`]}),(0,x.jsxs)(`div`,{style:{gridColumn:`span 2`},children:[(0,x.jsx)(`strong`,{children:`Instructions:`}),` `,w.remark1||`-`]})]})]})}),(0,x.jsxs)(`div`,{className:b.modalFooter,children:[(0,x.jsx)(`button`,{type:`button`,className:b.secondaryBtn,onClick:()=>V(!1),children:`Close`}),(0,x.jsxs)(`button`,{type:`button`,className:b.primaryBtn,onClick:()=>window.print(),children:[(0,x.jsx)(o,{size:16}),` Print Record`]})]})]})})]})};export{C as default};