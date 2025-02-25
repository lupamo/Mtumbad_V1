from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import settings
from sqlalchemy.ext.declarative import declarative_base


engine =  create_engine(settings.DATABASE_URL)

session = sessionmaker(bind=engine)

Base = declarative_base()

def get_session():
  db = session()
  try:
    yield db
  finally:
    db.close()