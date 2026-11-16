/**
 * Hospital / Inpatient & Indoor Management API Services.
 * Connects to Django backend (/api/admissions/, /api/beds/, /api/discharges/, /api/deposits/, etc.)
 * with robust client-side localStorage fallback for offline / GitHub Pages deployment.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// --- Types ---

export interface AdmissionRecord {
  id: string;
  ipd_no: string;
  patient_id: string;
  uhid: string;
  patient_name: string;
  age?: string;
  gender?: string;
  mobile?: string;
  admission_date: string;
  admission_time: string;
  bed_number: string;
  ward_name: string;
  room_type: string;
  daily_bed_charge?: number;
  admitting_doctor: string;
  reference_doctor?: string;
  insurance_company?: string;
  provisional_diagnosis?: string;
  initial_deposit?: number;
  status: 'Admitted' | 'Discharged' | 'Transferred';
  discharge_id?: string;
  discharge_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DischargeRecord {
  id: string;
  discharge_no: string;
  admission_id: string;
  ipd_no: string;
  patient_id: string;
  uhid: string;
  patient_name: string;
  age?: string;
  gender?: string;
  bed_number?: string;
  admission_date?: string;
  discharge_date: string;
  discharge_time: string;
  final_diagnosis: string;
  condition_on_discharge: 'Recovered' | 'Improved' | 'LAMA' | 'Referred' | 'Deceased';
  treatment_summary?: string;
  investigation_summary?: string;
  operative_notes?: string;
  discharge_medications?: string;
  follow_up_instructions?: string;
  follow_up_date?: string;
  discharging_doctor_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface BedRecord {
  id: string;
  bed_number: string;
  ward_name: string;
  room_type_id: string;
  status: 'Vacant' | 'Occupied' | 'Maintenance' | 'Cleaning';
  current_admission_id?: string | null;
  current_patient_id?: string | null;
  daily_rate: number;
  is_active: boolean;
}

export interface RoomTypeRecord {
  id: string;
  name: string;
  code: string;
  daily_rate: number;
  ac_type: string;
  total_beds: number;
  is_active: boolean;
}

export interface DepositRecord {
  id: string;
  receipt_no: string;
  patient_id: string;
  uhid: string;
  patient_name: string;
  ipd_no?: string;
  deposit_date: string;
  amount: number;
  payment_mode: string;
  transaction_ref?: string;
  authorized_by?: string;
  remarks?: string;
  is_active: boolean;
  created_at?: string;
}

export interface DrVisitProcedureRecord {
  id: string;
  admission_id?: string;
  ipd_no?: string;
  patient_id: string;
  uhid: string;
  patient_name: string;
  entry_type: 'VISIT' | 'PROCEDURE';
  date: string;
  head: string;
  doctor_name: string;
  room?: string;
  bed_no?: string;
  charges: number;
  notes?: string;
  is_active: boolean;
  created_at?: string;
}

export interface OtEntryRecord {
  id: string;
  ot_no?: string;
  admission_id?: string;
  ipd_no?: string;
  patient_id: string;
  uhid: string;
  patient_name: string;
  surgery_date: string;
  start_time?: string;
  end_time?: string;
  operation_group?: string;
  procedure_name: string;
  lead_surgeon: string;
  assistant_surgeon?: string;
  anesthetist?: string;
  anesthesia_type?: string;
  pre_op_diagnosis?: string;
  post_op_diagnosis?: string;
  charges?: number;
  is_active: boolean;
}

// --- Helpers for LocalStorage Fallback ---

function getLocal<T>(key: string, seedUrl: string, rootProp: string): Promise<T[]> {
  try {
    const raw = localStorage.getItem(`mixu_${key}`);
    if (raw) return Promise.resolve(JSON.parse(raw));
  } catch {}

  const baseUrl = import.meta.env.BASE_URL || '/';
  const fullUrl = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}data/${seedUrl}`;
  return fetch(fullUrl)
    .then(r => r.json())
    .then(d => {
      const items = d[rootProp] || [];
      try { localStorage.setItem(`mixu_${key}`, JSON.stringify(items)); } catch {}
      return items;
    })
    .catch(() => []);
}

function saveLocal<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(`mixu_${key}`, JSON.stringify(items));
  } catch {}
}

// --- Admission API ---

export const admissionApi = {
  async getAdmissions(params?: { search?: string; status?: string }): Promise<AdmissionRecord[]> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.status) q.set('status', params.status);
      const res = await fetch(`${API_BASE_URL}/admissions/?${q.toString()}`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.admissions)) return d.admissions;
      }
    } catch {}

    const local = await getLocal<AdmissionRecord>('admissions', 'admissions.json', 'admissions');
    let filtered = local;
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(a => (a.patient_name || '').toLowerCase().includes(s) || (a.uhid || '').toLowerCase().includes(s) || (a.ipd_no || '').toLowerCase().includes(s));
    }
    if (params?.status) {
      filtered = filtered.filter(a => a.status === params.status);
    }
    return filtered;
  },

  async admitPatient(payload: Partial<AdmissionRecord>): Promise<AdmissionRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/admissions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.admission) return d.admission;
      }
    } catch {}

    const all = await getLocal<AdmissionRecord>('admissions', 'admissions.json', 'admissions');
    const seq = all.length + 1;
    const now = new Date();
    const created: AdmissionRecord = {
      id: `ADM-${String(seq).padStart(6, '0')}`,
      ipd_no: `IPD-2026-${String(seq).padStart(4, '0')}`,
      patient_id: payload.uhid || payload.patient_id || 'UNKNOWN',
      uhid: payload.uhid || payload.patient_id || 'UNKNOWN',
      patient_name: payload.patient_name || 'Patient',
      age: payload.age || '',
      gender: payload.gender || 'Other',
      mobile: payload.mobile || '',
      admission_date: payload.admission_date || now.toISOString().split('T')[0],
      admission_time: payload.admission_time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      bed_number: payload.bed_number || 'GEN-01',
      ward_name: payload.ward_name || 'General Ward',
      room_type: payload.room_type || 'General Ward',
      daily_bed_charge: payload.daily_bed_charge || 800,
      admitting_doctor: payload.admitting_doctor || 'Dr. Nilesh Mahale',
      reference_doctor: payload.reference_doctor || '',
      insurance_company: payload.insurance_company || '',
      provisional_diagnosis: payload.provisional_diagnosis || '',
      initial_deposit: payload.initial_deposit || 0,
      status: 'Admitted',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
    all.push(created);
    saveLocal('admissions', all);

    // Auto occupy bed locally
    if (payload.bed_number) {
      await bedApi.allocateBed(payload.bed_number, created.id, created.uhid);
    }

    return created;
  },
};

// --- Discharge API ---

export const dischargeApi = {
  async getDischarges(params?: { search?: string }): Promise<DischargeRecord[]> {
    try {
      const q = params?.search ? `?search=${encodeURIComponent(params.search)}` : '';
      const res = await fetch(`${API_BASE_URL}/discharges/${q}`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.discharges)) return d.discharges;
      }
    } catch {}

    const local = await getLocal<DischargeRecord>('discharges', 'discharges.json', 'discharges');
    if (params?.search) {
      const s = params.search.toLowerCase();
      return local.filter(d => (d.patient_name || '').toLowerCase().includes(s) || (d.uhid || '').toLowerCase().includes(s) || (d.discharge_no || '').toLowerCase().includes(s));
    }
    return local;
  },

  async processDischarge(payload: Partial<DischargeRecord>): Promise<DischargeRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/discharges/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.discharge) return d.discharge;
      }
    } catch {}

    const all = await getLocal<DischargeRecord>('discharges', 'discharges.json', 'discharges');
    const seq = all.length + 1;
    const now = new Date();
    const created: DischargeRecord = {
      id: `DIS-${String(seq).padStart(6, '0')}`,
      discharge_no: `DIS-2026-${String(seq).padStart(4, '0')}`,
      admission_id: payload.admission_id || '',
      ipd_no: payload.ipd_no || '',
      patient_id: payload.uhid || payload.patient_id || 'UNKNOWN',
      uhid: payload.uhid || payload.patient_id || 'UNKNOWN',
      patient_name: payload.patient_name || 'Patient',
      age: payload.age || '',
      gender: payload.gender || 'Other',
      bed_number: payload.bed_number || '',
      admission_date: payload.admission_date || '',
      discharge_date: payload.discharge_date || now.toISOString().split('T')[0],
      discharge_time: payload.discharge_time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      final_diagnosis: payload.final_diagnosis || 'Under Treatment',
      condition_on_discharge: payload.condition_on_discharge || 'Recovered',
      treatment_summary: payload.treatment_summary || '',
      investigation_summary: payload.investigation_summary || '',
      operative_notes: payload.operative_notes || '',
      discharge_medications: payload.discharge_medications || '',
      follow_up_instructions: payload.follow_up_instructions || '',
      follow_up_date: payload.follow_up_date || '',
      discharging_doctor_name: payload.discharging_doctor_name || 'Dr. Nilesh Mahale',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
    all.push(created);
    saveLocal('discharges', all);

    // Free bed locally
    if (payload.bed_number) {
      await bedApi.releaseBed(payload.bed_number);
    }

    return created;
  },
};

// --- Bed API ---

export const bedApi = {
  async getBeds(params?: { ward?: string; status?: string }): Promise<BedRecord[]> {
    try {
      const q = new URLSearchParams();
      if (params?.ward) q.set('ward_name', params.ward);
      if (params?.status) q.set('status', params.status);
      const res = await fetch(`${API_BASE_URL}/beds/?${q.toString()}`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.beds)) return d.beds;
      }
    } catch {}

    const local = await getLocal<BedRecord>('beds', 'beds.json', 'beds');
    let filtered = local;
    if (params?.status) filtered = filtered.filter(b => b.status === params.status);
    if (params?.ward) filtered = filtered.filter(b => (b.ward_name || '').toLowerCase().includes(params.ward!.toLowerCase()));
    return filtered;
  },

  async allocateBed(bedNumber: string, admissionId: string, patientId: string): Promise<BedRecord | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/beds/${encodeURIComponent(bedNumber)}/allocate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ admission_id: admissionId, patient_id: patientId }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.bed) return d.bed;
      }
    } catch {}

    const beds = await getLocal<BedRecord>('beds', 'beds.json', 'beds');
    const b = beds.find(x => x.bed_number.toLowerCase() === bedNumber.toLowerCase());
    if (b) {
      b.status = 'Occupied';
      b.current_admission_id = admissionId;
      b.current_patient_id = patientId;
      saveLocal('beds', beds);
      return b;
    }
    return null;
  },

  async releaseBed(bedNumber: string): Promise<BedRecord | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/beds/${encodeURIComponent(bedNumber)}/release/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.bed) return d.bed;
      }
    } catch {}

    const beds = await getLocal<BedRecord>('beds', 'beds.json', 'beds');
    const b = beds.find(x => x.bed_number.toLowerCase() === bedNumber.toLowerCase());
    if (b) {
      b.status = 'Vacant';
      b.current_admission_id = null;
      b.current_patient_id = null;
      saveLocal('beds', beds);
      return b;
    }
    return null;
  },

  async createBed(payload: Partial<BedRecord>): Promise<BedRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/beds/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<BedRecord>('beds', 'beds.json', 'beds');
    const seq = all.length + 1;
    const created: BedRecord = {
      id: `BED-${String(seq).padStart(6, '0')}`,
      bed_number: payload.bed_number || String(seq + 100),
      ward_name: payload.ward_name || 'General Ward',
      room_type_id: payload.room_type_id || 'RMT-000001',
      status: payload.status || 'Vacant',
      daily_rate: Number(payload.daily_rate) || 1000,
      is_active: payload.is_active !== false,
    };
    all.push(created);
    saveLocal('beds', all);
    return created;
  },

  async updateBed(id: string, payload: Partial<BedRecord>): Promise<BedRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/beds/${encodeURIComponent(id)}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<BedRecord>('beds', 'beds.json', 'beds');
    const idx = all.findIndex(b => b.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...payload, id };
      saveLocal('beds', all);
      return all[idx];
    }
    throw new Error(`Bed with ID ${id} not found.`);
  },
};

// --- Room Type API ---

export const roomTypeApi = {
  async getRoomTypes(params?: { search?: string }): Promise<RoomTypeRecord[]> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      const res = await fetch(`${API_BASE_URL}/room-types/?${q.toString()}`, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.room_types)) return d.room_types;
      }
    } catch {}

    const local = await getLocal<RoomTypeRecord>('room_types', 'room_types.json', 'room_types');
    return local;
  },

  async createRoomType(payload: Partial<RoomTypeRecord>): Promise<RoomTypeRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/room-types/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<RoomTypeRecord>('room_types', 'room_types.json', 'room_types');
    const seq = all.length + 1;
    const created: RoomTypeRecord = {
      id: `RMT-${String(seq).padStart(6, '0')}`,
      name: payload.name || 'Room Type',
      code: payload.code || `RT-${seq}`,
      daily_rate: Number(payload.daily_rate) || 1000,
      ac_type: payload.ac_type || 'Non-AC',
      total_beds: Number(payload.total_beds) || 10,
      is_active: payload.is_active !== false,
    };
    all.push(created);
    saveLocal('room_types', all);
    return created;
  },

  async updateRoomType(id: string, payload: Partial<RoomTypeRecord>): Promise<RoomTypeRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/room-types/${encodeURIComponent(id)}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<RoomTypeRecord>('room_types', 'room_types.json', 'room_types');
    const idx = all.findIndex(r => r.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...payload, id };
      saveLocal('room_types', all);
      return all[idx];
    }
    throw new Error(`Room Type with ID ${id} not found.`);
  },

  async deleteRoomType(id: string, force = false): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/room-types/${encodeURIComponent(id)}/?force=${force}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {}

    const all = await getLocal<RoomTypeRecord>('room_types', 'room_types.json', 'room_types');
    if (force) {
      saveLocal('room_types', all.filter(r => r.id !== id));
    } else {
      const idx = all.findIndex(r => r.id === id);
      if (idx !== -1) {
        all[idx].is_active = false;
        saveLocal('room_types', all);
      }
    }
    return true;
  },
};

// --- Deposit API ---

export const depositApi = {
  async getDeposits(params?: { search?: string; uhid?: string }): Promise<DepositRecord[]> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.uhid) q.set('uhid', params.uhid);
      const res = await fetch(`${API_BASE_URL}/deposits/?${q.toString()}`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.deposits)) return d.deposits;
      }
    } catch {}

    const local = await getLocal<DepositRecord>('deposits', 'deposits.json', 'deposits');
    let filtered = local;
    if (params?.uhid) {
      filtered = filtered.filter(x => (x.uhid || '').toLowerCase() === params.uhid!.toLowerCase());
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(x => (x.patient_name || '').toLowerCase().includes(s) || (x.receipt_no || '').toLowerCase().includes(s));
    }
    return filtered;
  },

  async createDeposit(payload: Partial<DepositRecord>): Promise<DepositRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/deposits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<DepositRecord>('deposits', 'deposits.json', 'deposits');
    const seq = all.length + 1;
    const now = new Date();
    const created: DepositRecord = {
      id: `DEP-REC-${String(seq).padStart(6, '0')}`,
      receipt_no: `RCP-2026-${String(seq).padStart(4, '0')}`,
      patient_id: payload.uhid || payload.patient_id || 'UNKNOWN',
      uhid: payload.uhid || payload.patient_id || 'UNKNOWN',
      patient_name: payload.patient_name || 'Patient',
      ipd_no: payload.ipd_no || '',
      deposit_date: payload.deposit_date || now.toISOString(),
      amount: Number(payload.amount) || 0,
      payment_mode: payload.payment_mode || 'Cash',
      transaction_ref: payload.transaction_ref || '',
      authorized_by: payload.authorized_by || 'Cashier',
      remarks: payload.remarks || '',
      is_active: true,
      created_at: now.toISOString(),
    };
    all.push(created);
    saveLocal('deposits', all);
    return created;
  },
};

// --- Dr. Visit & Procedure API ---

export const drVisitProcedureApi = {
  async getEntries(params?: { search?: string; uhid?: string }): Promise<DrVisitProcedureRecord[]> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.uhid) q.set('uhid', params.uhid);
      const res = await fetch(`${API_BASE_URL}/dr-visits-procedures/?${q.toString()}`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.entries)) return d.entries;
      }
    } catch {}

    const local = await getLocal<DrVisitProcedureRecord>('dr_visits_procedures', 'dr_visits_procedures.json', 'entries');
    if (params?.uhid) {
      return local.filter(x => (x.uhid || '').toLowerCase() === params.uhid!.toLowerCase());
    }
    return local;
  },

  async createEntry(payload: Partial<DrVisitProcedureRecord>): Promise<DrVisitProcedureRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/dr-visits-procedures/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<DrVisitProcedureRecord>('dr_visits_procedures', 'dr_visits_procedures.json', 'entries');
    const seq = all.length + 1;
    const now = new Date();
    const created: DrVisitProcedureRecord = {
      id: `DVP-${String(seq).padStart(6, '0')}`,
      admission_id: payload.admission_id || '',
      ipd_no: payload.ipd_no || '',
      patient_id: payload.uhid || payload.patient_id || 'UNKNOWN',
      uhid: payload.uhid || payload.patient_id || 'UNKNOWN',
      patient_name: payload.patient_name || 'Patient',
      entry_type: payload.entry_type || 'VISIT',
      date: payload.date || now.toISOString().split('T')[0],
      head: payload.head || 'Visiting Charge',
      doctor_name: payload.doctor_name || 'Dr. Nilesh Mahale',
      room: payload.room || 'GEN',
      bed_no: payload.bed_no || 'GEN-01',
      charges: Number(payload.charges) || 500,
      notes: payload.notes || '',
      is_active: true,
      created_at: now.toISOString(),
    };
    all.push(created);
    saveLocal('dr_visits_procedures', all);
    return created;
  },
};

// --- OT Entry API ---

export const otApi = {
  async getOtEntries(params?: { search?: string; uhid?: string }): Promise<OtEntryRecord[]> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.uhid) q.set('uhid', params.uhid);
      const res = await fetch(`${API_BASE_URL}/ot-entries/?${q.toString()}`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.entries)) return d.entries;
      }
    } catch {}

    const local = await getLocal<OtEntryRecord>('ot_entries', 'ot_entries.json', 'entries');
    if (params?.uhid) {
      return local.filter(x => (x.uhid || '').toLowerCase() === params.uhid!.toLowerCase());
    }
    return local;
  },

  async createOtEntry(payload: Partial<OtEntryRecord>): Promise<OtEntryRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/ot-entries/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<OtEntryRecord>('ot_entries', 'ot_entries.json', 'entries');
    const seq = all.length + 1;
    const created: OtEntryRecord = {
      id: `OT-${String(seq).padStart(6, '0')}`,
      ot_no: `OT-2026-${String(seq).padStart(4, '0')}`,
      admission_id: payload.admission_id || '',
      ipd_no: payload.ipd_no || '',
      patient_id: payload.uhid || payload.patient_id || 'UNKNOWN',
      uhid: payload.uhid || payload.patient_id || 'UNKNOWN',
      patient_name: payload.patient_name || 'Patient',
      surgery_date: payload.surgery_date || new Date().toISOString().split('T')[0],
      start_time: payload.start_time || '09:00',
      end_time: payload.end_time || '10:30',
      operation_group: payload.operation_group || 'General Surgery',
      procedure_name: payload.procedure_name || 'Standard Surgery',
      lead_surgeon: payload.lead_surgeon || 'Dr. Snehal Mahale',
      assistant_surgeon: payload.assistant_surgeon || '',
      anesthetist: payload.anesthetist || '',
      anesthesia_type: payload.anesthesia_type || 'General Anesthesia',
      pre_op_diagnosis: payload.pre_op_diagnosis || '',
      post_op_diagnosis: payload.post_op_diagnosis || '',
      charges: Number(payload.charges) || 15000,
      is_active: true,
    };
    all.push(created);
    saveLocal('ot_entries', all);
    return created;
  },
};
