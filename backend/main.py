from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine
import settings
from utils import supabase_config
from database.connection import Base
from products.views import product_router
from categories.views import category_router


app = FastAPI()

app.include_router(product_router)
app.include_router(category_router)

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
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)