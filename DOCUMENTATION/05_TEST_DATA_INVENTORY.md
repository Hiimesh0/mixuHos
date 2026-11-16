# 05 — TEST DATA INVENTORY & DATASET AUDIT
**Mixu Infosystem Hospital Management / EMR System**
*Generated: 2026-11-16 | Persistent JSON Files in `backend/data/` and `frontend/public/data/`*

---

## 1. Test Data Inventory Summary

To ensure the entire application functions realistically and eliminates zero-record views or empty tables, all datasets have been audited, synchronized, and populated with realistic Indian healthcare records.

| Dataset File | Entity | Record Count | Primary Key Format | File Size |
|--------------|--------|--------------|--------------------|-----------|
| `patients.json` | Patients | 58 | `UHID-1001` ... `UHID-1058` | 55.2 KB |
| `patient_visits.json` | OPD Visits | 92 | `VISIT-000001` ... | 51.4 KB |
| `admissions.json` | Inpatient Admissions | 24 | `ADM-000001` ... | 15.6 KB |
| `discharges.json` | Discharge Summaries | 18 | `DIS-000001` ... | 13.6 KB |
| `bills.json` | Hospital Bills & Invoices | 46 | `BILL-1001` ... | 31.7 KB |
| `deposits.json` | Advance Deposits & Receipts | 28 | `REC-1001` ... | 9.7 KB |
| `investigations.json` | Diagnostic Lab Reports | 65 | `LAB-2026-0001` ... | 36.3 KB |
| `echo_reports.json` | 2D Echo Cardiac Reports | 16 | `ECHO-1001` ... | 17.8 KB |
| `certificates.json` | Medical, MLC & Death Certs | 26 | `CERT-2026-0001` ... | 14.3 KB |
| `ot_entries.json` | Operation Theatre Surgeries | 18 | `OT-000001` ... | 10.4 KB |
| `medicines.json` | Pharmacy Medications | 48 | `MED-000001` ... | 14.6 KB |
| `doctors.json` | Doctors & Consultants | 22 | `DOC-000001` ... | 8.9 KB |
| `dr_visits_procedures.json` | Bedside Visits & Procedures | 28 | `DVP-000001` ... | 13.6 KB |
| `beds.json` | Hospital Beds | 32 | `BED-000001` ... | 10.0 KB |
| `room_types.json` | Room Tariffs & Wards | 8 | `RMT-000001` ... | 1.2 KB |
| `departments.json` | Clinical Departments | 12 | `DEP-000001` ... | 3.2 KB |
| `contacts.json` | Intercoms & Extensions | 14 | `CNT-000001` ... | 1.8 KB |
| `operation_groups.json` | Surgical Groups | 8 | `OPG-000001` ... | 1.1 KB |
| `insurance_companies.json` | TPA & Insurance Payers | 10 | `INS-000001` ... | 1.6 KB |
| `visiting_types.json` | Consultation Types | 6 | `VST-000001` ... | 0.9 KB |
| `short_forms.json` | Clinical Abbreviations | 15 | `SHT-000001` ... | 1.5 KB |
| `advices.json` | Discharge Instructions | 12 | `ADV-000001` ... | 1.2 KB |
| `prescription_templates.json` | Rx Prescriptions | 10 | `PRX-000001` ... | 1.6 KB |
| `report_templates.json` | Lab Report Formats | 14 | `TPL-000001` ... | 4.5 KB |
| `charge_master.json` | OPD Charges Taxonomy | 12 | `CHG-001` ... | 1.0 KB |

---

## 2. Sample Patient Cohorts

The dataset includes rich test cases representing diverse clinical scenarios:

1. **Cardiovascular Patient (`UHID-1001` / `Ramesh Patil`)**:
   - OPD visits with hypertensive blood pressure tracking.
   - Inpatient admission for acute coronary evaluation in ICU.
   - 2D Echocardiogram showing LVEF 62%, normal wall motion.
   - Diagnostic ECG and Lipid Profile.
   - Comprehensive inpatient bill and advance deposit receipt.

2. **General Surgery Patient (`UHID-1002` / `Sunita Sharma`)**:
   - Inpatient admission for Laparoscopic Cholecystectomy.
   - OT entry with surgical team, anesthesia, and operative findings.
   - Inpatient bill with room charges, nursing care, and surgery fees.
   - Medical fitness certificate with 7-day post-op rest.

3. **Trauma / Medico-Legal Patient (`UHID-1005` / `Kabir Ahmad`)**:
   - Emergency casualty admission and triage record.
   - MLC examination certificate detailing contusions and police buckle info.
   - Diagnostic radiology and lab workup.

4. **Chronic Care / Senior Citizen (`UHID-1010` / `Govind Rao`)**:
   - Multiple follow-up visits across 6 months.
   - Long-term diabetic prescription and HbA1c trending.
   - Part-payment ledger and deposit vouchers.
