from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from database.connection import get_session
from .models import Cart
from products.models import Product, ProductSize
from .schemas import CartCreate
from utils.errors import HTTPError
from typing import List
from auth.auth import AuthHandler, security
from fastapi.security import HTTPBasicCredentials


cart_router = APIRouter(prefix="/cart", tags=["cart"])

@cart_router.get("/")
async def get_cart_items(
    credentials: HTTPBasicCredentials = Depends(security),
    session: Session = Depends(get_session)
    ):
    cart_items = session.query(Cart).all()
    return cart_items

@cart_router.post("/")
async def add_to_cart(
    cart: CartCreate,
    credentials: HTTPBasicCredentials = Depends(security),
    session: Session = Depends(get_session)
    ):
    """create a new cart
    """
    user = AuthHandler().get_current_user(session, credentials.credentials)

    product = session.query(Product).filter(Product.id == cart.product_id).first()
    if not product:
        raise HTTPError.not_found("Product not found")
    
    # Find the requested size in the product's stock
    size_stock = session.query(ProductSize).filter(
        ProductSize.product_id == product.id,
        ProductSize.size == cart.size
    ).first()
    if not size_stock:
        raise HTTPError.not_found("Selected size is not available for this product")
    
    # Check stock availability
    if size_stock.stock < cart.quantity:
        raise HTTPError.bad_request(f"Only {size_stock.stock} left in stock for size {cart.size}")

    # Check if the product is already in the cart        
    existing_cart = session.query(Cart).filter(
        Cart.user_id == user.id,
        Cart.product_id == cart.product_id
      ).first()
    if existing_cart:
      existing_cart.quantity += cart.quantity
      new_cart = existing_cart
    else:
      new_cart = Cart(
        user_id=user.id,
        product_id=cart.product_id,
        quantity=cart.quantity,
        size=cart.size
      )
      session.add(new_cart)

    session.commit()
    session.refresh(new_cart)
    return new_cart or existing_cart

@cart_router.get("/user/{cart_id}")
async def get_cart_item(cart_id: str, session: Session = Depends(get_session)):
    cart_item = session.query(Cart).filter(Cart.id == cart_id).first()
    if not cart_item:
        raise HTTPError.not_found("Cart not found")
    return cart_item

@cart_router.put("/{cart_id}")
async def update_cart_item(cart_id: str, quantity: int, session: Session = Depends(get_session)):
    cart_item = session.query(Cart).filter(Cart.id == cart_id).first()
    if not cart_item:
        raise HTTPError.not_found("Cart not found")
    
    if quantity < 0:
        session.delete(cart_item)
    else:
        cart_item.quantity = quantity

    session.commit()
    session.refresh(cart_item)
    return cart_item

@cart_router.delete("/{cart_id}")
async def delete_cart_item(cart_id: str, session: Session = Depends(get_session)):
    cart_item = session.query(Cart).filter(Cart.id == cart_id).first()
    if not cart_item:
        raise HTTPError.not_found("Cart not found")
    
    session.delete(cart_item)
    session.commit()
    return {"message": "item succesfully removed from cart"}