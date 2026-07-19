from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
from dotenv import load_dotenv
from .routers import products, compare
from .admin.router import router as admin_router

load_dotenv()

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Product Compare API",
    docs_url="/docs" if os.getenv("ENVIRONMENT") == "development" else None,
    redoc_url=None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(compare.router)
app.include_router(admin_router)
# app.include_router(recommend.router)


@app.get("/")
@limiter.limit("30/minute")
def root(request: Request):
    return {"message": "API is running"}