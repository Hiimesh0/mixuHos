"""
Thread-safe, atomic JSON storage for Doctor Master.
Manages doctors.json in backend/data.
"""

import os
import json
import threading
import tempfile
from pathlib import Path
from typing import List, Dict, Any, Optional
from .file_lock import InterProcessFileLock

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DOCTORS_FILE = DATA_DIR / "doctors.json"


class DoctorStorageError(Exception):
    """Custom exception raised for Doctor Master JSON storage errors."""
    pass


class DoctorJSONStorage:
    """
    Thread-safe, atomic, and inter-process-safe JSON storage for doctor master records.
    Provides authoritative doctor information for hospital workflows.
    """

    def __init__(self, file_path: Path = DOCTORS_FILE):
        self.file_path = file_path
        self.data_dir = self.file_path.parent
        self._lock = InterProcessFileLock(self.file_path)
        self._ensure_storage()

    def _ensure_storage(self) -> None:
        """Create parent directory and initialize default doctors if missing."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            if not self.file_path.exists():
                default_data = {
                    "doctors": [
                        {
                            "id": "DR-101",
                            "drHosRef": "Hospital Doctor",
                            "drType": "Consultant Physician",
                            "title": "Dr.",
                            "drName": "Nilesh Mahale",
                            "degree": "MBBS, MD (Medicine)",
                            "speciality": "General Medicine",
                            "department": "Medicine",
                            "drRegNo": "G-23451",
                            "hospitalName": True,
                            "birthDate": "1980-05-14",
                            "wedding": "10-Dec",
                            "panNo": "ABCDE1234F",
                            "adharNo": "987654321012",
                            "mobileNo": "9825123456",
                            "phNoR": "0261223344",
                            "email": "dr.nilesh@hospital.com",
                            "consultationFee": 500,
                            "followupFee": 300,
                            "clinicName": "Mahale Healthcare & Clinic",
                            "address": "Ring Road, Near Civil Hospital",
                            "area": "Majura Gate",
                            "city": "SURAT",
                            "pin": "395002",
                            "state": "GUJARAT",
                            "country": "INDIA",
                            "clinicPhNo": "0261224455",
                            "status": "active"
                        },
                        {
                            "id": "DR-102",
                            "drHosRef": "Hospital Doctor",
                            "drType": "Consultant Surgeon",
                            "title": "Dr.",
                            "drName": "Snehal Mahale",
                            "degree": "MBBS, MS (General Surgery)",
                            "speciality": "General Surgery",
                            "department": "Surgery",
                            "drRegNo": "G-28910",
                            "hospitalName": True,
                            "birthDate": "1983-08-22",
                            "wedding": "10-Dec",
                            "panNo": "BCDEF2345G",
                            "adharNo": "876543210987",
                            "mobileNo": "9825234567",
                            "phNoR": "0261223344",
                            "email": "dr.snehal@hospital.com",
                            "consultationFee": 600,
                            "followupFee": 350,
                            "clinicName": "Mahale Healthcare & Clinic",
                            "address": "Ring Road, Near Civil Hospital",
                            "area": "Majura Gate",
                            "city": "SURAT",
                            "pin": "395002",
                            "state": "GUJARAT",
                            "country": "INDIA",
                            "clinicPhNo": "0261224455",
                            "status": "active"
                        },
                        {
                            "id": "DR-103",
                            "drHosRef": "Reference Doctor",
                            "drType": "Reference Doctor",
                            "title": "Dr.",
                            "drName": "Mandar Nadkarni",
                            "degree": "MS, M.Ch (Oncology)",
                            "speciality": "Surgical Oncology",
                            "department": "Oncology",
                            "drRegNo": "M-45120",
                            "hospitalName": False,
                            "birthDate": "1975-11-19",
                            "wedding": "24-Dec",
                            "panNo": "CDEFG3456H",
                            "adharNo": "765432109876",
                            "mobileNo": "9820011223",
                            "phNoR": "0222411223",
                            "email": "mandar.nadkarni@oncocare.in",
                            "consultationFee": 800,
                            "followupFee": 400,
                            "clinicName": "Nadkarni Speciality Clinic",
                            "address": "Ghod Dod Road, Opp. City Mall",
                            "area": "Athwa",
                            "city": "SURAT",
                            "pin": "395007",
                            "state": "GUJARAT",
                            "country": "INDIA",
                            "clinicPhNo": "0261266554",
                            "status": "active"
                        },
                        {
                            "id": "DR-104",
                            "drHosRef": "Hospital Doctor",
                            "drType": "Cardiologist",
                            "title": "Dr.",
                            "drName": "Amit Desai",
                            "degree": "MD, DM (Cardiology)",
                            "speciality": "Cardiology",
                            "department": "Cardiology",
                            "drRegNo": "G-31204",
                            "hospitalName": True,
                            "birthDate": "1982-03-11",
                            "wedding": "15-Feb",
                            "panNo": "DEFGH4567I",
                            "adharNo": "654321098765",
                            "mobileNo": "9898123456",
                            "phNoR": "0261255667",
                            "email": "dr.amit.desai@heartcare.org",
                            "consultationFee": 700,
                            "followupFee": 400,
                            "clinicName": "Surat Heart Care Centre",
                            "address": "Ring Road, Surat",
                            "area": "Khatodara",
                            "city": "SURAT",
                            "pin": "395002",
                            "state": "GUJARAT",
                            "country": "INDIA",
                            "clinicPhNo": "0261277889",
                            "status": "active"
                        },
                        {
                            "id": "DR-105",
                            "drHosRef": "Hospital Doctor",
                            "drType": "Radiologist",
                            "title": "Dr.",
                            "drName": "Pooja Mehta",
                            "degree": "MBBS, DMRD",
                            "speciality": "Radiology & Sonography",
                            "department": "Radiology",
                            "drRegNo": "G-34567",
                            "hospitalName": True,
                            "birthDate": "1988-07-04",
                            "wedding": "20-Jan",
                            "panNo": "EFGHI5678J",
                            "adharNo": "543210987654",
                            "mobileNo": "9879012345",
                            "phNoR": "0261244556",
                            "email": "dr.pooja.mehta@hospital.com",
                            "consultationFee": 500,
                            "followupFee": 300,
                            "clinicName": "Precision Diagnostic Imaging",
                            "address": "Vesu Main Road",
                            "area": "Vesu",
                            "city": "SURAT",
                            "pin": "395007",
                            "state": "GUJARAT",
                            "country": "INDIA",
                            "clinicPhNo": "0261299887",
                            "status": "active"
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
                        return {"doctors": []}
                    data = json.loads(content)
                    if not isinstance(data, dict) or "doctors" not in data or not isinstance(data["doctors"], list):
                        raise DoctorStorageError("Invalid doctor master schema: missing 'doctors' list key.")
                    return data
            except json.JSONDecodeError as exc:
                raise DoctorStorageError(f"Corrupted doctors.json file: {str(exc)}") from exc
            except IOError as exc:
                raise DoctorStorageError(f"I/O error reading doctor master: {str(exc)}") from exc

    def _write_atomically(self, data: Dict[str, Any]) -> None:
        """Atomically write JSON data using temp file rename."""
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
                raise DoctorStorageError(f"Failed atomic write to doctor master: {str(exc)}") from exc

    def generate_next_id(self) -> str:
        """Generate the next sequential Doctor ID (e.g. DR-106)."""
        data = self._read_data()
        doctors = data.get("doctors", [])
        max_num = 100
        for doc in doctors:
            doc_id = str(doc.get("id", "")).strip()
            if doc_id.startswith("DR-"):
                try:
                    num = int(doc_id.replace("DR-", ""))
                    if num > max_num:
                        max_num = num
                except ValueError:
                    continue
            elif doc_id.isdigit():
                try:
                    num = int(doc_id)
                    if num > max_num:
                        max_num = num
                except ValueError:
                    continue
        return f"DR-{max_num + 1}"

    def get_all(self, active_only: bool = False, query: Optional[str] = None, speciality: Optional[str] = None, department: Optional[str] = None) -> List[Dict[str, Any]]:
        """Return all doctor records with optional filters."""
        data = self._read_data()
        doctors = data.get("doctors", [])

        if active_only:
            doctors = [d for d in doctors if d.get("status", "active") == "active"]

        if speciality and speciality != "All":
            doctors = [d for d in doctors if d.get("speciality", "").lower() == speciality.lower()]

        if department and department != "All":
            doctors = [d for d in doctors if d.get("department", "").lower() == department.lower()]

        if query:
            q = query.strip().lower()
            filtered = []
            for d in doctors:
                name = f"{d.get('title', '')} {d.get('drName', '')}".lower()
                doc_id = str(d.get("id", "")).lower()
                reg_no = str(d.get("drRegNo", "")).lower()
                mobile = str(d.get("mobileNo", "")).lower()
                spec = str(d.get("speciality", "")).lower()
                dept = str(d.get("department", "")).lower()
                if (q in name or q in doc_id or q in reg_no or q in mobile or q in spec or q in dept):
                    filtered.append(d)
            doctors = filtered

        return doctors

    def get_by_id(self, doctor_id: str) -> Optional[Dict[str, Any]]:
        """Find a doctor record by ID."""
        clean_id = str(doctor_id).strip().lower()
        doctors = self._read_data().get("doctors", [])
        for doc in doctors:
            if str(doc.get("id", "")).strip().lower() == clean_id:
                return doc
        return None

    def create(self, doctor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new doctor record with a unique ID."""
        with self._lock:
            data = self._read_data()
            doctors = data.get("doctors", [])

            if not doctor_data.get("id"):
                doctor_data["id"] = self.generate_next_id()
            else:
                existing = self.get_by_id(doctor_data["id"])
                if existing:
                    raise DoctorStorageError(f"Doctor with ID '{doctor_data['id']}' already exists.")

            # Default status
            if "status" not in doctor_data:
                doctor_data["status"] = "active"

            doctors.append(doctor_data)
            data["doctors"] = doctors
            self._write_atomically(data)
            return doctor_data

    def update(self, doctor_id: str, updated_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing doctor record."""
        with self._lock:
            clean_id = str(doctor_id).strip().lower()
            data = self._read_data()
            doctors = data.get("doctors", [])

            index = -1
            for i, doc in enumerate(doctors):
                if str(doc.get("id", "")).strip().lower() == clean_id:
                    index = i
                    break

            if index == -1:
                raise DoctorStorageError(f"Doctor with ID '{doctor_id}' not found.")

            # Preserve ID and merge
            merged = {**doctors[index], **updated_data, "id": doctors[index]["id"]}
            doctors[index] = merged
            data["doctors"] = doctors
            self._write_atomically(data)
            return merged

    def delete_or_deactivate(self, doctor_id: str, force_delete: bool = False) -> Dict[str, Any]:
        """
        Delete or deactivate doctor.
        If force_delete is False, marks status as 'inactive' to preserve clinical history.
        """
        with self._lock:
            clean_id = str(doctor_id).strip().lower()
            data = self._read_data()
            doctors = data.get("doctors", [])

            index = -1
            for i, doc in enumerate(doctors):
                if str(doc.get("id", "")).strip().lower() == clean_id:
                    index = i
                    break

            if index == -1:
                raise DoctorStorageError(f"Doctor with ID '{doctor_id}' not found.")

            target = doctors[index]

            if force_delete:
                deleted = doctors.pop(index)
                data["doctors"] = doctors
                self._write_atomically(data)
                return {"success": True, "action": "deleted", "doctor": deleted}
            else:
                target["status"] = "inactive"
                doctors[index] = target
                data["doctors"] = doctors
                self._write_atomically(data)
                return {"success": True, "action": "deactivated", "doctor": target}


doctor_storage = DoctorJSONStorage()

