from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Subscription
from ..schemas import (
    OTTComparisonRequest, OTTComparisonResponse,
    UniversalComparisonRequest, UniversalComparisonResponse
)
from ..services.comparison_service import compare_ott_services, compare_universal_services
from .users import get_or_create_user
from .subscriptions import to_dict

router = APIRouter(prefix="/api/comparison", tags=["comparisons"])

@router.post("/ott", response_model=OTTComparisonResponse)
def compare_ott(body: OTTComparisonRequest = None, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    platforms = body.platforms if body else None

    subs = db.query(Subscription).filter(Subscription.user_id == user.id).all()
    sub_dicts = [to_dict(s, db) for s in subs]

    raw_interests = user.preferences.movie_interests or "Superhero,Action,Sci-Fi"
    interests = [x.strip() for x in raw_interests.split(",") if x.strip()]
    user_dict = {"movieInterests": interests}

    result = compare_ott_services(platforms, sub_dicts, user_dict)
    return OTTComparisonResponse(**result)

@router.post("/services", response_model=UniversalComparisonResponse)
def compare_services(body: UniversalComparisonRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    subs = db.query(Subscription).filter(Subscription.user_id == user.id).all()
    sub_dicts = [to_dict(s, db) for s in subs]

    user_dict = {
        "musicUse": [x.strip() for x in (user.preferences.music_use or "").split(",") if x.strip()],
        "musicInterests": [x.strip() for x in (user.preferences.music_interests or "").split(",") if x.strip()]
    }

    result = compare_universal_services(body.serviceA, body.serviceB, user_dict, sub_dicts)
    return UniversalComparisonResponse(**result)
