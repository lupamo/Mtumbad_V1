from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CartCreate(BaseModel):
    product_id: str
    quantity: int
