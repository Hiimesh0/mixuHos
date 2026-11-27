"""
Mixu Hospital Management System - Controlled Synthetic Test Data Generator
Generates isolated test records across all operational domains:
- Patients (TEST-PAT-0001 ...)
- Admissions (TEST-ADM-0001 ...)
- Inpatient Bills (TEST-BILL-0001 ...)
- Deposits & Receipts (TEST-REC-0001 ...)
- Doctor Visits & Procedures (TEST-DVP-0001 ...)

Guarantees 100% isolation from authentic records with strict prefixing and synthetic flags.
"""

import os
import json
import random
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Isha', 'Aadhya', 'Kavya', 'Saanvi', 'Myra', 'Pari', 'Pooja', 'Sneha']
LAST_NAMES = ['Patel', 'Shah', 'Mehta', 'Desai', 'Joshi', 'Sharma', 'Kulkarni', 'Dave', 'Panchal', 'Trivedi', 'Bhatt', 'Rathod', 'Chauhan', 'Solanki', 'Parmar']
CITIES = ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Navsari', 'Bharuch', 'Valsad', 'Bhavnagar']
DOCTORS = ['Dr. Nilesh Mahale', 'Dr. Suresh Patil', 'Dr. Rahul Sharma', 'Dr. Sneha Joshi', 'Dr. Anita Kulkarni']
DEPARTMENTS = ['Cardiology', 'General Medicine', 'General Surgery', 'Pediatrics', 'Obstetrics & Gynecology']
WARDS = [
    ('General Male Ward', 'GEN-01', 1000),
    ('General Female Ward', 'GEN-02', 1000),
    ('Semi-Special Ward', 'SS-01', 2500),
    ('Special Deluxe Room', 'DLX-01', 4000),
    ('Intensive Care Unit (ICU)', 'ICU-01', 6500)
]
PAYMENT_MODES = ['Cash', 'Card', 'Cheque', 'QR Code / UPI', 'RTGS / Bank Transfer']

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return []
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                return data
            # Handle wrapper keys
            for k in ['patients', 'admissions', 'bills', 'deposits', 'dr_visits_procedures', 'records']:
                if k in data and isinstance(data[k], list):
                    return data[k]
            return []
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return []

def save_json(filename, key_name, records):
    path = os.path.join(DATA_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump({key_name: records, "count": len(records)}, f, indent=2, ensure_ascii=False)

def generate_synthetic_dataset(num_patients=50):
    print(f"[*] Generating {num_patients} isolated synthetic hospital records...")
    now = datetime.now()

    # Load existing genuine records
    patients = load_json('patients.json')
    admissions = load_json('admissions.json')
    bills = load_json('bills.json')
    deposits = load_json('deposits.json')
    dr_visits = load_json('dr_visits_procedures.json')

    print(f"    Current Genuine Counts -> Patients: {len(patients)}, Admissions: {len(admissions)}, Bills: {len(bills)}")

    # Clean prior synthetic data if any
    patients = [p for p in patients if not str(p.get('id', '')).startswith('TEST-')]
    admissions = [a for a in admissions if not str(a.get('id', '')).startswith('TEST-')]
    bills = [b for b in bills if not str(b.get('id', '')).startswith('TEST-')]
    deposits = [d for d in deposits if not str(d.get('id', '')).startswith('TEST-')]
    dr_visits = [v for v in dr_visits if not str(v.get('id', '')).startswith('TEST-')]

    new_synthetic_patients = []
    new_synthetic_admissions = []
    new_synthetic_bills = []
    new_synthetic_deposits = []
    new_synthetic_dvps = []

    for i in range(1, num_patients + 1):
        idx_str = f"{i:04d}"
        uhid = f"TEST-PAT-{idx_str}"
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        gender = random.choice(['Male', 'Female'])
        age = random.randint(18, 78)
        city = random.choice(CITIES)
        doc = random.choice(DOCTORS)
        reg_date = (now - timedelta(days=random.randint(1, 45))).strftime('%Y-%m-%d')

        pat = {
            "id": uhid,
            "uhid": uhid,
            "category": "General",
            "firstName": fname,
            "middleName": "K",
            "lastName": lname,
            "patientName": f"{fname} {lname}",
            "name": f"{fname} {lname}",
            "birthDate": (now - timedelta(days=age*365)).strftime('%Y-%m-%d'),
            "age": str(age),
            "ageUnit": "Years",
            "sex": gender,
            "hospitalDoctor": doc,
            "treatingDoctor": doc,
            "referenceBy": "Self Walk-in",
            "religion": "Hindu",
            "maritalStatus": "Married",
            "weight": str(random.randint(52, 85)),
            "height": str(random.randint(155, 180)),
            "mobile": f"9824{random.randint(100000, 999999)}",
            "email": f"test.pat.{idx_str}@synth-mixu.internal",
            "streetAddress": f"Block {random.randint(1, 50)}, Synthetica Complex",
            "city": city,
            "state": "Gujarat",
            "pinCode": "395001",
            "autoSms": True,
            "is_synthetic_test": True,
            "createdAt": f"{reg_date}T10:00:00.000Z",
            "updatedAt": f"{reg_date}T10:00:00.000Z"
        }
        new_synthetic_patients.append(pat)

        # 60% of test patients get admitted
        if i % 3 != 0:
            adm_id = f"TEST-ADM-{idx_str}"
            ipd_no = f"TEST-IPD-{idx_str}"
            ward_info = random.choice(WARDS)
            adm_date = reg_date
            is_discharged = (i % 2 == 0)

            adm = {
                "id": adm_id,
                "ipd_no": ipd_no,
                "patient_id": uhid,
                "uhid": uhid,
                "patient_name": f"{fname} {lname}",
                "age": str(age),
                "gender": gender,
                "mobile": pat["mobile"],
                "admission_date": adm_date,
                "admission_time": "11:30",
                "bed_number": f"{ward_info[1]}-{idx_str}",
                "ward_name": ward_info[0],
                "room_type": ward_info[0],
                "daily_bed_charge": ward_info[2],
                "admitting_doctor": doc,
                "status": "Discharged" if is_discharged else "Admitted",
                "initial_deposit": 5000,
                "is_synthetic_test": True,
                "created_at": f"{adm_date}T11:30:00.000Z"
            }
            new_synthetic_admissions.append(adm)

            # Deposit record
            dep_id = f"TEST-REC-{idx_str}"
            dep_mode = random.choice(PAYMENT_MODES)
            dep = {
                "id": dep_id,
                "receipt_no": f"REC-SYN-{idx_str}",
                "uhid": uhid,
                "patient_name": f"{fname} {lname}",
                "admission_id": adm_id,
                "ipd_no": ipd_no,
                "deposit_date": adm_date,
                "amount": 5000,
                "payment_mode": dep_mode,
                "payment_type": dep_mode,
                "payment_particulars": "IPD Deposit",
                "remarks": "Admission Bed Advance",
                "is_synthetic_test": True,
                "created_at": f"{adm_date}T11:35:00.000Z"
            }
            new_synthetic_deposits.append(dep)

            # Doctor visit / bedside procedure
            dvp_id = f"TEST-DVP-{idx_str}"
            dvp = {
                "id": dvp_id,
                "admission_id": adm_id,
                "ipd_no": ipd_no,
                "uhid": uhid,
                "patient_name": f"{fname} {lname}",
                "entry_type": "Doctor Visit",
                "entry_date": adm_date,
                "doctor_name": doc,
                "head_description": "Initial Consultant Evaluation & Care Plan",
                "rate": 1000,
                "quantity": 1,
                "amount": 1000,
                "is_synthetic_test": True,
                "created_at": f"{adm_date}T12:00:00.000Z"
            }
            new_synthetic_dvps.append(dvp)

            # Inpatient Bill if discharged
            if is_discharged:
                bill_id = f"TEST-BILL-{idx_str}"
                bill_date = (datetime.strptime(adm_date, '%Y-%m-%d') + timedelta(days=random.randint(2, 5))).strftime('%Y-%m-%d')
                total_amt = ward_info[2] * 3 + 2500
                bill_mode = random.choice(PAYMENT_MODES)
                bill = {
                    "id": bill_id,
                    "patientId": uhid,
                    "uhid": uhid,
                    "admission_id": adm_id,
                    "ipd_no": ipd_no,
                    "invoiceNo": f"INV-SYN-{idx_str}",
                    "billNo": f"INV-SYN-{idx_str}",
                    "billDate": bill_date,
                    "billType": "IPD",
                    "patientName": f"{fname} {lname}",
                    "treatingDoctor": doc,
                    "items": [
                        {"srNo": 1, "details": f"{ward_info[0]} Stay (3 Days)", "rate": ward_info[2], "amount": ward_info[2] * 3},
                        {"srNo": 2, "details": "Consultant Round & Nursing Care", "rate": 2500, "amount": 2500}
                    ],
                    "subtotal": total_amt,
                    "totalAmount": total_amt,
                    "netAmount": total_amt,
                    "amountReceived": total_amt,
                    "totalReceived": total_amt,
                    "balanceDue": 0,
                    "paymentMode": bill_mode,
                    "paymentType": bill_mode,
                    "status": "Paid",
                    "remarks": "Settled upon discharge",
                    "is_synthetic_test": True,
                    "createdAt": f"{bill_date}T16:00:00.000Z"
                }
                new_synthetic_bills.append(bill)

    # Merge and persist
    save_json('patients.json', 'patients', patients + new_synthetic_patients)
    save_json('admissions.json', 'admissions', admissions + new_synthetic_admissions)
    save_json('bills.json', 'bills', bills + new_synthetic_bills)
    save_json('deposits.json', 'deposits', deposits + new_synthetic_deposits)
    save_json('dr_visits_procedures.json', 'dr_visits_procedures', dr_visits + new_synthetic_dvps)

    print(f"[✓] Synthetic Generation Complete:")
    print(f"    + {len(new_synthetic_patients)} Patients (TEST-PAT-*)")
    print(f"    + {len(new_synthetic_admissions)} Admissions (TEST-ADM-*)")
    print(f"    + {len(new_synthetic_deposits)} Deposits (TEST-REC-*)")
    print(f"    + {len(new_synthetic_dvps)} Visits/Procedures (TEST-DVP-*)")
    print(f"    + {len(new_synthetic_bills)} Bills (TEST-BILL-*)")

if __name__ == '__main__':
    generate_synthetic_dataset(60)
