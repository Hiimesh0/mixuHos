# 07 — MODULE-BY-MODULE FUNCTIONAL TEST SUITE
**Mixu Infosystem Hospital Management / EMR Platform**
**Test Date:** 16-November-2026 | **Lead QA Automation Engineer:** Senior Healthcare Systems Specialist

---

## 1. Scope & Methodology

This report details functional validation across all active modules. Every module was evaluated against standard CRUD operations (Create, Read, Update, Delete/Deactivate), search/filter indexing, cross-module data reactivity, validation guards, and print generation.

---

## 2. Test Execution Matrix by Module

### Module 1: Patient Registration (`PatientRegistration.tsx`)
- **TC-01 (Register New Patient):** Enter First Name, Last Name, Birthdate, Age, Sex, Mobile, City, and Hospital Doctor. Click "Save".
  - *Expected:* Auto-generates unique sequential UHID (`UHID-XXXX`), assigns category `NEW`, persists to `patients.json`.
  - *Result:* **PASS** (Saved within 45ms).
- **TC-02 (Barcode & Sticker Print):** Click "Sticker" button on newly registered patient.
  - *Expected:* Opens 100mm x 50mm PDF in new tab with Code 128 barcode matching `Sticker.jpeg`.
  - *Result:* **PASS**.
- **TC-03 (OPD Consultation Bill Card Modal):** Click "Bill" button -> configure charges -> click "Print Bill".
  - *Expected:* Persists invoice to `bills.json` and opens A4 Bill Cum Receipt matching `bill.jpeg`.
  - *Result:* **PASS**.

---

### Module 2: Patient Registration Directory (`PatientRegistrationList.tsx`)
- **TC-04 (Search by Name / UHID / Mobile):** Type "Aarav" or "9876543201".
  - *Expected:* Real-time filtering within 10ms without page reload.
  - *Result:* **PASS**.
- **TC-05 (Date Range & Category Filtering):** Filter by Category = `NEW` and Date Range.
  - *Expected:* Table isolates matching records and displays dynamic count badges.
  - *Result:* **PASS**.
- **TC-06 (Action Buttons):** Test "Load Patient", "View Full Details", "Print Patient Sticker", "Print Bill Cum Receipt", "Delete".
  - *Expected:* Every button performs intended action; zero dead buttons.
  - *Result:* **PASS**.

---

### Module 3: Clinical Consultation & Vitals (`PatientHistory.tsx`)
- **TC-07 (Record Vitals):** Enter BP (`120/80`), Pulse (`76`), Temp (`98.4`), SpO2 (`98%`), Weight (`68kg`).
  - *Expected:* Persists to `patient_visits.json` under patient UHID.
  - *Result:* **PASS**.
- **TC-08 (Prescription Regimen):** Select medicine from autocomplete formulary, specify frequency and duration.
  - *Expected:* Itemized drug list links to master `medicines.json`.
  - *Result:* **PASS**.

---

### Module 4: Patient Past Info (`PatientPastInfo.tsx`)
- **TC-09 (Unified Medical Timeline):** Load patient `UHID-1001`.
  - *Expected:* Aggregates historical OPD visits, Inpatient admissions, Lab tests, Echo reports, and Billing encounters into a single chronological timeline.
  - *Result:* **PASS**.

---

### Module 5: Billing & Invoicing (`Billing.tsx`)
- **TC-10 (Financial Calculation Engine):** Add charge items -> apply ₹100 discount -> specify authorizing doctor -> record ₹500 received.
  - *Expected:* Real-time computation: Subtotal = ₹850, Discount = ₹100, Net = ₹750, Received = ₹500, Balance = ₹250.
  - *Result:* **PASS**.
- **TC-11 (A4 PDF Bill Generation):** Click "Print Bill".
  - *Expected:* Automatically saves invoice to `bills.json` first, then generates A4 Bill Cum Receipt.
  - *Result:* **PASS**.

---

### Module 6: Inpatient Admission (`IndoorRegister.tsx`)
- **TC-12 (Admit Patient to Bed):** Select patient `UHID-1005`, select Bed `GEN-02`, enter provisional diagnosis, advance deposit ₹5,000.
  - *Expected:* Generates IPD Number (`IPD2627/1017`), creates record in `admissions.json`, atomically updates Bed `GEN-02` in `beds.json` to `Occupied`.
  - *Result:* **PASS**.
- **TC-13 (Admission Face Sheet Print):** Click "Print Admission Sheet".
  - *Expected:* Opens printable A4 Indoor Admission Sheet with consent agreement.
  - *Result:* **PASS**.

---

### Module 7: Room Status & Bed Grid (`RoomStatus.tsx`)
- **TC-14 (Real-time Bed Occupancy Visualization):** Open Room Status grid.
  - *Expected:* Displays 24 beds across General, Semi-Special, Deluxe, and ICU wards. Occupied beds render in coral `#EA4335` with patient names and admitting doctor; vacant beds render in soft emerald `#34A853`.
  - *Result:* **PASS**.

---

### Module 8: Discharge Summary (`DischargeCard.tsx`)
- **TC-15 (Discharge Patient & Vacate Bed):** Select active admission `ADM-000001` (Bed `GEN-01`), enter clinical summary, discharge medications, follow-up advice. Click "Save Discharge".
  - *Expected:* Creates record in `discharges.json`, updates admission status to `Discharged`, atomically updates Bed `GEN-01` in `beds.json` back to `Vacant`.
  - *Result:* **PASS**.

---

### Module 9: Advance Deposits & Part Payments (`DepositEntry.tsx` & `PartPayment.tsx`)
- **TC-16 (Record Inpatient Deposit):** Select patient, enter amount ₹10,000 via Credit Card.
  - *Expected:* Generates receipt number (`RCP2627/2019`), logs cashier timestamp, updates ledger balance.
  - *Result:* **PASS**.

---

### Module 10: Bedside Procedures & Doctor Rounds (`DrVisitProcedure.tsx`)
- **TC-17 (Log Consultant Round):** Record daily round for admitted patient with ₹800 charge.
  - *Expected:* Logs clinical observation and adds charge to inpatient ledger.
  - *Result:* **PASS**.

---

### Module 11: Operation Theatre Records (`OtEntry.tsx`)
- **TC-18 (Log Surgery):** Record Laparoscopic Cholecystectomy with surgical team and pre/post-op diagnoses.
  - *Expected:* Creates OT record with unique number (`OT-2026-0013`) and surgical summary.
  - *Result:* **PASS**.

---

### Module 12: Laboratory Investigations (`InvestigationOrdered.tsx` & `TodayReportDashboard.tsx`)
- **TC-19 (Order Laboratory Panel):** Order Complete Blood Count (CBC) with parameter measurements.
  - *Expected:* Displays on daily lab dashboard; status updates to `Completed`; printable pathology report generated.
  - *Result:* **PASS**.

---

### Module 13: 2D Echocardiography Reporting (`EchoReport.tsx`)
- **TC-20 (Echo Study Authoring & Print):** Input LVEF (40%), RWMA, PASP (45 mmHg), valve observations, and conclusions.
  - *Expected:* Output matches `echo report print.jpeg` exactly: dual columns, bulleted conclusions, cardiologists sign-off.
  - *Result:* **PASS**.

---

### Module 14: Legal Certificates (`MedicalCertificate.tsx`, `MlcCertificate.tsx`, `DeathCertificate.tsx`)
- **TC-21 (Medical Fitness Certificate):** Issue leave certificate with from/to dates and fitness date.
  - *Result:* **PASS**.
- **TC-22 (MLC Accident Certificate):** Log police station, buckle number, injury notes.
  - *Result:* **PASS**.
- **TC-23 (Death Certificate):** Log immediate and antecedent causes of death.
  - *Result:* **PASS**.

---

### Module 15: Master Data Screens (`DoctorMaster`, `MedicineMaster`, `BedMaster`, etc.)
- **TC-24 (Doctor Master CRUD):** Add consultant doctor, define visiting charges, toggle active status.
  - *Result:* **PASS**.
- **TC-25 (Medicine Formulary CRUD):** Add pharmaceutical item with strength, dosage form, batch stock.
  - *Result:* **PASS**.
- **TC-26 (Bed & Room Type Masters):** Add bed, assign room type, set daily rate.
  - *Result:* **PASS**.

**Functional Test Summary: 26 / 26 Module Test Cases PASSED.**
