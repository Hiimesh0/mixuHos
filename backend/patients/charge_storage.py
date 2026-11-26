"""
Thread-safe, atomic JSON storage for Hospital Charge Master configuration.
Provides authoritative charge types and amounts for patient billing.
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
CHARGE_MASTER_FILE = DATA_DIR / "charge_master.json"


class ChargeStorageError(Exception):
    """Custom exception raised for Charge Master JSON storage errors."""
    pass


class ChargeJSONStorage:
    """
    Thread-safe, atomic, and inter-process-safe JSON storage for hospital charges.
    Ensures backend is authoritative for charge amounts and details.
    """

    def __init__(self, file_path: Path = CHARGE_MASTER_FILE):
        self.file_path = file_path
        self.data_dir = self.file_path.parent
        self._lock = InterProcessFileLock(self.file_path)
        self._ensure_storage()

    def _ensure_storage(self) -> None:
        """Create parent directory and initialize default charges if missing."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            if not self.file_path.exists():
                default_data = {
                    "charges": [
                        {"id": "CHG-001", "name": "Consultation Charge", "amount": 500, "active": True},
                        {"id": "CHG-002", "name": "Registration Charge", "amount": 100, "active": True},
                        {"id": "CHG-003", "name": "Follow-up Charge", "amount": 300, "active": True},
                        {"id": "CHG-004", "name": "Emergency / Casualty Charge", "amount": 750, "active": True},
                        {"id": "CHG-005", "name": "ECG / Diagnostic Procedure", "amount": 350, "active": True},
                        {"id": "CHG-006", "name": "Dressing / Nursing Charge", "amount": 200, "active": True},
                        {"id": "CHG-007", "name": "Injection / Administration Charge", "amount": 150, "active": True},
                        {"id": "CHG-008", "name": "Minor Surgical Procedure", "amount": 1200, "active": True},
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
                        return {"charges": []}
                    data = json.loads(content)
                    if not isinstance(data, dict) or "charges" not in data or not isinstance(data["charges"], list):
                        raise ChargeStorageError("Invalid charge master schema: missing 'charges' list key.")
                    return data
            except json.JSONDecodeError as exc:
                raise ChargeStorageError(f"Corrupted charge_master.json file: {str(exc)}") from exc
            except IOError as exc:
                raise ChargeStorageError(f"I/O error reading charge master: {str(exc)}") from exc

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
                raise ChargeStorageError(f"Failed atomic write to charge master: {str(exc)}") from exc

    def get_all(self, active_only: bool = True) -> List[Dict[str, Any]]:
        """Return all charge types, optionally filtering to active ones."""
        data = self._read_data()
        charges = data.get("charges", [])
        if active_only:
            return [c for c in charges if c.get("active", True)]
        return charges

    def get_by_id(self, charge_id: str) -> Optional[Dict[str, Any]]:
        """Find a charge by ID."""
        clean_id = (charge_id or "").strip().lower()
        if not clean_id:
            return None
        for c in self.get_all(active_only=False):
            if str(c.get("id") or "").strip().lower() == clean_id:
                return c
        return None

    def get_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """Find a charge by exact or normalized name."""
        clean_name = (name or "").strip().lower()
        if not clean_name:
            return None
        for c in self.get_all(active_only=False):
            if str(c.get("name") or "").strip().lower() == clean_name:
                return c
        return None

    def validate_and_resolve_item(self, item: Dict[str, Any], index: int = 1) -> Dict[str, Any]:
        """
        Validate and resolve a bill item against authoritative charge master.
        If a recognized charge type is passed, the backend enforces the configured authoritative amount.
        Prevents negative rates and non-numeric values.
        """
        details = str(item.get("details") or item.get("name") or f"Service #{index}").strip()
        charge_id = str(item.get("chargeId") or item.get("id") or "").strip()

        # Check by ID first, then by name
        matched_charge = None
        if charge_id:
            matched_charge = self.get_by_id(charge_id)
        if not matched_charge and details:
            matched_charge = self.get_by_name(details)

        if matched_charge:
            # Enforce authoritative name and configured amount
            authoritative_name = matched_charge.get("name") or details
            authoritative_rate = round(float(matched_charge.get("amount", 0.0)), 2)
            return {
                "srNo": index,
                "details": authoritative_name,
                "rate": authoritative_rate,
                "amount": authoritative_rate,
            }

        # Otherwise validate client provided numeric rate
        try:
            raw_rate = float(item.get("rate") if item.get("rate") is not None else item.get("amount", 0.0))
        except (ValueError, TypeError):
            raw_rate = 0.0

        if raw_rate < 0:
            raw_rate = 0.0

        clean_rate = round(raw_rate, 2)
        return {
            "srNo": index,
            "details": details or f"Service #{index}",
            "rate": clean_rate,
            "amount": clean_rate,
        }


charge_storage = ChargeJSONStorage()

