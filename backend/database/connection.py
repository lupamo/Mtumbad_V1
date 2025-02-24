from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import settings


engine =  create_engine(settings.DATABASE_URL)

session = sessionmaker(bind=engine)


def get_session():
  db = session()
  try:
    yield db
  finally:
    db.close()