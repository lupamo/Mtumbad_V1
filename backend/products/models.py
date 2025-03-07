from database.models import BaseModel
from sqlalchemy import Column, String, Integer, ForeignKey, Float, Text, Boolean
from sqlalchemy.orm import relationship


class Product(BaseModel):
    __tablename__ = "products"

    name = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    bestselling = Column(Boolean, default=False)
    category_id = Column(String(256), ForeignKey("categories.id"))
    subcategory_id = Column(String(256), ForeignKey("categories.id"))


    # Foreign key linking to Subcategory
    subcategory_id = Column(String, ForeignKey("subcategories.id"), nullable=False)

    # Relationship with Subcategory
    products_images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    subcategory = relationship("Subcategory", back_populates="products")
    carts = relationship("Cart", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")
    sizes = relationship("ProductSize", back_populates="product", cascade="all, delete-orphan")


class ProductSize(BaseModel):
    __tablename__ = "product_sizes"

    product_id = Column(String(256), ForeignKey("products.id"), nullable=False)
    size = Column(String, nullable=False)
    stock = Column(Integer, default=0)

    product = relationship("Product", back_populates="sizes")


class ProductImage(BaseModel):
    __tablename__ = "product_images"

    product_id = Column(String(256), ForeignKey("products.id"), nullable=False)
    image_url = Column(String(256), nullable=False)

    product = relationship("Product", back_populates="products_images")