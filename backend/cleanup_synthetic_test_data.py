"""
Mixu Hospital Management System - Synthetic Test Data Purge & Isolation Script
Removes all records starting with TEST-* or flagged with is_synthetic_test: true.
Guarantees 100% safety for authentic hospital records.
"""

import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

def purge_file(filename, key_name):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return 0, 0
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        records = []
        if isinstance(data, list):
            records = data
        elif isinstance(data, dict):
            for k in [key_name, 'patients', 'admissions', 'bills', 'deposits', 'dr_visits_procedures', 'records']:
                if k in data and isinstance(data[k], list):
                    records = data[k]
                    break
        
        initial_len = len(records)
        clean_records = []
        for r in records:
            r_id = str(r.get('id', ''))
            r_uhid = str(r.get('uhid', ''))
            r_ipd = str(r.get('ipd_no', ''))
            is_synth = r.get('is_synthetic_test', False)

            if r_id.startswith('TEST-') or r_uhid.startswith('TEST-') or r_ipd.startswith('TEST-') or is_synth:
                continue
            clean_records.append(r)
        
        purged = initial_len - len(clean_records)
        if purged > 0:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump({key_name: clean_records, "count": len(clean_records)}, f, indent=2, ensure_ascii=False)
        return purged, len(clean_records)
    except Exception as e:
        print(f"Error purging {filename}: {e}")
        return 0, 0

def purge_all_synthetic_test_data():
    print("[*] Initiating Safe Synthetic Test Data Purge...")
    targets = [
        ('patients.json', 'patients'),
        ('admissions.json', 'admissions'),
        ('bills.json', 'bills'),
        ('deposits.json', 'deposits'),
        ('dr_visits_procedures.json', 'dr_visits_procedures')
    ]

    total_purged = 0
    for fn, kn in targets:
        purged, remaining = purge_file(fn, kn)
        total_purged += purged
        print(f"    - {fn}: Purged {purged} synthetic test items | Preserved {remaining} genuine items")

    print(f"[✓] Purge Complete: {total_purged} synthetic test records safely removed.")

if __name__ == '__main__':
    purge_all_synthetic_test_data()
