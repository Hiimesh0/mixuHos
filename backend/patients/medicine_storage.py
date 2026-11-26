"""
Thread-safe, atomic JSON storage for Medicine Master.
Manages medicines.json in backend/data.
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
MEDICINES_FILE = DATA_DIR / "medicines.json"


class MedicineStorageError(Exception):
    """Custom exception raised for Medicine Master JSON storage errors."""
    pass


class MedicineJSONStorage:
    """
    Thread-safe, atomic, and inter-process-safe JSON storage for medicine master records.
    Authoritative source for pharmacy and prescription workflows.
    """

    def __init__(self, file_path: Path = MEDICINES_FILE):
        self.file_path = file_path
        self.data_dir = self.file_path.parent
        self._lock = InterProcessFileLock(self.file_path)
        self._ensure_storage()

    def _ensure_storage(self) -> None:
        """Create parent directory and initialize default medicines if missing."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            if not self.file_path.exists():
                default_data = {
                    "medicines": [
                        {
                            "id": "MED-1001",
                            "brandName": "Paracetamol 650 (Dolo)",
                            "genericName": "Paracetamol / Acetaminophen",
                            "medicineGroup": "Analgesics & Antipyretics",
                            "dosageForm": "Tablet",
                            "strength": "650 mg",
                            "frequency": "1-0-1",
                            "availability": "In Stock",
                            "remark1": "Take after food",
                            "remark2": "For mild to moderate pain & fever",
                            "totalDays": 5,
                            "notes": "Monitor liver function if taken long-term",
                            "forPatient": "Both",
                            "unit": "Strip (15 Tabs)",
                            "manufacturer": "Micro Labs Ltd",
                            "batchNo": "DL-2026-A1",
                            "expiryDate": "2028-12-31",
                            "purchasePrice": 22.50,
                            "sellingPrice": 35.00,
                            "stockQty": 500,
                            "reorderLevel": 100,
                            "gst": 12.0,
                            "status": "active"
                        },
                        {
                            "id": "MED-1002",
                            "brandName": "Augmentin 625 Duo",
                            "genericName": "Amoxicillin and Potassium Clavulanate",
                            "medicineGroup": "Antibiotics",
                            "dosageForm": "Tablet",
                            "strength": "500 mg + 125 mg",
                            "frequency": "1-0-1",
                            "availability": "In Stock",
                            "remark1": "Complete full course as prescribed",
                            "remark2": "Take with meals to reduce GI upset",
                            "totalDays": 7,
                            "notes": "Broad-spectrum antibacterial therapy",
                            "forPatient": "Both",
                            "unit": "Strip (10 Tabs)",
                            "manufacturer": "GlaxoSmithKline",
                            "batchNo": "AG-88912",
                            "expiryDate": "2027-10-31",
                            "purchasePrice": 145.00,
                            "sellingPrice": 205.00,
                            "stockQty": 250,
                            "reorderLevel": 50,
                            "gst": 12.0,
                            "status": "active"
                        },
                        {
                            "id": "MED-1003",
                            "brandName": "Pan 40",
                            "genericName": "Pantoprazole Gastro-resistant",
                            "medicineGroup": "Gastrointestinal (Antacids)",
                            "dosageForm": "Tablet",
                            "strength": "40 mg",
                            "frequency": "1-0-0 (Morning Empty Stomach)",
                            "availability": "In Stock",
                            "remark1": "Take 30 mins before breakfast",
                            "remark2": "For GERD & acid peptic disease",
                            "totalDays": 14,
                            "notes": "Proton pump inhibitor (PPI)",
                            "forPatient": "Both",
                            "unit": "Strip (15 Tabs)",
                            "manufacturer": "Alkem Laboratories",
                            "batchNo": "PN-4402B",
                            "expiryDate": "2028-06-30",
                            "purchasePrice": 95.00,
                            "sellingPrice": 140.00,
                            "stockQty": 400,
                            "reorderLevel": 80,
                            "gst": 12.0,
                            "status": "active"
                        },
                        {
                            "id": "MED-1004",
                            "brandName": "Azithral 500",
                            "genericName": "Azithromycin Dihydrate",
                            "medicineGroup": "Antibiotics (Macrolide)",
                            "dosageForm": "Tablet",
                            "strength": "500 mg",
                            "frequency": "0-0-1 (Once Daily)",
                            "availability": "In Stock",
                            "remark1": "Take 1 hour before or 2 hours after meals",
                            "remark2": "Respiratory tract infections",
                            "totalDays": 3,
                            "notes": "Short course macrolide antibiotic",
                            "forPatient": "Both",
                            "unit": "Strip (5 Tabs)",
                            "manufacturer": "Alembic Pharmaceuticals",
                            "batchNo": "AZ-5011C",
                            "expiryDate": "2027-08-31",
                            "purchasePrice": 68.00,
                            "sellingPrice": 115.00,
                            "stockQty": 180,
                            "reorderLevel": 40,
                            "gst": 12.0,
                            "status": "active"
                        },
                        {
                            "id": "MED-1005",
                            "brandName": "Zzzvicryl 1 Nw2347",
                            "genericName": "Polyglactin 910 Braided Absorbable Suture",
                            "medicineGroup": "Surgical Consumables & Sutures",
                            "dosageForm": "Surgical Suture",
                            "strength": "Size 1, 90cm violet",
                            "frequency": "Single Use / Intra-op",
                            "availability": "In Stock",
                            "remark1": "Sterile surgical suture with needle",
                            "remark2": "General soft tissue approximation",
                            "totalDays": 1,
                            "notes": "Absorbable synthetic surgical suture",
                            "forPatient": "Both",
                            "unit": "Box (12 Foils)",
                            "manufacturer": "Ethicon (Johnson & Johnson)",
                            "batchNo": "NW-2347-9X",
                            "expiryDate": "2029-03-31",
                            "purchasePrice": 2200.00,
                            "sellingPrice": 2950.00,
                            "stockQty": 45,
                            "reorderLevel": 15,
                            "gst": 18.0,
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
                        return {"medicines": []}
                    data = json.loads(content)
                    if not isinstance(data, dict) or "medicines" not in data or not isinstance(data["medicines"], list):
                        raise MedicineStorageError("Invalid medicine master schema: missing 'medicines' list key.")
                    return data
            except json.JSONDecodeError as exc:
                raise MedicineStorageError(f"Corrupted medicines.json file: {str(exc)}") from exc
            except IOError as exc:
                raise MedicineStorageError(f"I/O error reading medicine master: {str(exc)}") from exc

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
                raise MedicineStorageError(f"Failed atomic write to medicine master: {str(exc)}") from exc

    def generate_next_id(self) -> str:
        """Generate the next sequential Medicine ID (e.g. MED-1006)."""
        data = self._read_data()
        medicines = data.get("medicines", [])
        max_num = 1000
        for med in medicines:
            med_id = str(med.get("id", "")).strip()
            if med_id.startswith("MED-"):
                try:
                    num = int(med_id.replace("MED-", ""))
                    if num > max_num:
                        max_num = num
                except ValueError:
                    continue
            elif med_id.isdigit():
                try:
                    num = int(med_id)
                    if num > max_num:
                        max_num = num
                except ValueError:
                    continue
        return f"MED-{max_num + 1}"

    def get_all(self, active_only: bool = False, query: Optional[str] = None, group: Optional[str] = None, dosage_form: Optional[str] = None) -> List[Dict[str, Any]]:
        """Return all medicine records with optional filters."""
        data = self._read_data()
        medicines = data.get("medicines", [])

        if active_only:
            medicines = [m for m in medicines if m.get("status", "active") == "active"]

        if group and group != "All":
            medicines = [m for m in medicines if m.get("medicineGroup", "").lower() == group.lower()]

        if dosage_form and dosage_form != "All":
            medicines = [m for m in medicines if m.get("dosageForm", "").lower() == dosage_form.lower()]

        if query:
            q = query.strip().lower()
            filtered = []
            for m in medicines:
                brand = str(m.get("brandName", "")).lower()
                generic = str(m.get("genericName", "")).lower()
                med_id = str(m.get("id", "")).lower()
                grp = str(m.get("medicineGroup", "")).lower()
                dosage = str(m.get("dosageForm", "")).lower()
                batch = str(m.get("batchNo", "")).lower()
                if (q in brand or q in generic or q in med_id or q in grp or q in dosage or q in batch):
                    filtered.append(m)
            medicines = filtered

        return medicines

    def get_by_id(self, medicine_id: str) -> Optional[Dict[str, Any]]:
        """Find a medicine record by ID."""
        clean_id = str(medicine_id).strip().lower()
        medicines = self._read_data().get("medicines", [])
        for med in medicines:
            if str(med.get("id", "")).strip().lower() == clean_id:
                return med
        return None

    def create(self, medicine_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new medicine record with a unique ID."""
        with self._lock:
            data = self._read_data()
            medicines = data.get("medicines", [])

            if not medicine_data.get("id"):
                medicine_data["id"] = self.generate_next_id()
            else:
                existing = self.get_by_id(medicine_data["id"])
                if existing:
                    raise MedicineStorageError(f"Medicine with ID '{medicine_data['id']}' already exists.")

            if "status" not in medicine_data:
                medicine_data["status"] = "active"

            medicines.append(medicine_data)
            data["medicines"] = medicines
            self._write_atomically(data)
            return medicine_data

    def update(self, medicine_id: str, updated_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing medicine record."""
        with self._lock:
            clean_id = str(medicine_id).strip().lower()
            data = self._read_data()
            medicines = data.get("medicines", [])

            index = -1
            for i, med in enumerate(medicines):
                if str(med.get("id", "")).strip().lower() == clean_id:
                    index = i
                    break

            if index == -1:
                raise MedicineStorageError(f"Medicine with ID '{medicine_id}' not found.")

            merged = {**medicines[index], **updated_data, "id": medicines[index]["id"]}
            medicines[index] = merged
            data["medicines"] = medicines
            self._write_atomically(data)
            return merged

    def delete_or_deactivate(self, medicine_id: str, force_delete: bool = False) -> Dict[str, Any]:
        """
        Delete or deactivate medicine.
        If force_delete is False, marks status as 'inactive' to preserve prescription and billing history.
        """
        with self._lock:
            clean_id = str(medicine_id).strip().lower()
            data = self._read_data()
            medicines = data.get("medicines", [])

            index = -1
            for i, med in enumerate(medicines):
                if str(med.get("id", "")).strip().lower() == clean_id:
                    index = i
                    break

            if index == -1:
                raise MedicineStorageError(f"Medicine with ID '{medicine_id}' not found.")

            target = medicines[index]

            if force_delete:
                deleted = medicines.pop(index)
                data["medicines"] = medicines
                self._write_atomically(data)
                return {"success": True, "action": "deleted", "medicine": deleted}
            else:
                target["status"] = "inactive"
                medicines[index] = target
                data["medicines"] = medicines
                self._write_atomically(data)
                return {"success": True, "action": "deactivated", "medicine": target}


medicine_storage = MedicineJSONStorage()

