from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.errors import HTTPError
from .models import Product
from database.connection import get_session
from .schemas import ProductCreate


product_router = APIRouter(prefix="/products", tags=["Products"])

@product_router.get("/")
async def get_products(session: Session = Depends(get_session)):
    products = session.query(Product).all()
    return products

@product_router.get("/{product_id}")
async def get_product(product_id: str, session: Session = Depends(get_session)):
    product = session.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPError.not_found("Product not found")
    return product

@product_router.post("/")
async def create_product(product: ProductCreate, session: Session = Depends(get_session)):
    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        image_urls=product.image_urls,
        category_id=product.category_id,
        subcategory_id=product.subcategory_id,
        sizes=product.sizes
    )
    session.add(new_product)
    session.commit()
    session.refresh(new_product)
    return new_product

@product_router.put("/{product_id}")
async def update_product(product_id: str, product: ProductCreate, session: Session = Depends(get_session)):
    product = session.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPError.not_found("Product not found")
    product.name = product.name
    product.description = product.description
    product.price = product.price
    product.image_urls = product.image_urls
    product.category_id = product.category_id
    product.subcategory_id = product.subcategory_id
    product.sizes = product.sizes
    session.commit()
    return product