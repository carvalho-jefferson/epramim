from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Product
from ..schemas import CompareResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(prefix="/compare", tags=["compare"])
limiter = Limiter(key_func=get_remote_address)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{slug_a}/vs/{slug_b}", response_model=CompareResponse)
@limiter.limit("20/minute")
def compare_products(
    request: Request,
    slug_a: str,
    slug_b: str,
    db: Session = Depends(get_db)
):
    if slug_a == slug_b:
        raise HTTPException(status_code=400, detail="Os dois produtos precisam ser diferentes")

    product_a = db.query(Product).filter(Product.slug == slug_a).first()
    product_b = db.query(Product).filter(Product.slug == slug_b).first()

    if not product_a:
        raise HTTPException(status_code=404, detail=f"Produto '{slug_a}' não encontrado")
    if not product_b:
        raise HTTPException(status_code=404, detail=f"Produto '{slug_b}' não encontrado")

    return {"product_a": product_a, "product_b": product_b}