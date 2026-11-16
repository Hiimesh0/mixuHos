# 02 — BLANK WHITE SCREEN ROOT CAUSES & ARCHITECTURAL RESOLUTION
**Mixu Infosystem Hospital Management / EMR System**
*Generated: 2026-11-16 | Project Stack: React (Vite, TypeScript), Django 5.x*

---

## 1. Defect Overview

Users experienced blank white screens when loading or refreshing specific pages—most notably:
- `/investigation-ordered`
- `/patient-past-info`
- `/medical-certificate`
- `/mlc-certificate`
- `/death-certificate`
- `/billing`
- `/indoor-register`

In certain instances, pages rendered when navigated from another tab, but refreshing or accessing the URL directly caused an immediate total unmount, leaving a blank page with no UI controls.

---

## 2. Root Cause 1: Object vs. Array Return Shape in `patientApi.getPatients()`

### Technical Breakdown:
1. In `frontend/src/api/patientApi.ts`, the asynchronous function `patientApi.getPatients()` was refactored to return an API envelope object:
   ```typescript
   {
     success: true,
     count: 58,
     patients: PatientRecord[]
   }
   ```
2. However, multiple UI components expected an array and assigned the response directly to state:
   ```typescript
   const pats = await patientApi.getPatients();
   setPatients(pats); // pats is an object, NOT an array!
   ```
3. During React component render, the JSX executed:
   ```tsx
   {patients.map(p => (
     <option key={p.id} value={p.id}>{p.name} ({p.uhid})</option>
   ))}
   ```
4. JavaScript threw an unhandled exception:
   ```
   Uncaught TypeError: patients.map is not a function
   ```
5. In React 19 / Vite, an uncaught JavaScript error in the render lifecycle causes the entire React DOM tree to unmount, resulting in a blank white screen.

### Architectural Solution Applied:
Across all consuming components and within `patientApi.ts`, we normalized patient array extraction:
```typescript
const patList = Array.isArray(pats) ? pats : ((pats as any)?.patients || []);
setPatients(patList);
```
Furthermore, `patientApi.ts` now enforces automatic name population for every patient:
```typescript
p.name = p.name || getPatientFullName(p) || p.uhid;
```

---

## 3. Root Cause 2: Absence of a React Error Boundary

### Technical Breakdown:
- When any React subcomponent threw a runtime exception, the error bubbled uncaught to the root `<App />` component.
- The browser unmounted `<div id="root">`, showing a blank screen with zero visual feedback or recovery options.

### Architectural Solution Applied:
Created `frontend/src/components/common/ErrorBoundary.tsx` and wrapped the `<Routes>` inside `<ErrorBoundary>` in `frontend/src/App.tsx`.
- Catches any component rendering failure gracefully.
- Displays an alert card with clear error description, "Reload Application" button, and "Return to Patient Registration" button.
- Prevents total unmount and maintains application navigation.

---

## 4. Root Cause 3: Direct URL Loading without Query Parameter Synchronization

### Technical Breakdown:
- Pages such as `InvestigationOrdered` and `PatientPastInfo` relied on client navigation state that vanished on browser refresh.
- Accessing `http://localhost:4173/mixuHos/#/patient-past-info` or refreshing when no patient was selected led to uninitialized state (`selectedPatient === null`), causing null reference exceptions when rendering child elements (`selectedPatient.name`).

### Architectural Solution Applied:
- Added `useSearchParams()` integration (`?id=` or `?uhid=`).
- When a page loads or refreshes with a query parameter, it finds and selects the patient automatically.
- When no parameter is present, it gracefully defaults to the first patient in the active hospital registry and renders clean empty state placeholders rather than crashing.

---

## 5. Root Cause 4: GitHub Pages Subpath Routing (SPA 404s)

### Technical Breakdown:
- When hosted on GitHub Pages (`https://Hiimesh0.github.io/mixuHos/`), accessing clean routes directly resulted in GitHub's default 404 page because GitHub Pages only natively hosts static assets and has no server-side fallback to `index.html`.

### Architectural Solution Applied:
- Implemented `frontend/public/404.html` containing an automatic SPA redirect script.
- Incoming direct requests are intercepted and converted into `HashRouter` paths (`/mixuHos/#/path?query`), reloading the React application seamlessly.
