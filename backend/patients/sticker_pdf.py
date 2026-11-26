"""
A4 Patient Sticker PDF Generator
Renders an individual patient identification sticker on a standard A4 portrait page (210mm x 297mm).
The sticker retains its authentic physical dimensions (100mm x 50mm) and proportions from Sticker.jpeg reference,
without being stretched across the full A4 sheet.

Features:
- Configurable settings for A4 page, sticker dimensions, margins, and layout modes (single-sticker primary / sheet mode)
- Pure vector text rendering with bold Helvetica typography matching Sticker.jpeg
- High-resolution Code 128 barcode encoding the patient's UHID
- Centralized hospital identification configuration (XYZ placeholder defaults)
- Subtle cutting/peel guide boundary around the physical sticker dimensions
- 100% print accuracy recommendations (Scale: 100% / Actual Size, Fit to Page disabled)
"""

import io
from datetime import datetime
from typing import Dict, Any, Optional
from fpdf import FPDF
from fpdf.enums import XPos, YPos
import barcode
from barcode.writer import ImageWriter
from PIL import Image
from config.hospital_config import HOSPITAL_CONFIG

# ==============================================================================
# Configurable A4 Page & Sticker Measurements (in millimetres)
# ==============================================================================
STICKER_A4_CONFIG: Dict[str, Any] = {
    # Page specifications (Standard ISO A4)
    "page_size": "A4",
    "page_orientation": "P",  # Portrait
    "page_width_mm": 210.0,
    "page_height_mm": 297.0,

    # Physical sticker label dimensions (Estimated from Sticker.jpeg reference)
    "sticker_width_mm": 100.0,
    "sticker_height_mm": 50.0,

    # Top-left placement margins on A4 sheet
    "left_margin_mm": 15.0,
    "top_margin_mm": 18.0,

    # Grid / Sheet mode settings
    "columns": 1,  # Single-sticker mode (primary)
    "rows": 1,
    "horizontal_gap_mm": 5.0,
    "vertical_gap_mm": 5.0,

    # Visual guide settings
    "draw_cutting_guide": True,  # Subtle border showing 100x50mm sticker boundary
    "guide_color_rgb": (180, 192, 208),
    "guide_line_width_mm": 0.15,

    # Sheet header settings
    "show_sheet_header": True,
}

# Backward compatibility aliases
STICKER_WIDTH_MM = STICKER_A4_CONFIG["sticker_width_mm"]
STICKER_HEIGHT_MM = STICKER_A4_CONFIG["sticker_height_mm"]
PAGE_WIDTH_MM = STICKER_A4_CONFIG["page_width_mm"]
PAGE_HEIGHT_MM = STICKER_A4_CONFIG["page_height_mm"]


def format_patient_date(date_str: Optional[str]) -> str:
    """Format ISO or YYYY-MM-DD date into DD-Mon-YYYY format (e.g. 28-Oct-2026)."""
    if not date_str:
        return datetime.now().strftime("%d-%b-%Y")
    try:
        if "T" in date_str:
            dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            return dt.strftime("%d-%b-%Y")
        dt = datetime.strptime(date_str.strip(), "%Y-%m-%d")
        return dt.strftime("%d-%b-%Y")
    except Exception:
        return datetime.now().strftime("%d-%b-%Y")


def generate_barcode_image_bytes(code: str) -> bytes:
    """
    Generate high-resolution Code 128 barcode image as PNG bytes without human-readable text.
    Human-readable UHID is rendered separately in crisp vector typography.
    """
    code128_cls = barcode.get_barcode_class("code128")
    writer = ImageWriter()
    bc = code128_cls(code, writer=writer)
    buf = io.BytesIO()
    bc.write(
        buf,
        options={
            "write_text": False,
            "module_width": 0.28,
            "module_height": 11.0,
            "quiet_zone": 1.5,
            "dpi": 300,
        },
    )
    buf.seek(0)
    return buf.getvalue()


class PatientStickerA4PDF(FPDF):
    """
    Custom FPDF subclass configured for standard A4 Portrait paper (210mm x 297mm).
    """
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_margins(left=10.0, top=10.0, right=10.0)
        self.set_auto_page_break(False)


def render_single_sticker(
    pdf: FPDF,
    x0: float,
    y0: float,
    patient: Dict[str, Any],
    config: Dict[str, Any]
) -> None:
    """
    Render one 100mm x 50mm patient sticker at top-left coordinate (x0, y0).
    Recreates the exact visual layout and proportions of Sticker.jpeg.
    """
    sw = config["sticker_width_mm"]
    sh = config["sticker_height_mm"]

    # 1. Subtle cutting / peel guide boundary (0.15mm line)
    if config.get("draw_cutting_guide", True):
        r, g, b = config.get("guide_color_rgb", (180, 192, 208))
        pdf.set_draw_color(r, g, b)
        pdf.set_line_width(config.get("guide_line_width_mm", 0.15))
        pdf.rect(x0, y0, sw, sh)

    # Extract patient attributes
    first_name = (patient.get("firstName") or "").strip().upper()
    middle_name = (patient.get("middleName") or "").strip().upper()
    last_name = (patient.get("lastName") or "").strip().upper()
    full_name_parts = [p for p in [first_name, middle_name, last_name] if p]
    full_name = " ".join(full_name_parts) or "UNKNOWN PATIENT"

    age = str(patient.get("age") or "").strip()
    age_unit = (patient.get("ageUnit") or "Yrs.").strip()
    if age_unit.lower() in ("years", "year"):
        age_unit = "Yrs."
    age_display = f"{age} {age_unit}".strip() if age else "N/A"

    sex = (patient.get("sex") or "N/A").strip()

    # Address composition
    street = (patient.get("streetAddress") or "").strip().upper()
    city = (patient.get("city") or "").strip().upper()
    state = (patient.get("state") or "").strip().upper()
    pincode = (patient.get("pinCode") or "").strip()

    addr_parts = [p for p in [street, city, state, pincode] if p]
    address_display = "  ".join(addr_parts) if addr_parts else "N/A"

    # Doctor and Referring Doctor
    doctor = (patient.get("hospitalDoctor") or "N/A").strip().upper()
    ref_dr = (patient.get("referenceBy") or "").strip().upper() or "-"

    mobile = (patient.get("mobile") or "").strip() or "N/A"
    reg_date = format_patient_date(patient.get("createdAt") or patient.get("birthDate"))
    uhid = (patient.get("uhid") or patient.get("id") or "UNKNOWN").strip()

    # Inner layout offsets relative to sticker origin (x0, y0)
    col1_label_w = 17.0
    col1_x = x0 + 4.0
    col1_val_x = col1_x + col1_label_w + 1.0
    col2_x = x0 + 48.0
    right_boundary_w = sw - (col1_val_x - x0) - 4.0

    # Color & Styling: Pure black text, crisp sans-serif font
    pdf.set_text_color(0, 0, 0)

    # Line 1: Name (y = y0 + 4.8mm)
    y_curr = y0 + 4.8
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_xy(col1_x, y_curr)
    pdf.cell(col1_label_w, 4.0, "Name      :", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_xy(col1_val_x, y_curr)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.cell(right_boundary_w, 4.0, full_name[:42], new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Line 2: Age & Sex (y = y0 + 9.4mm)
    y_curr += 4.6
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_xy(col1_x, y_curr)
    pdf.cell(col1_label_w, 4.0, "Age       :", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_xy(col1_val_x, y_curr)
    pdf.cell(col2_x - col1_val_x - 1.0, 4.0, age_display, new_x=XPos.RIGHT, new_y=YPos.TOP)

    pdf.set_xy(col2_x, y_curr)
    pdf.cell(35.0, 4.0, f"Sex :{sex}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Line 3: Address (y = y0 + 14.0mm)
    y_curr += 4.6
    pdf.set_xy(col1_x, y_curr)
    pdf.cell(col1_label_w, 4.0, "Address   :", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_xy(col1_val_x, y_curr)
    pdf.set_font("Helvetica", "B", 7.5)
    pdf.cell(right_boundary_w, 4.0, address_display[:50], new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Line 4: Doctor Name (y = y0 + 19.6mm)
    y_curr += 5.6
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_xy(col1_x, y_curr)
    pdf.cell(col1_label_w, 4.0, "Dr.Name   :", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_xy(col1_val_x, y_curr)
    if len(doctor) > 36:
        parts = doctor.split(" / ")
        if len(parts) >= 2:
            doc_line1 = parts[0] + " /"
            doc_line2 = " / ".join(parts[1:])
        else:
            doc_line1 = doctor[:36]
            doc_line2 = doctor[36:]
        pdf.cell(right_boundary_w, 3.6, doc_line1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_xy(col1_val_x, y_curr + 3.6)
        pdf.cell(right_boundary_w, 3.6, doc_line2, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        y_curr += 3.6
    else:
        pdf.cell(right_boundary_w, 4.0, doctor, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Line 5: MOB & Date (y = y0 + 25.2mm)
    y_curr += 4.6
    pdf.set_xy(col1_x, y_curr)
    pdf.cell(col1_label_w, 4.0, "MOB       :", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_xy(col1_val_x, y_curr)
    pdf.cell(col2_x - col1_val_x - 1.0, 4.0, mobile, new_x=XPos.RIGHT, new_y=YPos.TOP)

    pdf.set_xy(col2_x, y_curr)
    pdf.cell(35.0, 4.0, f"Date :{reg_date}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Line 6: Ref.Dr. (y = y0 + 29.8mm)
    y_curr += 4.6
    pdf.set_xy(col1_x, y_curr)
    pdf.cell(col1_label_w, 4.0, "Ref.Dr.   :", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_xy(col1_val_x, y_curr)
    pdf.cell(35.0, 4.0, ref_dr[:28], new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Line 7: UHID + Barcode (y = y0 + 35.0mm)
    y_curr += 5.2
    pdf.set_xy(col1_x, y_curr)
    pdf.cell(col1_label_w, 4.0, "UHID      :", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_xy(col1_val_x, y_curr)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(26.0, 4.0, uhid, new_x=XPos.RIGHT, new_y=YPos.TOP)

    # Embed Code 128 barcode at x = x0 + 51.0mm, y = y0 + 33.5mm, w = 44.0mm, h = 11.5mm
    try:
        barcode_bytes = generate_barcode_image_bytes(uhid)
        barcode_img_io = io.BytesIO(barcode_bytes)
        barcode_x = x0 + 51.0
        barcode_y = y0 + 33.5
        barcode_w = 44.0
        barcode_h = 11.5
        pdf.image(barcode_img_io, x=barcode_x, y=barcode_y, w=barcode_w, h=barcode_h)
    except Exception:
        # Fallback text if barcode generation encounters any issue
        pdf.set_xy(x0 + 52.0, y_curr)
        pdf.set_font("Helvetica", "B", 7)
        pdf.cell(40.0, 4.0, f"[{uhid}]", new_x=XPos.RIGHT, new_y=YPos.TOP)


def generate_patient_sticker_pdf(
    patient: Dict[str, Any],
    custom_config: Optional[Dict[str, Any]] = None
) -> bytes:
    """
    Generate an A4 Portrait (210mm x 297mm) PDF containing the 100mm x 50mm patient identification sticker.
    The sticker is rendered at physical scale and is not stretched across the page.
    """
    config = STICKER_A4_CONFIG.copy()
    if custom_config:
        config.update(custom_config)

    pdf = PatientStickerA4PDF()
    pdf.add_page()

    # 1. Subtle sheet header outside sticker boundary
    if config.get("show_sheet_header", True):
        h_name = HOSPITAL_CONFIG.get("name") or "XYZ"
        h_addr = HOSPITAL_CONFIG.get("address") or "XYZ"
        h_phone = HOSPITAL_CONFIG.get("phone") or "XYZ"

        pdf.set_text_color(110, 120, 135)
        pdf.set_font("Helvetica", "B", 7.5)
        pdf.set_xy(config["left_margin_mm"], 8.0)
        header_text = f"{h_name}  |  Patient Identification Label  |  Address: {h_addr}  |  Ph: {h_phone}"
        pdf.cell(120.0, 4.0, header_text, new_x=XPos.RIGHT, new_y=YPos.TOP)

        # Print layout instruction on top right
        pdf.set_font("Helvetica", "", 6.5)
        pdf.set_xy(config["page_width_mm"] - 75.0, 8.0)
        pdf.cell(60.0, 4.0, "A4 Sheet | Print at 100% / Actual Size", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # 2. Render sticker(s)
    cols = max(1, int(config.get("columns", 1)))
    rows = max(1, int(config.get("rows", 1)))
    start_x = config["left_margin_mm"]
    start_y = config["top_margin_mm"]
    sw = config["sticker_width_mm"]
    sh = config["sticker_height_mm"]
    h_gap = config.get("horizontal_gap_mm", 5.0)
    v_gap = config.get("vertical_gap_mm", 5.0)

    # In single-sticker mode (cols=1, rows=1), render exactly one sticker for the patient
    for r in range(rows):
        for c in range(cols):
            x_pos = start_x + c * (sw + h_gap)
            y_pos = start_y + r * (sh + v_gap)
            # Ensure it fits within A4 page dimensions
            if x_pos + sw <= config["page_width_mm"] and y_pos + sh <= config["page_height_mm"]:
                render_single_sticker(pdf, x_pos, y_pos, patient, config)

    # Return raw PDF bytes
    return bytes(pdf.output())
