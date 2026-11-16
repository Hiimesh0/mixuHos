# 01. Project Implementation Overview

## Mixu Infosystem Hospital Management / EMR System
**Architecture Phase: Fully Functional JSON-Backed Enterprise EMR (MySQL-Ready)**

---

### 1. Executive Summary

The **Mixu Infosystem Hospital Management / EMR** application is a modern, high-aesthetic, responsive, web-based healthcare software system designed for multi-department hospitals and clinics.

To support rapid deployment, zero external database setup friction, and local offline capability, the entire data tier is powered by a **structured, relational JSON Repository Architecture** in the Django REST backend, mirrored by a robust local storage and static JSON fallback in the React frontend.

The system is architected under strict **Separation of Concerns (SoC)**, ensuring that future migration to **MySQL** (or PostgreSQL) will require **zero rewrites** to frontend components, user interfaces, or API endpoints.

---

### 2. Full Architecture Topology

```mermaid
flowchart TD
    subgraph Frontend ["React 18 + TypeScript + Vite SPA"]
        UI["User Interface (45 Hospital Modules)"]
        HOOKS["State Hooks & Auto-Dismiss Notifications"]
        PRINT["Universal Print Engine (A4 & Sticker)"]
        CL_API["Client API Layer (hospitalApi, clinicalApi, masterApi, patientApi)"]
        L_STORE[("Browser LocalStorage Cache & Offline Sync")]
    end

    subgraph Backend ["Django REST Framework Backend (Port 8000)"]
        ROUTER["URL Routing Layer (/api/*)"]
        VIEWS["Domain API Views & Validators"]
        REPO_INTER["Domain Repository Layer (18 Singletons)"]
        BASE_REPO["BaseJSONRepository (Atomic Writes & Inter-Process File Lock)"]
        JSON_FILES[("JSON Database (/backend/data/*.json)")]
    end

    UI --> HOOKS
    UI --> PRINT
    HOOKS --> CL_API
    CL_API -->|HTTP REST Requests| ROUTER
    CL_API -.->|Offline Fallback / Static Deploy| L_STORE
    ROUTER --> VIEWS
    VIEWS --> REPO_INTER
    REPO_INTER --> BASE_REPO
    BASE_REPO -->|Locked Atomic I/O| JSON_FILES
```

---

### 3. Core Design Principles

1. **Relational Data Modeling Over JSON**:
   - Entities have strict, predictable, sequential primary keys (`UHID-XXXX`, `ADM-XXXX`, `IPD-2026-XXXX`, `DIS-XXXX`, `ORD-XXXX`, `CERT-XXXX`, `REC-XXXX`).
   - Foreign keys link records across domain boundaries (e.g., `Admission.bed_number -> Bed.bed_number`, `Discharge.admission_id -> Admission.id`).
   - Timestamps are standardized in ISO-8601 Indian Standard Time (`+05:30`).

2. **Inter-Process Concurrency & Atomic Writes**:
   - Every file modification acquires an OS-level file lock (`msvcrt` on Windows, `fcntl` on Linux/macOS) to prevent race conditions across parallel requests.
   - Writes are executed using a temporary file (`NamedTemporaryFile`) followed by an atomic OS replace (`os.replace`), ensuring that a crash or interruption never corrupts persistent JSON files.

3. **Universal Healthcare Print System**:
   - No browser headers/footers or URL chrome in prints.
   - Pixel-perfect, high-aesthetic printable documents (Patient Sticker, Bill Cum Receipt, Echo Report, Admission Face Sheet, Discharge Card, Deposit Receipt, Lab Investigation, Medical/MLC/Death Certificates) themed with Mixu logo palette (`#4285F4`, `#EA4335`, `#FBBC05`, `#34A853`).

4. **MySQL Ready By Design**:
   - Business services interact exclusively with Repository interfaces (`get_all`, `get_by_id`, `create`, `update`, `delete`, `filter`, `search`).
   - When migrating to MySQL, developers simply provide a `BaseMySQLRepository` implementing the exact same interface methods.
