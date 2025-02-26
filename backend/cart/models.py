from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.models import BaseModel


class Cart(BaseModel):
    __tablename__ = "carts"

    user_id = Column(String(256), ForeignKey("users.id"), nullable=False)
    product_id = Column(String(256), ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)

    # relationships
    product = relationship("Product", back_populates="carts")
    user = relationship("User", back_populates="carts")