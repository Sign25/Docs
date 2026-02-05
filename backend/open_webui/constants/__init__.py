"""
Constants package for Open WebUI
"""

# Import message constants
from open_webui.constants.messages import (
    ERROR_MESSAGES,
    MESSAGES,
    WEBHOOK_MESSAGES,
    TASKS,
)

# Import role constants
from open_webui.constants.roles import (
    UserRole,
    has_permission,
    has_admin_access,
    should_bypass_model_access,
    can_access_reputation_agent,
    can_access_all_brands,
    can_view_analytics,
    can_escalate,
    validate_role,
    get_role_display_name,
)

__all__ = [
    # Message constants
    "ERROR_MESSAGES",
    "MESSAGES",
    "WEBHOOK_MESSAGES",
    "TASKS",
    # Role constants
    "UserRole",
    "has_permission",
    "has_admin_access",
    "should_bypass_model_access",
    "can_access_reputation_agent",
    "can_access_all_brands",
    "can_view_analytics",
    "can_escalate",
    "validate_role",
    "get_role_display_name",
]
