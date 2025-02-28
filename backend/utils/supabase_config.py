from supabase import create_client
import settings

try:
    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_API_KEY)
    print("Supabase connected")
except Exception as e:
    print("Supabase connection failed")


# supabase storage
try:
    supabase.create_storage_bucket("product_images")
    print("Storage bucket created")
except:
    print("Bucket already exists")

