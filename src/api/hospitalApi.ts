/**
 * Hospital / Inpatient & Indoor Management API Services.
 * Connects to Django backend (/api/admissions/, /api/beds/, /api/discharges/, /api/deposits/, etc.)
 * with robust client-side localStorage fallback for offline / GitHub Pages deployment.
 */

const API_BASE_URL = (() => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const port = window.location.port;
    if (port === '5173' || port === '4173') {
      return '/api';
    }
    // In production HTTPS (e.g. GitHub Pages) without an explicit API URL,
    // avoid mixed content errors by using pure client-side seed & localStorage.
    if (window.location.protocol === 'https:') {
      return '';
    }
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api';
    }
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return `http://${host}:8000/api`;
    }
  }
  return 'http://127.0.0.1:8000/api';
})();

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
  patient_id?: string;
  uhid: string;
  patient_name: string;
  entry_type?: string;
  date?: string;
  entry_date?: string;
  visit_date?: string;
  visit_time?: string;
  head?: string;
  head_description?: string;
  procedure_title?: string;
  doctor_name: string;
  doctor_id?: string | null;
  room?: string;
  bed_no?: string;
  bed_number?: string;
  ward_name?: string;
  rate?: number;
  quantity?: number;
  charges?: number;
  amount?: number;
  notes?: string;
  remark?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return Promise.resolve(parsed);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed[rootProp])) {
        return Promise.resolve(parsed[rootProp]);
      }
    }
  } catch {}

  const baseUrl = import.meta.env.BASE_URL || '/';
  const fullUrl = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}data/${seedUrl}`;
  return fetch(fullUrl)
    .then(r => r.json())
    .then(d => {
      const items = Array.isArray(d) ? d : (d[rootProp] || []);
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
    if (API_BASE_URL) {
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
    }

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
    if (API_BASE_URL) {
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
    }

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
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const beds = await getLocal<BedRecord>('beds', 'beds.json', 'beds');
    const seq = beds.length + 1;
    const created: BedRecord = {
      id: `BED-${String(seq).padStart(4, '0')}`,
      bed_number: payload.bed_number || `B-${seq}`,
      ward_name: payload.ward_name || 'General Ward',
      room_type: payload.room_type || 'General',
      daily_rate: Number(payload.daily_rate) || 800,
      status: payload.status || 'Vacant',
      floor: payload.floor || '1st Floor',
      wing: payload.wing || 'West Wing',
      notes: payload.notes || '',
      is_active: payload.is_active !== undefined ? payload.is_active : true,
    };
    beds.push(created);
    saveLocal('beds', beds);
    return created;
  },

  async updateBed(id: string, payload: Partial<BedRecord>): Promise<BedRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/beds/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const beds = await getLocal<BedRecord>('beds', 'beds.json', 'beds');
    const idx = beds.findIndex(b => b.id === id || b.bed_number === id);
    if (idx !== -1) {
      beds[idx] = { ...beds[idx], ...payload };
      saveLocal('beds', beds);
      return beds[idx];
    }
    throw new Error('Bed record not found');
  },
};

// --- Room Type API ---

export const roomTypeApi = {
  async getRoomTypes(): Promise<RoomTypeRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/room-types/`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.items)) return d.items;
      }
    } catch {}

    return await getLocal<RoomTypeRecord>('room_types', 'room_types.json', 'items');
  },

  async createRoomType(payload: Partial<RoomTypeRecord>): Promise<RoomTypeRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/room-types/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<RoomTypeRecord>('room_types', 'room_types.json', 'items');
    const seq = all.length + 1;
    const created: RoomTypeRecord = {
      id: `RT-${String(seq).padStart(4, '0')}`,
      name: payload.name || `Room Type ${seq}`,
      code: payload.code || `RT-${seq}`,
      daily_rate: Number(payload.daily_rate) || 1000,
      ac_type: payload.ac_type || 'Non-AC',
      total_beds: Number(payload.total_beds) || 10,
      is_active: payload.is_active !== undefined ? payload.is_active : true,
    };
    all.push(created);
    saveLocal('room_types', all);
    return created;
  },

  async updateRoomType(id: string, payload: Partial<RoomTypeRecord>): Promise<RoomTypeRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/room-types/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<RoomTypeRecord>('room_types', 'room_types.json', 'items');
    const idx = all.findIndex(x => x.id === id || x.code === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...payload };
      saveLocal('room_types', all);
      return all[idx];
    }
    throw new Error('Room type record not found');
  },

  async deleteRoomType(id: string, hard: boolean = false): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/room-types/${id}/`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) return true;
    } catch {}

    const all = await getLocal<RoomTypeRecord>('room_types', 'room_types.json', 'items');
    if (hard) {
      const filtered = all.filter(x => x.id !== id && x.code !== id);
      saveLocal('room_types', filtered);
    } else {
      const idx = all.findIndex(x => x.id === id || x.code === id);
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

const normalizeDrVisitProcedure = (e: any): DrVisitProcedureRecord => {
  let entryType = e.entry_type;
  if (!entryType) {
    const title = e.head_description || e.procedure_title || e.head || '';
    if (/round|visit|consult/i.test(title)) {
      entryType = 'Doctor Visit';
    } else if (/nurs|dress/i.test(title)) {
      entryType = 'Nursing';
    } else {
      entryType = 'Procedure';
    }
  }
  const entryDate = e.entry_date || e.visit_date || e.date || (e.created_at ? e.created_at.split('T')[0] : '');
  const headDesc = e.head_description || e.procedure_title || e.head || 'Consultant Round';
  const rate = Number(e.rate ?? e.charges ?? e.amount ?? 0);
  const qty = Number(e.quantity ?? 1);
  const amount = Number(e.amount ?? (rate * qty) ?? e.charges ?? 0);
  const remark = e.remark || e.notes || '';
  const bedNumber = e.bed_number || e.bed_no || '';

  return {
    ...e,
    entry_type: entryType,
    entry_date: entryDate,
    visit_date: entryDate,
    date: entryDate,
    head_description: headDesc,
    procedure_title: headDesc,
    head: headDesc,
    rate: rate,
    quantity: qty,
    charges: amount,
    amount: amount,
    remark: remark,
    notes: remark,
    bed_number: bedNumber,
    bed_no: bedNumber,
  };
};

export const drVisitProcedureApi = {
  async getEntries(params?: { search?: string; uhid?: string }): Promise<DrVisitProcedureRecord[]> {
    if (API_BASE_URL) {
      try {
        const q = new URLSearchParams();
        if (params?.search) q.set('search', params.search);
        if (params?.uhid) q.set('uhid', params.uhid);
        const res = await fetch(`${API_BASE_URL}/dr-visits-procedures/?${q.toString()}`, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const d = await res.json();
          if (d.success && Array.isArray(d.entries)) {
            return d.entries.map(normalizeDrVisitProcedure);
          }
        }
      } catch {}
    }

    const local = await getLocal<DrVisitProcedureRecord>('dr_visits_procedures', 'dr_visits_procedures.json', 'entries');
    const normalized = local.map(normalizeDrVisitProcedure);
    if (params?.uhid) {
      return normalized.filter(x => (x.uhid || '').toLowerCase() === params.uhid!.toLowerCase());
    }
    return normalized;
  },

  async getDrVisitProcedures(params?: { search?: string; uhid?: string }): Promise<DrVisitProcedureRecord[]> {
    return drVisitProcedureApi.getEntries(params);
  },

  async createEntry(payload: Partial<DrVisitProcedureRecord>): Promise<DrVisitProcedureRecord> {
    const rate = Number(payload.rate ?? payload.charges ?? payload.amount ?? 0);
    const qty = Number(payload.quantity ?? 1);
    const amount = Number(payload.amount ?? (rate * qty) ?? payload.charges ?? 0);
    const entryDate = payload.entry_date || payload.date || payload.visit_date || new Date().toISOString().split('T')[0];
    const headDesc = payload.head_description || payload.procedure_title || payload.head || 'Consultant Round';
    const remark = payload.remark || payload.notes || '';

    const backendPayload = {
      ...payload,
      entry_type: payload.entry_type || 'Doctor Visit',
      entry_date: entryDate,
      visit_date: entryDate,
      date: entryDate,
      head_description: headDesc,
      procedure_title: headDesc,
      head: headDesc,
      rate: rate,
      quantity: qty,
      charges: amount,
      amount: amount,
      remark: remark,
      notes: remark,
    };

    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/dr-visits-procedures/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(backendPayload),
        });
        if (res.ok) {
          const d = await res.json();
          if (d.success && (d.item || d.entry)) {
            const createdItem = normalizeDrVisitProcedure(d.item || d.entry);
            const all = await getLocal<DrVisitProcedureRecord>('dr_visits_procedures', 'dr_visits_procedures.json', 'entries');
            all.push(createdItem);
            saveLocal('dr_visits_procedures', all);
            return createdItem;
          }
        }
      } catch {}
    }

    const all = await getLocal<DrVisitProcedureRecord>('dr_visits_procedures', 'dr_visits_procedures.json', 'entries');
    const seq = all.length + 1;
    const now = new Date();
    const created: DrVisitProcedureRecord = normalizeDrVisitProcedure({
      id: `DVP-${String(seq).padStart(6, '0')}`,
      admission_id: payload.admission_id || '',
      ipd_no: payload.ipd_no || '',
      patient_id: payload.uhid || payload.patient_id || 'UNKNOWN',
      uhid: payload.uhid || payload.patient_id || 'UNKNOWN',
      patient_name: payload.patient_name || 'Patient',
      entry_type: payload.entry_type || 'Doctor Visit',
      entry_date: entryDate,
      visit_date: entryDate,
      date: entryDate,
      head_description: headDesc,
      procedure_title: headDesc,
      head: headDesc,
      doctor_name: payload.doctor_name || 'Dr. Nilesh Mahale',
      doctor_id: payload.doctor_id || null,
      room: payload.room || 'GEN',
      bed_no: payload.bed_number || payload.bed_no || 'GEN-01',
      bed_number: payload.bed_number || payload.bed_no || 'GEN-01',
      ward_name: payload.ward_name || 'General Ward',
      rate: rate,
      quantity: qty,
      charges: amount,
      amount: amount,
      remark: remark,
      notes: remark,
      is_active: true,
      created_at: now.toISOString(),
    });
    all.push(created);
    saveLocal('dr_visits_procedures', all);
    return created;
  },

  async createDrVisitProcedure(payload: Partial<DrVisitProcedureRecord>): Promise<DrVisitProcedureRecord> {
    return drVisitProcedureApi.createEntry(payload);
  },

  async updateEntry(id: string, payload: Partial<DrVisitProcedureRecord>): Promise<DrVisitProcedureRecord> {
    const rate = payload.rate !== undefined ? Number(payload.rate) : undefined;
    const qty = payload.quantity !== undefined ? Number(payload.quantity) : undefined;
    const amount = payload.amount !== undefined ? Number(payload.amount) : (rate !== undefined && qty !== undefined ? rate * qty : undefined);

    const updatePayload: Record<string, any> = { ...payload };
    if (rate !== undefined) updatePayload.rate = rate;
    if (qty !== undefined) updatePayload.quantity = qty;
    if (amount !== undefined) {
      updatePayload.amount = amount;
      updatePayload.charges = amount;
    }
    if (payload.head_description) {
      updatePayload.procedure_title = payload.head_description;
      updatePayload.head = payload.head_description;
    }
    if (payload.entry_date) {
      updatePayload.visit_date = payload.entry_date;
      updatePayload.date = payload.entry_date;
    }

    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/dr-visits-procedures/${encodeURIComponent(id)}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(updatePayload),
        });
        if (res.ok) {
          const d = await res.json();
          if (d.success && (d.item || d.entry)) {
            const updatedItem = normalizeDrVisitProcedure(d.item || d.entry);
            const all = await getLocal<DrVisitProcedureRecord>('dr_visits_procedures', 'dr_visits_procedures.json', 'entries');
            const idx = all.findIndex(x => x.id === id);
            if (idx !== -1) {
              all[idx] = updatedItem;
              saveLocal('dr_visits_procedures', all);
            }
            return updatedItem;
          }
        }
      } catch {}
    }

    const all = await getLocal<DrVisitProcedureRecord>('dr_visits_procedures', 'dr_visits_procedures.json', 'entries');
    const idx = all.findIndex(x => x.id === id);
    if (idx !== -1) {
      const merged = normalizeDrVisitProcedure({
        ...all[idx],
        ...updatePayload,
        id: all[idx].id,
        updated_at: new Date().toISOString(),
      });
      all[idx] = merged;
      saveLocal('dr_visits_procedures', all);
      return merged;
    }
    throw new Error(`Record with id ${id} not found.`);
  },

  async updateDrVisitProcedure(id: string, payload: Partial<DrVisitProcedureRecord>): Promise<DrVisitProcedureRecord> {
    return drVisitProcedureApi.updateEntry(id, payload);
  },

  async deleteEntry(id: string): Promise<boolean> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/dr-visits-procedures/${encodeURIComponent(id)}/`, {
          method: 'DELETE',
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          // Deleted on backend
        }
      } catch {}
    }
    const all = await getLocal<DrVisitProcedureRecord>('dr_visits_procedures', 'dr_visits_procedures.json', 'entries');
    const filtered = all.filter(x => x.id !== id);
    saveLocal('dr_visits_procedures', filtered);
    return true;
  },

  async deleteDrVisitProcedure(id: string): Promise<boolean> {
    return drVisitProcedureApi.deleteEntry(id);
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

