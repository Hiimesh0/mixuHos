"""
Data Authenticity and Relational Integrity Audit Script
Mixu Hospital Management System
"""

import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

def load(fn):
    p = os.path.join(DATA_DIR, fn)
    if not os.path.exists(p):
        return []
    with open(p, 'r', encoding='utf-8') as f:
        d = json.load(f)
        if isinstance(d, list):
            return d
        for k in ['patients', 'admissions', 'bills', 'deposits', 'dr_visits_procedures', 'doctors', 'medicines', 'beds', 'echo_reports', 'roles', 'users', 'discharges', 'entries']:
            if k in d and isinstance(d[k], list):
                return d[k]
        return []

def audit():
    print("=" * 60)
    print("MIXU HOSPITAL SYSTEM - COMPREHENSIVE DATA AUTHENTICITY AUDIT")
    print("=" * 60)

    patients = load('patients.json')
    admissions = load('admissions.json')
    bills = load('bills.json')
    deposits = load('deposits.json')
    doctors = load('doctors.json')
    medicines = load('medicines.json')
    beds = load('beds.json')
    echoes = load('echo_reports.json')
    discharges = load('discharges.json')
    ot_entries = load('ot_entries.json')
    dvps = load('dr_visits_procedures.json')

    print(f"\n1. RECORD COUNTS:")
    print(f"   Patients:      {len(patients)}")
    print(f"   Admissions:    {len(admissions)}")
    print(f"   Bills:         {len(bills)}")
    print(f"   Deposits:      {len(deposits)}")
    print(f"   Doctors:       {len(doctors)}")
    print(f"   Medicines:     {len(medicines)}")
    print(f"   Beds:          {len(beds)}")
    print(f"   Echo Reports:  {len(echoes)}")
    print(f"   Discharges:    {len(discharges)}")
    print(f"   OT Entries:    {len(ot_entries)}")
    print(f"   Dr Visits/Proc: {len(dvps)}")

    # 1. Patients Analysis
    print("\n2. PATIENT DATA AUTHENTICITY:")
    pat_uhids = set()
    synthetic_count = 0
    demo_count = 0
    authentic_count = 0
    dummy_phones = 0

    for p in patients:
        uid = p.get('uhid') or p.get('id') or ''
        pat_uhids.add(uid)
        name = f"{p.get('firstName', '')} {p.get('lastName', '')}".strip()
        ph = str(p.get('mobile', '') or p.get('phone', ''))

        if uid.startswith('TEST-') or p.get('is_synthetic_test'):
            synthetic_count += 1
        elif any(w in name.lower() for w in ['test', 'demo', 'sample', 'dummy']):
            demo_count += 1
        else:
            authentic_count += 1

        if ph in ['9876543210', '9999999999', '1234567890', '0000000000'] or ph.startswith('555') or len(ph) < 10:
            dummy_phones += 1

    print(f"   Unique UHIDs:                 {len(pat_uhids)}")
    print(f"   Identified Synthetic Records: {synthetic_count}")
    print(f"   Demo / Sample Records:        {demo_count}")
    print(f"   Authentic Looking Records:    {authentic_count}")
    print(f"   Dummy / Invalid Phone Numbers: {dummy_phones}/{len(patients)}")

    print("\n   Sample Patient Profiles:")
    for p in patients[:5]:
        full_name = f"{p.get('firstName', '')} {p.get('lastName', '')}".strip()
        uid = p.get('uhid') or p.get('id')
        city = p.get('city', 'Unknown')
        phone = p.get('mobile', p.get('phone', 'N/A'))
        print(f"   - {uid}: {full_name} | City: {city} | Phone: {phone}")

    # 2. Relational Integrity
    print("\n3. RELATIONAL INTEGRITY & ORPHAN RECORDS:")
    adm_ids = {a.get('id') for a in admissions}
    orphan_adms = [a for a in admissions if a.get('uhid') not in pat_uhids]
    orphan_bills = [b for b in bills if b.get('uhid') not in pat_uhids]
    orphan_deposits = [d for d in deposits if d.get('uhid') not in pat_uhids]
    orphan_discharges = [d for d in discharges if d.get('admission_id') and d.get('admission_id') not in adm_ids]
    orphan_ot = [o for o in ot_entries if o.get('admission_id') and o.get('admission_id') not in adm_ids]
    orphan_dvps = [v for v in dvps if v.get('admission_id') and v.get('admission_id') not in adm_ids]

    print(f"   Admissions missing UHID in Patients: {len(orphan_adms)}/{len(admissions)}")
    print(f"   Bills missing UHID in Patients:      {len(orphan_bills)}/{len(bills)}")
    print(f"   Deposits missing UHID in Patients:   {len(orphan_deposits)}/{len(deposits)}")
    print(f"   Discharges missing Admission ID:     {len(orphan_discharges)}/{len(discharges)}")
    if orphan_discharges:
        for od in orphan_discharges:
            print(f"     - Orphan Discharge {od.get('id')}: ref {od.get('admission_id')}, patient {od.get('patient_name')} ({od.get('uhid')})")
    print(f"   OT Entries missing Admission ID:     {len(orphan_ot)}/{len(ot_entries)}")
    print(f"   Dr Visits missing Admission ID:      {len(orphan_dvps)}/{len(dvps)}")

    # 3. Financial Consistency
    print("\n4. BILLING FINANCIAL RECONCILIATION:")
    reconciled = 0
    mismatched = []
    total_gross = 0.0
    total_disc = 0.0
    total_net = 0.0
    total_paid = 0.0
    total_bal = 0.0

    for b in bills:
        gross = float(b.get('subtotal', 0) or b.get('totalAmount', 0) or b.get('gross_amount', 0) or 0)
        disc = float(b.get('discountAmount', 0) or b.get('discount', 0) or b.get('discount_amount', 0) or 0)
        net = float(b.get('netAmount', 0) or b.get('net_amount', 0) or 0)
        paid = float(b.get('totalReceived', 0) or b.get('paidAmount', 0) or b.get('paid_amount', 0) or 0)
        bal = float(b.get('balanceAmount', 0) or b.get('balance_amount', 0) or 0)

        total_gross += gross
        total_disc += disc
        total_net += net
        total_paid += paid
        total_bal += bal

        calc_net = gross - disc
        calc_bal = net - paid
        if abs(calc_net - net) < 2 and abs(calc_bal - bal) < 2:
            reconciled += 1
        else:
            mismatched.append({
                'id': b.get('id'),
                'gross': gross,
                'discount': disc,
                'net': net,
                'calc_net': calc_net,
                'paid': paid,
                'bal': bal,
                'calc_bal': calc_bal
            })

    print(f"   Mathematically Reconciled Bills: {reconciled}/{len(bills)} ({(reconciled/max(1, len(bills)))*100:.1f}%)")
    print(f"   Mismatched Calculations:         {len(mismatched)}")
    if mismatched:
        print(f"     First Mismatch: {mismatched[0]}")

    print(f"\n   Aggregate Financial Metrics (All Existing Bills):")
    print(f"   - Total Gross Invoiced: ₹{total_gross:,.2f}")
    print(f"   - Total Discounts:       ₹{total_disc:,.2f}")
    print(f"   - Total Net Revenue:     ₹{total_net:,.2f}")
    print(f"   - Total Cash Collected:  ₹{total_paid:,.2f}")
    print(f"   - Total Outstanding Due: ₹{total_bal:,.2f}")

    print("\n" + "=" * 60)
    print("DATA AUDIT CONCLUSION:")
    print("=" * 60)
    if authentic_count > 0 and dummy_phones < len(patients) * 0.5:
        print("Authenticity Verdict: HYBRID SYSTEM. Contains authentic clinical records and patient profiles alongside initial seed/demonstration records.")
    else:
        print("Authenticity Verdict: SEED & DEMONSTRATION DATASET. Primary data was created for functional onboarding, workflow demonstration, and testing.")

if __name__ == '__main__':
    audit()
