from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine
import settings
from utils import supabase_config
from database.connection import Base
from products.views import product_router
from categories.views import category_router
from cart.views import cart_router
from users.views import users_router
from auth.views import auth_router
from orders.views import order_router
# from utils.daraja import daraja


app = FastAPI()

# Add this CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(product_router)
app.include_router(category_router)
app.include_router(cart_router)
app.include_router(order_router)

try:
  engine.connect()
  print("Database connected")
except Exception as e:
  print("Database connection failed")
  print(e)

@app.get("/")
async def root():
    return {"message": "Hello World"}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="localhost", port=8001, reload=True)