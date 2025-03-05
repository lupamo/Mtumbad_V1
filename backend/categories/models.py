from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database.models import BaseModel

class Category(BaseModel):
    __tablename__ = "categories"

    name = Column(String(100), unique=True, nullable=False)

    # Relationship with Subcategories
    subcategories = relationship("Subcategory", back_populates="category", cascade="all, delete")




class Subcategory(BaseModel):
    __tablename__ = "subcategories"

    name = Column(String(100), nullable=False)

    # Foreign key linking to Category
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)

    # Relationship with Category
    category = relationship("Category", back_populates="subcategories")

    # Relationship with Products
    products = relationship("Product", back_populates="subcategory")

