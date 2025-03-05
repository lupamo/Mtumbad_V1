from fastapi import FastAPI, Depends, APIRouter, Response, Request
from starlette.responses import JSONResponse
from database.connection import get_session
from users.models import User
from sqlalchemy.orm import Session
from typing import List
from utils.errors import HTTPError
from .auth import AuthHandler
from .models import RefreshToken
from .schemas import UserLogin


auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/login")
async def login(request: UserLogin, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPError.not_found("User not found")
    
    if not AuthHandler().verify_password(request.password, user.hashed_password):
        raise HTTPError.unauthorized("Invalid password")
    
    access_token = AuthHandler().create_access_token({"sub": user.email, "is_admin": user.is_admin})
    refresh_token = AuthHandler().create_refresh_token({"sub": user.email, "is_admin": user.is_admin})
    
    session.add(RefreshToken(user_id=user.id, token=refresh_token))
    session.commit()

    response = JSONResponse(content={"access_token": access_token, "token_type": "bearer"})
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)
    return response


@auth_router.post("/refresh")
async def refresh_token(response: Response, request: Request, session: Session = Depends(get_session)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPError.bad_request("No refresh token provided")
    
    token = session.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    if not token:
        raise HTTPError.unauthorized("Invalid refresh token")
    
    user = session.query(User).filter(User.id == token.user_id).first()
    if not user:
        raise HTTPError.unauthorized("User not found")
    
    new_access_token = AuthHandler().create_access_token({"sub": user.email, "is_admin": user.is_admin})
    new_refresh_token = AuthHandler().create_refresh_token({"sub": user.email, "is_admin": user.is_admin})

    token.token = new_refresh_token
    session.commit()

    response = JSONResponse(content={"access_token": new_access_token, "token_type": "bearer"})
    response.set_cookie(key="refresh_token", value=new_refresh_token, httponly=True)
    return response

@auth_router.post("/logout")
async def logout(response: Response, request: Request, session: Session = Depends(get_session)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPError.bad_request("No refresh token provided")
    
    session.query(RefreshToken).filter(RefreshToken.token == refresh_token).delete()
    session.commit()
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}
    


    