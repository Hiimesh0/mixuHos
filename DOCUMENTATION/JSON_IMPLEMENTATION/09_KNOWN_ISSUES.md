# 09. Known Considerations & Technical Notes

## Mixu Infosystem Hospital Management / EMR System

---

### 1. Browser Print Margins
- Modern browsers (Chrome, Edge, Firefox) by default attempt to inject the current webpage URL, date, and page title into the header and footer of prints.
- While the print stylesheets in `universalPrintGenerator.ts` inject `@page { margin: 12mm 15mm; }` to strip browser headers, users in hospital billing desks should ensure the browser print dialog option **"Headers and Footers"** is left unchecked for optimal output.

---

### 2. File Concurrency Limits in Pure JSON Mode
- The backend uses OS-level inter-process file locks (`msvcrt` on Windows / `fcntl` on POSIX).
- This is completely safe and robust for standard clinic and hospital workloads (up to hundreds of concurrent users).
- When hospital transactions scale beyond 1,000 requests per second, migrating from JSON file I/O to a dedicated MySQL/PostgreSQL engine is recommended to leverage row-level locking rather than file-level locking.

---

### 3. Client Storage Synchronization
- For static deployments (such as GitHub Pages or offline laptops), modifications are persisted to the browser's `localStorage`.
- `localStorage` has a typical quota of 5MB to 10MB per origin. For large hospital databases with tens of thousands of past patient records, connecting to the Django HTTP backend is recommended for unbounded disk storage.
