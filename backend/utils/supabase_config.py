from supabase import create_client
import settings

try:
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_API_KEY)
    print("Supabase connected")
except Exception as e:
    print("Supabase connection failed")