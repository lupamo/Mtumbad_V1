from pydantic import BaseModel

class CheckoutProduct(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    location: str
    street: str