from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from uuid import uuid4
from .connection import Base


class BaseModel(Base):
    __abstract__ = True
    id = Column(String(256), primary_key=True, index=True, default=lambda: str(uuid4()))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
