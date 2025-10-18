"""create reminder activity

Revision ID: 0003_create_reminder_activity
Revises: 0002_create_tasks_and_reminders
Create Date: 2025-10-17
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0003_create_reminder_activity'
down_revision = '0002_create_tasks_and_reminders'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'reminder_activity',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('reminder_id', sa.String(), sa.ForeignKey('reminders.id'), nullable=False),
        sa.Column('event_type', sa.Enum('scheduled', 'delivered', 'dismissed', 'snoozed', 'error', name='reminderevent', native_enum=False), nullable=False),
        sa.Column('event_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('metadata', sa.JSON(), nullable=True)
    )
    op.create_index('ix_reminder_activity_reminder_id', 'reminder_activity', ['reminder_id'])


def downgrade() -> None:
    op.drop_index('ix_reminder_activity_reminder_id', table_name='reminder_activity')
    op.drop_table('reminder_activity')
