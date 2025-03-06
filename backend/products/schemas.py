from pydantic import BaseModel
from typing import List, Optional, Union

class ProductSizeCreate(BaseModel):
    size: Union[str, int]
    stock: int

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category_id: str
    subcategory_id: str
    sizes: List[ProductSizeCreate]
