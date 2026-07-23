from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session
from sqlalchemy import text
import os
from ..database import SessionLocal
from ..models import (
    Product, DisplaySpecs, HardwareSpecs,
    PhoneSpecs, CameraSpecs, PriceHistory
)

router = APIRouter(prefix="/admin", tags=["admin"])

limiter = Limiter(key_func=get_remote_address)

templates = Jinja2Templates(
    directory=os.path.join(os.path.dirname(__file__), "templates")
)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
SESSION_TOKEN = "admin_logged_in"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def is_authenticated(request: Request) -> bool:
    return request.cookies.get(SESSION_TOKEN) == "true"


# ── Login ─────────────────────────────────────────────

@router.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    if is_authenticated(request):
        return RedirectResponse("/admin", status_code=302)
    return templates.TemplateResponse(request=request, name="login.html", context={})


@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request):
    form = await request.form()
    password = form.get("password", "")
    if password == ADMIN_PASSWORD:
        response = RedirectResponse("/admin", status_code=302)
        response.set_cookie(SESSION_TOKEN, "true", httponly=True, max_age=86400)
        return response
    return templates.TemplateResponse(request=request, name="login.html", context={"error": "Incorrect password."})


@router.get("/logout")
def logout():
    response = RedirectResponse("/admin/login", status_code=302)
    response.delete_cookie(SESSION_TOKEN)
    return response


# ── Dashboard ──────────────────────────────────────────

@router.get("/", response_class=HTMLResponse)
def dashboard(request: Request, db: Session = Depends(get_db)):
    if not is_authenticated(request):
        return RedirectResponse("/admin/login", status_code=302)
    products = db.query(Product).order_by(Product.created_at.desc()).all()
    message = request.query_params.get("message")
    return templates.TemplateResponse(request=request, name="dashboard.html", context={"products": products, "message": message})


# ── New product ────────────────────────────────────────

@router.get("/product/new", response_class=HTMLResponse)
def new_product_page(request: Request):
    if not is_authenticated(request):
        return RedirectResponse("/admin/login", status_code=302)
    return templates.TemplateResponse(request=request, name="product_form.html", context={})


@router.post("/product/new")
async def create_product(request: Request, db: Session = Depends(get_db)):
    if not is_authenticated(request):
        return RedirectResponse("/admin/login", status_code=302)

    form = await request.form()

    def val(key): v = form.get(key, "").strip(); return v if v else None
    def num(key): v = val(key); return float(v) if v else None
    def integer(key): v = val(key); return int(v) if v else None
    def boolean(key): return key in form

    try:
        product = Product(
            name=form["name"],
            brand=form["brand"],
            model=val("model"),
            category=form.get("category", "phone"),
            slug=form["slug"],
            variant_group_id=val("variant_group_id"),
            variant_label=val("variant_label"),
            launch_year=integer("launch_year"),
            os=val("os"),
            current_price=num("current_price"),
            weight_g=integer("weight_g"),
            height_mm=num("height_mm"),
            width_mm=num("width_mm"),
            thickness_mm=num("thickness_mm"),
            overall_score=num("overall_score"),
            image_url=val("image_url"),
        )
        db.add(product)
        db.flush()

        db.add(DisplaySpecs(
            product_id=product.id,
            screen_size_in=num("screen_size_in"),
            screen_type=val("screen_type"),
            resolution_width=integer("resolution_width"),
            resolution_height=integer("resolution_height"),
            refresh_rate_hz=integer("refresh_rate_hz"),
            protection=val("protection"),
            brightness_nits=integer("brightness_nits"),
            ppi=integer("ppi"),
            hdr=val("hdr"),
            aspect_ratio=val("aspect_ratio"),
        ))

        db.add(HardwareSpecs(
            product_id=product.id,
            chipset=val("chipset"),
            cpu=val("cpu"),
            gpu=val("gpu"),
            ram_gb=integer("ram_gb"),
            storage_gb=integer("storage_gb"),
            battery_mah=integer("battery_mah"),
            charging_w=integer("charging_w"),
            charging_wireless_w=integer("charging_wireless_w"),
            charging_reverse=boolean("charging_reverse"),
        ))

        db.add(PhoneSpecs(
            product_id=product.id,
            sim_slots=integer("sim_slots"),
            has_esim=boolean("has_esim"),
            sim_type=val("sim_type"),
            network_2g=boolean("network_2g"),
            network_3g=boolean("network_3g"),
            network_4g=boolean("network_4g"),
            network_5g=boolean("network_5g"),
            wifi=val("wifi"),
            bluetooth=val("bluetooth"),
            nfc=boolean("nfc"),
            usb_type=val("usb_type"),
            usb_version=val("usb_version"),
            ip_rating=val("ip_rating"),
            has_memory_card=boolean("has_memory_card"),
            speakers=val("speakers"),
            has_headphone_jack=boolean("has_headphone_jack"),
            has_fingerprint=boolean("has_fingerprint"),
        ))

        db.add(CameraSpecs(
            product_id=product.id,
            main_camera_mp=num("main_camera_mp"),
            main_camera_aperture=val("main_camera_aperture"),
            main_camera_ois=boolean("main_camera_ois"),
            camera_features=val("camera_features"),
            ultrawide_mp=num("ultrawide_mp"),
            ultrawide_aperture=val("ultrawide_aperture"),
            telephoto_mp=num("telephoto_mp"),
            telephoto_aperture=val("telephoto_aperture"),
            telephoto_zoom=val("telephoto_zoom"),
            video_resolution=val("video_resolution"),
            front_camera_mp=num("front_camera_mp"),
            front_camera_aperture=val("front_camera_aperture"),
            front_video_resolution=val("front_video_resolution"),
        ))

        store_names = form.getlist("store_name[]")
        prices = form.getlist("price[]")
        product_urls = form.getlist("product_url[]")

        for i, store in enumerate(store_names):
            if store.strip() and i < len(prices) and prices[i].strip():
                db.add(PriceHistory(
                    product_id=product.id,
                    store_name=store.strip(),
                    price=float(prices[i]),
                    product_url=product_urls[i].strip() if i < len(product_urls) else None,
                ))

        db.commit()
        return RedirectResponse(f"/admin?message=Product '{product.name}' created successfully!", status_code=302)

    except Exception as e:
        db.rollback()
        return templates.TemplateResponse(request=request, name="product_form.html", context={"error": f"Error: {str(e)}"})


# ── Edit product ───────────────────────────────────────

@router.get("/product/{product_id}/edit", response_class=HTMLResponse)
def edit_product_page(product_id: int, request: Request, db: Session = Depends(get_db)):
    if not is_authenticated(request):
        return RedirectResponse("/admin/login", status_code=302)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return RedirectResponse("/admin", status_code=302)
    return templates.TemplateResponse(request=request, name="product_form.html", context={"product": product})


@router.post("/product/{product_id}/edit")
async def update_product(product_id: int, request: Request, db: Session = Depends(get_db)):
    if not is_authenticated(request):
        return RedirectResponse("/admin/login", status_code=302)

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return RedirectResponse("/admin", status_code=302)

    form = await request.form()

    def val(key): v = form.get(key, "").strip(); return v if v else None
    def num(key): v = val(key); return float(v) if v else None
    def integer(key): v = val(key); return int(v) if v else None
    def boolean(key): return key in form

    try:
        product.name = form["name"]
        product.brand = form["brand"]
        product.model = val("model")
        product.category = form.get("category", "phone")
        product.slug = form["slug"]
        product.variant_group_id = val("variant_group_id")
        product.variant_label = val("variant_label")
        product.launch_year = integer("launch_year")
        product.os = val("os")
        product.current_price = num("current_price")
        product.weight_g = integer("weight_g")
        product.height_mm = num("height_mm")
        product.width_mm = num("width_mm")
        product.thickness_mm = num("thickness_mm")
        product.overall_score = num("overall_score")
        product.image_url = val("image_url")

        d = product.display_specs or DisplaySpecs(product_id=product.id)
        if not product.display_specs:
            db.add(d)
        d.screen_size_in = num("screen_size_in")
        d.screen_type = val("screen_type")
        d.resolution_width = integer("resolution_width")
        d.resolution_height = integer("resolution_height")
        d.refresh_rate_hz = integer("refresh_rate_hz")
        d.protection = val("protection")
        d.brightness_nits = integer("brightness_nits")
        d.ppi = integer("ppi")
        d.hdr = val("hdr")
        d.aspect_ratio = val("aspect_ratio")

        h = product.hardware_specs or HardwareSpecs(product_id=product.id)
        if not product.hardware_specs:
            db.add(h)
        h.chipset = val("chipset")
        h.cpu = val("cpu")
        h.gpu = val("gpu")
        h.ram_gb = integer("ram_gb")
        h.storage_gb = integer("storage_gb")
        h.battery_mah = integer("battery_mah")
        h.charging_w = integer("charging_w")
        h.charging_wireless_w = integer("charging_wireless_w")
        h.charging_reverse = boolean("charging_reverse")

        p = product.phone_specs or PhoneSpecs(product_id=product.id)
        if not product.phone_specs:
            db.add(p)
        p.sim_slots = integer("sim_slots")
        p.has_esim = boolean("has_esim")
        p.sim_type = val("sim_type")
        p.network_2g = boolean("network_2g")
        p.network_3g = boolean("network_3g")
        p.network_4g = boolean("network_4g")
        p.network_5g = boolean("network_5g")
        p.wifi = val("wifi")
        p.bluetooth = val("bluetooth")
        p.nfc = boolean("nfc")
        p.usb_type = val("usb_type")
        p.usb_version = val("usb_version")
        p.ip_rating = val("ip_rating")
        p.has_memory_card = boolean("has_memory_card")
        p.speakers = val("speakers")
        p.has_headphone_jack = boolean("has_headphone_jack")
        p.has_fingerprint = boolean("has_fingerprint")

        c = product.camera_specs or CameraSpecs(product_id=product.id)
        if not product.camera_specs:
            db.add(c)
        c.main_camera_mp = num("main_camera_mp")
        c.main_camera_aperture = val("main_camera_aperture")
        c.main_camera_ois = boolean("main_camera_ois")
        c.camera_features = val("camera_features")
        c.ultrawide_mp = num("ultrawide_mp")
        c.ultrawide_aperture = val("ultrawide_aperture")
        c.telephoto_mp = num("telephoto_mp")
        c.telephoto_aperture = val("telephoto_aperture")
        c.telephoto_zoom = val("telephoto_zoom")
        c.video_resolution = val("video_resolution")
        c.front_camera_mp = num("front_camera_mp")
        c.front_camera_aperture = val("front_camera_aperture")
        c.front_video_resolution = val("front_video_resolution")

        db.query(PriceHistory).filter(PriceHistory.product_id == product.id).delete()

        store_names = form.getlist("store_name[]")
        prices = form.getlist("price[]")
        product_urls = form.getlist("product_url[]")

        for i, store in enumerate(store_names):
            if store.strip() and i < len(prices) and prices[i].strip():
                db.add(PriceHistory(
                    product_id=product.id,
                    store_name=store.strip(),
                    price=float(prices[i]),
                    product_url=product_urls[i].strip() if i < len(product_urls) else None,
                ))

        db.commit()
        return RedirectResponse(f"/admin?message=Product '{product.name}' updated successfully!", status_code=302)

    except Exception as e:
        db.rollback()
        return templates.TemplateResponse(request=request, name="product_form.html", context={"product": product, "error": f"Error: {str(e)}"})


# ── Delete product ─────────────────────────────────────

@router.post("/product/{product_id}/delete")
async def delete_product(product_id: int, request: Request, db: Session = Depends(get_db)):
    if not is_authenticated(request):
        return RedirectResponse("/admin/login", status_code=302)
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        name = product.name
        db.delete(product)
        db.commit()
        return RedirectResponse(f"/admin?message=Product '{name}' deleted successfully.", status_code=302)
    return RedirectResponse("/admin", status_code=302)