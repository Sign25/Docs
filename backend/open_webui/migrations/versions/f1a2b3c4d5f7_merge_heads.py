"""Merge migration heads

Revision ID: f1a2b3c4d5f7
Revises: c440947495f3, e1a2b3c4d5f6
Create Date: 2026-01-18 12:00:00.000000

"""

from alembic import op
import sqlalchemy as sa

revision = "f1a2b3c4d5f7"
down_revision = ("c440947495f3", "e1a2b3c4d5f6")
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
