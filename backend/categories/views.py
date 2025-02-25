from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.errors import HTTPError
from .models import Category, Subcategory
from database.connection import get_session
from .schemas import CategoryCreate

category_router = APIRouter(prefix="/categories", tags=["Categories"])

@category_router.get("/")
async def get_categories(session: Session = Depends(get_session)):
    categories = session.query(Category).all()
    return categories

@category_router.get("/{category_id}")
async def get_category(category_id: str, session: Session = Depends(get_session)):
    category = session.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPError.not_found("Category not found")
    return category

@category_router.post("/")
async def create_category(category: CategoryCreate, session: Session = Depends(get_session)):
    if session.query(Category).filter(Category.name == category.name).first():
        raise HTTPError.bad_request("Category already exists")
    new_category = Category(
        name=category.name,
     )
    session.add(new_category)
    session.commit()
    session.refresh(new_category)
    return new_category

@category_router.put("/{category_id}")
async def update_category(category_id: str, category: CategoryCreate, session: Session = Depends(get_session)):
    category = session.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPError.not_found("Category not found")
    category.name = category.name
    session.commit()
    return category

@category_router.delete("/{category_id}")
async def delete_category(category_id: str, session: Session = Depends(get_session)):
    category = session.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPError.not_found("Category not found")
    session.delete(category)
    session.commit()
    return category


@category_router.get("/{category_id}/subcategories")
async def get_subcategories(category_id: str, session: Session = Depends(get_session)):
    category = session.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPError.not_found("Category not found")
    return category.subcategories

@category_router.post("/{category_id}/subcategories")
async def create_subcategory(
    category_id: str,
    subcategory: CategoryCreate,
    session: Session = Depends(get_session)
    ):
    category = session.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPError.not_found("Category not found")
    new_subcategory = Subcategory(
        name=subcategory.name,
        category_id=category_id
    )
    session.add(new_subcategory)
    session.commit()
    session.refresh(new_subcategory)
    return new_subcategory


@category_router.put("/subcategories/{subcategory_id}")
async def update_subcategories(
    subcategory_id: str,
    subcategory: CategoryCreate,
    session: Session = Depends(get_session)
    ):
    subcategory = session.query(Subcategory).filter(Subcategory.id == subcategory_id).first()
    if not subcategory:
        raise HTTPError.not_found("Subcategory not found")
    subcategory.name = subcategory.name
    session.commit()
    session.refresh(subcategory)
    return subcategory

@category_router.delete("/subcategories/{subcategory_id}")
async def delete_subcategories(
    subcategory_id: str,
    session: Session = Depends(get_session)
    ):
    subcategory = session.query(Subcategory).filter(Subcategory.id == subcategory_id).first()
    if not subcategory:
        raise HTTPError.not_found("Subcategory not found")
    session.delete(subcategory)
    session.commit()
    return subcategory  

