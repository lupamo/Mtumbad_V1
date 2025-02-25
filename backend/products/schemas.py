from pydantic import BaseModel
from typing import List, Optional

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    image_urls: Optional[List[str]]
    category_id: str
    subcategory_id: str
    sizes: str