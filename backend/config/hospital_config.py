"""
Central Hospital Configuration
Holds authoritative hospital identity parameters for all backend modules, PDF generators, and APIs.
Can be easily updated or customized.
"""

from typing import Dict, Any

HOSPITAL_CONFIG: Dict[str, Any] = {
    "name": "XYZ",
    "subTitle": "XYZ",
    "address": "XYZ",
    "phone": "XYZ",
    "email": "XYZ",
    "managedBy": "",
    "cinNo": "",
    "logoUrl": "",
}


def get_hospital_config() -> Dict[str, Any]:
    """Return a copy of the active hospital configuration dictionary."""
    return HOSPITAL_CONFIG.copy()
