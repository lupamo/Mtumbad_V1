from pydantic import BaseModel
from typing import List, Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    address: Optional[str]
    contact: Optional[str]
    is_admin: bool
    is_verified: bool

class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]
    address: Optional[str]
    contact: Optional[str]