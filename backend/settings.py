from dotenv import load_dotenv
import os

load_dotenv()


DATABASE_URL = os.getenv('DATABASE_URL')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_API_KEY = os.getenv('SUPABASE_API_KEY')

# jwt config
JWT_SECRET = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('JWT_ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('JWT_EXPIRES_IN'))

# safaricom b2c config
CONSUMER_KEY = os.getenv('SAFARICOM_CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('SAFARICOM_CONSUMER_SECRET')
DARAJA_PASSKEY = os.getenv('SAFARICOM_PASSKEY')