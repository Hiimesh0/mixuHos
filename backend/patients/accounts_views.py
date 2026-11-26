"""
Accounts and Financial Reporting Views for Mixu Hospital Management System.
Provides summary metrics, searchable transactions ledger, and report exports
backed by existing JSON storage repositories (bills, deposits, admissions, beds, patients).
"""

from datetime import datetime, date, timedelta
import csv
import json
import logging
from io import StringIO
from typing import Dict, Any, List, Tuple

from django.conf import settings
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .storage import storage as patient_storage
from .bill_storage import bill_storage
from .repositories import (
    deposit_repo,
    admission_repo,
    bed_repo,
)

logger = logging.getLogger(__name__)


def parse_date_str(val: Any) -> date | None:
    """Extracts a date object from various string formats (ISO, YYYY-MM-DD, etc.)."""
    if not val:
        return None
    s = str(val).strip()
    if 'T' in s:
        s = s.split('T')[0]
    elif ' ' in s:
        s = s.split(' ')[0]
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except Exception:
        return None


def resolve_date_range(period: str, start_str: str | None, end_str: str | None) -> Tuple[date, date, str]:
    """Resolves period parameter into concrete start and end dates and a human label."""
    today = date.today()
    period = (period or 'this_month').lower().strip()

    if period == 'today':
        return today, today, "Today"
    elif period == 'yesterday':
        y = today - timedelta(days=1)
        return y, y, "Yesterday"
    elif period in ('last_7_days', 'last_7d', '7d'):
        s = today - timedelta(days=6)
        return s, today, "Last 7 Days"
    elif period in ('last_30_days', 'last_30d', '30d'):
        s = today - timedelta(days=29)
        return s, today, "Last 30 Days"
    elif period in ('this_month', 'current_month'):
        s = date(today.year, today.month, 1)
        return s, today, "This Month"
    elif period in ('previous_month', 'last_month'):
        # First day of prev month
        first_this = date(today.year, today.month, 1)
        last_prev = first_this - timedelta(days=1)
        first_prev = date(last_prev.year, last_prev.month, 1)
        return first_prev, last_prev, "Previous Month"
    elif period in ('this_year', 'current_year', 'year'):
        s = date(today.year, 1, 1)
        return s, today, "This Year"
    elif period == 'all':
        return date(2020, 1, 1), today, "All Time"
    elif period == 'custom' or (start_str and end_str):
        s_date = parse_date_str(start_str) or (today - timedelta(days=30))
        e_date = parse_date_str(end_str) or today
        if s_date > e_date:
            s_date, e_date = e_date, s_date
        return s_date, e_date, f"{s_date.strftime('%d-%b-%Y')} to {e_date.strftime('%d-%b-%Y')}"

    # Default fallback: last 30 days
    s = today - timedelta(days=29)
    return s, today, "Last 30 Days"


class AccountsSummaryView(APIView):
    """
    GET /api/accounts/summary/
    Returns high-level financial, registration, and bed occupancy metrics
    filtered by the selected date interval.
    """

    def get(self, request):
        try:
            period = request.query_params.get('period', 'this_month')
            start_param = request.query_params.get('start_date')
            end_param = request.query_params.get('end_date')

            start_date, end_date, period_label = resolve_date_range(period, start_param, end_param)

            # 1. Fetch records from existing JSON repositories
            bills: List[Dict[str, Any]] = bill_storage.get_all()
            deposits: List[Dict[str, Any]] = deposit_repo.get_all()
            admissions: List[Dict[str, Any]] = admission_repo.get_all()
            beds: List[Dict[str, Any]] = bed_repo.get_all()
            patients: List[Dict[str, Any]] = patient_storage.get_all()

            # 2. Patient Registration metrics
            period_patients = []
            for p in patients:
                created = parse_date_str(p.get('createdAt') or p.get('created_at'))
                if created and start_date <= created <= end_date:
                    period_patients.append(p)

            # 3. Admission metrics
            period_admissions = []
            active_admissions = 0
            for a in admissions:
                if a.get('status') == 'Admitted':
                    active_admissions += 1
                ad_date = parse_date_str(a.get('admission_date'))
                if ad_date and start_date <= ad_date <= end_date:
                    period_admissions.append(a)

            # 4. Bed Occupancy metrics
            total_beds = len(beds)
            occupied_beds = sum(1 for b in beds if str(b.get('status')).lower() == 'occupied')
            vacant_beds = sum(1 for b in beds if str(b.get('status')).lower() == 'vacant')
            cleaning_beds = sum(1 for b in beds if str(b.get('status')).lower() in ('cleaning', 'maintenance'))
            occupancy_rate = round((occupied_beds / total_beds * 100), 1) if total_beds > 0 else 0.0

            # Bed breakdown by ward
            ward_breakdown = {}
            for b in beds:
                w_name = b.get('ward_name', 'General Ward')
                if w_name not in ward_breakdown:
                    ward_breakdown[w_name] = {'total': 0, 'occupied': 0, 'vacant': 0}
                ward_breakdown[w_name]['total'] += 1
                st = str(b.get('status')).lower()
                if st == 'occupied':
                    ward_breakdown[w_name]['occupied'] += 1
                else:
                    ward_breakdown[w_name]['vacant'] += 1

            # 5. Financial metrics (Bills in period)
            period_bills = []
            total_billed = 0.0
            total_gross = 0.0
            total_discount = 0.0
            bills_collected = 0.0
            total_outstanding = 0.0

            payment_mode_totals: Dict[str, float] = {
                'Cash': 0.0,
                'Online / UPI': 0.0,
                'Card': 0.0,
                'Cheque / Bank': 0.0,
                'Insurance / TPA': 0.0,
                'Other': 0.0,
            }

            department_revenue = {
                'Bed Charges': 0.0,
                'Doctor Rounds & Visits': 0.0,
                'Surgeries & OT': 0.0,
                'Investigations & Lab': 0.0,
                'Medicines & Pharmacy': 0.0,
                'Consultation & OPD': 0.0,
                'General / Other': 0.0,
            }

            daily_aggregates: Dict[str, Dict[str, float]] = {}

            # Initialize daily aggregates across range if range <= 60 days
            day_count = (end_date - start_date).days + 1
            if day_count <= 60:
                cur = start_date
                while cur <= end_date:
                    d_str = cur.strftime("%Y-%m-%d")
                    daily_aggregates[d_str] = {'billed': 0.0, 'collected': 0.0, 'admissions': 0}
                    cur += timedelta(days=1)

            for b in bills:
                b_date = parse_date_str(b.get('billDate') or b.get('createdAt'))
                if b_date and start_date <= b_date <= end_date:
                    period_bills.append(b)
                    net = float(b.get('netAmount') or 0.0)
                    gross = float(b.get('subtotal') or b.get('grossAmount') or net)
                    disc = float(b.get('discountAmount') or 0.0)
                    rcvd = float(b.get('totalReceived') or 0.0)
                    bal = float(b.get('balanceAmount') or (net - rcvd))

                    total_billed += net
                    total_gross += gross
                    total_discount += disc
                    bills_collected += rcvd
                    total_outstanding += max(0.0, bal)

                    # Payment type mapping
                    ptype = str(b.get('paymentType') or 'Cash').strip()
                    norm_p = 'Cash'
                    if 'upi' in ptype.lower() or 'online' in ptype.lower():
                        norm_p = 'Online / UPI'
                    elif 'card' in ptype.lower():
                        norm_p = 'Card'
                    elif 'cheque' in ptype.lower() or 'bank' in ptype.lower():
                        norm_p = 'Cheque / Bank'
                    elif 'insurance' in ptype.lower() or 'tpa' in ptype.lower():
                        norm_p = 'Insurance / TPA'

                    payment_mode_totals[norm_p] = payment_mode_totals.get(norm_p, 0.0) + rcvd

                    # Department revenue from items
                    items = b.get('items') or []
                    for itm in items:
                        desc = str(itm.get('description') or itm.get('serviceName') or '').lower()
                        amt = float(itm.get('amount') or (float(itm.get('rate') or 0) * float(itm.get('quantity') or 1)))
                        if 'bed' in desc or 'room' in desc or 'nursing' in desc or 'icu' in desc:
                            department_revenue['Bed Charges'] += amt
                        elif 'round' in desc or 'visit' in desc or 'consult' in desc:
                            department_revenue['Doctor Rounds & Visits'] += amt
                        elif 'ot' in desc or 'surg' in desc or 'operat' in desc or 'anaesth' in desc:
                            department_revenue['Surgeries & OT'] += amt
                        elif 'echo' in desc or 'investig' in desc or 'lab' in desc or 'x-ray' in desc or 'ecg' in desc:
                            department_revenue['Investigations & Lab'] += amt
                        elif 'tab' in desc or 'inj' in desc or 'syrup' in desc or 'med' in desc or 'pharm' in desc:
                            department_revenue['Medicines & Pharmacy'] += amt
                        else:
                            department_revenue['General / Other'] += amt

                    # Daily chart aggregate
                    d_key = b_date.strftime("%Y-%m-%d")
                    if d_key in daily_aggregates:
                        daily_aggregates[d_key]['billed'] += net
                        daily_aggregates[d_key]['collected'] += rcvd

            # 6. Financial metrics (Deposits in period)
            period_deposits = []
            deposits_collected = 0.0

            for d in deposits:
                d_date = parse_date_str(d.get('deposit_date') or d.get('created_at'))
                if d_date and start_date <= d_date <= end_date:
                    period_deposits.append(d)
                    amt = float(d.get('amount') or 0.0)
                    deposits_collected += amt

                    pmode = str(d.get('payment_mode') or 'Online / UPI').strip()
                    norm_pm = 'Online / UPI'
                    if 'cash' in pmode.lower():
                        norm_pm = 'Cash'
                    elif 'card' in pmode.lower():
                        norm_pm = 'Card'
                    elif 'cheque' in pmode.lower() or 'bank' in pmode.lower():
                        norm_pm = 'Cheque / Bank'
                    elif 'insurance' in pmode.lower():
                        norm_pm = 'Insurance / TPA'

                    payment_mode_totals[norm_pm] = payment_mode_totals.get(norm_pm, 0.0) + amt

                    d_key = d_date.strftime("%Y-%m-%d")
                    if d_key in daily_aggregates:
                        daily_aggregates[d_key]['collected'] += amt

            # Add admissions to daily aggregates
            for a in period_admissions:
                ad_date = parse_date_str(a.get('admission_date'))
                if ad_date:
                    d_key = ad_date.strftime("%Y-%m-%d")
                    if d_key in daily_aggregates:
                        daily_aggregates[d_key]['admissions'] += 1

            total_collected = round(bills_collected + deposits_collected, 2)
            total_billed = round(total_billed, 2)
            total_outstanding = round(total_outstanding, 2)

            revenue_trends = [
                {
                    'date': dt,
                    'billed': round(data['billed'], 2),
                    'collected': round(data['collected'], 2),
                    'admissions': int(data['admissions']),
                }
                for dt, data in sorted(daily_aggregates.items())
            ]

            payload = {
                'success': True,
                'period': period,
                'period_label': period_label,
                'start_date': start_date.strftime("%Y-%m-%d"),
                'end_date': end_date.strftime("%Y-%m-%d"),
                'patient_metrics': {
                    'new_registrations': len(period_patients),
                    'total_patients': len(patients),
                },
                'admission_metrics': {
                    'admissions_in_period': len(period_admissions),
                    'active_admissions': active_admissions,
                    'total_admissions_system': len(admissions),
                },
                'bed_metrics': {
                    'total_beds': total_beds,
                    'occupied_beds': occupied_beds,
                    'vacant_beds': vacant_beds,
                    'cleaning_beds': cleaning_beds,
                    'occupancy_rate_percent': occupancy_rate,
                    'ward_breakdown': ward_breakdown,
                },
                'financial_totals': {
                    'total_billed': total_billed,
                    'total_gross': round(total_gross, 2),
                    'total_discount': round(total_discount, 2),
                    'bills_collected': round(bills_collected, 2),
                    'deposits_collected': round(deposits_collected, 2),
                    'total_collected': total_collected,
                    'total_outstanding': total_outstanding,
                    'collection_rate_percent': round((total_collected / total_billed * 100), 1) if total_billed > 0 else 0.0,
                    'bills_count': len(period_bills),
                    'deposits_count': len(period_deposits),
                },
                'payment_method_breakdown': [
                    {'method': k, 'amount': round(v, 2), 'percent': round(v / total_collected * 100, 1) if total_collected > 0 else 0.0}
                    for k, v in payment_mode_totals.items() if v > 0
                ],
                'department_billing_breakdown': [
                    {'department': k, 'amount': round(v, 2)}
                    for k, v in department_revenue.items() if v > 0
                ],
                'revenue_trends': revenue_trends,
            }

            return Response(payload, status=status.HTTP_200_OK)

        except Exception as exc:
            logger.exception("Error calculating accounts summary: %s", exc)
            return Response(
                {'success': False, 'error': f"Failed to compute accounts summary: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AccountsTransactionsView(APIView):
    """
    GET /api/accounts/transactions/
    Returns a unified, filterable, and paginated transaction ledger
    combining bills and advance deposits.
    """

    def get(self, request):
        try:
            period = request.query_params.get('period', 'all')
            start_param = request.query_params.get('start_date')
            end_param = request.query_params.get('end_date')
            search = (request.query_params.get('search') or '').strip().lower()
            tx_type = (request.query_params.get('type') or 'all').strip().lower()

            try:
                page = max(1, int(request.query_params.get('page', 1)))
            except ValueError:
                page = 1
            try:
                page_size = min(100, max(5, int(request.query_params.get('page_size', 20))))
            except ValueError:
                page_size = 20

            start_date, end_date, period_label = resolve_date_range(period, start_param, end_param)

            # Gather bills and deposits
            bills: List[Dict[str, Any]] = bill_storage.get_all()
            deposits: List[Dict[str, Any]] = deposit_repo.get_all()

            transactions = []

            # Process Bills
            if tx_type in ('all', 'bill', 'bills'):
                for b in bills:
                    b_date = parse_date_str(b.get('billDate') or b.get('createdAt'))
                    if b_date and start_date <= b_date <= end_date:
                        inv_no = b.get('invoiceNo') or b.get('id') or ''
                        uhid = b.get('uhid') or ''
                        p_name = b.get('patientName') or 'Patient'
                        net = float(b.get('netAmount') or 0.0)
                        rcvd = float(b.get('totalReceived') or 0.0)
                        bal = float(b.get('balanceAmount') or (net - rcvd))

                        # Search filter
                        if search:
                            match = (
                                search in inv_no.lower() or
                                search in uhid.lower() or
                                search in p_name.lower() or
                                search in str(b.get('mobile') or '').lower()
                            )
                            if not match:
                                continue

                        transactions.append({
                            'id': f"TX-BILL-{b.get('id')}",
                            'date': b_date.strftime("%Y-%m-%d"),
                            'datetime': b.get('billDate') or b.get('createdAt') or b_date.strftime("%Y-%m-%d"),
                            'type': 'Bill',
                            'reference_no': inv_no,
                            'uhid': uhid,
                            'patient_name': p_name,
                            'particulars': f"Hospital Invoice {inv_no} ({len(b.get('items') or [])} items)",
                            'payment_mode': b.get('paymentType') or 'Cash',
                            'debit': net,  # Charged amount
                            'credit': rcvd,  # Collected amount at billing
                            'balance': max(0.0, bal),
                            'status': b.get('status') or ('Paid' if bal <= 0 else 'Pending'),
                        })

            # Process Deposits
            if tx_type in ('all', 'deposit', 'deposits'):
                for d in deposits:
                    d_date = parse_date_str(d.get('deposit_date') or d.get('created_at'))
                    if d_date and start_date <= d_date <= end_date:
                        rcp_no = d.get('receipt_no') or d.get('id') or ''
                        uhid = d.get('uhid') or ''
                        p_name = d.get('patient_name') or 'Patient'
                        amt = float(d.get('amount') or 0.0)

                        if search:
                            match = (
                                search in rcp_no.lower() or
                                search in uhid.lower() or
                                search in p_name.lower() or
                                search in str(d.get('ipd_no') or '').lower() or
                                search in str(d.get('transaction_ref') or '').lower()
                            )
                            if not match:
                                continue

                        transactions.append({
                            'id': f"TX-DEP-{d.get('id')}",
                            'date': d_date.strftime("%Y-%m-%d"),
                            'datetime': d.get('created_at') or d_date.strftime("%Y-%m-%d"),
                            'type': 'Deposit',
                            'reference_no': rcp_no,
                            'uhid': uhid,
                            'patient_name': p_name,
                            'particulars': f"Advance Deposit #{d.get('ipd_no') or ''}: {d.get('remarks') or 'Admission Security Deposit'}",
                            'payment_mode': d.get('payment_mode') or 'Online / UPI',
                            'debit': 0.0,
                            'credit': amt,
                            'balance': 0.0,
                            'status': 'Received',
                        })

            # Sort transactions descending by date/datetime
            transactions.sort(key=lambda t: t['datetime'], reverse=True)

            total_count = len(transactions)
            total_pages = max(1, (total_count + page_size - 1) // page_size)
            start_idx = (page - 1) * page_size
            end_idx = start_idx + page_size
            paginated_items = transactions[start_idx:end_idx]

            # Compute totals for current filtered set
            filtered_total_debit = round(sum(t['debit'] for t in transactions), 2)
            filtered_total_credit = round(sum(t['credit'] for t in transactions), 2)
            filtered_total_balance = round(sum(t['balance'] for t in transactions), 2)

            return Response({
                'success': True,
                'period': period,
                'period_label': period_label,
                'total_count': total_count,
                'page': page,
                'page_size': page_size,
                'total_pages': total_pages,
                'summary': {
                    'total_debit': filtered_total_debit,
                    'total_credit': filtered_total_credit,
                    'total_balance': filtered_total_balance,
                },
                'transactions': paginated_items,
            }, status=status.HTTP_200_OK)

        except Exception as exc:
            logger.exception("Error fetching transactions: %s", exc)
            return Response(
                {'success': False, 'error': f"Failed to retrieve transactions: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AccountsExportView(APIView):
    """
    GET /api/accounts/export/
    Generates and streams downloadable CSV or structured JSON reports.
    Supported report_type:
      - daily_collection
      - bed_occupancy
      - outstanding_balance
      - payment_mode_summary
      - all_transactions
    """

    def perform_content_negotiation(self, request, force=False):
        from rest_framework.renderers import JSONRenderer
        return (JSONRenderer(), 'application/json')

    def get(self, request):
        try:
            report_type = (request.query_params.get('report_type') or 'all_transactions').lower().strip()
            format_type = (request.query_params.get('export_format') or request.query_params.get('format') or 'csv').lower().strip()
            period = request.query_params.get('period', 'this_month')
            start_param = request.query_params.get('start_date')
            end_param = request.query_params.get('end_date')

            start_date, end_date, period_label = resolve_date_range(period, start_param, end_param)

            bills = bill_storage.get_all()
            deposits = deposit_repo.get_all()
            beds = bed_repo.get_all()
            admissions = admission_repo.get_all()

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

            if format_type == 'csv':
                buffer = StringIO()
                writer = csv.writer(buffer)

                if report_type in ('all_transactions', 'daily_collection'):
                    filename = f"Mixu_Transactions_{timestamp}.csv"
                    writer.writerow(['Date', 'Type', 'Reference No', 'UHID', 'Patient Name', 'Particulars', 'Payment Mode', 'Billed (Rs)', 'Received (Rs)', 'Balance (Rs)', 'Status'])

                    # Bills
                    for b in bills:
                        b_date = parse_date_str(b.get('billDate') or b.get('createdAt'))
                        if b_date and start_date <= b_date <= end_date:
                            net = float(b.get('netAmount') or 0.0)
                            rcvd = float(b.get('totalReceived') or 0.0)
                            bal = float(b.get('balanceAmount') or (net - rcvd))
                            writer.writerow([
                                b_date.strftime("%Y-%m-%d"),
                                'Bill',
                                b.get('invoiceNo') or b.get('id'),
                                b.get('uhid') or '',
                                b.get('patientName') or 'Patient',
                                f"Hospital Bill ({len(b.get('items') or [])} items)",
                                b.get('paymentType') or 'Cash',
                                f"{net:.2f}",
                                f"{rcvd:.2f}",
                                f"{bal:.2f}",
                                b.get('status') or 'Pending',
                            ])

                    # Deposits
                    for d in deposits:
                        d_date = parse_date_str(d.get('deposit_date') or d.get('created_at'))
                        if d_date and start_date <= d_date <= end_date:
                            amt = float(d.get('amount') or 0.0)
                            writer.writerow([
                                d_date.strftime("%Y-%m-%d"),
                                'Deposit',
                                d.get('receipt_no') or d.get('id'),
                                d.get('uhid') or '',
                                d.get('patient_name') or 'Patient',
                                f"Advance Deposit {d.get('ipd_no') or ''}: {d.get('remarks') or ''}",
                                d.get('payment_mode') or 'Online / UPI',
                                "0.00",
                                f"{amt:.2f}",
                                "0.00",
                                'Received',
                            ])

                elif report_type == 'bed_occupancy':
                    filename = f"Mixu_Bed_Occupancy_{timestamp}.csv"
                    writer.writerow(['Bed Number', 'Ward Name', 'Room Type ID', 'Daily Rate (Rs)', 'Status', 'Current Admission ID', 'Current Patient ID'])
                    for bd in beds:
                        writer.writerow([
                            bd.get('bed_number'),
                            bd.get('ward_name'),
                            bd.get('room_type_id'),
                            f"{float(bd.get('daily_rate') or 0):.2f}",
                            bd.get('status'),
                            bd.get('current_admission_id') or '-',
                            bd.get('current_patient_id') or '-',
                        ])

                elif report_type == 'outstanding_balance':
                    filename = f"Mixu_Outstanding_Balances_{timestamp}.csv"
                    writer.writerow(['Invoice No', 'Bill Date', 'UHID', 'Patient Name', 'Mobile', 'Net Billed (Rs)', 'Received (Rs)', 'Outstanding Balance (Rs)', 'Payment Type'])
                    for b in bills:
                        b_date = parse_date_str(b.get('billDate') or b.get('createdAt'))
                        if b_date and start_date <= b_date <= end_date:
                            net = float(b.get('netAmount') or 0.0)
                            rcvd = float(b.get('totalReceived') or 0.0)
                            bal = float(b.get('balanceAmount') or (net - rcvd))
                            if bal > 0:
                                writer.writerow([
                                    b.get('invoiceNo') or b.get('id'),
                                    b_date.strftime("%Y-%m-%d"),
                                    b.get('uhid') or '',
                                    b.get('patientName') or 'Patient',
                                    b.get('mobile') or '',
                                    f"{net:.2f}",
                                    f"{rcvd:.2f}",
                                    f"{bal:.2f}",
                                    b.get('paymentType') or 'Cash',
                                ])

                response = HttpResponse(buffer.getvalue(), content_type='text/csv; charset=utf-8')
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                return response

            # JSON Format
            return Response({
                'success': True,
                'report_type': report_type,
                'period_label': period_label,
                'exported_at': datetime.now().isoformat(),
            }, status=status.HTTP_200_OK)

        except Exception as exc:
            logger.exception("Error exporting accounts report: %s", exc)
            return Response(
                {'success': False, 'error': f"Failed to export report: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
