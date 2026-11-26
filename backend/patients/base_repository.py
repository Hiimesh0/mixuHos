"""
Base JSON Repository for Hospital EMR Data Access Layer.
Separates API Endpoints and Business Logic from underlying Storage implementation.
Implements the Repository Pattern so that replacing JSON with MySQL / PostgreSQL later
requires modifying only this repository layer without altering frontend contracts or business logic.
Guarantees inter-process file locking, atomic writes, typed attributes, and relational validation.
"""

import os
import json
import uuid
import tempfile
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional, Callable

from .file_lock import InterProcessFileLock

# Indian Standard Time (IST: UTC+5:30) helper for hospital records
IST = timezone(timedelta(hours=5, minutes=30))


def now_ist_iso() -> str:
    """Return current timestamp in ISO 8601 format with timezone offset."""
    return datetime.now(IST).isoformat(timespec='seconds')


class RepositoryError(Exception):
    """Base exception for all repository data access errors."""
    pass


class RecordNotFoundError(RepositoryError):
    """Raised when a requested record does not exist."""
    pass


class ValidationError(RepositoryError):
    """Raised when a record fails schema or relational constraint validation."""
    pass


class BaseJSONRepository:
    """
    Generic Abstract Repository for JSON-persisted relational entities.
    Provides atomic CRUD, search, filter, foreign-key checks, and sequence tracking.
    """

    def __init__(
        self,
        file_path: Path,
        entity_name: str,
        id_prefix: str,
        root_key: str = "items",
        default_seed_data: Optional[List[Dict[str, Any]]] = None,
    ):
        self.file_path = Path(file_path)
        self.entity_name = entity_name
        self.id_prefix = id_prefix
        self.root_key = root_key
        self.default_seed_data = default_seed_data or []
        self.data_dir = self.file_path.parent
        self._lock = InterProcessFileLock(self.file_path)
        self._ensure_storage()

    def _ensure_storage(self) -> None:
        """Create storage directory and initialize JSON structure if missing."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            if not self.file_path.exists():
                initial_payload = {
                    "entity": self.entity_name,
                    "last_sequence": len(self.default_seed_data),
                    "created_at": now_ist_iso(),
                    "updated_at": now_ist_iso(),
                    self.root_key: self.default_seed_data,
                }
                self._write_atomically(initial_payload)

    def _read_data(self) -> Dict[str, Any]:
        """Read and parse the JSON file under lock."""
        with self._lock:
            if not self.file_path.exists():
                self._ensure_storage()

            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if not content:
                        return {self.root_key: [], "last_sequence": 0}
                    data = json.loads(content)
                    if not isinstance(data, dict):
                        return {self.root_key: [], "last_sequence": 0}
                    if self.root_key not in data or not isinstance(data[self.root_key], list):
                        data[self.root_key] = []
                    return data
            except (json.JSONDecodeError, IOError) as exc:
                raise RepositoryError(f"Failed to read {self.entity_name} storage: {str(exc)}") from exc

    def _write_atomically(self, data: Dict[str, Any]) -> None:
        """Atomically overwrite file via NamedTemporaryFile and os.replace."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            data["updated_at"] = now_ist_iso()
            temp_path = None
            try:
                with tempfile.NamedTemporaryFile("w", dir=str(self.data_dir), delete=False, encoding="utf-8") as tf:
                    json.dump(data, tf, indent=2, ensure_ascii=False)
                    temp_path = tf.name

                os.replace(temp_path, str(self.file_path))
            except Exception as exc:
                if temp_path and os.path.exists(temp_path):
                    try:
                        os.remove(temp_path)
                    except OSError:
                        pass
                raise RepositoryError(f"Failed atomic write to {self.entity_name}: {str(exc)}") from exc

    def _next_id(self, data: Dict[str, Any]) -> str:
        """Generate predictable sequential identifier: PREFIX-000001, PREFIX-000002..."""
        items = data.get(self.root_key, [])
        max_num = int(data.get("last_sequence", 0) or 0)
        for it in items:
            raw_id = str(it.get("id") or "").strip()
            if "-" in raw_id:
                parts = raw_id.split("-")
                try:
                    num = int(parts[-1])
                    if num > max_num:
                        max_num = num
                except ValueError:
                    pass
        seq = max_num + 1
        data["last_sequence"] = seq
        return f"{self.id_prefix}-{seq:06d}"

    def get_all(self, active_only: bool = False) -> List[Dict[str, Any]]:
        """Retrieve all records in the repository."""
        data = self._read_data()
        items = data.get(self.root_key, [])
        if active_only:
            return [it for it in items if it.get("is_active", it.get("active", True))]
        return list(items)

    def get_by_id(self, record_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single record by its primary ID (case-insensitive)."""
        if not record_id:
            return None
        clean_id = str(record_id).strip().lower()
        items = self.get_all(active_only=False)
        for item in items:
            if str(item.get("id") or "").strip().lower() == clean_id:
                return item
            # Support lookup by secondary key (e.g. code or uhid)
            if str(item.get("code") or "").strip().lower() == clean_id:
                return item
            if str(item.get("uhid") or "").strip().lower() == clean_id:
                return item
        return None

    def create(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """Create and persist a new typed record with ID and timestamps."""
        with self._lock:
            data = self._read_data()
            items = data.get(self.root_key, [])

            # Assign primary ID if not provided
            clean_record = dict(record)
            if not clean_record.get("id"):
                clean_record["id"] = self._next_id(data)

            # Prevent duplicate primary ID
            existing_ids = {str(it.get("id") or "").strip().lower() for it in items}
            if str(clean_record["id"]).strip().lower() in existing_ids:
                raise ValidationError(f"Record with ID '{clean_record['id']}' already exists.")

            # Attach timestamps and default active status
            timestamp = now_ist_iso()
            clean_record.setdefault("created_at", timestamp)
            clean_record["updated_at"] = timestamp
            if "is_active" not in clean_record and "active" not in clean_record:
                clean_record["is_active"] = True

            self.validate(clean_record)

            items.append(clean_record)
            data[self.root_key] = items
            self._write_atomically(data)
            return clean_record

    def update(self, record_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing record by ID."""
        with self._lock:
            data = self._read_data()
            items = data.get(self.root_key, [])
            clean_id = str(record_id).strip().lower()

            target_index = -1
            for idx, item in enumerate(items):
                if str(item.get("id") or "").strip().lower() == clean_id:
                    target_index = idx
                    break

            if target_index == -1:
                raise RecordNotFoundError(f"{self.entity_name} with ID '{record_id}' not found.")

            current = items[target_index]
            # Preserve created_at and id
            immutable_id = current.get("id", record_id)
            immutable_created = current.get("created_at")

            merged = {**current, **updates}
            merged["id"] = immutable_id
            if immutable_created:
                merged["created_at"] = immutable_created
            merged["updated_at"] = now_ist_iso()

            self.validate(merged)

            items[target_index] = merged
            data[self.root_key] = items
            self._write_atomically(data)
            return merged

    def delete(self, record_id: str, hard: bool = False) -> bool:
        """
        Delete a record.
        By default performs a soft delete by setting is_active = False.
        If hard=True, removes record from array.
        """
        with self._lock:
            data = self._read_data()
            items = data.get(self.root_key, [])
            clean_id = str(record_id).strip().lower()

            target_index = -1
            for idx, item in enumerate(items):
                if str(item.get("id") or "").strip().lower() == clean_id:
                    target_index = idx
                    break

            if target_index == -1:
                raise RecordNotFoundError(f"{self.entity_name} with ID '{record_id}' not found.")

            if hard:
                items.pop(target_index)
            else:
                items[target_index]["is_active"] = False
                items[target_index]["updated_at"] = now_ist_iso()

            data[self.root_key] = items
            self._write_atomically(data)
            return True

    def search(self, query: str, fields: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """Perform case-insensitive search across specified or all text fields."""
        if not query or not str(query).strip():
            return self.get_all(active_only=False)

        terms = str(query).strip().lower().split()
        items = self.get_all(active_only=False)
        results = []

        for item in items:
            haystack = []
            if fields:
                for f in fields:
                    v = item.get(f)
                    if v is not None:
                        haystack.append(str(v).lower())
            else:
                for k, v in item.items():
                    if isinstance(v, (str, int, float, bool)):
                        haystack.append(str(v).lower())

            full_text = " ".join(haystack)
            if all(t in full_text for t in terms):
                results.append(item)

        return results

    def filter(self, **kwargs) -> List[Dict[str, Any]]:
        """Filter records by matching key-value pairs."""
        items = self.get_all(active_only=False)
        results = []
        for item in items:
            match = True
            for k, expected in kwargs.items():
                actual = item.get(k)
                if expected is None and actual is not None:
                    match = False
                    break
                if expected is not None:
                    if str(actual or "").strip().lower() != str(expected).strip().lower():
                        match = False
                        break
            if match:
                results.append(item)
        return results

    def validate(self, record: Dict[str, Any]) -> None:
        """
        Subclasses override this method to enforce relational constraints,
        required fields, and type bounds.
        """
        pass
