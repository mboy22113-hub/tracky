import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    age_range = Column(String, nullable=True, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    preferences = relationship("UserPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    usage_records = relationship("UsageRecord", back_populates="user", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)

    subscription_categories = Column(Text, default="movies,music")
    movie_interests = Column(Text, default="Superhero,Action,Sci-Fi")
    content_priorities = Column(Text, default="New releases")
    music_interests = Column(Text, default="")
    music_use = Column(Text, default="")
    gaming_interests = Column(Text, default="")
    gaming_frequency = Column(String, default="")
    other_interests = Column(Text, default="")
    monthly_budget = Column(Float, default=1000.0)
    optimization_goal = Column(String, default="best_value")
    recommendation_priorities = Column(Text, default="")
    notification_preferences = Column(Text, default='{"renewals":true,"trials":true,"lowUsage":true,"ghostSubscriptions":true,"budget":true,"optimization":true}')
    recommendation_settings = Column(Text, default='{"movies":true,"music":true,"games":true,"others":true}')
    tracker_preferences = Column(Text, default='{"usageTracking":true,"reminders":true,"personalizedRecs":true}')
    transaction_connected = Column(Boolean, default=False)

    user = relationship("User", back_populates="preferences")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # movies, music, games, others
    category_label = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    color = Column(String, default="#2F6FED")
    price = Column(Float, default=0.0)
    free = Column(Boolean, default=False)
    billing_cycle = Column(String, default="monthly")
    next_renewal = Column(String, nullable=True)
    renews_in = Column(String, nullable=True) # e.g. "3 days"
    autopay = Column(String, default="Unknown") # "Enabled", "Disabled", "Unknown", "Not applicable"
    free_trial = Column(Boolean, default=False)
    trial_days_left = Column(Integer, nullable=True)
    app_installed = Column(Boolean, default=True)
    value_score = Column(String, default="7.0/10")
    redundancy = Column(String, default="Low")
    pause_supported = Column(Boolean, default=False)
    status = Column(String, default="active") # high, active, moderate, low
    status_label = Column(String, default="Active")
    recommendation = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="subscriptions")
    usage_records = relationship("UsageRecord", back_populates="subscription", cascade="all, delete-orphan")


class UsageRecord(Base):
    __tablename__ = "usage_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subscription_id = Column(String, ForeignKey("subscriptions.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    date = Column(String, nullable=False) # YYYY-MM-DD
    used = Column(Boolean, default=True)
    duration_minutes = Column(Integer, default=0)

    user = relationship("User", back_populates="usage_records")
    subscription = relationship("Subscription", back_populates="usage_records")


class UpcomingContent(Base):
    __tablename__ = "upcoming_content"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    type = Column(String, default="Movie") # Movie, Series
    poster_url = Column(String, nullable=True)
    release_date = Column(String, default="")
    platform = Column(String, nullable=False) # primevideo, netflix, jiohotstar, appletv, disney
    platform_name = Column(String, nullable=False)
    genre = Column(String, default="")
    trailer_url = Column(String, default="")
    tags = Column(Text, default="") # comma-separated
    emoji = Column(String, default="🎬")
    availability = Column(String, default="Coming next month")


class Wishlist(Base):
    __tablename__ = "wishlist"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    content_id = Column(String, ForeignKey("upcoming_content.id"), nullable=False)
    title = Column(String, nullable=False)
    poster_url = Column(String, nullable=True)
    platform = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="wishlists")


class ServiceComparison(Base):
    __tablename__ = "service_comparisons"

    id = Column(String, primary_key=True, index=True)
    service_a = Column(String, nullable=False)
    service_b = Column(String, nullable=False)
    category = Column(String, nullable=False)
    data_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
