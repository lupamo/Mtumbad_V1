import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from typing import Optional
from pydantic import BaseModel
from fastapi.security import HTTPBearer
from utils.errors import HTTPError
from fastapi import Depends
import settings
from users.models import User
from database.connection import session
from sqlalchemy.orm import Session



security = HTTPBearer()

class AuthHandler:
    def __init__(self):
        self.jwt_secret = settings.JWT_SECRET
        self.algorithm = settings.ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.jwt_secret, algorithm=self.algorithm)
        return encoded_jwt
        
    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPError.unauthorized("Token has expired")
        except jwt.InvalidTokenError:
            raise HTTPError.unauthorized("Invalid token")
        except Exception:
            raise HTTPError.unauthorized("Invalid token")
      
    def get_password_hash(self, password):
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def get_user(self, token: str = Depends(security)):
        credentials = self.verify_token(token)
        return credentials
    
    def get_current_user(self, session: Session, token: str = Depends(security)):
        credentials = self.verify_token(token)
        email = credentials.get("sub")
        user = session.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPError.unauthorized("User not found")
        return user

    
    def authenticate_user(self, email: str, password: str):
        user = session.query(User).filter(User.email == email).first()
        if not user:
            return False
        if not self.verify_password(password, user.password):
            return False
        return user