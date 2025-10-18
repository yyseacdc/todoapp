"""initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2025-10-17
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("SELECT 1")  # placeholder to mark initial migration


def downgrade() -> None:
    op.execute("SELECT 1")
