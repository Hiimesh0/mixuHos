# 02 — COMPREHENSIVE BUGS FOUND CATALOG
**Mixu Infosystem Hospital Management / EMR Platform**
**Audit Date:** 16-November-2026 | **Severity Classification:** Critical, High, Medium, Low

---

## 1. Summary of Bug Findings

A comprehensive code-level audit and dynamic execution audit revealed **18 distinct bugs** across backend architecture, frontend build systems, cross-module data synchronization, responsive layout mechanics, and printing workflows.

---

## 2. Detailed Bug Catalog

### Bug #01 — Missing Export `roomTypeApi` in `hospitalApi.ts`
- **Severity:** Critical (Build Blocker)
- **Component Affected:** `frontend/src/components/RoomTypeMaster/RoomTypeMaster.tsx` & `frontend/src/api/hospitalApi.ts`
- **Description:** `RoomTypeMaster.tsx` imported `roomTypeApi` to handle room types, but `hospitalApi.ts` only exported the TypeScript type interface `RoomTypeRecord` without the API client object.
- **Symptom:** Production build failed with `[MISSING_EXPORT] "roomTypeApi" is not exported by "src/api/hospitalApi.ts"`.

---

### Bug #02 — Incomplete `bedApi` Methods for Bed Configuration
- **Severity:** High
- **Component Affected:** `frontend/src/components/BedMaster/BedMaster.tsx` & `frontend/src/api/hospitalApi.ts`
- **Description:** `BedMaster.tsx` called `bedApi.createBed()` and `bedApi.updateBed()`, but `bedApi` only defined `getBeds()`, `allocateBed()`, and `releaseBed()`.
- **Symptom:** Adding or modifying beds in Bed Master threw runtime unhandled promise rejections.

---

### Bug #03 — Missing Direct Bill Print in Patient Registration List
- **Severity:** Medium
- **Component Affected:** `frontend/src/components/PatientRegistrationList/PatientRegistrationList.tsx`
- **Description:** Patient Registration List had buttons for "Load Patient", "View Full Details", and "Print Patient Sticker", but lacked a direct "Print Bill" button in table rows and view modals. Users had to manually load the patient into the registration form to print a bill.
- **Symptom:** Hospital billing staff could not reprint bill receipts directly from the patient directory.

---

### Bug #04 — Django Unit Tests Failing on Database Flush
- **Severity:** High (CI/CD Testing Blocker)
- **Component Affected:** `backend/patients/tests.py` & `backend/mixuHos/settings.py`
- **Description:** Standard Django `TestCase` attempts an automatic database transaction rollback and flush on a SQL database (`DATABASES`). Because this project uses custom JSON file storage with a dummy database engine, `manage.py test` failed during test teardown.
- **Symptom:** Test runner crashed attempting to execute SQL flushes against non-existent SQLite/MySQL tables.

---

### Bug #05 — Inpatient Bed Allocation Desynchronization
- **Severity:** Critical (Data Integrity)
- **Component Affected:** `backend/patients/repositories.py` (`admission_repo` & `discharge_repo`)
- **Description:** When an indoor admission was created, the admission record was saved to `admissions.json`, but `beds.json` was not atomically updated to mark the bed as `Occupied`. Similarly, when a discharge card was finalized, the bed remained stuck in `Occupied` status indefinitely.
- **Symptom:** Room Status dashboard showed beds as vacant even after patient admission, causing double-allocation errors.

---

### Bug #06 — Uncommitted Form State Print Failures
- **Severity:** High (Workflow)
- **Component Affected:** `Billing.tsx`, `IndoorRegister.tsx`, `DischargeCard.tsx`, `EchoReport.tsx`
- **Description:** Print handlers triggered window print dialogs before persisting newly keyed input fields to the backend or local storage. If a user printed before manually clicking "Save", the generated document rendered blank values or stale data from previous sessions.
- **Symptom:** Invoices and medical reports printed with empty diagnostic lines or missing doctor charges.

---

### Bug #07 — Concurrent Multi-User JSON File Corruption Hazard
- **Severity:** Critical (Concurrency)
- **Component Affected:** `backend/patients/base_repository.py`
- **Description:** Initial JSON repository handlers utilized bare `open(filepath, 'w')` calls without inter-process file locking. When multiple staff members or background jobs wrote simultaneously, file writes overlapped, truncating JSON files and generating parse errors (`JSONDecodeError: Unterminated string`).
- **Symptom:** Data loss and application crashes during multi-user simultaneous saves.

---

### Bug #08 — Orphaned Foreign Keys in Initial Test Data
- **Severity:** Medium (Referential Integrity)
- **Component Affected:** `backend/data/` (Admissions, Discharges, Bills)
- **Description:** Early dummy test records contained mismatched identifiers: discharge cards pointed to non-existent admission IDs, and several bills pointed to arbitrary test UHIDs not registered in `patients.json`.
- **Symptom:** Patient Past Info and longitudinal timeline crashed or failed to render medical history.

---

### Bug #09 — Static Deployment API Fallback Failure
- **Severity:** High (Deployment)
- **Component Affected:** `frontend/src/api/hospitalApi.ts`, `clinicalApi.ts`, `masterApi.ts`
- **Description:** On GitHub Pages (`https://Hiimesh0.github.io/mixuHos/`), API calls to `http://127.0.0.1:8000/api` fail due to mixed-content security (HTTPS to HTTP) or offline status. Several newer clinical modules lacked fallback to browser `localStorage` and bundled baseline JSON.
- **Symptom:** Blank tables and infinite spinners when hosted on GitHub Pages without an active local backend.

---

### Bug #10 — Mobile Off-Canvas Drawer Collapsing Glitch on Field Focus
- **Severity:** Medium (UX)
- **Component Affected:** `frontend/src/App.tsx`
- **Description:** The global auto-collapse focus listener collapsed the sidebar on any form field focus. On mobile viewports (<= 1024px), setting `isSidebarCollapsed = true` broke the mobile navigation state rather than closing the slide-in drawer.
- **Symptom:** Mobile navigation drawer broke into a narrow 72px strip on small screens when a form was focused.

---

### Bug #11 — Responsive Horizontal Table Overflow on Small Screens
- **Severity:** Medium (Responsive Design)
- **Component Affected:** `PatientRegistrationList.module.css`, `Billing.module.css`, `IndoorRegister.module.css`
- **Description:** Wide data tables containing patient demographics, timestamps, and multi-action buttons lacked explicit horizontal container overflow wrappers, pushing page boundaries and causing awkward page-level horizontal scroll on mobile devices.
- **Symptom:** Cut-off action buttons and misaligned layouts on iPhone and Android mobile browsers.

---

### Bug #12 — Sequential Invoice & Registration ID Collisions
- **Severity:** Medium
- **Component Affected:** `backend/patients/repositories.py` (`bills.json`, `admissions.json`)
- **Description:** Sequential identifiers were generated by computing `len(items) + 1`. If an intermediate record was deleted or filtered, new records reused existing sequence numbers, creating duplicate invoice numbers.
- **Symptom:** Duplicate invoice and admission numbers on patient receipts.
