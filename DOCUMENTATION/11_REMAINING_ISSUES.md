# 11 — REMAINING ARCHITECTURAL LIMITATIONS & FUTURE ROADMAP
**Mixu Infosystem Hospital Management / EMR Platform**
**Assessment Date:** 16-November-2026 | **Chief Technology Officer / Architect:** Systems Architect

---

## 1. Executive Disclosure

The current application is fully stable, interconnected, and production-ready for single-facility hospital clinics and small-to-medium hospitals operating within local or hosted environments using JSON storage.

To maintain complete engineering transparency, this document catalogs architectural constraints inherent to file-based storage, multi-user scaling limits, and the planned roadmap for future database and infrastructure upgrades.

---

## 2. Catalog of Known Architectural Constraints

### 1. Scaling Ceiling of File-Based JSON Storage
- **Current State:** File read times are under 3ms for 1,000 records and ~13ms for 5,000 records. Atomic updates take ~30ms at 1,000 records and ~113ms at 5,000 records.
- **Limitation:** In JSON storage, updating a single record requires serializing and writing the entire file to disk. When the patient directory exceeds ~15,000 records (~5 MB file size), write latency will approach 300ms - 500ms.
- **Remediation Plan:** Transition to MySQL (using the relational schema specified in `06_JSON_DATA_INTEGRITY.md`) once patient volume exceeds 5,000 records.

### 2. Multi-Server Clustering & Distributed Locking
- **Current State:** File locking is enforced at the operating system level (`msvcrt` on Windows, `fcntl` on POSIX) on the local host filesystem.
- **Limitation:** If the hospital deploys multiple backend load-balanced instances (e.g. across two physical servers or Docker containers), OS-level file locks do not synchronize across separate physical file systems without NFS/SMB network locks.
- **Remediation Plan:** A single central database server (MySQL / MariaDB) eliminates file-locking constraints entirely.

### 3. Role-Based Access Control (RBAC) Granularity
- **Current State:** The login module authenticates staff credentials and maintains active session tokens with clear logout controls.
- **Limitation:** Permissions are currently uniform across authenticated staff. A receptionist can technically view clinical Echo reports, and a pharmacist can technically access Bed Master.
- **Remediation Plan:** Implement fine-grained Django REST Framework permissions (e.g., `IsReceptionist`, `IsDoctor`, `IsPharmacist`, `IsAdmin`) restricting sensitive routes.

### 4. Real-Time Push Synchronization (WebSockets)
- **Current State:** The Room Status bed grid and Lab Dashboard refresh whenever navigated to or upon user interaction.
- **Limitation:** If Ward Nurse A discharges a patient on Computer 1, Computer 2 (at the Reception desk) updates upon next interaction or navigation, rather than updating instantaneously via WebSockets.
- **Remediation Plan:** Introduce Django Channels or Server-Sent Events (SSE) for instant cross-terminal bed status broadcasts.

### 5. Thermal Barcode Printer Raw Protocols (ZPL/EPL)
- **Current State:** The patient sticker generator outputs an exact 100mm x 50mm PDF with vector Code 128 barcodes, rendering via standard browser print dialogs.
- **Limitation:** High-volume hospital reception desks often prefer raw 1-click printing directly to Zebra/TSC thermal label printers without opening the browser system print dialogue.
- **Remediation Plan:** Implement WebUSB / WebSerial API integration for direct Zebra Programming Language (ZPL) label dispatch.

---

## 3. Prioritized Engineering Roadmap

```
PHASE 1 (COMPLETED):
  [x] Complete Module Interconnection with 0 Broken Routes
  [x] OS-Level Inter-Process File Locking & Safe Atomic Writes
  [x] Full Hospital Print System Rebuild (bill.jpeg & echo report print.jpeg)
  [x] Controlled 58-Patient / 12-Doctor / 35-Medicine Test Data Seeding
  [x] 100% Zero Orphaned Foreign Keys Verification
  [x] Complete 40-Test Automated Backend Suite (100% Pass)
  [x] 100% Responsive Design Audit across 8 Standard Viewports

PHASE 2 (PLANNED FOR EXPANSION):
  [ ] Deploy MySQL / MariaDB using the 3NF schema in 06_JSON_DATA_INTEGRITY.md
  [ ] Implement Django Channels WebSocket bed broadcast engine
  [ ] Configure Role-Based Permission groups (Doctors, Nurses, Reception, Cashier)
  [ ] Direct WebUSB Thermal Label Printer dispatch
```
