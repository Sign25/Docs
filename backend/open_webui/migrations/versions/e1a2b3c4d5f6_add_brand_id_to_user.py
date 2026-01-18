"""Add brand_id to user table for role-based access control

Revision ID: e1a2b3c4d5f6
Revises: 018012973d35
Create Date: 2026-01-17 19:00:00.000000

"""

from alembic import op
import sqlalchemy as sa

revision = "e1a2b3c4d5f6"
down_revision = "018012973d35"
branch_labels = None
depends_on = None


def upgrade():
    # Add brand_id column to user table
    # For managers: restricts access to specific brand
    # For senior/director/admin: NULL (access all brands)
    op.add_column("user", sa.Column("brand_id", sa.String(), nullable=True))


def downgrade():
    # Remove brand_id column
    op.drop_column("user", "brand_id")
