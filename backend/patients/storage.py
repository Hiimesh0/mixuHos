import os
import json
import uuid
import threading
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional
from .file_lock import InterProcessFileLock

# Base directory for backend data
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
PATIENTS_FILE = DATA_DIR / "patients.json"


class StorageError(Exception):
    """Custom exception raised for JSON storage errors."""
    pass


class PatientJSONStorage:
    """
    Thread-safe and inter-process-safe atomic JSON-file storage for Patient records.
    Protects multi-worker deployments (Gunicorn, uWSGI) from concurrent file overwrites
    using OS-level file locking and atomic replace.
    """

    def __init__(self, file_path: Path = PATIENTS_FILE):
        self.file_path = file_path
        self.data_dir = self.file_path.parent
        self._lock = InterProcessFileLock(self.file_path)
        self._ensure_storage()

    def _ensure_storage(self) -> None:
        """Create parent directory and initialize empty JSON storage if file does not exist."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            if not self.file_path.exists():
                initial_payload = {"patients": []}
                self._write_atomically(initial_payload)

    def _read_data(self) -> Dict[str, Any]:
        """
        Read data safely from the JSON file.
        Raises StorageError if file is corrupted or inaccessible without overwriting it.
        """
        with self._lock:
            if not self.file_path.exists():
                self._ensure_storage()

            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if not content:
                        return {"patients": []}
                    data = json.loads(content)
                    if not isinstance(data, dict) or "patients" not in data or not isinstance(data["patients"], list):
                        raise StorageError("Invalid storage schema: missing 'patients' list key.")
                    return data
            except json.JSONDecodeError as exc:
                raise StorageError(f"Corrupted patients.json storage file: {str(exc)}") from exc
            except IOError as exc:
                raise StorageError(f"I/O error reading patients storage: {str(exc)}") from exc

    def _write_atomically(self, data: Dict[str, Any]) -> None:
        """
        Atomically write JSON data using a temporary file in the same directory,
        followed by an atomic rename/replace.
        """
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            temp_file = None
            try:
                # Create temp file in same filesystem directory for atomic os.replace
                with tempfile.NamedTemporaryFile("w", dir=str(self.data_dir), delete=False, encoding="utf-8") as tf:
                    json.dump(data, tf, indent=2, ensure_ascii=False)
                    temp_file = tf.name

                # Atomic rename
                os.replace(temp_file, str(self.file_path))
            except Exception as exc:
                if temp_file and os.path.exists(temp_file):
                    try:
                        os.remove(temp_file)
                    except OSError:
                        pass
                raise StorageError(f"Failed atomic write to patients storage: {str(exc)}") from exc

    def generate_next_uhid(self, existing_patients: List[Dict[str, Any]]) -> str:
        """
        Generate a unique and sequential UHID format: UHID-1001, UHID-1002, etc.
        Detects max numeric suffix among existing UHIDs to prevent collisions.
        """
        max_num = 1000
        for p in existing_patients:
            uhid_val = p.get("uhid") or p.get("id") or ""
            if uhid_val.startswith("UHID-"):
                num_part = uhid_val.replace("UHID-", "")
                if num_part.isdigit():
                    val = int(num_part)
                    if val > max_num:
                        max_num = val
        return f"UHID-{max_num + 1}"

    def get_all(
        self,
        search: Optional[str] = None,
        gender: Optional[str] = None,
        category: Optional[str] = None,
        doctor: Optional[str] = None,
        city: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Retrieve patients with optional search and filters."""
        data = self._read_data()
        patients = data.get("patients", [])

        filtered = patients

        if search:
            q = search.lower().strip()
            filtered = [
                p for p in filtered
                if (
                    q in (p.get("uhid") or "").lower()
                    or q in (p.get("firstName") or "").lower()
                    or q in (p.get("middleName") or "").lower()
                    or q in (p.get("lastName") or "").lower()
                    or q in f"{p.get('firstName', '')} {p.get('lastName', '')}".lower()
                    or q in (p.get("mobile") or "")
                    or q in (p.get("email") or "").lower()
                    or q in (p.get("city") or "").lower()
                    or q in (p.get("hospitalDoctor") or "").lower()
                )
            ]

        if gender and gender.lower() != "all":
            g_target = gender.lower()
            filtered = [p for p in filtered if (p.get("sex") or "").lower() == g_target]

        if category and category.lower() != "all":
            cat_target = category.lower()
            filtered = [p for p in filtered if (p.get("category") or "").lower() == cat_target]

        if doctor and doctor.lower() != "all":
            doc_target = doctor.lower()
            filtered = [p for p in filtered if (p.get("hospitalDoctor") or "").lower() == doc_target]

        if city and city.lower() != "all":
            city_target = city.lower()
            filtered = [p for p in filtered if (p.get("city") or "").lower() == city_target]

        return filtered

    def get_by_id(self, patient_id: str) -> Optional[Dict[str, Any]]:
        """Find a patient by id or uhid."""
        data = self._read_data()
        clean_id = patient_id.strip()
        for p in data.get("patients", []):
            if p.get("id") == clean_id or p.get("uhid") == clean_id:
                return p
        return None

    def create(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new patient record and write to JSON."""
        with self._lock:
            data = self._read_data()
            patients = data.get("patients", [])

            # Generate or validate unique UHID
            provided_uhid = patient_data.get("uhid", "").strip()
            if not provided_uhid or any(p.get("uhid") == provided_uhid for p in patients):
                new_uhid = self.generate_next_uhid(patients)
            else:
                new_uhid = provided_uhid

            now_iso = datetime.now(timezone.utc).isoformat()
            new_id = new_uhid

            record = {
                "id": new_id,
                "uhid": new_uhid,
                "category": patient_data.get("category", "NEW"),
                "firstName": patient_data.get("firstName", "").strip(),
                "middleName": patient_data.get("middleName", "").strip(),
                "lastName": patient_data.get("lastName", "").strip(),
                "birthDate": patient_data.get("birthDate", ""),
                "age": str(patient_data.get("age", "")).strip(),
                "ageUnit": patient_data.get("ageUnit", "Years"),
                "sex": patient_data.get("sex", "Male"),
                "hospitalDoctor": patient_data.get("hospitalDoctor", "").strip(),
                "referenceBy": patient_data.get("referenceBy", "").strip(),
                "religion": patient_data.get("religion", "Hindu"),
                "maritalStatus": patient_data.get("maritalStatus", ""),
                "weight": str(patient_data.get("weight", "")).strip(),
                "height": str(patient_data.get("height", "")).strip(),
                "mobile": str(patient_data.get("mobile", "")).strip(),
                "email": patient_data.get("email", "").strip(),
                "streetAddress": patient_data.get("streetAddress", "").strip(),
                "city": patient_data.get("city", "SURAT").strip(),
                "state": patient_data.get("state", "GUJARAT").strip(),
                "pinCode": str(patient_data.get("pinCode", "")).strip(),
                "autoSms": bool(patient_data.get("autoSms", True)),
                "estimate": str(patient_data.get("estimate", "")).strip(),
                "aadharNo": str(patient_data.get("aadharNo", "")).strip(),
                "panNo": str(patient_data.get("panNo", "")).strip(),
                "mediclaim": str(patient_data.get("mediclaim", "")).strip(),
                "membershipId": str(patient_data.get("membershipId", "")).strip(),
                "employeeId": str(patient_data.get("employeeId", "")).strip(),
                "companyName": str(patient_data.get("companyName", "")).strip(),
                "remark": str(patient_data.get("remark", "")).strip(),
                "createdAt": now_iso,
                "updatedAt": now_iso,
            }

            # Prepend newest record
            patients.insert(0, record)
            data["patients"] = patients
            self._write_atomically(data)
            return record

    def update(self, patient_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing patient record while preserving ID, UHID, and createdAt."""
        with self._lock:
            data = self._read_data()
            patients = data.get("patients", [])
            clean_id = patient_id.strip()

            target_idx = -1
            for idx, p in enumerate(patients):
                if p.get("id") == clean_id or p.get("uhid") == clean_id:
                    target_idx = idx
                    break

            if target_idx == -1:
                return None

            existing = patients[target_idx]
            now_iso = datetime.now(timezone.utc).isoformat()

            # Preserve critical identifier and timestamp fields
            record = dict(existing)
            for k, v in update_data.items():
                if k not in ["id", "uhid", "createdAt"]:
                    if isinstance(v, str):
                        record[k] = v.strip()
                    else:
                        record[k] = v

            record["updatedAt"] = now_iso
            patients[target_idx] = record
            data["patients"] = patients
            self._write_atomically(data)
            return record

    def delete(self, patient_id: str) -> bool:
        """Delete an existing patient record."""
        with self._lock:
            data = self._read_data()
            patients = data.get("patients", [])
            clean_id = patient_id.strip()

            target_idx = -1
            for idx, p in enumerate(patients):
                if p.get("id") == clean_id or p.get("uhid") == clean_id:
                    target_idx = idx
                    break

            if target_idx == -1:
                return False

            patients.pop(target_idx)
            data["patients"] = patients
            self._write_atomically(data)
            return True


# Global storage singleton
storage = PatientJSONStorage()
