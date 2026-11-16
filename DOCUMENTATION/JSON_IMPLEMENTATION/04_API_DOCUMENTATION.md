# 04. API Documentation

## Mixu Infosystem Hospital Management / EMR System
**Base URL**: `http://127.0.0.1:8000/api`

---

### 1. Inpatient & Indoor Management Endpoints

| Method | Endpoint | Query Params / Body | Description |
|---|---|---|---|
| `GET` | `/api/admissions/` | `status=Admitted`, `search=PatName`, `uhid=UHID-1001` | List indoor admissions |
| `POST` | `/api/admissions/` | `{uhid, patient_name, bed_number, ward_name, admitting_doctor, provisional_diagnosis, initial_deposit}` | Admit patient, assign IPD No, auto-occupy bed |
| `GET` | `/api/admissions/<id>/` | - | Get admission by ID or IPD No |
| `PUT` | `/api/admissions/<id>/` | Partial admission data | Update admission record |
| `DELETE` | `/api/admissions/<id>/` | `force=true/false` | Deactivate or delete admission |
| `GET` | `/api/discharges/` | `search=PatName`, `uhid=UHID-1001` | List discharge records |
| `POST` | `/api/discharges/` | `{admission_id, ipd_no, uhid, patient_name, discharge_date, final_diagnosis, condition_on_discharge}` | Process discharge, assign DIS No, auto-vacate bed |
| `GET` | `/api/beds/` | `ward_name=ICU`, `status=Vacant` | List beds with occupancy status |
| `POST` | `/api/beds/` | `{bed_number, ward_name, daily_rate, room_type_id}` | Create new bed in master |
| `POST` | `/api/beds/<bed_number>/allocate/` | `{admission_id, patient_id}` | Allocate bed to inpatient |
| `POST` | `/api/beds/<bed_number>/release/` | - | Release bed to vacant |
| `GET` | `/api/deposits/` | `search=RecNo`, `uhid=UHID-1001` | List deposit and part payment receipts |
| `POST` | `/api/deposits/` | `{uhid, patient_name, ipd_no, deposit_date, amount, payment_mode, remarks}` | Record deposit receipt |
| `GET` | `/api/dr-visits-procedures/` | `uhid=UHID-1001`, `admission_id=ADM-001` | List doctor rounds and bedside procedures |
| `POST` | `/api/dr-visits-procedures/` | `{admission_id, uhid, patient_name, doctor_name, entry_type, head_description, rate, quantity}` | Log doctor visit or procedure charge |
| `GET` | `/api/ot-entries/` | `uhid=UHID-1001`, `search=Surgeon` | List operation theatre surgery logs |
| `POST` | `/api/ot-entries/` | `{uhid, patient_name, surgery_date, procedure_name, lead_surgeon, anesthetist, charges}` | Log OT surgery record |

---

### 2. Clinical, Diagnostics & Certificates Endpoints

| Method | Endpoint | Query Params / Body | Description |
|---|---|---|---|
| `GET` | `/api/investigations/` | `uhid=UHID-1001`, `category=Hematology`, `sample_status=Completed` | List lab & radiology test orders |
| `POST` | `/api/investigations/` | `{uhid, patient_name, doctor_name, test_name, category, results: [{parameter, value, unit, ref_range, flag}], impression}` | Create diagnostic investigation report |
| `GET` | `/api/certificates/` | `cert_type=MEDICAL\|MLC\|DEATH`, `uhid=UHID-1001` | List certificates |
| `POST` | `/api/certificates/` | `{cert_type, uhid, patient_name, doctor_name, issue_date, diagnosis, ...type_specific_fields}` | Issue medical, MLC, or death certificate |
| `GET` | `/api/patients/<uhid>/visits/` | - | Get longitudinal clinical visits for patient |
| `POST` | `/api/patients/<uhid>/visits/` | `{patient_name, doctor, visit_type, chief_complaint, vitals: {bp, pulse, temp, spo2}}` | Record next visit for returning patient |

---

### 3. Master Data Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` / `POST` | `/api/departments/` | Clinical departments & specialties master CRUD |
| `GET` / `POST` | `/api/room-types/` | Ward room types, AC categories & bed rates |
| `GET` / `POST` | `/api/operation-groups/` | Surgical specialty & operation groups |
| `GET` / `POST` | `/api/insurance-companies/` | Cashless insurance companies & TPAs |
| `GET` / `POST` | `/api/visiting-types/` | Consultation visit types & fee rates |
| `GET` / `POST` | `/api/short-forms/` | Medical abbreviations & shortcuts |
| `GET` / `POST` | `/api/advices/` | Standard patient advice & discharge templates |
| `GET` / `POST` | `/api/contacts/` | Internal telephone & intercomm directory |
| `GET` / `POST` | `/api/prescription-templates/` | Standard prescription protocol templates |
| `GET` / `POST` | `/api/doctors/` | Doctor Master registry with consultation fees |
| `GET` / `POST` | `/api/medicines/` | Medicine Master with stock, dosage, pricing |
| `GET` / `POST` | `/api/report-templates/` | Diagnostic radiology/pathology report templates |

---

### 4. Patient Registration & Billing Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` / `POST` | `/api/patients/` | Register new patient, lookup existing patients by UHID/Name/Mobile |
| `GET` | `/api/patients/<id>/bill/` | Retrieve itemized bill and calculation breakdown |
| `GET` | `/api/patients/<id>/sticker.pdf` | Generate A4 patient sticker PDF |
| `GET` | `/api/patients/<id>/bill.pdf` | Generate Bill Cum Receipt PDF |
