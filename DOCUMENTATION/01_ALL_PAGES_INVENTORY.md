# 01 — ALL PAGES & MODULES INVENTORY
**Mixu Infosystem Hospital Management / EMR System**
*Generated: 2026-11-16 | Project Stack: React (Vite, TypeScript), Django 5.x (Python 3.14), Persistent JSON Storage*

---

## 1. Executive Summary

This inventory documents all 37 active modules, views, master registries, clinical components, and diagnostic tools in the Mixu Infosystem application. Every page listed below is connected to live JSON storage, supports refresh and direct routing without blank white screens, and incorporates realistic healthcare data.

---

## 2. Master Module Inventory Table

| # | Module / Page Name | Route Path | Primary Component File | Underlying JSON Store | Status |
|---|--------------------|------------|------------------------|-----------------------|--------|
| 1 | Login & Authentication | `/login` | `src/components/Login/Login.tsx` | Client Token / Session | Complete |
| 2 | Patient Registration | `/patient-registration` | `src/components/PatientRegistration/PatientRegistration.tsx` | `patients.json` | Complete |
| 3 | Patient Registration List | `/patient-registration-list` | `src/components/PatientRegistrationList/PatientRegistrationList.tsx` | `patients.json` | Complete |
| 4 | Patient History & Encounters | `/patient-history` | `src/components/PatientHistory/PatientHistory.tsx` | `patient_visits.json`, `patients.json` | Complete |
| 5 | Patient Past Clinical Info | `/patient-past-info` | `src/components/PatientPastInfo/PatientPastInfo.tsx` | Visits, Admissions, Lab, Echo, Bills | Complete |
| 6 | OPD Billing & Cash Counter | `/billing` | `src/components/Billing/Billing.tsx` | `bills.json`, `patients.json` | Complete |
| 7 | Part Payment & Receipts | `/part-payment` | `src/components/PartPayment/PartPayment.tsx` | `deposits.json`, `bills.json` | Complete |
| 8 | Indoor Register (Admissions) | `/indoor-register` | `src/components/IndoorRegister/IndoorRegister.tsx` | `admissions.json`, `beds.json` | Complete |
| 9 | Indoor Summary Chart | `/indoor-summary-chart` | `src/components/IndoorSummaryChart/IndoorSummaryChart.tsx` | `admissions.json`, `bills.json` | Complete |
| 10 | Inpatient (IPD) Bill | `/inpatient-bill` | `src/components/InpatientBill/InpatientBill.tsx` | `admissions.json`, `bills.json` | Complete |
| 11 | Inpatient Receipt | `/inpatient-receipt` | `src/components/InpatientReceipt/InpatientReceipt.tsx` | `deposits.json`, `bills.json` | Complete |
| 12 | Deposit Entry | `/deposit` | `src/components/DepositEntry/DepositEntry.tsx` | `deposits.json` | Complete |
| 13 | Room Charges Entry | `/room-charges` | `src/components/RoomCharges/RoomCharges.tsx` | `beds.json`, `admissions.json` | Complete |
| 14 | Operation Charges | `/operation-charges` | `src/components/OperationCharges/OperationCharges.tsx` | `ot_entries.json`, `operation_groups.json` | Complete |
| 15 | Dr Visit & Procedures | `/dr-visit-procedure` | `src/components/DrVisitProcedure/DrVisitProcedure.tsx` | `dr_visits_procedures.json` | Complete |
| 16 | Discharge Card & Summary | `/discharge-card` | `src/components/DischargeCard/DischargeCard.tsx` | `discharges.json`, `admissions.json` | Complete |
| 17 | Operation Theatre (OT) Entry | `/ot-entry` | `src/components/OtEntry/OtEntry.tsx` | `ot_entries.json`, `operation_groups.json` | Complete |
| 18 | Bed Management Master | `/bed-master` | `src/components/BedMaster/BedMaster.tsx` | `beds.json` | Complete |
| 19 | Room Type Master | `/room-type-master` | `src/components/RoomTypeMaster/RoomTypeMaster.tsx` | `room_types.json` | Complete |
| 20 | Room / Bed Occupancy Status | `/room-status` | `src/components/RoomStatus/RoomStatus.tsx` | `beds.json`, `admissions.json` | Complete |
| 21 | Diagnostic Lab Ordered | `/investigation-ordered` | `src/components/InvestigationOrdered/InvestigationOrdered.tsx` | `investigations.json`, `patients.json` | Complete |
| 22 | 2D Echocardiography Report | `/echo-report` | `src/components/EchoReport/EchoReport.tsx` | `echo_reports.json`, `patients.json` | Complete |
| 23 | Medical Leave Certificate | `/medical-certificate` | `src/components/MedicalCertificate/MedicalCertificate.tsx` | `certificates.json`, `patients.json` | Complete |
| 24 | Medico-Legal Certificate (MLC) | `/mlc-certificate` | `src/components/MlcCertificate/MlcCertificate.tsx` | `certificates.json`, `patients.json` | Complete |
| 25 | Cause of Death Certificate | `/death-certificate` | `src/components/DeathCertificate/DeathCertificate.tsx` | `certificates.json`, `patients.json` | Complete |
| 26 | Certificate Templates | `/certificate-template` | `src/components/CertificateTemplate/CertificateTemplate.tsx` | `certificates.json` templates | Complete |
| 27 | Doctor Master | `/doctor-master` | `src/components/DoctorMaster/DoctorMaster.tsx` | `doctors.json` | Complete |
| 28 | Medicine Master | `/medicine-master` | `src/components/MedicineMaster/MedicineMaster.tsx` | `medicines.json` | Complete |
| 29 | Standard Prescription Master | `/standard-prescription-master` | `src/components/StandardPrescriptionMaster/StandardPrescriptionMaster.tsx` | `prescription_templates.json` | Complete |
| 30 | Diagnostic Report Templates | `/report-template` | `src/components/ReportTemplate/ReportTemplate.tsx` | `report_templates.json` | Complete |
| 31 | OPD Charges Master | `/opd-charges-master` | `src/components/OPDChargesMaster/OPDChargesMaster.tsx` | `charge_master.json` | Complete |
| 32 | OPD Charges Profile | `/opd-charges-profile` | `src/components/OPDChargesProfile/OPDChargesProfile.tsx` | Diagnostic Profiles | Complete |
| 33 | OPD Patient Category Master | `/opd-patient-category` | `src/components/OPDPatientCategory/OPDPatientCategory.tsx` | Patient Categories | Complete |
| 34 | Visit Procedure Header Master | `/visit-procedure-header-master` | `src/components/VisitProcedureHeaderMaster/VisitProcedureHeaderMaster.tsx` | Procedure Taxonomy | Complete |
| 35 | Intercom & Telephone Directory | `/intercomm-display` | `src/components/IntercommDisplay/IntercommDisplay.tsx` | `contacts.json` | Complete |
| 36 | Hospital Contacts Registry | `/contacts` | `src/components/ContactList/ContactList.tsx` | `contacts.json` | Complete |
| 37 | Daily Census & Reports Dashboard | `/today-report-dashboard` | `src/components/TodayReportDashboard/TodayReportDashboard.tsx` | Aggregated Analytics | Complete |

---

## 3. Architecture & Data Binding Verification

- **Direct Route Handling**: All routes are configured with `<ErrorBoundary>` protection, preventing unhandled crash screens.
- **Hosted SPA Support**: `frontend/public/404.html` and `index.html` resolve path requests dynamically, ensuring both `/#/route` and clean `/route` requests render correctly on GitHub Pages and local servers.
- **Interconnected Identifiers**: Patient UHID links seamlessly across Registration, History, Past Info, OPD Billing, Inpatient Billing, Investigations, 2D Echo, and Certificates.
