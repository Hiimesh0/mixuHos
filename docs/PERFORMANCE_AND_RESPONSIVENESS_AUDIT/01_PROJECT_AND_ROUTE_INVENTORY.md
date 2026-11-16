# 01 — Project & Route Inventory

**Hospital Management / EMR System:** Mixu Infosystem  
**Audit Date:** November 16, 2026  
**Auditor:** Senior QA Automation & Performance Engineering Specialist  
**Repository:** `https://github.com/Hiimesh0/mixuHos.git`  
**Live Staging:** `https://Hiimesh0.github.io/mixuHos/`  

---

## 1. Technical Stack Overview

| Layer | Technology | Version | Purpose & Architecture |
|---|---|---|---|
| **Frontend Framework** | React | `19.2.8` | Core UI rendering library |
| **Frontend DOM** | React DOM | `19.2.8` | Virtual DOM & reconciliation |
| **Routing** | React Router DOM | `7.18.4` | Client-side HashRouter routing (`#/route`) |
| **Language & Typing** | TypeScript | `~6.0.2` | Static typing and interfaces |
| **Build & Dev Tool** | Vite | `8.3.0` | Ultra-fast HMR and Rollup/Vite bundling |
| **Linter** | Oxlint | `1.81.0` | High-speed Rust-based linter |
| **Icons** | Lucide React | `1.52.0` | Clean SVG iconography |
| **Document Generation** | jsPDF | `4.2.1` | Client-side A4 PDF and sticker rendering |
| **Canvas Rasterization** | html2canvas | `1.4.1` | HTML to canvas image conversion |
| **Barcode Generation** | JsBarcode | `3.12.3` | Code128 / EAN barcode rendering |
| **Camera Scanner** | @zxing/library | `0.23.0` | WebRTC mobile camera barcode decoder |
| **Backend Framework** | Django / DRF | `4.2.30` | REST API backend server |
| **Backend Language** | Python | `3.14.3` | Server execution runtime |
| **Storage Architecture** | Atomic JSON Storage | JSON v1.0 | Flat-file structured JSON (`backend/data/*.json`) with `threading.RLock` |
| **Client Fallback** | LocalStorage | Browser API | Standalone client persistence fallback for static hosting |
| **Styling Architecture** | CSS Modules + Global Tokens | CSS3 / PostCSS | Standardized CSS variables (`index.css`) + Component CSS modules |

---

## 2. Navigation Architecture

The sidebar navigation (`App.tsx`) is structured hierarchically into two primary sections:
1. **Working Modules (Top)**: Verified fully functional modules with complete CRUD and storage.
2. **Other Modules (Subordinate)**: Organized along natural hospital workflows (Clinical Care, Billing & Finance, IPD/OPD Masters, Diagnostics, Certificates, Utilities).

---

## 3. Comprehensive Route & Component Inventory

| Sr | Page / Module Name | Route URL | Component File | Module Category | Implementation Status | Functional Level |
|---|---|---|---|---|---|---|
| 1 | **Login** | `/login` | `Login/Login.tsx` | Authentication | Implemented | Fully Functional |
| 2 | **Patient Registration** | `/patient-registration` | `PatientRegistration/PatientRegistration.tsx` | Core Patient Flow | Implemented | Fully Functional (CRUD + Print + Barcode) |
| 3 | **Patient History** | `/patient-history` | `PatientRegistrationList/PatientRegistrationList.tsx` | Core Patient Flow | Implemented | Fully Functional (Search + Filter + Load) |
| 4 | **Patient Registration List** | `/patient-registration-list` | `PatientRegistrationList/PatientRegistrationList.tsx` | Core Patient Flow | Implemented | Fully Functional (Alias Route) |
| 5 | **Doctor Master** | `/doctor-master` | `DoctorMaster/DoctorMaster.tsx` | Master Data | Implemented | Fully Functional (CRUD + A4 Print) |
| 6 | **Medicine Master** | `/medicine-master` | `MedicineMaster/MedicineMaster.tsx` | Master Data | Implemented | Fully Functional (CRUD + Stock + Print) |
| 7 | **Report Template** | `/report-template` | `ReportTemplate/ReportTemplate.tsx` | Diagnostic Masters | Implemented | Fully Functional (Bullets + A4 Preview/Print) |
| 8 | **Echo Report** | `/echo-report` | `EchoReport/EchoReport.tsx` | Diagnostics & Imaging | Implemented | Fully Functional (2D/Doppler + PDF/Print) |
| 9 | **Billing (Standalone)** | `/billing` | `Billing/Billing.tsx` | Finance & Accounts | Prototype | Static UI Prototype (No State) |
| 10 | **Bill Preview** | `/bill-preview` | `BillPreview/BillPreview.tsx` | Finance & Accounts | Partially Implemented | Interactive Bill Viewer |
| 11 | **Patient Past Info** | `/patient-past-info` | `PatientPastInfo/PatientPastInfo.tsx` | Clinical Records | Prototype | Interactive Mock (Form State only) |
| 12 | **Dr. Visit & Procedure** | `/dr-visit-procedure` | `DrVisitProcedure/DrVisitProcedure.tsx` | Clinical Inpatient | Prototype | Static UI Prototype |
| 13 | **Investigation Ordered** | `/investigation-ordered` | `InvestigationOrdered/InvestigationOrdered.tsx` | Diagnostics | Prototype | Static UI Prototype |
| 14 | **Indoor Register** | `/indoor-register` | `IndoorRegister/IndoorRegister.tsx` | IPD Operations | Prototype | Static UI Prototype |
| 15 | **Room Status** | `/room-status` | `RoomStatus/RoomStatus.tsx` | Bed & Ward Mgmt | Prototype | Static UI Prototype |
| 16 | **Room Charges** | `/room-charges` | `RoomCharges/RoomCharges.tsx` | Bed & Ward Mgmt | Prototype | Static UI Prototype |
| 17 | **OT Entry** | `/ot-entry` | `OtEntry/OtEntry.tsx` | Surgical Care | Prototype | Static UI Prototype |
| 18 | **Operation Charges** | `/operation-charges` | `OperationCharges/OperationCharges.tsx` | Surgical Care | Prototype | Static UI Prototype |
| 19 | **Indoor Summary** | `/indoor-summary` | `IndoorSummaryChart/IndoorSummaryChart.tsx` | IPD Operations | Prototype | Static UI Prototype |
| 20 | **Indoor Option** | `/indoor-option` | `IndoorOption/IndoorOption.tsx` | IPD Operations | Prototype | Static UI Prototype |
| 21 | **Inpatient Bill** | `/inpatient-bill` | `InpatientBill/InpatientBill.tsx` | IPD Finance | Prototype | Static UI Prototype |
| 22 | **Inpatient Receipt** | `/inpatient-receipt` | `InpatientReceipt/InpatientReceipt.tsx` | IPD Finance | Prototype | Static UI Prototype |
| 23 | **Discharge Card** | `/discharge-card` | `DischargeCard/DischargeCard.tsx` | Clinical Inpatient | Prototype | Static UI Prototype |
| 24 | **Deposit Entry** | `/deposit-entry` | `DepositEntry/DepositEntry.tsx` | Cashier Operations | Prototype | Static UI Prototype |
| 25 | **Part Payment** | `/part-payment` | `PartPayment/PartPayment.tsx` | Cashier Operations | Prototype | Static UI Prototype |
| 26 | **Standard Prescription Master** | `/standard-prescription-master` | `StandardPrescriptionMaster/StandardPrescriptionMaster.tsx` | Pharmacy Masters | Prototype | Static UI Prototype |
| 27 | **Clinical Notes (Template)** | `/clinical-notes-template` | `PatientHistory/PatientHistory.tsx` | Clinical Records | Partially Implemented | Interactive Template Form |
| 28 | **Advice Master** | `/advice-master` | `AdviceMaster/AdviceMaster.tsx` | IPD Masters | Prototype | Static UI Prototype |
| 29 | **Bed Master** | `/bed-master` | `BedMaster/BedMaster.tsx` | IPD Masters | Prototype | Static UI Prototype |
| 30 | **Operation Group Master** | `/operation-group-master` | `OperationGroupMaster/OperationGroupMaster.tsx` | IPD Masters | Prototype | Static UI Prototype |
| 31 | **Room Type Master** | `/room-type-master` | `RoomTypeMaster/RoomTypeMaster.tsx` | IPD Masters | Prototype | Static UI Prototype |
| 32 | **Visiting Type Master** | `/visiting-type-master` | `VisitingTypeMaster/VisitingTypeMaster.tsx` | IPD Masters | Prototype | Static UI Prototype |
| 33 | **Visit Procedure Header Master** | `/visit-procedure-header-master` | `VisitProcedureHeaderMaster/VisitProcedureHeaderMaster.tsx` | IPD Masters | Prototype | Interactive Mock (Form State only) |
| 34 | **OPD Patient Category** | `/opd-patient-category` | `OPDPatientCategory/OPDPatientCategory.tsx` | OPD Masters | Prototype | Static UI Prototype |
| 35 | **OPD Charges Master** | `/opd-charges-master` | `OPDChargesMaster/OPDChargesMaster.tsx` | OPD Masters | Prototype | Interactive Mock (Form State only) |
| 36 | **Department Master** | `/department-master` | `DepartmentMaster/DepartmentMaster.tsx` | Hospital Admin | Prototype | Static UI Prototype |
| 37 | **Insurance Company Master** | `/insurance-company-master` | `InsuranceCompanyMaster/InsuranceCompanyMaster.tsx` | TPA / Insurance | Prototype | Interactive Mock (Form State only) |
| 38 | **OPD Charges Profile** | `/opd-charges-profile` | `OPDChargesProfile/OPDChargesProfile.tsx` | OPD Masters | Prototype | Interactive Mock (Form State only) |
| 39 | **Short Form Master** | `/short-form-master` | `ShortFormMaster/ShortFormMaster.tsx` | Diagnostics Masters | Prototype | Static UI Prototype |
| 40 | **Today Report Dashboard** | `/today-report-dashboard` | `TodayReportDashboard/TodayReportDashboard.tsx` | Reporting & Analytics | Prototype | Static UI Prototype |
| 41 | **Death Certificate** | `/death-certificate` | `DeathCertificate/DeathCertificate.tsx` | Medical Legal | Prototype | Static UI Prototype |
| 42 | **Medical Certificate** | `/medical-certificate` | `MedicalCertificate/MedicalCertificate.tsx` | Medical Legal | Prototype | Interactive Mock (Form State only) |
| 43 | **MLC Certificate** | `/mlc-certificate` | `MlcCertificate/MlcCertificate.tsx` | Medical Legal | Prototype | Static UI Prototype |
| 44 | **Certificate Template** | `/certificate-template` | `CertificateTemplate/CertificateTemplate.tsx` | Medical Legal | Prototype | Static UI Prototype |
| 45 | **Contact List** | `/contact-list` | `ContactList/ContactList.tsx` | Hospital Utilities | Prototype | Static UI Prototype |
| 46 | **Intercomm Display** | `/intercomm-display` | `IntercommDisplay/IntercommDisplay.tsx` | Hospital Utilities | Prototype | Static UI Prototype |

---

## 4. Key Architectural Findings from Inventory

1. **Clear Segmentation**: The codebase clearly divides between **6 primary working modules** (Patient Registration, Patient History, Doctor Master, Medicine Master, Report Template, Echo Report) which feature complete back-and-forth persistence, print generators, validation, and API connectivity, versus **39 prototype/mock screens** which define the visual design and layout for future hospital workflows.
2. **Dynamic vs Standalone Billing**: Production billing is executed dynamically inside `PatientRegistration` using `patientBillGenerator.ts` and `BillPreview.tsx`. The standalone `/billing` page in the sidebar remains a static UI mockup.
3. **Dual Persistence Mechanism**: All primary modules seamlessly communicate with Django at `http://127.0.0.1:8000/api` when available, and fall back to browser `localStorage` and bundled JSON when hosted statically on GitHub Pages.

