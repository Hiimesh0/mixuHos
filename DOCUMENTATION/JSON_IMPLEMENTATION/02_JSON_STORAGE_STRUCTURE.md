# 02. JSON Storage Structure & File Directory

## Mixu Infosystem Hospital Management / EMR System

---

### 1. Storage Location & Directory Layout

All backend persistent JSON storage files reside in:
`backend/data/`

For static GitHub Pages and offline client-side support, exact seed replicas are maintained in:
`frontend/public/data/`

```
Project_1/
├── backend/
│   ├── data/
│   │   ├── admissions.json            # Inpatient admissions & bed assignments
│   │   ├── advices.json               # Discharge advice & lifestyle templates
│   │   ├── beds.json                  # Hospital beds, status & room assignments
│   │   ├── certificates.json          # Medical, MLC, and Death certificates
│   │   ├── contacts.json              # Hospital telephone & intercomm directory
│   │   ├── departments.json           # Clinical departments & specialties
│   │   ├── deposits.json              # Advance deposits & part payments
│   │   ├── discharges.json            # Discharge summaries & clinical notes
│   │   ├── doctors.json               # Doctor Master registry
│   │   ├── dr_visits_procedures.json  # Inpatient doctor visits & procedures log
│   │   ├── echo_reports.json          # 2D Echocardiography study reports
│   │   ├── insurance_companies.json   # Insurance companies & TPAs
│   │   ├── investigations.json        # Lab & radiology orders & test results
│   │   ├── medicines.json             # Medicine Master registry
│   │   ├── operation_groups.json      # Surgical specialty & operation groups
│   │   ├── ot_entries.json            # Operation theatre surgical logs
│   │   ├── patient_bills.json         # Patient billing records & receipts
│   │   ├── patient_visits.json        # Longitudinal patient visit history
│   │   ├── patients.json              # Master Patient Index (UHID registry)
│   │   ├── prescription_templates.json# Standard prescription protocols
│   │   ├── report_templates.json      # Diagnostic report templates
│   │   ├── room_types.json            # Wards, room classes & daily rates
│   │   └── visiting_types.json        # Consultation visiting types & fee rates
```

---

### 2. Standard JSON Envelope Format

Every JSON file follows a uniform root envelope structure:

```json
{
  "<root_plural_key>": [
    {
      "id": "DEP-000001",
      "name": "General Medicine",
      "code": "GENMED",
      "is_active": true,
      "created_at": "2026-11-16T10:00:00+05:30",
      "updated_at": "2026-11-16T10:00:00+05:30"
    }
  ],
  "last_sequence": 1
}
```

- `<root_plural_key>`: Standardized collection key (e.g. `admissions`, `beds`, `deposits`, `certificates`).
- `last_sequence`: Monotonically increasing integer tracking the highest generated numeric identifier to guarantee uniqueness even if records are deleted.

---

### 3. Concurrency & Integrity Mechanisms

#### A. Inter-Process File Locking (`InterProcessFileLock`)
Implemented in `backend/patients/base_repository.py`:
- On **Windows**: Uses Python's `msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)` with exponential backoff and timeout.
- On **Linux / macOS**: Uses `fcntl.flock(f.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)`.
- Prevents dirty reads and overwrite hazards when multiple concurrent requests hit the Django server simultaneously.

#### B. Safe Atomic Replacement
- Writes are never made in-place to avoid file truncation during power failures or process crashes.
- File data is serialized to a `tempfile.NamedTemporaryFile` in the same directory, flushed with `f.flush()` and `os.fsync()`, and swapped into place using `os.replace(temp_path, target_path)`.
- `os.replace` is an atomic filesystem operation on POSIX and NTFS systems.
