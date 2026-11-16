# 10 — Critical Issues & Defect Registry

**Project:** Mixu Infosystem Hospital Management / EMR  
**Audit Date:** November 16, 2026  
**Defects Evaluated:** 6 Identified Issues categorized by severity  

---

## 1. Defect Severity Classification

- **P0 — Critical:** Architectural data loss, major security flaw, server-wide crash.
- **P1 — High:** Major user-facing broken functionality or critical mobile usability failure.
- **P2 — Medium:** Performance bloat, oversized bundle, or disconnected mock screen.
- **P3 — Low:** Code cleanup, unused imports, minor cosmetic optimization.

---

## 2. Exhaustive Defect Register

### Issue 1: Mobile Navigation Drawer Opens in Collapsed Icon-Only State
- **Issue ID:** `ISSUE-01`
- **Severity:** **P1 — High**
- **Page Name:** Navigation Bar / Slide-out Mobile Drawer
- **Route:** All routes on mobile screens (`< 1024px`)
- **Device / Resolution:** All mobile viewports (360px Small Android, 375px iPhone SE, 390px, 412px, 440px)
- **Reproduction Steps:**
  1. Open application on a mobile screen or resize browser window to `< 1024px`.
  2. Tap any input field (e.g. First Name on Patient Registration).
  3. Notice global `focusin` event sets `localStorage.setItem('mixu_sidebar_collapsed', 'true')`.
  4. Tap the mobile hamburger menu icon (`X` / `Menu`) on the top header.
- **Actual Observed Behavior:** The mobile drawer slides open, but renders in icon-only collapsed mode. All 43 module title labels, section headers ("Working Modules", "Other Modules"), and badges are completely hidden. Only bare icons are rendered centered in a 270px white drawer. No tooltips exist on mobile touchscreens.
- **Expected Behavior:** On mobile screens, the slide-out drawer must **always** render in full expanded mode with complete text labels, section headers, badges, and hierarchical submenus.
- **Visual Evidence:** User attachment `problem.jpeg` and automated screenshot `BUG_REPRODUCTION_Mobile_Drawer_Collapsed_Icons_Only.png`.
- **Root Cause:** In `frontend/src/App.tsx`, `NavigationBar` unconditionally receives `isCollapsed={isSidebarCollapsed}`. When `isSidebarCollapsed` is true on desktop, it inadvertently forces the mobile drawer to collapse its text labels as well.
- **Recommended Solution:** Decouple mobile drawer from desktop collapse state by checking viewport width or drawer status:
  `isCollapsed={window.innerWidth <= 1024 ? false : isSidebarCollapsed}`.
- **Implementation Complexity:** Low (10 lines in `App.tsx`).

---

### Issue 2: JSON Storage Concurrency Race Condition & Silent Record Deletion
- **Issue ID:** `ISSUE-02`
- **Severity:** **P0 — Critical Architectural Concern**
- **Page Name:** Backend Storage Engine
- **Route:** `/api/patients/`, `/api/doctors/`, `/api/medicines/`, `/api/report-templates/`, `/api/echo-reports/`
- **Device / Resolution:** Server-side Architecture (All devices)
- **Reproduction Scenario:** Two hospital staff members submitting registrations simultaneously on a multi-process WSGI server (e.g. Gunicorn with multiple workers).
- **Actual Observed Behavior:** The Python lock `_storage_lock = threading.RLock()` in `backend/patients/storage.py` only protects threads within a single OS process. If two separate worker processes execute concurrent writes, each executes `os.replace` with its own copy of the file, causing the second process to silently overwrite and delete the first process's newly saved patient.
- **Expected Behavior:** Concurrent registrations must be safely queued and committed transactionally without risk of record deletion.
- **Root Cause:** Flat JSON file storage without inter-process operating system locks (`fcntl` / `flock`) or database transactions.
- **Recommended Solution:**
  1. *Immediate:* Add `filelock` (inter-process OS file lock) around JSON read/write operations.
  2. *Enterprise:* Transition persistence to an ACID relational database (PostgreSQL with connection pooling).
- **Implementation Complexity:** Medium (Immediate) / High (Database Migration).

---

### Issue 3: Uncompressed High-Resolution Branding PNG Assets (> 2.5 MB Payload)
- **Issue ID:** `ISSUE-03`
- **Severity:** **P2 — Medium**
- **Page Name:** Global Branding Assets
- **Route:** All routes (loaded via `App.tsx` and `index.css`)
- **Device / Resolution:** All (Especially mobile 4G/3G networks)
- **Actual Observed Behavior:**
  - `mixu-infosystem-logo.png` is **1,055.4 kB (1.05 MB)**.
  - `mixu-logo-clean.png` is **700.1 kB**.
  - `mixu-emblem.png` is **363.6 kB**.
  - Total image payload is **3.26 MB**, representing 56.2% of the entire application weight.
- **Expected Behavior:** High-resolution vector SVGs or optimized WebP images under 50 kB total.
- **Root Cause:** Raw high-DPI uncompressed PNGs placed in the repository without raster optimization.
- **Recommended Solution:** Convert images to WebP format, resize to appropriate display dimensions, and compress.
- **Implementation Complexity:** Low.

---

### Issue 4: Monolithic Chunk Size Warning on `PatientRegistration` (> 500 kB)
- **Issue ID:** `ISSUE-04`
- **Severity:** **P2 — Medium**
- **Page Name:** Patient Registration
- **Route:** `/patient-registration`
- **Device / Resolution:** All
- **Actual Observed Behavior:** Vite emits a production chunk warning: `(!) Some chunks are larger than 500 kB after minification: PatientRegistration-*.js (545.12 kB)`.
- **Expected Behavior:** Initial page route chunks should remain under 200 kB for fast initial parsing and evaluation.
- **Root Cause:** `PatientRegistration.tsx` statically imports `jsPDF` (`389.7 kB`) and `html2canvas` (`194.8 kB`).
- **Recommended Solution:** Dynamically import `jsPDF` inside the `handleGenerateSticker` and `handleGenerateBill` action handlers using `await import('jspdf')`.
- **Implementation Complexity:** Low.

---

### Issue 5: Standalone `/billing` Page is an Unconnected Static Prototype
- **Issue ID:** `ISSUE-05`
- **Severity:** **P2 — Medium**
- **Page Name:** Standalone Billing Screen
- **Route:** `/billing`
- **Device / Resolution:** All
- **Actual Observed Behavior:** The `/billing` page contains static HTML form inputs without `value`, `onChange`, or state hooks. The "Add" and "Save" buttons do not update table rows or persist charges.
- **Expected Behavior:** Fully interactive billing interface or explicit linkage to the working dynamic billing engine (`BillPreview.tsx`).
- **Root Cause:** Screen was initially scaffolded as a visual template matching legacy screenshot `Billing.jpg` but was not integrated with `patientApi`.
- **Recommended Solution:** Connect `/billing` to `patientApi.createBill()` and patient selector, or redirect to dynamic bill viewer.
- **Implementation Complexity:** Medium.

---

### Issue 6: Unused Imports & Redundant Regex Escape Warnings (44 Oxlint Warnings)
- **Issue ID:** `ISSUE-06`
- **Severity:** **P3 — Low**
- **Page Name:** Multiple source files
- **Route:** N/A
- **Device / Resolution:** N/A
- **Actual Observed Behavior:** Oxlint emits 44 warnings across 63 files (unused `Play` icon in `BedMaster`, `AdviceMaster`, redundant regex escapes in `reportDetailsFormatter.ts`).
- **Expected Behavior:** Zero linter warnings.
- **Recommended Solution:** Remove unused imports and redundant regex escapes.
- **Implementation Complexity:** Very Low.

