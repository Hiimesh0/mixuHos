/**
 * Accounts and Financial Reporting API Service.
 * Connects to Django backend (/api/accounts/summary/, /api/accounts/transactions/, /api/accounts/export/)
 * with pure client-side calculation fallback for GitHub Pages hosting using localStorage and seed JSON.
 */

import { admissionApi, depositApi, bedApi } from './hospitalApi';
import { patientApi } from './patientApi';

export interface AccountsSummaryData {
  success: boolean;
  period: string;
  period_label: string;
  start_date: string;
  end_date: string;
  patient_metrics: {
    new_registrations: number;
    total_patients: number;
  };
  admission_metrics: {
    admissions_in_period: number;
    active_admissions: number;
    total_admissions_system: number;
  };
  bed_metrics: {
    total_beds: number;
    occupied_beds: number;
    vacant_beds: number;
    cleaning_beds: number;
    occupancy_rate_percent: number;
    ward_breakdown: Record<string, { total: number; occupied: number; vacant: number }>;
  };
  financial_totals: {
    total_billed: number;
    total_gross: number;
    total_discount: number;
    bills_collected: number;
    deposits_collected: number;
    total_collected: number;
    total_outstanding: number;
    collection_rate_percent: number;
    bills_count: number;
    deposits_count: number;
  };
  payment_method_breakdown: { method: string; amount: number; percent: number }[];
  department_billing_breakdown: { department: string; amount: number }[];
  revenue_trends: { date: string; billed: number; collected: number; admissions: number }[];
}

export interface AccountTransactionRecord {
  id: string;
  date: string;
  datetime: string;
  type: 'Bill' | 'Deposit';
  reference_no: string;
  uhid: string;
  patient_name: string;
  particulars: string;
  payment_mode: string;
  debit: number;
  credit: number;
  balance: number;
  status: string;
}

export interface AccountsTransactionsResponse {
  success: boolean;
  period: string;
  period_label: string;
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  summary: {
    total_debit: number;
    total_credit: number;
    total_balance: number;
  };
  transactions: AccountTransactionRecord[];
}

export interface AccountsFilterParams {
  period?: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'previous_month' | 'this_year' | 'all' | 'custom';
  start_date?: string;
  end_date?: string;
  search?: string;
  type?: 'all' | 'bill' | 'deposit';
  page?: number;
  page_size?: number;
}

const API_BASE_URL = (() => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const port = window.location.port;
    if (port === '5173' || port === '4173') return '/api';
    if (window.location.protocol === 'https:') return '';
    if (host === 'localhost' || host === '127.0.0.1') return 'http://127.0.0.1:8000/api';
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return `http://${host}:8000/api`;
  }
  return 'http://127.0.0.1:8000/api';
})();

/**
 * Pure client-side calculations for GitHub Pages fallback.
 */
async function computeClientFallbackSummary(params?: AccountsFilterParams): Promise<AccountsSummaryData> {
  const period = params?.period || 'this_month';
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();
  let periodLabel = 'This Month';

  if (period === 'today') {
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    periodLabel = 'Today';
  } else if (period === 'yesterday') {
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59);
    periodLabel = 'Yesterday';
  } else if (period === 'last_7_days') {
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    periodLabel = 'Last 7 Days';
  } else if (period === 'last_30_days') {
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    periodLabel = 'Last 30 Days';
  } else if (period === 'this_month') {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    periodLabel = 'This Month';
  } else if (period === 'previous_month') {
    startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    endDate = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
    periodLabel = 'Previous Month';
  } else if (period === 'this_year') {
    startDate = new Date(today.getFullYear(), 0, 1);
    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    periodLabel = 'This Year';
  } else if (period === 'all') {
    startDate = new Date(2020, 0, 1);
    endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    periodLabel = 'All Time';
  } else if (period === 'custom' && params?.start_date && params?.end_date) {
    startDate = new Date(params.start_date);
    endDate = new Date(params.end_date);
    endDate.setHours(23, 59, 59, 999);
    periodLabel = `${params.start_date} to ${params.end_date}`;
  }

  const startIso = startDate.toISOString().split('T')[0];
  const endIso = endDate.toISOString().split('T')[0];

  // Load datasets in parallel
  const [adms, deps, bedsList] = await Promise.all([
    admissionApi.getAdmissions(),
    depositApi.getDeposits(),
    bedApi.getBeds(),
  ]);

  // Load bills and patients from localStorage or public data
  let billsList: any[] = [];
  try {
    const rawBills = localStorage.getItem('mixu_bills');
    if (rawBills) {
      const parsed = JSON.parse(rawBills);
      billsList = Array.isArray(parsed) ? parsed : (parsed.bills || []);
    } else {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const bRes = await fetch(`${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}data/bills.json`);
      if (bRes.ok) {
        const bData = await bRes.json();
        billsList = Array.isArray(bData) ? bData : (bData.bills || []);
      }
    }
  } catch {}

  let patientsList: any[] = [];
  try {
    const rawP = localStorage.getItem('mixu_patients');
    if (rawP) {
      const parsed = JSON.parse(rawP);
      patientsList = Array.isArray(parsed) ? parsed : (parsed.patients || []);
    } else {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const pRes = await fetch(`${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}data/patients.json`);
      if (pRes.ok) {
        const pData = await pRes.json();
        patientsList = Array.isArray(pData) ? pData : (pData.patients || []);
      }
    }
  } catch {}

  // Filter registrations
  const periodPatients = patientsList.filter(p => {
    const c = (p.createdAt || p.created_at || '').split('T')[0];
    return c && c >= startIso && c <= endIso;
  });

  // Filter admissions
  const periodAdmissions = adms.filter(a => {
    const d = (a.admission_date || '').split('T')[0];
    return d && d >= startIso && d <= endIso;
  });
  const activeAdms = adms.filter(a => a.status === 'Admitted').length;

  // Bed metrics
  const totalBeds = bedsList.length || 24;
  const occupiedBeds = bedsList.filter(b => (b.status || '').toLowerCase() === 'occupied').length;
  const vacantBeds = bedsList.filter(b => (b.status || '').toLowerCase() === 'vacant').length;
  const cleaningBeds = bedsList.filter(b => ['cleaning', 'maintenance'].includes((b.status || '').toLowerCase())).length;

  const wardMap: Record<string, { total: number; occupied: number; vacant: number }> = {};
  bedsList.forEach(b => {
    const w = b.ward_name || 'General Ward';
    if (!wardMap[w]) wardMap[w] = { total: 0, occupied: 0, vacant: 0 };
    wardMap[w].total += 1;
    if ((b.status || '').toLowerCase() === 'occupied') wardMap[w].occupied += 1;
    else wardMap[w].vacant += 1;
  });

  // Financial calculations
  let totalBilled = 0;
  let totalGross = 0;
  let totalDiscount = 0;
  let billsCollected = 0;
  let totalOutstanding = 0;
  const periodBills = [];

  const paymentModes: Record<string, number> = {
    Cash: 0,
    'Online / UPI': 0,
    Card: 0,
    'Cheque / Bank': 0,
    'Insurance / TPA': 0,
  };

  const deptMap: Record<string, number> = {
    'Bed Charges': 0,
    'Doctor Rounds & Visits': 0,
    'Surgeries & OT': 0,
    'Investigations & Lab': 0,
    'Medicines & Pharmacy': 0,
    'Consultation & OPD': 0,
    'General / Other': 0,
  };

  const trendMap: Record<string, { billed: number; collected: number; admissions: number }> = {};

  // Build daily slots if <= 60 days
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  if (daysDiff <= 60) {
    const cur = new Date(startDate);
    while (cur <= endDate) {
      const dt = cur.toISOString().split('T')[0];
      trendMap[dt] = { billed: 0, collected: 0, admissions: 0 };
      cur.setDate(cur.getDate() + 1);
    }
  }

  billsList.forEach(b => {
    const d = (b.billDate || b.createdAt || '').split('T')[0];
    if (d && d >= startIso && d <= endIso) {
      periodBills.push(b);
      const net = Number(b.netAmount ?? 0);
      const gross = Number(b.subtotal ?? b.grossAmount ?? net);
      const disc = Number(b.discountAmount ?? 0);
      const rcvd = Number(b.totalReceived ?? 0);
      const bal = Number(b.balanceAmount ?? Math.max(0, net - rcvd));

      totalBilled += net;
      totalGross += gross;
      totalDiscount += disc;
      billsCollected += rcvd;
      totalOutstanding += Math.max(0, bal);

      const pType = (b.paymentType || 'Cash').toLowerCase();
      let modeKey = 'Cash';
      if (pType.includes('upi') || pType.includes('online')) modeKey = 'Online / UPI';
      else if (pType.includes('card')) modeKey = 'Card';
      else if (pType.includes('cheque') || pType.includes('bank')) modeKey = 'Cheque / Bank';
      else if (pType.includes('insurance') || pType.includes('tpa')) modeKey = 'Insurance / TPA';
      paymentModes[modeKey] = (paymentModes[modeKey] || 0) + rcvd;

      // Department items
      (b.items || []).forEach((itm: any) => {
        const desc = (itm.description || itm.serviceName || '').toLowerCase();
        const amt = Number(itm.amount ?? (Number(itm.rate ?? 0) * Number(itm.quantity ?? 1)));
        if (desc.includes('bed') || desc.includes('room') || desc.includes('icu')) deptMap['Bed Charges'] += amt;
        else if (desc.includes('round') || desc.includes('visit') || desc.includes('consult')) deptMap['Doctor Rounds & Visits'] += amt;
        else if (desc.includes('ot') || desc.includes('surg') || desc.includes('operat')) deptMap['Surgeries & OT'] += amt;
        else if (desc.includes('echo') || desc.includes('lab') || desc.includes('ecg') || desc.includes('x-ray')) deptMap['Investigations & Lab'] += amt;
        else if (desc.includes('tab') || desc.includes('inj') || desc.includes('med') || desc.includes('pharm')) deptMap['Medicines & Pharmacy'] += amt;
        else deptMap['General / Other'] += amt;
      });

      if (trendMap[d]) {
        trendMap[d].billed += net;
        trendMap[d].collected += rcvd;
      }
    }
  });

  // Filter deposits
  let depositsCollected = 0;
  const periodDeps = deps.filter(dp => {
    const d = (dp.deposit_date || dp.created_at || '').split('T')[0];
    return d && d >= startIso && d <= endIso;
  });

  periodDeps.forEach(dp => {
    const amt = Number(dp.amount || 0);
    depositsCollected += amt;
    const pMode = (dp.payment_mode || 'Online / UPI').toLowerCase();
    let modeKey = 'Online / UPI';
    if (pMode.includes('cash')) modeKey = 'Cash';
    else if (pMode.includes('card')) modeKey = 'Card';
    else if (pMode.includes('cheque') || pMode.includes('bank')) modeKey = 'Cheque / Bank';
    else if (pMode.includes('insurance')) modeKey = 'Insurance / TPA';
    paymentModes[modeKey] = (paymentModes[modeKey] || 0) + amt;

    const d = (dp.deposit_date || dp.created_at || '').split('T')[0];
    if (trendMap[d]) {
      trendMap[d].collected += amt;
    }
  });

  // Add admissions to trends
  periodAdmissions.forEach(a => {
    const d = (a.admission_date || '').split('T')[0];
    if (trendMap[d]) trendMap[d].admissions += 1;
  });

  const totalCollected = Number((billsCollected + depositsCollected).toFixed(2));
  totalBilled = Number(totalBilled.toFixed(2));
  totalOutstanding = Number(totalOutstanding.toFixed(2));

  return {
    success: true,
    period,
    period_label: periodLabel,
    start_date: startIso,
    end_date: endIso,
    patient_metrics: {
      new_registrations: periodPatients.length,
      total_patients: patientsList.length,
    },
    admission_metrics: {
      admissions_in_period: periodAdmissions.length,
      active_admissions: activeAdms,
      total_admissions_system: adms.length,
    },
    bed_metrics: {
      total_beds: totalBeds,
      occupied_beds: occupiedBeds,
      vacant_beds: vacantBeds,
      cleaning_beds: cleaningBeds,
      occupancy_rate_percent: totalBeds > 0 ? Number(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0,
      ward_breakdown: wardMap,
    },
    financial_totals: {
      total_billed: totalBilled,
      total_gross: Number(totalGross.toFixed(2)),
      total_discount: Number(totalDiscount.toFixed(2)),
      bills_collected: Number(billsCollected.toFixed(2)),
      deposits_collected: Number(depositsCollected.toFixed(2)),
      total_collected: totalCollected,
      total_outstanding: totalOutstanding,
      collection_rate_percent: totalBilled > 0 ? Number(((totalCollected / totalBilled) * 100).toFixed(1)) : 0,
      bills_count: periodBills.length,
      deposits_count: periodDeps.length,
    },
    payment_method_breakdown: Object.entries(paymentModes)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => ({
        method: k,
        amount: Number(v.toFixed(2)),
        percent: totalCollected > 0 ? Number(((v / totalCollected) * 100).toFixed(1)) : 0,
      })),
    department_billing_breakdown: Object.entries(deptMap)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => ({ department: k, amount: Number(v.toFixed(2)) })),
    revenue_trends: Object.entries(trendMap).map(([dt, d]) => ({
      date: dt,
      billed: Number(d.billed.toFixed(2)),
      collected: Number(d.collected.toFixed(2)),
      admissions: d.admissions,
    })),
  };
}

export const accountsApi = {
  /**
   * Fetches the financial & operational summary for the selected period.
   */
  async getSummary(params?: AccountsFilterParams): Promise<AccountsSummaryData> {
    if (API_BASE_URL) {
      try {
        const q = new URLSearchParams();
        if (params?.period) q.set('period', params.period);
        if (params?.start_date) q.set('start_date', params.start_date);
        if (params?.end_date) q.set('end_date', params.end_date);
        const res = await fetch(`${API_BASE_URL}/accounts/summary/?${q.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) return data;
        }
      } catch (err) {
        console.warn('Backend accounts summary unavailable, switching to local calculation:', err);
      }
    }
    return computeClientFallbackSummary(params);
  },

  /**
   * Fetches paginated, searchable transactions ledger combining bills and deposits.
   */
  async getTransactions(params?: AccountsFilterParams): Promise<AccountsTransactionsResponse> {
    if (API_BASE_URL) {
      try {
        const q = new URLSearchParams();
        if (params?.period) q.set('period', params.period);
        if (params?.start_date) q.set('start_date', params.start_date);
        if (params?.end_date) q.set('end_date', params.end_date);
        if (params?.search) q.set('search', params.search);
        if (params?.type) q.set('type', params.type);
        if (params?.page) q.set('page', String(params.page));
        if (params?.page_size) q.set('page_size', String(params.page_size));

        const res = await fetch(`${API_BASE_URL}/accounts/transactions/?${q.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) return data;
        }
      } catch (err) {
        console.warn('Backend transactions unavailable, using local calculation:', err);
      }
    }

    // Client-side fallback ledger
    const summary = await computeClientFallbackSummary(params);
    const [deps] = await Promise.all([depositApi.getDeposits()]);

    let rawBills: any[] = [];
    try {
      const stored = localStorage.getItem('mixu_bills');
      if (stored) {
        const parsed = JSON.parse(stored);
        rawBills = Array.isArray(parsed) ? parsed : (parsed.bills || []);
      }
    } catch {}

    const transactions: AccountTransactionRecord[] = [];
    const search = (params?.search || '').toLowerCase().trim();
    const txType = params?.type || 'all';

    if (txType === 'all' || txType === 'bill') {
      rawBills.forEach(b => {
        const d = (b.billDate || b.createdAt || '').split('T')[0];
        if (d && d >= summary.start_date && d <= summary.end_date) {
          const inv = b.invoiceNo || b.id || '';
          const uhid = b.uhid || '';
          const name = b.patientName || 'Patient';
          if (search && !inv.toLowerCase().includes(search) && !uhid.toLowerCase().includes(search) && !name.toLowerCase().includes(search)) {
            return;
          }
          const net = Number(b.netAmount ?? 0);
          const rcvd = Number(b.totalReceived ?? 0);
          const bal = Number(b.balanceAmount ?? Math.max(0, net - rcvd));
          transactions.push({
            id: `TX-BILL-${b.id || inv}`,
            date: d,
            datetime: b.billDate || b.createdAt || d,
            type: 'Bill',
            reference_no: inv,
            uhid,
            patient_name: name,
            particulars: `Hospital Invoice ${inv} (${(b.items || []).length} items)`,
            payment_mode: b.paymentType || 'Cash',
            debit: net,
            credit: rcvd,
            balance: Math.max(0, bal),
            status: b.status || (bal <= 0 ? 'Paid' : 'Pending'),
          });
        }
      });
    }

    if (txType === 'all' || txType === 'deposit') {
      deps.forEach(dp => {
        const d = (dp.deposit_date || dp.created_at || '').split('T')[0];
        if (d && d >= summary.start_date && d <= summary.end_date) {
          const rcp = dp.receipt_no || dp.id || '';
          const uhid = dp.uhid || '';
          const name = dp.patient_name || 'Patient';
          if (search && !rcp.toLowerCase().includes(search) && !uhid.toLowerCase().includes(search) && !name.toLowerCase().includes(search)) {
            return;
          }
          const amt = Number(dp.amount || 0);
          transactions.push({
            id: `TX-DEP-${dp.id || rcp}`,
            date: d,
            datetime: dp.created_at || d,
            type: 'Deposit',
            reference_no: rcp,
            uhid,
            patient_name: name,
            particulars: `Advance Deposit #${dp.ipd_no || ''}: ${dp.remarks || 'Security Deposit'}`,
            payment_mode: dp.payment_mode || 'Online / UPI',
            debit: 0,
            credit: amt,
            balance: 0,
            status: 'Received',
          });
        }
      });
    }

    transactions.sort((a, b) => b.datetime.localeCompare(a.datetime));

    const page = params?.page || 1;
    const pageSize = params?.page_size || 20;
    const totalCount = transactions.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const startIdx = (page - 1) * pageSize;
    const paginated = transactions.slice(startIdx, startIdx + pageSize);

    return {
      success: true,
      period: summary.period,
      period_label: summary.period_label,
      total_count: totalCount,
      page,
      page_size: pageSize,
      total_pages: totalPages,
      summary: {
        total_debit: Number(transactions.reduce((s, t) => s + t.debit, 0).toFixed(2)),
        total_credit: Number(transactions.reduce((s, t) => s + t.credit, 0).toFixed(2)),
        total_balance: Number(transactions.reduce((s, t) => s + t.balance, 0).toFixed(2)),
      },
      transactions: paginated,
    };
  },

  /**
   * Generates and triggers instant CSV download for any of the 8 standard report types.
   */
  async exportReport(reportType: string, params?: AccountsFilterParams): Promise<void> {
    const summary = await computeClientFallbackSummary(params);
    const txRes = await accountsApi.getTransactions({ ...params, page: 1, page_size: 1000 });
    const beds = await bedApi.getBeds();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    let filename = `Mixu_${reportType}_${timestamp}.csv`;
    let csvRows: string[][] = [];

    if (reportType === 'daily_collection' || reportType === 'all_transactions' || reportType === 'audit_trail') {
      csvRows.push(['Date', 'Type', 'Reference No', 'UHID', 'Patient Name', 'Particulars', 'Payment Mode', 'Billed (Rs)', 'Received (Rs)', 'Balance (Rs)', 'Status']);
      txRes.transactions.forEach(t => {
        csvRows.push([
          t.date,
          t.type,
          t.reference_no,
          t.uhid,
          t.patient_name,
          t.particulars.replace(/,/g, ' '),
          t.payment_mode,
          t.debit.toFixed(2),
          t.credit.toFixed(2),
          t.balance.toFixed(2),
          t.status,
        ]);
      });
    } else if (reportType === 'bed_occupancy') {
      csvRows.push(['Bed Number', 'Ward Name', 'Daily Rate (Rs)', 'Status', 'Current Admission ID', 'Current Patient ID']);
      beds.forEach(b => {
        csvRows.push([
          b.bed_number,
          b.ward_name,
          Number(b.daily_rate || 0).toFixed(2),
          b.status,
          b.current_admission_id || '-',
          b.current_patient_id || '-',
        ]);
      });
    } else if (reportType === 'outstanding_balance') {
      csvRows.push(['Date', 'Invoice No', 'UHID', 'Patient Name', 'Billed (Rs)', 'Received (Rs)', 'Outstanding Balance (Rs)', 'Status']);
      txRes.transactions.filter(t => t.type === 'Bill' && t.balance > 0).forEach(t => {
        csvRows.push([
          t.date,
          t.reference_no,
          t.uhid,
          t.patient_name,
          t.debit.toFixed(2),
          t.credit.toFixed(2),
          t.balance.toFixed(2),
          t.status,
        ]);
      });
    } else if (reportType === 'payment_mode_summary') {
      csvRows.push(['Payment Method', 'Total Collected (Rs)', 'Share (%)']);
      summary.payment_method_breakdown.forEach(p => {
        csvRows.push([p.method, p.amount.toFixed(2), `${p.percent}%`]);
      });
    } else if (reportType === 'monthly_revenue') {
      csvRows.push(['Date', 'Billed Revenue (Rs)', 'Collected (Rs)', 'Inpatient Admissions']);
      summary.revenue_trends.forEach(r => {
        csvRows.push([r.date, r.billed.toFixed(2), r.collected.toFixed(2), String(r.admissions)]);
      });
    } else {
      // General / Department
      csvRows.push(['Department / Service Group', 'Total Revenue (Rs)']);
      summary.department_billing_breakdown.forEach(d => {
        csvRows.push([d.department, d.amount.toFixed(2)]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
