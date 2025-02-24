from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine
import settings


try:
  engine.connect()
  print("Database connected")
except Exception as e:
  print("Database connection failed")
  print(e)