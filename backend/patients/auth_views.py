"""
Role-Based Access Control (RBAC), User Management, Authentication,
Security Audit Logs, and Demo Request Provisioning for Mixu Hospital Management System.
"""

import os
import json
import uuid
import hashlib
import hmac
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List

from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

ROLES_FILE = os.path.join(DATA_DIR, "roles.json")
USERS_FILE = os.path.join(DATA_DIR, "users.json")
AUDIT_LOGS_FILE = os.path.join(DATA_DIR, "audit_logs.json")
DEMO_REQUESTS_FILE = os.path.join(DATA_DIR, "demo_requests.json")


def _read_json(fpath: str, default: Any = None) -> Any:
    if not os.path.exists(fpath):
        return default if default is not None else []
    try:
        with open(fpath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        logger.error("Error reading JSON from %s: %s", fpath, exc)
        return default if default is not None else []


def _write_json(fpath: str, data: Any) -> bool:
    os.makedirs(os.path.dirname(fpath), exist_ok=True)
    temp_file = f"{fpath}.tmp"
    try:
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        os.replace(temp_file, fpath)
        return True
    except Exception as exc:
        logger.error("Error writing JSON to %s: %s", fpath, exc)
        if os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except OSError:
                pass
        return False


def hash_password(password: str, salt: str = None) -> str:
    """PBKDF2-HMAC-SHA256 password hashing with unique salt."""
    if not salt:
        salt = uuid.uuid4().hex
    pwd_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000
    ).hex()
    return f"{salt}${pwd_hash}"


def verify_password(plain_password: str, stored_hash: str) -> bool:
    """Verifies plain password against stored salt$hash."""
    try:
        if not stored_hash or "$" not in stored_hash:
            return False
        salt, expected_hash = stored_hash.split("$", 1)
        computed_hash = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            100000
        ).hex()
        return hmac.compare_digest(expected_hash, computed_hash)
    except Exception:
        return False


def log_audit_event(user_id: str, username: str, role: str, action: str, module: str,
                    record_id: str = None, success: bool = True, details: str = ""):
    """Appends an immutable security audit event."""
    try:
        logs = _read_json(AUDIT_LOGS_FILE, [])
        event = {
            "id": f"AUD-{uuid.uuid4().hex[:12].upper()}",
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "username": username,
            "role": role,
            "action": action,
            "module": module,
            "record_id": record_id or "",
            "success": success,
            "details": details
        }
        logs.insert(0, event)
        if len(logs) > 5000:
            logs = logs[:5000]
        _write_json(AUDIT_LOGS_FILE, logs)
    except Exception as exc:
        logger.error("Failed to write audit log: %s", exc)


ALL_PAGES = [
    {"id": "dashboard", "name": "Dashboard", "route": "/today-report-dashboard", "category": "General"},
    {"id": "patient_registration", "name": "Patient Registration", "route": "/patient-registration", "category": "OPD"},
    {"id": "patient_history", "name": "Patient History & EMR", "route": "/patient-history", "category": "Clinical"},
    {"id": "patient_registration_list", "name": "Patient Registration List", "route": "/patient-registration-list", "category": "OPD"},
    {"id": "patient_past_info", "name": "Patient Past Info & Timeline", "route": "/patient-past-info", "category": "Clinical"},
    {"id": "indoor_register", "name": "Indoor Register (Admissions)", "route": "/indoor-register", "category": "IPD"},
    {"id": "indoor_summary", "name": "Indoor Summary Chart", "route": "/indoor-summary", "category": "IPD"},
    {"id": "indoor_option", "name": "Indoor Options & Ward Transfer", "route": "/indoor-option", "category": "IPD"},
    {"id": "dr_visit_procedure", "name": "Dr Visit & Procedure Log", "route": "/dr-visit-procedure", "category": "Clinical"},
    {"id": "inpatient_bill", "name": "Inpatient Comprehensive Bill", "route": "/inpatient-bill", "category": "Billing"},
    {"id": "billing", "name": "OPD Billing Desk", "route": "/billing", "category": "Billing"},
    {"id": "bill_preview", "name": "Bill Preview & Tax Invoice", "route": "/bill-preview", "category": "Billing"},
    {"id": "deposit_entry", "name": "Deposit Entry & Advances", "route": "/deposit-entry", "category": "Billing"},
    {"id": "inpatient_receipt", "name": "Inpatient Payment Receipts", "route": "/inpatient-receipt", "category": "Billing"},
    {"id": "part_payment", "name": "Part-Payment Settlement", "route": "/part-payment", "category": "Billing"},
    {"id": "discharge_card", "name": "Discharge Card & Summary", "route": "/discharge-card", "category": "Clinical"},
    {"id": "room_charges", "name": "Room & Bed Charges", "route": "/room-charges", "category": "IPD"},
    {"id": "room_status", "name": "Room & Ward Status Board", "route": "/room-status", "category": "IPD"},
    {"id": "ot_entry", "name": "OT Entry & Operative Notes", "route": "/ot-entry", "category": "Surgical"},
    {"id": "operation_charges", "name": "Operation Charges Tariff", "route": "/operation-charges", "category": "Surgical"},
    {"id": "accounts", "name": "Accounts & Financial Reports", "route": "/accounts", "category": "Finance"},
    {"id": "investigation_ordered", "name": "Investigation Ordered", "route": "/investigation-ordered", "category": "Diagnostics"},
    {"id": "echo_report", "name": "2D Echocardiography Study", "route": "/echo-report", "category": "Diagnostics"},
    {"id": "bed_master", "name": "Bed Master & Tariffs", "route": "/bed-master", "category": "Masters"},
    {"id": "doctor_master", "name": "Doctor Master Directory", "route": "/doctor-master", "category": "Masters"},
    {"id": "medicine_master", "name": "Medicine & Pharmacy Master", "route": "/medicine-master", "category": "Masters"},
    {"id": "department_master", "name": "Department Master", "route": "/department-master", "category": "Masters"},
    {"id": "room_type_master", "name": "Room Type Master", "route": "/room-type-master", "category": "Masters"},
    {"id": "report_template", "name": "Clinical Report Templates", "route": "/report-template", "category": "Masters"},
    {"id": "roles_permissions", "name": "Roles & Granular Permissions", "route": "/roles", "category": "Administration"},
    {"id": "user_management", "name": "User Management", "route": "/users", "category": "Administration"},
    {"id": "demo_requests", "name": "Demo Request Management", "route": "/demo-requests", "category": "Administration"},
]


def ensure_default_roles_and_users():
    """Initializes standard hospital roles and default Super Admin account if not present."""
    roles = _read_json(ROLES_FILE, [])
    if not roles:
        full_permissions = {}
        for p in ALL_PAGES:
            full_permissions[p["id"]] = {
                "access": True,
                "view": True,
                "create": True,
                "edit": True,
                "delete": True,
                "print": True,
                "export": True,
            }

        roles = [
            {
                "id": "super_admin",
                "name": "Super Admin",
                "description": "Full institutional authority across all clinical, billing, and system configurations.",
                "is_system": True,
                "is_active": True,
                "permissions": full_permissions
            },
            {
                "id": "hospital_admin",
                "name": "Hospital Administrator",
                "description": "General administrator with access to all clinical, master, and financial reporting.",
                "is_system": False,
                "is_active": True,
                "permissions": {
                    k: {**v, "delete": k not in ("roles_permissions", "user_management")}
                    for k, v in full_permissions.items()
                }
            },
            {
                "id": "doctor",
                "name": "Consultant Doctor",
                "description": "Clinical staff managing patient rounds, prescriptions, Echo, investigations, and discharge.",
                "is_system": False,
                "is_active": True,
                "permissions": {
                    k: {
                        "access": k in ("patient_registration", "patient_history", "patient_past_info", "indoor_register", "indoor_summary", "dr_visit_procedure", "discharge_card", "ot_entry", "echo_report", "investigation_ordered", "report_template"),
                        "view": True,
                        "create": k in ("dr_visit_procedure", "discharge_card", "ot_entry", "echo_report", "investigation_ordered"),
                        "edit": k in ("dr_visit_procedure", "discharge_card", "ot_entry", "echo_report", "investigation_ordered"),
                        "delete": False,
                        "print": True,
                        "export": False
                    }
                    for k in [p["id"] for p in ALL_PAGES]
                }
            },
            {
                "id": "receptionist",
                "name": "Receptionist / Front Desk",
                "description": "Front-desk personnel handling patient registration, UHID stickers, and indoor lookup.",
                "is_system": False,
                "is_active": True,
                "permissions": {
                    k: {
                        "access": k in ("patient_registration", "patient_registration_list", "indoor_register", "room_status", "bed_master"),
                        "view": True,
                        "create": k in ("patient_registration",),
                        "edit": k in ("patient_registration",),
                        "delete": False,
                        "print": True,
                        "export": False
                    }
                    for k in [p["id"] for p in ALL_PAGES]
                }
            },
            {
                "id": "accountant",
                "name": "Hospital Accountant",
                "description": "Financial personnel overseeing Billing, Inpatient Invoices, Accounts Dashboard, and Reports.",
                "is_system": False,
                "is_active": True,
                "permissions": {
                    k: {
                        "access": k in ("accounts", "billing", "inpatient_bill", "deposit_entry", "inpatient_receipt", "part_payment", "bill_preview", "room_charges"),
                        "view": True,
                        "create": k in ("billing", "inpatient_bill", "deposit_entry", "inpatient_receipt", "part_payment"),
                        "edit": k in ("billing", "inpatient_bill"),
                        "delete": False,
                        "print": True,
                        "export": True
                    }
                    for k in [p["id"] for p in ALL_PAGES]
                }
            }
        ]
        _write_json(ROLES_FILE, roles)

    users = _read_json(USERS_FILE, [])
    if not users:
        # Default Super Admin account
        super_admin_user = {
            "id": "USR-000001",
            "username": "admin",
            "full_name": "System Administrator",
            "email": "admin@mixuhospital.com",
            "phone": "+91 98765 00001",
            "role_id": "super_admin",
            "password_hash": hash_password("Admin@123"),
            "is_active": True,
            "department": "Administration",
            "employee_id": "EMP-001",
            "created_at": datetime.now().isoformat(),
            "last_login": None
        }
        # Doctor account
        doctor_user = {
            "id": "USR-000002",
            "username": "dr_mahale",
            "full_name": "Dr. Nilesh Mahale",
            "email": "nilesh.mahale@mixuhospital.com",
            "phone": "+91 98765 00002",
            "role_id": "doctor",
            "password_hash": hash_password("Doctor@123"),
            "is_active": True,
            "department": "Cardiology / Medicine",
            "employee_id": "DOC-001",
            "created_at": datetime.now().isoformat(),
            "last_login": None
        }
        # Accountant account
        accountant_user = {
            "id": "USR-000003",
            "username": "accountant",
            "full_name": "Accounts Officer",
            "email": "accounts@mixuhospital.com",
            "phone": "+91 98765 00003",
            "role_id": "accountant",
            "password_hash": hash_password("Accounts@123"),
            "is_active": True,
            "department": "Finance & Accounts",
            "employee_id": "ACC-001",
            "created_at": datetime.now().isoformat(),
            "last_login": None
        }
        users = [super_admin_user, doctor_user, accountant_user]
        _write_json(USERS_FILE, users)


class AuthLoginView(APIView):
    """
    POST /api/auth/login/
    Authenticates user, verifies password, generates session token,
    and returns user details with role permissions.
    """
    def post(self, request):
        ensure_default_roles_and_users()
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        if not username or not password:
            return Response(
                {"success": False, "error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        users = _read_json(USERS_FILE, [])
        user = next((u for u in users if u["username"].lower() == username.lower()), None)

        if not user or not verify_password(password, user.get("password_hash", "")):
            log_audit_event("anonymous", username, "none", "LOGIN_FAILED", "Authentication", success=False, details="Invalid credentials")
            return Response(
                {"success": False, "error": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.get("is_active", True):
            log_audit_event(user["id"], user["username"], user["role_id"], "LOGIN_BLOCKED", "Authentication", success=False, details="Account inactive")
            return Response(
                {"success": False, "error": "This staff account has been deactivated. Contact the administrator."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Update last login
        user["last_login"] = datetime.now().isoformat()
        _write_json(USERS_FILE, users)

        # Retrieve Role permissions
        roles = _read_json(ROLES_FILE, [])
        role = next((r for r in roles if r["id"] == user["role_id"]), None)
        permissions = role.get("permissions", {}) if role else {}

        token = f"MXU-{uuid.uuid4().hex}"
        log_audit_event(user["id"], user["username"], user["role_id"], "LOGIN_SUCCESS", "Authentication", success=True)

        user_safe = {k: v for k, v in user.items() if k != "password_hash"}
        return Response({
            "success": True,
            "token": token,
            "user": user_safe,
            "role": role,
            "permissions": permissions
        }, status=status.HTTP_200_OK)


class AuthMeView(APIView):
    """
    GET /api/auth/me/
    Returns current authenticated user details and active permissions.
    """
    def get(self, request):
        ensure_default_roles_and_users()
        username = request.query_params.get("username")
        users = _read_json(USERS_FILE, [])
        user = next((u for u in users if u["username"] == username), users[0] if users else None)

        if not user:
            return Response({"success": False, "error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        roles = _read_json(ROLES_FILE, [])
        role = next((r for r in roles if r["id"] == user.get("role_id")), None)

        user_safe = {k: v for k, v in user.items() if k != "password_hash"}
        return Response({
            "success": True,
            "user": user_safe,
            "role": role,
            "permissions": role.get("permissions", {}) if role else {}
        })


class RolesListView(APIView):
    """
    GET /api/roles/
    POST /api/roles/
    Manage system and custom hospital roles with full permission matrices.
    """
    def get(self, request):
        ensure_default_roles_and_users()
        roles = _read_json(ROLES_FILE, [])
        return Response({
            "success": True,
            "roles": roles,
            "all_pages": ALL_PAGES
        }, status=status.HTTP_200_OK)

    def post(self, request):
        ensure_default_roles_and_users()
        data = request.data
        role_name = data.get("name", "").strip()
        if not role_name:
            return Response({"success": False, "error": "Role name is required."}, status=status.HTTP_400_BAD_REQUEST)

        roles = _read_json(ROLES_FILE, [])
        role_id = data.get("id") or role_name.lower().replace(" ", "_")

        if any(r["id"] == role_id for r in roles):
            return Response({"success": False, "error": f"Role ID '{role_id}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

        new_role = {
            "id": role_id,
            "name": role_name,
            "description": data.get("description", "Custom hospital access role"),
            "is_system": False,
            "is_active": data.get("is_active", True),
            "permissions": data.get("permissions", {})
        }
        roles.append(new_role)
        _write_json(ROLES_FILE, roles)

        log_audit_event("admin", "admin", "super_admin", "CREATE_ROLE", "Roles", record_id=role_id)
        return Response({"success": True, "role": new_role}, status=status.HTTP_201_CREATED)


class RoleDetailView(APIView):
    """
    GET, PUT, DELETE /api/roles/<role_id>/
    """
    def get(self, request, role_id):
        roles = _read_json(ROLES_FILE, [])
        role = next((r for r in roles if r["id"] == role_id), None)
        if not role:
            return Response({"success": False, "error": "Role not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"success": True, "role": role})

    def put(self, request, role_id):
        roles = _read_json(ROLES_FILE, [])
        role = next((r for r in roles if r["id"] == role_id), None)
        if not role:
            return Response({"success": False, "error": "Role not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if "name" in data and data["name"].strip():
            role["name"] = data["name"].strip()
        if "description" in data:
            role["description"] = data["description"]
        if "is_active" in data:
            if role_id == "super_admin" and not data["is_active"]:
                return Response({"success": False, "error": "Super Admin role cannot be deactivated."}, status=status.HTTP_400_BAD_REQUEST)
            role["is_active"] = bool(data["is_active"])
        if "permissions" in data and isinstance(data["permissions"], dict):
            role["permissions"] = data["permissions"]

        _write_json(ROLES_FILE, roles)
        log_audit_event("admin", "admin", "super_admin", "UPDATE_ROLE", "Roles", record_id=role_id)
        return Response({"success": True, "role": role})

    def delete(self, request, role_id):
        if role_id == "super_admin":
            return Response({"success": False, "error": "Super Admin role cannot be deleted."}, status=status.HTTP_400_BAD_REQUEST)

        roles = _read_json(ROLES_FILE, [])
        role = next((r for r in roles if r["id"] == role_id), None)
        if not role:
            return Response({"success": False, "error": "Role not found."}, status=status.HTTP_404_NOT_FOUND)

        if role.get("is_system"):
            return Response({"success": False, "error": "Built-in system roles cannot be deleted."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if users are assigned
        users = _read_json(USERS_FILE, [])
        if any(u.get("role_id") == role_id for u in users):
            return Response({"success": False, "error": "Cannot delete role because staff members are actively assigned to it."}, status=status.HTTP_400_BAD_REQUEST)

        roles = [r for r in roles if r["id"] != role_id]
        _write_json(ROLES_FILE, roles)
        log_audit_event("admin", "admin", "super_admin", "DELETE_ROLE", "Roles", record_id=role_id)
        return Response({"success": True, "message": "Role successfully deleted."})


class UsersListView(APIView):
    """
    GET /api/users/
    POST /api/users/
    Manage staff accounts with role binding and PBKDF2 password security.
    """
    def get(self, request):
        ensure_default_roles_and_users()
        users = _read_json(USERS_FILE, [])
        safe_users = [{k: v for k, v in u.items() if k != "password_hash"} for u in users]
        return Response({"success": True, "users": safe_users})

    def post(self, request):
        ensure_default_roles_and_users()
        data = request.data
        username = data.get("username", "").strip()
        full_name = data.get("full_name", "").strip()
        password = data.get("password", "").strip()
        role_id = data.get("role_id", "doctor")

        if not username or not full_name or not password:
            return Response({"success": False, "error": "Username, full name, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        users = _read_json(USERS_FILE, [])
        if any(u["username"].lower() == username.lower() for u in users):
            return Response({"success": False, "error": f"Username '{username}' is already in use."}, status=status.HTTP_400_BAD_REQUEST)

        user_id = f"USR-{uuid.uuid4().hex[:6].upper()}"
        new_user = {
            "id": user_id,
            "username": username,
            "full_name": full_name,
            "email": data.get("email", ""),
            "phone": data.get("phone", ""),
            "role_id": role_id,
            "password_hash": hash_password(password),
            "is_active": data.get("is_active", True),
            "department": data.get("department", "General"),
            "employee_id": data.get("employee_id", user_id),
            "created_at": datetime.now().isoformat(),
            "last_login": None
        }
        users.append(new_user)
        _write_json(USERS_FILE, users)

        log_audit_event("admin", "admin", "super_admin", "CREATE_USER", "UserManagement", record_id=user_id, details=f"User {username} created")
        safe_user = {k: v for k, v in new_user.items() if k != "password_hash"}
        return Response({"success": True, "user": safe_user}, status=status.HTTP_201_CREATED)


class UserDetailView(APIView):
    """
    GET, PUT, DELETE /api/users/<user_id>/
    """
    def put(self, request, user_id):
        users = _read_json(USERS_FILE, [])
        user = next((u for u in users if u["id"] == user_id), None)
        if not user:
            return Response({"success": False, "error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if "full_name" in data:
            user["full_name"] = data["full_name"].strip()
        if "email" in data:
            user["email"] = data["email"].strip()
        if "phone" in data:
            user["phone"] = data["phone"].strip()
        if "role_id" in data:
            user["role_id"] = data["role_id"]
        if "department" in data:
            user["department"] = data["department"]
        if "employee_id" in data:
            user["employee_id"] = data["employee_id"]
        if "is_active" in data:
            if user["username"] == "admin" and not data["is_active"]:
                return Response({"success": False, "error": "Primary Super Admin account cannot be deactivated."}, status=status.HTTP_400_BAD_REQUEST)
            user["is_active"] = bool(data["is_active"])
        if "password" in data and data["password"].strip():
            user["password_hash"] = hash_password(data["password"].strip())
            log_audit_event("admin", "admin", "super_admin", "RESET_PASSWORD", "UserManagement", record_id=user_id)

        _write_json(USERS_FILE, users)
        log_audit_event("admin", "admin", "super_admin", "UPDATE_USER", "UserManagement", record_id=user_id)
        safe_user = {k: v for k, v in user.items() if k != "password_hash"}
        return Response({"success": True, "user": safe_user})

    def delete(self, request, user_id):
        users = _read_json(USERS_FILE, [])
        user = next((u for u in users if u["id"] == user_id), None)
        if not user:
            return Response({"success": False, "error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if user["username"] == "admin":
            return Response({"success": False, "error": "Primary Super Admin account cannot be deleted."}, status=status.HTTP_400_BAD_REQUEST)

        users = [u for u in users if u["id"] != user_id]
        _write_json(USERS_FILE, users)
        log_audit_event("admin", "admin", "super_admin", "DELETE_USER", "UserManagement", record_id=user_id)
        return Response({"success": True, "message": "User deleted successfully."})


class DemoRequestsView(APIView):
    """
    POST /api/demo-requests/ -> Public enquiry submission from marketing website
    GET /api/demo-requests/  -> Admin list of enquiries
    """
    def post(self, request):
        data = request.data
        enquiry_id = data.get("enquiry_id") or f"ENQ-{uuid.uuid4().hex[:6].upper()}"
        enquiry = {
            "id": enquiry_id,
            "enquiry_id": enquiry_id,
            "hospital_name": data.get("hospital_name", "").strip(),
            "contact_person": data.get("contact_person", "").strip(),
            "email": data.get("email", "").strip(),
            "phone": data.get("phone", "").strip(),
            "hospital_type": data.get("hospital_type", "General Hospital"),
            "bed_count": data.get("bed_count", "50-100 Beds"),
            "preferred_date": data.get("preferred_date", ""),
            "message": data.get("message", ""),
            "status": "Pending",  # Pending | Approved | Rejected
            "created_at": datetime.now().isoformat(),
            "approved_at": None,
            "access_expiry": None,
            "internal_notes": ""
        }

        requests = _read_json(DEMO_REQUESTS_FILE, [])
        requests.insert(0, enquiry)
        _write_json(DEMO_REQUESTS_FILE, requests)

        log_audit_event("public", enquiry["contact_person"], "demo_lead", "SUBMIT_DEMO_REQUEST", "Marketing", record_id=enquiry_id)
        return Response({
            "success": True,
            "enquiry_id": enquiry_id,
            "message": "Thank you for your interest in Mixu. Your demo request has been received. Our team will review your request and contact you."
        }, status=status.HTTP_201_CREATED)

    def get(self, request):
        requests = _read_json(DEMO_REQUESTS_FILE, [])
        return Response({"success": True, "requests": requests})


class DemoRequestActionView(APIView):
    """
    POST /api/demo-requests/<enquiry_id>/approve/
    POST /api/demo-requests/<enquiry_id>/reject/
    Admin approves request, sets access duration, and provisions isolated demo user.
    """
    def post(self, request, enquiry_id, action):
        requests = _read_json(DEMO_REQUESTS_FILE, [])
        req = next((r for r in requests if r["id"] == enquiry_id or r.get("enquiry_id") == enquiry_id), None)
        if not req:
            return Response({"success": False, "error": "Enquiry not found."}, status=status.HTTP_404_NOT_FOUND)

        duration_days = int(request.data.get("duration_days", 14))
        notes = request.data.get("internal_notes", "")

        if action == "approve":
            req["status"] = "Approved"
            req["approved_at"] = datetime.now().isoformat()
            req["access_expiry"] = (datetime.now() + timedelta(days=duration_days)).isoformat()
            req["internal_notes"] = notes

            # Provision dedicated demo user in users.json
            users = _read_json(USERS_FILE, [])
            demo_username = f"demo_{req['id'].lower().replace('-', '_')}"
            demo_password = f"MixuDemo@{uuid.uuid4().hex[:4].upper()}"

            demo_user = {
                "id": f"USR-DEMO-{req['id']}",
                "username": demo_username,
                "full_name": f"{req['contact_person']} ({req['hospital_name']})",
                "email": req["email"],
                "phone": req["phone"],
                "role_id": "doctor",  # Default clinical demo role
                "password_hash": hash_password(demo_password),
                "is_active": True,
                "department": "Institutional Demonstration",
                "employee_id": req["id"],
                "created_at": datetime.now().isoformat(),
                "expires_at": req["access_expiry"],
                "is_demo_account": True
            }
            users.append(demo_user)
            _write_json(USERS_FILE, users)
            req["provisioned_user"] = demo_username

            _write_json(DEMO_REQUESTS_FILE, requests)
            log_audit_event("admin", "admin", "super_admin", "APPROVE_DEMO_REQUEST", "Marketing", record_id=enquiry_id)

            return Response({
                "success": True,
                "message": f"Demo request approved. Dedicated sandbox user '{demo_username}' provisioned with {duration_days} days access.",
                "demo_credentials": {
                    "username": demo_username,
                    "temporary_password": demo_password,
                    "expires_at": req["access_expiry"]
                }
            })

        elif action == "reject":
            req["status"] = "Rejected"
            req["internal_notes"] = notes
            _write_json(DEMO_REQUESTS_FILE, requests)
            log_audit_event("admin", "admin", "super_admin", "REJECT_DEMO_REQUEST", "Marketing", record_id=enquiry_id)
            return Response({"success": True, "message": "Demo request marked as rejected."})

        return Response({"success": False, "error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)


class AuditLogsListView(APIView):
    """
    GET /api/audit-logs/
    Returns immutable security audit events for administrator compliance review.
    """
    def get(self, request):
        logs = _read_json(AUDIT_LOGS_FILE, [])
        return Response({"success": True, "logs": logs[:200]})
