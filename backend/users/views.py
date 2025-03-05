from fastapi import Depends, APIRouter
from database.connection import get_session
from .models import User
from sqlalchemy.orm import Session
from typing import List
from utils.errors import HTTPError
from . import schemas
from auth.auth import AuthHandler, security
from fastapi.security import HTTPBasicCredentials

users_router = APIRouter(prefix="/users", tags=["users"])

@users_router.get("/", response_model=List[schemas.UserResponse])
async def get_users(session: Session = Depends(get_session)):
    users = session.query(User).all()
    return users

@users_router.post("/register", response_model=schemas.UserResponse)
async def create_user(user: schemas.UserCreate, session: Session = Depends(get_session)):
    """
    Create a new user
    """
    if session.query(User).filter(User.email == user.email).first():
        raise HTTPError.bad_request("User already exists")
    
    hashed_password = AuthHandler().get_password_hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


@users_router.get("/{user_id}", response_model=schemas.UserResponse)
async def get_user(user_id: str, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPError.not_found("User not found")
    return user


@users_router.put("/{user_id}", response_model=schemas.UserResponse)
async def update_user(user_id: str, user: schemas.UserUpdate, session: Session = Depends(get_session)):
    updated_user = session.query(User).filter(User.id == user_id).first()
    if not updated_user:
        raise HTTPError.not_found("User not found")
    
    for key, value in user.dict().items():
        setattr(updated_user, key, value)

    session.commit()
    session.refresh(updated_user)
    return updated_user


@users_router.delete("/{user_id}")
async def delete_user(user_id: str, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPError.not_found("User not found")
    
    session.delete(user)
    session.commit()
    return {"message": "User deleted successfully"}
    
    