/**
 * Role-Based Access Control (RBAC), User Management, and Authentication API Service
 * Backed by Django backend `/api/auth/`, `/api/roles/`, `/api/users/`, `/api/demo-requests/`, `/api/audit-logs/`
 * with client-side localStorage caching and offline demonstration fallback.
 */

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface PagePermission {
  access: boolean;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  print: boolean;
  export: boolean;
}

export type PermissionMatrix = Record<string, PagePermission>;

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  is_system?: boolean;
  is_active: boolean;
  permissions: PermissionMatrix;
}

export interface UserRecord {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone?: string;
  role_id: string;
  is_active: boolean;
  department?: string;
  employee_id?: string;
  created_at?: string;
  last_login?: string | null;
  password?: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  user_id: string;
  username: string;
  role: string;
  action: string;
  module: string;
  record_id?: string;
  success: boolean;
  details?: string;
}

export interface DemoRequestRecord {
  id: string;
  enquiry_id: string;
  hospital_name: string;
  contact_person: string;
  email: string;
  phone: string;
  hospital_type: string;
  bed_count: string;
  preferred_date?: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  approved_at?: string | null;
  access_expiry?: string | null;
  internal_notes?: string;
  provisioned_user?: string;
}

export interface AuthSession {
  token: string;
  user: UserRecord;
  role: RoleRecord | null;
  permissions: PermissionMatrix;
}

// Built-in initial pages
export const REGISTERED_PAGES = [
  { id: 'dashboard', name: 'Dashboard', route: '/today-report-dashboard', category: 'General' },
  { id: 'patient_registration', name: 'Patient Registration', route: '/patient-registration', category: 'OPD' },
  { id: 'patient_history', name: 'Patient History & EMR', route: '/patient-history', category: 'Clinical' },
  { id: 'patient_registration_list', name: 'Patient Registration List', route: '/patient-registration-list', category: 'OPD' },
  { id: 'patient_past_info', name: 'Patient Past Info & Timeline', route: '/patient-past-info', category: 'Clinical' },
  { id: 'indoor_register', name: 'Indoor Register (Admissions)', route: '/indoor-register', category: 'IPD' },
  { id: 'indoor_summary', name: 'Indoor Summary Chart', route: '/indoor-summary', category: 'IPD' },
  { id: 'indoor_option', name: 'Indoor Options & Transfer', route: '/indoor-option', category: 'IPD' },
  { id: 'dr_visit_procedure', name: 'Dr Visit & Procedure Log', route: '/dr-visit-procedure', category: 'Clinical' },
  { id: 'inpatient_bill', name: 'Inpatient Comprehensive Bill', route: '/inpatient-bill', category: 'Billing' },
  { id: 'billing', name: 'OPD Billing Desk', route: '/billing', category: 'Billing' },
  { id: 'bill_preview', name: 'Bill Preview & Tax Invoice', route: '/bill-preview', category: 'Billing' },
  { id: 'deposit_entry', name: 'Deposit Entry & Advances', route: '/deposit-entry', category: 'Billing' },
  { id: 'inpatient_receipt', name: 'Inpatient Payment Receipts', route: '/inpatient-receipt', category: 'Billing' },
  { id: 'part_payment', name: 'Part-Payment Settlement', route: '/part-payment', category: 'Billing' },
  { id: 'discharge_card', name: 'Discharge Card & Summary', route: '/discharge-card', category: 'Clinical' },
  { id: 'room_charges', name: 'Room & Bed Charges', route: '/room-charges', category: 'IPD' },
  { id: 'room_status', name: 'Room & Ward Status Board', route: '/room-status', category: 'IPD' },
  { id: 'ot_entry', name: 'OT Entry & Surgical Log', route: '/ot-entry', category: 'Surgical' },
  { id: 'operation_charges', name: 'Operation Charges Tariff', route: '/operation-charges', category: 'Surgical' },
  { id: 'accounts', name: 'Accounts & Financial Reports', route: '/accounts', category: 'Finance' },
  { id: 'investigation_ordered', name: 'Investigation Ordered', route: '/investigation-ordered', category: 'Diagnostics' },
  { id: 'echo_report', name: '2D Echocardiography Study', route: '/echo-report', category: 'Diagnostics' },
  { id: 'bed_master', name: 'Bed Master & Tariffs', route: '/bed-master', category: 'Masters' },
  { id: 'doctor_master', name: 'Doctor Master Directory', route: '/doctor-master', category: 'Masters' },
  { id: 'medicine_master', name: 'Medicine & Pharmacy Master', route: '/medicine-master', category: 'Masters' },
  { id: 'department_master', name: 'Department Master', route: '/department-master', category: 'Masters' },
  { id: 'room_type_master', name: 'Room Type Master', route: '/room-type-master', category: 'Masters' },
  { id: 'report_template', name: 'Clinical Report Templates', route: '/report-template', category: 'Masters' },
  { id: 'roles_permissions', name: 'Roles & Granular Permissions', route: '/roles', category: 'Administration' },
  { id: 'user_management', name: 'User Management', route: '/users', category: 'Administration' },
  { id: 'demo_requests', name: 'Demo Request Management', route: '/demo-requests', category: 'Administration' },
];

export const authApi = {
  /**
   * Log in user against backend or cached credentials
   */
  async login(username: string, password: string):Promise<AuthSession> {
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const session: AuthSession = {
            token: data.token,
            user: data.user,
            role: data.role,
            permissions: data.permissions || {}
          };
          this.setStoredSession(session);
          return session;
        }
      }
    } catch {
      // Fallback to client-side demo accounts if backend unreachable
    }

    // Default emergency fallback
    if (username.toLowerCase() === 'admin' && (password === 'admin' || password === 'Admin@123')) {
      const session: AuthSession = {
        token: 'LOCAL-SUPERADMIN-TOKEN',
        user: {
          id: 'USR-000001',
          username: 'admin',
          full_name: 'System Administrator (Emergency)',
          email: 'admin@mixuhospital.com',
          role_id: 'super_admin',
          is_active: true
        },
        role: {
          id: 'super_admin',
          name: 'Super Admin',
          description: 'Full institutional authority',
          is_active: true,
          permissions: REGISTERED_PAGES.reduce((acc, p) => {
            acc[p.id] = { access: true, view: true, create: true, edit: true, delete: true, print: true, export: true };
            return acc;
          }, {} as PermissionMatrix)
        },
        permissions: REGISTERED_PAGES.reduce((acc, p) => {
          acc[p.id] = { access: true, view: true, create: true, edit: true, delete: true, print: true, export: true };
          return acc;
        }, {} as PermissionMatrix)
      };
      this.setStoredSession(session);
      return session;
    }

    throw new Error('Invalid credentials or unauthorized account.');
  },

  setStoredSession(session: AuthSession) {
    localStorage.setItem('mixu_session', JSON.stringify(session));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', session.user.full_name);
    localStorage.setItem('userRole', session.role?.name || session.user.role_id);
  },

  getStoredSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem('mixu_session');
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return null;
  },

  logout() {
    localStorage.removeItem('mixu_session');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  },

  /**
   * Check if the currently logged in user has a specific permission
   */
  hasPermission(pageId: string, operation: keyof PagePermission = 'access'): boolean {
    const session = this.getStoredSession();
    if (!session) return true; // Default permissive in preview if not enforced
    if (session.user?.role_id === 'super_admin') return true;

    const pagePerm = session.permissions?.[pageId];
    if (!pagePerm) return false;
    if (!pagePerm.access) return false;
    return Boolean(pagePerm[operation]);
  },

  // ROLES API
  async getRoles(): Promise<RoleRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/roles/`);
      if (res.ok) {
        const data = await res.json();
        return data.roles || [];
      }
    } catch {
      // Ignore
    }
    const local = localStorage.getItem('mixu_roles');
    if (local) return JSON.parse(local);

    return [
      {
        id: 'super_admin',
        name: 'Super Admin',
        description: 'Full institutional authority across all modules.',
        is_system: true,
        is_active: true,
        permissions: REGISTERED_PAGES.reduce((acc, p) => {
          acc[p.id] = { access: true, view: true, create: true, edit: true, delete: true, print: true, export: true };
          return acc;
        }, {} as PermissionMatrix)
      },
      {
        id: 'doctor',
        name: 'Consultant Doctor',
        description: 'Clinical care, prescriptions, 2D Echo, and discharge summaries.',
        is_system: false,
        is_active: true,
        permissions: REGISTERED_PAGES.reduce((acc, p) => {
          const isClin = ['patient_registration', 'patient_history', 'dr_visit_procedure', 'echo_report', 'discharge_card'].includes(p.id);
          acc[p.id] = { access: isClin, view: true, create: isClin, edit: isClin, delete: false, print: true, export: false };
          return acc;
        }, {} as PermissionMatrix)
      }
    ];
  },

  async saveRole(role: RoleRecord): Promise<RoleRecord> {
    const isEdit = Boolean(role.id);
    const url = isEdit ? `${API_BASE}/roles/${role.id}/` : `${API_BASE}/roles/`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role)
      });
      if (res.ok) {
        const data = await res.json();
        return data.role;
      }
    } catch {
      // Save locally
    }
    const roles = await this.getRoles();
    const idx = roles.findIndex(r => r.id === role.id);
    if (idx >= 0) {
      roles[idx] = role;
    } else {
      roles.push(role);
    }
    localStorage.setItem('mixu_roles', JSON.stringify(roles));
    return role;
  },

  async deleteRole(roleId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/roles/${roleId}/`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // Ignore
    }
    const roles = (await this.getRoles()).filter(r => r.id !== roleId);
    localStorage.setItem('mixu_roles', JSON.stringify(roles));
    return true;
  },

  // USERS API
  async getUsers(): Promise<UserRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/users/`);
      if (res.ok) {
        const data = await res.json();
        return data.users || [];
      }
    } catch {
      // Ignore
    }
    const local = localStorage.getItem('mixu_users');
    if (local) return JSON.parse(local);

    return [
      {
        id: 'USR-000001',
        username: 'admin',
        full_name: 'System Administrator',
        email: 'admin@mixuhospital.com',
        phone: '+91 98765 00001',
        role_id: 'super_admin',
        is_active: true,
        department: 'Administration'
      },
      {
        id: 'USR-000002',
        username: 'dr_mahale',
        full_name: 'Dr. Nilesh Mahale',
        email: 'nilesh.mahale@mixuhospital.com',
        phone: '+91 98765 00002',
        role_id: 'doctor',
        is_active: true,
        department: 'Cardiology'
      }
    ];
  },

  async saveUser(user: Partial<UserRecord>): Promise<UserRecord> {
    const isEdit = Boolean(user.id);
    const url = isEdit ? `${API_BASE}/users/${user.id}/` : `${API_BASE}/users/`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch {
      // Save locally
    }
    const users = await this.getUsers();
    if (isEdit) {
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) users[idx] = { ...users[idx], ...user } as UserRecord;
    } else {
      const created = {
        id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
        ...user,
        is_active: true,
        created_at: new Date().toISOString()
      } as UserRecord;
      users.push(created);
      user = created;
    }
    localStorage.setItem('mixu_users', JSON.stringify(users));
    return user as UserRecord;
  },

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // Ignore
    }
    const users = (await this.getUsers()).filter(u => u.id !== userId);
    localStorage.setItem('mixu_users', JSON.stringify(users));
    return true;
  },

  // AUDIT LOGS
  async getAuditLogs(): Promise<AuditLogRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/audit-logs/`);
      if (res.ok) {
        const data = await res.json();
        return data.logs || [];
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'AUD-001',
        timestamp: new Date().toISOString(),
        user_id: 'USR-000001',
        username: 'admin',
        role: 'super_admin',
        action: 'LOGIN_SUCCESS',
        module: 'Authentication',
        success: true
      }
    ];
  },

  // DEMO REQUESTS
  async getDemoRequests(): Promise<DemoRequestRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/demo-requests/`);
      if (res.ok) {
        const data = await res.json();
        return data.requests || [];
      }
    } catch {
      // Ignore
    }
    const local = localStorage.getItem('mixu_demo_requests');
    return local ? JSON.parse(local) : [];
  },

  async approveDemoRequest(enquiryId: string, durationDays: number, notes: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/demo-requests/${enquiryId}/approve/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration_days: durationDays, internal_notes: notes })
      });
      if (res.ok) return await res.json();
    } catch {
      // Local fallback
    }
    const list = await this.getDemoRequests();
    const req = list.find(r => r.id === enquiryId || r.enquiry_id === enquiryId);
    if (req) {
      req.status = 'Approved';
      req.approved_at = new Date().toISOString();
      req.internal_notes = notes;
      localStorage.setItem('mixu_demo_requests', JSON.stringify(list));
    }
    return { success: true, message: 'Demo request approved locally.' };
  },

  async rejectDemoRequest(enquiryId: string, notes: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/demo-requests/${enquiryId}/reject/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internal_notes: notes })
      });
      if (res.ok) return await res.json();
    } catch {
      // Local fallback
    }
    const list = await this.getDemoRequests();
    const req = list.find(r => r.id === enquiryId || r.enquiry_id === enquiryId);
    if (req) {
      req.status = 'Rejected';
      req.internal_notes = notes;
      localStorage.setItem('mixu_demo_requests', JSON.stringify(list));
    }
    return { success: true, message: 'Demo request rejected.' };
  }
};
