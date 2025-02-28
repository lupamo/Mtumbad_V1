from fastapi import APIRouter, Depends, File, UploadFile, BackgroundTasks
from sqlalchemy.orm import Session
from utils.errors import HTTPError
from .models import Product, ProductSize, ProductImage
from database.connection import get_session
from .schemas import ProductCreate
from typing import List
from utils.supabase_config import supabase
import settings


product_router = APIRouter(prefix="/products", tags=["Products"])

@product_router.get("/")
async def get_products(session: Session = Depends(get_session)):
    products = session.query(Product).all()
    for product in products:
        product.sizes = session.query(ProductSize).filter(ProductSize.product_id == product.id).all()
        product.image_urls = [image.image_url for image in session.query(ProductImage).
                              filter(ProductImage.product_id == product.id).all()]
    return products


@product_router.get("/{product_id}")
async def get_product(product_id: str, session: Session = Depends(get_session)):
    product = session.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPError.not_found("Product not found")
    product.sizes = session.query(ProductSize).filter(ProductSize.product_id == product_id).all()
    product.image_urls = [image.image_url for image in session.query(ProductImage).
                          filter(ProductImage.product_id == product_id).all()]
    return product

@product_router.post("/")
async def create_product(product: ProductCreate, session: Session = Depends(get_session)):
    """ add product to database
    """
    existing_product = session.query(Product).filter(Product.name == product.name).first()
    if existing_product:
        # If the product exists, add the new size instead of creating a new product
        for size in product.sizes:
            existing_size = session.query(ProductSize).filter(
                ProductSize.product_id == existing_product.id, ProductSize.size == str(size.size)
            ).first()

            if existing_size:
                existing_size.stock += size.stock  # Increase stock for existing size
            else:
                new_size = ProductSize(product_id=existing_product.id, size=str(size.size), stock=size.stock)
                session.add(new_size)

        session.commit()
        return {"message": "Product updated with new sizes", "product": existing_product}
        
    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        image_urls=product.image_urls,
        category_id=product.category_id,
        subcategory_id=product.subcategory_id
    )
    session.add(new_product)
    session.commit()

     # Add sizes to the newly created product
    for size in product.sizes:
        new_size = ProductSize(product_id=new_product.id, size=str(size.size), stock=size.stock)
        session.add(new_size)

    session.commit()
    session.refresh(new_product)
    return new_product

@product_router.post('/{product_id}/images')
async def add_product_images(
    product_id: str,
    files: List[UploadFile] = File(...), 
    session: Session = Depends(get_session)
):
    # Check if product exists
    product = session.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPError.not_found("product not found")

    uploaded_images = []

    try:
        for file in files:
            file_content = file.file.read()
            file_path = file.filename
            content_type = file.content_type

            # print(f"file_path= {file_path}, file_content= {file_content}, content_type= {content_type}")

            if file.content_type not in settings.ALLOWED_MIME_TYPES:
                raise HTTPError.bad_request("Invalid file type")

            # Upload image to Supabase storage
            response = supabase.storage.from_("product_images").upload(
                path=file_path,
                file=file_content,
                file_options={"content-type": content_type}
                )


            # Construct public URL (Supabase needs explicit fetching)
            file_url = supabase.storage.from_("product_images").get_public_url(file_path)

            # Save to database
            product_image = ProductImage(product_id=product_id, image_url=file_url)
            session.add(product_image)
            uploaded_images.append({"filename": file.filename, "url": file_url})
    except Exception as e:
        print(f"Error uploading image {e}")
            
    session.commit()

    return {"message": "Images uploaded successfully", "images": uploaded_images}


@product_router.put("/{product_id}")
async def update_product(product_id: str, product: ProductCreate, session: Session = Depends(get_session)):
    existing_product = session.query(Product).filter(Product.id == product_id).first()
    if not existing_product:
        raise HTTPError.not_found("Product not found")
    existing_product.name = product.name
    existing_product.description = product.description
    existing_product.price = product.price
    existing_product.image_urls = product.image_urls
    existing_product.category_id = product.category_id
    existing_product.subcategory_id = product.subcategory_id
    
    # Update or add sizes
    for size in product.sizes:
        existing_size = session.query(ProductSize).filter(
            ProductSize.product_id == product_id, ProductSize.size == str(size.size)
        ).first()

        if existing_size:
            existing_size.stock = size.stock  # Update stock
        else:
            new_size = ProductSize(product_id=product_id, size=str(size.size), stock=size.stock)
            session.add(new_size)
    session.commit()
    session.refresh(product)
    return product