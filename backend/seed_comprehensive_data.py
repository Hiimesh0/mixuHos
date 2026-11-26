"""
Comprehensive Hospital EMR Test Data Seeder
Mixu Infosystem Hospital Management System

Populates:
- 55+ Patients (varied ages, genders, demographics, categories)
- 12 Doctors (Cardiology, Surgery, Ortho, Peds, Gyn, Med, etc.)
- 35 Medicines (Tablets, Syrups, Injections, Ointments)
- 24 Beds (General, Semi-Special, Deluxe, ICU, ICCU)
- 16 Admissions (8 currently Admitted, 8 Discharged)
- 8 Discharges (linked to 8 discharged admissions)
- 18 Deposits / Receipts (IPD & OPD)
- 22 Dr Visits & Procedures
- 12 OT Entries
- 25 Patient Bills (Paid, Partially Paid, Unpaid)
- 35 Patient Clinical Visits with complete Vitals (BP, PR, Temp, SpO2, Wt)
- 12 Echo Reports (matching echo report print format)
- 25 Lab Investigations (CBC, LFT, KFT, Lipid, HbA1c, Troponin)
- 15 Certificates (Medical Fitness, MLC, Death)

Guarantees ZERO orphaned foreign keys across all entities.
Safely updates backend/data/ and syncs with frontend/public/data/.
"""

import os
import json
import random
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
FRONTEND_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend', 'public', 'data'))
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(FRONTEND_DATA_DIR, exist_ok=True)

NOW = datetime.now()
def date_str(days_ago=0, hours_ago=0):
    dt = NOW - timedelta(days=days_ago, hours=hours_ago)
    return dt.strftime('%Y-%m-%d')

def datetime_iso(days_ago=0, hours_ago=0):
    dt = NOW - timedelta(days=days_ago, hours=hours_ago)
    return dt.isoformat()

# ==========================================
# 1. DOCTORS (12 Specialist Doctors)
# ==========================================
DOCTORS = [
    {
        "id": "DR-101",
        "drHosRef": "Hospital Doctor",
        "drType": "Consultant Physician",
        "title": "Dr.",
        "drName": "Nilesh Mahale",
        "degree": "MBBS, MD (Medicine)",
        "speciality": "General Medicine",
        "department": "General Medicine",
        "drRegNo": "G-23451",
        "hospitalName": True,
        "birthDate": "1980-05-14",
        "address": "A-402, Shivalik Heights, Adajan",
        "city": "Surat",
        "pinCode": "395009",
        "mobile": "9825100001",
        "phone": "0261-2780001",
        "email": "dr.nilesh.mahale@mixuhos.com",
        "charge": 500,
        "erCharge": 800,
        "visitingCharge": 600,
        "otCharges": 5000,
        "isActive": True
    },
    {
        "id": "DR-102",
        "drHosRef": "Hospital Doctor",
        "drType": "Chief Surgeon",
        "title": "Dr.",
        "drName": "Snehal Mahale",
        "degree": "MBBS, MS (General Surgery), FMAS",
        "speciality": "Laparoscopic & General Surgery",
        "department": "Surgery",
        "drRegNo": "G-24892",
        "hospitalName": True,
        "birthDate": "1982-11-20",
        "address": "B-101, Green Meadows, Vesu",
        "city": "Surat",
        "pinCode": "395007",
        "mobile": "9825100002",
        "phone": "0261-2780002",
        "email": "dr.snehal.mahale@mixuhos.com",
        "charge": 700,
        "erCharge": 1000,
        "visitingCharge": 800,
        "otCharges": 15000,
        "isActive": True
    },
    {
        "id": "DR-103",
        "drHosRef": "Visiting Consultant",
        "drType": "Interventional Cardiologist",
        "title": "Dr.",
        "drName": "Nikunj Vithalani",
        "degree": "MBBS, MD, DM (Cardiology)",
        "speciality": "Cardiology",
        "department": "Cardiology",
        "drRegNo": "G-31205",
        "hospitalName": False,
        "birthDate": "1978-03-12",
        "address": "C-504, Riverview Towers, Ring Road",
        "city": "Surat",
        "pinCode": "395002",
        "mobile": "9825100003",
        "phone": "0261-2780003",
        "email": "dr.nikunj.vithalani@mixuhos.com",
        "charge": 1000,
        "erCharge": 1500,
        "visitingCharge": 1200,
        "otCharges": 25000,
        "isActive": True
    },
    {
        "id": "DR-104",
        "drHosRef": "Visiting Consultant",
        "drType": "Consultant Cardiologist",
        "title": "Dr.",
        "drName": "Devang Desai",
        "degree": "MBBS, MD (Med), DNB (Cardiology)",
        "speciality": "Cardiology",
        "department": "Cardiology",
        "drRegNo": "G-29841",
        "hospitalName": False,
        "birthDate": "1981-08-25",
        "address": "Plot 42, City Light Road",
        "city": "Surat",
        "pinCode": "395007",
        "mobile": "9825100004",
        "phone": "0261-2780004",
        "email": "dr.devang.desai@mixuhos.com",
        "charge": 900,
        "erCharge": 1400,
        "visitingCharge": 1100,
        "otCharges": 22000,
        "isActive": True
    },
    {
        "id": "DR-105",
        "drHosRef": "Hospital Doctor",
        "drType": "Consultant Orthopedic Surgeon",
        "title": "Dr.",
        "drName": "Arvind Kejriwal",
        "degree": "MBBS, MS (Orthopedics)",
        "speciality": "Orthopedics & Joint Replacement",
        "department": "Orthopedics",
        "drRegNo": "G-33410",
        "hospitalName": True,
        "birthDate": "1983-09-18",
        "address": "401, Surya Complex, Majura Gate",
        "city": "Surat",
        "pinCode": "395001",
        "mobile": "9825100005",
        "phone": "0261-2780005",
        "email": "dr.arvind.kejriwal@mixuhos.com",
        "charge": 600,
        "erCharge": 900,
        "visitingCharge": 750,
        "otCharges": 18000,
        "isActive": True
    },
    {
        "id": "DR-106",
        "drHosRef": "Hospital Doctor",
        "drType": "Consultant Obstetrician & Gynecologist",
        "title": "Dr.",
        "drName": "Shalini Reddy",
        "degree": "MBBS, DGO, MD (OBGYN)",
        "speciality": "Obstetrics & Gynecology",
        "department": "Gynecology",
        "drRegNo": "G-35109",
        "hospitalName": True,
        "birthDate": "1985-02-14",
        "address": "Villa 12, Palm Beach, Dumas Road",
        "city": "Surat",
        "pinCode": "395007",
        "mobile": "9825100006",
        "phone": "0261-2780006",
        "email": "dr.shalini.reddy@mixuhos.com",
        "charge": 650,
        "erCharge": 950,
        "visitingCharge": 800,
        "otCharges": 16000,
        "isActive": True
    },
    {
        "id": "DR-107",
        "drHosRef": "Hospital Doctor",
        "drType": "Consultant Pediatrician",
        "title": "Dr.",
        "drName": "Rajesh Trivedi",
        "degree": "MBBS, MD (Pediatrics)",
        "speciality": "Pediatrics & Neonatology",
        "department": "Pediatrics",
        "drRegNo": "G-28910",
        "hospitalName": True,
        "birthDate": "1979-12-05",
        "address": "702, Avanti Enclave, Nanpura",
        "city": "Surat",
        "pinCode": "395001",
        "mobile": "9825100007",
        "phone": "0261-2780007",
        "email": "dr.rajesh.trivedi@mixuhos.com",
        "charge": 500,
        "erCharge": 800,
        "visitingCharge": 650,
        "otCharges": 8000,
        "isActive": True
    },
    {
        "id": "DR-108",
        "drHosRef": "Visiting Consultant",
        "drType": "Consultant Pulmonologist",
        "title": "Dr.",
        "drName": "Manish Chopra",
        "degree": "MBBS, MD (Pulmonary Medicine)",
        "speciality": "Chest & Respiratory Medicine",
        "department": "Pulmonology",
        "drRegNo": "G-36284",
        "hospitalName": False,
        "birthDate": "1984-06-30",
        "address": "12, Shanti Niketan, Athwa Lines",
        "city": "Surat",
        "pinCode": "395001",
        "mobile": "9825100008",
        "phone": "0261-2780008",
        "email": "dr.manish.chopra@mixuhos.com",
        "charge": 750,
        "erCharge": 1100,
        "visitingCharge": 900,
        "otCharges": 10000,
        "isActive": True
    },
    {
        "id": "DR-109",
        "drHosRef": "Visiting Consultant",
        "drType": "Consultant Neurologist",
        "title": "Dr.",
        "drName": "Anand Parikh",
        "degree": "MBBS, MD, DM (Neurology)",
        "speciality": "Neurology & Neuro-Physiology",
        "department": "Neurology",
        "drRegNo": "G-34502",
        "hospitalName": False,
        "birthDate": "1980-10-10",
        "address": "402, Harmony Heights, Ghod Dod Road",
        "city": "Surat",
        "pinCode": "395007",
        "mobile": "9825100009",
        "phone": "0261-2780009",
        "email": "dr.anand.parikh@mixuhos.com",
        "charge": 1200,
        "erCharge": 1800,
        "visitingCharge": 1500,
        "otCharges": 20000,
        "isActive": True
    },
    {
        "id": "DR-110",
        "drHosRef": "Hospital Doctor",
        "drType": "Chief Anesthesiologist",
        "title": "Dr.",
        "drName": "Sanjay Bansal",
        "degree": "MBBS, DA, MD (Anesthesiology)",
        "speciality": "Anesthesiology & Critical Care",
        "department": "Anesthesia",
        "drRegNo": "G-27419",
        "hospitalName": True,
        "birthDate": "1977-04-18",
        "address": "Flat 303, Tulip Residency, Rander",
        "city": "Surat",
        "pinCode": "395005",
        "mobile": "9825100010",
        "phone": "0261-2780010",
        "email": "dr.sanjay.bansal@mixuhos.com",
        "charge": 600,
        "erCharge": 900,
        "visitingCharge": 750,
        "otCharges": 12000,
        "isActive": True
    },
    {
        "id": "DR-111",
        "drHosRef": "Visiting Consultant",
        "drType": "Consultant Nephrologist",
        "title": "Dr.",
        "drName": "Vikram Sethi",
        "degree": "MBBS, MD, DM (Nephrology)",
        "speciality": "Nephrology & Renal Medicine",
        "department": "Nephrology",
        "drRegNo": "G-37890",
        "hospitalName": False,
        "birthDate": "1983-01-22",
        "address": "501, Orchid Plaza, Ring Road",
        "city": "Surat",
        "pinCode": "395002",
        "mobile": "9825100011",
        "phone": "0261-2780011",
        "email": "dr.vikram.sethi@mixuhos.com",
        "charge": 900,
        "erCharge": 1300,
        "visitingCharge": 1000,
        "otCharges": 15000,
        "isActive": True
    },
    {
        "id": "DR-112",
        "drHosRef": "Hospital Doctor",
        "drType": "Consultant Pathologist",
        "title": "Dr.",
        "drName": "Ritu Saxena",
        "degree": "MBBS, MD (Pathology)",
        "speciality": "Clinical Pathology & Biochemistry",
        "department": "Pathology",
        "drRegNo": "G-32981",
        "hospitalName": True,
        "birthDate": "1986-07-08",
        "address": "B-204, Crystal Heights, Katargam",
        "city": "Surat",
        "pinCode": "395004",
        "mobile": "9825100012",
        "phone": "0261-2780012",
        "email": "dr.ritu.saxena@mixuhos.com",
        "charge": 400,
        "erCharge": 600,
        "visitingCharge": 500,
        "otCharges": 0,
        "isActive": True
    }
]

# ==========================================
# 2. MEDICINES (35 Medicines across forms)
# ==========================================
MEDICINES = [
    {"id": "MED-1001", "brandName": "Paracetamol 650 (Dolo)", "genericName": "Paracetamol / Acetaminophen", "medicineGroup": "Analgesics & Antipyretics", "dosageForm": "Tablet", "strength": "650 mg", "frequency": "1-0-1", "availability": "In Stock", "remark1": "Take after food", "remark2": "For fever/pain", "stock": 1200, "mrp": 32.50},
    {"id": "MED-1002", "brandName": "Telma 40", "genericName": "Telmisartan", "medicineGroup": "Antihypertensives", "dosageForm": "Tablet", "strength": "40 mg", "frequency": "1-0-0", "availability": "In Stock", "remark1": "Morning after breakfast", "remark2": "BP control", "stock": 850, "mrp": 140.00},
    {"id": "MED-1003", "brandName": "Amlong 5", "genericName": "Amlodipine Besylate", "medicineGroup": "Calcium Channel Blockers", "dosageForm": "Tablet", "strength": "5 mg", "frequency": "0-0-1", "availability": "In Stock", "remark1": "At bedtime", "remark2": "BP control", "stock": 600, "mrp": 45.00},
    {"id": "MED-1004", "brandName": "Atorva 20", "genericName": "Atorvastatin Calcium", "medicineGroup": "Lipid Lowering / Statins", "dosageForm": "Tablet", "strength": "20 mg", "frequency": "0-0-1", "availability": "In Stock", "remark1": "Night after dinner", "remark2": "Cholesterol", "stock": 950, "mrp": 185.00},
    {"id": "MED-1005", "brandName": "Pantocid 40", "genericName": "Pantoprazole Sodium", "medicineGroup": "Proton Pump Inhibitors", "dosageForm": "Tablet", "strength": "40 mg", "frequency": "1-0-0", "availability": "In Stock", "remark1": "Empty stomach morning", "remark2": "Acidity / GERD", "stock": 1400, "mrp": 120.00},
    {"id": "MED-1006", "brandName": "Glycomet GP 2", "genericName": "Metformin 500mg + Glimepiride 2mg", "medicineGroup": "Antidiabetics", "dosageForm": "Tablet", "strength": "500mg/2mg", "frequency": "1-0-1", "availability": "In Stock", "remark1": "Before major meals", "remark2": "Type 2 Diabetes", "stock": 750, "mrp": 160.00},
    {"id": "MED-1007", "brandName": "Clopilet 75", "genericName": "Clopidogrel", "medicineGroup": "Antiplatelet", "dosageForm": "Tablet", "strength": "75 mg", "frequency": "0-1-0", "availability": "In Stock", "remark1": "After lunch", "remark2": "Cardiac protection", "stock": 500, "mrp": 98.00},
    {"id": "MED-1008", "brandName": "Ecosprin 75", "genericName": "Enteric Coated Aspirin", "medicineGroup": "Antiplatelet", "dosageForm": "Tablet", "strength": "75 mg", "frequency": "0-1-0", "availability": "In Stock", "remark1": "After food", "remark2": "Blood thinner", "stock": 1600, "mrp": 14.50},
    {"id": "MED-1009", "brandName": "Augmentin 625 Duo", "genericName": "Amoxicillin 500mg + Clavulanic Acid 125mg", "medicineGroup": "Antibiotics", "dosageForm": "Tablet", "strength": "625 mg", "frequency": "1-0-1", "availability": "In Stock", "remark1": "Complete 5 day course", "remark2": "Bacterial infection", "stock": 420, "mrp": 210.00},
    {"id": "MED-1010", "brandName": "Azithral 500", "genericName": "Azithromycin", "medicineGroup": "Macrolide Antibiotics", "dosageForm": "Tablet", "strength": "500 mg", "frequency": "1-0-0", "availability": "In Stock", "remark1": "Take 1 hour before food", "remark2": "3 to 5 days", "stock": 380, "mrp": 135.00},
    {"id": "MED-1011", "brandName": "Cifran 500", "genericName": "Ciprofloxacin", "medicineGroup": "Fluoroquinolones", "dosageForm": "Tablet", "strength": "500 mg", "frequency": "1-0-1", "availability": "In Stock", "remark1": "Plenty of fluids", "remark2": "UTI / GI infection", "stock": 310, "mrp": 82.00},
    {"id": "MED-1012", "brandName": "Monocef 1g Inj", "genericName": "Ceftriaxone Sodium", "medicineGroup": "Cephalosporin Antibiotics", "dosageForm": "Injection", "strength": "1 gm", "frequency": "IV BD", "availability": "In Stock", "remark1": "Slow IV after AST test", "remark2": "Inpatient antibiotic", "stock": 250, "mrp": 78.00},
    {"id": "MED-1013", "brandName": "Pantop 40 IV Inj", "genericName": "Pantoprazole for Injection", "medicineGroup": "Proton Pump Inhibitors", "dosageForm": "Injection", "strength": "40 mg", "frequency": "IV OD", "availability": "In Stock", "remark1": "Reconstitute with NS", "remark2": "Stress ulcer prophylaxis", "stock": 400, "mrp": 55.00},
    {"id": "MED-1014", "brandName": "Ondem 4mg Inj", "genericName": "Ondansetron Hydrochloride", "medicineGroup": "Antiemetics", "dosageForm": "Injection", "strength": "4 mg / 2ml", "frequency": "IV SOS", "availability": "In Stock", "remark1": "Slow IV Push", "remark2": "For nausea/vomiting", "stock": 350, "mrp": 28.00},
    {"id": "MED-1015", "brandName": "Dynapar AQ Inj", "genericName": "Diclofenac Sodium 75mg/ml", "medicineGroup": "NSAIDs", "dosageForm": "Injection", "strength": "75 mg / 1ml", "frequency": "IM / IV SOS", "availability": "In Stock", "remark1": "Deep IM or slow IV", "remark2": "Severe pain", "stock": 290, "mrp": 42.00},
    {"id": "MED-1016", "brandName": "Tramadol 100 Inj", "genericName": "Tramadol Hydrochloride", "medicineGroup": "Opioid Analgesics", "dosageForm": "Injection", "strength": "100 mg / 2ml", "frequency": "IV SOS", "availability": "In Stock", "remark1": "Dilute in 100ml NS", "remark2": "Post-op analgesia", "stock": 180, "mrp": 65.00},
    {"id": "MED-1017", "brandName": "Ascoril D Plus Syrup", "genericName": "Dextromethorphan + Chlorpheniramine", "medicineGroup": "Cough Suppressants", "dosageForm": "Syrup", "strength": "100 ml", "frequency": "2 tsp TDS", "availability": "In Stock", "remark1": "After food", "remark2": "Dry cough", "stock": 240, "mrp": 115.00},
    {"id": "MED-1018", "brandName": "Grilinctus Syrup", "genericName": "Dextromethorphan + Guaiphenesin", "medicineGroup": "Expectorants", "dosageForm": "Syrup", "strength": "100 ml", "frequency": "10ml TDS", "availability": "In Stock", "remark1": "With warm water", "remark2": "Productive cough", "stock": 210, "mrp": 125.00},
    {"id": "MED-1019", "brandName": "Duolin Respules", "genericName": "Levosalbutamol + Ipratropium", "medicineGroup": "Bronchodilators", "dosageForm": "Inhalation", "strength": "2.5 ml", "frequency": "1 Respule TDS", "availability": "In Stock", "remark1": "Nebulization with O2", "remark2": "Asthma / COPD", "stock": 450, "mrp": 38.00},
    {"id": "MED-1020", "brandName": "Budecort 0.5 Respules", "genericName": "Budesonide", "medicineGroup": "Inhaled Corticosteroids", "dosageForm": "Inhalation", "strength": "0.5 mg / 2ml", "frequency": "1 Respule BD", "availability": "In Stock", "remark1": "Rinse mouth after neb", "remark2": "Airway inflammation", "stock": 390, "mrp": 48.00},
    {"id": "MED-1021", "brandName": "Betadine 5% Ointment", "genericName": "Povidone Iodine", "medicineGroup": "Antiseptics", "dosageForm": "Ointment", "strength": "20 gm", "frequency": "Apply BD", "availability": "In Stock", "remark1": "Clean wound first", "remark2": "Topical antiseptic", "stock": 180, "mrp": 75.00},
    {"id": "MED-1022", "brandName": "Silverex Ionic Gel", "genericName": "Silver Sulfadiazine + Chlorhexidine", "medicineGroup": "Topical Antibacterials", "dosageForm": "Ointment", "strength": "20 gm", "frequency": "Apply BD", "availability": "In Stock", "remark1": "For burns & wounds", "remark2": "Sterile dressing", "stock": 120, "mrp": 95.00},
    {"id": "MED-1023", "brandName": "Volini Pain Relief Gel", "genericName": "Diclofenac Diethylamine + Linseed", "medicineGroup": "Topical Analgesics", "dosageForm": "Ointment", "strength": "30 gm", "frequency": "Apply TDS", "availability": "In Stock", "remark1": "Gentle massage", "remark2": "Joint & muscular pain", "stock": 310, "mrp": 120.00},
    {"id": "MED-1024", "brandName": "Pan-D Capsule", "genericName": "Pantoprazole 40mg + Domperidone 30mg", "medicineGroup": "Antacids & Antiemetics", "dosageForm": "Capsule", "strength": "40mg/30mg", "frequency": "1-0-0", "availability": "In Stock", "remark1": "30 mins before breakfast", "remark2": "Acid reflux & nausea", "stock": 850, "mrp": 175.00},
    {"id": "MED-1025", "brandName": "Rosuvas 10", "genericName": "Rosuvastatin Calcium", "medicineGroup": "Statins", "dosageForm": "Tablet", "strength": "10 mg", "frequency": "0-0-1", "availability": "In Stock", "remark1": "Night after dinner", "remark2": "Dyslipidemia", "stock": 680, "mrp": 195.00},
    {"id": "MED-1026", "brandName": "Concor 5", "genericName": "Bisoprolol Fumarate", "medicineGroup": "Beta Blockers", "dosageForm": "Tablet", "strength": "5 mg", "frequency": "1-0-0", "availability": "In Stock", "remark1": "Morning with water", "remark2": "Rate control & HTN", "stock": 520, "mrp": 145.00},
    {"id": "MED-1027", "brandName": "Lasix 40", "genericName": "Furosemide", "medicineGroup": "Loop Diuretics", "dosageForm": "Tablet", "strength": "40 mg", "frequency": "1-0-0", "availability": "In Stock", "remark1": "Morning after light food", "remark2": "Edema / Heart failure", "stock": 610, "mrp": 22.00},
    {"id": "MED-1028", "brandName": "Deriphyllin Retard 150", "genericName": "Theophylline + Etofylline", "medicineGroup": "Bronchodilators", "dosageForm": "Tablet", "strength": "150 mg", "frequency": "1-0-1", "availability": "In Stock", "remark1": "After food", "remark2": "Chronic bronchitis", "stock": 430, "mrp": 40.00},
    {"id": "MED-1029", "brandName": "Shelcal 500", "genericName": "Calcium Carbonate + Vitamin D3", "medicineGroup": "Calcium Supplements", "dosageForm": "Tablet", "strength": "500 mg", "frequency": "0-1-0", "availability": "In Stock", "remark1": "After afternoon lunch", "remark2": "Bone health", "stock": 920, "mrp": 130.00},
    {"id": "MED-1030", "brandName": "Becosules Z Capsules", "genericName": "B-Complex Forte + Vitamin C + Zinc", "medicineGroup": "Multivitamins", "dosageForm": "Capsule", "strength": "Forte", "frequency": "0-1-0", "availability": "In Stock", "remark1": "After lunch daily", "remark2": "Nutritional support", "stock": 1100, "mrp": 52.00},
    {"id": "MED-1031", "brandName": "Neurobion Forte", "genericName": "Vitamin B1 + B6 + B12", "medicineGroup": "Neurotropic Vitamins", "dosageForm": "Tablet", "strength": "Forte", "frequency": "1-0-0", "availability": "In Stock", "remark1": "After breakfast", "remark2": "Peripheral neuropathy", "stock": 1300, "mrp": 42.00},
    {"id": "MED-1032", "brandName": "Montair LC", "genericName": "Montelukast 10mg + Levocetirizine 5mg", "medicineGroup": "Antiallergic / Antiasthmatic", "dosageForm": "Tablet", "strength": "10mg/5mg", "frequency": "0-0-1", "availability": "In Stock", "remark1": "At bedtime", "remark2": "Allergic rhinitis", "stock": 740, "mrp": 195.00},
    {"id": "MED-1033", "brandName": "Metrogyl 400", "genericName": "Metronidazole", "medicineGroup": "Antiamoebic & Antibacterial", "dosageForm": "Tablet", "strength": "400 mg", "frequency": "1-0-1", "availability": "In Stock", "remark1": "Take after meals", "remark2": "Amoebiasis / Anaerobic", "stock": 580, "mrp": 26.00},
    {"id": "MED-1034", "brandName": "Cremaffin Plus Syrup", "genericName": "Liquid Paraffin + Milk of Magnesia", "medicineGroup": "Laxatives", "dosageForm": "Syrup", "strength": "225 ml", "frequency": "2 tbsp at night", "availability": "In Stock", "remark1": "With glass of water", "remark2": "Constipation relief", "stock": 190, "mrp": 165.00},
    {"id": "MED-1035", "brandName": "Ciplox Eye Drops", "genericName": "Ciprofloxacin Ophthalmic 0.3%", "medicineGroup": "Ophthalmic Antibiotics", "dosageForm": "Drops", "strength": "10 ml", "frequency": "1 drop QDS", "availability": "In Stock", "remark1": "Both eyes as advised", "remark2": "Conjunctivitis", "stock": 260, "mrp": 24.00}
]

# ==========================================
# 3. 55+ PATIENTS (Varied Demographics)
# ==========================================
PATIENT_NAMES = [
    ("Aarav", "Kishore", "Patel", "Male", 32, "Years", "9876543201", "A-12, Krishna Nagar, Adajan", "Surat"),
    ("Priya", "Ramesh", "Sharma", "Female", 28, "Years", "9876543202", "B-204, Shivam Flats, Vesu", "Surat"),
    ("Rajesh", "Govind", "Mehta", "Male", 58, "Years", "9876543203", "14, Shanti Niketan, City Light", "Surat"),
    ("Sunita", "Dinesh", "Shah", "Female", 52, "Years", "9876543204", "Flat 302, Riverview, Nanpura", "Surat"),
    ("Vikram", "Suresh", "Joshi", "Male", 45, "Years", "9876543205", "45, Gokul Society, Katargam", "Surat"),
    ("Ananya", "Naveen", "Rao", "Female", 24, "Years", "9876543206", "C-101, Green Park, Athwa", "Surat"),
    ("Rohan", "Prakash", "Verma", "Male", 39, "Years", "9876543207", "88, Silver Nest, Varachha", "Surat"),
    ("Deepa", "Santosh", "Kulkarni", "Female", 48, "Years", "9876543208", "E-501, Tulsi Enclave, Rander", "Surat"),
    ("Suresh", "Bhavik", "Nair", "Male", 62, "Years", "9876543209", "12, Ambika Nagar, Udhna", "Surat"),
    ("Meera", "Kamlesh", "Pillai", "Female", 35, "Years", "9876543210", "Block D, Royal Palms, Vesu", "Surat"),
    ("Amit", "Harish", "Chauhan", "Male", 41, "Years", "9876543211", "90, Sardar Patel Road", "Surat"),
    ("Kavita", "Manish", "Desai", "Female", 31, "Years", "9876543212", "72, Althan Road, Althan", "Surat"),
    ("Dharmesh", "Jayesh", "Prajapati", "Male", 50, "Years", "9876543213", "B-44, Hari Om Nagar, Katargam", "Surat"),
    ("Bhavna", "Ashok", "Pandya", "Female", 43, "Years", "9876543214", "102, Shivalik Villa, Pal", "Surat"),
    ("Ketan", "Ramanlal", "Modi", "Male", 67, "Years", "9876543215", "Flat 405, Nilkanth Apt, Nanpura", "Surat"),
    ("Rekha", "Mahesh", "Solanki", "Female", 60, "Years", "9876543216", "18, Shiv Shakti Society, Varachha", "Surat"),
    ("Nitin", "Chimanlal", "Gajjar", "Male", 54, "Years", "9876543217", "A-303, Maruti Residency, Adajan", "Surat"),
    ("Geeta", "Pradeep", "Trivedi", "Female", 37, "Years", "9876543218", "C-12, Surya Nagar, Bhatar", "Surat"),
    ("Manish", "Kanti", "Vekariya", "Male", 29, "Years", "9876543219", "54, Yogi Chowk, Puna Gam", "Surat"),
    ("Hansa", "Lalit", "Kanani", "Female", 56, "Years", "9876543220", "Plot 105, Sarthana Jakat Naka", "Surat"),
    ("Pankaj", "Vithal", "Dholakiya", "Male", 49, "Years", "9876543221", "B-601, Pramukh Heights, Vesu", "Surat"),
    ("Shilpa", "Bharat", "Choksi", "Female", 46, "Years", "9876543222", "15, Parle Point, Ghod Dod Road", "Surat"),
    ("Kishore", "Naran", "Balar", "Male", 64, "Years", "9876543223", "301, Diamond Tower, Mini Bazar", "Surat"),
    ("Jayshree", "Rasik", "Radadiya", "Female", 59, "Years", "9876543224", "44, Shyam Nagar, Hirabaug", "Surat"),
    ("Chetan", "Mohan", "Savani", "Male", 36, "Years", "9876543225", "22, Gokul Dham, Mota Varachha", "Surat"),
    ("Usha", "Vinod", "Sanghavi", "Female", 63, "Years", "9876543226", "A-201, Arihant Complex, Gopipura", "Surat"),
    ("Paresh", "Gunvant", "Vaghani", "Male", 44, "Years", "9876543227", "110, Suman Residency, Jahangirpura", "Surat"),
    ("Kokila", "Hasmukh", "Kathiriya", "Female", 51, "Years", "9876543228", "8, Patel Nagar, Dabholi", "Surat"),
    ("Bhavesh", "Narayan", "Kakadiya", "Male", 38, "Years", "9876543229", "B-14, Sharda Society, Katargam", "Surat"),
    ("Dakshaben", "Popatlal", "Gondaliya", "Female", 65, "Years", "9876543230", "Flat 502, Swaminarayan Nagar, Pal", "Surat"),
    ("Hitesh", "Maganbhai", "Moradiya", "Male", 42, "Years", "9876543231", "33, Anand Nagar, Amroli", "Surat"),
    ("Varsha", "Chhagan", "Golakiya", "Female", 34, "Years", "9876543232", "C-302, Radha Krishna Apt, Udhna", "Surat"),
    ("Mayur", "Jethalal", "Kikani", "Male", 31, "Years", "9876543233", "65, Gayatri Society, Pandesara", "Surat"),
    ("Ilaben", "Bachubhai", "Lathiya", "Female", 57, "Years", "9876543234", "Plot 19, Laxmi Nagar, Dindoli", "Surat"),
    ("Girish", "Manilal", "Dudhat", "Male", 53, "Years", "9876543235", "101, Shiv Darshan, Piplod", "Surat"),
    ("Neeta", "Kishore", "Sojitra", "Female", 40, "Years", "9876543236", "A-404, Rajhans Synfonia, Vesu", "Surat"),
    ("Kamlesh", "Damji", "Kevadiya", "Male", 47, "Years", "9876543237", "82, Maruti Nagar, Kosad", "Surat"),
    ("Alka", "Vallabh", "Mavani", "Female", 33, "Years", "9876543238", "16, Sardar Dham, Kapodra", "Surat"),
    ("Haresh", "Ramji", "Lukhi", "Male", 55, "Years", "9876543239", "701, Royal Palace, City Light", "Surat"),
    ("Sonal", "Gordhan", "Vora", "Female", 29, "Years", "9876543240", "28, Sundar Nagar, Rander Road", "Surat"),
    ("Ashwin", "Devji", "Thummar", "Male", 61, "Years", "9876543241", "B-102, Shreenathji Apt, Nanpura", "Surat"),
    ("Tara", "Kalyan", "Hirpara", "Female", 68, "Years", "9876543242", "4, Jain Society, Mahidharpura", "Surat"),
    ("Pravin", "Bhagvan", "Kumbhani", "Male", 48, "Years", "9876543243", "92, Vishwakarma Society, Katargam", "Surat"),
    ("Mina", "Shantila", "Jasani", "Female", 42, "Years", "9876543244", "Flat 204, Sahyog Towers, Majura Gate", "Surat"),
    ("Gautam", "Tribhuvan", "Bhimani", "Male", 37, "Years", "9876543245", "50, Royal Residency, Althan", "Surat"),
    ("Lata", "Natwarlal", "Chaniyara", "Female", 54, "Years", "9876543246", "C-401, Galaxy Heights, Palanpur", "Surat"),
    ("Mukesh", "Prabhudas", "Tanti", "Male", 66, "Years", "9876543247", "11, Green Avenue, Dumas", "Surat"),
    ("Ranjan", "Keshavji", "Koyani", "Female", 62, "Years", "9876543248", "602, Silicon Shoppers, Udhna", "Surat"),
    ("Tushar", "Harilal", "Virani", "Male", 35, "Years", "9876543249", "78, Madhav Baug, Varachha", "Surat"),
    ("Kiran", "Madhav", "Kheni", "Female", 27, "Years", "9876543250", "Plot 88, VIP Road, Vesu", "Surat"),
    ("Yogesh", "Bhimji", "Malaviya", "Male", 50, "Years", "9876543251", "104, Shreeram Complex, Adajan", "Surat"),
    ("Saroj", "Durlabh", "Gajera", "Female", 45, "Years", "9876543252", "23, Krishna Park, Katargam", "Surat"),
    ("Vipul", "Kurji", "Mangukiya", "Male", 40, "Years", "9876543253", "303, Western Plaza, Pal", "Surat"),
    ("Leela", "Mulji", "Kotadiya", "Female", 70, "Years", "9876543254", "5, Old City, Gopipura", "Surat"),
    ("Pratik", "Jayantibhai", "Dobariya", "Male", 26, "Years", "9876543255", "84, Avadh Utopia, Dumas Road", "Surat"),
    ("Bijal", "Jagdish", "Talaviya", "Female", 30, "Years", "9876543256", "C-201, Happy Home, Vesu", "Surat"),
    ("Chirag", "Ravjibhai", "Pansuriya", "Male", 33, "Years", "9876543257", "9, Shivalik Avenue, Jahangirpura", "Surat"),
    ("Diwali", "Dungarshi", "Kalasariya", "Female", 72, "Years", "9876543258", "41, Sardar Chowk, Mini Bazar", "Surat"),
]

# Read existing patients to preserve any existing UHIDs
existing_patients_file = os.path.join(DATA_DIR, 'patients.json')
existing_patients = []
if os.path.exists(existing_patients_file):
    try:
        with open(existing_patients_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, dict):
                existing_patients = data.get('patients', [])
            elif isinstance(data, list):
                existing_patients = data
    except:
        existing_patients = []

existing_uhids = {p.get('uhid') for p in existing_patients if isinstance(p, dict) and p.get('uhid')}

DOCTOR_NAMES = [f"{d['title']} {d['drName'].upper()}" for d in DOCTORS]
REF_DOCTORS = ["DR. NIKUNJ VITHALANI", "DR. DEVANG DESAI", "DR. ARVIND KEJRIWAL", "DR. SHALINI REDDY", "SELF / WALK-IN"]

PATIENTS = list(existing_patients)
start_uhid_num = 1001
for i, item in enumerate(PATIENT_NAMES):
    uhid = f"UHID-{start_uhid_num + i}"
    if uhid in existing_uhids:
        continue
    
    first, mid, last, sex, age, age_unit, mobile, addr, city = item
    b_year = NOW.year - age
    b_date = f"{b_year}-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
    days_ago = random.randint(1, 60)
    
    pat_rec = {
        "id": uhid,
        "uhid": uhid,
        "category": "NEW" if random.random() > 0.35 else "OLD",
        "firstName": first,
        "middleName": mid,
        "lastName": last,
        "birthDate": b_date,
        "age": str(age),
        "ageUnit": age_unit,
        "sex": sex,
        "hospitalDoctor": random.choice(DOCTOR_NAMES[:6]),
        "referenceBy": random.choice(REF_DOCTORS),
        "address": addr,
        "city": city,
        "state": "Gujarat",
        "country": "India",
        "pincode": "395007",
        "mobile": mobile,
        "phone": f"0261-2{random.randint(100000, 999999)}",
        "email": f"{first.lower()}.{last.lower()}@gmail.com",
        "bloodGroup": random.choice(["A+", "B+", "AB+", "O+", "O-", "B-"]),
        "maritalStatus": "Married" if age > 25 else "Single",
        "allergies": "NKDA (No Known Drug Allergies)" if random.random() > 0.15 else "Allergic to Penicillin / Sulfa",
        "createdAt": datetime_iso(days_ago=days_ago, hours_ago=random.randint(1, 12)),
        "updatedAt": datetime_iso(days_ago=days_ago, hours_ago=random.randint(0, 5))
    }
    PATIENTS.append(pat_rec)

print(f"Total Patients seeded: {len(PATIENTS)}")

# ==========================================
# 4. 24 BEDS (General, Semi, Deluxe, ICU)
# ==========================================
BED_DEFS = [
    ("BED-0001", "GEN-01", "General Ward Male", "RMT-000001", 800.0, "1st Floor", "West Wing"),
    ("BED-0002", "GEN-02", "General Ward Male", "RMT-000001", 800.0, "1st Floor", "West Wing"),
    ("BED-0003", "GEN-03", "General Ward Male", "RMT-000001", 800.0, "1st Floor", "West Wing"),
    ("BED-0004", "GEN-04", "General Ward Male", "RMT-000001", 800.0, "1st Floor", "West Wing"),
    ("BED-0005", "GEN-05", "General Ward Female", "RMT-000001", 800.0, "1st Floor", "East Wing"),
    ("BED-0006", "GEN-06", "General Ward Female", "RMT-000001", 800.0, "1st Floor", "East Wing"),
    ("BED-0007", "GEN-07", "General Ward Female", "RMT-000001", 800.0, "1st Floor", "East Wing"),
    ("BED-0008", "GEN-08", "General Ward Female", "RMT-000001", 800.0, "1st Floor", "East Wing"),
    ("BED-0009", "SEMI-101", "Semi-Special Ward", "RMT-000002", 1500.0, "2nd Floor", "North Wing"),
    ("BED-0010", "SEMI-102", "Semi-Special Ward", "RMT-000002", 1500.0, "2nd Floor", "North Wing"),
    ("BED-0011", "SEMI-103", "Semi-Special Ward", "RMT-000002", 1500.0, "2nd Floor", "North Wing"),
    ("BED-0012", "SEMI-104", "Semi-Special Ward", "RMT-000002", 1500.0, "2nd Floor", "North Wing"),
    ("BED-0013", "DLX-201", "Deluxe AC Room", "RMT-000003", 2500.0, "2nd Floor", "South Wing"),
    ("BED-0014", "DLX-202", "Deluxe AC Room", "RMT-000003", 2500.0, "2nd Floor", "South Wing"),
    ("BED-0015", "DLX-203", "Deluxe AC Room", "RMT-000003", 2500.0, "2nd Floor", "South Wing"),
    ("BED-0016", "DLX-204", "Deluxe AC Room", "RMT-000003", 2500.0, "2nd Floor", "South Wing"),
    ("BED-0017", "ICU-01", "Intensive Care Unit (ICU)", "RMT-000004", 4500.0, "3rd Floor", "Critical Care Wing"),
    ("BED-0018", "ICU-02", "Intensive Care Unit (ICU)", "RMT-000004", 4500.0, "3rd Floor", "Critical Care Wing"),
    ("BED-0019", "ICU-03", "Intensive Care Unit (ICU)", "RMT-000004", 4500.0, "3rd Floor", "Critical Care Wing"),
    ("BED-0020", "ICU-04", "Intensive Care Unit (ICU)", "RMT-000004", 4500.0, "3rd Floor", "Critical Care Wing"),
    ("BED-0021", "ICCU-01", "Cardiac Care Unit (ICCU)", "RMT-000004", 5000.0, "3rd Floor", "Critical Care Wing"),
    ("BED-0022", "ICCU-02", "Cardiac Care Unit (ICCU)", "RMT-000004", 5000.0, "3rd Floor", "Critical Care Wing"),
    ("BED-0023", "ICCU-03", "Cardiac Care Unit (ICCU)", "RMT-000004", 5000.0, "3rd Floor", "Critical Care Wing"),
    ("BED-0024", "ICCU-04", "Cardiac Care Unit (ICCU)", "RMT-000004", 5000.0, "3rd Floor", "Critical Care Wing"),
]

# We will assign 8 beds to active admissions, leaving 16 vacant
ACTIVE_OCCUPIED_BED_INDICES = [0, 4, 8, 12, 16, 17, 20, 21]

# ==========================================
# 5. ADMISSIONS (16 Indoor Admissions)
# 8 Admitted (Occupied), 8 Discharged (Vacant)
# ==========================================
ADMISSIONS = []
DISCHARGES = []
BEDS = []

admitted_patients = PATIENTS[:16]

for i in range(16):
    pat = admitted_patients[i]
    p_name = f"{pat['firstName']} {pat.get('middleName', '')} {pat['lastName']}".strip()
    adm_seq = i + 1
    adm_id = f"ADM-{adm_seq:06d}"
    ipd_no = f"IPD2627/{1000 + adm_seq}"
    
    is_active = (i < 8)
    bed_idx = ACTIVE_OCCUPIED_BED_INDICES[i] if is_active else (i + 2) # Discharged used this bed previously
    b_def = BED_DEFS[bed_idx]
    
    adm_days_ago = random.randint(2, 6) if is_active else random.randint(7, 20)
    adm_date = date_str(days_ago=adm_days_ago)
    adm_time = f"{random.randint(8, 18):02d}:{random.randint(0, 59):02d}"
    
    diag_list = [
        "Acute Coronary Syndrome / NSTEMI",
        "Acute Appendicitis with Local Peritonitis",
        "Right Inguinal Hernia - Incarcerated",
        "Severe Community Acquired Pneumonia",
        "Uncontrolled Type 2 Diabetes with Diabetic Foot",
        "Acute Gastroenteritis with Severe Dehydration",
        "Left Tibia Fracture (Closed)",
        "Dengue Fever with Severe Thrombocytopenia"
    ]
    diag = diag_list[i % len(diag_list)]
    
    adm_rec = {
        "id": adm_id,
        "ipd_no": ipd_no,
        "patient_id": pat['uhid'],
        "uhid": pat['uhid'],
        "patient_name": p_name,
        "age": pat['age'],
        "gender": pat['sex'],
        "mobile": pat.get('mobile', '9825100000'),
        "admission_date": adm_date,
        "admission_time": adm_time,
        "bed_number": b_def[1],
        "ward_name": b_def[2],
        "room_type": "Deluxe" if "DLX" in b_def[1] else ("ICU" if "ICU" in b_def[1] else "General"),
        "daily_bed_charge": b_def[4],
        "admitting_doctor": pat.get('hospitalDoctor', 'Dr. NILESH MAHALE'),
        "reference_doctor": pat.get('referenceBy', 'DR. NIKUNJ VITHALANI'),
        "insurance_company": "Star Health and Allied Insurance" if (i % 3 == 0) else "None / Cash",
        "provisional_diagnosis": diag,
        "initial_deposit": 10000 if "ICU" in b_def[1] else 5000,
        "status": "Admitted" if is_active else "Discharged",
        "discharge_id": f"DIS-{adm_seq:06d}" if not is_active else None,
        "discharge_date": date_str(days_ago=adm_days_ago - random.randint(2, 4)) if not is_active else None,
        "created_at": datetime_iso(days_ago=adm_days_ago, hours_ago=5),
        "updated_at": datetime_iso(days_ago=1, hours_ago=2)
    }
    ADMISSIONS.append(adm_rec)
    
    # If discharged, create Discharge Record
    if not is_active:
        dis_days_ago = adm_days_ago - random.randint(2, 4)
        dis_date = date_str(days_ago=dis_days_ago)
        dis_rec = {
            "id": f"DIS-{adm_seq:06d}",
            "discharge_no": f"DIS2627/{500 + adm_seq}",
            "admission_id": adm_id,
            "ipd_no": ipd_no,
            "patient_id": pat['uhid'],
            "uhid": pat['uhid'],
            "patient_name": p_name,
            "age": pat['age'],
            "gender": pat['sex'],
            "bed_number": b_def[1],
            "admission_date": adm_date,
            "discharge_date": dis_date,
            "discharge_time": "11:30 AM",
            "final_diagnosis": f"Resolved: {diag}",
            "condition_on_discharge": "Recovered" if (i % 2 == 0) else "Improved",
            "treatment_summary": f"Patient was admitted with {diag}. Managed with IV antibiotics, fluid therapy, analgesics, and supportive medications. Vitals remained stable throughout hospital course. Successfully stepped down and ambulated.",
            "investigation_summary": "CBC, KFT, LFT, Chest X-Ray, ECG - All within acceptable limits prior to discharge.",
            "operative_notes": "Surgical recovery uneventful. Sutures intact, wound clean and dry." if "Surgery" in pat.get('hospitalDoctor', '') else "Medical management uneventful.",
            "discharge_medications": "1. Tab Pantocid 40mg 1-0-0 (Empty stomach)\n2. Tab Paracetamol 650mg 1-0-1 (After food, 3 days)\n3. Tab Augmentin 625 Duo 1-0-1 (After food, 5 days)\n4. Tab Becosules Z 0-1-0 (15 days)",
            "follow_up_instructions": "Review in OPD after 5 days with Dr. Nilesh Mahale. Seek immediate emergency consultation in case of acute fever, vomiting, or breathing difficulty.",
            "follow_up_date": date_str(days_ago=-5), # 5 days in future
            "discharging_doctor_name": pat.get('hospitalDoctor', 'Dr. NILESH MAHALE'),
            "is_active": True,
            "created_at": datetime_iso(days_ago=dis_days_ago, hours_ago=2)
        }
        DISCHARGES.append(dis_rec)

# Build BED instances
for idx, b_def in enumerate(BED_DEFS):
    is_occ = idx in ACTIVE_OCCUPIED_BED_INDICES
    linked_adm = None
    if is_occ:
        adm_idx = ACTIVE_OCCUPIED_BED_INDICES.index(idx)
        linked_adm = ADMISSIONS[adm_idx]
    
    bed_obj = {
        "id": b_def[0],
        "bed_number": b_def[1],
        "ward_name": b_def[2],
        "room_type_id": b_def[3],
        "status": "Occupied" if is_occ else "Vacant",
        "current_admission_id": linked_adm["id"] if linked_adm else None,
        "current_patient_id": linked_adm["uhid"] if linked_adm else None,
        "daily_rate": b_def[4],
        "floor": b_def[5],
        "wing": b_def[6],
        "notes": f"High acuity bed with cardiac monitor" if "ICU" in b_def[1] else "Standard ward bed",
        "is_active": True
    }
    BEDS.append(bed_obj)

print(f"Total Beds: {len(BEDS)} (Occupied: {len(ACTIVE_OCCUPIED_BED_INDICES)}, Vacant: {len(BEDS) - len(ACTIVE_OCCUPIED_BED_INDICES)})")
print(f"Total Admissions: {len(ADMISSIONS)} (Active: 8, Discharged: 8)")
print(f"Total Discharges: {len(DISCHARGES)}")

# ==========================================
# 6. DEPOSITS & PART PAYMENTS (18 Deposits)
# ==========================================
DEPOSITS = []
for i, adm in enumerate(ADMISSIONS):
    dep_id = f"DEP-{i+1:06d}"
    rec_no = f"RCP2627/{2000 + i + 1}"
    amt = 15000.0 if "ICU" in adm["ward_name"] else 5000.0
    dep_obj = {
        "id": dep_id,
        "receipt_no": rec_no,
        "patient_id": adm["uhid"],
        "uhid": adm["uhid"],
        "patient_name": adm["patient_name"],
        "ipd_no": adm["ipd_no"],
        "deposit_date": adm["admission_date"],
        "amount": amt,
        "payment_mode": "Online / UPI" if (i % 2 == 0) else "Cash",
        "transaction_ref": f"UPI/TXN/{random.randint(10000000, 99999999)}" if (i % 2 == 0) else "",
        "remarks": "Initial Admission Security Deposit",
        "received_by": "Cashier (Mixu Desk)",
        "is_active": True,
        "created_at": adm["created_at"]
    }
    DEPOSITS.append(dep_obj)

# Add 2 additional mid-treatment deposits
for k in [0, 4]:
    adm = ADMISSIONS[k]
    dep_seq = len(DEPOSITS) + 1
    DEPOSITS.append({
        "id": f"DEP-{dep_seq:06d}",
        "receipt_no": f"RCP2627/{2000 + dep_seq}",
        "patient_id": adm["uhid"],
        "uhid": adm["uhid"],
        "patient_name": adm["patient_name"],
        "ipd_no": adm["ipd_no"],
        "deposit_date": date_str(days_ago=1),
        "amount": 10000.0,
        "payment_mode": "Credit Card",
        "transaction_ref": f"POS/HDFC/{random.randint(100000, 999999)}",
        "remarks": "Part Payment during Inpatient Stay",
        "received_by": "Cashier (Mixu Desk)",
        "is_active": True,
        "created_at": datetime_iso(days_ago=1, hours_ago=3)
    })

print(f"Total Deposits / Part Payments: {len(DEPOSITS)}")

# ==========================================
# 7. DR VISITS & PROCEDURES (22 Inpatient Rounds)
# ==========================================
DR_VISITS = []
for i in range(22):
    adm = ADMISSIONS[i % len(ADMISSIONS)]
    v_seq = i + 1
    v_date = date_str(days_ago=random.randint(1, 4))
    proc_list = [
        ("Consultant Inpatient Round", 800),
        ("Emergency Bedside Evaluation", 1200),
        ("IV Cannulation & Infusion Monitoring", 350),
        ("Wound Dressing & Aseptic Cleaning", 450),
        ("Foley's Catheterization", 600),
        ("Ryle's Tube Insertion", 750),
        ("Bedside 12-Lead ECG Evaluation", 500)
    ]
    p_title, p_charge = proc_list[i % len(proc_list)]
    
    dv_obj = {
        "id": f"DVP-{v_seq:06d}",
        "admission_id": adm["id"],
        "ipd_no": adm["ipd_no"],
        "patient_id": adm["uhid"],
        "uhid": adm["uhid"],
        "patient_name": adm["patient_name"],
        "doctor_name": adm["admitting_doctor"],
        "visit_date": v_date,
        "visit_time": f"{random.randint(9, 20):02d}:{random.randint(0, 59):02d}",
        "procedure_title": p_title,
        "charges": p_charge,
        "notes": f"Routine morning examination. Chest bilateral clear, abdomen soft, afebrile, vitals within normal target ranges.",
        "is_active": True,
        "created_at": datetime_iso(days_ago=1, hours_ago=i)
    }
    DR_VISITS.append(dv_obj)

print(f"Total Dr Visits & Bedside Procedures: {len(DR_VISITS)}")

# ==========================================
# 8. OT ENTRIES (12 Surgeries)
# ==========================================
OT_ENTRIES = []
SURGERIES = [
    ("Laparoscopic Cholecystectomy", "General Surgery", "Dr. Snehal Mahale", "Dr. Nilesh Mahale", "Dr. Sanjay Bansal", "General Anesthesia", "Symptomatic Cholelithiasis", "Chronic Cholecystitis", 28000),
    ("Laparoscopic Appendectomy", "General Surgery", "Dr. Snehal Mahale", "Dr. Nilesh Mahale", "Dr. Sanjay Bansal", "General Anesthesia", "Acute Appendicitis", "Suppurative Appendicitis", 22000),
    ("Open Inguinal Hernioplasty with Mesh", "General Surgery", "Dr. Snehal Mahale", "Dr. Nilesh Mahale", "Dr. Sanjay Bansal", "Spinal Anesthesia", "Right Inguinal Hernia", "Direct Inguinal Hernia", 25000),
    ("Coronary Angiography", "Interventional Cardiology", "Dr. Nikunj Vithalani", "Dr. Devang Desai", "Dr. Sanjay Bansal", "Local Anesthesia", "Angina Pectoris / Positive TMT", "Double Vessel CAD", 18000),
    ("Percutaneous Transluminal Coronary Angioplasty (PTCA)", "Interventional Cardiology", "Dr. Nikunj Vithalani", "Dr. Devang Desai", "Dr. Sanjay Bansal", "Local Anesthesia", "Severe LAD Stenosis", "Successful Drug Eluting Stent to LAD", 85000),
    ("Lower Segment Cesarean Section (LSCS)", "Obstetrics & Gynecology", "Dr. Shalini Reddy", "Dr. Nilesh Mahale", "Dr. Sanjay Bansal", "Spinal Anesthesia", "Cephalopelvic Disproportion", "Delivered healthy male infant 3.1kg", 32000),
    ("Open Reduction & Internal Fixation (ORIF) Tibia", "Orthopedics", "Dr. Arvind Kejriwal", "Dr. Nilesh Mahale", "Dr. Sanjay Bansal", "Spinal Anesthesia", "Right Tibial Shaft Fracture", "Anatomical reduction with 7-hole dynamic compression plate", 38000),
    ("Diagnostic & Operative Arthroscopy Knee", "Orthopedics", "Dr. Arvind Kejriwal", "Dr. Nilesh Mahale", "Dr. Sanjay Bansal", "Spinal Anesthesia", "Medial Meniscal Tear Right Knee", "Partial Meniscectomy", 30000),
    ("Total Abdominal Hysterectomy (TAH)", "Obstetrics & Gynecology", "Dr. Shalini Reddy", "Dr. Snehal Mahale", "Dr. Sanjay Bansal", "General Anesthesia", "Multiple Uterine Fibroids", "Successful TAH with Bilateral Salpingo-oophorectomy", 42000),
    ("Excision of Lipoma (Neck)", "General Surgery", "Dr. Snehal Mahale", "Dr. Nilesh Mahale", "Dr. Sanjay Bansal", "Local Anesthesia", "Subcutaneous Benign Lipoma", "Complete excision intact capsule", 8500),
    ("Emergency Tracheostomy", "General Surgery", "Dr. Snehal Mahale", "Dr. Nilesh Mahale", "Dr. Sanjay Bansal", "General Anesthesia", "Upper Airway Obstruction", "Secured airway with size 7.5 Portex tube", 14000),
    ("Debridement & Skin Grafting", "General Surgery", "Dr. Snehal Mahale", "Dr. Nilesh Mahale", "Dr. Sanjay Bansal", "General Anesthesia", "Chronic Non-Healing Diabetic Foot Ulcer", "Split thickness graft harvested and secured", 26000),
]

for i, surg in enumerate(SURGERIES):
    ot_seq = i + 1
    adm = ADMISSIONS[i % len(ADMISSIONS)]
    s_name, s_grp, lead_surg, asst_surg, anesth, anesth_type, pre_diag, post_diag, cost = surg
    
    ot_obj = {
        "id": f"OT-{ot_seq:06d}",
        "ot_no": f"OT-2026-{ot_seq:04d}",
        "admission_id": adm["id"],
        "ipd_no": adm["ipd_no"],
        "patient_id": adm["uhid"],
        "uhid": adm["uhid"],
        "patient_name": adm["patient_name"],
        "surgery_date": date_str(days_ago=random.randint(1, 10)),
        "start_time": f"{random.randint(8, 14):02d}:00",
        "end_time": f"{random.randint(15, 18):02d}:30",
        "operation_group": s_grp,
        "procedure_name": s_name,
        "lead_surgeon": lead_surg,
        "assistant_surgeon": asst_surg,
        "anesthetist": anesth,
        "anesthesia_type": anesth_type,
        "pre_op_diagnosis": pre_diag,
        "post_op_diagnosis": post_diag,
        "charges": cost,
        "is_active": True,
        "created_at": datetime_iso(days_ago=2, hours_ago=i)
    }
    OT_ENTRIES.append(ot_obj)

print(f"Total OT Entries: {len(OT_ENTRIES)}")

# ==========================================
# 9. PATIENT BILLS (25 Bills: Paid, Partial, Unpaid)
# Matching Bill.jpeg & BillPreview format
# ==========================================
BILLS = []
for i in range(25):
    pat = PATIENTS[i]
    p_name = f"{pat['firstName']} {pat.get('middleName', '')} {pat['lastName']}".strip()
    b_seq = i + 1
    b_date = datetime_iso(days_ago=random.randint(0, 30), hours_ago=random.randint(1, 10))
    
    charge_types = [
        [{"details": "OPD Consultation Charge", "rate": 500, "amount": 500}],
        [{"details": "Consultation Charge", "rate": 500, "amount": 500}, {"details": "ECG 12-Lead", "rate": 350, "amount": 350}],
        [{"details": "Consultation Charge", "rate": 700, "amount": 700}, {"details": "Dressing / Minor Procedure", "rate": 450, "amount": 450}, {"details": "Tetanus Toxoid Inj", "rate": 100, "amount": 100}],
        [{"details": "2D Echocardiography Study", "rate": 2000, "amount": 2000}, {"details": "Consultant Cardiologist Evaluation", "rate": 1000, "amount": 1000}],
        [{"details": "Emergency / Casualty Service Charge", "rate": 800, "amount": 800}, {"details": "Nebulization with Duolin", "rate": 250, "amount": 250}, {"details": "IV Injection Administration", "rate": 200, "amount": 200}]
    ]
    items = charge_types[i % len(charge_types)]
    subtotal = sum(it["amount"] for it in items)
    
    # Discounts
    disc = 100.0 if (i % 4 == 0) else 0.0
    net = subtotal - disc
    
    # Paid status: Unpaid (i%5==0), Partial (i%5==1), Paid (rest)
    if i % 5 == 0:
        rec = 0.0
    elif i % 5 == 1:
        rec = net / 2.0
    else:
        rec = net
    
    bill_obj = {
        "id": f"BILL-{b_seq:04d}",
        "patientId": pat["uhid"],
        "uhid": pat["uhid"],
        "invoiceNo": f"OPD2627/{6100 + b_seq}",
        "billDate": b_date,
        "patientName": p_name.upper(),
        "age": pat["age"],
        "ageUnit": pat["ageUnit"],
        "sex": pat["sex"],
        "mobile": pat.get("mobile", "9876543201"),
        "treatingDoctor": pat.get("hospitalDoctor", "Dr. NILESH MAHALE"),
        "city": pat.get("city", "SURAT"),
        "paymentType": "Cash" if (i % 2 == 0) else "UPI / Net Banking",
        "items": items,
        "subtotal": subtotal,
        "discountType": "fixed",
        "discountValue": disc,
        "discountAmount": disc,
        "discountDoctor": "Dr. NILESH MAHALE",
        "discountRemark": "Courtesy hospital discount" if disc > 0 else "",
        "netAmount": net,
        "totalReceived": rec,
        "balanceAmount": max(0.0, net - rec),
        "status": "Paid" if rec >= net else ("Partially Paid" if rec > 0 else "Unpaid"),
        "remarks": "OPD Consultation & Diagnostic billing",
        "entryBy": "SYSTEM",
        "pcName": "DESK-OPD-01",
        "createdAt": b_date,
        "updatedAt": b_date
    }
    BILLS.append(bill_obj)

print(f"Total Patient Bills: {len(BILLS)}")

# ==========================================
# 10. CLINICAL VISITS WITH VITALS (35 Visits)
# Longitudinal history for patient visits
# ==========================================
VISITS = []
for i in range(35):
    pat = PATIENTS[i % len(PATIENTS)]
    p_name = f"{pat['firstName']} {pat.get('middleName', '')} {pat['lastName']}".strip()
    v_seq = i + 1
    v_days_ago = random.randint(0, 45)
    
    bps = ["120/80", "130/84", "118/76", "140/90", "124/82", "110/70", "138/88"]
    pulses = [72, 76, 80, 84, 88, 68, 74]
    temps = [98.2, 98.4, 98.6, 99.1, 98.0, 99.4]
    spo2s = [98, 99, 97, 98, 96, 99]
    weights = [58, 64, 70, 75, 82, 67, 72]
    
    complaint_options = [
        "Headache, mild generalized body ache and fever since 2 days.",
        "Chest tightness on climbing stairs, relieved with rest.",
        "Epigastric burning sensation after meals, sour eructations.",
        "Routine diabetic checkup, polyuria and fatigue.",
        "Persistent dry cough, mild wheezing especially at night.",
        "Right knee joint pain on prolonged standing and morning stiffness.",
        "General weakness, loss of appetite, occasional giddiness."
    ]
    diag_options = [
        "Viral Pyrexia with upper respiratory tract infection",
        "Essential Hypertension Stage 1 / Angina on exertion",
        "Gastroesophageal Reflux Disease (GERD) with Dyspepsia",
        "Type 2 Diabetes Mellitus - Inadequate Glycemic Control",
        "Allergic Bronchitis / Cough Variant Asthma",
        "Bilateral Osteoarthritis Knee (Grade 2)",
        "Iron Deficiency Anemia with Nutritional Deficiency"
    ]
    
    c_idx = i % len(complaint_options)
    
    vis_obj = {
        "id": f"VST-{v_seq:06d}",
        "visit_no": f"VST-2026-{1000 + v_seq}",
        "patient_id": pat["uhid"],
        "uhid": pat["uhid"],
        "patient_name": p_name,
        "doctor_name": pat.get("hospitalDoctor", "Dr. NILESH MAHALE"),
        "visit_date": date_str(days_ago=v_days_ago),
        "visit_type": "OPD Consultation" if (i % 3 != 0) else "Follow-up Visit",
        "symptoms": complaint_options[c_idx],
        "diagnosis": diag_options[c_idx],
        "bp": bps[i % len(bps)],
        "pulse": str(pulses[i % len(pulses)]),
        "temperature": str(temps[i % len(temps)]),
        "spo2": str(spo2s[i % len(spo2s)]),
        "weight": str(weights[i % len(weights)]),
        "height": "168",
        "bmi": "24.5",
        "prescriptions": [
            {"medicine": "Paracetamol 650 (Dolo)", "dosage": "650mg", "frequency": "1-0-1", "days": "5", "instructions": "After food"},
            {"medicine": "Pantocid 40", "dosage": "40mg", "frequency": "1-0-0", "days": "10", "instructions": "Before breakfast"},
            {"medicine": "Becosules Z Capsules", "dosage": "Forte", "frequency": "0-1-0", "days": "15", "instructions": "After lunch"}
        ],
        "advice": "Drink 2.5-3 liters of clean boiled water daily. Maintain light salt diet. Review in OPD after 1 week.",
        "is_active": True,
        "created_at": datetime_iso(days_ago=v_days_ago, hours_ago=random.randint(1, 8))
    }
    VISITS.append(vis_obj)

print(f"Total Patient Clinical Visits: {len(VISITS)}")

# ==========================================
# 11. ECHO REPORTS (12 Realistic Reports)
# Matches echo report print.jpeg layout
# ==========================================
ECHO_REPORTS = []
ECHO_PATIENTS = PATIENTS[:12]
for i, pat in enumerate(ECHO_PATIENTS):
    p_name = f"{pat['firstName']} {pat.get('middleName', '')} {pat['lastName']}".strip()
    e_seq = i + 1
    e_days_ago = random.randint(1, 25)
    
    lvefs = ["55 %", "40 %", "60 %", "45 %", "50 %", "35 %"]
    rwmas = ["Absent", "Present - Hypokinesia of Mid & Basal Inferior Wall", "Absent - Normal wall motion", "Present - Anterior wall hypokinesia", "Absent", "Present - Global LV hypokinesia"]
    pasps = ["28 mmHg", "45 mmHg", "25 mmHg", "38 mmHg", "32 mmHg", "52 mmHg"]
    
    idx_val = i % len(lvefs)
    
    echo_obj = {
        "id": f"ECHO-{1000 + e_seq}",
        "uhid": pat["uhid"],
        "patientName": p_name,
        "age": pat["age"],
        "sex": pat["sex"],
        "reportDate": date_str(days_ago=e_days_ago),
        "referredBy": "DR. NIKUNJ VITHALANI" if (i % 2 == 0) else "DR. DEVANG DESAI",
        "c_o": "Chest discomfort on exertion, dyspnea NYHA Class II, palpitations",
        "mitralValve": "Normal leaflet thickness and mobility. Mild MR seen. No MS.",
        "aorticValve": "Tri-leaflet aortic valve with good systolic opening. No AS / AR.",
        "tricuspidValve": "Normal morphology. Mild TR with estimated RVSP " + pasps[idx_val],
        "pulmonaryValve": "Normal pulmonary valve morphology. No PS / PR.",
        "pericardium": "Normal pericardial space. No pericardial effusion.",
        "ivs": "Intact",
        "ias": "Intact",
        "septum": "10",
        "pWall": "10",
        "lvidd": "44",
        "lvids": "28",
        "lvef": lvefs[idx_val],
        "rwma": rwmas[idx_val],
        "rvsp": pasps[idx_val],
        "dopplerStudy": "Mild MR, Mild TR. E/A ratio normal for age.",
        "conclusion": f"LV Systolic Function: LVEF {lvefs[idx_val]}\nRWMA: {rwmas[idx_val]}\nGrade I LV Diastolic Dysfunction\nNormal Size Cardiac Chambers\nEstimated PASP = {pasps[idx_val]}\nNo evidence of Clot / Vegetation / Pericardial Effusion\nIVC normal in caliber (>50% inspiratory collapse).",
        "consultantDr": "Dr. Devang Desai" if (i % 2 == 0) else "Dr. Nikunj Vithalani",
        "drRegNo": "G-29841",
        "createdAt": datetime_iso(days_ago=e_days_ago, hours_ago=3),
        "updatedAt": datetime_iso(days_ago=e_days_ago, hours_ago=1)
    }
    ECHO_REPORTS.append(echo_obj)

print(f"Total Echo Reports: {len(ECHO_REPORTS)}")

# ==========================================
# 12. LAB INVESTIGATIONS (25 Tests)
# ==========================================
INVESTIGATIONS = []
LAB_TESTS = [
    ("Complete Blood Count (CBC)", "Hematology", [
        {"parameter": "Hemoglobin", "value": "13.8", "unit": "g/dL", "reference": "13.0 - 17.0", "status": "Normal"},
        {"parameter": "Total WBC Count", "value": "7,800", "unit": "/cumm", "reference": "4,000 - 11,000", "status": "Normal"},
        {"parameter": "Platelet Count", "value": "240,000", "unit": "/cumm", "reference": "150,000 - 450,000", "status": "Normal"},
        {"parameter": "RBC Count", "value": "4.8", "unit": "mil/cumm", "reference": "4.5 - 5.5", "status": "Normal"},
        {"parameter": "ESR", "value": "12", "unit": "mm/1st hr", "reference": "0 - 15", "status": "Normal"}
    ]),
    ("Lipid Profile", "Biochemistry", [
        {"parameter": "Total Cholesterol", "value": "210", "unit": "mg/dL", "reference": "< 200", "status": "High"},
        {"parameter": "Triglycerides", "value": "165", "unit": "mg/dL", "reference": "< 150", "status": "High"},
        {"parameter": "HDL Cholesterol", "value": "42", "unit": "mg/dL", "reference": "> 40", "status": "Normal"},
        {"parameter": "LDL Cholesterol", "value": "135", "unit": "mg/dL", "reference": "< 100", "status": "High"},
        {"parameter": "VLDL Cholesterol", "value": "33", "unit": "mg/dL", "reference": "< 30", "status": "High"}
    ]),
    ("Renal Function Test (RFT / KFT)", "Biochemistry", [
        {"parameter": "Blood Urea", "value": "28", "unit": "mg/dL", "reference": "15 - 40", "status": "Normal"},
        {"parameter": "Serum Creatinine", "value": "0.95", "unit": "mg/dL", "reference": "0.6 - 1.2", "status": "Normal"},
        {"parameter": "Serum Uric Acid", "value": "5.4", "unit": "mg/dL", "reference": "3.5 - 7.2", "status": "Normal"},
        {"parameter": "Serum Sodium", "value": "138", "unit": "mEq/L", "reference": "135 - 145", "status": "Normal"},
        {"parameter": "Serum Potassium", "value": "4.2", "unit": "mEq/L", "reference": "3.5 - 5.0", "status": "Normal"}
    ]),
    ("Liver Function Test (LFT)", "Biochemistry", [
        {"parameter": "Total Bilirubin", "value": "0.8", "unit": "mg/dL", "reference": "0.2 - 1.2", "status": "Normal"},
        {"parameter": "Direct Bilirubin", "value": "0.2", "unit": "mg/dL", "reference": "0.0 - 0.3", "status": "Normal"},
        {"parameter": "SGOT / AST", "value": "26", "unit": "U/L", "reference": "< 40", "status": "Normal"},
        {"parameter": "SGPT / ALT", "value": "31", "unit": "U/L", "reference": "< 45", "status": "Normal"},
        {"parameter": "Alkaline Phosphatase", "value": "88", "unit": "U/L", "reference": "30 - 120", "status": "Normal"}
    ]),
    ("Glycated Hemoglobin (HbA1c)", "Diabetes Panel", [
        {"parameter": "HbA1c", "value": "6.8", "unit": "%", "reference": "< 5.7 (Normal), > 6.5 (Diabetic)", "status": "High"},
        {"parameter": "Estimated Average Glucose", "value": "148", "unit": "mg/dL", "reference": "< 126", "status": "High"}
    ]),
    ("Cardiac Troponin I (High Sensitive)", "Cardiology / Critical Care", [
        {"parameter": "hs-Troponin I", "value": "0.012", "unit": "ng/mL", "reference": "< 0.040 (Negative)", "status": "Normal"}
    ])
]

for i in range(25):
    pat = PATIENTS[i % len(PATIENTS)]
    p_name = f"{pat['firstName']} {pat.get('middleName', '')} {pat['lastName']}".strip()
    inv_seq = i + 1
    t_tuple = LAB_TESTS[i % len(LAB_TESTS)]
    t_name, t_cat, t_results = t_tuple
    
    inv_obj = {
        "id": f"INV-{inv_seq:06d}",
        "order_no": f"LAB2627/{4000 + inv_seq}",
        "patient_id": pat["uhid"],
        "uhid": pat["uhid"],
        "patient_name": p_name,
        "age": pat["age"],
        "gender": pat["sex"],
        "order_date": date_str(days_ago=random.randint(0, 15)),
        "ordering_doctor": pat.get("hospitalDoctor", "Dr. NILESH MAHALE"),
        "test_name": t_name,
        "category": t_cat,
        "status": "Completed" if (i % 6 != 0) else "Sample Collected",
        "sample_type": "Whole Blood EDTA / Serum" if "Blood" in t_name or "Lipid" in t_name else "Venous Blood",
        "results": t_results,
        "reported_by": "Dr. Ritu Saxena, MD (Pathology)",
        "remarks": "Results clinically correlated with patient history.",
        "is_active": True,
        "created_at": datetime_iso(days_ago=random.randint(1, 15), hours_ago=random.randint(1, 10))
    }
    INVESTIGATIONS.append(inv_obj)

print(f"Total Lab Investigations: {len(INVESTIGATIONS)}")

# ==========================================
# 13. CERTIFICATES (15 Certificates)
# Fitness, MLC, Death
# ==========================================
CERTIFICATES = []
for i in range(15):
    pat = PATIENTS[i]
    p_name = f"{pat['firstName']} {pat.get('middleName', '')} {pat['lastName']}".strip()
    c_seq = i + 1
    
    if i < 7:
        c_type = "Medical Fitness"
        details = {
            "disease_name": "Acute Viral Pharyngitis & Bronchitis",
            "leave_from": date_str(days_ago=12),
            "leave_to": date_str(days_ago=5),
            "fitness_date": date_str(days_ago=4),
            "remarks": "Patient has completed antibiotic course, afebrile, lungs clear. Medically fit to resume duties."
        }
    elif i < 11:
        c_type = "MLC Certificate"
        details = {
            "mlc_no": f"MLC-2026-{100 + c_seq}",
            "police_station": "Adajan Police Station",
            "buckle_no": f"PC-{random.randint(1000, 9999)}",
            "brought_by": "Constable R. K. Varma",
            "incident_type": "Road Traffic Accident (Two Wheeler vs Auto)",
            "incident_datetime": datetime_iso(days_ago=random.randint(2, 8)),
            "injury_notes": "1. Abrasion 3x2 cm over right knee joint.\n2. Laceration 4x1 cm over left forearm with mild bleeding.\n3. Contusion over forehead. No bony injury on X-Ray.",
            "opinion": "Injuries simple in nature, caused by blunt impact."
        }
    else:
        c_type = "Death Certificate"
        details = {
            "death_reg_no": f"DTH-2026-{10 + c_seq}",
            "date_of_death": date_str(days_ago=random.randint(5, 30)),
            "time_of_death": "04:35 AM",
            "immediate_cause": "Refractory Cardiogenic Shock",
            "antecedent_cause": "Acute Extensive Anterior Wall Myocardial Infarction",
            "underlying_cause": "Severe Triple Vessel Coronary Artery Disease with Type 2 Diabetes",
            "informant_name": f"{pat.get('middleName', 'Ramesh')} {pat['lastName']} (Son)",
            "remarks": "Declared deceased after CPR as per ACLS guidelines."
        }
    
    cert_obj = {
        "id": f"CERT-{c_seq:06d}",
        "certificate_type": c_type,
        "patient_id": pat["uhid"],
        "uhid": pat["uhid"],
        "patient_name": p_name,
        "age": pat["age"],
        "gender": pat["sex"],
        "address": pat.get("address", "Surat, Gujarat"),
        "issue_date": date_str(days_ago=random.randint(1, 10)),
        "issuing_doctor": pat.get("hospitalDoctor", "Dr. NILESH MAHALE"),
        "doctor_reg_no": "G-23451",
        "details": details,
        "is_active": True,
        "created_at": datetime_iso(days_ago=random.randint(1, 10), hours_ago=2)
    }
    CERTIFICATES.append(cert_obj)

print(f"Total Certificates: {len(CERTIFICATES)}")

# ==========================================
# 14. SAVE ALL DATA FILES SAFELY
# Writes to backend/data/ and frontend/public/data/
# ==========================================

def write_json(filename, content, is_repo_entity=False, entity_name="", prefix="", items_key=""):
    backend_path = os.path.join(DATA_DIR, filename)
    frontend_path = os.path.join(FRONTEND_DATA_DIR, filename)
    
    data_to_write = content
    if is_repo_entity:
        data_to_write = {
            "entity": entity_name,
            "last_sequence": len(content),
            "created_at": "2026-10-01T00:00:00+05:30",
            "updated_at": NOW.isoformat(),
            items_key: content
        }
    
    with open(backend_path, 'w', encoding='utf-8') as f:
        json.dump(data_to_write, f, indent=2, ensure_ascii=False)
        
    with open(frontend_path, 'w', encoding='utf-8') as f:
        json.dump(data_to_write, f, indent=2, ensure_ascii=False)

# Direct Wrapped Entities matching backend schema
write_json('doctors.json', {"doctors": DOCTORS})
write_json('medicines.json', {"medicines": MEDICINES})
write_json('patients.json', {"patients": PATIENTS})
write_json('bills.json', {"bills": BILLS, "last_invoice_seq": 6125})
write_json('echo_reports.json', {"echo_reports": ECHO_REPORTS})

# BaseJSONRepository Entities
write_json('beds.json', BEDS, is_repo_entity=True, entity_name="Bed", prefix="BED", items_key="beds")
write_json('admissions.json', ADMISSIONS, is_repo_entity=True, entity_name="Admission", prefix="ADM", items_key="admissions")
write_json('discharges.json', DISCHARGES, is_repo_entity=True, entity_name="Discharge", prefix="DIS", items_key="discharges")
write_json('deposits.json', DEPOSITS, is_repo_entity=True, entity_name="Deposit", prefix="DEP-REC", items_key="deposits")
write_json('dr_visits_procedures.json', DR_VISITS, is_repo_entity=True, entity_name="DrVisitProcedure", prefix="DVP", items_key="entries")
write_json('ot_entries.json', OT_ENTRIES, is_repo_entity=True, entity_name="OtEntry", prefix="OT", items_key="entries")
write_json('patient_visits.json', VISITS, is_repo_entity=True, entity_name="PatientVisit", prefix="VST", items_key="visits")
write_json('investigations.json', INVESTIGATIONS, is_repo_entity=True, entity_name="Investigation", prefix="INV", items_key="investigations")
write_json('certificates.json', CERTIFICATES, is_repo_entity=True, entity_name="Certificate", prefix="CERT", items_key="certificates")

print("All hospital datasets successfully written to backend/data/ and frontend/public/data/!")
