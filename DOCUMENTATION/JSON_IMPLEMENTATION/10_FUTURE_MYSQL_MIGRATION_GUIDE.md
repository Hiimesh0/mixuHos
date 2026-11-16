# 10. Future MySQL Migration Guide

## Mixu Infosystem Hospital Management / EMR System

---

### 1. Zero-Rewrite Migration Strategy

Because all data operations in the application flow through the **Repository Pattern**:

$$\text{React Frontend} \longrightarrow \text{REST API Endpoints} \longrightarrow \text{Domain Views} \longrightarrow \mathbf{\text{Repository Interface}} \longrightarrow \text{Storage Engine}$$

**Not a single React component, CSS module, or frontend API service needs to be changed** when migrating from JSON to MySQL.
Even the Django API views remain untouched! The only change required is swapping the repository implementations in `backend/patients/repositories.py` from `BaseJSONRepository` to a `BaseMySQLRepository`.

---

### 2. MySQL Relational Schema (DDL)

When transitioning to MySQL, execute the following schema creation script:

```sql
CREATE DATABASE IF NOT EXISTS mixu_hospital_emr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mixu_hospital_emr;

-- 1. Departments Master
CREATE TABLE departments (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    head_of_dept VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Room Types Master
CREATE TABLE room_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    ac_type VARCHAR(50) DEFAULT 'Non-AC',
    total_beds INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Hospital Beds Master
CREATE TABLE beds (
    id VARCHAR(20) PRIMARY KEY,
    bed_number VARCHAR(50) UNIQUE NOT NULL,
    ward_name VARCHAR(100) NOT NULL,
    room_type_id VARCHAR(20),
    status ENUM('Vacant', 'Occupied', 'Maintenance', 'Cleaning') DEFAULT 'Vacant',
    current_admission_id VARCHAR(20),
    current_patient_id VARCHAR(50),
    daily_rate DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bed_status (status),
    INDEX idx_ward (ward_name)
);

-- 4. Patients Master
CREATE TABLE patients (
    id VARCHAR(20) PRIMARY KEY,
    uhid VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    address TEXT,
    ref_by VARCHAR(100),
    reg_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient_name (name),
    INDEX idx_patient_mobile (mobile)
);

-- 5. Inpatient Admissions
CREATE TABLE admissions (
    id VARCHAR(20) PRIMARY KEY,
    ipd_no VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(20) NOT NULL,
    uhid VARCHAR(20) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    age VARCHAR(10),
    gender VARCHAR(10),
    mobile VARCHAR(20),
    admission_date DATE NOT NULL,
    admission_time TIME,
    bed_number VARCHAR(50) NOT NULL,
    ward_name VARCHAR(100),
    room_type VARCHAR(100),
    daily_bed_charge DECIMAL(10, 2) DEFAULT 0.00,
    admitting_doctor VARCHAR(150) NOT NULL,
    reference_doctor VARCHAR(150),
    insurance_company VARCHAR(150),
    provisional_diagnosis TEXT,
    initial_deposit DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('Admitted', 'Discharged', 'Transferred') DEFAULT 'Admitted',
    discharge_id VARCHAR(20),
    discharge_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uhid) REFERENCES patients(uhid) ON UPDATE CASCADE,
    FOREIGN KEY (bed_number) REFERENCES beds(bed_number) ON UPDATE CASCADE,
    INDEX idx_admission_status (status)
);

-- 6. Discharges & Clinical Summaries
CREATE TABLE discharges (
    id VARCHAR(20) PRIMARY KEY,
    discharge_no VARCHAR(50) UNIQUE NOT NULL,
    admission_id VARCHAR(20) NOT NULL,
    ipd_no VARCHAR(50) NOT NULL,
    patient_id VARCHAR(20) NOT NULL,
    uhid VARCHAR(20) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    admission_date DATE,
    discharge_date DATE NOT NULL,
    discharge_time TIME,
    condition_on_discharge ENUM('Recovered', 'Improved', 'LAMA', 'Referred', 'Deceased') NOT NULL,
    final_diagnosis TEXT NOT NULL,
    treatment_summary TEXT,
    investigation_summary TEXT,
    operative_notes TEXT,
    discharge_medications TEXT,
    follow_up_instructions TEXT,
    follow_up_date DATE,
    discharging_doctor_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admission_id) REFERENCES admissions(id) ON UPDATE CASCADE
);

-- 7. Advance Deposits & Part Payments
CREATE TABLE deposits (
    id VARCHAR(20) PRIMARY KEY,
    receipt_no VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(20) NOT NULL,
    uhid VARCHAR(20) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    ipd_no VARCHAR(50),
    deposit_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    transaction_ref VARCHAR(100),
    authorized_by VARCHAR(100),
    remarks TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uhid) REFERENCES patients(uhid) ON UPDATE CASCADE
);

-- 8. Inpatient Doctor Visits & Procedures
CREATE TABLE dr_visits_procedures (
    id VARCHAR(20) PRIMARY KEY,
    admission_id VARCHAR(20) NOT NULL,
    ipd_no VARCHAR(50),
    uhid VARCHAR(20) NOT NULL,
    patient_name VARCHAR(150),
    entry_date DATE NOT NULL,
    entry_type ENUM('Doctor Visit', 'Procedure', 'Nursing') NOT NULL,
    doctor_name VARCHAR(150) NOT NULL,
    head_description VARCHAR(255) NOT NULL,
    rate DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 1,
    amount DECIMAL(10, 2) NOT NULL,
    bed_number VARCHAR(50),
    ward_name VARCHAR(100),
    remark TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Laboratory & Diagnostic Investigations
CREATE TABLE investigations (
    id VARCHAR(20) PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(20) NOT NULL,
    uhid VARCHAR(20) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    order_date DATE NOT NULL,
    doctor_name VARCHAR(150) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sample_status ENUM('Pending', 'Sample Collected', 'Processing', 'Completed', 'Delivered') DEFAULT 'Pending',
    lab_id VARCHAR(50),
    results JSON,
    impression TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 10. Medical, MLC & Death Certificates
CREATE TABLE certificates (
    id VARCHAR(20) PRIMARY KEY,
    cert_type ENUM('MEDICAL', 'MLC', 'DEATH', 'FITNESS') NOT NULL,
    certificate_no VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(20) NOT NULL,
    uhid VARCHAR(20) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    age VARCHAR(10),
    gender VARCHAR(10),
    doctor_name VARCHAR(150) NOT NULL,
    issue_date DATE NOT NULL,
    diagnosis TEXT,
    rest_from DATE,
    rest_to DATE,
    fitness_date DATE,
    police_station VARCHAR(150),
    buckle_no VARCHAR(50),
    brought_by VARCHAR(150),
    examination_time TIME,
    identification_marks TEXT,
    injury_details TEXT,
    date_of_death DATE,
    time_of_death TIME,
    cause_of_death_immediate VARCHAR(255),
    cause_of_death_antecedent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3. Step-by-Step Repository Substitution

When ready to switch to MySQL:

1. Configure `settings.py`:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'mixu_hospital_emr',
           'USER': 'hospital_admin',
           'PASSWORD': '<secure_password>',
           'HOST': 'localhost',
           'PORT': '3306',
           'OPTIONS': {
               'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
           }
       }
   }
   ```

2. Run JSON-to-MySQL data migration script:
   - A single management command `python backend/manage.py migrate_json_to_mysql` iterates through each `backend/data/*.json` file and bulk-inserts existing records directly into MySQL tables using `bulk_create(ignore_conflicts=True)`.

3. Swap singleton repository instances:
   - Instead of initializing `DepartmentRepository(BaseJSONRepository)`, instantiate `DepartmentMySQLRepository(BaseMySQLRepository)`.
   - Views (`domain_views.py`), URLs, and frontend components remain **100% untouched**!
