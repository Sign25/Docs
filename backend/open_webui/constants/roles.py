"""
User Roles and Permissions for Adolf Ohana Market

Defines the role hierarchy and permission checking for the Reputation module.
"""

from typing import Optional


class UserRole:
    """
    User role constants

    Hierarchy (lowest to highest):
    pending -> staff -> manager -> senior -> director -> admin
    """

    # Roles
    PENDING = "pending"      # Awaiting approval
    STAFF = "staff"          # No access to @Adolf_Reputation agent
    MANAGER = "manager"      # Access to own brand_id only
    SENIOR = "senior"        # Access to all brands + escalation
    DIRECTOR = "director"    # Access to all brands + analytics
    ADMIN = "admin"          # Full system access

    # Role hierarchy (for permission comparison)
    HIERARCHY = {
        PENDING: 0,
        STAFF: 1,
        MANAGER: 2,
        SENIOR: 3,
        DIRECTOR: 4,
        ADMIN: 5
    }

    # All valid roles
    ALL_ROLES = [PENDING, STAFF, MANAGER, SENIOR, DIRECTOR, ADMIN]

    # Roles that have access to @Adolf_Reputation agent
    REPUTATION_ROLES = [MANAGER, SENIOR, DIRECTOR, ADMIN]

    # Roles that can access all brands (no brand_id filter)
    ALL_BRANDS_ROLES = [SENIOR, DIRECTOR, ADMIN]

    # Roles that can view analytics/statistics
    ANALYTICS_ROLES = [DIRECTOR, ADMIN]

    # Roles that can escalate issues
    ESCALATION_ROLES = [SENIOR, DIRECTOR, ADMIN]


def has_permission(user_role: str, required_role: str) -> bool:
    """
    Check if user has required permission level

    Args:
        user_role: User's current role
        required_role: Minimum required role

    Returns:
        True if user's role is equal or higher than required

    Example:
        has_permission("director", "manager") -> True
        has_permission("staff", "manager") -> False
    """
    user_level = UserRole.HIERARCHY.get(user_role, -1)
    required_level = UserRole.HIERARCHY.get(required_role, 0)

    return user_level >= required_level


def has_admin_access(user_role: str) -> bool:
    """
    Check if user has admin access

    Args:
        user_role: User's current role

    Returns:
        True if user is admin
    """
    return user_role == UserRole.ADMIN


def should_bypass_model_access(user_role: str) -> bool:
    """
    Check if user should bypass model access control.
    All authenticated users except pending can access models.

    Args:
        user_role: User's current role

    Returns:
        True if user should bypass model access control
    """
    return user_role in [
        UserRole.STAFF,
        UserRole.MANAGER,
        UserRole.SENIOR,
        UserRole.DIRECTOR,
        UserRole.ADMIN
    ]


def can_access_reputation_agent(user_role: str) -> bool:
    """
    Check if user can access @Adolf_Reputation agent

    Args:
        user_role: User's current role

    Returns:
        True if user can use the reputation agent
    """
    return user_role in UserRole.REPUTATION_ROLES


def can_access_all_brands(user_role: str) -> bool:
    """
    Check if user can access all brands (no brand_id filter)

    Args:
        user_role: User's current role

    Returns:
        True if user can see all brands
    """
    return user_role in UserRole.ALL_BRANDS_ROLES


def can_view_analytics(user_role: str) -> bool:
    """
    Check if user can view analytics/statistics

    Args:
        user_role: User's current role

    Returns:
        True if user can access analytics
    """
    return user_role in UserRole.ANALYTICS_ROLES


def can_escalate(user_role: str) -> bool:
    """
    Check if user can escalate items

    Args:
        user_role: User's current role

    Returns:
        True if user can escalate
    """
    return user_role in UserRole.ESCALATION_ROLES


def get_role_display_name(role: str) -> str:
    """
    Get human-readable role name

    Args:
        role: Role constant

    Returns:
        Display name for the role
    """
    display_names = {
        UserRole.PENDING: "Pending Approval",
        UserRole.STAFF: "Staff",
        UserRole.MANAGER: "Manager",
        UserRole.SENIOR: "Senior Manager",
        UserRole.DIRECTOR: "Director",
        UserRole.ADMIN: "Administrator"
    }

    return display_names.get(role, role.capitalize())


def validate_role(role: str) -> bool:
    """
    Validate if role is valid

    Args:
        role: Role to validate

    Returns:
        True if role is valid
    """
    return role in UserRole.ALL_ROLES
