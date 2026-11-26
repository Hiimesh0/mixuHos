import os
import re
import json
import uuid
import threading
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

from pathlib import Path
from typing import List, Dict, Any, Optional
from .file_lock import InterProcessFileLock

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
BILLS_FILE = DATA_DIR / "bills.json"


class BillStorageError(Exception):
    """Custom exception raised for Bill JSON storage errors."""
    pass


class BillJSONStorage:
    """
    Thread-safe, atomic, and inter-process-safe JSON storage for Patient Bills.
    Maintains persistent, sequential invoice numbers (e.g. OPD2627/6146, 6147, 6148...).
    Guarantees invoice sequence numbers NEVER restart, reset, or collide across server restarts,
    browser refreshes, logouts, or file updates.
    """

    def __init__(self, file_path: Path = BILLS_FILE):
        self.file_path = file_path
        self.data_dir = self.file_path.parent
        self._lock = InterProcessFileLock(self.file_path)
        self._ensure_storage()

    def _ensure_storage(self) -> None:
        """Create parent directory and initialize JSON storage if file does not exist or lacks schema."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            if not self.file_path.exists():
                initial_payload = {
                    "last_invoice_seq": 6145,
                    "bills": [],
                }
                self._write_atomically(initial_payload)
            else:
                # Ensure existing file has last_invoice_seq initialized
                try:
                    data = self._read_data()
                    if "last_invoice_seq" not in data:
                        max_seq = self._find_max_seq(data.get("bills", []))
                        data["last_invoice_seq"] = max(max_seq, 6145)
                        self._write_atomically(data)
                except Exception:
                    pass

    def _read_data(self) -> Dict[str, Any]:
        """Read data safely from the JSON file."""
        with self._lock:
            if not self.file_path.exists():
                self._ensure_storage()

            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if not content:
                        return {"last_invoice_seq": 6145, "bills": []}
                    data = json.loads(content)
                    if not isinstance(data, dict) or "bills" not in data or not isinstance(data["bills"], list):
                        raise BillStorageError("Invalid storage schema: missing 'bills' list key.")
                    if "last_invoice_seq" not in data:
                        data["last_invoice_seq"] = self._find_max_seq(data["bills"])
                    return data
            except json.JSONDecodeError as exc:
                raise BillStorageError(f"Corrupted bills.json storage file: {str(exc)}") from exc
            except IOError as exc:
                raise BillStorageError(f"I/O error reading bills storage: {str(exc)}") from exc

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
                raise BillStorageError(f"Failed atomic write to bills storage: {str(exc)}") from exc

    def _find_max_seq(self, existing_bills: List[Dict[str, Any]]) -> int:
        """Scan all historical bills to extract the absolute highest numeric invoice sequence."""
        max_seq = 6145  # Baseline seed from reference Bill.jpeg
        for b in existing_bills:
            inv = str(b.get("invoiceNo") or "").strip()
            if not inv:
                continue
            # Look for suffix sequence after '/' or '-' (e.g. OPD2627/6146 -> 6146, INV-0004 -> 4)
            match = re.search(r"[/_-](\d+)$", inv)
            if match:
                try:
                    num = int(match.group(1))
                    if num > max_seq:
                        max_seq = num
                except ValueError:
                    pass
            else:
                # Fallback: scan any contiguous digits at end
                digits = re.findall(r"\d+", inv)
                if digits:
                    try:
                        num = int(digits[-1])
                        if num > max_seq:
                            max_seq = num
                    except ValueError:
                        pass
        return max_seq

    def generate_next_invoice_no(self, existing_bills: List[Dict[str, Any]], data: Dict[str, Any]) -> Tuple[str, int]:
        """
        Generate a persistent, strictly monotonically increasing invoice number.
        Prefix is OPD<FY_START><FY_END>/ (e.g. OPD2627/6146).
        Guarantees that the counter never restarts or reuses numbers, even if historical records are pruned.
        """
        now = datetime.now()
        # Indian Financial Year starts in April
        fy_start = now.year if now.month >= 4 else now.year - 1
        fy_suffix = f"{str(fy_start)[-2:]}{str(fy_start + 1)[-2:]}"
        prefix = f"OPD{fy_suffix}/"

        highest_in_bills = self._find_max_seq(existing_bills)
        stored_last_seq = data.get("last_invoice_seq", 6145)
        try:
            stored_last_seq = int(stored_last_seq)
        except (ValueError, TypeError):
            stored_last_seq = 6145

        # Strictly advance past the highest known sequence
        current_max = max(highest_in_bills, stored_last_seq, 6145)
        next_seq = current_max + 1
        invoice_no = f"{prefix}{next_seq}"
        return invoice_no, next_seq

    def get_by_patient_id(self, patient_id_or_uhid: str) -> Optional[Dict[str, Any]]:
        """Find the latest issued bill for a patient by UHID or internal ID."""
        clean_id = (patient_id_or_uhid or "").strip().lower()
        if not clean_id:
            return None

        data = self._read_data()
        for b in reversed(data["bills"]):
            b_uhid = (b.get("uhid") or "").strip().lower()
            b_pid = (b.get("patientId") or "").strip().lower()
            if b_uhid == clean_id or b_pid == clean_id:
                return b
        return None

    def get_by_id(self, bill_id_or_invoice: str) -> Optional[Dict[str, Any]]:
        """Find a bill by unique bill ID or invoice number."""
        clean_id = (bill_id_or_invoice or "").strip().lower()
        if not clean_id:
            return None

        data = self._read_data()
        for b in data["bills"]:
            if (b.get("id") or "").strip().lower() == clean_id or (b.get("invoiceNo") or "").strip().lower() == clean_id:
                return b
        return None

    def get_all(self, patient_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all bills, optionally filtered by patient."""
        data = self._read_data()
        bills = data["bills"]
        if patient_id:
            pid = patient_id.strip().lower()
            return [b for b in bills if (b.get("uhid") or "").strip().lower() == pid or (b.get("patientId") or "").strip().lower() == pid]
        return bills

    def create_or_get_bill(
        self,
        patient: Dict[str, Any],
        items: Optional[List[Dict[str, Any]]] = None,
        payment_type: str = "Cash",
        amount_received: Optional[float] = None,
        discount_type: str = "percentage",
        discount_value: float = 0.0,
        discount_doctor: str = "",
        discount_remark: str = "",
        entry_by: str = "Jenil Bundela",
        pc_name: str = "RECEPTION1",
        force_new: bool = False,
        update_existing: bool = False,
    ) -> Dict[str, Any]:
        """
        Create, retrieve, or update a patient bill with dynamic charges and authoritative discount validation.
        - If bill already exists and force_new=False:
            - If update_existing=True: updates charges, discounts, and payments under the SAME invoice number.
            - Else: returns existing bill without creating duplicate invoice numbers.
        - If creating new bill: issues next persistent invoice number from authoritative counter.
        """
        uhid = patient.get("uhid") or patient.get("id") or ""
        if not uhid:
            raise BillStorageError("Cannot create a bill without a valid patient UHID.")

        with self._lock:
            data = self._read_data()
            bills = data["bills"]

            # Sanitize items against authoritative charge_storage
            from .charge_storage import charge_storage
            if not items or len(items) == 0:
                default_chg = charge_storage.get_by_name("Consultation Charge")
                default_amount = float(default_chg["amount"]) if default_chg else 500.0
                default_name = default_chg["name"] if default_chg else "Consultation Charge"
                sanitized_items = [
                    {
                        "srNo": 1,
                        "details": default_name,
                        "rate": default_amount,
                        "amount": default_amount,
                    }
                ]
            else:
                sanitized_items = []
                for idx, it in enumerate(items, 1):
                    resolved = charge_storage.validate_and_resolve_item(it, index=idx)
                    sanitized_items.append(resolved)

            # Subtotal calculation
            subtotal = round(sum(it["amount"] for it in sanitized_items), 2)

            # Authoritative discount calculation
            clean_disc_type = "percentage" if str(discount_type).lower().startswith("perc") else "fixed"
            try:
                disc_val = float(discount_value or 0.0)
            except (ValueError, TypeError):
                disc_val = 0.0

            if disc_val < 0.0:
                disc_val = 0.0

            if clean_disc_type == "percentage":
                if disc_val > 100.0:
                    disc_val = 100.0
                discount_amount = round((subtotal * disc_val) / 100.0, 2)
            else:
                if disc_val > subtotal:
                    disc_val = subtotal
                discount_amount = round(disc_val, 2)

            net_payable = max(0.0, round(subtotal - discount_amount, 2))
            total_amount = net_payable

            if amount_received is None:
                received = net_payable  # Default paid in full
            else:
                try:
                    received = round(float(amount_received), 2)
                except (ValueError, TypeError):
                    received = net_payable

            due_amount = max(0.0, round(net_payable - received, 2))
            now_iso = datetime.now(timezone.utc).isoformat()

            # Format patient full name
            full_parts = [
                patient.get("firstName") or "",
                patient.get("middleName") or "",
                patient.get("lastName") or "",
            ]
            patient_name = " ".join([p.strip().upper() for p in full_parts if p.strip()]) or "UNKNOWN PATIENT"

            # Check if bill already exists for this patient
            if not force_new:
                for b in reversed(bills):
                    if (b.get("uhid") or "") == uhid or (b.get("patientId") or "") == uhid:
                        if update_existing:
                            # Update existing bill record keeping same invoice number
                            b["items"] = sanitized_items
                            b["subtotal"] = subtotal
                            b["discountType"] = clean_disc_type
                            b["discountValue"] = disc_val
                            b["discountAmount"] = discount_amount
                            b["discountDoctor"] = str(discount_doctor or "").strip()
                            b["discountRemark"] = str(discount_remark or "").strip()
                            b["netPayable"] = net_payable
                            b["totalAmount"] = total_amount
                            b["amountReceived"] = received
                            b["dueAmount"] = due_amount
                            b["paymentType"] = (payment_type or "Cash").strip()
                            b["updatedAt"] = now_iso
                            self._write_atomically(data)
                            return b
                        return b

            # Issue a brand new persistent invoice number
            invoice_no, next_seq = self.generate_next_invoice_no(bills, data)
            data["last_invoice_seq"] = next_seq

            new_bill: Dict[str, Any] = {
                "id": f"BILL-{uuid.uuid4().hex[:8].upper()}",
                "patientId": uhid,
                "uhid": uhid,
                "invoiceNo": invoice_no,
                "billDate": now_iso,
                "patientName": patient_name,
                "age": str(patient.get("age") or "").strip(),
                "ageUnit": str(patient.get("ageUnit") or "Yrs.").strip(),
                "sex": str(patient.get("sex") or "N/A").strip(),
                "mobile": str(patient.get("mobile") or "").strip(),
                "treatingDoctor": str(patient.get("hospitalDoctor") or "Dr. NILESH MAHALE").strip().upper(),
                "referenceDoctor": str(patient.get("referenceBy") or "---").strip().upper() or "---",
                "items": sanitized_items,
                "subtotal": subtotal,
                "discountType": clean_disc_type,
                "discountValue": disc_val,
                "discountAmount": discount_amount,
                "discountDoctor": str(discount_doctor or "").strip(),
                "discountRemark": str(discount_remark or "").strip(),
                "netPayable": net_payable,
                "totalAmount": total_amount,
                "amountReceived": received,
                "paymentType": (payment_type or "Cash").strip(),
                "receiptNo": invoice_no,
                "dueAmount": due_amount,
                "entryBy": entry_by,
                "pcName": pc_name,
                "createdAt": now_iso,
                "updatedAt": now_iso,
            }

            bills.append(new_bill)
            self._write_atomically(data)
            return new_bill

    def save_bill(self, bill_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Save or update an arbitrary bill (including full Inpatient bills).
        Ensures thread-safe and process-safe persistence into bills.json.
        """
        uhid = bill_data.get("uhid") or bill_data.get("patientId") or ""
        if not uhid:
            raise BillStorageError("Cannot save a bill without a valid patient UHID.")

        with self._lock:
            data = self._read_data()
            bills = data["bills"]
            now_iso = datetime.now(timezone.utc).isoformat()

            bill_id = bill_data.get("id") or bill_data.get("billNo")
            invoice_no = bill_data.get("invoiceNo") or bill_data.get("billNo")

            # If no invoice number or temporary prefix, generate persistent invoice number
            if not invoice_no or str(invoice_no).startswith("BILL-") or str(invoice_no).startswith("IPD-BILL-"):
                inv, next_seq = self.generate_next_invoice_no(bills, data)
                data["last_invoice_seq"] = next_seq
                invoice_no = inv

            if not bill_id or str(bill_id).startswith("BILL-TEMP"):
                bill_id = f"BILL-{uuid.uuid4().hex[:8].upper()}"

            # Format items
            raw_items = bill_data.get("items") or []
            sanitized_items = []
            for idx, it in enumerate(raw_items, 1):
                rate = float(it.get("rate") or it.get("unitPrice") or 0.0)
                qty = float(it.get("quantity") or it.get("qty") or 1.0)
                amt = float(it.get("totalAmount") or it.get("amount") or (rate * qty))
                name = it.get("name") or it.get("details") or f"Service #{idx}"
                sanitized_items.append({
                    "srNo": idx,
                    "details": name,
                    "name": name,
                    "rate": rate,
                    "quantity": qty,
                    "amount": round(amt, 2),
                    "chargeMasterId": it.get("chargeMasterId", "")
                })

            subtotal = float(bill_data.get("subtotal") or bill_data.get("totalAmount") or sum(it["amount"] for it in sanitized_items))
            discount = float(bill_data.get("discountAmount") or 0.0)
            net_amount = float(bill_data.get("netAmount") or max(0.0, subtotal - discount))
            total_received = float(bill_data.get("totalReceived") or bill_data.get("amountReceived") or 0.0)
            balance = float(bill_data.get("balanceDue") or bill_data.get("balanceAmount") or max(0.0, net_amount - total_received))

            record: Dict[str, Any] = {
                "id": bill_id,
                "billNo": invoice_no,
                "invoiceNo": invoice_no,
                "patientId": uhid,
                "uhid": uhid,
                "admission_id": bill_data.get("admission_id") or bill_data.get("admissionId"),
                "ipd_no": bill_data.get("ipd_no") or bill_data.get("ipdNo"),
                "patientName": bill_data.get("patientName") or "Patient",
                "billDate": bill_data.get("billDate") or now_iso,
                "billType": bill_data.get("billType") or "IPD",
                "treatingDoctor": bill_data.get("treatingDoctor") or bill_data.get("doctorName") or "Dr. NILESH MAHALE",
                "items": sanitized_items,
                "subtotal": round(subtotal, 2),
                "totalAmount": round(subtotal, 2),
                "discountType": bill_data.get("discountType") or "fixed",
                "discountValue": float(bill_data.get("discountValue") or discount),
                "discountAmount": round(discount, 2),
                "netAmount": round(net_amount, 2),
                "netPayable": round(net_amount, 2),
                "totalReceived": round(total_received, 2),
                "amountReceived": round(total_received, 2),
                "balanceDue": round(balance, 2),
                "balanceAmount": round(balance, 2),
                "paymentMode": bill_data.get("paymentMode") or bill_data.get("paymentType") or "Cash",
                "paymentType": bill_data.get("paymentType") or bill_data.get("paymentMode") or "Cash",
                "status": "Paid" if balance <= 0 else "Unpaid",
                "remarks": bill_data.get("remarks") or "Inpatient Settlement Bill",
                "entryBy": bill_data.get("entryBy") or "SYSTEM",
                "pcName": bill_data.get("pcName") or "DESK-IPD-01",
                "createdAt": bill_data.get("createdAt") or now_iso,
                "updatedAt": now_iso,
            }

            # Check if record already exists by id, invoiceNo, or (admission_id and billType == 'IPD')
            existing_idx = -1
            for idx, b in enumerate(bills):
                if b.get("id") == bill_id or b.get("invoiceNo") == invoice_no or (record.get("admission_id") and b.get("admission_id") and b.get("admission_id") == record.get("admission_id")):
                    existing_idx = idx
                    break

            if existing_idx != -1:
                # Update existing record
                record["createdAt"] = bills[existing_idx].get("createdAt", now_iso)
                record["invoiceNo"] = bills[existing_idx].get("invoiceNo", invoice_no)
                record["billNo"] = bills[existing_idx].get("billNo", invoice_no)
                bills[existing_idx] = record
            else:
                bills.append(record)

            self._write_atomically(data)
            return record


# Singleton instance
bill_storage = BillJSONStorage()
