from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.errors import HTTPError
from .models import Order, OrderItem
from database.connection import get_session
from cart.models import Cart
from fastapi.security import HTTPBasicCredentials
from auth.auth import security, AuthHandler


order_router = APIRouter(prefix="/orders", tags=["Orders"])

@order_router.get("/")
async def get_orders(session: Session = Depends(get_session)):
    orders = session.query(Order).all()
    return orders


@order_router.get('/me')
async def get_my_orders(
    credentials: HTTPBasicCredentials = Depends(security),
    session: Session = Depends(get_session)
    ):
    user = AuthHandler().get_current_user(session, credentials.credentials)
    orders = session.query(Order).filter(Order.user_id == user.id).all()
    return orders


@order_router.get("/{order_id}")
async def get_order(order_id: str, session: Session = Depends(get_session)):
    order = session.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPError.not_found("Order not found")
    return order

@order_router.post("/checkout")
async def checkout(
    credentials: HTTPBasicCredentials = Depends(security),
    session: Session = Depends(get_session)
    ):
    user = AuthHandler().get_current_user(session, credentials.credentials)
    cart_items = session.query(Cart).filter(Cart.user_id == user.id).all()

    if not cart_items:
        raise HTTPError.bad_request("Cart is empty")

    # Calculate total price
    total_price = sum(item.product.price * item.quantity for item in cart_items)

    # Create an order
    new_order = Order(user_id=user.id, total=total_price)
    session.add(new_order)
    session.commit()  # Save order first to generate order_id

    # Convert cart items to order items
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
        session.add(order_item)
    
    # Clear cart after checkout
    session.query(Cart).filter(Cart.user_id == user.id).delete()

    session.commit()
    return {"message": "Checkout successful", "order_id": new_order.id}


@order_router.get("/{order_id}/items")
async def get_order_items(order_id: str, session: Session = Depends(get_session)):
    order_items = session.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    return order_items


@order_router.get("/{order_id}/item/{item_id}")
async def get_order_item(order_id: str, item_id: str, session: Session = Depends(get_session)):
    order_item = session.query(OrderItem).filter(OrderItem.order_id == order_id, OrderItem.id == item_id).first()
    if not order_item:
        raise HTTPError.not_found("Order item not found")
    return order_item


@order_router.delete("/{order_id}/item/{item_id}")
async def delete_order_item(order_id: str, item_id: str, session: Session = Depends(get_session)):
    order_item = session.query(OrderItem).filter(OrderItem.order_id == order_id, OrderItem.id == item_id).first()
    if not order_item:
        raise HTTPError.not_found("Order item not found")
    
    session.delete(order_item)
    session.commit()
    return {"message": "item succesfully removed from order"}


@order_router.delete("/{order_id}")
async def delete_order(order_id: str, session: Session = Depends(get_session)):
    order = session.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPError.not_found("Order not found")
    
    session.delete(order)
    session.commit()
    return {"message": "order succesfully removed"}


@order_router.put("/{order_id}")
async def update_order(order_id: str, status: str, session: Session = Depends(get_session)):
    order = session.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPError.not_found("Order not found")
    
    order.status = status

    session.commit()
    session.refresh(order)
    return order


@order_router.get("/user/{user_id}")
async def get_user_orders(user_id: str, session: Session = Depends(get_session)):
    orders = session.query(Order).filter(Order.user_id == user_id).all()
    return orders

@order_router.get("/user/{user_id}/items")
async def get_user_order_items(user_id: str, session: Session = Depends(get_session)):
    orders = session.query(Order).filter(Order.user_id == user_id).all()
    order_items = []
    for order in orders:
        items = session.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        order_items.extend(items)
    return order_items

@order_router.get("/user/{user_id}/item/{item_id}")
async def get_user_order_item(user_id: str, item_id: str, session: Session = Depends(get_session)):
    order_items = session.query(OrderItem).filter(OrderItem.id == item_id).all()
    return order_items
