from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime


class DisplaySpecsOut(BaseModel):
    screen_size_in: Decimal | None = None
    screen_type: str | None = None
    resolution_width: int | None = None
    resolution_height: int | None = None
    refresh_rate_hz: int | None = None
    protection: str | None = None
    brightness_nits: int | None = None
    ppi: int | None = None
    hdr: str | None = None
    aspect_ratio: str | None = None

    class Config:
        from_attributes = True


class HardwareSpecsOut(BaseModel):
    chipset: str | None = None
    cpu: str | None = None
    gpu: str | None = None
    ram_gb: int | None = None
    storage_gb: int | None = None
    battery_mah: int | None = None
    charging_w: int | None = None
    charging_wireless_w: int | None = None
    charging_reverse: bool | None = None

    class Config:
        from_attributes = True


class PhoneSpecsOut(BaseModel):
    sim_slots: int | None = None
    has_esim: bool | None = None
    sim_type: str | None = None
    network_2g: bool | None = None
    network_3g: bool | None = None
    network_4g: bool | None = None
    network_5g: bool | None = None
    wifi: str | None = None
    bluetooth: str | None = None
    nfc: bool | None = None
    usb_type: str | None = None
    usb_version: str | None = None
    ip_rating: str | None = None
    has_memory_card: bool | None = None
    speakers: str | None = None
    has_headphone_jack: bool | None = None
    has_fingerprint: bool | None = None

    class Config:
        from_attributes = True


class CameraSpecsOut(BaseModel):
    main_camera_mp: Decimal | None = None
    main_camera_aperture: str | None = None
    main_camera_ois: bool | None = None
    camera_features: str | None = None
    ultrawide_mp: Decimal | None = None
    ultrawide_aperture: str | None = None
    telephoto_mp: Decimal | None = None
    telephoto_aperture: str | None = None
    telephoto_zoom: str | None = None
    video_resolution: str | None = None
    front_camera_mp: Decimal | None = None
    front_camera_aperture: str | None = None
    front_video_resolution: str | None = None

    class Config:
        from_attributes = True


class PriceHistoryOut(BaseModel):
    store_name: str | None = None
    price: Decimal
    product_url: str | None = None
    collected_at: datetime | None = None

    class Config:
        from_attributes = True


class ProductSummary(BaseModel):
    id: int
    name: str
    brand: str
    category: str
    current_price: Decimal | None = None
    image_url: str | None = None
    slug: str | None = None
    variant_group_id: str | None = None
    variant_label: str | None = None

    class Config:
        from_attributes = True


class ProductDetail(ProductSummary):
    model: str | None = None
    launch_year: int | None = None
    os: str | None = None
    weight_g: int | None = None
    height_mm: Decimal | None = None
    width_mm: Decimal | None = None
    thickness_mm: Decimal | None = None
    overall_score: Decimal | None = None
    display_specs: DisplaySpecsOut | None = None
    hardware_specs: HardwareSpecsOut | None = None
    phone_specs: PhoneSpecsOut | None = None
    camera_specs: CameraSpecsOut | None = None
    price_history: list[PriceHistoryOut] = []

    class Config:
        from_attributes = True


class CompareResponse(BaseModel):
    product_a: ProductDetail
    product_b: ProductDetail