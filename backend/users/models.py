from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database.models import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    name = Column(String(256), nullable=False)
    email = Column(String(256), unique=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    address = Column(String(256), nullable=True)
    contact = Column(String(256), nullable=True)
    is_admin = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    # Relationships
    carts = relationship("Cart", back_populates="user")
    orders = relationship("Order", back_populates="user")
