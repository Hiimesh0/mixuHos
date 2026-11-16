# Implementation Master Checklist

| ID | Report | Affected Module | Problem | Priority | Recommendation | Status |
|---|---|---|---|---|---|---|
| EMR-FIX-001 | 04_FIELD_VALIDATION | All Forms | Inputs missing HTML5 types and constraints | P1 | Add `type="number"`, `maxLength`, etc. | **ALREADY FIXED** |
| EMR-FIX-002 | 10_DUMMY_DATA | Dashboards & Headers | Hardcoded demo values persisted in UI | P1 | Strip out mock UI elements, replace with empty states | **ALREADY FIXED** |
| EMR-FIX-003 | 06_BACKEND | All modules | Completely missing Django Backend API | P0 | Bootstrap Django, Postgres, and DRF architecture | **BLOCKED** |
| EMR-FIX-004 | 07_DATABASE | All modules | Missing Database Schema / Persistence | P0 | Create Models, perform migrations | **BLOCKED** |
| EMR-FIX-005 | 09_FINANCIAL | Billing & IPD | Financial values do not calculate dynamically | P1 | Link UI calculations to backend decimal-safe serializers | **BLOCKED** |
| EMR-FIX-006 | 11_SECURITY | Auth module | Authentication is a pure frontend toggle | P0 | Implement real JWT/Session auth via backend | **BLOCKED** |

*Note: All UI-level structural and visual fixes have been executed and verified in prior tasks. The remaining fixes are architecturally blocked by the missing backend.*
