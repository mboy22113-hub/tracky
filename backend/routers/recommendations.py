from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Subscription, Wishlist
from ..schemas import FutureRecommendationsResponse
from ..services.recommendation_service import get_future_recommendations
from .users import get_or_create_user
from .subscriptions import to_dict

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

@router.get("", response_model=FutureRecommendationsResponse)
def get_recommendations(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    raw_interests = user.preferences.movie_interests or "Superhero,Action,Sci-Fi"
    interests = [x.strip() for x in raw_interests.split(",") if x.strip()]

    subs = db.query(Subscription).filter(Subscription.user_id == user.id).all()
    sub_dicts = [to_dict(s, db) for s in subs]

    wishlists = db.query(Wishlist).filter(Wishlist.user_id == user.id).all()
    wishlist_ids = [w.content_id for w in wishlists]

    result = get_future_recommendations(interests, sub_dicts, wishlist_ids)
    return FutureRecommendationsResponse(**result)
