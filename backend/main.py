import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .models import User, UserPreferences, Subscription, UsageRecord, UpcomingContent
from .routers import (
    users, subscriptions, insights, optimizer,
    recommendations, movies, wishlist, comparisons, assistant
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Trackey API",
    description="Subscription Intelligence Platform Backend",
    version="1.0.0"
)

# CORS middleware for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(subscriptions.router)
app.include_router(insights.router)
app.include_router(optimizer.router)
app.include_router(recommendations.router)
app.include_router(movies.router)
app.include_router(wishlist.router)
app.include_router(comparisons.router)
app.include_router(assistant.router)

INITIAL_SUBSCRIPTIONS = [
    {
        "id": "netflix", "name": "Netflix", "category": "movies", "category_label": "Movies · OTT streaming",
        "icon": "N", "color": "#1F1F1F", "price": 199.0, "free": False, "used_days": 2, "last_used": "18 days ago",
        "renews_in": "3 days", "status": "low", "status_label": "Low usage", "autopay": "Enabled",
        "next_renewal": "5 Sep", "value_score": "5.8/10", "redundancy": "Medium", "pause_supported": False,
        "recommendation": "Your recent usage is low. Consider reviewing this subscription before the upcoming renewal."
    },
    {
        "id": "primevideo", "name": "Prime Video", "category": "movies", "category_label": "Movies · OTT streaming",
        "icon": "P", "color": "#2F6FED", "price": 299.0, "free": False, "used_days": 12, "last_used": "2 days ago",
        "renews_in": "18 days", "status": "active", "status_label": "Active", "autopay": "Enabled",
        "next_renewal": "20 Sep", "value_score": "7.4/10", "redundancy": "Low", "pause_supported": False,
        "recommendation": "Usage is steady and consistent. This subscription is delivering good value — no action needed."
    },
    {
        "id": "jiohotstar", "name": "JioHotstar", "category": "movies", "category_label": "Movies · OTT streaming",
        "icon": "J", "color": "#5A3FD6", "price": 149.0, "free": False, "used_days": 6, "last_used": "5 days ago",
        "renews_in": "9 days", "status": "moderate", "status_label": "Moderate usage", "autopay": "Enabled",
        "next_renewal": "11 Sep", "value_score": "6.1/10", "redundancy": "High — overlaps with Netflix", "pause_supported": True,
        "recommendation": "You already have another movie service with similar content. Review whether you need both."
    },
    {
        "id": "spotify", "name": "Spotify", "category": "music", "category_label": "Music · Streaming",
        "icon": "S", "color": "#2FAE6B", "price": 119.0, "free": False, "used_days": 26, "last_used": "today",
        "renews_in": "11 days", "status": "high", "status_label": "High usage", "autopay": "Enabled",
        "next_renewal": "13 Sep", "value_score": "9.1/10", "redundancy": "Low", "pause_supported": False,
        "recommendation": "This is one of your most-used subscriptions. Excellent value for the price — keep it."
    },
    {
        "id": "applemusic", "name": "Apple Music", "category": "music", "category_label": "Music · Streaming",
        "icon": "A", "color": "#D1425A", "price": 99.0, "free": False, "used_days": 18, "last_used": "yesterday",
        "renews_in": "7 days", "status": "active", "status_label": "Active", "autopay": "Enabled",
        "next_renewal": "9 Sep", "value_score": "7.0/10", "redundancy": "Medium — overlaps with Spotify", "pause_supported": True,
        "recommendation": "You use this regularly, but it overlaps with Spotify. Worth checking if you need both."
    },
    {
        "id": "xboxgamepass", "name": "Xbox Game Pass", "category": "games", "category_label": "Games · Subscription",
        "icon": "X", "color": "#8A4BD6", "price": 489.0, "free": False, "used_days": 18, "last_used": "yesterday",
        "renews_in": "24 days", "status": "active", "status_label": "Active", "autopay": "Enabled",
        "next_renewal": "26 Sep", "value_score": "7.8/10", "redundancy": "Low", "pause_supported": True,
        "recommendation": "Consistent usage across the month. This subscription is being used well."
    },
    {
        "id": "bgmi", "name": "BGMI", "category": "games", "category_label": "Games · App",
        "icon": "B", "color": "#E08A2C", "price": 0.0, "free": True, "used_days": 14, "last_used": "today",
        "renews_in": None, "status": "high", "status_label": "Active", "autopay": "Not applicable",
        "next_renewal": "Not applicable", "value_score": "—", "redundancy": "—", "pause_supported": False,
        "recommendation": "This is a free app with no subscription cost — nothing to optimize here."
    },
    {
        "id": "googleone", "name": "Google One", "category": "others", "category_label": "Others · Cloud storage",
        "icon": "G", "color": "#2F6FED", "price": 130.0, "free": False, "used_days": 25, "last_used": "today",
        "renews_in": "14 days", "status": "high", "status_label": "High usage", "autopay": "Enabled",
        "next_renewal": "16 Sep", "value_score": "8.6/10", "redundancy": "Low", "pause_supported": False,
        "recommendation": "Used almost daily for backups and storage. This is a well-utilized subscription."
    },
    {
        "id": "canva", "name": "Canva", "category": "others", "category_label": "Others · Design tool",
        "icon": "C", "color": "#1CA0A0", "price": 500.0, "free": False, "used_days": 3, "last_used": "16 days ago",
        "renews_in": "6 days", "status": "low", "status_label": "Low usage", "autopay": "Enabled",
        "next_renewal": "8 Sep", "value_score": "3.2/10", "redundancy": "Low", "pause_supported": True,
        "recommendation": "Barely used this month relative to its cost. Consider pausing until you need it again.",
        "app_installed": False, "trial_days_left": 2
    }
]

@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == "u_default").first()
        if not user:
            user = User(id="u_default", name="Alex", email="alex@email.com", age_range="")
            db.add(user)
            db.commit()
            db.refresh(user)

            prefs = UserPreferences(
                user_id=user.id,
                subscription_categories="movies,music",
                movie_interests="Superhero,Action,Sci-Fi",
                content_priorities="New releases",
                music_interests="",
                music_use="",
                gaming_interests="",
                gaming_frequency="",
                other_interests="",
                monthly_budget=1000.0,
                optimization_goal="best_value",
                recommendation_priorities="",
                notification_preferences=json.dumps({"renewals":True,"trials":True,"lowUsage":True,"ghostSubscriptions":True,"budget":True,"optimization":True}),
                recommendation_settings=json.dumps({"movies":True,"music":True,"games":True,"others":True}),
                tracker_preferences=json.dumps({"usageTracking":True,"reminders":True,"personalizedRecs":True}),
                transaction_connected=False
            )
            db.add(prefs)
            db.commit()

        # Seed initial subscriptions if none exist
        existing_sub = db.query(Subscription).filter(Subscription.user_id == user.id).first()
        if not existing_sub:
            for s in INITIAL_SUBSCRIPTIONS:
                sub = Subscription(
                    id=s["id"],
                    user_id=user.id,
                    name=s["name"],
                    category=s["category"],
                    category_label=s["category_label"],
                    icon=s["icon"],
                    color=s["color"],
                    price=s["price"],
                    free=s["free"],
                    billing_cycle="monthly",
                    next_renewal=s.get("next_renewal"),
                    renews_in=s.get("renews_in"),
                    autopay=s.get("autopay", "Enabled"),
                    free_trial=s.get("trial_days_left") is not None,
                    trial_days_left=s.get("trial_days_left"),
                    app_installed=s.get("app_installed", True),
                    value_score=s.get("value_score", "7.0/10"),
                    redundancy=s.get("redundancy", "Low"),
                    pause_supported=s.get("pause_supported", False),
                    status=s.get("status", "active"),
                    status_label=s.get("status_label", "Active"),
                    recommendation=s.get("recommendation", "")
                )
                db.add(sub)
                db.flush()

                # Seed usage records
                used_days = s.get("used_days", 0)
                for d in range(used_days):
                    rec = UsageRecord(
                        subscription_id=sub.id,
                        user_id=user.id,
                        date=f"2026-08-{d+1:02d}",
                        used=True,
                        duration_minutes=45
                    )
                    db.add(rec)
            db.commit()

    finally:
        db.close()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Trackey API"}
