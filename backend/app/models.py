from sqlalchemy import DECIMAL, Column, Integer, String, Float, ForeignKey, Text, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    brand = Column(String(100), nullable=False)
    model = Column(String(100))
    category = Column(String(50), nullable=False, default='phone')
    launch_year = Column(Integer)
    os = Column(String(100))
    current_price = Column(DECIMAL(10, 2))
    weight_g = Column(Integer)
    height_mm = Column(DECIMAL(6, 2))
    width_mm = Column(DECIMAL(6, 2))
    thickness_mm = Column(DECIMAL(6, 2))
    overall_score = Column(DECIMAL(3, 1))
    image_url = Column(Text)
    slug = Column(String(255), unique=True)
    variant_group_id = Column(String(64))
    variant_label = Column(String(64))
    created_at = Column(TIMESTAMP, server_default=func.now())

    display_specs = relationship("DisplaySpecs", back_populates="product", uselist=False)
    hardware_specs = relationship("HardwareSpecs", back_populates="product", uselist=False)
    phone_specs = relationship("PhoneSpecs", back_populates="product", uselist=False)
    camera_specs = relationship("CameraSpecs", back_populates="product", uselist=False)
    price_history = relationship("PriceHistory", back_populates="product")


class DisplaySpecs(Base):
    __tablename__ = "display_specs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False)
    screen_size_in = Column(DECIMAL(4, 2))
    screen_type = Column(String(100))
    resolution_width = Column(Integer)
    resolution_height = Column(Integer)
    refresh_rate_hz = Column(Integer)
    protection = Column(String(100))
    brightness_nits = Column(Integer)
    ppi = Column(Integer)
    hdr = Column(String(100))
    aspect_ratio = Column(String(20))

    product = relationship("Product", back_populates="display_specs")


class HardwareSpecs(Base):
    __tablename__ = "hardware_specs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False)
    chipset = Column(String(100))
    cpu = Column(String(150))
    gpu = Column(String(100))
    ram_gb = Column(Integer)
    storage_gb = Column(Integer)
    battery_mah = Column(Integer)
    charging_w = Column(Integer)
    charging_wireless_w = Column(Integer)
    charging_reverse = Column(Boolean, default=False)

    product = relationship("Product", back_populates="hardware_specs")


class PhoneSpecs(Base):
    __tablename__ = "phone_specs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False)
    sim_slots = Column(Integer)
    has_esim = Column(Boolean, default=False)
    sim_type = Column(String(50))
    network_2g = Column(Boolean, default=False)
    network_3g = Column(Boolean, default=False)
    network_4g = Column(Boolean, default=False)
    network_5g = Column(Boolean, default=False)
    wifi = Column(String(100))
    bluetooth = Column(String(50))
    nfc = Column(Boolean, default=False)
    usb_type = Column(String(50))
    usb_version = Column(String(20))
    ip_rating = Column(String(20))
    has_memory_card = Column(Boolean, default=False)
    speakers = Column(String(100))
    has_headphone_jack = Column(Boolean, default=False)
    has_fingerprint = Column(Boolean, default=False)

    product = relationship("Product", back_populates="phone_specs")


class CameraSpecs(Base):
    __tablename__ = "camera_specs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), unique=True, nullable=False)
    main_camera_mp = Column(DECIMAL(5, 1))
    main_camera_aperture = Column(String(20))
    main_camera_ois = Column(Boolean, default=False)
    camera_features = Column(Text)
    ultrawide_mp = Column(DECIMAL(5, 1))
    ultrawide_aperture = Column(String(20))
    telephoto_mp = Column(DECIMAL(5, 1))
    telephoto_aperture = Column(String(20))
    telephoto_zoom = Column(String(20))
    video_resolution = Column(String(50))
    front_camera_mp = Column(DECIMAL(5, 1))
    front_camera_aperture = Column(String(20))
    front_video_resolution = Column(String(50))

    product = relationship("Product", back_populates="camera_specs")


class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    store_name = Column(String)
    price = Column(DECIMAL(10, 2), nullable=False)
    product_url = Column(Text)
    collected_at = Column(TIMESTAMP, server_default=func.now())

    product = relationship("Product", back_populates="price_history")