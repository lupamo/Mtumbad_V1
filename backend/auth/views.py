from fastapi import FastAPI, Depends, APIRouter
from database.connection import get_session
from users.models import User
from sqlalchemy.orm import Session
from typing import List
from utils.errors import HTTPError
from .auth import AuthHandler


auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/login")
async def login(email: str, password: str, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPError.not_found("User not found")
    
    if not AuthHandler().verify_password(password, user.hashed_password):
        raise HTTPError.unauthorized("Invalid password")
    
    access_token = AuthHandler().create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


    