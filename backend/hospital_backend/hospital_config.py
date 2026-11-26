"""
Hospital configuration re-export for hospital_backend package.
"""
from config.hospital_config import HOSPITAL_CONFIG, get_hospital_config

__all__ = ["HOSPITAL_CONFIG", "get_hospital_config"]
