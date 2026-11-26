"""
Printable Bill PDF Generator matching Bill.jpeg reference.
Generates an A4 portrait printable 'BILL CUM RECEIPT' for UNICARE HEART INSTITUTE & RESEARCH CENTER.
Uses real PDF text, vector lines, and sharp typography via FPDF2.
"""

import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional
from fpdf import FPDF
from config.hospital_config import HOSPITAL_CONFIG

ASSETS_DIR = Path(__file__).resolve().parent / "assets"
TULIP_LOGO_PATH = ASSETS_DIR / "unicare_tulip.png"
NABH_SEAL_PATH = ASSETS_DIR / "nabh_seal.png"


def format_bill_date(date_str: Optional[str], include_time: bool = False) -> str:
    """Format date string into DD-Mon-YYYY (e.g. 28-Oct-2026) or with time."""
    if not date_str:
        dt = datetime.now()
    else:
        try:
            if "T" in date_str:
                dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            else:
                dt = datetime.strptime(date_str.strip(), "%Y-%m-%d")
        except Exception:
            dt = datetime.now()

    if include_time:
        return dt.strftime("%d-%b-%Y %I:%M:%S %p")
    return dt.strftime("%d-%b-%Y")


class PatientBillPDF(FPDF):
    """Custom FPDF subclass configured for A4 Portrait bill receipt."""

    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_margins(left=10.0, top=10.0, right=10.0)
        self.set_auto_page_break(False)


def generate_patient_bill_pdf(bill: Dict[str, Any]) -> bytes:
    """
    Generate an A4 portrait PDF matching Bill.jpeg visual reference.
    """
    pdf = PatientBillPDF()
    pdf.add_page()

    # Base coordinates
    box_x = 10.0
    box_y = 10.0
    box_w = 190.0
    box_h = 152.0  # Height of the outer border enclosure

    # Draw outer bounding box
    pdf.set_draw_color(50, 50, 50)
    pdf.set_line_width(0.35)
    pdf.rect(box_x, box_y, box_w, box_h)

    # -------------------------------------------------------------
    # 1. Hospital Header
    # -------------------------------------------------------------
    # Tulip Logo on Left
    if TULIP_LOGO_PATH.exists():
        try:
            pdf.image(str(TULIP_LOGO_PATH), x=box_x + 16.0, y=box_y + 2.5, w=11.0, h=11.5)
        except Exception:
            pass

    # NABH Seal on Right
    if NABH_SEAL_PATH.exists():
        try:
            pdf.image(str(NABH_SEAL_PATH), x=box_x + box_w - 28.0, y=box_y + 2.0, w=12.5, h=13.0)
        except Exception:
            pass

    # Center text for Hospital Name & Details
    curr_y = box_y + 2.5
    pdf.set_xy(box_x, curr_y)
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(25, 25, 25)
    hospital_name = HOSPITAL_CONFIG.get("name") or "XYZ"
    pdf.cell(box_w, 6.0, hospital_name, align="C", new_x="LMARGIN", new_y="NEXT")

    subtitle = HOSPITAL_CONFIG.get("subTitle")
    if subtitle:
        curr_y += 5.5
        pdf.set_xy(box_x, curr_y)
        pdf.set_font("Helvetica", "B", 8.5)
        pdf.set_text_color(40, 40, 40)
        pdf.cell(box_w, 4.0, subtitle, align="C", new_x="LMARGIN", new_y="NEXT")

    managed_by = HOSPITAL_CONFIG.get("managedBy")
    if managed_by:
        curr_y += 3.8
        pdf.set_xy(box_x, curr_y)
        pdf.set_font("Helvetica", "", 7.5)
        pdf.set_text_color(60, 60, 60)
        pdf.cell(box_w, 3.5, managed_by, align="C", new_x="LMARGIN", new_y="NEXT")

    cin_no = HOSPITAL_CONFIG.get("cinNo")
    if cin_no:
        curr_y += 3.5
        pdf.set_xy(box_x, curr_y)
        pdf.set_font("Helvetica", "", 7.0)
        pdf.set_text_color(60, 60, 60)
        pdf.cell(box_w, 3.2, f"CIN No. - {cin_no}", align="C", new_x="LMARGIN", new_y="NEXT")

    address = HOSPITAL_CONFIG.get("address") or "XYZ"
    curr_y += 4.0
    pdf.set_xy(box_x, curr_y)
    pdf.set_font("Helvetica", "", 7.2)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(box_w, 3.2, address, align="C", new_x="LMARGIN", new_y="NEXT")

    phone = HOSPITAL_CONFIG.get("phone") or "XYZ"
    email = HOSPITAL_CONFIG.get("email") or "XYZ"
    curr_y += 3.2
    pdf.set_xy(box_x, curr_y)
    pdf.cell(box_w, 3.2, f"Ph: {phone}  |  E-mail: {email}", align="C", new_x="LMARGIN", new_y="NEXT")

    # Divider line below header
    curr_y += 4.2
    pdf.set_draw_color(60, 60, 60)
    pdf.set_line_width(0.3)
    pdf.line(box_x, curr_y, box_x + box_w, curr_y)

    # -------------------------------------------------------------
    # 2. Bill Title Band: BILL CUM RECEIPT
    # -------------------------------------------------------------
    title_h = 6.2
    pdf.set_fill_color(225, 228, 232)  # Ref shaded gray/slate bar
    pdf.rect(box_x, curr_y, box_w, title_h, style="F")

    pdf.set_xy(box_x, curr_y + 0.8)
    pdf.set_font("Helvetica", "B", 10.5)
    pdf.set_text_color(20, 20, 20)
    pdf.cell(box_w, 4.8, "BILL CUM RECEIPT", align="C", new_x="LMARGIN", new_y="NEXT")

    curr_y += title_h
    pdf.line(box_x, curr_y, box_x + box_w, curr_y)

    # -------------------------------------------------------------
    # 3. Patient & Invoice Details Grid
    # -------------------------------------------------------------
    # Patient Data
    patient_name = str(bill.get("patientName") or "UNKNOWN PATIENT").strip().upper()
    age = str(bill.get("age") or "").strip()
    age_unit = str(bill.get("ageUnit") or "Yrs.").strip()
    if age_unit.lower() in ("years", "year"):
        age_unit = "Yrs."
    age_str = f"{age} {age_unit}".strip() if age else "N/A"
    sex = str(bill.get("sex") or "N/A").strip()
    mobile = str(bill.get("mobile") or "").strip() or "N/A"
    doctor = str(bill.get("treatingDoctor") or "Dr. NILESH MAHALE").strip().upper()
    ref_dr = str(bill.get("referenceDoctor") or "---").strip().upper() or "---"

    uhid = str(bill.get("uhid") or bill.get("patientId") or "").strip()
    invoice_no = str(bill.get("invoiceNo") or "").strip()
    bill_date = format_bill_date(bill.get("billDate") or bill.get("createdAt"))

    col1_label_x = box_x + 3.0
    col1_val_x = box_x + 27.0
    col2_label_x = box_x + 138.0
    col2_val_x = box_x + 160.0

    row_y = curr_y + 2.0
    pdf.set_font("Helvetica", "B", 8.0)
    pdf.set_text_color(30, 30, 30)

    # Row 1: Name & UHID
    pdf.set_xy(col1_label_x, row_y)
    pdf.cell(24.0, 4.2, "Name", align="L")
    pdf.set_xy(col1_val_x - 3.0, row_y)
    pdf.cell(3.0, 4.2, ":")
    pdf.set_xy(col1_val_x, row_y)
    pdf.set_font("Helvetica", "B", 8.2)
    pdf.cell(105.0, 4.2, patient_name[:55], align="L")

    pdf.set_font("Helvetica", "B", 8.0)
    pdf.set_xy(col2_label_x, row_y)
    pdf.cell(20.0, 4.2, "UHID", align="L")
    pdf.set_xy(col2_val_x - 3.0, row_y)
    pdf.cell(3.0, 4.2, ":")
    pdf.set_xy(col2_val_x, row_y)
    pdf.cell(27.0, 4.2, uhid, align="L")

    # Row 2: Age / Sex, Mobile, & Invoice No.
    row_y += 4.5
    pdf.set_xy(col1_label_x, row_y)
    pdf.cell(24.0, 4.2, "Age / Sex", align="L")
    pdf.set_xy(col1_val_x - 3.0, row_y)
    pdf.cell(3.0, 4.2, ":")
    pdf.set_xy(col1_val_x, row_y)
    pdf.set_font("Helvetica", "", 8.0)
    pdf.cell(32.0, 4.2, f"{age_str} / {sex}", align="L")

    pdf.set_font("Helvetica", "B", 8.0)
    pdf.set_xy(col1_val_x + 34.0, row_y)
    pdf.cell(14.0, 4.2, "Mobile :")
    pdf.set_font("Helvetica", "", 8.0)
    pdf.set_xy(col1_val_x + 48.0, row_y)
    pdf.cell(35.0, 4.2, mobile, align="L")

    pdf.set_font("Helvetica", "B", 8.0)
    pdf.set_xy(col2_label_x, row_y)
    pdf.cell(20.0, 4.2, "Invoice No.", align="L")
    pdf.set_xy(col2_val_x - 3.0, row_y)
    pdf.cell(3.0, 4.2, ":")
    pdf.set_xy(col2_val_x, row_y)
    pdf.cell(27.0, 4.2, invoice_no, align="L")

    # Row 3: Treating Dr & Date
    row_y += 4.5
    pdf.set_xy(col1_label_x, row_y)
    pdf.cell(24.0, 4.2, "Treating Dr", align="L")
    pdf.set_xy(col1_val_x - 3.0, row_y)
    pdf.cell(3.0, 4.2, ":")
    pdf.set_xy(col1_val_x, row_y)
    pdf.set_font("Helvetica", "", 7.8)
    pdf.cell(105.0, 4.2, doctor[:55], align="L")

    pdf.set_font("Helvetica", "B", 8.0)
    pdf.set_xy(col2_label_x, row_y)
    pdf.cell(20.0, 4.2, "Date", align="L")
    pdf.set_xy(col2_val_x - 3.0, row_y)
    pdf.cell(3.0, 4.2, ":")
    pdf.set_xy(col2_val_x, row_y)
    pdf.set_font("Helvetica", "", 8.0)
    pdf.cell(27.0, 4.2, bill_date, align="L")

    # Row 4: Reference Dr
    row_y += 4.5
    pdf.set_font("Helvetica", "B", 8.0)
    pdf.set_xy(col1_label_x, row_y)
    pdf.cell(24.0, 4.2, "Reference Dr", align="L")
    pdf.set_xy(col1_val_x - 3.0, row_y)
    pdf.cell(3.0, 4.2, ":")
    pdf.set_xy(col1_val_x, row_y)
    pdf.set_font("Helvetica", "", 7.8)
    pdf.cell(105.0, 4.2, ref_dr[:55], align="L")

    curr_y = row_y + 5.5
    pdf.line(box_x, curr_y, box_x + box_w, curr_y)

    # -------------------------------------------------------------
    # 4. Bill Items Table
    # -------------------------------------------------------------
    table_y = curr_y
    pdf.set_xy(box_x, table_y)

    # Column widths: Sr. No. (18mm), Details (132mm), Rate (40mm)
    w_sr = 18.0
    w_det = 132.0
    w_rate = 40.0

    pdf.set_font("Helvetica", "B", 8.2)
    pdf.cell(w_sr, 5.5, "Sr. No.", align="C")
    pdf.cell(w_det, 5.5, " Details", align="L")
    pdf.cell(w_rate, 5.5, "Rate   ", align="R")

    table_y += 5.5
    pdf.line(box_x, table_y, box_x + box_w, table_y)

    # Render items
    items = bill.get("items") or [
        {
            "srNo": 1,
            "details": "OPD Consultation / Registration Charge",
            "rate": 500.0,
            "amount": 500.0,
        }
    ]

    pdf.set_font("Helvetica", "", 8.0)
    for it in items:
        sr_no = str(it.get("srNo") or "1")
        details = str(it.get("details") or "")
        try:
            rate_val = float(it.get("rate") or it.get("amount") or 0.0)
            rate_str = f"{rate_val:.0f}" if rate_val.is_integer() else f"{rate_val:.2f}"
        except Exception:
            rate_str = "0"

        pdf.set_xy(box_x, table_y)
        pdf.cell(w_sr, 5.2, sr_no, align="C")
        pdf.cell(w_det, 5.2, f" {details}", align="L")
        pdf.cell(w_rate, 5.2, f"{rate_str}   ", align="R")
        table_y += 5.2

    # Bottom divider line for items
    table_y = max(table_y, curr_y + 16.0)
    pdf.line(box_x, table_y, box_x + box_w, table_y)

    # -------------------------------------------------------------
    # 5. Payment & Totals Section
    # -------------------------------------------------------------
    totals_start_y = table_y + 1.5

    # Left Payment Receipt Sub-box
    rec_box_x = box_x + 3.0
    rec_box_y = totals_start_y
    rec_box_w = 126.0
    rec_box_h = 24.5

    pdf.rect(rec_box_x, rec_box_y, rec_box_w, rec_box_h)

    # Receipt Mini-table Header
    pdf.set_font("Helvetica", "B", 7.2)
    pdf.set_xy(rec_box_x, rec_box_y + 1.0)
    pdf.cell(18.0, 3.5, " Rec.Date", align="L")
    pdf.cell(24.0, 3.5, "Receipt No", align="L")
    pdf.cell(14.0, 3.5, "Amt.", align="R")
    pdf.cell(22.0, 3.5, "Payment Type", align="C")
    pdf.cell(48.0, 3.5, "User", align="L")

    # Values
    rec_date_short = format_bill_date(bill.get("billDate") or bill.get("createdAt"))
    receipt_no = str(bill.get("receiptNo") or invoice_no or "")
    payment_type = str(bill.get("paymentType") or "Cash").strip()
    received_val = float(bill.get("amountReceived") or 0.0)
    received_str = f"{received_val:.0f}" if received_val.is_integer() else f"{received_val:.2f}"

    entry_by = str(bill.get("entryBy") or "Jenil Bundela").strip()
    pc_name = str(bill.get("pcName") or "RECEPTION1").strip()
    entry_time = format_bill_date(bill.get("billDate") or bill.get("createdAt"), include_time=True)

    row_rec_y = rec_box_y + 5.0
    pdf.set_font("Helvetica", "", 7.0)
    pdf.set_xy(rec_box_x, row_rec_y)
    pdf.cell(18.0, 3.5, f" {rec_date_short}", align="L")
    pdf.cell(24.0, 3.5, receipt_no, align="L")
    pdf.cell(14.0, 3.5, received_str, align="R")
    pdf.cell(22.0, 3.5, payment_type, align="C")

    # Multi-line user info
    pdf.set_xy(rec_box_x + 78.0, row_rec_y)
    pdf.cell(46.0, 3.2, f"EntryBy:{entry_by},", align="L")
    pdf.set_xy(rec_box_x + 78.0, row_rec_y + 3.2)
    pdf.cell(46.0, 3.2, f"PCName:{pc_name},", align="L")
    pdf.set_xy(rec_box_x + 78.0, row_rec_y + 6.4)
    pdf.cell(46.0, 3.2, f"At:{entry_time}.", align="L")

    # Underline & total sum in receipt box
    pdf.line(rec_box_x + 36.0, row_rec_y + 9.5, rec_box_x + 58.0, row_rec_y + 9.5)
    pdf.set_font("Helvetica", "B", 7.5)
    pdf.set_xy(rec_box_x + 36.0, row_rec_y + 10.5)
    pdf.cell(20.0, 3.5, received_str, align="R")

    # Right Totals
    total_val = float(bill.get("totalAmount") or bill.get("netPayable") or 0.0)
    subtotal_val = float(bill.get("subtotal") or total_val)
    discount_val = float(bill.get("discountAmount") or 0.0)
    discount_type = str(bill.get("discountType") or "percentage").lower()
    discount_value = float(bill.get("discountValue") or 0.0)
    discount_doctor = str(bill.get("discountDoctor") or "").strip()
    discount_remark = str(bill.get("discountRemark") or "").strip()
    due_val = float(bill.get("dueAmount") or 0.0)

    total_str = f"{total_val:.0f}" if total_val.is_integer() else f"{total_val:.2f}"
    subtotal_str = f"{subtotal_val:.0f}" if subtotal_val.is_integer() else f"{subtotal_val:.2f}"
    discount_str = f"{discount_val:.0f}" if discount_val.is_integer() else f"{discount_val:.2f}"
    due_str = f"{due_val:.0f}" if due_val.is_integer() else f"{due_val:.2f}"

    tot_label_x = box_x + 132.0
    tot_val_x = box_x + 165.0
    tot_y = totals_start_y + 1.0

    pdf.set_font("Helvetica", "B", 7.8)

    if discount_val > 0:
        # Subtotal
        pdf.set_xy(tot_label_x, tot_y)
        pdf.cell(28.0, 3.8, "Subtotal", align="L")
        pdf.set_xy(tot_val_x - 3.0, tot_y)
        pdf.cell(3.0, 3.8, ":")
        pdf.set_xy(tot_val_x, tot_y)
        pdf.cell(22.0, 3.8, subtotal_str, align="R")

        # Discount
        tot_y += 4.0
        disc_val_str = f"{discount_value:.0f}" if discount_value.is_integer() else f"{discount_value:.1f}"
        disc_label = f"Disc. ({disc_val_str}%)" if discount_type == "percentage" else f"Discount"
        pdf.set_xy(tot_label_x, tot_y)
        pdf.cell(28.0, 3.8, disc_label, align="L")
        pdf.set_xy(tot_val_x - 3.0, tot_y)
        pdf.cell(3.0, 3.8, ":")
        pdf.set_xy(tot_val_x, tot_y)
        pdf.cell(22.0, 3.8, f"-{discount_str}", align="R")

        # Net Payable
        tot_y += 4.0
        pdf.set_xy(tot_label_x, tot_y)
        pdf.cell(28.0, 3.8, "Net Payable", align="L")
        pdf.set_xy(tot_val_x - 3.0, tot_y)
        pdf.cell(3.0, 3.8, ":")
        pdf.set_xy(tot_val_x, tot_y)
        pdf.cell(22.0, 3.8, total_str, align="R")
    else:
        # Total
        pdf.set_xy(tot_label_x, tot_y)
        pdf.cell(28.0, 4.2, "Total", align="L")
        pdf.set_xy(tot_val_x - 3.0, tot_y)
        pdf.cell(3.0, 4.2, ":")
        pdf.set_xy(tot_val_x, tot_y)
        pdf.cell(22.0, 4.2, total_str, align="R")

    # Received
    tot_y += 4.2
    pdf.set_xy(tot_label_x, tot_y)
    pdf.cell(28.0, 4.0, "Received", align="L")
    pdf.set_xy(tot_val_x - 3.0, tot_y)
    pdf.cell(3.0, 4.0, ":")
    pdf.set_xy(tot_val_x, tot_y)
    pdf.cell(22.0, 4.0, received_str, align="R")

    # Due
    tot_y += 4.8
    pdf.set_font("Helvetica", "B", 8.8)
    pdf.set_xy(tot_label_x, tot_y)
    pdf.cell(28.0, 4.2, "Due", align="L")
    pdf.set_xy(tot_val_x - 3.0, tot_y)
    pdf.cell(3.0, 4.2, ":")
    pdf.set_xy(tot_val_x, tot_y)
    pdf.cell(22.0, 4.2, due_str, align="R")

    # -------------------------------------------------------------
    # 6. Footer Section & Discount Authorization Note
    # -------------------------------------------------------------
    footer_y = rec_box_y + rec_box_h + 2.0
    if discount_val > 0 and (discount_doctor or discount_remark):
        doc_part = f"Discount Given By: {discount_doctor}" if discount_doctor else ""
        rem_part = f"Remark: {discount_remark}" if discount_remark else ""
        combined_note = " | ".join(filter(None, [doc_part, rem_part]))
        pdf.set_font("Helvetica", "I", 6.8)
        pdf.set_text_color(70, 70, 70)
        pdf.set_xy(box_x + 3.0, footer_y)
        pdf.cell(125.0, 3.0, combined_note[:90], align="L")
        footer_y += 3.2

    pdf.set_font("Helvetica", "", 7.0)
    pdf.set_text_color(50, 50, 50)

    pdf.set_xy(box_x + 3.0, footer_y)
    pdf.cell(120.0, 3.2, "Subject to SURAT Jurisdiction", align="L")

    pdf.set_xy(box_x + 3.0, footer_y + 3.5)
    pdf.cell(120.0, 3.2, "Payment by cheque Subject To Realization", align="L")

    pdf.set_xy(box_x + 3.0, footer_y + 7.0)
    pdf.cell(180.0, 3.2, f"EntryBy:{entry_by}, PCName:{pc_name}, At:{entry_time}.", align="L")

    # Authorized Signatory
    pdf.set_xy(box_x + box_w - 45.0, footer_y + 6.0)
    pdf.set_font("Helvetica", "B", 7.5)
    pdf.cell(40.0, 3.5, "Authorized Signatory", align="C")

    # Output PDF bytes
    return bytes(pdf.output())
