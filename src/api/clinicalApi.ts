/**
 * Clinical, Diagnostics & Certificates API Services.
 * Connects to Django backend (/api/investigations/, /api/certificates/, /api/patients/<uhid>/visits/)
 * with robust client-side localStorage fallback for offline / GitHub Pages deployment.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// --- Types ---

export interface TestResultItem {
  parameter: string;
  value: string;
  unit: string;
  ref_range: string;
  reference?: string;
  flag?: 'Normal' | 'High' | 'Low' | 'Critical';
  status?: string;
}

export interface InvestigationRecord {
  id: string;
  order_no: string;
  patient_id: string;
  uhid: string;
  patient_name: string;
  order_date: string;
  doctor_name: string;
  test_name: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Radiology' | 'Pathology' | string;
  sample_status: 'Pending' | 'Sample Collected' | 'Processing' | 'Completed' | 'Delivered';
  lab_id?: string;
  results: TestResultItem[];
  impression?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CertificateRecord {
  id: string;
  cert_type: 'MEDICAL' | 'MLC' | 'DEATH' | 'FITNESS';
  certificate_no: string;
  patient_id: string;
  uhid: string;
  patient_name: string;
  age?: string;
  gender?: string;
  address?: string;
  doctor_name: string;
  issue_date: string;
  diagnosis?: string;
  // Medical fitness / rest fields
  rest_from?: string;
  rest_to?: string;
  fitness_date?: string;
  // MLC fields
  police_station?: string;
  buckle_no?: string;
  brought_by?: string;
  examination_time?: string;
  identification_marks?: string;
  injury_details?: string;
  // Death certificate fields
  date_of_death?: string;
  time_of_death?: string;
  cause_of_death_immediate?: string;
  cause_of_death_antecedent?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PatientVisitRecord {
  id: string;
  visit_no: number;
  uhid: string;
  patient_name: string;
  visit_date: string;
  visit_type: string;
  doctor: string;
  chief_complaint?: string;
  vitals?: {
    bp?: string;
    pulse?: string;
    temp?: string;
    spo2?: string;
    weight?: string;
  };
  notes?: string;
  created_at?: string;
}

// --- Local Storage Helpers ---

function getStorageKey(entity: string): string {
  return `mixu_${entity}_storage`;
}

async function getLocal<T>(entity: string, fallbackJsonFile: string, fallbackKey?: string): Promise<T[]> {
  if (typeof window === 'undefined') return [];
  const key = getStorageKey(entity);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  try {
    const res = await fetch(`/data/${fallbackJsonFile}`);
    if (res.ok) {
      const json = await res.json();
      const list: T[] = fallbackKey && json[fallbackKey] ? json[fallbackKey] : Array.isArray(json) ? json : [];
      if (list.length > 0) {
        localStorage.setItem(key, JSON.stringify(list));
        return list;
      }
    }
  } catch {}
  return [];
}

function saveLocal<T>(entity: string, items: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(entity), JSON.stringify(items));
}

// --- Investigation API ---

export const investigationApi = {
  async getInvestigations(params?: { search?: string; uhid?: string; category?: string; sample_status?: string }): Promise<InvestigationRecord[]> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.uhid) q.set('uhid', params.uhid);
      if (params?.category) q.set('category', params.category);
      if (params?.sample_status) q.set('sample_status', params.sample_status);
      const res = await fetch(`${API_BASE_URL}/investigations/?${q.toString()}`, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.investigations)) return d.investigations;
      }
    } catch {}

    const local = await getLocal<InvestigationRecord>('investigations', 'investigations.json', 'investigations');
    return local.filter(x => {
      if (params?.uhid && (x.uhid || '').toLowerCase() !== params.uhid.toLowerCase()) return false;
      if (params?.category && (x.category || '').toLowerCase() !== params.category.toLowerCase()) return false;
      if (params?.sample_status && (x.sample_status || '').toLowerCase() !== params.sample_status.toLowerCase()) return false;
      if (params?.search) {
        const s = params.search.toLowerCase();
        return (
          (x.patient_name || '').toLowerCase().includes(s) ||
          (x.uhid || '').toLowerCase().includes(s) ||
          (x.test_name || '').toLowerCase().includes(s) ||
          (x.order_no || '').toLowerCase().includes(s)
        );
      }
      return true;
    });
  },

  async getInvestigationById(id: string): Promise<InvestigationRecord | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/investigations/${encodeURIComponent(id)}/`, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const local = await getLocal<InvestigationRecord>('investigations', 'investigations.json', 'investigations');
    return local.find(x => x.id === id || x.order_no === id) || null;
  },

  async createInvestigation(payload: Partial<InvestigationRecord>): Promise<InvestigationRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/investigations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<InvestigationRecord>('investigations', 'investigations.json', 'investigations');
    const seq = all.length + 1;
    const created: InvestigationRecord = {
      id: `INV-${String(seq).padStart(6, '0')}`,
      order_no: `ORD-2026-${String(seq).padStart(4, '0')}`,
      patient_id: payload.uhid || payload.patient_id || 'UNKNOWN',
      uhid: payload.uhid || payload.patient_id || 'UNKNOWN',
      patient_name: payload.patient_name || 'Patient',
      order_date: payload.order_date || new Date().toISOString().split('T')[0],
      doctor_name: payload.doctor_name || 'Dr. Nilesh Mahale',
      test_name: payload.test_name || 'Complete Blood Count (CBC)',
      category: payload.category || 'Hematology',
      sample_status: payload.sample_status || 'Pending',
      lab_id: payload.lab_id || `LAB-${seq + 100}`,
      results: payload.results || [],
      impression: payload.impression || '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    all.push(created);
    saveLocal('investigations', all);
    return created;
  },

  async updateInvestigation(id: string, payload: Partial<InvestigationRecord>): Promise<InvestigationRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/investigations/${encodeURIComponent(id)}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<InvestigationRecord>('investigations', 'investigations.json', 'investigations');
    const idx = all.findIndex(x => x.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...payload, updated_at: new Date().toISOString() };
      saveLocal('investigations', all);
      return all[idx];
    }
    throw new Error(`Investigation with ID ${id} not found.`);
  },

  async deleteInvestigation(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/investigations/${encodeURIComponent(id)}/`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {}

    const all = await getLocal<InvestigationRecord>('investigations', 'investigations.json', 'investigations');
    const filtered = all.filter(x => x.id !== id);
    saveLocal('investigations', filtered);
    return true;
  },
};

// --- Certificate API ---

export const certificateApi = {
  async getCertificates(params?: { search?: string; uhid?: string; cert_type?: string }): Promise<CertificateRecord[]> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.set('search', params.search);
      if (params?.uhid) q.set('uhid', params.uhid);
      if (params?.cert_type) q.set('cert_type', params.cert_type);
      const res = await fetch(`${API_BASE_URL}/certificates/?${q.toString()}`, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.certificates)) return d.certificates;
      }
    } catch {}

    const local = await getLocal<CertificateRecord>('certificates', 'certificates.json', 'certificates');
    return local.filter(x => {
      if (params?.cert_type && (x.cert_type || '').toUpperCase() !== params.cert_type.toUpperCase()) return false;
      if (params?.uhid && (x.uhid || '').toLowerCase() !== params.uhid.toLowerCase()) return false;
      if (params?.search) {
        const s = params.search.toLowerCase();
        return (
          (x.patient_name || '').toLowerCase().includes(s) ||
          (x.uhid || '').toLowerCase().includes(s) ||
          (x.certificate_no || '').toLowerCase().includes(s)
        );
      }
      return true;
    });
  },

  async getCertificateById(id: string): Promise<CertificateRecord | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/certificates/${encodeURIComponent(id)}/`, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const local = await getLocal<CertificateRecord>('certificates', 'certificates.json', 'certificates');
    return local.find(x => x.id === id || x.certificate_no === id) || null;
  },

  async createCertificate(payload: Partial<CertificateRecord>): Promise<CertificateRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/certificates/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<CertificateRecord>('certificates', 'certificates.json', 'certificates');
    const seq = all.length + 1;
    const certType = (payload.cert_type || 'MEDICAL').toUpperCase();
    const prefix = certType === 'MLC' ? 'MLC' : certType === 'DEATH' ? 'DTH' : 'MED';
    const created: CertificateRecord = {
      id: `CERT-${String(seq).padStart(6, '0')}`,
      cert_type: certType as 'MEDICAL' | 'MLC' | 'DEATH' | 'FITNESS',
      certificate_no: `${prefix}-2026-${String(seq).padStart(4, '0')}`,
      patient_id: payload.uhid || payload.patient_id || 'UNKNOWN',
      uhid: payload.uhid || payload.patient_id || 'UNKNOWN',
      patient_name: payload.patient_name || 'Patient',
      age: payload.age || '35',
      gender: payload.gender || 'Male',
      address: payload.address || '',
      doctor_name: payload.doctor_name || 'Dr. Nilesh Mahale',
      issue_date: payload.issue_date || new Date().toISOString().split('T')[0],
      diagnosis: payload.diagnosis || '',
      rest_from: payload.rest_from,
      rest_to: payload.rest_to,
      fitness_date: payload.fitness_date,
      police_station: payload.police_station,
      buckle_no: payload.buckle_no,
      brought_by: payload.brought_by,
      examination_time: payload.examination_time,
      identification_marks: payload.identification_marks,
      injury_details: payload.injury_details,
      date_of_death: payload.date_of_death,
      time_of_death: payload.time_of_death,
      cause_of_death_immediate: payload.cause_of_death_immediate,
      cause_of_death_antecedent: payload.cause_of_death_antecedent,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    all.push(created);
    saveLocal('certificates', all);
    return created;
  },

  async updateCertificate(id: string, payload: Partial<CertificateRecord>): Promise<CertificateRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/certificates/${encodeURIComponent(id)}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.item) return d.item;
      }
    } catch {}

    const all = await getLocal<CertificateRecord>('certificates', 'certificates.json', 'certificates');
    const idx = all.findIndex(x => x.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...payload, updated_at: new Date().toISOString() };
      saveLocal('certificates', all);
      return all[idx];
    }
    throw new Error(`Certificate with ID ${id} not found.`);
  },

  async deleteCertificate(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/certificates/${encodeURIComponent(id)}/`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {}

    const all = await getLocal<CertificateRecord>('certificates', 'certificates.json', 'certificates');
    const filtered = all.filter(x => x.id !== id);
    saveLocal('certificates', filtered);
    return true;
  },
};

// --- Patient Visits API (Longitudinal Records) ---

export const patientVisitsApi = {
  async getVisits(uhid: string): Promise<PatientVisitRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(uhid)}/visits/`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && Array.isArray(d.visits)) return d.visits;
      }
    } catch {}

    const all = await getLocal<PatientVisitRecord>('patient_visits', 'patient_visits.json', 'visits');
    return all.filter(v => (v.uhid || '').toLowerCase() === uhid.toLowerCase());
  },

  async createVisit(uhid: string, payload: Partial<PatientVisitRecord>): Promise<PatientVisitRecord> {
    try {
      const res = await fetch(`${API_BASE_URL}/patients/${encodeURIComponent(uhid)}/visits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.visit) return d.visit;
      }
    } catch {}

    const all = await getLocal<PatientVisitRecord>('patient_visits', 'patient_visits.json', 'visits');
    const patVisits = all.filter(v => (v.uhid || '').toLowerCase() === uhid.toLowerCase());
    const nextVisitNo = patVisits.length + 1;
    const seq = all.length + 1;
    const created: PatientVisitRecord = {
      id: `VST-${String(seq).padStart(6, '0')}`,
      visit_no: nextVisitNo,
      uhid: uhid,
      patient_name: payload.patient_name || 'Patient',
      visit_date: payload.visit_date || new Date().toISOString().split('T')[0],
      visit_type: payload.visit_type || (nextVisitNo === 1 ? 'New Visit' : 'Follow-up'),
      doctor: payload.doctor || 'Dr. Nilesh Mahale',
      chief_complaint: payload.chief_complaint || 'Routine checkup',
      vitals: payload.vitals || { bp: '120/80', pulse: '76', temp: '98.4 F', spo2: '99%' },
      notes: payload.notes || '',
      created_at: new Date().toISOString(),
    };
    all.push(created);
    saveLocal('patient_visits', all);
    return created;
  },
};

