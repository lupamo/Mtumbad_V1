from pydantic import BaseModel

class CheckoutProduct(BaseModel):
    phone_number: str
    location: str
    street: str