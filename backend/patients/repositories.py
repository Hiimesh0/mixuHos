"""
Domain Repositories for Mixu Infosystem Hospital Management / EMR.
Provides database-ready domain data access logic adhering to the Repository Pattern.
All persistent storage operations are serialized and locked with InterProcessFileLock.
Entities use typed attributes, ISO 8601 timestamps, stable IDs, and relational validations.
"""

from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional

from .base_repository import (
    BaseJSONRepository,
    RepositoryError,
    RecordNotFoundError,
    ValidationError,
    now_ist_iso,
    IST,
)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# ==============================================================================
# 1. Master Repositories
# ==============================================================================

class DepartmentRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "departments.json"):
        seed = [
            {"id": "DEP-000001", "code": "MED", "name": "General Medicine", "head_doctor": "Dr. Nilesh Mahale", "extension": "101", "is_active": True},
            {"id": "DEP-000002", "code": "SURG", "name": "General Surgery", "head_doctor": "Dr. Snehal Mahale", "extension": "102", "is_active": True},
            {"id": "DEP-000003", "code": "CARDIO", "name": "Cardiology", "head_doctor": "Dr. Nilesh Mahale", "extension": "103", "is_active": True},
            {"id": "DEP-000004", "code": "ORTHO", "name": "Orthopedics", "head_doctor": "Dr. Snehal Mahale", "extension": "104", "is_active": True},
            {"id": "DEP-000005", "code": "ICU", "name": "Intensive Care Unit (ICU)", "head_doctor": "Dr. Nilesh Mahale", "extension": "105", "is_active": True},
            {"id": "DEP-000006", "code": "RADIO", "name": "Radiology & Imaging", "head_doctor": "Dr. Nilesh Mahale", "extension": "106", "is_active": True},
            {"id": "DEP-000007", "code": "PATH", "name": "Pathology & Laboratory", "head_doctor": "Dr. Nilesh Mahale", "extension": "107", "is_active": True},
        ]
        super().__init__(file_path, "Department", "DEP", "departments", seed)


class RoomTypeRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "room_types.json"):
        seed = [
            {"id": "RMT-000001", "name": "General Ward", "code": "GEN", "daily_rate": 800.0, "ac_type": "Non-AC", "total_beds": 20, "is_active": True},
            {"id": "RMT-000002", "name": "Semi-Private Room", "code": "SEMI", "daily_rate": 1800.0, "ac_type": "AC", "total_beds": 10, "is_active": True},
            {"id": "RMT-000003", "name": "Private Deluxe", "code": "DELUXE", "daily_rate": 3500.0, "ac_type": "AC Deluxe", "total_beds": 8, "is_active": True},
            {"id": "RMT-000004", "name": "ICU / CCU", "code": "ICU", "daily_rate": 5500.0, "ac_type": "Central AC / Monitor", "total_beds": 6, "is_active": True},
            {"id": "RMT-000005", "name": "Day Care / Recovery", "code": "DAYCARE", "daily_rate": 1200.0, "ac_type": "AC", "total_beds": 4, "is_active": True},
        ]
        super().__init__(file_path, "RoomType", "RMT", "room_types", seed)


class BedRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "beds.json"):
        seed = [
            {"id": "BED-000001", "bed_number": "GEN-01", "ward_name": "General Ward Male", "room_type_id": "RMT-000001", "status": "Vacant", "current_admission_id": None, "current_patient_id": None, "daily_rate": 800.0, "is_active": True},
            {"id": "BED-000002", "bed_number": "GEN-02", "ward_name": "General Ward Male", "room_type_id": "RMT-000001", "status": "Vacant", "current_admission_id": None, "current_patient_id": None, "daily_rate": 800.0, "is_active": True},
            {"id": "BED-000003", "bed_number": "GEN-03", "ward_name": "General Ward Female", "room_type_id": "RMT-000001", "status": "Vacant", "current_admission_id": None, "current_patient_id": None, "daily_rate": 800.0, "is_active": True},
            {"id": "BED-000004", "bed_number": "SEMI-101", "ward_name": "1st Floor East", "room_type_id": "RMT-000002", "status": "Vacant", "current_admission_id": None, "current_patient_id": None, "daily_rate": 1800.0, "is_active": True},
            {"id": "BED-000005", "bed_number": "SEMI-102", "ward_name": "1st Floor East", "room_type_id": "RMT-000002", "status": "Vacant", "current_admission_id": None, "current_patient_id": None, "daily_rate": 1800.0, "is_active": True},
            {"id": "BED-000006", "bed_number": "DEL-201", "ward_name": "2nd Floor Deluxe", "room_type_id": "RMT-000003", "status": "Vacant", "current_admission_id": None, "current_patient_id": None, "daily_rate": 3500.0, "is_active": True},
            {"id": "BED-000007", "bed_number": "ICU-01", "ward_name": "Critical Care Unit", "room_type_id": "RMT-000004", "status": "Vacant", "current_admission_id": None, "current_patient_id": None, "daily_rate": 5500.0, "is_active": True},
            {"id": "BED-000008", "bed_number": "ICU-02", "ward_name": "Critical Care Unit", "room_type_id": "RMT-000004", "status": "Vacant", "current_admission_id": None, "current_patient_id": None, "daily_rate": 5500.0, "is_active": True},
        ]
        super().__init__(file_path, "Bed", "BED", "beds", seed)

    def allocate_bed(self, bed_number: str, admission_id: str, patient_id: str) -> Optional[Dict[str, Any]]:
        """Mark a bed as occupied by a specific admission and update occupancy status."""
        with self._lock:
            items = self.get_all(active_only=False)
            clean_no = str(bed_number).strip().lower()
            for b in items:
                if str(b.get("bed_number") or "").strip().lower() == clean_no:
                    b["status"] = "Occupied"
                    b["is_occupied"] = True
                    b["current_admission_id"] = admission_id
                    b["current_patient_id"] = patient_id
                    b["updated_at"] = now_ist_iso()
                    self._write_atomically({self.root_key: items, "last_sequence": len(items)})
                    return b
            return None

    def release_bed(self, bed_number: str) -> Optional[Dict[str, Any]]:
        """Mark a bed as vacant upon discharge."""
        with self._lock:
            items = self.get_all(active_only=False)
            clean_no = str(bed_number).strip().lower()
            for b in items:
                if str(b.get("bed_number") or "").strip().lower() == clean_no:
                    b["status"] = "Vacant"
                    b["is_occupied"] = False
                    b["current_admission_id"] = None
                    b["current_patient_id"] = None
                    b["updated_at"] = now_ist_iso()
                    self._write_atomically({self.root_key: items, "last_sequence": len(items)})
                    return b
            return None


class OperationGroupRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "operation_groups.json"):
        seed = [
            {"id": "OPG-000001", "code": "GSURG", "name": "General Surgery", "description": "Laparoscopic and open abdominal procedures", "is_active": True},
            {"id": "OPG-000002", "code": "ORTHO", "name": "Orthopedic Procedures", "description": "Fracture fixation, arthroscopy, joint surgery", "is_active": True},
            {"id": "OPG-000003", "code": "CARDIO", "name": "Cardiovascular Interventions", "description": "Pacemaker, vascular grafts, angiographies", "is_active": True},
            {"id": "OPG-000004", "code": "ENT", "name": "ENT / Otorhinolaryngology", "description": "Septoplasty, tonsillectomy, mastoidectomy", "is_active": True},
            {"id": "OPG-000005", "code": "GYNEC", "name": "Obstetrics & Gynecology", "description": "LSCS, hysterectomy, diagnostic laparoscopy", "is_active": True},
        ]
        super().__init__(file_path, "OperationGroup", "OPG", "operation_groups", seed)


class InsuranceCompanyRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "insurance_companies.json"):
        seed = [
            {"id": "INS-000001", "name": "Star Health and Allied Insurance", "code": "STAR", "tpa_name": "In-house TPA", "phone": "18004252255", "email": "tpa@starhealth.in", "no_ipd_charges": False, "is_active": True},
            {"id": "INS-000002", "name": "HDFC ERGO General Insurance", "code": "HDFCERGO", "tpa_name": "Medi Assist TPA", "phone": "02262346234", "email": "info@hdfcergo.com", "no_ipd_charges": False, "is_active": True},
            {"id": "INS-000003", "name": "ICICI Lombard General Insurance", "code": "ICICI", "tpa_name": "Paramount TPA", "phone": "18002666", "email": "hospital@icicilombard.com", "no_ipd_charges": False, "is_active": True},
            {"id": "INS-000004", "name": "New India Assurance Co Ltd", "code": "NEWINDIA", "tpa_name": "MDIndia Health Insurance TPA", "phone": "18002091415", "email": "corporate@newindia.co.in", "no_ipd_charges": False, "is_active": True},
            {"id": "INS-000005", "name": "Ayushman Bharat / PMJAY Scheme", "code": "PMJAY", "tpa_name": "State Health Agency Gujarat", "phone": "14555", "email": "helpdesk@pmjay.gov.in", "no_ipd_charges": True, "is_active": True},
        ]
        super().__init__(file_path, "InsuranceCompany", "INS", "insurance_companies", seed)


class VisitingTypeRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "visiting_types.json"):
        seed = [
            {"id": "VST-000001", "name": "Routine OPD Consultation", "default_rate": 500.0, "is_active": True},
            {"id": "VST-000002", "name": "Follow-Up Consultation (within 7 days)", "default_rate": 300.0, "is_active": True},
            {"id": "VST-000003", "name": "Emergency / Casualty Consultation", "default_rate": 750.0, "is_active": True},
            {"id": "VST-000004", "name": "Super-Specialist Opinion", "default_rate": 1000.0, "is_active": True},
            {"id": "VST-000005", "name": "Night / On-Call Visit", "default_rate": 1200.0, "is_active": True},
        ]
        super().__init__(file_path, "VisitingType", "VST", "visiting_types", seed)


class ShortFormRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "short_forms.json"):
        seed = [
            {"id": "SHT-000001", "abbreviation": "BP", "full_form": "Blood Pressure (mmHg)", "category": "Vitals", "is_active": True},
            {"id": "SHT-000002", "abbreviation": "PR", "full_form": "Pulse Rate (beats/min)", "category": "Vitals", "is_active": True},
            {"id": "SHT-000003", "abbreviation": "SpO2", "full_form": "Oxygen Saturation (%)", "category": "Vitals", "is_active": True},
            {"id": "SHT-000004", "abbreviation": "RBS", "full_form": "Random Blood Sugar (mg/dL)", "category": "Laboratory", "is_active": True},
            {"id": "SHT-000005", "abbreviation": "ECG", "full_form": "12-Lead Electrocardiogram", "category": "Investigation", "is_active": True},
            {"id": "SHT-000006", "abbreviation": "CXR", "full_form": "Chest X-Ray PA View", "category": "Radiology", "is_active": True},
            {"id": "SHT-000007", "abbreviation": "USG", "full_form": "Ultrasonography Whole Abdomen", "category": "Radiology", "is_active": True},
            {"id": "SHT-000008", "abbreviation": "ECHO", "full_form": "2D Echocardiography with Color Doppler", "category": "Cardiology", "is_active": True},
        ]
        super().__init__(file_path, "ShortForm", "SHT", "short_forms", seed)


class AdviceRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "advices.json"):
        seed = [
            {"id": "ADV-000001", "title": "Hypertension Dietary Advice", "instructions": "Strict salt restriction (< 4g/day). Avoid fried, oily, and processed foods. Regular brisk walking 30 mins daily.", "category": "Diet & Lifestyle", "is_active": True},
            {"id": "ADV-000002", "title": "Diabetic Foot Care", "instructions": "Inspect feet daily. Keep feet clean and moisturized. Do not walk barefoot. Wear comfortable padded footwear.", "category": "Endocrine", "is_active": True},
            {"id": "ADV-000003", "title": "Post-Op Wound Care", "instructions": "Keep incision clean and dry. Avoid lifting heavy weights for 4 weeks. Report fever or purulent discharge immediately.", "category": "Surgical", "is_active": True},
            {"id": "ADV-000004", "title": "Hydration in Fever", "instructions": "Drink plenty of oral fluids (ORS, coconut water, lemon water, boiled water). Take paracetamol as prescribed.", "category": "General", "is_active": True},
        ]
        super().__init__(file_path, "Advice", "ADV", "advices", seed)


class ContactRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "contacts.json"):
        seed = [
            {"id": "CNT-000001", "name": "Dr. Nilesh Mahale", "department": "Cardiology / Medicine", "designation": "Chief Consultant", "intercomm": "101", "mobile": "9825123456", "email": "dr.nilesh@hospital.com", "is_active": True},
            {"id": "CNT-000002", "name": "Dr. Snehal Mahale", "department": "Surgery", "designation": "Senior Surgeon", "intercomm": "102", "mobile": "9825234567", "email": "dr.snehal@hospital.com", "is_active": True},
            {"id": "CNT-000003", "name": "ICU Incharge Desk", "department": "Intensive Care Unit", "designation": "Nursing Officer", "intercomm": "201", "mobile": "9825000201", "email": "icu@hospital.com", "is_active": True},
            {"id": "CNT-000004", "name": "Operation Theatre Desk", "department": "OT Complex", "designation": "OT Coordinator", "intercomm": "301", "mobile": "9825000301", "email": "ot@hospital.com", "is_active": True},
            {"id": "CNT-000005", "name": "Billing & TPA Cashless", "department": "Administration", "designation": "Billing Executive", "intercomm": "401", "mobile": "9825000401", "email": "billing@hospital.com", "is_active": True},
            {"id": "CNT-000006", "name": "Reception / Emergency Desk", "department": "Casualty", "designation": "Front Desk Officer", "intercomm": "501", "mobile": "9825000501", "email": "reception@hospital.com", "is_active": True},
        ]
        super().__init__(file_path, "Contact", "CNT", "contacts", seed)


class PrescriptionTemplateRepository(BaseJSONRepository):
    def __init__(self, file_path: Path = DATA_DIR / "prescription_templates.json"):
        seed = [
            {
                "id": "PRX-000001",
                "name": "Standard Essential Hypertension",
                "diagnosis": "Essential Hypertension (Stage 1/2)",
                "items": [
                    {"medicine_name": "Telmisartan 40mg", "dosage": "1 Tab", "frequency": "Once Daily (OD)", "timing": "Morning after breakfast", "duration_days": 30},
                    {"medicine_name": "Amlodipine 5mg", "dosage": "1 Tab", "frequency": "Once Daily (OD)", "timing": "Night before bed", "duration_days": 30},
                ],
                "instructions": "Monitor BP weekly. Report dizziness or peripheral edema.",
                "is_active": True,
            },
            {
                "id": "PRX-000002",
                "name": "Type 2 Diabetes Mellitus Starter",
                "diagnosis": "Type 2 Diabetes Mellitus",
                "items": [
                    {"medicine_name": "Metformin 500mg SR", "dosage": "1 Tab", "frequency": "Twice Daily (BD)", "timing": "With meals", "duration_days": 30},
                    {"medicine_name": "Glimepiride 1mg", "dosage": "1 Tab", "frequency": "Once Daily (OD)", "timing": "Before breakfast", "duration_days": 30},
                ],
                "instructions": "Maintain diabetic diet. Keep fast-acting sugar sweets available for hypoglycemia.",
                "is_active": True,
            },
        ]
        super().__init__(file_path, "PrescriptionTemplate", "PRX", "templates", seed)


# ==============================================================================
# 2. Patient & Visits Domain Repositories
# ==============================================================================

class PatientVisitRepository(BaseJSONRepository):
    """
    Manages longitudinal patient encounter visits.
    Maintains clean 1:N relationship between Patient identity (UHID) and multiple clinical visits.
    """
    def __init__(self, file_path: Path = DATA_DIR / "patient_visits.json"):
        seed = [
            {
                "id": "VST-2026-0001",
                "patient_id": "UHID-1023",
                "uhid": "UHID-1023",
                "patient_name": "TestBillPatient",
                "visit_no": 1,
                "visit_date": "2026-10-28T10:00:00+05:30",
                "visit_type": "New Registration",
                "consulting_doctor": "Dr. Nilesh Mahale",
                "department": "Medicine",
                "chief_complaint": "Chest heaviness and fatigue for 3 days",
                "vitals": {"bp": "130/84", "pulse": "76", "temp": "98.4", "spo2": "98"},
                "status": "Completed",
                "invoice_no": "OPD2627/6146",
                "is_active": True,
            }
        ]
        super().__init__(file_path, "PatientVisit", "VST", "visits", seed)

    def get_visits_for_patient(self, uhid: str) -> List[Dict[str, Any]]:
        clean_uhid = str(uhid).strip().lower()
        all_visits = self.get_all(active_only=False)
        return [v for v in all_visits if str(v.get("uhid") or v.get("patient_id") or "").strip().lower() == clean_uhid]

    def create_next_visit(self, uhid: str, patient_name: str, doctor: str, visit_type: str = "Follow-up", complaint: str = "", vitals: dict = None) -> Dict[str, Any]:
        with self._lock:
            existing = self.get_visits_for_patient(uhid)
            visit_no = len(existing) + 1
            record = {
                "patient_id": uhid,
                "uhid": uhid,
                "patient_name": patient_name,
                "visit_no": visit_no,
                "visit_date": now_ist_iso(),
                "visit_type": visit_type,
                "consulting_doctor": doctor,
                "chief_complaint": complaint,
                "vitals": vitals or {},
                "status": "Completed",
                "is_active": True,
            }
            return self.create(record)


# ==============================================================================
# 3. Hospital & Inpatient Domain Repositories
# ==============================================================================

class IndoorAdmissionRepository(BaseJSONRepository):
    """
    Manages IPD Indoor Admissions (Indoor Register).
    Guarantees sequential IPD numbers and bed occupancy updates.
    """
    def __init__(self, file_path: Path = DATA_DIR / "admissions.json"):
        seed = [
            {
                "id": "ADM-000001",
                "ipd_no": "IPD-2026-0001",
                "patient_id": "UHID-1022",
                "uhid": "UHID-1022",
                "patient_name": "Rameshbhai Patel",
                "age": "48",
                "gender": "Male",
                "mobile": "9825012345",
                "admission_date": "2026-11-10",
                "admission_time": "11:30",
                "bed_number": "GEN-01",
                "ward_name": "General Ward Male",
                "room_type": "General Ward",
                "daily_bed_charge": 800.0,
                "admitting_doctor": "Dr. Nilesh Mahale",
                "reference_doctor": "Dr. Snehal Mahale",
                "insurance_company": "Star Health and Allied Insurance",
                "provisional_diagnosis": "Acute Gastroenteritis with severe dehydration",
                "initial_deposit": 5000.0,
                "status": "Admitted",
                "is_active": True,
            }
        ]
        super().__init__(file_path, "Admission", "ADM", "admissions", seed)

    def admit_patient(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            data = self._read_data()
            ipd_seq = len(data.get(self.root_key, [])) + 1
            ipd_no = f"IPD-2026-{ipd_seq:04d}"

            record = dict(payload)
            record.setdefault("ipd_no", ipd_no)
            record["status"] = "Admitted"
            record.setdefault("admission_date", datetime.now(IST).strftime("%Y-%m-%d"))
            record.setdefault("admission_time", datetime.now(IST).strftime("%H:%M"))

            # Save admission (create generates unique sequential id)
            new_admission = self.create(record)

            # Auto-occupy the bed in BedRepository
            bed_no = record.get("bed_number")
            uhid = record.get("uhid") or record.get("patient_id")
            if bed_no:
                bed_repo.allocate_bed(bed_no, new_admission["id"], uhid)

            return new_admission


class DischargeRepository(BaseJSONRepository):
    """
    Manages Patient Discharge Cards.
    Synchronizes discharge status with Indoor Admissions and frees allocated beds.
    """
    def __init__(self, file_path: Path = DATA_DIR / "discharges.json"):
        seed = []
        super().__init__(file_path, "Discharge", "DIS", "discharges", seed)

    def process_discharge(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            data = self._read_data()
            dis_seq = len(data.get(self.root_key, [])) + 1
            discharge_no = f"DIS-2026-{dis_seq:04d}"

            record = dict(payload)
            record.setdefault("discharge_no", discharge_no)
            record.setdefault("discharge_date", datetime.now(IST).strftime("%Y-%m-%d"))
            record.setdefault("discharge_time", datetime.now(IST).strftime("%H:%M"))

            discharge_record = self.create(record)

            # Update admission status to Discharged
            admission_id = record.get("admission_id")
            if admission_id:
                try:
                    admission_repo.update(admission_id, {
                        "status": "Discharged",
                        "discharge_id": discharge_record["id"],
                        "discharge_date": record["discharge_date"],
                    })
                except Exception:
                    pass

            # Release the bed
            bed_no = record.get("bed_number")
            if bed_no:
                bed_repo.release_bed(bed_no)

            return discharge_record


class DepositRepository(BaseJSONRepository):
    """
    Manages IPD Advance Deposits and Part Payments.
    """
    def __init__(self, file_path: Path = DATA_DIR / "deposits.json"):
        seed = [
            {
                "id": "DEP-REC-000001",
                "receipt_no": "RCP-2026-0001",
                "patient_id": "UHID-1022",
                "uhid": "UHID-1022",
                "patient_name": "Rameshbhai Patel",
                "ipd_no": "IPD-2026-0001",
                "deposit_date": "2026-11-10T11:45:00+05:30",
                "amount": 5000.0,
                "payment_mode": "UPI",
                "transaction_ref": "UPI/2026/982341234",
                "authorized_by": "Cashier Office",
                "remarks": "Initial admission advance deposit",
                "is_active": True,
            }
        ]
        super().__init__(file_path, "Deposit", "DEP-REC", "deposits", seed)

    def get_patient_deposits(self, uhid: str) -> List[Dict[str, Any]]:
        clean_uhid = str(uhid).strip().lower()
        items = self.get_all(active_only=False)
        return [it for it in items if str(it.get("uhid") or it.get("patient_id") or "").strip().lower() == clean_uhid]


class DrVisitProcedureRepository(BaseJSONRepository):
    """
    Manages Inpatient Doctor Rounds, Special Consultations, and Procedures.
    """
    def __init__(self, file_path: Path = DATA_DIR / "dr_visits_procedures.json"):
        seed = [
            {
                "id": "DVP-000001",
                "admission_id": "ADM-000001",
                "ipd_no": "IPD-2026-0001",
                "patient_id": "UHID-1022",
                "uhid": "UHID-1022",
                "patient_name": "Rameshbhai Patel",
                "entry_type": "VISIT",
                "date": "2026-11-10",
                "head": "Visiting Charge",
                "doctor_name": "Dr. Nilesh Mahale",
                "room": "GEN",
                "bed_no": "GEN-01",
                "charges": 500.0,
                "notes": "Patient stable, hydration improving. Continued IV fluids.",
                "is_active": True,
            }
        ]
        super().__init__(file_path, "DrVisitProcedure", "DVP", "entries", seed)


class OtEntryRepository(BaseJSONRepository):
    """
    Manages Operating Theatre (OT) Surgical Logs and Anesthesia records.
    """
    def __init__(self, file_path: Path = DATA_DIR / "ot_entries.json"):
        seed = [
            {
                "id": "OT-000001",
                "ot_no": "OT-2026-0001",
                "admission_id": "ADM-000001",
                "ipd_no": "IPD-2026-0001",
                "patient_id": "UHID-1022",
                "uhid": "UHID-1022",
                "patient_name": "Rameshbhai Patel",
                "surgery_date": "2026-11-11",
                "start_time": "09:30",
                "end_time": "11:15",
                "operation_group": "General Surgery",
                "procedure_name": "Diagnostic Laparoscopy & Adhesiolysis",
                "lead_surgeon": "Dr. Snehal Mahale",
                "assistant_surgeon": "Dr. Assistant",
                "anesthetist": "Dr. Nilesh Mahale",
                "anesthesia_type": "General Anesthesia",
                "pre_op_diagnosis": "Recurrent abdominal pain with suspected adhesions",
                "post_op_diagnosis": "Pelvic adhesiolysis performed successfully",
                "charges": 18500.0,
                "is_active": True,
            }
        ]
        super().__init__(file_path, "OtEntry", "OT", "entries", seed)


# ==============================================================================
# 4. Clinical, Diagnostics & Certificates Repositories
# ==============================================================================

class InvestigationRepository(BaseJSONRepository):
    """
    Manages Laboratory and Radiology test orders and reports.
    """
    def __init__(self, file_path: Path = DATA_DIR / "investigations.json"):
        seed = [
            {
                "id": "INV-000001",
                "order_no": "ORD-2026-0001",
                "patient_id": "UHID-1023",
                "uhid": "UHID-1023",
                "patient_name": "TestBillPatient",
                "order_date": "2026-10-28",
                "doctor_name": "Dr. Nilesh Mahale",
                "test_name": "Complete Blood Count (CBC) with ESR",
                "category": "Hematology",
                "sample_status": "Completed",
                "lab_id": "LAB-102",
                "results": [
                    {"parameter": "Hemoglobin", "value": "13.8", "unit": "g/dL", "ref_range": "13.0 - 17.0", "flag": "Normal"},
                    {"parameter": "Total Leukocyte Count (TLC)", "value": "7800", "unit": "/cu.mm", "ref_range": "4000 - 11000", "flag": "Normal"},
                    {"parameter": "Platelet Count", "value": "240000", "unit": "/cu.mm", "ref_range": "150000 - 450000", "flag": "Normal"},
                    {"parameter": "ESR", "value": "12", "unit": "mm/1st hr", "ref_range": "0 - 15", "flag": "Normal"},
                ],
                "impression": "Normal hematological profile. No leukocytosis.",
                "is_active": True,
            }
        ]
        super().__init__(file_path, "Investigation", "INV", "investigations", seed)


class CertificateRepository(BaseJSONRepository):
    """
    Manages Medical Fitness, Medico-Legal (MLC), and Death Certificates.
    """
    def __init__(self, file_path: Path = DATA_DIR / "certificates.json"):
        seed = [
            {
                "id": "CERT-000001",
                "cert_type": "MEDICAL",
                "certificate_no": "MED-2026-0001",
                "patient_id": "UHID-1023",
                "uhid": "UHID-1023",
                "patient_name": "TestBillPatient",
                "age": "33",
                "gender": "Male",
                "diagnosis": "Acute Bronchitis with persistent cough",
                "rest_from": "2026-10-28",
                "rest_to": "2026-11-03",
                "fitness_date": "2026-11-04",
                "doctor_name": "Dr. Nilesh Mahale",
                "issue_date": "2026-10-28",
                "is_active": True,
            }
        ]
        super().__init__(file_path, "Certificate", "CERT", "certificates", seed)


class OPDChargeRepository(BaseJSONRepository):
    """
    Manages OPD Charges Master catalog items.
    """
    def __init__(self, file_path: Path = DATA_DIR / "opd_charges.json"):
        super().__init__(file_path, "OPD Charge", "CHG", "charges", [])


class OPDProfileRepository(BaseJSONRepository):
    """
    Manages Multi-test OPD Profiles and Panels.
    """
    def __init__(self, file_path: Path = DATA_DIR / "opd_profiles.json"):
        super().__init__(file_path, "OPD Profile", "PRF", "profiles", [])


class VisitProcedureHeaderRepository(BaseJSONRepository):
    """
    Manages Inpatient Visit & Procedure Header Tariff categories.
    """
    def __init__(self, file_path: Path = DATA_DIR / "visit_procedure_headers.json"):
        super().__init__(file_path, "Visit Header", "VPH", "headers", [])


# Singleton Instances Exported for Dependency Injection across Views & Tests
department_repo = DepartmentRepository()
room_type_repo = RoomTypeRepository()
bed_repo = BedRepository()
operation_group_repo = OperationGroupRepository()
insurance_repo = InsuranceCompanyRepository()
visiting_type_repo = VisitingTypeRepository()
short_form_repo = ShortFormRepository()
advice_repo = AdviceRepository()
contact_repo = ContactRepository()
prescription_template_repo = PrescriptionTemplateRepository()
patient_visit_repo = PatientVisitRepository()
admission_repo = IndoorAdmissionRepository()
discharge_repo = DischargeRepository()
deposit_repo = DepositRepository()
dr_visit_procedure_repo = DrVisitProcedureRepository()
ot_repo = OtEntryRepository()
investigation_repo = InvestigationRepository()
certificate_repo = CertificateRepository()
opd_charge_repo = OPDChargeRepository()
opd_profile_repo = OPDProfileRepository()
visit_header_repo = VisitProcedureHeaderRepository()
