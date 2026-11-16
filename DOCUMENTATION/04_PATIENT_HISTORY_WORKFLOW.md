# 04 — PATIENT PAST HISTORY & CLINICAL TIMELINE WORKFLOW
**Mixu Infosystem Hospital Management / EMR System**
*Generated: 2026-11-16 | Primary Component: `PatientPastInfo.tsx`*

---

## 1. Overview of the Patient Past History Module

The Patient Past Clinical Information & Encounter Timeline (`/patient-past-info`) provides doctors, nursing supervisors, and administrative staff with a complete, longitudinal view of a patient's medical journey across all hospital departments.

---

## 2. Navigation & Access Points

Users can access the specific patient's past history through three integrated triggers:

1. **Patient Registration Form Action Bar**:
   - Prominent blue button: `"View Patient Past History"` (with `History` icon).
   - When a patient is loaded or saved, clicking this button immediately invokes:
     ```typescript
     navigate(`/patient-past-info?id=${encodeURIComponent(uhid)}`);
     ```
2. **Patient Registration List Table Row**:
   - Each row in the patient catalog table features a quick-action history button (`<History size={15} />`) that directly opens `/patient-past-info?id=${patient.uhid}`.
3. **Patient Details Modal**:
   - The view modal includes `"View Past Clinical History"`, seamlessly bridging registration and EHR review.
4. **Encounter Modal in Registration**:
   - The history modal footer features `"View Full Clinical History"`.

---

## 3. Patient Identity & Clinical Banner

At the top of the history page, a responsive summary card presents key patient data:
- **Full Legal Name & UHID**: e.g., `Shri Ramesh Shantaram Patil (UHID-1001)`
- **Demographics**: Age, Gender, Blood Group (highlighted in crimson).
- **Contact & City**: Phone number and address.
- **Classification**: Patient Category (General / Senior Citizen / PMJAY) and Primary Treating Consultant.

---

## 4. Five Core Clinical Timeline Sections

The view organizes all encounters into 5 structured, tabbed sections:

### Section 1: Outpatient (OPD) Visits & Clinical Vitals
- **Fields**: Visit Number (`#1`, `#2`), Visit Date, Visit Type (`Routine Consultation`, `Emergency Triage`), Treating Doctor, Chief Complaint.
- **Vitals Badges**: Blood Pressure (BP), Pulse Rate (PR), Oxygen Saturation (SpO2), Body Weight (Wt).
- **Empty State**: `"No outpatient visits recorded for this patient."`

### Section 2: Inpatient (IPD) Admissions & Discharges
- **Fields**: IPD Number (`IPD-1001`), Admission Date, Ward & Bed Number (`Bed 101, ICU`), Treating Doctor, Provisional / Final Diagnosis, Status Badge (`Admitted` / `Discharged`).
- **Action**: `"Print"` generates the official Inpatient Admission Face Sheet.

### Section 3: Diagnostic Laboratory & Radiology Reports
- **Fields**: Lab Order Number (`LAB-2026-0001`), Order Date, Test Name (`Complete Blood Count`, `Lipid Profile`), Category (`Hematology`, `Biochemistry`), Evaluated Parameters, Sample Status (`Completed`, `Processing`).
- **Action**: `"Print"` generates the formal Laboratory Investigation Report.

### Section 4: 2D Echocardiography & Cardiac Reports
- **Fields**: Echo Report ID (`ECHO-1001`), Examination Date, Referred Doctor, Left Ventricular Ejection Fraction (`LVEF ~62%`), Regional Wall Motion Abnormality (`RWMA: Absent`), Clinical Conclusion.
- **Action**: `"Print"` generates the complete multi-valve Echocardiography Report.

### Section 5: Billing Encounters & Receipts
- **Invoices**: Invoice Number, Date, Type (`OPD` / `IPD`), Gross Total, Discount, Net Amount, Paid Amount, Balance Due.
  - **Action**: `"Print"` generates the A4 Patient Invoice & Bill Cum Receipt.
- **Deposits**: Receipt Number, Date, Amount Paid, Mode (`Cash`, `UPI`, `Card`), Remarks.
  - **Action**: `"Print"` generates the Deposit Receipt.

---

## 5. Refresh & URL Preservation

- The page uses `useSearchParams()` to reflect `?id=UHID-XXXX` in the browser address bar.
- When refreshed (`F5`), bookmarked, or shared, the application reads the query parameter, loads the exact patient's records, and displays the complete EHR without reverting to a generic or empty state.
