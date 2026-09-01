import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserPreferences
from ..schemas import UserProfileResponse, UserProfileUpdate

router = APIRouter(prefix="/api", tags=["users"])

DEFAULT_USER_ID = "u_default"

def get_or_create_user(db: Session) -> User:
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
    if not user:
        user = User(
            id=DEFAULT_USER_ID,
            name="Alex",
            email="alex@email.com",
            age_range=""
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.preferences:
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
        db.refresh(user)
    return user

@router.get("/profile", response_model=UserProfileResponse)
@router.get("/users/me", response_model=UserProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    p = user.preferences

    def split_csv(val: str):
        return [x.strip() for x in val.split(",") if x.strip()] if val else []

    def safe_json(val: str, default: dict):
        if not val:
            return default
        try:
            return json.loads(val)
        except Exception:
            return default

    return UserProfileResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        ageRange=user.age_range or "",
        subscriptionCategories=split_csv(p.subscription_categories),
        movieInterests=split_csv(p.movie_interests),
        contentPriorities=split_csv(p.content_priorities),
        musicInterests=split_csv(p.music_interests),
        musicUse=split_csv(p.music_use),
        gamingInterests=split_csv(p.gaming_interests),
        gamingFrequency=p.gaming_frequency or "",
        otherInterests=split_csv(p.other_interests),
        monthlyBudget=p.monthly_budget,
        optimizationGoal=p.optimization_goal or "best_value",
        recommendationPriorities=split_csv(p.recommendation_priorities),
        recommendationSettings=safe_json(p.recommendation_settings, {"movies":True,"music":True,"games":True,"others":True}),
        notificationSettings=safe_json(p.notification_preferences, {"renewals":True,"trials":True,"lowUsage":True,"ghostSubscriptions":True,"budget":True,"optimization":True}),
        trackerPreferences=safe_json(p.tracker_preferences, {"usageTracking":True,"reminders":True,"personalizedRecs":True}),
        transactionConnected=p.transaction_connected
    )

@router.put("/profile", response_model=UserProfileResponse)
def update_profile(body: UserProfileUpdate, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    user.name = body.name
    user.email = body.email
    user.age_range = body.ageRange or ""

    p = user.preferences
    p.subscription_categories = ",".join(body.subscriptionCategories)
    p.movie_interests = ",".join(body.movieInterests)
    p.content_priorities = ",".join(body.contentPriorities)
    p.music_interests = ",".join(body.musicInterests)
    p.music_use = ",".join(body.musicUse)
    p.gaming_interests = ",".join(body.gamingInterests)
    p.gaming_frequency = body.gamingFrequency or ""
    p.other_interests = ",".join(body.otherInterests)
    p.monthly_budget = body.monthlyBudget
    p.optimization_goal = body.optimizationGoal
    p.recommendation_priorities = ",".join(body.recommendationPriorities)
    p.recommendation_settings = json.dumps(body.recommendationSettings)
    p.notification_preferences = json.dumps(body.notificationSettings)
    p.tracker_preferences = json.dumps(body.trackerPreferences)
    p.transaction_connected = body.transactionConnected

    db.commit()
    db.refresh(user)

    return get_profile(db)
