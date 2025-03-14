"""create product sixe models

Revision ID: ae425910612a
Revises: 85a7cb600ab0
Create Date: 2025-02-27 14:39:49.399162

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ae425910612a'
down_revision: Union[str, None] = '85a7cb600ab0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('carts', sa.Column('size', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('carts', 'size')
    # ### end Alembic commands ###
