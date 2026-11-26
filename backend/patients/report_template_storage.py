"""
Thread-safe, atomic JSON storage for Report Template Master.
Manages report_templates.json in backend/data.
"""

import os
import json
import threading
import tempfile
from pathlib import Path
from typing import List, Dict, Any, Optional
from .file_lock import InterProcessFileLock

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
REPORT_TEMPLATES_FILE = DATA_DIR / "report_templates.json"


class ReportTemplateStorageError(Exception):
    """Custom exception raised for Report Template JSON storage errors."""
    pass


class ReportTemplateJSONStorage:
    """
    Thread-safe, atomic, and inter-process-safe JSON storage for diagnostic/investigation report templates.
    Authoritative template definitions for clinical reporting workflows.
    """

    def __init__(self, file_path: Path = REPORT_TEMPLATES_FILE):
        self.file_path = file_path
        self.data_dir = self.file_path.parent
        self._lock = InterProcessFileLock(self.file_path)
        self._ensure_storage()

    def _ensure_storage(self) -> None:
        """Create parent directory and initialize default templates if missing."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            if not self.file_path.exists():
                default_data = {
                    "templates": [
                        {
                            "id": "TPL-001",
                            "groupName": "Sonography",
                            "templateName": "COLOR DOPPLER BOTH UPPER LIMB",
                            "reportHeader": "BILATERAL UPPER LIMB DOPPLER",
                            "department": "Radiology & Imaging",
                            "details": (
                                "Both subclavian, brachial and axillary artery appear normal in course and caliber on both sides. "
                                "No e/o thrombosis / Atherosclerosis / Stenosis / Aneurysm. On CDI and spectral waveform, they show normal flow and velocity.\n"
                                "Both subclavian & axillary veins show normal flow pattern.\n\n"
                                "Both ulnar and radial vessels appear normal in course and caliber on both sides. "
                                "No e/o thrombosis / Atherosclerosis / Stenosis / Aneurysm. On CDI and spectral waveform, they show normal flow and velocity.\n"
                                "Veins show normal compressibility.\n\n"
                                "Superficial veins of both upper limbs show normal course and flow pattern.\n\n"
                                "COMMENTS: Normal Bilateral Upper Limb Doppler."
                            ),
                            "status": "active"
                        },
                        {
                            "id": "TPL-002",
                            "groupName": "Sonography",
                            "templateName": "ULTRASOUND WHOLE ABDOMEN & PELVIS",
                            "reportHeader": "USG WHOLE ABDOMEN & PELVIS EXAMINATION",
                            "department": "Radiology & Imaging",
                            "details": (
                                "LIVER: Normal in size and shape. Normal parenchymal echotexture. No focal lesion seen. Intrahepatic biliary radicals are not dilated.\n"
                                "GALL BLADDER: Well distended. Wall thickness is normal. No calculus or mass lesion seen.\n"
                                "COMMON BILE DUCT & PORTAL VEIN: Normal in caliber.\n"
                                "PANCREAS: Visualized head, body, and tail appear normal in size and echotexture. No focal lesion or calcification.\n"
                                "SPLEEN: Normal in size with homogeneous echotexture. No focal lesion seen.\n"
                                "KIDNEYS: Both kidneys are normal in size, shape, position, and cortical echotexture. Cortico-medullary differentiation is well maintained. No calculus or hydronephrosis seen.\n"
                                "URINARY BLADDER: Well distended, wall thickness is normal. No calculus or mass lesion seen.\n"
                                "PROSTATE / UTERUS & ADNEXA: Normal for age.\n\n"
                                "IMPRESSION: No significant sonological abnormality detected in whole abdomen and pelvis."
                            ),
                            "status": "active"
                        },
                        {
                            "id": "TPL-003",
                            "groupName": "Radiology",
                            "templateName": "CHEST X-RAY PA VIEW",
                            "reportHeader": "DIGITAL CHEST RADIOGRAPH (PA VIEW)",
                            "department": "Radiology",
                            "details": (
                                "Both lung fields appear clear with normal vascular markings.\n"
                                "No focal parenchymal consolidation, cavitation, or mass lesion seen.\n"
                                "Hilar shadows are within normal limits.\n"
                                "Cardiac size and configuration are within normal limits (Cardiothoracic ratio normal).\n"
                                "Both costophrenic and cardiophrenic angles are clear.\n"
                                "Bony thorax and surrounding soft tissue structures appear intact.\n\n"
                                "IMPRESSION: Normal Chest Radiograph (PA View)."
                            ),
                            "status": "active"
                        },
                        {
                            "id": "TPL-004",
                            "groupName": "Cardiology",
                            "templateName": "2D TRANSTHORACIC ECHOCARDIOGRAPHY",
                            "reportHeader": "2D ECHOCARDIOGRAPHY WITH COLOR DOPPLER REPORT",
                            "department": "Cardiology",
                            "details": (
                                "AORTIC ROOT & VALVE: Trileaflet aortic valve with normal opening and closure. No AS / AR.\n"
                                "MITRAL VALVE: Normal leaflets and subvalvular apparatus. No MS / MR.\n"
                                "TRICUSPID VALVE: Structurally normal. Trivial TR. Estimated PASP within normal limits.\n"
                                "PULMONIC VALVE: Normal.\n"
                                "CHAMBERS: Normal LV, RV, LA, and RA cavity dimensions. No thrombus or vegetations.\n"
                                "LV FUNCTION: Normal LV systolic function. LVEF = 60-65%. No regional wall motion abnormality (RWMA) at rest.\n"
                                "PERICARDIUM: Normal, no pericardial effusion.\n\n"
                                "CONCLUSION: Normal resting 2D Transthoracic Echocardiogram. Good LV systolic function."
                            ),
                            "status": "active"
                        },
                        {
                            "id": "TPL-005",
                            "groupName": "Pathology",
                            "templateName": "COMPLETE BLOOD COUNT (CBC)",
                            "reportHeader": "HEMATOLOGY - COMPLETE BLOOD PICTURE REPORT",
                            "department": "Pathology",
                            "details": (
                                "HAEMOGLOBIN: 14.2 g/dL (Reference: Male 13.0 - 17.0, Female 12.0 - 15.0)\n"
                                "TOTAL RBC COUNT: 4.8 mill/cu.mm (Reference: 4.5 - 5.5)\n"
                                "TOTAL LEUCOCYTE COUNT (WBC): 7,400 /cu.mm (Reference: 4,000 - 11,000)\n\n"
                                "DIFFERENTIAL LEUCOCYTE COUNT:\n"
                                "- Polymorphs (Neutrophils): 64 % (Reference: 40 - 70)\n"
                                "- Lymphocytes: 28 % (Reference: 20 - 40)\n"
                                "- Eosinophils: 04 % (Reference: 01 - 06)\n"
                                "- Monocytes: 04 % (Reference: 02 - 08)\n"
                                "- Basophils: 00 % (Reference: 00 - 01)\n\n"
                                "PLATELET COUNT: 2.40 Lakhs/cu.mm (Reference: 1.50 - 4.50 Lakhs)\n"
                                "PERIPHERAL SMEAR: Normocytic normochromic RBCs. Normal WBC distribution and adequate platelets."
                            ),
                            "status": "active"
                        }
                    ]
                }
                self._write_atomically(default_data)

    def _read_data(self) -> Dict[str, Any]:
        """Read data safely from the JSON file."""
        with self._lock:
            if not self.file_path.exists():
                self._ensure_storage()

            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    content = f.read().strip()
                    if not content:
                        return {"templates": []}
                    data = json.loads(content)
                    if not isinstance(data, dict) or "templates" not in data or not isinstance(data["templates"], list):
                        raise ReportTemplateStorageError("Invalid report templates schema: missing 'templates' list key.")
                    return data
            except json.JSONDecodeError as exc:
                raise ReportTemplateStorageError(f"Corrupted report_templates.json file: {str(exc)}") from exc
            except IOError as exc:
                raise ReportTemplateStorageError(f"I/O error reading report templates: {str(exc)}") from exc

    def _write_atomically(self, data: Dict[str, Any]) -> None:
        """Atomically write JSON data using temp file rename."""
        with self._lock:
            self.data_dir.mkdir(parents=True, exist_ok=True)
            temp_file = None
            try:
                with tempfile.NamedTemporaryFile("w", dir=str(self.data_dir), delete=False, encoding="utf-8") as tf:
                    json.dump(data, tf, indent=2, ensure_ascii=False)
                    temp_file = tf.name

                os.replace(temp_file, str(self.file_path))
            except Exception as exc:
                if temp_file and os.path.exists(temp_file):
                    try:
                        os.remove(temp_file)
                    except OSError:
                        pass
                raise ReportTemplateStorageError(f"Failed atomic write to report templates: {str(exc)}") from exc

    def generate_next_id(self) -> str:
        """Generate the next sequential Template ID (e.g. TPL-006)."""
        data = self._read_data()
        templates = data.get("templates", [])
        max_num = 0
        for tpl in templates:
            t_id = str(tpl.get("id", "")).strip()
            if t_id.startswith("TPL-"):
                try:
                    num = int(t_id.replace("TPL-", ""))
                    if num > max_num:
                        max_num = num
                except ValueError:
                    continue
            elif t_id.isdigit():
                try:
                    num = int(t_id)
                    if num > max_num:
                        max_num = num
                except ValueError:
                    continue
        return f"TPL-{max_num + 1:03d}"

    def get_all(self, active_only: bool = False, query: Optional[str] = None, group: Optional[str] = None, department: Optional[str] = None) -> List[Dict[str, Any]]:
        """Return all template records with optional filters."""
        data = self._read_data()
        templates = data.get("templates", [])

        if active_only:
            templates = [t for t in templates if t.get("status", "active") == "active"]

        if group and group != "All":
            templates = [t for t in templates if t.get("groupName", "").lower() == group.lower()]

        if department and department != "All":
            templates = [t for t in templates if t.get("department", "").lower() == department.lower()]

        if query:
            q = query.strip().lower()
            filtered = []
            for t in templates:
                t_name = str(t.get("templateName", "")).lower()
                t_id = str(t.get("id", "")).lower()
                header = str(t.get("reportHeader", "")).lower()
                grp = str(t.get("groupName", "")).lower()
                dept = str(t.get("department", "")).lower()
                if (q in t_name or q in t_id or q in header or q in grp or q in dept):
                    filtered.append(t)
            templates = filtered

        return templates

    def get_by_id(self, template_id: str) -> Optional[Dict[str, Any]]:
        """Find a template record by ID."""
        clean_id = str(template_id).strip().lower()
        templates = self._read_data().get("templates", [])
        for tpl in templates:
            if str(tpl.get("id", "")).strip().lower() == clean_id:
                return tpl
        return None

    def create(self, template_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new report template with a unique ID."""
        with self._lock:
            data = self._read_data()
            templates = data.get("templates", [])

            if not template_data.get("id"):
                template_data["id"] = self.generate_next_id()
            else:
                existing = self.get_by_id(template_data["id"])
                if existing:
                    raise ReportTemplateStorageError(f"Template with ID '{template_data['id']}' already exists.")

            if "status" not in template_data:
                template_data["status"] = "active"

            templates.append(template_data)
            data["templates"] = templates
            self._write_atomically(data)
            return template_data

    def update(self, template_id: str, updated_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing template record."""
        with self._lock:
            clean_id = str(template_id).strip().lower()
            data = self._read_data()
            templates = data.get("templates", [])

            index = -1
            for i, tpl in enumerate(templates):
                if str(tpl.get("id", "")).strip().lower() == clean_id:
                    index = i
                    break

            if index == -1:
                raise ReportTemplateStorageError(f"Template with ID '{template_id}' not found.")

            merged = {**templates[index], **updated_data, "id": templates[index]["id"]}
            templates[index] = merged
            data["templates"] = templates
            self._write_atomically(data)
            return merged

    def delete_or_deactivate(self, template_id: str, force_delete: bool = False) -> Dict[str, Any]:
        """
        Delete or deactivate template.
        If force_delete is False, marks status as 'inactive' to preserve previously generated reports.
        """
        with self._lock:
            clean_id = str(template_id).strip().lower()
            data = self._read_data()
            templates = data.get("templates", [])

            index = -1
            for i, tpl in enumerate(templates):
                if str(tpl.get("id", "")).strip().lower() == clean_id:
                    index = i
                    break

            if index == -1:
                raise ReportTemplateStorageError(f"Template with ID '{template_id}' not found.")

            target = templates[index]

            if force_delete:
                deleted = templates.pop(index)
                data["templates"] = templates
                self._write_atomically(data)
                return {"success": True, "action": "deleted", "template": deleted}
            else:
                target["status"] = "inactive"
                templates[index] = target
                data["templates"] = templates
                self._write_atomically(data)
                return {"success": True, "action": "deactivated", "template": target}


report_template_storage = ReportTemplateJSONStorage()

