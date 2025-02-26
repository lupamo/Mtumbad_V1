from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from database.models import BaseModel


class Order(BaseModel):
    __tablename__ = "orders"

    user_id = Column(String(256), ForeignKey("users.id"), nullable=False)
    total = Column(Float, nullable=False)  # Total price of the entire order
    status = Column(String(256), default="pending")  # Status: pending, completed, canceled

    # Relationships
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete")

class OrderItem(BaseModel):
    __tablename__ = "order_items"

    order_id = Column(String(256), ForeignKey("orders.id"), nullable=False)
    product_id = Column(String(256), ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # Price of the product at the time of order

    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

