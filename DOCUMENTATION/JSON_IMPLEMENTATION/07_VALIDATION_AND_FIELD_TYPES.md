# 07. Validation Rules & Field Specifications

## Mixu Infosystem Hospital Management / EMR System

---

### 1. Data Type Standards

| Data Type | Standard Format | Example | Implementation |
|---|---|---|---|
| **Primary Keys** | `[PREFIX]-[6_DIGIT_SEQ]` | `ADM-000001`, `INV-000002` | `BaseJSONRepository._next_id()` |
| **Clinical Encounter IDs** | `[PREFIX]-[YEAR]-[4_DIGIT_SEQ]` | `IPD-2026-0001`, `DIS-2026-0001`, `ORD-2026-0001` | Domain Repositories |
| **Patient Identifier** | `UHID-[4-6_DIGITS]` | `UHID-1023` | Patient Master Index |
| **Timestamps** | ISO-8601 with IST Offset | `2026-11-16T14:30:00+05:30` | `now_ist_iso()` |
| **Dates** | `YYYY-MM-DD` | `2026-11-16` | Standard HTML5 Date Input |
| **Times** | `HH:MM` (24-Hour) | `14:30` | Standard HTML5 Time Input |
| **Phone Numbers** | 10 to 15 digits | `9825012345` | Regex: `^[0-9]{10,15}$` |
| **Currency** | Decimal (2 places) | `1500.00` | Stored as Float, formatted to 2 decimals |

---

### 2. Business Entity Validation Rules

#### Patient Registration (`patients.json`)
- `name`: Required, string, 2-100 characters.
- `age`: Required, integer, range 0 to 130.
- `gender`: Required, enum: `'Male' | 'Female' | 'Other'`.
- `mobile`: Required, 10 digits, numeric.
- `address`: Optional, string, max 500 characters.

#### Inpatient Admission (`admissions.json`)
- `patient_id` / `uhid`: Required, must resolve to a valid registered patient.
- `bed_number`: Required, bed must currently have status `'Vacant'`. Double-booking is rejected with HTTP 400.
- `admission_date`: Required, valid date.
- `admitting_doctor`: Required, non-empty string.
- `initial_deposit`: Required, float >= 0.

#### Patient Discharge (`discharges.json`)
- `admission_id`: Required, admission must currently have status `'Admitted'`.
- `discharge_date`: Required, cannot precede `admission_date`.
- `final_diagnosis`: Required, minimum 5 characters.
- `condition_on_discharge`: Required, enum: `'Recovered' | 'Improved' | 'LAMA' | 'Referred' | 'Deceased'`.

#### Hospital Beds (`beds.json`)
- `bed_number`: Required, unique, case-insensitive.
- `ward_name`: Required, non-empty string.
- `daily_rate`: Required, numeric > 0.
- `status`: Required, enum: `'Vacant' | 'Occupied' | 'Maintenance' | 'Cleaning'`.

#### Lab Investigation (`investigations.json`)
- `uhid`: Required, linked to patient.
- `test_name`: Required, non-empty.
- `results`: Array of parameter objects; each must have `parameter` and `value`.
- `sample_status`: Enum: `'Pending' | 'Sample Collected' | 'Processing' | 'Completed' | 'Delivered'`.

#### Deposit / Payment Receipts (`deposits.json`)
- `uhid`: Required, valid patient identifier.
- `amount`: Required, float > 0. Zero or negative amounts are rejected.
- `payment_mode`: Required, enum: `'Cash' | 'UPI / QR' | 'Credit / Debit Card' | 'Cheque' | 'NEFT / RTGS'`.
