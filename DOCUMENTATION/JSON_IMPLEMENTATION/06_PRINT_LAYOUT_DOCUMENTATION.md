# 06. Print Layout & Document Specifications

## Mixu Infosystem Hospital Management / EMR System

---

### 1. Print Engine Architecture

The printing engine is implemented across:
- `frontend/src/utils/universalPrintGenerator.ts`: Universal HTML5 `@media print` documents.
- `frontend/src/utils/patientBillGenerator.ts`: jsPDF vector Bill Cum Receipt.
- `frontend/src/utils/patientStickerGenerator.ts`: jsPDF multi-format sticker generator.
- `frontend/src/utils/echoReportPrintGenerator.ts`: Multi-page clinical Echocardiography study.

All printable documents enforce:
1. **Clean Print Output**: Zero browser headers, dates, or file URL chrome (`@page { margin: 12mm 15mm; }`).
2. **Mixu Infosystem Brand Consistency**: Multi-color brand accent bar (`#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`), professional navy blue headers, clean typographic hierarchy.
3. **Popup Protection**: Graceful handling of browser window popups with immediate fallback download/render.

---

### 2. Printable Documents Catalog

#### 1. A4 Patient Registration Sticker (`patientStickerGenerator.ts`)
- **Format**: Standard thermal label / A4 sticker sheet.
- **Content**: UHID, Patient Name, Age, Sex, Registration Date & Time, Doctor In-Charge, Mobile Number, High-density Code-128 Barcode.
- **Usage**: Affixed to physical OPD files, IPD charts, sample vials, and inpatient wristbands.

#### 2. Bill Cum Receipt (`patientBillGenerator.ts`)
- **Format**: A4 Portrait.
- **Visual Design**: Strict match to hospital `Bill.jpeg` standard format.
- **Sections**:
  - Hospital Header (XYZ HOSPITAL, registration details, address).
  - Patient Context Grid (Invoice No, Date, UHID, Patient Name, Age/Sex, Doctor, Cashier).
  - Itemized Charges Table (Investigation / Consultation / Bed charges).
  - Total Computation (Gross Total, Discount %, Net Amount, Advance Received, Balance Due).
  - Discount Authorization Sign-off and Legal Jurisdiction clause.

#### 3. 2D Echocardiography Study Report (`echoReportPrintGenerator.ts`)
- **Format**: A4 Multi-page Clinical Diagnostic Report.
- **Sections**:
  - Patient & Clinical Indication block.
  - Quantitative Measurement Grid (Aorta, Left Atrium, LV Diastolic/Systolic dimensions, IVS, LVPW, Ejection Fraction %, FS %).
  - Qualitative Valve Morphology (Mitral, Aortic, Tricuspid, Pulmonic, Pericardium).
  - Comprehensive Diagnostic Conclusion & Impression.
  - Signatures: Consultant Cardiologist.

#### 4. Indoor Admission Sheet / Face Sheet (`universalPrintGenerator.openAdmissionPrint`)
- **Format**: A4 Portrait.
- **Content**: IPD Number, UHID, Admission Date & Time, Ward & Bed Number, Room Type, Admitting Consultant, Referring Doctor, Insurance/TPA coverage, Provisional Diagnosis on Admission, Initial Deposit.
- **Signatures**: Patient / Relative Undertaking Signature, Admission Desk Officer, Treating Consultant.

#### 5. Discharge Card & Clinical Summary (`universalPrintGenerator.openDischargePrint`)
- **Format**: A4 Portrait.
- **Content**:
  - Discharge No, IPD No, UHID, Patient Name, Admission Date, Discharge Date & Time.
  - Condition on Discharge (Recovered / Improved / LAMA / Referred / Deceased).
  - Final Clinical Diagnosis.
  - Hospital Course & Treatment Summary.
  - Surgical / Operative Findings (for surgical cases).
  - Discharge Medications Table (Medicine Name, Dosage, Frequency, Duration).
  - Follow-up Review Date and SOS Emergency Warning Signs.
  - Signatures: Resident Medical Officer, Consultant In-Charge.

#### 6. Advance Deposit / Part Payment Receipt (`universalPrintGenerator.openDepositReceiptPrint`)
- **Format**: A4 Landscape / Half A4.
- **Content**: Receipt Number, Date, Patient Name, UHID, IPD No, Payment Mode (Cash/Card/UPI/Cheque), Amount in Figures and Words, Authorization Reference, Cashier Signature.

#### 7. Diagnostic Laboratory Report (`universalPrintGenerator.openInvestigationPrint`)
- **Format**: A4 Portrait.
- **Content**: Lab Order No, Lab ID, Order Date, Referring Doctor, Test Name, Category.
- **Results Table**: Test Parameter, Observed Result, Units, Biological Reference Range, High/Low/Normal Flag.
- **Signatures**: Medical Laboratory Technologist, Consultant Pathologist / Biochemist.

#### 8. Medical, MLC, and Death Certificates (`universalPrintGenerator.openCertificatePrint`)
- **Format**: A4 Official Legal Certificate.
- **Medical Certificate**: Diagnosis, recommended leave period (from/to), fitness resumption date, doctor registration number.
- **MLC Certificate**: Police station name, constable badge number, examination time, identification marks, trauma/injury documentation.
- **Death Certificate**: Date & time of death, immediate cause of death, antecedent/underlying causes, certifying physician signature & hospital seal.
