from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Product
from ..schemas import ProductSummary, ProductDetail
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(prefix="/products", tags=["products"])
limiter = Limiter(key_func=get_remote_address)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[ProductSummary])
@limiter.limit("30/minute")
def get_products(
    request: Request,
    skip: int = 0,
    limit: int = 20,
    search: str = "",
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if search:
        query = query.filter(
            Product.name.ilike(f"%{search}%") |
            Product.brand.ilike(f"%{search}%")
        )

    return query.offset(skip).limit(limit).all()


@router.get("/slug/{slug}", response_model=ProductDetail)
@limiter.limit("30/minute")
def get_product_by_slug(request: Request, slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug).first()

    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    return product


@router.get("/{product_id}", response_model=ProductDetail)
@limiter.limit("30/minute")
def get_product_by_id(request: Request, product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    return product