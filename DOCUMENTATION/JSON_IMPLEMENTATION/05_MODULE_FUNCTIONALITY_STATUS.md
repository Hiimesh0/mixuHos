# 05. Module Functionality Status & Inventory

## Mixu Infosystem Hospital Management / EMR System

Every module below is inspected, wired to real state and JSON repositories, and verified functional:

| # | Module Name | Route | Backend API Endpoint | Primary Data Storage | Status | Verified Capabilities |
|---|---|---|---|---|---|---|
| 1 | Patient Registration | `/patient-registration` | `/api/patients/` | `patients.json` | **100% Fully Working** | Multi-step form, camera scanner, auto-generate UHID, bill calculation, dynamic stickers, validation |
| 2 | Patient Registration List | `/patient-registration-list` | `/api/patients/` | `patients.json` | **100% Fully Working** | Live search, date filtering, print sticker, open bill, patient edit |
| 3 | Bill Preview | `/bill-preview` | `/api/patients/<id>/bill/` | `patients.json` | **100% Fully Working** | Official Bill Cum Receipt preview, discount auth, PDF download & print |
| 4 | Patient History | `/patient-history` | `/api/patients/<id>/visits/` | `patient_visits.json` | **100% Fully Working** | Longitudinal visit browser, vitals recording (BP, PR, SpO2, Temp, Wt), clinical findings, save & print |
| 5 | Patient Past Info | `/patient-past-info` | `/api/patients/<id>/` | `patients.json`, `patient_visits.json`, `admissions.json` | **100% Fully Working** | Unified longitudinal patient timeline (OPD visits, IPD admissions, Lab reports, billing) |
| 6 | Doctor Master | `/doctor-master` | `/api/doctors/` | `doctors.json` | **100% Fully Working** | Doctor registration, specialties, consultation rates, PAN/Aadhaar, delete/deactivate, print list |
| 7 | Medicine Master | `/medicine-master` | `/api/medicines/` | `medicines.json` | **100% Fully Working** | Brand/Generic name, dosage forms, stock qty, expiry dates, batch tracking, printable catalog |
| 8 | Report Template | `/report-template` | `/api/report-templates/` | `report_templates.json` | **100% Fully Working** | Diagnostic narrative templates, rich text formatting, department grouping, preview & print |
| 9 | Echo Report | `/echo-report` | `/api/echo-reports/` | `echo_reports.json` | **100% Fully Working** | Full 2D Echocardiography study, valve & chamber measurements, ejection fraction, auto-conclusion, print |
| 10 | Indoor Register | `/indoor-register` | `/api/admissions/` | `admissions.json`, `beds.json` | **100% Fully Working** | Inpatient admission, bed allocation, room charge calculation, auto-assign IPD No, print admission sheet |
| 11 | Room Status | `/room-status` | `/api/beds/`, `/api/admissions/` | `beds.json`, `admissions.json` | **100% Fully Working** | Real-time bed occupancy grid, ward tabs, occupied/vacant badges, bed maintenance toggle |
| 12 | Room Charges | `/room-charges` | `/api/room-types/` | `room_types.json` | **100% Fully Working** | Room type rates, AC category charges, bed capacity tracking |
| 13 | Discharge Card | `/discharge-card` | `/api/discharges/` | `discharges.json`, `admissions.json`, `beds.json` | **100% Fully Working** | Patient discharge, clinical summary, discharge Rx, auto-vacates bed, prints professional discharge card |
| 14 | Deposit Entry | `/deposit-entry` | `/api/deposits/` | `deposits.json` | **100% Fully Working** | Advance deposits and part payment receipts, cash/card/UPI tracking, ledger table, print receipt |
| 15 | Part Payment | `/part-payment` | `/api/deposits/`, `/api/patients/` | `deposits.json` | **100% Fully Working** | Interim patient billing, services list, discount authorization, receipt generator |
| 16 | Dr. Visit & Procedure | `/dr-visit-procedure` | `/api/dr-visits-procedures/` | `dr_visits_procedures.json` | **100% Fully Working** | Inpatient doctor rounds, bedside procedures, charges tracking, billing sync |
| 17 | OT Entry | `/ot-entry` | `/api/ot-entries/` | `ot_entries.json` | **100% Fully Working** | Surgical logs, surgeon & anesthetist team, anesthesia type, surgical notes, surgery note print |
| 18 | Operation Charges | `/operation-charges` | `/api/operation-groups/` | `operation_groups.json` | **100% Fully Working** | Surgical procedure pricing, package pricing, consumable rates |
| 19 | Indoor Summary Chart | `/indoor-summary-chart` | `/api/admissions/`, `/api/beds/` | `admissions.json` | **100% Fully Working** | Active inpatient census, occupancy rates, average length of stay, consultant workload |
| 20 | Investigation Ordered | `/investigation-ordered` | `/api/investigations/` | `investigations.json` | **100% Fully Working** | Lab orders (CBC, RFT, LFT, Lipid, Sugar), result parameter entry, flags (High/Low), lab report print |
| 21 | Today Report Dashboard | `/today-report-dashboard` | `/api/investigations/` | `investigations.json` | **100% Fully Working** | Diagnostic workload dashboard, pending vs completed samples, quick print access |
| 22 | Medical Certificate | `/medical-certificate` | `/api/certificates/` | `certificates.json` | **100% Fully Working** | Medical fitness and sick leave certificate generation, doctor reg no, legal disclaimer, print |
| 23 | MLC Certificate | `/mlc-certificate` | `/api/certificates/` | `certificates.json` | **100% Fully Working** | Medico-legal certificate, police station, constable details, injury documentation, print |
| 24 | Death Certificate | `/death-certificate` | `/api/certificates/` | `certificates.json` | **100% Fully Working** | Cause of death certificate, immediate vs antecedent causes, time of death, legal print |
| 25 | Department Master | `/department-master` | `/api/departments/` | `departments.json` | **100% Fully Working** | Clinical department CRUD, code management, active status toggle |
| 26 | Bed Master | `/bed-master` | `/api/beds/` | `beds.json` | **100% Fully Working** | Hospital bed registration, ward association, daily rates, occupancy management |
| 27 | Room Type Master | `/room-type-master` | `/api/room-types/` | `room_types.json` | **100% Fully Working** | Room classes, AC types, bed counts, daily rate tiers |
| 28 | Operation Group Master | `/operation-group-master` | `/api/operation-groups/` | `operation_groups.json` | **100% Fully Working** | Surgical specialty classification, surgical codes, descriptions |
| 29 | Insurance Company Master | `/insurance-company-master` | `/api/insurance-companies/` | `insurance_companies.json` | **100% Fully Working** | Cashless insurance & TPA desk registry, contact numbers, corporate billing rules |
| 30 | Visiting Type Master | `/visiting-type-master` | `/api/visiting-types/` | `visiting_types.json` | **100% Fully Working** | Consultation types (OPD, Emergency, Super-specialist, Night visit) and default fees |
| 31 | Short Form Master | `/short-form-master` | `/api/short-forms/` | `short_forms.json` | **100% Fully Working** | Medical abbreviations, clinical acronyms, search & auto-expansion |
| 32 | Advice Master | `/advice-master` | `/api/advices/` | `advices.json` | **100% Fully Working** | Standard discharge advice, diet guidelines, lifestyle instructions CRUD |
| 33 | Contact List | `/contact-list` | `/api/contacts/` | `contacts.json` | **100% Fully Working** | Internal telephone and intercom directory, extension lookup, staff phone directory print |
| 34 | Standard Prescription Master | `/standard-prescription-master` | `/api/prescription-templates/` | `prescription_templates.json` | **100% Fully Working** | Disease-specific prescription protocols (medications, doses, timing, duration) |
| 35 | Login & Authentication | `/login` | `/api/auth/` | Client Session | **100% Fully Working** | Responsive branded login page, user credentials check, session state |
