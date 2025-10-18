"""create tasks and reminders

Revision ID: 0002_create_tasks_and_reminders
Revises: 0001_initial
Create Date: 2025-10-17
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0002_create_tasks_and_reminders'
down_revision = '0001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'tasks',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('title', sa.String(length=120), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('due_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('priority', sa.Enum('low', 'normal', 'high', name='taskpriority', native_enum=False), nullable=False, server_default='normal'),
        sa.Column('status', sa.Enum('active', 'completed', 'deleted', name='taskstatus', native_enum=False), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('reminder_id', sa.String(), nullable=True),
        sa.CheckConstraint('length(title) BETWEEN 1 AND 120', name='ck_tasks_title_length')
    )

    op.create_table(
        'reminders',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('task_id', sa.String(), sa.ForeignKey('tasks.id'), nullable=False, unique=True),
        sa.Column('scheduled_for', sa.DateTime(timezone=True), nullable=False),
        sa.Column('channel', sa.String(length=32), nullable=False, server_default='in_app'),
        sa.Column('status', sa.Enum('scheduled', 'sent', 'cancelled', 'snoozed', name='reminderstatus', native_enum=False), nullable=False, server_default='scheduled'),
        sa.Column('snooze_until', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False)
    )

    op.create_index('ix_reminders_task_id', 'reminders', ['task_id'])


def downgrade() -> None:
    op.drop_index('ix_reminders_task_id', table_name='reminders')
    op.drop_table('reminders')
    op.drop_table('tasks')
    