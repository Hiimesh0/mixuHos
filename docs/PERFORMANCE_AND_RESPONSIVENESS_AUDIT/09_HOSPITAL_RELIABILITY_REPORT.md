# 09 — Hospital Software Reliability & Data Integrity Audit Report

**Project:** Mixu Infosystem Hospital Management / EMR  
**Audit Standard:** Healthcare Information System (HIS) Clinical Data Integrity & Workflow Reliability  
**Status:** Audit Completed — Critical Production Reliability Observations Recorded  

---

## 1. Clinical Data Consistency & Identifier Integrity

### 1.1 UHID Generation Logic
- **Current Algorithm:** `generate_next_uhid()` in `backend/patients/storage.py` and client fallback in `patientApi.ts` scans all existing records, extracts the numeric suffix from identifiers starting with `UHID-`, and returns `UHID-${max_num + 1}`.
- **Single-User Reliability:** Verified 100% reliable for single-terminal operation; sequential numbering (e.g., `UHID-1001` through `UHID-1023`) maintains clinical audit trails.
- **Multi-Terminal Collision Risk:** If two reception desks click "Save Patient" at the exact same millisecond:
  - Both processes read the same max UHID from disk.
  - Both generate the identical UHID (e.g., `UHID-1024`).
  - The second write overwrites or creates a duplicate patient identity.
  - **Hospital Impact:** Critical patient records could become merged or misidentified.
  - **Recommended Solution:** Utilize atomic database auto-increment sequences (e.g., PostgreSQL `SERIAL` or Redis atomic increment `INCR`) for guaranteed unique UHID issuance.

### 1.2 Two-Tier Deletion Protection (Master Data Safety)
- Both `DoctorMaster` and `MedicineMaster` implement a clinical preservation workflow:
  - **Deactivate (Safe):** Sets status to `inactive`. The doctor or medicine is hidden from future selection dropdowns, but all historical bills, echo reports, and patient records retain their clinical references intact.
  - **Delete Permanently:** Requires explicit confirmation via modal dialog.
  - **Evaluation:** High-grade healthcare safety practice; prevents orphan references.

---

## 2. Financial & Billing Accuracy

### 2.1 Dynamic Calculation Precision
- Tested in `patientBillGenerator.ts`:
  - **Subtotal:** Sum of all itemized charges (`rate × quantity`).
  - **Discount:** Supports percentage (`subtotal × (discountValue / 100)`) and fixed amount deductions.
  - **Net Payable:** `subtotal - discountAmount`.
  - **Due Amount:** `netPayable - amountReceived`.
- **Floating Point Arithmetic:** Uses standard JavaScript floating point arithmetic.
  - *Risk:* In rare cases, floating point rounding errors (e.g., `0.1 + 0.2 = 0.30000000000000004`) can produce fraction-of-a-cent discrepancies in financial tallies.
  - *Recommendation:* Round every calculated line-item and total using `Math.round(val * 100) / 100` or integer cents/paise.

---

## 3. Session Security & Access Control

### 3.1 Authentication Mechanism
- Current system uses `localStorage.getItem('auth') === 'true'`.
- In a professional hospital network:
  - Any user can open Chrome DevTools and type `localStorage.setItem('auth', 'true')` to bypass the login screen.
  - There are no distinct user roles: Receptionist, Nurse, Billing Clerk, Sonographer, and Administrator all share the same unrestricted access level.

### 3.2 Recommended Healthcare Security Upgrades
1. **Server-Side Session Validation:** Issue secure, `HttpOnly`, `SameSite=Strict` session cookies or signed JWT tokens from Django.
2. **Role-Based Access Control (RBAC):**
   - **Reception Desk:** Patient Registration, Search, Sticker Printing.
   - **Diagnostics / Sonography:** Echo Report, Report Template.
   - **Cashier / Accounts:** Billing, Part Payment, Receipts.
   - **Medical Records / Admin:** Doctor Master, Medicine Master, User Management.
3. **Audit Logging:** Maintain immutable timestamps recording `created_by_user_id` and `modified_by_user_id` for every clinical interaction.

