"""
Thread-safe, atomic JSON storage for Echo (Echocardiography) Reports.
Manages echo_reports.json in backend/data.
"""

import os
import json
import threading
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional

from .storage import PatientJSONStorage
from .file_lock import InterProcessFileLock

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
ECHO_REPORTS_FILE = DATA_DIR / "echo_reports.json"


class EchoReportStorageError(Exception):
    """Custom exception raised for Echo Report JSON storage errors."""
    pass


class EchoReportJSONStorage:
    """
    Thread-safe, atomic, and inter-process-safe JSON storage for 2D Transthoracic Echocardiography Reports.
    Maintains clinical observations, chamber dimensions, Doppler study, and conclusion.
    """

    def __init__(self, file_path: Path = ECHO_REPORTS_FILE):
        self.file_path = file_path
        self.data_dir = self.file_path.parent
        self._lock = InterProcessFileLock(self.file_path)
        self.patient_storage = PatientJSONStorage()
        self._ensure_storage()

    def _ensure_storage(self) -> None:
        """Create parent directory and initialize sample echo reports if missing."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            if not self.file_path.exists():
                now_iso = datetime.now(timezone.utc).isoformat()
                default_data = {
                    "echo_reports": [
                        {
                            "id": "ECHO-1001",
                            "uhid": "UHID-1023",
                            "patientName": "TestBillPatient",
                            "age": "33",
                            "sex": "Male",
                            "reportDate": "2026-10-28",
                            "referredBy": "DR. NIKUNJ VITHALANI",
                            "c_o": "Atypical chest discomfort on exertion, palpitations",
                            # Measurement fields
                            "mitralValve": "Normal leaflets, mild MR, no MS",
                            "tricuspidValve": "Structurally normal, trivial TR",
                            "aorta": "28 mm (Normal)",
                            "leftVentricle": "Normal cavity size, no global hypokinesia",
                            "rwma": "No regional wall motion abnormality at rest",
                            "rightVentricle": "Normal size and function (TAPSE 22 mm)",
                            "ivc": "16 mm, >50% respiratory collapsibility",
                            "aorticValve": "Trileaflet, normal opening, no AS/AR",
                            "pulmonaryValve": "Normal morphology and flow",
                            "lvef": 62,
                            "leftAtrium": "32 mm (Normal)",
                            "rightAtrium": "Normal size",
                            "rvsp": 24,
                            "ivs": "Normal thickness (9 mm)",
                            "septum": 9,
                            "lvidd": 46,
                            "ias": "Intact on color Doppler, no ASD flow",
                            "pWall": 9,
                            "lvids": 29,
                            # Lower section
                            "pericardium": "Normal, no pericardial effusion",
                            "dopplerStudy": "Mitral E/A ratio: 1.2, Deceleration time: 180 ms. Normal diastolic filling pattern. No significant valvular gradient across aortic or pulmonic valves.",
                            "conclusion": "Normal resting 2D Transthoracic Echocardiogram. Good LV systolic function (LVEF ~62%). No RWMA. Normal chamber dimensions.",
                            "lvCompliance": "Normal",
                            "tvi": "21 cm",
                            "leftAorticArchPdaCoarctation": "Left-sided arch, no PDA / coarctation",
                            "consultantDr": "Dr. Nilesh Mahale",
                            "status": "Finalized",
                            "finalizedAt": now_iso,
                            "finalizedBy": "Dr. Nilesh Mahale",
                            "createdAt": now_iso,
                            "updatedAt": now_iso
                        },
                        {
                            "id": "ECHO-1002",
                            "uhid": "UHID-1022",
                            "patientName": "TestBanner",
                            "age": "30",
                            "sex": "Male",
                            "reportDate": "2026-10-29",
                            "referredBy": "DR. NIKUNJ VITHALANI",
                            "c_o": "Routine pre-operative cardiac fitness evaluation",
                            "mitralValve": "Normal anterior and posterior leaflets",
                            "tricuspidValve": "Normal tricuspid valve leaflets",
                            "aorta": "27 mm",
                            "leftVentricle": "Normal LV dimensions",
                            "rwma": "Nil",
                            "rightVentricle": "Normal RV dimension and systolic function",
                            "ivc": "Normal (<20 mm, collapses >50%)",
                            "aorticValve": "Trileaflet, good excursion",
                            "pulmonaryValve": "Normal",
                            "lvef": 65,
                            "leftAtrium": "30 mm",
                            "rightAtrium": "Normal",
                            "rvsp": 22,
                            "ivs": "8 mm",
                            "septum": 8,
                            "lvidd": 44,
                            "ias": "Intact",
                            "pWall": 8,
                            "lvids": 28,
                            "pericardium": "No effusion",
                            "dopplerStudy": "Normal spectral Doppler flow velocities across all four cardiac valves. E/A > 1.0.",
                            "conclusion": "Normal 2D Transthoracic Echocardiography study. Normal LV systolic and diastolic function. Cleared for elective surgical procedure from cardiac standpoint.",
                            "lvCompliance": "Normal",
                            "tvi": "22 cm",
                            "leftAorticArchPdaCoarctation": "Normal left arch, no PDA",
                            "consultantDr": "Dr. Nilesh Mahale",
                            "status": "Draft",
                            "finalizedAt": None,
                            "finalizedBy": None,
                            "createdAt": now_iso,
                            "updatedAt": now_iso
                        }
                    ]
                }
                self._write_atomically(default_data)

    def _read_data(self) -> Dict[str, Any]:
        """Read data safely from the JSON file."""
        with self._lock:
            if not self.file_path.exists():
                self._ensure_storage()

            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if not content:
                        return {"echo_reports": []}
                    data = json.loads(content)
                    if not isinstance(data, dict) or "echo_reports" not in data or not isinstance(data["echo_reports"], list):
                        raise EchoReportStorageError("Invalid echo report schema: missing 'echo_reports' list key.")
                    return data
            except json.JSONDecodeError as exc:
                raise EchoReportStorageError(f"Corrupted echo_reports.json file: {str(exc)}") from exc
            except IOError as exc:
                raise EchoReportStorageError(f"I/O error reading echo reports: {str(exc)}") from exc

    def _write_atomically(self, data: Dict[str, Any]) -> None:
        """Atomically write JSON data using temporary file and atomic replace."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            temp_file = None
            try:
                with tempfile.NamedTemporaryFile("w", dir=str(self.data_dir), delete=False, encoding="utf-8") as tf:
                    json.dump(data, tf, indent=2, ensure_ascii=False)
                    temp_file = tf.name

                os.replace(temp_file, str(self.file_path))
            except Exception as exc:
                if temp_file and os.path.exists(temp_file):
                    try:
                        os.remove(temp_file)
                    except OSError:
                        pass
                raise EchoReportStorageError(f"Failed atomic write to echo reports: {str(exc)}") from exc

    @staticmethod
    def _parse_numeric(val: Any) -> Optional[float]:
        """Parse numeric values (strip units like %, mm, mmHg) or return None."""
        if val is None:
            return None
        if isinstance(val, (int, float)):
            return int(val) if float(val).is_integer() else float(val)
        s = str(val).strip()
        if not s:
            return None
        import re
        m = re.search(r"[-+]?\d*\.?\d+", s)
        if m:
            try:
                f = float(m.group(0))
                return int(f) if f.is_integer() else f
            except ValueError:
                return None
        return None

    def generate_next_id(self) -> str:
        """Generate the next sequential Echo Report ID (e.g. ECHO-1003)."""
        data = self._read_data()
        reports = data.get("echo_reports", [])
        max_num = 1000
        for rep in reports:
            rep_id = str(rep.get("id", "")).strip()
            if rep_id.startswith("ECHO-"):
                try:
                    num = int(rep_id.replace("ECHO-", ""))
                    if num > max_num:
                        max_num = num
                except ValueError:
                    continue
        return f"ECHO-{max_num + 1}"

    def get_all(
        self,
        query: Optional[str] = None,
        uhid: Optional[str] = None,
        status: Optional[str] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        doctor: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve all echo reports matching optional search filters.
        """
        data = self._read_data()
        reports = list(data.get("echo_reports", []))

        # Filter by UHID
        if uhid:
            uhid_norm = uhid.strip().upper()
            reports = [r for r in reports if str(r.get("uhid", "")).strip().upper() == uhid_norm]

        # Filter by Status (Draft vs Finalized)
        if status and status.strip() and status.strip().lower() != "all":
            stat_norm = status.strip().lower()
            reports = [r for r in reports if str(r.get("status", "")).strip().lower() == stat_norm]

        # Filter by Doctor
        if doctor and doctor.strip() and doctor.strip().lower() != "all":
            doc_norm = doctor.strip().lower()
            reports = [
                r for r in reports
                if doc_norm in str(r.get("consultantDr", "")).lower() or
                   doc_norm in str(r.get("referredBy", "")).lower()
            ]

        # Filter by Report Date Range
        if from_date:
            from_d = from_date.strip()
            reports = [r for r in reports if str(r.get("reportDate", "")) >= from_d]
        if to_date:
            to_d = to_date.strip()
            reports = [r for r in reports if str(r.get("reportDate", "")) <= to_d]

        # General Search query: matches Patient Name, UHID, Report ID, or Doctor
        if query and query.strip():
            q = query.strip().lower()
            reports = [
                r for r in reports
                if q in str(r.get("patientName", "")).lower() or
                   q in str(r.get("uhid", "")).lower() or
                   q in str(r.get("id", "")).lower() or
                   q in str(r.get("consultantDr", "")).lower() or
                   q in str(r.get("referredBy", "")).lower() or
                   q in str(r.get("conclusion", "")).lower()
            ]

        # Sort descending by reportDate, then by ID
        reports.sort(key=lambda r: (str(r.get("reportDate", "")), str(r.get("id", ""))), reverse=True)
        return reports

    def get_by_id(self, report_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single Echo Report by its ID."""
        if not report_id:
            return None
        target = report_id.strip().upper()
        data = self._read_data()
        for rep in data.get("echo_reports", []):
            if str(rep.get("id", "")).strip().upper() == target:
                return dict(rep)
        return None

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new Echo Report linked to an existing patient record.
        Validates that the patient exists in patients.json.
        """
        with self._lock:
            uhid = str(data.get("uhid") or data.get("ptCode") or "").strip().upper()
            if not uhid:
                raise EchoReportStorageError("Patient UHID / Pt.Code is required to create an Echo Report.")

            # Validate patient existence in backend patient storage
            patient = self.patient_storage.get_by_id(uhid)
            if not patient:
                raise EchoReportStorageError(
                    f"Patient with UHID '{uhid}' does not exist. Echo Reports must belong to an existing registered patient."
                )

            # Auto-fill patient details from authoritative patient record if missing
            parts = [patient.get("firstName"), patient.get("middleName"), patient.get("lastName")]
            patient_full_name = " ".join(str(p).strip() for p in parts if p and str(p).strip())
            if not patient_full_name:
                patient_full_name = str(patient.get("firstName") or "").strip()

            patient_name = str(data.get("patientName") or patient_full_name).strip()
            age = str(data.get("age") or patient.get("age") or "").strip()
            sex = str(data.get("sex") or patient.get("sex") or "").strip()
            referred_by = str(data.get("referredBy") or patient.get("referenceBy") or "").strip()
            consultant_dr = str(data.get("consultantDr") or patient.get("hospitalDoctor") or "").strip()

            new_id = self.generate_next_id()
            now_iso = datetime.now(timezone.utc).isoformat()
            today_str = datetime.now().strftime("%Y-%m-%d")
            report_date = str(data.get("reportDate") or today_str).strip()

            status = str(data.get("status") or "Draft").strip()
            if status not in ("Draft", "Finalized"):
                status = "Draft"

            finalized_at = now_iso if status == "Finalized" else None
            finalized_by = consultant_dr if status == "Finalized" else None

            report_record: Dict[str, Any] = {
                "id": new_id,
                "uhid": uhid,
                "patientName": patient_name,
                "age": age,
                "sex": sex,
                "reportDate": report_date,
                "referredBy": referred_by,
                "c_o": str(data.get("c_o") or "").strip(),

                # Anatomical & Measurement fields
                "mitralValve": str(data.get("mitralValve") or "").strip(),
                "tricuspidValve": str(data.get("tricuspidValve") or "").strip(),
                "aorta": str(data.get("aorta") or "").strip(),
                "leftVentricle": str(data.get("leftVentricle") or "").strip(),
                "rwma": str(data.get("rwma") or "").strip(),
                "rightVentricle": str(data.get("rightVentricle") or "").strip(),
                "ivc": str(data.get("ivc") or "").strip(),
                "aorticValve": str(data.get("aorticValve") or "").strip(),
                "pulmonaryValve": str(data.get("pulmonaryValve") or "").strip(),
                "lvef": self._parse_numeric(data.get("lvef")),
                "leftAtrium": str(data.get("leftAtrium") or "").strip(),
                "rightAtrium": str(data.get("rightAtrium") or "").strip(),
                "rvsp": self._parse_numeric(data.get("rvsp")),
                "ivs": str(data.get("ivs") or "").strip(),
                "septum": self._parse_numeric(data.get("septum")),
                "lvidd": self._parse_numeric(data.get("lvidd")),
                "ias": str(data.get("ias") or "").strip(),
                "pWall": self._parse_numeric(data.get("pWall")),
                "lvids": self._parse_numeric(data.get("lvids")),

                # Lower section
                "pericardium": str(data.get("pericardium") or "").strip(),
                "dopplerStudy": str(data.get("dopplerStudy") or "").strip(),
                "conclusion": str(data.get("conclusion") or "").strip(),
                "lvCompliance": str(data.get("lvCompliance") or "").strip(),
                "tvi": str(data.get("tvi") or "").strip(),
                "leftAorticArchPdaCoarctation": str(data.get("leftAorticArchPdaCoarctation") or "").strip(),
                "consultantDr": consultant_dr,

                # Lifecycle & audit metadata
                "status": status,
                "finalizedAt": finalized_at,
                "finalizedBy": finalized_by,
                "createdAt": now_iso,
                "updatedAt": now_iso,
            }

            stored = self._read_data()
            stored["echo_reports"].append(report_record)
            self._write_atomically(stored)
            return report_record

    def update(self, report_id: str, data: Dict[str, Any], allow_finalized_edit: bool = False) -> Dict[str, Any]:
        """
        Update an existing Echo Report.
        If report is Finalized, prevents accidental edits unless allow_finalized_edit=True.
        """
        with self._lock:
            stored = self._read_data()
            reports = stored.get("echo_reports", [])
            target = report_id.strip().upper()

            index = -1
            current = None
            for idx, r in enumerate(reports):
                if str(r.get("id", "")).strip().upper() == target:
                    index = idx
                    current = r
                    break

            if index == -1 or current is None:
                raise EchoReportStorageError(f"Echo report '{report_id}' not found.")

            # Protected editing check for Finalized reports
            if current.get("status") == "Finalized" and not allow_finalized_edit:
                raise EchoReportStorageError(
                    f"Echo report '{report_id}' is finalized and locked from modification. "
                    "Authorized amendment workflow is required to edit."
                )

            # Preserve permanent identity
            updated = dict(current)
            updatable_fields = [
                "patientName", "age", "sex", "reportDate", "referredBy", "c_o",
                "mitralValve", "tricuspidValve", "aorta", "leftVentricle", "rwma",
                "rightVentricle", "ivc", "aorticValve", "pulmonaryValve", "lvef",
                "leftAtrium", "rightAtrium", "rvsp", "ivs", "septum", "lvidd",
                "ias", "pWall", "lvids", "pericardium", "dopplerStudy", "conclusion",
                "lvCompliance", "tvi", "leftAorticArchPdaCoarctation", "consultantDr"
            ]

            numeric_fields = {"lvef", "rvsp", "septum", "lvidd", "pWall", "lvids"}
            for field in updatable_fields:
                if field in data:
                    if field in numeric_fields:
                        updated[field] = self._parse_numeric(data[field])
                    else:
                        updated[field] = str(data[field] or "").strip()

            # Handle status changes
            if "status" in data:
                new_status = str(data["status"]).strip()
                if new_status in ("Draft", "Finalized"):
                    if new_status == "Finalized" and updated.get("status") != "Finalized":
                        updated["finalizedAt"] = datetime.now(timezone.utc).isoformat()
                        updated["finalizedBy"] = data.get("finalizedBy") or updated.get("consultantDr")
                    updated["status"] = new_status

            updated["updatedAt"] = datetime.now(timezone.utc).isoformat()
            reports[index] = updated
            stored["echo_reports"] = reports
            self._write_atomically(stored)
            return updated

    def finalize(self, report_id: str, finalized_by: Optional[str] = None) -> Dict[str, Any]:
        """
        Explicitly finalize an Echo Report, locking its findings.
        """
        with self._lock:
            stored = self._read_data()
            reports = stored.get("echo_reports", [])
            target = report_id.strip().upper()

            index = -1
            current = None
            for idx, r in enumerate(reports):
                if str(r.get("id", "")).strip().upper() == target:
                    index = idx
                    current = r
                    break

            if index == -1 or current is None:
                raise EchoReportStorageError(f"Echo report '{report_id}' not found.")

            now_iso = datetime.now(timezone.utc).isoformat()
            current["status"] = "Finalized"
            current["finalizedAt"] = now_iso
            current["finalizedBy"] = (finalized_by or current.get("consultantDr") or "Authorized Medical Officer").strip()
            current["updatedAt"] = now_iso

            reports[index] = current
            stored["echo_reports"] = reports
            self._write_atomically(stored)
            return current

    def delete(self, report_id: str) -> bool:
        """Delete an Echo Report by ID."""
        with self._lock:
            stored = self._read_data()
            reports = stored.get("echo_reports", [])
            target = report_id.strip().upper()

            initial_len = len(reports)
            filtered = [r for r in reports if str(r.get("id", "")).strip().upper() != target]

            if len(filtered) == initial_len:
                raise EchoReportStorageError(f"Echo report '{report_id}' not found.")

            stored["echo_reports"] = filtered
            self._write_atomically(stored)
            return True
