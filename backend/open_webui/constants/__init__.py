"""
Constants package for Open WebUI
"""

from open_webui.constants.roles import (
    UserRole,
    has_permission,
    has_admin_access,
    can_access_reputation_agent,
    can_access_all_brands,
    can_view_analytics,
    can_escalate,
    validate_role,
    get_role_display_name,
)

__all__ = [
    "UserRole",
    "has_permission",
    "has_admin_access",
    "can_access_reputation_agent",
    "can_access_all_brands",
    "can_view_analytics",
    "can_escalate",
    "validate_role",
    "get_role_display_name",
]
