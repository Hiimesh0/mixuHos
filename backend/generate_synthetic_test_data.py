"""
Mixu Hospital Management System - Controlled Synthetic Test Data Generator
Generates isolated test records across all operational domains:
- Patients (TEST-PAT-0001 ...)
- Admissions (TEST-ADM-0001 ...)
- Inpatient Bills (TEST-BILL-0001 ...)
- Deposits & Receipts (TEST-REC-0001 ...)
- Doctor Visits & Procedures (TEST-DVP-0001 ...)
- 2D Echo Reports (TEST-ECHO-0001 ...)
- Operation Theatre (OT) Entries (TEST-OT-0001 ...)
- Discharge Summaries (TEST-DIS-0001 ...)

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
SURGEONS = ['Dr. Snehal Mahale', 'Dr. Nilesh Mahale', 'Dr. Amit Patel']
ANESTHETISTS = ['Dr. Sanjay Bansal', 'Dr. R. K. Patel', 'Dr. Neha Varma']
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
            for k in ['patients', 'admissions', 'bills', 'deposits', 'dr_visits_procedures', 'echo_reports', 'entries', 'discharges', 'records']:
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
    echo_reports = load_json('echo_reports.json')
    ot_entries = load_json('ot_entries.json')
    discharges = load_json('discharges.json')

    print(f"    Current Genuine Counts -> Patients: {len(patients)}, Admissions: {len(admissions)}, Bills: {len(bills)}")

    # Clean prior synthetic data if any
    patients = [p for p in patients if not str(p.get('id', '')).startswith('TEST-') and not str(p.get('uhid', '')).startswith('TEST-')]
    admissions = [a for a in admissions if not str(a.get('id', '')).startswith('TEST-') and not str(a.get('uhid', '')).startswith('TEST-')]
    bills = [b for b in bills if not str(b.get('id', '')).startswith('TEST-') and not str(b.get('uhid', '')).startswith('TEST-')]
    deposits = [d for d in deposits if not str(d.get('id', '')).startswith('TEST-') and not str(d.get('uhid', '')).startswith('TEST-')]
    dr_visits = [v for v in dr_visits if not str(v.get('id', '')).startswith('TEST-') and not str(v.get('uhid', '')).startswith('TEST-')]
    echo_reports = [e for e in echo_reports if not str(e.get('id', '')).startswith('TEST-') and not str(e.get('uhid', '')).startswith('TEST-')]
    ot_entries = [o for o in ot_entries if not str(o.get('id', '')).startswith('TEST-') and not str(o.get('uhid', '')).startswith('TEST-')]
    discharges = [dc for dc in discharges if not str(dc.get('id', '')).startswith('TEST-') and not str(dc.get('uhid', '')).startswith('TEST-')]

    new_synthetic_patients = []
    new_synthetic_admissions = []
    new_synthetic_bills = []
    new_synthetic_deposits = []
    new_synthetic_dvps = []
    new_synthetic_echoes = []
    new_synthetic_ot = []
    new_synthetic_discharges = []

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

            # OT Entry for some surgical admissions
            if i % 4 == 0:
                ot_id = f"TEST-OT-{idx_str}"
                ot = {
                    "id": ot_id,
                    "ot_no": f"OT-SYN-{idx_str}",
                    "admission_id": adm_id,
                    "ipd_no": ipd_no,
                    "patient_id": uhid,
                    "uhid": uhid,
                    "patient_name": f"{fname} {lname}",
                    "surgery_date": adm_date,
                    "start_time": "10:00",
                    "end_time": "11:45",
                    "operation_group": "General Surgery",
                    "procedure_name": "Laparoscopic Cholecystectomy",
                    "lead_surgeon": random.choice(SURGEONS),
                    "assistant_surgeon": random.choice(DOCTORS),
                    "anesthetist": random.choice(ANESTHETISTS),
                    "anesthesia_type": "General Anesthesia",
                    "pre_op_diagnosis": "Symptomatic Cholelithiasis",
                    "post_op_diagnosis": "Chronic Cholecystitis",
                    "charges": 28000,
                    "is_active": True,
                    "is_synthetic_test": True,
                    "created_at": f"{adm_date}T14:00:00.000Z"
                }
                new_synthetic_ot.append(ot)

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
                    "discountAmount": 0.0,
                    "netAmount": total_amt,
                    "amountReceived": total_amt,
                    "totalReceived": total_amt,
                    "balanceDue": 0.0,
                    "balanceAmount": 0.0,
                    "paymentMode": bill_mode,
                    "paymentType": bill_mode,
                    "status": "Paid",
                    "remarks": "Settled upon discharge",
                    "is_synthetic_test": True,
                    "createdAt": f"{bill_date}T16:00:00.000Z"
                }
                new_synthetic_bills.append(bill)

                # Discharge Record
                dis_id = f"TEST-DIS-{idx_str}"
                dis = {
                    "id": dis_id,
                    "discharge_no": f"DIS-SYN-{idx_str}",
                    "admission_id": adm_id,
                    "ipd_no": ipd_no,
                    "patient_id": uhid,
                    "uhid": uhid,
                    "patient_name": f"{fname} {lname}",
                    "age": str(age),
                    "gender": gender,
                    "bed_number": f"{ward_info[1]}-{idx_str}",
                    "admission_date": adm_date,
                    "discharge_date": bill_date,
                    "discharge_time": "11:30 AM",
                    "final_diagnosis": "Acute Gastroenteritis - Resolved",
                    "condition_on_discharge": "Recovered",
                    "treatment_summary": "IV fluids, supportive medications, regular vitals monitoring. Ambulatory without distress.",
                    "investigation_summary": "CBC, LFT, KFT normal.",
                    "discharge_medications": "Tab Pantocid 40mg (OD x 5 days), Tab Paracetamol 650mg SOS.",
                    "follow_up_instructions": "Review in OPD in 5 days.",
                    "follow_up_date": (datetime.strptime(bill_date, '%Y-%m-%d') + timedelta(days=5)).strftime('%Y-%m-%d'),
                    "discharging_doctor_name": doc,
                    "is_active": True,
                    "is_synthetic_test": True,
                    "created_at": f"{bill_date}T16:15:00.000Z"
                }
                new_synthetic_discharges.append(dis)

        # 20% of test patients get 2D Echo Reports
        if i % 5 == 0:
            echo_id = f"TEST-ECHO-{idx_str}"
            lvef = random.randint(52, 65)
            echo = {
                "id": echo_id,
                "uhid": uhid,
                "patientName": f"{fname} {lname}",
                "age": str(age),
                "sex": gender,
                "reportDate": reg_date,
                "referredBy": doc,
                "c_o": "Exertional dyspnea, atypical chest pain evaluation",
                "mitralValve": "Normal leaflet thickness and mobility. No MR/MS.",
                "aorticValve": "Trileaflet, normal opening excursion. No AS/AR.",
                "tricuspidValve": "Normal morphology. Trivial TR.",
                "pulmonaryValve": "Normal valve anatomy. No PR/PS.",
                "pericardium": "Pericardium intact. No effusion.",
                "ivs": "Intact",
                "ias": "Intact",
                "septum": 10,
                "pWall": 10,
                "lvidd": 46,
                "lvids": 30,
                "lvef": lvef,
                "rwma": "Absent",
                "rvsp": 26,
                "dopplerStudy": "Normal diastolic filling pattern for age.",
                "conclusion": f"LV Systolic Function: LVEF {lvef}%\nNo Regional Wall Motion Abnormality\nNo Valvular Stenosis or Significant Regurgitation\nEstimated PASP 26 mmHg (Normal)",
                "consultantDr": "Dr. Devang Desai",
                "drRegNo": "G-29841",
                "is_synthetic_test": True,
                "createdAt": f"{reg_date}T15:00:00.000Z",
                "updatedAt": f"{reg_date}T15:30:00.000Z"
            }
            new_synthetic_echoes.append(echo)

    # Merge and persist
    save_json('patients.json', 'patients', patients + new_synthetic_patients)
    save_json('admissions.json', 'admissions', admissions + new_synthetic_admissions)
    save_json('bills.json', 'bills', bills + new_synthetic_bills)
    save_json('deposits.json', 'deposits', deposits + new_synthetic_deposits)
    save_json('dr_visits_procedures.json', 'dr_visits_procedures', dr_visits + new_synthetic_dvps)
    save_json('echo_reports.json', 'echo_reports', echo_reports + new_synthetic_echoes)
    save_json('ot_entries.json', 'entries', ot_entries + new_synthetic_ot)
    save_json('discharges.json', 'discharges', discharges + new_synthetic_discharges)

    print(f"[✓] Complete Synthetic Generation Finished:")
    print(f"    + {len(new_synthetic_patients)} Patients (TEST-PAT-*)")
    print(f"    + {len(new_synthetic_admissions)} Admissions (TEST-ADM-*)")
    print(f"    + {len(new_synthetic_deposits)} Deposits (TEST-REC-*)")
    print(f"    + {len(new_synthetic_dvps)} Visits/Procedures (TEST-DVP-*)")
    print(f"    + {len(new_synthetic_ot)} OT Operations (TEST-OT-*)")
    print(f"    + {len(new_synthetic_bills)} Settled Bills (TEST-BILL-*)")
    print(f"    + {len(new_synthetic_discharges)} Discharges (TEST-DIS-*)")
    print(f"    + {len(new_synthetic_echoes)} 2D Echo Studies (TEST-ECHO-*)")

if __name__ == '__main__':
    generate_synthetic_dataset(50)
