# 01 — COMPLETE HOSPITAL MANAGEMENT SYSTEM AUDIT
**Mixu Infosystem Hospital Management / EMR Platform**
**Date:** 16-November-2026 | **Auditor:** Senior Full-Stack Software Architect & Healthcare QA Specialist
**Repository:** `https://github.com/Hiimesh0/mixuHos.git` (Branch: `main`)
**Deployment URL:** `https://Hiimesh0.github.io/mixuHos/`

---

## 1. Executive Summary

This audit represents an exhaustive technical assessment of the complete **Mixu Infosystem Hospital Management / EMR** web application. The platform is designed for enterprise hospital operations, encompassing patient registration, dynamic billing, clinical consultations, inpatient admission, bed tracking, surgical operative recording, laboratory investigations, echocardiography reporting, and medical certificate issuance.

The application architecture utilizes:
- **Frontend Stack:** React 19 + TypeScript 5.8 + Vite 8.3 + Vanilla CSS Modules + Lucide Icons + jsPDF.
- **Backend Stack:** Django 5.x REST framework running in Python 3.12 with custom file-locking repositories.
- **Storage Strategy:** Persistent multi-tenant JSON documents equipped with operating-system level locking (`msvcrt` on Windows, `fcntl` on POSIX) and atomic write operations (`tempfile` + `os.replace`), structured for clean future migration to MySQL.

---

## 2. Complete Module & Page Inventory

The platform comprises **32 active routes and components**, organized logically into clinical and administrative departments:

| Module / Route | Component File | Storage Entity | Purpose & Status |
| :--- | :--- | :--- | :--- |
| **`/login`** | `Login.tsx` | Local State / Session | Secure staff authentication with Mixu brand styling. |
| **`/patient-registration`** | `PatientRegistration.tsx` | `patients.json`, `bills.json` | Core patient admission, sticker generation, bill calculation. |
| **`/patient-registration-list`** | `PatientRegistrationList.tsx` | `patients.json`, `bills.json` | Master patient register with sticker & bill reprint actions. |
| **`/patient-history`** | `PatientHistory.tsx` | `patient_visits.json` | Longitudinal clinical consultation & vital signs tracker. |
| **`/patient-past-info`** | `PatientPastInfo.tsx` | Cross-module aggregation | Unified medical history timeline (OPD, IPD, Labs, Echo). |
| **`/billing`** | `Billing.tsx` | `bills.json` | OPD procedure billing, discounts, cash/UPI receipt generation. |
| **`/bill-preview`** | `BillPreview.tsx` | `bills.json` | A4 printable bill cum receipt viewer. |
| **`/inpatient-bill`** | `InpatientBill.tsx` | `bills.json`, `admissions.json` | Final indoor discharge invoice with itemized bed & care charges. |
| **`/inpatient-receipt`** | `InpatientReceipt.tsx` | `deposits.json` | Inpatient advance payment & interim settlement receipting. |
| **`/indoor-register`** | `IndoorRegister.tsx` | `admissions.json`, `beds.json` | IPD admission management with auto-bed occupancy. |
| **`/room-status`** | `RoomStatus.tsx` | `beds.json`, `admissions.json` | Real-time graphical bed occupancy grid across hospital wards. |
| **`/discharge-card`** | `DischargeCard.tsx` | `discharges.json`, `beds.json` | Discharge summary authoring, automatic bed vacancy trigger. |
| **`/deposit-entry`** | `DepositEntry.tsx` | `deposits.json` | Patient deposit entry with thermal & A4 receipt printing. |
| **`/part-payment`** | `PartPayment.tsx` | `deposits.json`, `bills.json` | Split and installment payments on hospital accounts. |
| **`/dr-visit-procedure`** | `DrVisitProcedure.tsx` | `dr_visits_procedures.json`| Inpatient daily doctor rounds and bedside procedure charges. |
| **`/ot-entry`** | `OtEntry.tsx` | `ot_entries.json` | Surgical team logging, pre/post operative notes, OT billing. |
| **`/investigation-ordered`** | `InvestigationOrdered.tsx` | `investigations.json` | Laboratory order entry with specimen collection tracking. |
| **`/today-report-dashboard`** | `TodayReportDashboard.tsx` | `investigations.json` | Daily diagnostic laboratory test status dashboard. |
| **`/echo-report`** | `EchoReport.tsx` | `echo_reports.json` | 2D Echocardiography structured reporting & print. |
| **`/medical-certificate`** | `MedicalCertificate.tsx` | `certificates.json` | Medical illness and fitness leave certificate generator. |
| **`/mlc-certificate`** | `MlcCertificate.tsx` | `certificates.json` | Medico-legal accident & injury certificate with police record. |
| **`/death-certificate`** | `DeathCertificate.tsx` | `certificates.json` | Formal medical death certification with cause breakdown. |
| **`/doctor-master`** | `DoctorMaster.tsx` | `doctors.json` | Consultant doctor credentials, visiting charges, specialties. |
| **`/medicine-master`** | `MedicineMaster.tsx` | `medicines.json` | Pharmaceutical formulary, batch inventory, dosage instructions. |
| **`/bed-master`** | `BedMaster.tsx` | `beds.json`, `room_types.json` | Ward bed creation, categorization, daily tariff definition. |
| **`/room-type-master`** | `RoomTypeMaster.tsx` | `room_types.json` | AC/Non-AC room classifications and occupancy rules. |
| **`/department-master`** | `DepartmentMaster.tsx` | `departments.json` | Clinical and administrative department taxonomy. |
| **`/operation-group-master`**| `OperationGroupMaster.tsx`| `operation_groups.json` | Surgical group master classification. |
| **`/insurance-master`** | `InsuranceCompanyMaster.tsx`| `insurance_companies.json`| TPA & Corporate insurance registry. |
| **`/visiting-type-master`** | `VisitingTypeMaster.tsx` | `visiting_types.json` | OPD vs Emergency visit categories. |
| **`/short-form-master`** | `ShortFormMaster.tsx` | `short_forms.json` | Clinical medical abbreviations and auto-expansions. |
| **`/advice-master`** | `AdviceMaster.tsx` | `advices.json` | Pre-configured prescription advice templates. |
| **`/contact-list`** | `ContactList.tsx` | `contacts.json` | Hospital telephone directory & emergency contacts. |
| **`/prescription-template`**| `StandardPrescriptionMaster.tsx`| `prescription_templates.json`| Standard disease-wise drug regimens. |
| **`/report-template`** | `ReportTemplate.tsx` | `report_templates.json` | Diagnostic pathology & radiology reporting templates. |

---

## 3. Data Flow & Interconnection Architecture

The system operates on an interconnected relational schema persisted in JSON files:

```
[Patient Master: UHID]
       │
       ├──► [OPD Bill Cum Receipt] ──► [Receipt Print: Bill.jpeg]
       │
       ├──► [Clinical Visits / Vitals] ──► [Prescription / History Print]
       │
       ├──► [Indoor Admission: IPD No]
       │           │
       │           ├──► Updates [Bed Master]: Status -> "Occupied"
       │           ├──► Links [Deposits / Part Payments]
       │           ├──► Links [Dr Visits / Bedside Procedures]
       │           ├──► Links [OT Surgery Entries]
       │           │
       │           └──► [Discharge Card: DIS No]
       │                      │
       │                      └──► Updates [Bed Master]: Status -> "Vacant"
       │
       ├──► [2D Echocardiography Study] ──► [Echo Report Print: echo report print.jpeg]
       │
       ├──► [Laboratory Investigation Orders] ──► [Pathology Report Print]
       │
       └──► [Legal Certificates: Fitness / MLC / Death] ──► [Certificate Print]
```

---

## 4. Architectural Verification

1. **Storage Integrity:** Every read and write utilizes `InterProcessFileLock` guarding atomic file replacements, completely eliminating partial file write hazards and corruption under concurrency.
2. **Offline-First Resilience:** In the absence of an active Django API instance (e.g. static GitHub Pages hosting), every client module smoothly falls back to browser `localStorage` and bundled baseline JSON seeds in `public/data/`.
3. **Responsive Mechanics:** CSS media queries across 8 viewport breakpoints and programmatic focus listeners ensure input forms auto-collapse the sidebar, maximizing input visibility on desktop and touch usability on mobile.
4. **Print Uniformity:** All documents open in a dedicated browser tab via clean HTML5 `@media print` or jsPDF routines adhering to `bill.jpeg` and `echo report print.jpeg` design guidelines.
