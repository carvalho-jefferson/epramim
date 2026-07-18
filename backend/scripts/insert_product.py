import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import (
    Product, DisplaySpecs, HardwareSpecs,
    PhoneSpecs, CameraSpecs, PriceHistory
)

def insert_phone(data: dict):
    db = SessionLocal()
    try:
        product = Product(
            name=data["name"],
            brand=data["brand"],
            model=data.get("model"),
            category="phone",
            slug=data["slug"],
            variant_group_id=data.get("variant_group_id"),
            variant_label=data.get("variant_label"),
            launch_year=data.get("launch_year"),
            os=data.get("os"),
            current_price=data.get("current_price"),
            weight_g=data.get("weight_g"),
            height_mm=data.get("height_mm"),
            width_mm=data.get("width_mm"),
            thickness_mm=data.get("thickness_mm"),
            overall_score=data.get("overall_score"),
            image_url=data.get("image_url"),
        )
        db.add(product)
        db.flush()

        if data.get("display"):
            db.add(DisplaySpecs(product_id=product.id, **data["display"]))

        if data.get("hardware"):
            db.add(HardwareSpecs(product_id=product.id, **data["hardware"]))

        if data.get("phone"):
            db.add(PhoneSpecs(product_id=product.id, **data["phone"]))

        if data.get("camera"):
            db.add(CameraSpecs(product_id=product.id, **data["camera"]))

        if data.get("prices"):
            for price in data["prices"]:
                db.add(PriceHistory(product_id=product.id, **price))

        db.commit()
        print(f"✅ '{product.name}' inserido com sucesso! ID: {product.id}")

    except Exception as e:
        db.rollback()
        print(f"❌ Erro: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    produto = {
        "name": "Samsung Galaxy A55 8GB/256GB",
        "brand": "Samsung",
        "slug": "samsung-galaxy-a55-8gb-256gb",
        "variant_group_id": "samsung-galaxy-a55",
        "variant_label": "8GB/256GB",
        "launch_year": 2024,
        "os": "Android 14",
        "current_price": 1899.90,
        "weight_g": 213,
        "height_mm": 161.10,
        "width_mm": 77.40,
        "thickness_mm": 8.20,
        "image_url": None,

        "display": {
            "screen_size_in": 6.60,
            "screen_type": "Super AMOLED",
            "resolution_width": 1080,
            "resolution_height": 2340,
            "refresh_rate_hz": 120,
            "protection": "Gorilla Glass Victus+",
            "brightness_nits": 1000,
            "ppi": 390,
            "hdr": "HDR10+",
            "aspect_ratio": "19.5:9",
        },

        "hardware": {
            "chipset": "Exynos 1480",
            "cpu": "Octa-core",
            "gpu": "Xclipse 530",
            "ram_gb": 8,
            "storage_gb": 256,
            "battery_mah": 5000,
            "charging_w": 25,
            "charging_wireless_w": None,
            "charging_reverse": False,
        },

        "phone": {
            "sim_slots": 2,
            "has_esim": True,
            "sim_type": "Nano SIM",
            "network_2g": True,
            "network_3g": True,
            "network_4g": True,
            "network_5g": True,
            "wifi": "Wi-Fi 6",
            "bluetooth": "5.3",
            "nfc": True,
            "usb_type": "USB-C",
            "usb_version": "2.0",
            "ip_rating": "IP67",
            "has_memory_card": True,
            "speakers": "Stereo",
            "has_headphone_jack": False,
            "has_fingerprint": True,
        },

        "camera": {
            "main_camera_mp": 50.0,
            "main_camera_aperture": "f/1.8",
            "main_camera_ois": True,
            "camera_features": "PDAF, OIS, HDR10+",
            "ultrawide_mp": 12.0,
            "ultrawide_aperture": "f/2.2",
            "telephoto_mp": None,
            "telephoto_aperture": None,
            "telephoto_zoom": None,
            "video_resolution": "4K @30fps",
            "front_camera_mp": 32.0,
            "front_camera_aperture": "f/2.2",
            "front_video_resolution": "4K @30fps",
        },

        "prices": [
            {
                "store_name": "Amazon",
                "price": 1899.90,
                "product_url": "https://amazon.com.br/galaxy-a55",
            },
        ],
    }

    insert_phone(produto)
